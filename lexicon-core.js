(function(root){
'use strict';
const key=s=>String(s||'').normalize('NFKC').replace(/[（(][^()（）]*[）)]/g,'').trim().replace(/\s+/g,' ').replace(/[’]/g,"'").toLowerCase();
function sentence(text,term){const clean=String(text||'');const parts=typeof Intl?.Segmenter==='function'?Array.from(new Intl.Segmenter('en',{granularity:'sentence'}).segment(clean),v=>v.segment):(clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[clean]);return parts.find(s=>key(s).includes(key(term)))?.trim()||clean.trim()}
function match(term,record,entries){const k=key(term);if(!k)return null;const same=entries.filter(x=>key(x.term)===k&&x.issueId===record.issueId&&x.articleIndex===record.articleIndex&&x.meaning);return same.find(x=>!x.context||key(record.example).includes(key(x.context)))||null}
function bracketMeaning(term,text){const k=key(term);for(const m of String(text||'').matchAll(/([A-Za-z][A-Za-z'’ -]{0,100})[（(]([\u3400-\u9fff][^（）()]{0,100})[）)]/g)){if(key(m[1]).endsWith(k))return m[2]}return ''}
function validTranslation(data){return data&&Number(data.responseStatus)===200&&!data.quotaFinished&&typeof data.responseData?.translatedText==='string'&&data.responseData.translatedText.length<4000&&!/MYMEMORY WARNING|QUERY LENGTH LIMIT|PLEASE SELECT TWO DISTINCT|INVALID LANGUAGE/i.test(data.responseData.translatedText)}
function phonetic(entry,word){const p=entry?.phonetics||[],best=p.find(v=>v.text&&/uk|gb/i.test(v.audio||''))||p.find(v=>v.text)||{};const text=best.text||entry?.phonetic||'';return {word,ipa:typeof text==='string'?text:'',sourceUrl:entry?.sourceUrls?.find(u=>/^https:\/\//.test(u))||'https://dictionaryapi.dev/',license:entry?.license||best.license||null}}
root.EAPLexiconCore={key,sentence,match,bracketMeaning,validTranslation,phonetic};
})(globalThis);
