# Claude Code 权限配置笔记

## 1. 减少权限弹窗：fewer-permission-prompts

已扫描近期会话记录，将高频只读命令加入项目白名单。

**已添加（`project/.claude/settings.json`）：**

| Pattern | 说明 |
|---------|------|
| `Bash(curl -s *)` | 检查网站状态、API 响应、部署结果 |
| `Bash(npx netlify-cli sites:list)` | 查看 Netlify 站点列表 |
| `Bash(npx netlify-cli status)` | 查看 Netlify 项目状态 |
| `Bash(npx netlify-cli api getCurrentUser)` | 查看当前 Netlify 用户 |
| `Bash(npx netlify-cli api getSite --data *)` | 查看指定站点详情 |

**已自动放行（无需配置）：**
`ls`、`grep`、`head`、`tail`、`cat`、`wc`、`find`、`sed`、`git status`、`git diff`、`git log`、`git branch`、`git remote`、`ps`、`sleep`、`which`、`diff` 等。

**不能加入白名单（安全原因）：**
- 写操作：`cp`、`git add`/`commit`/`push`、`npx netlify-cli deploy`、`mkdir`、`chmod`、`rm`、`pip3 install`
- 解释器/任意代码执行：`python3 -c`、`python3 <<`、`node -e`、`ssh`、`npx localtunnel`

---

## 2. Role-Based Permission（分层权限）

Claude Code 按四级层级覆盖配置，越靠下优先级越高：

```
全局 settings.json          ← 最低优先级，所有项目通用
全局 settings.local.json      ← 覆盖全局，放个人敏感信息
项目 settings.json            ← 只对当前项目生效
项目 settings.local.json       ← 最高优先级，本机临时覆盖
```

### 角色分配建议

| 角色 | 对应文件 | 应该放什么 |
|------|---------|-----------|
| 公司基础员工 | `~/.claude/settings.json` | 所有项目通用的安全只读操作 |
| 个人敏感信息 | `~/.claude/settings.local.json` | API Token、环境变量、个人偏好 |
| 项目组成员 | `project/.claude/settings.json` | 项目特有的权限 |
| 本机开发者 | `project/.claude/settings.local.json` | 临时信任的命令，不上传 Git |

### 关键规则

1. **越具体越优先**：项目级 > 全局级。
2. **`.local.json` 不提交到 Git**：适合放 Token、个人路径。
3. **权限是累加的**：四级配置的 `permissions.allow` 会合并，不是谁覆盖谁。

---

## 3. 当前配置现状（word-match-game 项目）

| 层级 | 文件 | 状态 |
|------|------|------|
| 全局基础角色 | `~/.claude/settings.json` | 已配置（Netlify/Git/curl 等大量权限） |
| 全局敏感角色 | `~/.claude/settings.local.json` | 已配置（Git 操作权限） |
| 项目角色 | `word-match-game/.claude/settings.json` | 已配置（curl + Netlify 只读） |
| 项目本地角色 | `word-match-game/.claude/settings.local.json` | 已配置（文件读取权限） |
