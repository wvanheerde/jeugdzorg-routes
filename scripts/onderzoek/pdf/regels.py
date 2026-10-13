import re,zlib,sys
b=open(sys.argv[1],'rb').read()
objs={int(m.group(1)):m.group(2) for m in re.finditer(rb'(?<!\d)(\d+) 0 obj(.*?)endobj',b,re.S)}
def stream(o):
    m=re.search(rb'stream\r?\n(.*?)endstream',o,re.S)
    if not m: return None
    d=m.group(1)
    try: return zlib.decompress(d)
    except Exception:
        try: return zlib.decompressobj().decompress(d)
        except Exception: return None
def cmap(n):
    o=objs.get(n,b''); t=re.search(rb'/ToUnicode\s+(\d+) 0 R',o)
    if not t: return None
    s=stream(objs.get(int(t.group(1)),b"")) or b""
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
    for nm,o in re.findall(rb'/(\w+)\s+(\d+) 0 R',body):
        fo=objs.get(int(o),b'')
        d[nm]=(cmap(int(o)), b'Identity-H' in fo)
    return d
def unesc(s):
    out=bytearray();i=0
    while i<len(s):
        c=s[i]
        if c==92:
            i+=1;d=s[i:i+1]
            if d in b'nrtbf': out+={b'n':b'\n',b'r':b'\r',b't':b'\t',b'b':b'\b',b'f':b'\f'}[d]
            elif d.isdigit():
                m=re.match(rb'[0-7]{1,3}',s[i:]);out.append(int(m.group(0),8)&255);i+=len(m.group(0))-1
            else: out+=d
        else: out.append(c)
        i+=1
    return bytes(out)
def dec(raw,f):
    cm,two=f
    if cm is None: return raw.decode('cp1252','ignore')
    if two or (cm and max(cm)>255):
        return ''.join(cm.get(int.from_bytes(raw[i:i+2],'big'),'') for i in range(0,len(raw)-1,2))
    return ''.join(cm.get(c,chr(c)) for c in raw)
pages=sorted((n,o) for n,o in objs.items() if re.search(rb'/Type\s*/Page(?!s)',o))
tok=re.compile(rb'/(\w+)\s+[\d.]+\s+Tf|\[((?:[^\]\\]|\\.)*)\]\s*TJ|((?:\((?:[^()\\]|\\.)*\))|<[0-9A-Fa-f]+>)\s*Tj|([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+Tm|([\d.\-]+)\s+([\d.\-]+)\s+T[dD]',re.S)
strs=re.compile(rb'\(((?:[^()\\]|\\.)*)\)|<([0-9A-Fa-f]+)>|(-?\d+\.?\d*)',re.S)
for pn,(n,o) in enumerate(pages,1):
    r=re.search(rb'/Resources\s+(\d+) 0 R',o)
    res=objs.get(int(r.group(1)),b'') if r else o
    fm=fonts(res); f=(None,False)
    c=re.search(rb'/Contents\s*(\[.*?\]|\d+ 0 R)',o,re.S)
    ids=[int(x) for x in re.findall(rb'(\d+) 0 R',c.group(1))] if c else []
    s=b'\n'.join((stream(objs[i]) or b'') for i in ids if i in objs)
    lasty=None;line=[];out=[]
    def flush():
        global line
        if line: out.append(''.join(line)); line=[]
    for t in tok.finditer(s):
        if t.group(1): f=fm.get(t.group(1),(None,False)); continue
        if t.group(4):
            y=float(t.group(9))
            if lasty is None or abs(y-lasty)>2: flush()
            else: line.append(' ')
            lasty=y; continue
        if t.group(10):
            y=float(t.group(11))
            if abs(y)>2: flush()
            else: line.append(' ')
            continue
        if t.group(2) is not None:
            for lit,hx,k in strs.findall(t.group(2)):
                if lit or (not hx and not k and False): line.append(dec(unesc(lit),f))
                elif hx: line.append(dec(bytes.fromhex(hx.decode()),f))
                elif k and float(k)<-200: line.append(' ')
            # literal empty strings ignored
        elif t.group(3):
            x=t.group(3)
            line.append(dec(unesc(x[1:-1]),f) if x[:1]==b'(' else dec(bytes.fromhex(x[1:-1].decode()),f))
    flush()
    print('=== page %d ==='%pn); print('\n'.join(out))
