# Git 推送指南

## 📝 完整推送步骤

### 1. 创建 GitHub 仓库
访问：https://github.com/new
- Repository name: `tencent-im-chat`
- 不勾选 "Initialize this repository with a README"

### 2. 添加远程仓库
```bash
cd /workspace/projects/tencent-im-chat

# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/tencent-im-chat.git

# 验证配置
git remote -v
```

### 3. 推送代码

#### 使用 Personal Access Token（推荐新手）
```bash
# 推送时会提示输入用户名和密码
git push -u origin main

# Username: your-github-username
# Password: <粘贴你的 Personal Access Token>
```

#### 使用 SSH（推荐长期使用）
```bash
# 切换到 SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/tencent-im-chat.git

# 推送
git push -u origin main
```

---

## 🔐 如何获取 Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. Note: `Tencent IM Chat`
4. Expiration: `90 days`
5. 勾选 `repo` 权限
6. 点击 "Generate token"
7. **复制 token（只显示一次）**

---

## 🔑 如何配置 SSH 密钥

1. 生成密钥：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按回车 3 次
```

2. 查看公钥：
```bash
cat ~/.ssh/id_ed25519.pub
# 复制整个内容
```

3. 添加到 GitHub：
- 访问：https://github.com/settings/keys
- 点击 "New SSH key"
- 粘贴公钥
- 点击 "Add SSH key"

4. 测试：
```bash
ssh -T git@github.com
```

---

## ❓ 常见问题

### Q: 403 错误
**A**: 检查：
1. 仓库是否已创建
2. 用户名是否正确（GitHub 用户名，不是昵称）
3. Token 是否有 `repo` 权限

### Q: 认证失败
**A**: 使用 Personal Access Token 而不是 GitHub 密码

### Q: 找不到仓库
**A**: 确认仓库 URL 格式正确：`https://github.com/用户名/仓库名.git`

---

## 📌 快速命令模板

```bash
# 1. 进入项目目录
cd /workspace/projects/tencent-im-chat

# 2. 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/tencent-im-chat.git

# 3. 推送代码
git push -u origin main
```

如果提示输入密码，粘贴你的 Personal Access Token。
