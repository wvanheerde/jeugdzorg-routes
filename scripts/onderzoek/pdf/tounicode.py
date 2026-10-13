import re,zlib,sys
b=open(sys.argv[1],'rb').read()
objs={int(m.group(1)):m.group(2) for m in re.finditer(rb'(?<!\d)(\d+) 0 obj(.*?)endobj',b,re.S)}
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
out=[]
pages=[(n,o) for n,o in objs.items() if re.search(rb'/Type\s*/Page(?!s)',o)]
pages.sort()
for n,o in pages:
    r=re.search(rb'/Resources\s+(\d+) 0 R',o)
    res=objs.get(int(r.group(1)),b'') if r else o
    fm=fonts(res)
    c=re.search(rb'/Contents\s*(\[.*?\]|\d+ 0 R)',o,re.S)
    ids=[int(x) for x in re.findall(rb'(\d+) 0 R',c.group(1))] if c else []
    s=b'\n'.join((stream(objs[i]) or b'') for i in ids)
    cur={}; line=[]
    for tok in re.finditer(rb'/(\w+)\s+[\d.]+\s+Tf|\[((?:[^\]\\]|\\.)*)\]\s*TJ|<([0-9A-Fa-f]+)>\s*Tj|(Td|TD|T\*|ET)\b|(\d+\.?\d*)\s+(-?\d+\.?\d*)\s+Td',s,re.S):
        if tok.group(1): cur=fm.get(tok.group(1),{}); continue
        def dec(h):
            h=h.decode(); step=4 if cur and max(cur,default=0)>255 else 2
            return ''.join(cur.get(int(h[i:i+step],16),'') for i in range(0,len(h),step))
        if tok.group(2) is not None:
            for h,k in re.findall(rb'<([0-9A-Fa-f]+)>|(-?\d+\.?\d*)',tok.group(2)):
                line.append(dec(h) if h else (' ' if float(k)<-250 else ''))
        elif tok.group(3): line.append(dec(tok.group(3)))
        elif tok.group(4)==b'ET': line.append('\n')
        elif tok.group(4): line.append(' ')
    out.append(''.join(line))
print('\n'.join(out))
