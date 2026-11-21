# EAP Learning Hub

在线地址：https://uuyolia.github.io/eap-learning-hub/

原第 1 期五篇主题文章、16 词、15 句型保留在 index.html，增强功能使用 app.js 与 app.css。无 JavaScript 时仍可阅读原内容。

## 学习功能

- 生词、熟词分类；熟词不进入常规复习，可重新标记为生词。
- 间隔为 1、2、4、7、15、30 天；忘记则 10 分钟后复习。这是固定间隔算法，不是个体遗忘曲线测量。到期提醒仅在打开网页时显示。
- 个人数据存在浏览器 localStorage；保留旧 eap_saved_v2、eap_note_v2。支持下载和合并导入 v3 JSON 备份。不自动跨设备同步。
- Speaking：MediaRecorder 录音，动态检测 MP4/WebM/OGG，试听和下载；录音不上传、不跨刷新保存。可选已有音频试听。网页录音需 HTTPS 与麦克风授权。
- SpeechRecognition 在支持时提供实时英文转写；浏览器可能调用在线服务。iPhone 可用系统键盘听写替代。选入音频不自动转写。
- 反馈仅统计词数及连接表达，不能判断语法准确性、发音、语调或流利度。专业语音评测需另接服务、后端与密钥；不得把服务密钥放进静态网页。
- 新闻按日期归档，一期五篇，逐篇翻页。素材库自动收录公共案例，另可本地写笔记、按主题/日期/关键词筛选和新增每日素材。
- assets/topic.svg 为本站原创示意插图，非现场照片，无第三方新闻照片授权依赖。

## 聊天简报同步与上线

优先展示「🐾」中的每日双语简报，迁入 2026-11-20 和 2026-11-21 两期，每期五篇，保留双语摘要、Why it matters、口语题、回答思路、表达和来源链接。每期 Speaking Challenge 随所选期数切换，任意文章可点击“练习这一题”。报道与数字迁移时未独立核验，页面逐篇保留说明。模拟题不等同于老师给出的正式考试话题。

停止 NASA 单一来源的定时抓取，保留既有科学档案与 scripts/update_news.py 作为历史工具。GitHub Actions 仅在 main 推送或手动触发时发布网站，不读取私人 ChatGPT 聊天。

后续由 Codex 的独立定时任务读取来源聊天中新的完整五篇简报，按日期去重后提交到 data/，由 Pages 发布。它依赖该任务可运行且能读取聊天、写入 GitHub；无新简报时保留网站现状。不能把部署工作流存在等同于每天一定已同步成功。

数据契约：data/issues.json 是期数索引；每个 file 指向含五篇 articles 的 JSON；data/materials.json 为累计公共素材。新增 articles 字段：whyItMatters、speakingHint、expressions、sources、verification；期数可含 speaking.text。个人学习记录继续留在浏览器中，不进入公共仓库。

在线地址：https://uuyolia.github.io/eap-learning-hub/
