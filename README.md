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

## 自动更新与上线

`.github/workflows/daily-news.yml` 在北京时间每天约 07:17（GitHub 定时任务可能延迟）和手动运行时读取 NASA 官方 RSS 最近五篇标题、来源时间和原文链接。当天已存档或来源没有变化则跳过；来源不足五篇/失败则不覆盖旧档案。只发布标题阅读卡，不生成双语摘要，也不假称是五篇当日新新闻。先以科学新闻运行，无需外部密钥；全面国际新闻与中文编辑需另选合法来源和生成/编辑流程。

推送 main 时部署现有数据；定时更新即使未生成 GitHub push 事件，也会在同一工作流显式部署。因此无需每天手动导入这一来源的内容。ChatGPT 里的每日新闻简报不会自动进入仓库；必须另建取得简报并提交数据的连接。

GitHub Settings → Pages → Build and deployment → Source 应为 **GitHub Actions**。若仍为 Deploy from a branch，切换后在 Actions 手动运行 Daily news and Pages。仓库/组织需允许 Actions 及此工作流的 contents:write、pages:write、id-token:write；分支保护或环境审批可能阻止自动提交/部署。工作流失败会在 Actions 中显示；不要把文件已提交等同于网站已更新。

数据契约：data/issues.json 是期数索引；每个 file 指向含五篇 articles 的 JSON；data/materials.json 为累计公共素材。脚本只添加期数，不删除旧档案。

本站是在线静态网站，初次访问和更新需要网络；当前没有离线缓存或服务器端用户账户。
