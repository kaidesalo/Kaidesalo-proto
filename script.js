const projects = {
  atlas: {title:'Atlas', type:'Full-stack / Concept project', intro:'A clearer view of complex data. A dashboard concept that turns geographic and operational information into an interface people can actually navigate.', image:'atlas.svg', alt:'Atlas geospatial analytics dashboard', stack:['React','TypeScript','PostgreSQL'], challenge:'Dense dashboards often bury the useful parts. Atlas explores a map-first workspace that brings context, filters, and essential metrics together without overwhelming the screen.', approach:['A responsive workspace with a consistent hierarchy across charts, maps, and detail panels.','Composable interface components and explicit loading, empty, and error states.','An API and data model designed around filtering and progressive disclosure.'], focus:'Data visualization · Interface architecture · Full-stack design'},
  orbit: {title:'Orbit', type:'Developer tools / Concept project', intro:'One place to find your flow. A developer workspace concept for keeping projects, activity, and everyday commands within reach.', image:'orbit.svg', alt:'Orbit developer workspace', stack:['TypeScript','Node.js','CLI design'], challenge:'Switching between tools interrupts focus. Orbit explores a compact workspace that puts project context and routine actions in one predictable place.', approach:['A keyboard-first interaction model with discoverable commands.','Readable terminal output and clear status feedback for everyday tasks.','A modular command architecture that makes new workflows straightforward to add.'], focus:'Developer experience · Command design · Tooling'},
  folio: {title:'Folio', type:'Creative development / Concept project', intro:'A digital space with a point of view. An editorial portfolio concept that pairs expressive typography with a fast, accessible browsing experience.', image:'folio.svg', alt:'Folio editorial website concept', stack:['Next.js','CSS','Motion design'], challenge:'Creative websites should feel distinctive while remaining easy to use. Folio explores how typography, structure, and restrained motion can give work a memorable setting.', approach:['An adaptable layout system that gives each project enough room to tell its story.','Responsive typography and lightweight interactions with reduced-motion support.','Semantic page structure and a focus on image loading, legibility, and keyboard access.'], focus:'Front-end craft · Accessibility · Performance'}
};

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');mobileMenu.hidden=true;}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileMenu.hidden=open;});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
window.matchMedia('(min-width: 701px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  document.querySelectorAll('.project').forEach(project=>{project.hidden=filter!=='all'&&project.dataset.category!==filter;project.classList.remove('filtering');if(!project.hidden){void project.offsetWidth;project.classList.add('filtering');}});
}));

function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
function closeDialog(dialog){dialog.close();}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeDialog(dialog);}});
});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>closeDialog(document.getElementById(button.dataset.close))));
const projectDialog=document.getElementById('project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  const p=projects[button.dataset.project];
  document.getElementById('project-detail').innerHTML=`<div class="detail-content"><span class="detail-kicker">${p.type}</span><h2 id="project-dialog-title">${p.title}<span class="accent">.</span></h2><p class="detail-intro">${p.intro}</p><img class="detail-image" src="assets/${p.image}" alt="${p.alt}"><div class="detail-grid"><div><h3>Technology direction</h3><div class="skill-tags" style="padding:0 0 24px">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div><h3>Focus</h3><p>${p.focus}</p></div><div><h3>The idea</h3><p>${p.challenge}</p><h3>Engineering approach</h3><ul>${p.approach.map(s=>`<li>${s}</li>`).join('')}</ul></div></div><p class="detail-note">Illustrative concept project. The interface and technical direction demonstrate a portfolio case study; no live product or client engagement is implied.</p></div>`;
  projectDialog.setAttribute('aria-labelledby','project-dialog-title');
  openDialog(projectDialog);projectDialog.scrollTop=0;
}));

const contactDialog=document.getElementById('contact-dialog');
contactDialog.setAttribute('aria-label','Send a message to Kaide Salo');
const contactForm=document.getElementById('contact-form');
const contactSuccess=document.getElementById('contact-success');
const formStatus=document.getElementById('form-status');
const sendButton=document.getElementById('send-message');
const sendLabel=sendButton.querySelector('.send-label');
let sending=false;
function showContact(intent){
  if(!sending){
    contactSuccess.hidden=true;contactForm.hidden=false;formStatus.textContent='';
    if(intent==='resume')document.getElementById('contact-message').value='Hi Kaide, could you send me a copy of your résumé?';
  }
  openDialog(contactDialog);
}
document.getElementById('open-contact').addEventListener('click',()=>showContact());
document.querySelectorAll('[data-contact-intent]').forEach(button=>button.addEventListener('click',()=>showContact(button.dataset.contactIntent)));
contactForm.addEventListener('submit',async e=>{
  e.preventDefault();if(sending||!contactForm.reportValidity())return;
  const payload={name:document.getElementById('contact-name').value.trim(),email:document.getElementById('contact-email').value.trim(),message:document.getElementById('contact-message').value.trim(),website:document.getElementById('contact-website').value};
  if(!payload.name||!payload.message){formStatus.textContent='Please add your name and a few details about your idea.';return;}
  sending=true;sendButton.disabled=true;sendLabel.textContent='Sending…';contactForm.setAttribute('aria-busy','true');formStatus.textContent='';
  try{
    const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
    const result=await response.json();
    if(!response.ok||result.ok!==true){formStatus.textContent=typeof result.error==='string'?result.error:'Your message could not be delivered right now. Please try again later.';return;}
    contactForm.hidden=true;contactSuccess.hidden=false;contactSuccess.focus();contactForm.reset();
  }catch{formStatus.textContent='We couldn’t confirm delivery. Please wait a moment before trying again.';}
  finally{sending=false;sendButton.disabled=false;sendLabel.textContent='Send message';contactForm.removeAttribute('aria-busy');}
});
document.getElementById('new-message').addEventListener('click',()=>{contactSuccess.hidden=true;contactForm.hidden=false;formStatus.textContent='';document.getElementById('contact-name').focus();});
