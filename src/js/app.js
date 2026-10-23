document.documentElement.classList.add('js');
const LOGO={full:"__LOGO_FULL__",iso:"__LOGO_ISO__"};
document.querySelectorAll('[data-logo]').forEach(i=>i.src=LOGO[i.dataset.logo]);
const {categorias:CATS,materiales:MATS,aplicaciones:APPS,acabados:ACS,empresa:EMP,proyectos:PROYS=[],cookies:CK}=window.CATALOGO;
const PBYID=Object.fromEntries(PROYS.map(p=>[p.id,p.nombre]));
const ABYID=Object.fromEntries(ACS.map(a=>[a.id,a]));
const MBYID=Object.fromEntries(MATS.map(m=>[m.id,m])),CBYID=Object.fromEntries(CATS.map(c=>[c.id,c])),APPN=Object.fromEntries(APPS.map(a=>[a.id,a.nombre]));
const ARW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
cats.innerHTML=CATS.map((c,i)=>`<a class="card rv" style="--d:${(i%3)*.08}s" href="#materiales/${c.slug}"><div class="media"><img src="${c.imagen.src}" alt="${c.imagen.alt}" loading="lazy"><span class="otag o-ia">Imagen ilustrativa</span></div><div class="body"><h3>${c.nombre}${ARW}</h3><p>${c.descripcion}</p><ul>${c.materiales.map(id=>`<li>${MBYID[id].nombre}</li>`).join('')}</ul></div></a>`).join('');
svc.innerHTML=EMP.servicios.map((s,i)=>`<div class="svc rv" style="--d:${i*.08}s"><h3>${s.nombre}</h3><p>${s.texto}</p></div>`).join('');
steps.innerHTML=EMP.proceso.map((s,i)=>`<div class="step rv" style="--d:${i*.08}s"><b>0${i+1}</b><h3>${s.nombre}</h3><p>${s.texto}</p></div>`).join('');
figs.innerHTML=[[EMP.cifras.anosExperiencia,"Años de experiencia"],[EMP.cifras.proyectosRealizados,"Proyectos realizados",'+'],[EMP.cifras.clientes,"Clientes",'+']].map((f,i)=>`<div class="fig rv" style="--d:${i*.08}s"><b ${f[0]?`data-count="${f[0]}" data-pre="${f[2]||''}">0`:'>—'}</b><span>${f[1]}</span></div>`).join('');
brands.innerHTML=EMP.marcasColaboradoras.length?EMP.marcasColaboradoras.map(b=>`<div class="logo-cli">${b.logo?`<img src="${b.logo}" alt="${b.nombre}" loading="lazy">`:b.nombre}</div>`).join(''):Array.from({length:6},()=>'<div class="slot">Logo por añadir</div>').join('');
/* router */
const ROUTES={inicio:1,cookies:1,'quienes-somos':1,materiales:1,material:1,aplicaciones:1,acabados:1,contacto:1};
const navA=[...document.querySelectorAll('nav a')];
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const S={q:'',cat:'',app:''};
function crumbs(){mCrumb.innerHTML=S.cat?`<a href="#inicio">Inicio</a><i>/</i><a href="#materiales">Materiales</a><i>/</i><span aria-current="page">${CBYID[S.cat].nombre}</span>`:`<a href="#inicio">Inicio</a><i>/</i><span aria-current="page">Materiales</span>`}
function chips(){const mk=(list,cur,k)=>[['','Todas'],...list].map(([id,n])=>`<button type="button" class="chip" data-${k}="${id}" aria-pressed="${cur===id}">${n}</button>`).join('');
mCats.innerHTML=mk(CATS.map(c=>[c.id,c.nombre]),S.cat,'cat');mApps.innerHTML=mk(APPS.map(a=>[a.id,a.nombre]),S.app,'app')}
const FOC=im=>im.foco==='contain'?'class="fit"':`style="object-position:${im.foco}"`;
function card(m,cl,k){const c=CBYID[m.categoria];return `<a class="mcard ${cl}" style="--d:${(k%3)*.08}s" href="#material/${m.slug}"><div class="media"><div class="ph" aria-hidden="true"><b>${String(c.materiales.indexOf(m.id)+1).padStart(2,'0')}</b><small>Foto pendiente</small></div><img src="${m.imagenPrincipal.src}" alt="${m.imagenPrincipal.alt}" ${FOC(m.imagenPrincipal)} width="800" height="600" loading="lazy" onerror="this.remove()"></div><div class="body"><h3>${m.nombre}${ARW}</h3><p>${m.aplicaciones.map(a=>APPN[a]).join(', ')}</p></div></a>`}
function renderM(anim){
const toks=norm(S.q).split(/\s+/).filter(Boolean);
const list=MATS.filter(m=>(!S.cat||m.categoria===S.cat)&&(!S.app||m.aplicaciones.includes(S.app))&&toks.every(t=>norm([m.nombre,m.resumen,CBYID[m.categoria].nombre,...m.aplicaciones.map(a=>APPN[a])].join(' ')).includes(t)));
const on=!!(S.q.trim()||S.cat||S.app),cl=anim?'pop':'rv';
mCount.textContent=`${list.length} de ${MATS.length} materiales`;mReset.hidden=!on;mClear.hidden=!S.q;
if(!list.length){mList.innerHTML=`<div class="empty"><h2>Sin resultados</h2><p>No encontramos materiales con esa búsqueda y esos filtros. Prueba con otra palabra o quita algún filtro.</p><button class="btn ghost" type="button" data-reset>Quitar filtros</button></div>`;return}
let k=0;mList.innerHTML=CATS.map(c=>{const ms=list.filter(m=>m.categoria===c.id);if(!ms.length)return'';
return `<div class="mcat" id="cat-${c.slug}"><header class="${cl}"><div><h2>${c.nombre}</h2><p>${c.descripcion}</p></div><span>${ms.length} ${ms.length===1?'material':'materiales'}</span></header><div class="grid">${ms.map(m=>card(m,cl,k++)).join('')}</div></div>`}).join('');
if(!anim)observe()}
/* ficha de material (se genera desde src/data/materiales/<slug>.json) */
const IC={sol:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',gota:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',escudo:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',ligero:'<path d="M20 4c-9 0-14 5-14 14M20 4c0 9-5 14-14 14M6 18L16 8"/>',capa:'<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>',tijera:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8l11 9M8.5 16l11-9"/>',regla:'<path d="M3 15L15 3l6 6L9 21z"/><path d="M8 10l2 2M11 7l2 2M5 13l2 2"/>',pincel:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',reloj:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',plegable:'<path d="M3 6l6 2 6-2 6 2v12l-6-2-6 2-6-2z"/><path d="M9 8v12M15 6v12"/>',rigido:'<rect x="4" y="4" width="16" height="16"/>',check:'<path d="M5 12l5 5L20 7"/>',textil:'<path d="M8 3L3 7l3 3 2-1v12h8V9l2 1 3-3-5-4a4 4 0 0 1-8 0z"/>',ojo:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',escala:'<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/>'};
const ico=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||IC.check}</svg>`;
const ul=a=>`<ul class="flist">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const fsec=(t,body)=>`<div class="fsec rv"><h2>${t}</h2><div class="fbody">${body}</div></div>`;
const PEND='<span class="pend">Pendiente de confirmar</span>';
const TAG={propia:'Proyecto real',referencia:'Foto de muestra',ia:'Imagen ilustrativa'};
const imgBox=(im,num,label)=>`<div class="media"><div class="ph" aria-hidden="true"><b>${num}</b><small>${label}</small></div><img src="${im.src}" alt="${im.alt}" ${FOC(im)} loading="lazy" onerror="this.remove()">${im.estado==='disponible'&&TAG[im.origen]?`<span class="otag o-${im.origen}">${TAG[im.origen]}</span>`:''}</div>`;
function usoHTML(t,u){const v=u.apto===true?'Sí':u.apto===false?'No recomendado':'Por confirmar';return `<div class="uso"><h3>${t}</h3><b class="${u.apto===true?'ok':u.apto===false?'no':'pend'}">${v}</b><p>${u.nota}</p></div>`}
function renderFicha(m){const c=CBYID[m.categoria],num=String(c.materiales.indexOf(m.id)+1).padStart(2,'0');
const gf=m.grosoresFormatos,fmt=gf.formatosEstandar?gf.formatosEstandar.map(f=>`${f.nombre}: ${f.medida}`).join(' · '):null;
const tec=[['Composición',m.composicion.descripcion,m.composicion.estado],...m.caracteristicasTecnicas.map(t=>[t.etiqueta,t.valor,t.estado])];
if(fmt)tec.push(['Formatos estándar de referencia',fmt,'referencia']);
const rel=m.relacionados.map(id=>MBYID[id]);
fichaRoot.innerHTML=`<div class="fhead"><div class="wrap">
<nav class="crumbs" aria-label="Migas de pan"><a href="#inicio">Inicio</a><i>/</i><a href="#materiales">Materiales</a><i>/</i><a href="#materiales/${c.slug}">${c.nombre}</a><i>/</i><span aria-current="page">${m.nombre}</span></nav>
<div class="fgrid"><div><h1 class="rv">${m.nombre}</h1><p class="lead rv" style="--d:.1s">${m.resumen}</p>
<p class="tags rv" style="--d:.15s">${m.aplicaciones.map(a=>`<span>${APPN[a]}</span>`).join('')}</p>
<div class="row rv" style="--d:.2s"><a class="btn" href="#contacto/${m.slug}">Solicitar presupuesto ${ARW}</a><a class="btn ghost" href="#materiales/${c.slug}">Ver ${c.nombre.toLowerCase()}</a></div></div>
<div class="fhero rv" style="--d:.1s">${imgBox(m.imagenPrincipal,num,'Foto pendiente')}</div></div></div></div>
<div class="wrap fmain">
${fsec('Qué es',`<p class="big">${m.queEs}</p>`)}
${fsec('Cualidades',`<div class="quals">${m.cualidades.map(q=>`<div class="qual"><span class="qi">${ico(q.icono)}</span><h3>${q.titulo}</h3><p>${q.texto}</p></div>`).join('')}</div>`)}
${fsec('Ficha técnica',`<dl class="spec">${tec.map(([k,v,s])=>`<div><dt>${k}</dt><dd>${v?v:PEND}${s==='referencia'?' <span class="pend">Referencia general</span>':''}</dd></div>`).join('')}<div><dt>Espesores, gramajes y medidas máximas</dt><dd>${gf.espesores||gf.medidasMaximas?[(gf.espesores||[]).join(', '),gf.medidasMaximas].filter(Boolean).join(' · '):PEND}</dd></div></dl><div class="usos">${usoHTML('Interior',m.usos.interior)}${usoHTML('Exterior',m.usos.exterior)}</div>`)}
${fsec('Aplicaciones',`<div class="ejs">${m.ejemplosAplicacion.map(e=>`<div class="ej"><h3>${e.titulo}</h3><p>${e.descripcion}</p></div>`).join('')}</div>`)}
${fsec('Ventajas',ul(m.ventajas))}
${fsec('Consejos de uso',`<div class="duo"><div><h3>Recomendaciones</h3>${ul(m.recomendaciones)}</div><div><h3>Ten en cuenta</h3>${ul(m.limitaciones)}</div></div>`)}
${fsec('Acabados',`<div class="chips">${m.acabadosCompatibles.map(id=>`<a class="chip" href="#acabados/${id}">${ABYID[id].nombre}</a>`).join('')}</div><p class="fnote">Acabados compatibles a nivel técnico. Confirma con nosotros cuáles aplicamos en tu proyecto.</p>`)}
${m.proyectosReales.filter(x=>x.estado==='disponible').length?fsec('Así queda en trabajos reales',`<div class="gal real">${m.proyectosReales.filter(x=>x.estado==='disponible').map((g,i)=>`<figure>${imgBox(g,String(i+1).padStart(2,'0'),'Foto pendiente')}<figcaption>${PBYID[g.proyecto]||''}</figcaption></figure>`).join('')}</div><p class="fnote">Fotografías de trabajos realizados por MÉS PUBLICITAT.</p>`):''}
</div>
<div class="wrap frel"><div class="fsec rv"><h2>Materiales relacionados</h2></div><div class="grid">${rel.map((r,i)=>card(r,'rv',i)).join('')}</div>
${m.fuentes.verificado?'':`<p class="fnote">${m.fuentes.nota}</p>`}</div>
<section class="on-red cta"><div class="wrap"><div><h2 class="rv">¿Quieres presupuesto de ${m.nombre.toLowerCase()}?</h2><p class="rv" style="--d:.1s">Cuéntanos tu proyecto y te asesoramos.</p></div><div class="row rv" style="--d:.2s"><a class="btn" href="#contacto/${m.slug}">Solicitar presupuesto ${ARW}</a></div></div></section>`}
function setUrl(){history.replaceState(null,'','#materiales'+(S.cat||S.app?'/'+(S.cat||'todos')+(S.app?'/'+S.app:''):''))}
function upd(){setUrl();crumbs();chips();renderM(true)}
mSearch.addEventListener('input',e=>{S.q=e.target.value;renderM(true)});
mClear.onclick=()=>{S.q='';mSearch.value='';renderM(true);mSearch.focus()};
mCats.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(b){S.cat=b.dataset.cat;upd()}});
mApps.addEventListener('click',e=>{const b=e.target.closest('[data-app]');if(b){S.app=b.dataset.app;upd()}});
const reset=()=>{S.q=S.cat=S.app='';mSearch.value='';upd()};
mReset.onclick=reset;mList.addEventListener('click',e=>{if(e.target.closest('[data-reset]'))reset()});
/* páginas: nosotros, aplicaciones, acabados, contacto (todo se lee de src/data) */
const chipLinks=ms=>ms.map(m=>`<a class="chip" href="#material/${m.slug}">${m.nombre}</a>`).join('');
function renderQS(){qsLead.textContent=EMP.descripcion+' '+(EMP.cobertura||'');qsImgs.innerHTML=(EMP.imagenesQuienesSomos||[]).map((i,k)=>`<figure class="rv" style="--d:${k*.1}s"><img src="${i.src}" alt="${i.alt}" loading="lazy"></figure>`).join('');
qsSvc.innerHTML=EMP.servicios.map((s,i)=>`<div class="svc rv" style="--d:${i*.08}s"><h3>${s.nombre}</h3><p>${s.texto}</p></div>`).join('');
qsSteps.innerHTML=EMP.proceso.map((s,i)=>`<div class="step rv" style="--d:${i*.08}s"><b>0${i+1}</b><h3>${s.nombre}</h3><p>${s.texto}</p></div>`).join('')}
function renderAp(){apList.innerHTML=APPS.map(a=>{const ms=MATS.filter(m=>m.aplicaciones.includes(a.id));
return fsec(a.nombre,`<p class="big">${a.descripcion}</p><div class="chips">${chipLinks(ms)}</div><a class="btn ghost" href="#materiales/todos/${a.id}">Ver ${ms.length} materiales en el catálogo</a>`)}).join('')}
function renderAc(){const gs=[...new Set(ACS.map(a=>a.tipo))];
acList.innerHTML=gs.map(g=>{const as=ACS.filter(a=>a.tipo===g);
return `<div class="mcat"><header class="rv"><div><h2>${g}</h2></div><span>${as.length} ${as.length===1?'acabado':'acabados'}</span></header><div class="agrid">${as.map(a=>{const ms=MATS.filter(m=>m.acabadosCompatibles.includes(a.id));
return `<article class="acab rv" id="ac-${a.id}"><h3>${a.nombre}</h3><p>${a.descripcion}</p><details><summary>Materiales compatibles (${ms.length})</summary><div class="chips">${chipLinks(ms)}</div></details></article>`}).join('')}</div></div>`}).join('')}
cMaterial.innerHTML='<option value="">Aún no lo sé, o varios materiales</option>'+CATS.map(c=>`<optgroup label="${c.nombre}">${c.materiales.map(id=>`<option value="${MBYID[id].slug}">${MBYID[id].nombre}</option>`).join('')}</optgroup>`).join('');
function renderCo(slug){if(slug&&MATS.some(m=>m.slug===slug))cMaterial.value=slug;
const c=EMP.contacto,rows=[['Teléfono',c.telefono],['Correo',c.email],['Domicilio',c.direccion],['Cobertura',EMP.cobertura],['Horario',c.horario],['Instagram',EMP.redes&&EMP.redes.instagram?`<a href="${EMP.redes.instagram}" target="_blank" rel="noopener">@mespublicitat</a>`:null]].filter(r=>r[1]);
cInfo.innerHTML=`<h2>Datos de contacto</h2>${rows.length?`<dl>${rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl>`:'<p>Los datos de contacto se añadirán aquí cuando la empresa los confirme.</p>'}<h2>Qué incluir</h2>${ul(['Qué quieres comunicar y dónde lo vas a colocar.','Si es para interior o exterior.','Medidas aproximadas y cantidad.','Para cuándo lo necesitas.'])}`}
const fieldErr=(id,eid,bad)=>{const f=document.getElementById(id),e=document.getElementById(eid);f.setAttribute('aria-invalid',bad);e.hidden=!bad;return bad};
cForm.addEventListener('submit',e=>{e.preventDefault();
const b1=fieldErr('cNombre','eNombre',!cNombre.value.trim()),b2=fieldErr('cEmail','eEmail',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail.value.trim())),b3=fieldErr('cMensaje','eMensaje',!cMensaje.value.trim()),b4=fieldErr('cConsent','eConsent',!cConsent.checked);
if(b1||b2||b3||b4){document.querySelector('.cform [aria-invalid=true]').focus();return}
const m=MATS.find(x=>x.slug===cMaterial.value),L=[['Material',m?`${m.nombre} (${CBYID[m.categoria].nombre})`:'Sin material concreto'],['Nombre',cNombre.value.trim()],['Correo',cEmail.value.trim()],['Teléfono',cTel.value.trim()],['Empresa',cEmpresa.value.trim()],['Medidas y cantidad',cMedidas.value.trim()],['Proyecto',cMensaje.value.trim()]].filter(r=>r[1]);
const txt='Solicitud de presupuesto\n'+L.map(r=>`${r[0]}: ${r[1]}`).join('\n');
cSummary.textContent=txt;cCopied.textContent='';
const dest=EMP.contacto.emailDestinoFormulario||EMP.contacto.email;
cStatus.textContent=dest?`Este formulario no envía mensajes por sí solo. Copia el resumen o ábrelo en tu correo para enviarlo a ${dest}.`:'Este formulario todavía no envía mensajes: falta configurar el correo de destino. Copia el resumen y envíalo por tu canal habitual.';
cMail.hidden=!dest;if(dest)cMail.href=`mailto:${dest}?subject=${encodeURIComponent('Solicitud de presupuesto'+(m?': '+m.nombre:''))}&body=${encodeURIComponent(txt)}`;
cResult.hidden=false;cResult.focus();cResult.scrollIntoView({block:'nearest'})});
cCopy.onclick=async()=>{try{await navigator.clipboard.writeText(cSummary.textContent);cCopied.textContent='Resumen copiado.'}catch(_){const r=document.createRange();r.selectNodeContents(cSummary);const s=getSelection();s.removeAllRanges();s.addRange(r);cCopied.textContent='Selecciona el texto y cópialo con Ctrl+C.'}};
function setDesc(t){const d=document.querySelector('meta[name=description]');if(d)d.content=t}
const DESC0=document.querySelector('meta[name=description]').content;
const PG={cookies:['Política de cookies',()=>'Qué almacenamiento y servicios de terceros usa la web de MésPublicitat, para qué sirven y cómo cambiar tu elección.'],'quienes-somos':['Quiénes somos',()=>EMP.descripcion],aplicaciones:['Aplicaciones',()=>'Materiales de impresión publicitaria según dónde los vayas a usar: interior, exterior, escaparates, vehículos, eventos y más.'],acabados:['Acabados',()=>'Acabados para vinilos, rígidos, gran formato, impresos y textil, con los materiales compatibles con cada uno.'],contacto:['Contacto',()=>'Cuéntanos tu proyecto y te ayudamos a elegir el material y el acabado adecuados.']};
function route(){const parts=(location.hash||'#inicio').slice(1).split('/'),k=ROUTES[parts[0]]?parts[0]:'inicio';
const mat=k==='material'?MATS.find(m=>m.slug===parts[1]):null,key=k==='material'&&!mat?'materiales':k;
const page=key==='material'?'ficha':key;
document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===page));
let title='Catálogo de materiales',desc=DESC0;
if(page==='materiales'){S.q='';S.app=APPN[parts[2]]?parts[2]:'';S.cat=CBYID[parts[1]]?parts[1]:'';mSearch.value='';crumbs();chips();renderM(false);title=S.cat?CBYID[S.cat].nombre:'Materiales';if(S.cat)desc=CBYID[S.cat].descripcion}
else if(page==='ficha'){renderFicha(mat);title=mat.nombre;desc=mat.resumen}
else if(PG[page]){title=PG[page][0];desc=PG[page][1]();({cookies:renderCk,'quienes-somos':renderQS,aplicaciones:renderAp,acabados:renderAc,contacto:()=>renderCo(parts[1])})[page]()}
setDesc(desc);
navA.forEach(a=>a.getAttribute('href')==='#'+(key==='material'?'materiales':key)?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
document.title=title+' | MésPublicitat';scrollTo(0,0);
nav.classList.remove('open');burger.setAttribute('aria-expanded','false');observe();
if(page==='acabados'&&parts[1])requestAnimationFrame(()=>{const e=document.getElementById('ac-'+parts[1]);if(e){e.classList.add('in','hl');e.querySelector('details').open=true;e.scrollIntoView({block:'center'})}})}
addEventListener('hashchange',route);
const burger=document.querySelector('.burger');
burger.onclick=()=>burger.setAttribute('aria-expanded',nav.classList.toggle('open'));
addEventListener('scroll',()=>document.querySelector('header.top').classList.toggle('stuck',scrollY>8),{passive:true});
/* reveal + counters */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
const c=e.target.querySelector('[data-count]');if(c)count(c)}),{threshold:.15,rootMargin:'0px 0px -6% 0px'}):null;
function observe(){document.querySelectorAll('.page.active .rv:not(.in)').forEach(el=>io?io.observe(el):el.classList.add('in'))}
function count(el){const t=+el.dataset.count;if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=(el.dataset.pre||'')+t;return}
const s=performance.now();(function f(n){const p=Math.min((n-s)/1400,1);el.textContent=(el.dataset.pre||'')+Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)}
/* cookies: el almacenamiento opcional no se activa hasta tener consentimiento */
const CKK=CK.claveAlmacenamiento,esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ckGet(){try{const v=JSON.parse(localStorage.getItem(CKK));return v&&v.v===CK.version&&typeof v.terceros==='boolean'?v:null}catch(_){return null}}
function ckSet(terceros){try{localStorage.setItem(CKK,JSON.stringify({v:CK.version,terceros,fecha:new Date().toISOString()}))}catch(_){}ckApply(terceros)}
let fontsOn=false;
function ckApply(terceros){
 if(terceros&&!fontsOn){fontsOn=true;const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Anton&family=Carlito:wght@400;700&display=swap';document.head.appendChild(l)}
 else if(!terceros&&fontsOn){document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(l=>l.remove());fontsOn=false}
}
const ckB=document.getElementById('ckBanner'),ckD=document.getElementById('ckDlg');let ckLast=null;
document.getElementById('ckText').textContent=CK.resumenBanner;
function ckShow(){ckB.hidden=false;requestAnimationFrame(()=>ckB.classList.add('show'))}
function ckHide(){ckB.classList.remove('show');setTimeout(()=>ckB.hidden=true,350)}
function ckDecide(t){ckSet(t);ckHide();if(ckD.open)ckD.close()}
document.getElementById('ckAll').onclick=()=>ckDecide(true);
document.getElementById('ckRej').onclick=()=>ckDecide(false);
function ckOpen(){const cur=ckGet();
 ckCats.innerHTML=CK.categorias.map(c=>{const on=c.obligatoria||(c.utilizada&&cur&&cur.terceros),dis=c.obligatoria||!c.utilizada;
  return `<div class="ckc"><div class="ckc-h"><h3>${esc(c.nombre)}</h3>${c.utilizada?`<label class="sw"><input type="checkbox" data-ck="${c.id}" ${on?'checked':''} ${c.obligatoria?'disabled':''} aria-label="${esc(c.nombre)}"><i></i></label>`:`<span class="ckc-no">No se utiliza</span>`}</div><p>${esc(c.texto)}</p>${c.obligatoria?'<small>Siempre activas</small>':''}</div>`}).join('');
 ckLast=document.activeElement;ckD.showModal()}
document.getElementById('ckCfg').onclick=ckOpen;document.getElementById('ckOpen').onclick=ckOpen;
document.getElementById('ckClose').onclick=()=>ckD.close();
document.getElementById('ckSave').onclick=()=>ckDecide(!!ckD.querySelector('[data-ck=terceros]:checked'));
ckD.addEventListener('click',e=>{if(e.target===ckD)ckD.close()});
ckD.addEventListener('close',()=>{if(ckLast&&ckLast.focus)ckLast.focus()});
function renderCk(){
 ckLead.textContent=CK.intro;
 ckDoc.innerHTML=`<p class="meta">Última actualización: ${new Date(CK.actualizado).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</p>
 <h2>Qué usa esta web</h2>${CK.categorias.map(c=>`<div class="ckt"><h3>${esc(c.nombre)}${c.obligatoria?' <em>siempre activas</em>':c.utilizada?'':' <em>no se usa</em>'}</h3><p>${esc(c.texto)}</p>${(c.elementos||[]).map(e=>`<dl><div><dt>Elemento</dt><dd>${esc(e.nombre)}</dd></div><div><dt>Tipo</dt><dd>${esc(e.tipo)}</dd></div><div><dt>Titular</dt><dd>${esc(e.titular)}</dd></div><div><dt>Finalidad</dt><dd>${esc(e.finalidad)}</dd></div><div><dt>Duración</dt><dd>${esc(e.duracion)}</dd></div></dl>`).join('')}</div>`).join('')}
 <h2>Formulario de contacto</h2><p>${esc(CK.formulario)}</p>
 <h2>Cómo cambiar tu elección</h2><p>${esc(CK.cambiarEleccion)}</p><p><button type="button" class="btn" id="ckOpen2">Configurar cookies</button></p>
 <h2>Contacto</h2><p>Para cualquier duda: <a href="mailto:${CK.contacto}">${CK.contacto}</a>.</p>
 <div class="ckpend"><h3>Datos legales pendientes de completar</h3><ul>${CK.pendientesLegales.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`;
 document.getElementById('ckOpen2').onclick=ckOpen}
{const cur=ckGet();if(cur)ckApply(cur.terceros);else ckShow()}

route();
