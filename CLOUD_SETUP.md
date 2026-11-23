# 邮箱账号与云同步

## 已配置
- 专用项目：eap-learning-hub-uuyolia。
- Firebase Authentication：Email/Password；网页要求先验证邮箱。
- Cloud Firestore Standard：(default)，新加坡 asia-southeast1，免费额度。
- 授权网站：uuyolia.github.io；继续地址 https://uuyolia.github.io/eap-learning-hub/ 。
- Web App：1:295860899751:web:03bab651025c1e2dd3f082。
- cloud-config.json 只保存公开 Web 配置，禁止提交管理员凭据、服务账号私钥或令牌。

## 首次使用
打开网站“记录与设置”，使用自己的邮箱注册，点击邮箱里的验证链接，再回到网站点“已验证，重新检查”。在另一台设备登录同一邮箱账号，等待“已同步”。不同的人注册各自账号。
旧版本机记录不会自动上传或删除；登录后选择旧版档案并点击导入。第一次更换设备前建议在原设备确认“已同步”并下载备份。录音仍须下载，不同步。

## 数据与冲突
文档 users/{Auth uid}/records/{recordKey} 仅含 value、revision、updatedAt。
同步 eap_review_v3、eap_cases_v3、eap_saved_v2、eap_note_v2、eap_personal_language_v1、eap_learning_v1。
数据库根据真实认证 uid 和 email_verified 授权；sessionStorage 账号提示仅用于本机缓存隔离，不能授予服务器权限。
本机账号缓存按 uid 隔离。冲突保留两份，可下载后选一份；三方合并可保留独立修改和已取消的收藏。自动同步避开录音、考试、输入与单词卡练习。

## 已执行验证（2026-11-23）
Firebase 官方规则检查：OK，无语法错误。
真实服务临时账号测试：
- 未登录读写被拒绝；未验证邮箱写入被拒绝。
- 已验证账号 A 的一个客户端写入，另一独立客户端恢复，反向编辑也能读回。
- 账号 B 读取和修改 A 的文档均被拒绝。
- 过期版本、非允许记录、额外字段、集合列表、客户端删除均被拒绝。
- 退出会话后无法向服务器读取原账号数据。
- 官方验证邮件/重置密码链接可生成，本站返回域名配置通过。
另已运行前端语法、账号命名空间、三方合并与冲突测试。

上述是两个独立客户端会话测试，不是两部实物手机验收。真实邮箱送达、用户手机浏览器首次注册/登录及麦克风兼容性仍需在实际设备确认；不从链接生成测试推断邮件一定送达。规则按当前数据模型验证，不代表绝对安全或替代后续维护。

## 后续维护
修改规则后先通过语法和权限测试，再部署。不得使用开放测试规则。
GitHub Pages 只发布公开网站文件；Firebase 配置、数据保护规则与云服务分别维护。不要把私人学习记录写入公共仓库。每日新闻更新须保留 cloud-core.js、cloud.js、cloud-config.json、profiles.js 及 EAPStorage 账号隔离功能。

官方文档：
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/auth/web/manage-users
- https://firebase.google.com/docs/firestore/security/rules-conditions
