# Git 仓库设置指南

项目已初始化 Git 仓库，可以推送到 GitHub、GitLab 或其他 Git 托管平台。

## 📋 当前状态

✅ Git 仓库已初始化
✅ 所有文件已提交到本地仓库
✅ 提交信息: `feat: 基于 Vue3 + TypeScript + 腾讯云 IM 实现 AI 聊天应用`

## 🚀 推送到 GitHub

### 方法 1: 通过 GitHub 网页界面

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 `+` → `New repository`
3. 填写仓库信息：
   - **Repository name**: `tencent-im-chat`（或其他你喜欢的名字）
   - **Description**: `基于 Vue3 + TypeScript + 腾讯云 IM 的 AI 聊天应用`
   - **Public/Private**: 根据需要选择
4. 点击 `Create repository`
5. **重要**: 不要勾选 "Initialize this repository with a README"
6. 创建后，GitHub 会显示推送命令，复制下面的命令执行：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/tencent-im-chat.git

# 推送到远程仓库
git branch -M main
git push -u origin main
```

### 方法 2: 使用 GitHub CLI

如果你安装了 GitHub CLI：

```bash
# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create tencent-im-chat --public --source=. --remote=origin --push
```

## 🚀 推送到 GitLab

1. 访问 [GitLab](https://gitlab.com) 并登录
2. 点击 `New Project`
3. 选择 `Create blank project`
4. 填写项目信息：
   - **Project name**: `tencent-im-chat`
   - **Visibility Level**: Public / Private
5. 点击 `Create project`
6. 推送代码：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitLab 用户名）
git remote add origin https://gitlab.com/YOUR_USERNAME/tencent-im-chat.git

# 推送到远程仓库
git branch -M main
git push -u origin main
```

## 🚀 推送到 Gitee（码云）

1. 访问 [Gitee](https://gitee.com) 并登录
2. 点击右上角的 `+` → `新建仓库`
3. 填写仓库信息
4. 创建后，推送代码：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 Gitee 用户名）
git remote add origin https://gitee.com/YOUR_USERNAME/tencent-im-chat.git

# 推送到远程仓库
git branch -M main
git push -u origin main
```

## 📥 Clone 项目到本地

推送成功后，其他人可以通过以下命令克隆项目：

```bash
# GitHub
git clone https://github.com/YOUR_USERNAME/tencent-im-chat.git

# GitLab
git clone https://gitlab.com/YOUR_USERNAME/tencent-im-chat.git

# Gitee
git clone https://gitee.com/YOUR_USERNAME/tencent-im-chat.git

# 进入项目目录
cd tencent-im-chat

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🔧 常用 Git 命令

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull origin main

# 提交更改
git add .
git commit -m "你的提交信息"
git push
```

## 💡 提示

1. **SSH vs HTTPS**: 推荐使用 SSH 方式，可以避免每次推送都输入密码
   ```bash
   # SSH 方式
   git remote set-url origin git@github.com:YOUR_USERNAME/tencent-im-chat.git
   ```

2. **配置 Git 全局用户信息**（如果还没配置）：
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **忽略文件**: 项目已配置 `.gitignore`，会自动忽略 `node_modules`、`dist` 等文件

## 📦 项目依赖

项目使用 `pnpm` 作为包管理器，确保已安装：

```bash
# 安装 pnpm（如果还没安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

## 🎯 快速开始

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd tencent-im-chat

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 访问 http://localhost:5000
```

现在你可以将项目推送到任何 Git 托管平台了！🎉
