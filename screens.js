(function(){
'use strict';
const ids=['home','news','words','phrases','flashcards','speaking','materials','settings','mock-exam'];
const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
const routeHeader=document.getElementById('routeHeader');
function render(){let id=location.hash.slice(1).split('?')[0]||'home';if(!ids.includes(id))id='home';sections.forEach(s=>s.hidden=s.id!==id);document.getElementById('legacyIntro').hidden=true;routeHeader.hidden=id==='home';document.getElementById('clipBar').hidden=true;document.querySelectorAll('main > nav a').forEach(a=>{if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title=(id==='home'?'EAP Learning Hub':document.getElementById(id).querySelector('h2')?.textContent||'EAP')+' · 我的学习空间';window.scrollTo({top:0,behavior:'instant'});document.dispatchEvent(new CustomEvent('eap:screen',{detail:{id}}))}
document.documentElement.classList.add('app-ready');window.addEventListener('hashchange',render);render();
})();