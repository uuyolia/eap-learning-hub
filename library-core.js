(function(root){
'use strict';
function key(s){return String(s||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase()}
function valid(item,kind){return !!item&&typeof item.term==='string'&&item.term.trim().length>0&&item.term.length<=(kind==='word'?120:800)&&(!item.meaning||typeof item.meaning==='string')&&(!item.example||typeof item.example==='string')}
function merge(base,incoming,kind){const map=new Map();for(const e of [...base,...incoming]){if(!valid(e,kind))continue;const k=e.id||kind+':'+key(e.term);map.set(k,{...e,term:e.term.trim(),meaning:String(e.meaning||''),example:String(e.example||'')})}return [...map.values()]}
function matches(record,{scope='all',date='',query=''}={}){const personal=record.personal===true;return(scope!=='personal'||personal)&&(scope!=='base'||record.base)&&(scope!=='daily'||record.daily===true)&&(!date||(record.dates||[record.date]).includes(date))&&key([record.term,record.meaning,record.example].join(' ')).includes(key(query))}
root.EAPLibraryCore={key,valid,merge,matches};
})(globalThis);