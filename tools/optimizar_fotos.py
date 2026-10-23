"""Crea copias web optimizadas (WebP) de las fotos de la carpeta «proyectos».
NO modifica, renombra ni borra los originales: solo los lee.
Uso:  python tools/optimizar_fotos.py [--origen RUTA_A_LA_CARPETA_PADRE_DE_proyectos] [--max 1600] [--calidad 80]
Por defecto, la carpeta padre es la raíz del proyecto (la que contiene «proyectos/»).
Requiere:  pip install pillow
"""
import argparse, json, sys
from pathlib import Path
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = None
R = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument('--origen', default=str(R)); ap.add_argument('--max', type=int, default=1600); ap.add_argument('--calidad', type=int, default=80)
a = ap.parse_args()
inv = json.loads((R / 'src/data/proyectos.json').read_text(encoding='utf-8'))
ok = miss = 0
for f in inv['fotos']:
    src = Path(a.origen) / f['origen']; dst = R / 'public' / f['web']
    if not src.exists(): print('No encontrada:', src); miss += 1; continue
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB'); im.thumbnail((a.max, a.max), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=a.calidad, method=6); ok += 1
print(f'{ok} copias creadas en public/assets/proyectos/ · {miss} no encontradas')
sys.exit(1 if miss else 0)
