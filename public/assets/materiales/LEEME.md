# Fotografías de materiales

Cada material tiene su carpeta con su `slug` (el mismo nombre que su JSON en `src/data/materiales/`):

```
public/assets/materiales/<slug>/principal.webp
public/assets/materiales/<slug>/galeria-1-material.webp
public/assets/materiales/<slug>/galeria-2-proceso.webp
public/assets/materiales/<slug>/galeria-3-resultado.webp
```

- Las rutas exactas están en `imagenPrincipal.src` y `galeria[].src` de cada JSON. Si usas otro nombre o formato (jpg, png), cambia la ruta en el JSON.
- La maqueta usa proporción 4:3.
- Mientras un archivo no exista, la web muestra "Foto pendiente".
- Qué debe verse en cada foto: campo `referenciaVisual` de cada JSON.
- Usa solo fotografías propias o con licencia. No las atribuyas a trabajos reales de MésPublicitat si no lo son.
- Después de añadir imágenes, ejecuta `python tools/build.py` y copia la carpeta `public/assets/materiales` junto a `dist/index.html` al publicar.

## Fotos reales de proyectos (Fase 3b)
- Originales: carpeta `proyectos/` (solo lectura: nunca se modifican, renombran ni borran).
- Copias web optimizadas: `public/assets/proyectos/<proyecto>/NN.webp` (se regeneran con `python tools/optimizar_fotos.py`).
- Inventario y clasificación de cada foto: `src/data/proyectos.json` (`clasificacion`: `clara` o `por-confirmar`).
- Las fichas enlazan estas rutas en `imagenPrincipal`, `galeria` y `proyectosReales`. Campo `origen`: `propia` | `referencia` | `ia` | `pendiente`. Campo `foco`: encuadre dentro de la caja 4:3.
- Una foto solo puede usarse en un material si está clasificada como `clara` para ese material (lo comprueba `tools/validate.py`).
