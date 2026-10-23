"""Compila dist/index.html a partir de src/ (plantilla, CSS, JS), los JSON de src/data (incluida cada ficha de src/data/materiales) y los logotipos.
Uso (desde cualquier carpeta):  python tools/build.py
"""
import base64, json, sys
from pathlib import Path
R = Path(__file__).resolve().parent.parent
rd = lambda p: (R / p).read_text(encoding='utf-8')
logo = lambda f: 'data:image/png;base64,' + base64.b64encode((R / 'public/assets/logos' / f).read_bytes()).decode()
js_ = lambda f: json.loads(rd('src/data/' + f))
mats = [json.loads(f.read_text(encoding='utf-8')) for f in sorted((R / 'src/data/materiales').glob('*.json'))]
order = {i: n for n, i in enumerate(i for c in js_('categorias.json') for i in c['materiales'])}
mats.sort(key=lambda m: order[m['id']])
data = json.dumps({'categorias': js_('categorias.json'), 'aplicaciones': js_('aplicaciones.json'), 'acabados': js_('acabados.json'),
                   'empresa': js_('empresa.json'), 'materiales': mats, 'proyectos': js_('proyectos.json')['proyectos'], 'cookies': js_('cookies.json')}, ensure_ascii=False).replace('</', '<\\/')
# Las rutas de imagen de los JSON son relativas a public/ (assets/...). dist/index.html las usa como ../public/assets/... (sin duplicar archivos).
# Para publicar en un servidor, sube dist/index.html y la carpeta public/assets manteniendo esa relación (o usa --prefix '').
PFX = sys.argv[sys.argv.index('--prefix') + 1] if '--prefix' in sys.argv else '../public/'
data = data.replace('"src": "assets/', '"src": "' + PFX + 'assets/').replace('"logo": "assets/', '"logo": "' + PFX + 'assets/')
h = rd('src/index.template.html').replace('/*__CSS__*/', rd('src/css/styles.css')).replace('/*__JS__*/', rd('src/js/app.js'))
h = h.replace('__DATA__', data).replace('__LOGO_FULL__', logo('logotipo-principal.png')).replace('__LOGO_ISO__', logo('isotipo.png'))
(R / 'dist').mkdir(exist_ok=True)
import sys
if '--inline' in sys.argv:  # versión autocontenida (vista previa): incrusta como data-URI solo las imágenes usadas por las fichas
    from PIL import Image; import io
    used = {x['src'] for m in mats for x in [m['imagenPrincipal']] + m['galeria'] + m['proyectosReales'] if x['estado'] == 'disponible'}
    emp = js_('empresa.json'); used |= {i['src'] for i in emp.get('imagenesQuienesSomos', [])} | {c['imagen']['src'] for c in js_('categorias.json')}
    uri = {}
    for b in emp['marcasColaboradoras']:
        if b.get('logo'): uri[b['logo']] = 'data:image/png;base64,' + base64.b64encode((R / 'public' / b['logo']).read_bytes()).decode()
    for u in sorted(used):
        im = Image.open(R / 'public' / u).convert('RGB'); im.thumbnail((1100, 1100)); bf = io.BytesIO(); im.save(bf, 'WEBP', quality=72)
        uri[u] = 'data:image/webp;base64,' + base64.b64encode(bf.getvalue()).decode()
    hi = h
    for u, d in uri.items(): hi = hi.replace(PFX + u, d)
    (R / 'dist/index.inline.html').write_text(hi, encoding='utf-8'); print('dist/index.inline.html', len(hi) // 1024, 'KB')
(R / 'dist/index.html').write_text(h, encoding='utf-8')
print('dist/index.html', len(h) // 1024, 'KB')
