(function(root){
'use strict';
const DAY=86400000;
function dayKey(now=Date.now()){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function weekStart(now=Date.now()){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-6);return d.getTime()}
function metrics(text){const words=(text.match(/[a-z]+(?:'[a-z]+)?/gi)||[]).length;return {words,reason:/\b(because|since|therefore|as a result|the reason|this means)\b/i.test(text),example:/\b(for example|for instance|such as|when i|in my experience|i remember)\b/i.test(text),balance:/\b(however|although|on the other hand|admittedly|depends on|unless)\b/i.test(text)}}
function advice(text,part=2){const m=metrics(text),tips=[];
if(m.words<(part===1?45:15))tips.push({title:'补全回答与具体细节',evidence:'当前转写 '+m.words+' 个英文词；可能尚未完整。',action:'先直接回答问题，再交代谁、何时、在什么场景。词数只作提示，不必为了凑字数拖长回答。',expression:'In my experience, … happened when …'});
if(!m.reason)tips.push({title:'把观点后面的原因说清楚',evidence:'尚未检测到常见原因连接表达；同义表达可能未被识别。',action:'在观点后解释 why，再说明对学生或社会有什么影响。',expression:'One reason for this is that …, which can lead to …'});
if(!m.example)tips.push({title:'用一个具体例子支撑观点',evidence:'尚未检测到常见例证表达；请人工检查是否已有具体例子。',action:'选自己的经历或新闻案例，说明它怎样支持你的答案。',expression:'For example, when I …, I found that …'});
if(!m.balance)tips.push({title:'加入条件或另一种视角',evidence:'已检测到原因与例证线索，尚未检测到常见让步或条件表达。',action:'根据题意比较不同群体或短期与长期；不必每题都硬加反方。',expression:'Although …, I would support this if …'});
if(tips.length<2)tips.push({title:'核对例子与问题的联系',evidence:'文本包含结构连接线索；这不能证明例子切题或因果成立。',action:'回看问题，删去无关背景，并补一句解释例子为什么支持你的观点。',expression:'This example shows why … matters, especially for …'});
if(tips.length<2)tips.push({title:'回听并简化重复表达',evidence:'文本结构线索较完整；录音中的停顿和重音尚未评估。',action:'回听一次，选一句重复或过长的话，改短后再录一遍。',expression:'What I mean is …; the key point is …'});
return tips.slice(0,2)}
function validAttempt(a,topics){return !!a&&typeof a.id==='string'&&a.id.length<=200&&topics.includes(a.topic)&&[1,2].includes(a.part)&&typeof a.question==='string'&&a.question.length>0&&a.question.length<=2000&&typeof a.text==='string'&&a.text.length<=30000&&Number.isFinite(a.at)&&a.at>0&&a.at<=Date.now()+DAY&&typeof a.source==='string'}
function coverage(attempts,topics,now=Date.now()){const start=weekStart(now);return topics.map(topic=>{const all=attempts.filter(a=>a.topic===topic&&a.at>=start&&a.at<=now&&metrics(a.text).words>0);return {topic,count:all.length,questions:new Set(all.map(a=>a.question)).size,last:all.length?Math.max(...all.map(a=>a.at)):null}})}
function compare(attempts,a){const matches=attempts.filter(b=>b.question===a.question&&b.topic===a.topic&&b.part===a.part).sort((x,y)=>x.at-y.at||x.id.localeCompare(y.id));return {first:matches[0]||a,latest:matches[matches.length-1]||a,count:matches.length}}
function merge(old,incoming){return [...new Map([...old,...incoming].map(a=>[a.id,a])).values()].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id))}
root.EAPLearningCore={dayKey,weekStart,metrics,advice,validAttempt,coverage,compare,merge};
})(globalThis);
