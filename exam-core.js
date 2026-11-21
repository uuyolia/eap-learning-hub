/* Original practice questions aligned with EAP047 course themes; not exam questions. */
(function(root){
'use strict';
const TOPICS=[
  {
    "id": "University",
    "zh": "大学生活",
    "p1": "Describe a challenge you faced when starting university.",
    "p2": [
      "What services can students use at university?",
      "Why do some first-year students find university life difficult?",
      "What would you suggest to a student who feels lonely?",
      "Should universities require all first-year students to live on campus?"
    ],
    "keywords": [
      "university",
      "campus",
      "student",
      "freshman",
      "lecture",
      "timetable"
    ]
  },
  {
    "id": "Communication",
    "zh": "沟通与社交媒体",
    "p1": "Describe a time when you communicated successfully with someone.",
    "p2": [
      "What are some common ways people communicate?",
      "Why can misunderstandings happen online?",
      "How could students improve communication in a group project?",
      "Do you think social media improves relationships overall?"
    ],
    "keywords": [
      "communicat",
      "social media",
      "online",
      "message",
      "listen",
      "conversation"
    ]
  },
  {
    "id": "Health",
    "zh": "健康与饮食",
    "p1": "Describe a healthy habit you have developed or would like to develop.",
    "p2": [
      "What does a balanced diet mean?",
      "Why do some students find it difficult to stay healthy?",
      "What could universities do to improve student wellbeing?",
      "Should governments limit advertising for unhealthy food?"
    ],
    "keywords": [
      "health",
      "diet",
      "food",
      "exercise",
      "vaccin",
      "disease",
      "wellbeing"
    ]
  },
  {
    "id": "Jobs",
    "zh": "工作与职业",
    "p1": "Describe a job you would like to do in the future.",
    "p2": [
      "What are some useful skills for a part-time job?",
      "Why do employers value work experience?",
      "How could students balance a job with their studies?",
      "Will technology create more jobs than it removes?"
    ],
    "keywords": [
      "job",
      "career",
      "employ",
      "workplace",
      "entrepreneur",
      "skill"
    ]
  },
  {
    "id": "People",
    "zh": "人物与社会流动",
    "p1": "Describe a person you admire and explain why.",
    "p2": [
      "What does being open-minded mean?",
      "Why do people choose to move to another country?",
      "How could communities help newcomers settle in?",
      "Do you think personality changes as people grow older?"
    ],
    "keywords": [
      "person",
      "personality",
      "migrat",
      "refugee",
      "community",
      "rohingya"
    ]
  },
  {
    "id": "Environment",
    "zh": "环境与可持续生活",
    "p1": "Describe an environmental problem that affects your hometown.",
    "p2": [
      "What are some common types of pollution?",
      "Why is reducing plastic waste difficult?",
      "What could students do to live more sustainably?",
      "Can economic growth and environmental protection be achieved together?"
    ],
    "keywords": [
      "environment",
      "climate",
      "pollut",
      "energy",
      "sustainab",
      "renewab"
    ]
  },
  {
    "id": "Technology",
    "zh": "科技与人工智能",
    "p1": "Describe a technology that has changed how you study or communicate.",
    "p2": [
      "What is generative artificial intelligence?",
      "Why is cybersecurity important for students?",
      "How could students use AI responsibly in their studies?",
      "Should universities restrict the use of generative AI?"
    ],
    "keywords": [
      "technolog",
      "artificial",
      " ai",
      "chip",
      "cyber",
      "esport"
    ]
  },
  {
    "id": "Education",
    "zh": "教育与学习习惯",
    "p1": "Describe a study method that works well for you.",
    "p2": [
      "What are some effective study habits?",
      "Why do some students prefer learning in groups?",
      "What advice would you give someone who often procrastinates?",
      "Should financial literacy be a compulsory university subject?"
    ],
    "keywords": [
      "educat",
      "learn",
      "study",
      "course",
      "teaching",
      "financial literacy"
    ]
  },
  {
    "id": "Places",
    "zh": "城市与交通",
    "p1": "Describe a city you have visited or would like to visit.",
    "p2": [
      "What types of public transport are common in cities?",
      "Why do people move from the countryside to cities?",
      "How could a city reduce traffic congestion?",
      "Should city centres limit the use of private cars?"
    ],
    "keywords": [
      "city",
      "cities",
      "transport",
      "traffic",
      "travel",
      "urban"
    ]
  },
  {
    "id": "Change",
    "zh": "变化与未来技能",
    "p1": "Describe an important change you have experienced.",
    "p2": [
      "What are some skills people may need in the future?",
      "Why can people find change stressful?",
      "How could universities prepare students for a changing workplace?",
      "Do you think rapid technological change always improves people's lives?"
    ],
    "keywords": [
      "change",
      "future",
      "adapt",
      "innovation",
      "progress",
      "automation"
    ]
  }
];
const RUBRIC=[
{id:'part1',name:'Part 1 内容发展',max:20,levels:[0,4,8,12,16,20],hint:'检查是否切题，并用具体细节、解释、经历支持回答。'},
{id:'part2',name:'Part 2 内容发展',max:20,levels:[0,4,8,12,16,20],hint:'检查是否直接回应追问，并解释原因、提供例子。'},
{id:'fluency',name:'流利度与衔接',max:15,levels:[0,3,6,9,12,15],hint:'必须回听录音：停顿是否自然，回答是否连贯。'},
{id:'vocabulary',name:'词汇',max:15,levels:[0,3,6,9,12,15],hint:'检查主题词、搭配和改述能力，不能只数生词。'},
{id:'grammar',name:'语法',max:15,levels:[0,3,6,9,12,15],hint:'检查句式范围和错误是否影响理解。'},
{id:'pronunciation',name:'发音',max:15,levels:[0,3,6,9,12,15],hint:'必须回听录音：可懂度、单词音、重音和语调。'}
];
function pair(exclude,random=Math.random){const list=TOPICS.filter(t=>t.id!==exclude).slice();for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list.slice(0,2)}
function words(text){return (text.match(/[a-z]+(?:'[a-z]+)?/gi)||[])}
function analyse(answers){
const rows=answers.map((a,i)=>{const tokens=words(a.text||'');const hasReason=/\b(because|since|therefore|as a result|this means|the reason)\b/i.test(a.text||'');const hasExample=/\b(for example|for instance|such as|when i|in my experience|i remember)\b/i.test(a.text||'');const term=(a.text||'').toLowerCase();const matched=(a.keywords||[]).filter(k=>term.includes(k));
const enough=tokens.length>=(i===0?45:15);const points=(tokens.length?10:0)+(enough?4:0)+(hasReason?3:0)+(hasExample?3:0);
const suggestions=[];if(!tokens.length)suggestions.push('补上这题回答或转写，再做分析。');else{if(!enough)suggestions.push('增加具体细节和解释；当前文本较短，可能是转写不完整。');if(!hasReason)suggestions.push('解释 why/how；如用 because 引出原因。');if(!hasExample)suggestions.push('补充一个自己的经历、具体场景或可靠案例。');if(!matched.length)suggestions.push('没有检测到预设主题词，请人工确认是否切题；同义表达可能未被识别。')}
return {question:a.question,text:a.text||'',wordCount:tokens.length,hasReason,hasExample,matched,points,suggestions}
});
return {score:rows.reduce((s,r)=>s+r.points,0),max:answers.length*20,rows,label:'文本训练覆盖分（规则统计，非考试预测分）'};
}
function officialTotal(values){if(RUBRIC.some(r=>values[r.id]==null||!r.levels.includes(Number(values[r.id]))))return null;return RUBRIC.reduce((sum,r)=>sum+Number(values[r.id]),0)}
root.EAPExamCore={TOPICS,RUBRIC,pair,analyse,officialTotal};
})(globalThis);