import re,zlib,sys
b=open(sys.argv[1],'rb').read()
objs={int(m.group(1)):m.group(2) for m in re.finditer(rb'(?<!\d)(\d+) 0 obj(.*?)endobj',b,re.S)}
def _exp():
    for n,o in list(objs.items()):
        if b'/ObjStm' in o[:300]:
            m=re.search(rb'stream\r?\n(.*?)endstream',o,re.S)
            try: d=zlib.decompress(m.group(1))
            except Exception: continue
            N=int(re.search(rb'/N\s+(\d+)',o).group(1)); F=int(re.search(rb'/First\s+(\d+)',o).group(1))
            h=list(map(int,d[:F].split()))
            offs=[(h[2*i],h[2*i+1]) for i in range(N)]
            for i,(num,off) in enumerate(offs):
                end=offs[i+1][1] if i+1<N else len(d)-F
                objs.setdefault(num,d[F+off:F+end])
def stream(o):
    m=re.search(rb'stream\r?\n(.*?)endstream',o,re.S)
    if not m: return None
    try: return zlib.decompress(m.group(1))
    except Exception: return None
def cmap(n):
    o=objs.get(n,b''); t=re.search(rb'/ToUnicode\s+(\d+) 0 R',o)
    if not t: return {}
    s=stream(objs[int(t.group(1))]) or b''
    mp={}
    for bf in re.findall(rb'beginbfchar(.*?)endbfchar',s,re.S):
        for a,u in re.findall(rb'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>',bf):
            mp[int(a,16)]=bytes.fromhex(u.decode()).decode('utf-16-be','ignore')
    for bf in re.findall(rb'beginbfrange(.*?)endbfrange',s,re.S):
        for a,e,u in re.findall(rb'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>',bf):
            a=int(a,16);e=int(e,16);u=int(u,16)
            for i in range(a,e+1): mp[i]=chr(u+i-a)
    return mp
def fonts(res):
    d={}
    m=re.search(rb'/Font\s*(<<.*?>>|(\d+) 0 R)',res,re.S)
    if not m: return d
    body=m.group(1)
    if m.group(2): body=objs.get(int(m.group(2)),b'')
    for nm,o in re.findall(rb'/(\w+)\s+(\d+) 0 R',body): d[nm]=cmap(int(o))
    return d
_exp()

def unesc(b):
    r=bytearray();i=0
    while i<len(b):
        c=b[i]
        if c==92:
            i+=1;c=b[i]
            m={110:10,114:13,116:9,98:8,102:12}
            if c in m: r.append(m[c])
            elif 48<=c<=55:
                j=i;v=0
                while j<len(b) and j<i+3 and 48<=b[j]<=55: v=v*8+b[j]-48;j+=1
                r.append(v&255);i=j-1
            else: r.append(c)
        else: r.append(c)
        i+=1
    return bytes(r)
def pagelist():
    return sorted(n for n,o in objs.items() if re.search(rb'/Type\s*/Page(?!s)',o))
def getres(o):
    r=re.search(rb'/Resources\s+(\d+) 0 R',o)
    if r: return objs.get(int(r.group(1)),b'')
    if b'/Resources' in o: return o
    p=re.search(rb'/Parent\s+(\d+) 0 R',o)
    return getres(objs[int(p.group(1))]) if p else b''
def fontmap(res):
    d={}
    m=re.search(rb'/Font\s*<<(.*?)>>',res,re.S)
    body=m.group(1) if m else b''
    m2=re.search(rb'/Font\s+(\d+) 0 R',res)
    if m2: body=objs.get(int(m2.group(1)),b'')
    for nm,n in re.findall(rb'/(\w+)\s+(\d+) 0 R',body): d[nm]=cmap(int(n))
    return d

def litdec(cur,b):
    # Literale string: twee bytes per teken als de font-tabel codes boven 255 heeft
    if cur and max(cur)>255:
        return ''.join(cur.get(int.from_bytes(b[i:i+2],'big'),'') for i in range(0,len(b)-1,2))
    return ''.join(cur.get(ch,chr(ch)) if cur else chr(ch) for ch in b)
def hexdec(cur,h):
    h=h.decode()
    if len(h)%2: h+='0'
    step=4 if cur and max(cur)>255 else 2
    return ''.join(cur.get(int(h[i:i+step],16),'') for i in range(0,len(h),step))
out=[]
for n in pagelist():
    o=objs[n]; fm=fontmap(getres(o))
    c=re.search(rb'/Contents\s*(\[.*?\]|\d+ 0 R)',o,re.S)
    ids=[int(x) for x in re.findall(rb'(\d+) 0 R',c.group(1))] if c else []
    st=b'\n'.join((stream(objs[i]) or b'') for i in ids if i in objs)
    cur={};buf=[]
    for tok in re.finditer(rb'/(\w+)\s+[\d.]+\s+Tf|(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+Tm|\[((?:[^\]\\]|\\.)*)\]\s*TJ|\(((?:[^)\\]|\\.)*)\)\s*Tj|<([0-9A-Fa-f]+)>\s*Tj|(-?[\d.]+)\s+(-?[\d.]+)\s+Td|\bET\b',st,re.S):
        if tok.group(1): cur=fm.get(tok.group(1),{});continue
        if tok.group(2): buf.append('\n');continue
        if tok.group(11):
            if abs(float(tok.group(12)))>1: buf.append('\n')
            else: buf.append(' ' if float(tok.group(11))>0 and False else '')
            continue
        if tok.group(8) is not None:
            for lit,hx,k in re.findall(rb'\(((?:[^)\\]|\\.)*)\)|<([0-9A-Fa-f]+)>|(-?\d+\.?\d*)',tok.group(8)):
                if k: buf.append(' ' if float(k)<-250 else '')
                elif hx: buf.append(hexdec(cur,hx))
                else:
                    buf.append(litdec(cur,unesc(lit)))
        elif tok.group(9) is not None:
            buf.append(litdec(cur,unesc(tok.group(9))))
        elif tok.group(10): buf.append(hexdec(cur,tok.group(10)))
        else: buf.append('\n')
    txt=''.join(buf); txt=re.sub(r'\n+','\n',txt)
    out.append('\n=== page %d ===\n'%(len(out)+1)+txt)
print('\n'.join(out))
