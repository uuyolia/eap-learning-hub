(function(root){
'use strict';
const META='eap_profiles_v1',LAST='eap_profile_last_v1',TAB='eap_profile_tab_v1';
const parse=(s,f)=>{try{return JSON.parse(s)||f}catch{return f}},uuid=()=>root.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let meta,active='default',available=true;
try{meta=parse(localStorage.getItem(META),null);if(!meta||!Array.isArray(meta.profiles))meta={profiles:[{id:'default',name:'我的学习'}]};meta.profiles=meta.profiles.filter(p=>p&&/^[a-zA-Z0-9-]{1,80}$/.test(p.id)&&typeof p.name==='string'&&p.name.length<=40);if(!meta.profiles.some(p=>p.id==='default'))meta.profiles.unshift({id:'default',name:'我的学习'});const desired=sessionStorage.getItem(TAB)||localStorage.getItem(LAST);active=meta.profiles.some(p=>p.id===desired)?desired:'default';sessionStorage.setItem(TAB,active);localStorage.setItem(META,JSON.stringify(meta))}catch{available=false;meta={profiles:[{id:'default',name:'我的学习'}]}}
let accountId='';try{const v=sessionStorage.getItem('eap_cloud_uid_v1')||'';if(/^[A-Za-z0-9_-]{1,128}$/.test(v))accountId=v}catch{}
const storageKey=k=>accountId?'eap_account_'+accountId+':'+k:active==='default'?k:'eap_user_'+active+':'+k;
root.EAPStorage={getItem:k=>localStorage.getItem(storageKey(k)),setItem:(k,v)=>localStorage.setItem(storageKey(k),v),removeItem:k=>localStorage.removeItem(storageKey(k)),profile:()=>accountId?{id:accountId,name:'云端账号',cloud:true}:{...meta.profiles.find(p=>p.id===active)},accountId:()=>accountId,key:storageKey,localProfiles:()=>meta.profiles.map(p=>({...p})),readLocal:(id,k)=>{if(!meta.profiles.some(p=>p.id===id))throw Error('Unknown profile');return localStorage.getItem(id==='default'?k:'eap_user_'+id+':'+k)}};
function busy(){return (typeof recorder!=='undefined'&&recorder?.state==='recording')||(typeof recognition!=='undefined'&&recognition)||!document.getElementById('examCancel')?.hidden}
function activate(id){if(!available)throw Error('storage');if(busy()){document.getElementById('profileStatus').textContent='请先停止录音、转文字或结束模拟考试，再切换档案。';return}sessionStorage.setItem(TAB,id);localStorage.setItem(LAST,id);location.reload()}
document.addEventListener('DOMContentLoaded',()=>{
const $=id=>document.getElementById(id),current=meta.profiles.find(p=>p.id===active);if(accountId)$('localProfilePanel').hidden=true;
$('profileBadge').textContent='学习档案：'+current.name;$('profileCurrent').textContent='当前档案：'+current.name+'。记录仅保存在此浏览器，不会随分享链接发送。';
$('profileSelect').textContent='';for(const p of meta.profiles){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;$('profileSelect').append(o)}$('profileSelect').value=active;
if(!available)$('profileStatus').textContent='本地存储不可用，暂时无法创建或持久保存档案。';
$('profileSwitch').onclick=()=>{try{activate($('profileSelect').value)}catch{$('profileStatus').textContent='无法切换，请确认浏览器允许本地保存。'}};
$('profileCreate').onclick=()=>{const name=$('profileName').value.trim();if(!name||name.length>40){$('profileStatus').textContent='请填写 1–40 个字符的档案名称。';return}if(busy()){$('profileStatus').textContent='请先停止录音、转文字或结束模拟考试。';return}try{const p={id:uuid(),name};meta.profiles.push(p);localStorage.setItem(META,JSON.stringify(meta));activate(p.id)}catch{$('profileStatus').textContent='无法创建档案，现有记录仍保留。'}};
$('copyPublicLink').onclick=async()=>{const url=location.origin+location.pathname;try{await navigator.clipboard.writeText(url);$('shareStatus').textContent='已复制公开网址。链接仅包含网站地址，不包含任何个人学习记录。'}catch{$('shareStatus').textContent='请复制此网址：'+url}};
});
})(globalThis);
