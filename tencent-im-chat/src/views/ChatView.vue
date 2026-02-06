<template>
  <div class="h-screen flex">
    <!-- 侧边栏 -->
    <ChatSidebar
      :conversations="conversations"
      :current-conversation="currentConversation"
      @new-chat="handleNewChat"
      @select-conversation="handleSelectConversation"
    />

    <!-- 聊天区域 -->
    <ChatArea
      :messages="currentMessages"
      :current-conversation="currentConversation"
      @send="handleSendMessage"
      @clear-chat="handleClearChat"
    />
  </div>

  <!-- 登录弹窗 -->
  <div
    v-if="showLoginModal"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-[#141414] border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-4">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">登录 AI 聊天</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">SDKAppID</label>
          <input
            v-model.number="loginForm.SDKAppID"
            type="number"
            required
            placeholder="请输入 SDKAppID"
            class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">用户ID</label>
          <input
            v-model="loginForm.userID"
            type="text"
            required
            placeholder="请输入用户ID"
            class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">UserSig</label>
          <textarea
            v-model="loginForm.userSig"
            required
            placeholder="请输入 UserSig"
            rows="3"
            class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="mt-4 text-center text-xs text-gray-500">
        <p>测试账号信息可在腾讯云 IM 控制台获取</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '../stores/chat';
import { useUserStore } from '../stores/user';
import ChatSidebar from '../components/ChatSidebar.vue';
import ChatArea from '../components/ChatArea.vue';
import type { Conversation } from '../types';

const chatStore = useChatStore();
const userStore = useUserStore();

const showLoginModal = ref(false);
const loading = ref(false);
const loginForm = ref({
  SDKAppID: 0,
  userID: '',
  userSig: '',
});

// 计算属性
const conversations = ref<Conversation[]>([]);
const currentConversation = ref<Conversation | null>(null);
const currentMessages = ref<any[]>([]);

// 登录
async function handleLogin() {
  try {
    loading.value = true;

    await chatStore.login(loginForm.value);
    userStore.setLoginConfig(loginForm.value);

    // 保存到本地存储
    localStorage.setItem('tim_login_config', JSON.stringify(loginForm.value));

    showLoginModal.value = false;

    // 加载会话列表
    await loadConversations();
  } catch (error: any) {
    console.error('登录失败:', error);
    alert(`登录失败: ${error.message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
}

// 加载会话列表
async function loadConversations() {
  conversations.value = await chatStore.loadConversations();
  if (conversations.value.length > 0) {
    await handleSelectConversation(conversations.value[0]);
  }
}

// 新建对话
function handleNewChat() {
  // 这里可以实现创建新会话的逻辑
  alert('新建对话功能待实现');
}

// 选择会话
async function handleSelectConversation(conversation: Conversation) {
  currentConversation.value = conversation;
  await chatStore.selectConversation(conversation);
  currentMessages.value = chatStore.currentMessages;
}

// 发送消息
async function handleSendMessage(text: string) {
  try {
    await chatStore.sendMessage(text);
    currentMessages.value = chatStore.currentMessages;

    // 模拟 AI 回复（流式输出）
    simulateAIResponse(text);
  } catch (error: any) {
    console.error('发送消息失败:', error);
    alert(`发送失败: ${error.message || '未知错误'}`);
  }
}

// 清空对话
function handleClearChat() {
  if (confirm('确定要清空当前对话吗？')) {
    currentMessages.value = [];
  }
}

// 模拟 AI 回复（打字机效果）
function simulateAIResponse(userMessage: string) {
  const responses = [
    '这是一个模拟的 AI 回复。在实际应用中，您应该调用真实的 AI API 来获取回复。',
    '您刚才说的是：' + userMessage + '\n\n这是一个示例回复，展示打字机效果。',
    '收到您的消息！这是一个流式输出的示例，文字会逐字显示，模拟 AI 正在思考和输入的过程。',
  ];

  const responseText = responses[Math.floor(Math.random() * responses.length)];
  const messageId = `ai_${Date.now()}`;

  // 创建一个接收中的消息
  const aiMessage: any = {
    id: messageId,
    conversationID: currentConversation.value?.conversationID || '',
    from: 'ai',
    to: 'user',
    type: 'TIMTextElem',
    content: '',
    direction: 'received',
    timestamp: Date.now(),
    status: 'sent',
    isStreaming: true,
  };

  currentMessages.value.push(aiMessage);

  // 模拟流式输出
  let currentIndex = 0;
  const interval = setInterval(() => {
    if (currentIndex < responseText.length) {
      aiMessage.content = responseText.substring(0, currentIndex + 1);
      currentIndex++;
    } else {
      clearInterval(interval);
      aiMessage.isStreaming = false;
    }
  }, 30); // 每 30ms 显示一个字符
}

// 初始化
onMounted(() => {
  // 初始化监听器
  chatStore.initListeners();

  // 检查是否有保存的登录信息
  const savedConfig = localStorage.getItem('tim_login_config');
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      loginForm.value = config;
      
      // 自动登录
      handleLogin();
    } catch (error) {
      console.error('解析保存的配置失败:', error);
      showLoginModal.value = true;
    }
  } else {
    showLoginModal.value = true;
  }
});

// 清理
onUnmounted(() => {
  chatStore.cleanupListeners();
});
</script>
