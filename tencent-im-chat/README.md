# AI 聊天应用 - 腾讯云 IM

基于 Vue3 + TypeScript + 腾讯云 IM 开发的现代化聊天应用，界面参考 DeepSeek 和豆包的设计风格。

## 功能特性

- ✨ 现代化深色主题 UI 设计
- 💬 实时消息发送与接收
- 📝 流式输出打字机效果
- 📱 会话列表管理
- 🔄 自动保存登录信息
- 🎨 响应式布局
- ⚡ TypeScript 类型安全

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS 4
- **IM SDK**: 腾讯云 IM SDK (tim-js-sdk)

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 获取腾讯云 IM 配置

1. 登录 [腾讯云 IM 控制台](https://console.cloud.tencent.com/im)
2. 创建应用，获取 **SDKAppID**
3. 生成测试用户的 **UserSig**

### 3. 启动开发服务器

```bash
pnpm dev
```

应用将在 http://localhost:5000 启动。

### 4. 登录应用

使用腾讯云 IM 控制台获取的配置信息登录：
- **SDKAppID**: 你的应用 ID
- **用户ID**: 自定义的用户标识
- **UserSig**: 用户签名（可在控制台生成）

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── ChatArea.vue     # 聊天区域
│   ├── ChatSidebar.vue  # 侧边栏
│   ├── InputArea.vue    # 输入区域
│   ├── MessageItem.vue  # 消息项
│   └── MessageList.vue  # 消息列表
├── stores/              # 状态管理
│   ├── chat.ts          # 聊天状态
│   └── user.ts          # 用户状态
├── services/            # 服务层
│   └── timService.ts    # 腾讯云 IM 封装
├── types/               # 类型定义
│   └── index.ts
├── views/               # 页面
│   ├── ChatView.vue     # 聊天页面
│   └── LoginView.vue    # 登录页面
├── router/              # 路由配置
│   └── index.ts
├── App.vue              # 根组件
├── main.ts              # 入口文件
└── style.css            # 全局样式
```

## 核心功能说明

### 消息发送

通过 `InputArea` 组件输入消息，支持：
- Enter 发送消息
- Shift + Enter 换行
- 自动调整输入框高度

### 流式输出

模拟 AI 响应的打字机效果，通过 `simulateAIResponse` 函数实现逐字显示。

### 会话管理

- 左侧侧边栏显示所有会话
- 点击会话可切换聊天
- 显示未读消息数量

## 开发命令

```bash
# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 类型检查
npx tsc --noEmit
```

## 注意事项

1. **UserSig 有效期**: 测试环境生成的 UserSig 有效期为 180 天
2. **网络环境**: 需要能够访问腾讯云 IM 服务器
3. **HTTPS**: 生产环境建议使用 HTTPS
4. **跨域**: 确保 API 配置了正确的跨域策略

## 参考文档

- [腾讯云 IM 文档](https://cloud.tencent.com/document/product/269)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 许可证

MIT
