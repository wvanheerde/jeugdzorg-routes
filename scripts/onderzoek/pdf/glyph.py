# Hex-codes van twee bytes zonder bruikbare ToUnicode-tabel. Twee varianten, herkend aan de spatie:
# - spatie is 0003: glyph-nummers in standaard TrueType-volgorde ("Microsoft: Print To PDF");
#   teken = nummer + 29, letters buiten ASCII (é, ë) vallen weg;
# - spatie is 0020: de codes zijn gewoon Unicode (UTF-16), zoals in sommige rekenkamerrapporten.
import re,zlib,sys,collections
b=open(sys.argv[1],'rb').read()
blokken=[]
for m in re.finditer(rb'stream\r?\n',b):
    e=b.find(b'endstream',m.end())
    try: d=zlib.decompress(b[m.end():e])
    except Exception: continue
    for blk in re.findall(rb'BT(.*?)ET',d,re.S):
        blokken.append([[int(h[i:i+4],16) for i in range(0,len(h)-3,4)] for h in re.findall(rb'<([0-9A-Fa-f]{4,})>',blk)])
tel=collections.Counter(n for blk in blokken for codes in blk for n in codes)
glyph=tel[3]>tel[32]
def teken(n):
    if glyph: return chr(n+29) if 3<=n<=93 else ''
    return chr(n) if n>=32 and not 0xD800<=n<=0xDFFF else ''
print('\n'.join(''.join(''.join(teken(n) for n in codes) for codes in blk) for blk in blokken))
