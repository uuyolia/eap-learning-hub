(function(root){
'use strict';
const KEYS=['eap_review_v3','eap_cases_v3','eap_saved_v2','eap_note_v2','eap_personal_language_v1','eap_learning_v1'];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function merge(base,local,remote,path=''){
if(eq(local,remote))return {value:local,conflicts:[]};
if(eq(local,base))return {value:remote,conflicts:[]};
if(eq(remote,base))return {value:local,conflicts:[]};
if(Array.isArray(local)&&Array.isArray(remote)){
const previous=Array.isArray(base)?base:[];
if([...previous,...local,...remote].every(v=>typeof v==='string')){const all=new Set([...previous,...local,...remote]),out=[];for(const s of all){const b=previous.includes(s),l=local.includes(s),r=remote.includes(s);if(l===r?l:l===b?r:l)out.push(s)}return{value:out,conflicts:[]}}
if([...previous,...local,...remote].every(v=>plain(v)&&typeof v.id==='string')){const index=a=>Object.fromEntries(a.map(v=>[v.id,v]));const result=merge(index(previous),index(local),index(remote),path);return{value:Object.values(result.value),conflicts:result.conflicts}}
return{value:local,conflicts:[path]}
}
if(plain(local)&&plain(remote)&&(base===undefined||plain(base))){const value=Object.create(null),conflicts=[];for(const k of new Set([...Object.keys(base||{}),...Object.keys(local),...Object.keys(remote)])){const r=merge(own(base,k)?base[k]:undefined,own(local,k)?local[k]:undefined,own(remote,k)?remote[k]:undefined,path+'/'+k);if(r.value!==undefined)value[k]=r.value;conflicts.push(...r.conflicts)}return {value,conflicts}}
return{value:local,conflicts:[path]};
}
function decode(key,text){if(text==null)return key==='eap_note_v2'?'':undefined;if(key==='eap_note_v2')return String(text);return JSON.parse(text)}
function mergeRecord(key,base,local,remote){if(!KEYS.includes(key))throw Error('Unknown record');const r=merge(decode(key,base),decode(key,local),decode(key,remote),key);return {value:r.value===undefined?null:key==='eap_note_v2'?r.value:JSON.stringify(r.value),conflicts:r.conflicts}}
function validRecord(key,value){if(!KEYS.includes(key)||typeof value!=='string'||new TextEncoder().encode(value).length>600000)return false;try{const d=decode(key,value);if(key==='eap_note_v2')return value.length<=100000;if(key==='eap_review_v3')return plain(d)&&Object.values(d).every(v=>v&&['new','learning','known'].includes(v.status)&&Number.isInteger(v.step)&&v.step>=0&&v.step<=5&&(v.status!=='learning'||Number.isFinite(v.due)));if(key==='eap_cases_v3')return Array.isArray(d)&&d.every(v=>v&&typeof v.id==='string'&&typeof v.title==='string'&&typeof v.text==='string');if(key==='eap_saved_v2')return Array.isArray(d)&&d.every(v=>typeof v==='string');if(key==='eap_personal_language_v1')return plain(d)&&['words','phrases'].every(k=>Array.isArray(d[k])&&d[k].every(v=>v&&typeof v.term==='string'));if(key==='eap_learning_v1')return plain(d)&&Array.isArray(d.attempts)&&plain(d.days)&&plain(d.drafts);return false}catch{return false}}
root.EAPCloudCore={KEYS,merge,mergeRecord,validRecord};
})(globalThis);
