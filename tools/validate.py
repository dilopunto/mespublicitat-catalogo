"""Valida los JSON del catálogo: esquema + referencias cruzadas.  Uso: python tools/validate.py
Requiere:  pip install jsonschema
"""
import json, sys
from pathlib import Path
R = Path(__file__).resolve().parent.parent
D = R / 'src/data'
load = lambda p: json.loads(p.read_text(encoding='utf-8'))
errs = []
try:
    from jsonschema import Draft202012Validator
except ImportError:
    sys.exit('Falta jsonschema:  pip install jsonschema')
schema = load(D / 'material.schema.json')
val = Draft202012Validator(schema)
cats, apps, acs = load(D / 'categorias.json'), load(D / 'aplicaciones.json'), load(D / 'acabados.json')
cat_ids, app_ids, ac_ids = {c['id'] for c in cats}, {a['id'] for a in apps}, {a['id'] for a in acs}
mats = {}
for f in sorted((D / 'materiales').glob('*.json')):
    m = load(f)
    for e in val.iter_errors(m): errs.append(f'{f.name}: {"/".join(map(str, e.path))}: {e.message}')
    if m.get('slug') != f.stem: errs.append(f'{f.name}: el slug no coincide con el nombre del archivo')
    if m.get('id') in mats: errs.append(f'{f.name}: id duplicado {m["id"]}')
    mats[m.get('id')] = m
for m in mats.values():
    n = m['slug']
    if m['categoria'] not in cat_ids: errs.append(f'{n}: categoría inexistente')
    for a in m['aplicaciones']:
        if a not in app_ids: errs.append(f'{n}: aplicación inexistente {a}')
    for a in m['acabadosCompatibles']:
        if a not in ac_ids: errs.append(f'{n}: acabado inexistente {a}')
    for r in m['relacionados']:
        if r not in mats: errs.append(f'{n}: relacionado inexistente {r}')
        if r == m['id']: errs.append(f'{n}: se relaciona consigo mismo')
proy = load(D / 'proyectos.json'); proy_ids = {p['id'] for p in proy['proyectos']}
webs = [f['web'] for f in proy['fotos']]
if len(webs) != len(set(webs)): errs.append('proyectos.json: rutas web duplicadas')
for f in proy['fotos']:
    if f['proyecto'] not in proy_ids: errs.append(f"{f['id']}: proyecto inexistente")
    if f['clasificacion'] == 'clara' and not (R / 'public' / f['web']).exists(): errs.append(f"{f['id']}: falta la copia web {f['web']} (ejecuta tools/optimizar_fotos.py)")
    if f['clasificacion'] == 'por-confirmar' and f['materiales']: errs.append(f"{f['id']}: foto por confirmar con materiales asignados")
used = {}
for m in mats.values():
    imgs = [m['imagenPrincipal']] + m['galeria'] + m['proyectosReales']
    for x in imgs:
        if x['estado'] == 'disponible':
            if not (R / 'public' / x['src']).exists(): errs.append(f"{m['slug']}: imagen inexistente {x['src']}")
            if x['origen'] == 'pendiente': errs.append(f"{m['slug']}: imagen disponible con origen pendiente")
            if x['src'] in used and used[x['src']] != m['slug']: errs.append(f"{m['slug']}: imagen repetida en otro material ({used[x['src']]}): {x['src']}")
            used[x['src']] = m['slug']
            if x['src'].startswith('assets/proyectos/'):
                f = next((f for f in proy['fotos'] if f['web'] == x['src']), None)
                if not f: errs.append(f"{m['slug']}: {x['src']} no está en proyectos.json")
                elif f['clasificacion'] not in ('clara','provisional') or m['slug'] not in f['materiales']: errs.append(f"{m['slug']}: {x['src']} no está clasificada como {m['slug']}")
        elif x['origen'] != 'pendiente': errs.append(f"{m['slug']}: imagen pendiente con origen {x['origen']}")
    for x in m['proyectosReales']:
        if x['proyecto'] not in proy_ids: errs.append(f"{m['slug']}: proyecto inexistente {x['proyecto']}")
listed = [i for c in cats for i in c['materiales']]
if sorted(listed) != sorted(mats): errs.append('categorias.json y materiales/ no coinciden')
for c in cats:
    for i in c['materiales']:
        if i in mats and mats[i]['categoria'] != c['id']: errs.append(f'{i}: categoría distinta en categorias.json')
print(f'{len(mats)} materiales · {len(cats)} categorías · {len(apps)} aplicaciones · {len(acs)} acabados')
if errs: print('\n'.join(errs)); sys.exit(1)
print('Validación correcta: esquema y referencias sin errores.')
