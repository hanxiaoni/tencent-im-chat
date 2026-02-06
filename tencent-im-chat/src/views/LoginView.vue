<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4">
    <div class="bg-[#141414] border border-gray-800 rounded-2xl p-8 w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">AI 聊天</h1>
          <p class="text-gray-500 text-sm">智能对话助手</p>
        </div>
      </div>

      <!-- 登录表单 -->
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
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 提示信息 -->
      <div class="mt-6 text-center text-xs text-gray-500 space-y-2">
        <p>测试账号信息可在腾讯云 IM 控制台获取</p>
        <a href="https://cloud.tencent.com/document/product/269/32688" target="_blank" class="text-blue-500 hover:text-blue-400">
          查看腾讯云 IM 文档
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from '../stores/chat';
import { useUserStore } from '../stores/user';

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();

const loading = ref(false);
const loginForm = ref({
  SDKAppID: 0,
  userID: '',
  userSig: '',
});

// 登录
async function handleLogin() {
  try {
    loading.value = true;

    await chatStore.login(loginForm.value);
    userStore.setLoginConfig(loginForm.value);

    // 保存到本地存储
    localStorage.setItem('tim_login_config', JSON.stringify(loginForm.value));

    // 跳转到聊天页面
    router.push('/');
  } catch (error: any) {
    console.error('登录失败:', error);
    alert(`登录失败: ${error.message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
}
</script>
