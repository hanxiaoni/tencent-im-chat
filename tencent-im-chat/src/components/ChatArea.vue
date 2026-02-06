<template>
  <div class="flex-1 flex flex-col bg-[#0d0d0d]">
    <!-- 标题栏 -->
    <div class="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#141414]">
      <div class="flex items-center gap-3">
        <div
          v-if="currentConversation"
          class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <span class="text-white font-medium text-sm">
            {{ getAvatarText(currentConversation.name) }}
          </span>
        </div>
        <div>
          <h2 v-if="currentConversation" class="text-white font-semibold">
            {{ currentConversation.name }}
          </h2>
          <h2 v-else class="text-white font-semibold">AI 聊天助手</h2>
          <p class="text-gray-500 text-xs">在线</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('clear-chat')"
          class="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="清空对话"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="设置"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 消息列表 -->
    <MessageList ref="messageListRef" :messages="messages" />

    <!-- 输入区域 -->
    <InputArea ref="inputAreaRef" @send="handleSend" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MessageList from './MessageList.vue';
import InputArea from './InputArea.vue';
import type { Message, Conversation } from '../types';

const props = defineProps<{
  messages: Message[];
  currentConversation?: Conversation | null;
}>();

const emit = defineEmits<{
  send: [text: string];
  'clear-chat': [];
}>();

const messageListRef = ref<InstanceType<typeof MessageList> | null>(null);
const inputAreaRef = ref<InstanceType<typeof InputArea> | null>(null);

// 处理发送消息
function handleSend(text: string) {
  emit('send', text);
}

// 获取头像文本
function getAvatarText(name: string): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

// 监听会话变化，聚焦输入框
watch(
  () => props.currentConversation,
  () => {
    setTimeout(() => {
      inputAreaRef.value?.focus();
    }, 100);
  }
);
</script>
