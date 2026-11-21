(function(){
'use strict';
const C=EAPLearningCore,$=id=>document.getElementById(id),E=esc,topics=EAPExamCore.TOPICS,ids=topics.map(t=>t.id),key='eap_learning_v1';
let state=readJSON(key,{}),active=null,latestIssue=null,examSession='';
if(!state||typeof state!=='object'||Array.isArray(state))state={};
state.attempts=Array.isArray(state.attempts)?state.attempts.filter(a=>C.validAttempt(a,ids)):[];
state.days=state.days&&typeof state.days==='object'&&!Array.isArray(state.days)?state.days:{};
state.drafts=state.drafts&&typeof state.drafts==='object'&&!Array.isArray(state.drafts)?state.drafts:{};
function save(){return persist(key,state)}
function uid(){return globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
function due(){return VOCAB.filter(w=>{const s=wordState(w.term);return s.status==='learning'&&s.due<=Date.now()})}
function today(){const day=C.dayKey();if(!Object.prototype.hasOwnProperty.call(state.days,day)){state.days[day]={read:[],reviewed:[],goal:Math.min(5,due().length),mode:due().length?'due':'new'};save()}const d=state.days[day];if(!Array.isArray(d.read))d.read=[];if(!Array.isArray(d.reviewed))d.reviewed=[];if(d.goal===0&&!d.reviewed.length&&due().length){d.goal=Math.min(5,due().length);d.mode='due';save()}return d}
function rows(){return C.coverage(state.attempts,ids)}
function recommend(){return rows().slice().sort((a,b)=>a.count-b.count||(a.last||0)-(b.last||0)||ids.indexOf(a.topic)-ids.indexOf(b.topic))[0].topic}
function questionFor(id){return topics.find(t=>t.id===id).p2[1]}
function drawHome(){const d=today(),spoken=state.attempts.some(a=>C.dayKey(a.at)===C.dayKey()),reviewDone=d.goal===0||d.reviewed.length>=d.goal;const count=Number(!!d.read.length)+Number(reviewDone)+Number(spoken);
$('dailySummary').textContent='今天已完成 '+count+' / 3 项 · 约 15 分钟';
$('dailyRead').textContent=d.read.length?'已读 '+d.read.length+' 篇 · 再选一篇':'读一篇新闻 · 5 分钟';
$('dailyWords').textContent=d.goal?'复习到期词 '+Math.min(d.reviewed.length,d.goal)+' / '+d.goal:'当前无到期词 · 可选学未分类词';
$('dailySpeak').textContent=spoken?'已保存口语回答 · 继续练习':'回答一道 Part 2 题 · 5 分钟';
$('dailyRecommendation').textContent='建议练习 '+recommend()+' · '+topics.find(t=>t.id===recommend()).zh+'：最近七天练习较少。';
const cover=rows();$('topicSummary').textContent='最近七天已练 '+cover.filter(r=>r.count).length+' / 10 个主题。只统计保存了英文回答的练习，阅读新闻不计为开口练习。';
$('topicCoverage').innerHTML=cover.map(r=>'<button type="button" data-topic="'+E(r.topic)+'"><strong>'+E(r.topic)+'</strong><span>'+E(topics.find(t=>t.id===r.topic).zh)+'</span><small>'+(r.count?r.count+' 次回答 · '+r.questions+' 道题':'尚未练习')+'</small></button>').join('');
$('topicCoverage').querySelectorAll('button').forEach(b=>b.onclick=()=>useQuestion({topic:b.dataset.topic,part:2,question:questionFor(b.dataset.topic)}));
}
function feedbackHTML(text,part){return '<p class="small muted">以下按文字结构线索给建议，未判断语法、事实、切题程度或真实口语水平；不是考试分数。</p>'+C.advice(text,part).map(t=>'<div class="focus-tip"><h4>'+E(t.title)+'</h4><p class="small">'+E(t.evidence)+'</p><p>'+E(t.action)+'</p><p lang="en">'+E(t.expression)+'</p></div>').join('')}
function comparisonHTML(a){const c=C.compare(state.attempts,a),first=C.metrics(c.first.text),last=C.metrics(c.latest.text);return '<p>同题已保存 '+c.count+' 次。'+(c.count<2?'重答后可查看第一次和最新回答的变化。':'以下变化只反映文本线索，不代表考试成绩提高。')+'</p>'+(c.count<2?'<p class="answer-text">'+E(a.text)+'</p>':'<div class="comparison"><div><h4>第一次 · '+E(new Date(c.first.at).toLocaleString())+'</h4><p class="answer-text">'+E(c.first.text)+'</p></div><div><h4>最新一次 · '+E(new Date(c.latest.at).toLocaleString())+'</h4><p class="answer-text">'+E(c.latest.text)+'</p></div></div><p>英文词数：'+first.words+' → '+last.words+'；原因表达：'+(first.reason?'有':'未检测')+' → '+(last.reason?'有':'未检测')+'；例子表达：'+(first.example?'有':'未检测')+' → '+(last.example?'有':'未检测')+'。</p>')}
function drawHistory(){const box=$('answerHistory');box.textContent='';$('historyCount').textContent='已保存 '+state.attempts.length+' 次回答；文字保存在本设备当前浏览器，可在设置中导出备份。录音请另行下载保存。';
const groups=new Map();[...state.attempts].reverse().forEach(a=>{const k=JSON.stringify([a.topic,a.part,a.question]);if(!groups.has(k))groups.set(k,a)});
[...groups.values()].forEach(a=>{const d=document.createElement('details');d.className='answer-history';d.innerHTML='<summary>'+E(a.topic)+' · Part '+a.part+' · '+E(a.question)+'</summary><p class="small">'+E(new Date(a.at).toLocaleString())+' · '+E(a.source)+'</p>'+comparisonHTML(a)+'<h4>这道题下一次重点练两项</h4>'+feedbackHTML(a.text,a.part)+'<button type="button">重答这道题</button>';d.querySelector('button').onclick=()=>useQuestion(a);box.append(d)});
if(!groups.size)box.textContent='还没有保存的回答。开始一道题，录音后补全英文转写并保存；也可以先用文字练习。'}
function draftKey(a){return JSON.stringify([a.topic,a.part,a.question])}
function storeDraft(){if(active){state.drafts[draftKey(active)]=$('speakingNote').value;save()}}
function useQuestion(a){if((typeof recorder!=='undefined'&&recorder?.state==='recording')||(typeof recognition!=='undefined'&&recognition)){$('focusStatus').textContent='请先停止当前录音或转文字，再切换题目。';location.hash='speaking';return}storeDraft();if(!active&&$('speakingNote').value.trim()){state.drafts.previousFreeNote=$('speakingNote').value;save();$('draftRestore').hidden=false}
$('focusStatus').textContent='当前题目已准备好；填写英文回答后再保存。';active={topic:a.topic,part:a.part||2,question:a.question};state.active=active;save();showBriefingPractice(active.topic+' · Part '+active.part,active.question);
$('focusQuestion').textContent=active.question;$('focusLabel').textContent=active.topic+' · Part '+active.part;$('focusSave').disabled=false;$('focusListen').disabled=false;
$('speakingNote').value=state.drafts[draftKey(active)]||'';$('speakingNote').dispatchEvent(new Event('input'));
$('focusFeedback').innerHTML='<p>先直接回答，再补原因和例子。可使用下方录音及转文字；录音本身不会被自动分析。</p>';
$('practiceTopic').value=active.topic;$('practiceTopic').dispatchEvent(new Event('change'));
if(location.hash!=='#speaking')location.hash='speaking';setTimeout(()=>$('focusedPractice').scrollIntoView({block:'start',behavior:'smooth'}),0)}
function saveAnswer(a){if(!C.metrics(a.text).words)return false;const next=C.merge(state.attempts,[a]),old=state.attempts;state.attempts=next;if(!save()){state.attempts=old;return false}drawHome();drawHistory();return true}
$('focusSave').onclick=()=>{if(!active)return;const text=$('speakingNote').value.trim();if(text.length>30000){$('focusStatus').textContent='回答过长，请控制在 30000 字符以内。';return}if(!C.metrics(text).words){$('focusStatus').textContent='请先填写英文回答或补全录音转写；音频不会自动计分。';return}const a={...active,id:uid(),text,at:Date.now(),source:'单题练习'};if(!saveAnswer(a)){$('focusStatus').textContent='未能保存，请检查浏览器存储或导出备份。';return}storeDraft();$('focusFeedback').innerHTML=feedbackHTML(text,a.part)+comparisonHTML(a);$('focusStatus').textContent='已保存。本次重点练上面的两项，再点击“清空草稿重答”。'};
$('focusRetry').onclick=()=>{if(!active)return;storeDraft();$('speakingNote').value='';$('speakingNote').dispatchEvent(new Event('input'));$('focusStatus').textContent='已准备同一道题；已保存的回答仍在练习记录中。';$('speakingNote').focus()};
$('focusSaveBottom').onclick=()=>{if(!active){$('focusStatus').textContent='请先选择并开始一道题，再保存回答。'}else $('focusSave').click();$('focusedPractice').scrollIntoView({block:'start',behavior:'smooth'})};
$('practiceUse').onclick=()=>{const t=topics.find(t=>t.id===$('practiceTopic').value);useQuestion({topic:t.id,part:1,question:t.p1})};
$('focusListen').onclick=()=>{if(active){const b=document.createElement('button');b.dataset.say=active.question;speak(b)}};
$('focusStart').onclick=()=>useQuestion({topic:$('practiceTopic').value,part:2,question:questionFor($('practiceTopic').value)});
$('draftRestore').hidden=!state.drafts.previousFreeNote;$('draftRestore').onclick=()=>{storeDraft();active=null;state.active=null;save();$('speakingNote').value=state.drafts.previousFreeNote||'';$('speakingNote').dispatchEvent(new Event('input'));$('focusSave').disabled=true;$('focusListen').disabled=true;$('focusLabel').textContent='自由练习';$('focusQuestion').textContent='已恢复切换前的自由草稿。'};
$('speakingNote').addEventListener('input',storeDraft);
$('dailyRead').onclick=()=>{location.hash='news';if(latestIssue)openIssue(latestIssue,false)};
$('dailyWords').onclick=()=>{const d=today();$('reviewMode').value=d.goal?'due':'new';$('reviewMode').dispatchEvent(new Event('change'));location.hash='flashcards'};
$('dailySpeak').onclick=()=>useQuestion({topic:recommend(),part:2,question:questionFor(recommend())});
document.addEventListener('eap:reviewed',e=>{const d=today();if(!d.reviewed.includes(e.detail.term))d.reviewed.push(e.detail.term);save();drawHome()});
function articleTools(){if(typeof currentIssue==='undefined'||!currentIssue)return;latestIssue=latestIssue||currentIssue.id;const article=currentIssue.articles[page],token=currentIssue.id+':'+page;
const b=document.createElement('button');b.type='button';b.id='dailyMarkRead';const update=()=>{b.textContent=today().read.includes(token)?'今日已读':'标记这篇已读'};update();b.onclick=()=>{const d=today();if(!d.read.includes(token))d.read.push(token);save();update();drawHome()};$('readerArticle').querySelector('.toolbar').append(b);
}
document.addEventListener('eap:article',articleTools);
document.addEventListener('eap:exam-start',()=>{examSession=uid()});
document.addEventListener('eap:exam-feedback',e=>{if(!examSession)examSession=uid();let saved=0;for(const [i,a] of e.detail.answers.entries()){if(C.metrics(a.text||'').words){const id='exam:'+examSession+':'+i,old=state.attempts.find(x=>x.id===id);if(saveAnswer({id,topic:a.topic,part:a.part,question:a.question,text:a.text.slice(0,30000),at:old?.at||Date.now(),source:'模拟考试'}))saved++}}$('examHistoryStatus').textContent=saved?'已将 '+saved+' 题文字回答保存到口语练习记录；修改转写后再次分析会更新本次记录。':'尚未保存英文回答；补全转写后再次分析即可保存。'});
document.addEventListener('eap:screen',()=>{drawHome();if(location.hash.startsWith('#speaking'))drawHistory()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)drawHome()});setInterval(drawHome,60000);
window.EAPLearning={useQuestion,exportData:()=>JSON.parse(JSON.stringify(state)),validData:d=>d&&Array.isArray(d.attempts)&&d.attempts.every(a=>C.validAttempt(a,ids))&&d.days&&typeof d.days==='object'&&!Array.isArray(d.days)&&Object.values(d.days).every(v=>v&&Array.isArray(v.read)&&v.read.every(x=>typeof x==='string')&&Array.isArray(v.reviewed)&&v.reviewed.every(x=>typeof x==='string')&&Number.isInteger(v.goal)&&v.goal>=0&&v.goal<=5)&&d.drafts&&typeof d.drafts==='object'&&!Array.isArray(d.drafts)&&Object.values(d.drafts).every(v=>typeof v==='string'&&v.length<=30000),importData:d=>{state.attempts=C.merge(state.attempts,d.attempts);for(const [day,v] of Object.entries(d.days)){if(!/^\d{4}-\d{2}-\d{2}$/.test(day))continue;const old=state.days[day];state.days[day]=old?{...old,read:[...new Set([...old.read,...v.read])],reviewed:[...new Set([...old.reviewed,...v.reviewed])]}:v}state.drafts=Object.assign(Object.create(null),d.drafts,state.drafts);if(!save())throw Error('storage');drawHome();drawHistory()}};
if(state.active&&ids.includes(state.active.topic)&&[1,2].includes(state.active.part)&&typeof state.active.question==='string'){active=state.active;$('focusQuestion').textContent=active.question;$('focusLabel').textContent=active.topic+' · Part '+active.part;$('focusSave').disabled=false;$('focusListen').disabled=false;showBriefingPractice(active.topic+' · Part '+active.part,active.question)}
drawHome();drawHistory();articleTools();
})();
