import re,zlib,sys
b=open(sys.argv[1],'rb').read()
out=[]
for m in re.finditer(rb'stream\r?\n(.*?)endstream',b,re.S):
    try: d=zlib.decompress(m.group(1))
    except Exception: continue
    if b'BT' not in d: continue
    for t in re.findall(rb'\[((?:\\.|[^\]\\])*)\]\s*TJ|\(((?:\\.|[^\\)])*)\)\s*Tj',d):
        if t[0]:
            s=b''.join(re.findall(rb'\(((?:\\.|[^\\)])*)\)',t[0]))
            kern=t[0]
        else: s=t[1]
        out.append(s.decode('latin1'))
    out.append('\n')
print(''.join(out)[:int(sys.argv[2])])
