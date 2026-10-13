import fs from 'fs'; import crypto from 'crypto';
const [,, inp, outp] = process.argv;
const b = fs.readFileSync(inp);
const s = b.toString('latin1');
const i = s.indexOf('/Filter/Standard');
const ue = (()=>{ const j=s.indexOf('/UE(',i)+4; return j; })();
function readStr(start){ // PDF literal string with escapes
  const out=[]; let k=start; 
  while(true){ const c=s.charCodeAt(k);
    if(c===0x5c){ const n=s[k+1];
      const map={n:10,r:13,t:9,b:8,f:12,'(':40,')':41,'\\':92};
      if(n in map){out.push(map[n]);k+=2;}
      else if(/[0-7]/.test(n)){ let o=n,m=2,q=k+2; while(m--&&/[0-7]/.test(s[q])){o+=s[q];q++;} out.push(parseInt(o,8)&255);k=q;}
      else if(n==='\r'){k+=2; if(s[k]==='\n')k++;} else if(n==='\n'){k+=2;} else {out.push(n.charCodeAt(0));k+=2;}
    } else if(c===0x29){ break;} else {out.push(c);k++;}
  }
  return Buffer.from(out);
}
const U = readStr(s.indexOf('/U(',i)+3), UE = readStr(ue);
const keySalt = U.subarray(40,48);
function hash2B(pw, salt, udata){
  let K = crypto.createHash('sha256').update(Buffer.concat([pw,salt,udata])).digest();
  let r=0;
  while(true){
    const K1 = Buffer.concat(Array(64).fill(Buffer.concat([pw,K,udata])));
    const c = crypto.createCipheriv('aes-128-cbc',K.subarray(0,16),K.subarray(16,32)); c.setAutoPadding(false);
    const E = Buffer.concat([c.update(K1),c.final()]);
    let sum=0; for(let q=0;q<16;q++) sum+=E[q];
    const alg=['sha256','sha384','sha512'][sum%3];
    K = crypto.createHash(alg).update(E).digest();
    r++;
    if(r>=64 && E[E.length-1] <= r-32) break;
  }
  return K.subarray(0,32);
}
const pw=Buffer.alloc(0);
// verify
const vh = hash2B(pw, U.subarray(32,40), Buffer.alloc(0));
console.error('user pw valid:', vh.equals(U.subarray(0,32)));
const ik = hash2B(pw, keySalt, Buffer.alloc(0));
const d0 = crypto.createDecipheriv('aes-256-cbc', ik, Buffer.alloc(16)); d0.setAutoPadding(false);
const fk = Buffer.concat([d0.update(UE.subarray(0,32)), d0.final()]);
function dec(buf){
  if(buf.length<32) return buf;
  const iv=buf.subarray(0,16); let data=buf.subarray(16); data=data.subarray(0,data.length-(data.length%16));
  const d=crypto.createDecipheriv('aes-256-cbc',fk,iv); d.setAutoPadding(false);
  let o=Buffer.concat([d.update(data),d.final()]);
  const p=o[o.length-1]; if(p>=1&&p<=16) o=o.subarray(0,o.length-p);
  return o;
}
// replace streams
const parts=[]; let last=0; let n=0;
const re=/stream(\r\n|\n|\r)/g; let m;
while((m=re.exec(s))){
  const st=m.index+m[0].length; const en=s.indexOf('endstream',st); if(en<0)break;
  if(m.index>0 && s.slice(m.index-3,m.index)==='end'){continue;}
  let e=en; if(s[e-1]==='\n'){e--; if(s[e-1]==='\r')e--;} else if(s[e-1]==='\r') e--;
  parts.push(b.subarray(last,st)); 
  try{ parts.push(dec(b.subarray(st,e))); n++;}catch(x){ parts.push(b.subarray(st,e)); }
  last=e; re.lastIndex=en;
}
parts.push(b.subarray(last));
fs.writeFileSync(outp, Buffer.concat(parts)); console.error('streams',n);
