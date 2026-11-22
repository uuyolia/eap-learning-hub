# EAP 邮箱账号与云同步启用清单

当前代码已经准备了 Firebase 邮箱密码登录、邮件验证、密码重置、每账号存储、离线待同步、三方合并、冲突备份和旧版记录迁移。cloud-config.json 默认 enabled:false，因此未连接服务时不会显示可用登录表单，也不会声称同步已启用。

## 必须完成的真实服务配置
1. 在用户自己的 Firebase 项目启用 Authentication 的 Email/Password，并启用邮箱验证流程。
2. 创建 Cloud Firestore 数据库。账号隔离规则原型需要在 Firebase CLI 可运行后完成语法验证和两账号权限测试，再提交并部署正式 firestore.rules；不能使用公开测试规则。
3. 将 uuyolia.github.io 加入 Authentication 的授权域名，验证与密码重置的继续地址设为 https://uuyolia.github.io/eap-learning-hub/ 。
4. 注册 Web App，将其公开 firebaseConfig 中 apiKey/authDomain/projectId/appId 写入 cloud-config.json，配置完成后才将 enabled 设为 true。这些是 Web 公开配置，禁止提交服务账号 JSON 私钥、管理员凭据或访问令牌。
5. 用两个测试账号验证：未登录无法读写；未验证邮箱无法读写；A 无法读写 users/B/records；同账号两台设备能同步；同键并发修改不会静默丢失；退出账号后显示另一份隔离记录；验证邮件与密码重置邮件可到达。
6. 更新 GitHub Pages 后，用真实账号在两台设备完成端到端验收，才能报告云同步可用。

## 数据结构与范围
文档路径：users/{Firebase Auth uid}/records/{recordKey}。
每个文档仅含 value（原有记录的字符串）、revision、updatedAt。数据库规则按认证 uid 和 email_verified 授权，而不是依赖前端账号名称。
同步六类现有记录：eap_review_v3、eap_cases_v3、eap_saved_v2、eap_note_v2、eap_personal_language_v1、eap_learning_v1。
录音文件当前仍只供下载，不在此次文字记录同步范围。
本机账号缓存按 uid 隔离；旧版本机档案不自动归属于任何邮箱，登录后需主动选择合并。
自动同步在停止录音、结束模拟考试、文本框失焦后执行，避免中途替换当前练习。
冲突原稿暂存本机 eap_cloud_conflict_backup_v1，可下载两份再选择保留哪份。
多设备数组和对象采用以共同基线为参照的三方合并；同一字段的冲突不盲目覆盖。

## 相关官方文档
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/auth/web/manage-users
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/web/setup
