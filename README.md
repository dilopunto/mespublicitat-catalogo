# Catálogo interactivo MésPublicitat

Catálogo web de materiales de impresión publicitaria (6 categorías, 36 fichas). HTML, CSS y JavaScript sin dependencias de ejecución; toda la información está en JSON y el código solo la muestra.

> Repositorio privado. Contiene fotografías de proyectos de clientes: no lo hagas público sin revisar las autorizaciones.

## Instalación y ejecución

Requisitos: Python 3.10+.

```bash
pip install -r requirements.txt        # jsonschema y Pillow
python tools/validate.py               # valida JSON, esquema y rutas de imagen
python tools/build.py                  # genera dist/index.html
python -m http.server 8080             # desde la raíz del proyecto
# abre http://localhost:8080/dist/index.html
```

`dist/index.html` enlaza las imágenes como `../public/assets/...`; para publicarlo en un servidor sube `dist/` y `public/` manteniendo esa relación (o usa `python tools/build.py --prefix ''` si las pones junto al HTML).
`python tools/build.py --inline` crea además `dist/index.inline.html` (una sola pieza con imágenes incrustadas, solo para vista previa; no se versiona).

## Publicación en Netlify

`netlify.toml` ya está configurado: comando `python3 tools/build.py --site` y carpeta de publicación `site/` (index.html + assets/, autocontenida y sin rutas `../`). La web usa rutas con `#`, así que no hay páginas internas que den 404; cualquier ruta desconocida vuelve a `index.html`. Cada push a `main` publica automáticamente. Para probar en local: `python3 tools/build.py --site && python3 -m http.server 8080 -d site`.

## Cookies

La web no usa cookies. Guarda la elección del usuario en `localStorage` (clave `mp-cookies`). Las tipografías de Google Fonts solo se cargan si el usuario las acepta. Texto y datos de la política en `src/data/cookies.json`; el banner y su lógica están en `src/js/app.js`. El usuario puede cambiar su elección desde «Configurar cookies» en el pie de página.

## Estructura

```
CLAUDE MESPUBLICITAT PORTAFOLIO/
├─ 00_Manual_de_Marca_MesPublicitat.pdf   Manual de identidad visual
├─ README.md  ·  requirements.txt  ·  .gitignore
├─ docs/                                   Estado, pendientes y borrador de privacidad
├─ dist/
│  └─ index.html                           Web compilada (un solo archivo)
├─ src/
│  ├─ index.template.html                  Estructura de la página
│  ├─ css/styles.css                       Estilos y animaciones
│  ├─ js/app.js                            Navegación, buscador, filtros y fichas
│  └─ data/
│     ├─ empresa.json                      Datos de empresa, servicios, proceso y cifras
│     ├─ categorias.json                   6 categorías y el orden de sus materiales
│     ├─ aplicaciones.json                 Aplicaciones del filtro
│     ├─ acabados.json                     18 acabados
│     ├─ material.schema.json              Esquema que valida cada ficha
│     ├─ pendiente-validacion.json         Datos por confirmar
│     └─ materiales/                       36 fichas, una por material (<slug>.json)
├─ public/assets/
│  ├─ logos/                               isotipo.png y logotipo-principal.png (originales)
│  └─ materiales/<slug>/                   Fotografías de cada material (ver LEEME.md)
└─ tools/
   ├─ build.py                             Compila dist/index.html
   └─ validate.py                          Valida JSON y referencias
```

## Cómo modificar un material

1. Abre `src/data/materiales/<slug>.json` y cambia el texto, la imagen o los datos.
2. `python tools/validate.py` (requiere `pip install jsonschema`).
3. `python tools/build.py` y abre `dist/index.html`.

Para añadir un material: crea su JSON, añade su ID en `categorias.json` y ejecuta los dos comandos.

## Regla de datos

El formulario de Contacto no envía datos a ningún servidor: prepara un correo (`mailto:`) a `contacto.emailDestinoFormulario` de `empresa.json`.

Un dato desconocido es `null` y se muestra como "Pendiente de confirmar". No se inventan espesores, duraciones, certificados ni precios. La lista de pendientes está en `src/data/pendiente-validacion.json`.

## Estado

- Fases 1 a 5 entregadas. Quedan pendientes los datos listados en `docs/PENDIENTES_POR_CONFIRMAR.md` (privacidad, datos técnicos de proveedores y sustitución de dos ilustraciones con texto ficticio).
- Fotografías de proyectos reales: solo se versionan las clasificadas como claras y autorizadas. Las descartadas o por confirmar no se incluyen en el repositorio.
