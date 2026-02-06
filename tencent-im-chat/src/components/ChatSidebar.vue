<template>
  <div class="w-64 bg-[#0d0d0d] border-r border-gray-800 flex flex-col">
    <!-- Logo 和标题 -->
    <div class="p-4 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h1 class="text-white font-semibold text-lg">AI 聊天</h1>
          <p class="text-gray-500 text-xs">智能对话助手</p>
        </div>
      </div>
    </div>

    <!-- 新建对话按钮 -->
    <div class="p-4">
      <button
        @click="$emit('new-chat')"
        class="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-all duration-200 border border-gray-700"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>新建对话</span>
      </button>
    </div>

    <!-- 会话列表 -->
    <div class="flex-1 overflow-y-auto px-2">
      <div class="text-xs text-gray-500 px-2 py-2 font-medium uppercase tracking-wider">
        历史对话
      </div>
      
      <div
        v-for="conversation in conversations"
        :key="conversation.conversationID"
        @click="$emit('select-conversation', conversation)"
        class="group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-1"
        :class="[
          isActive(conversation)
            ? 'bg-gray-800 border border-gray-700'
            : 'hover:bg-gray-900 border border-transparent'
        ]"
      >
        <!-- 头像 -->
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0">
          <span class="text-white font-medium text-sm">
            {{ getAvatarText(conversation.name) }}
          </span>
        </div>

        <!-- 对话信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h3
              class="text-sm font-medium truncate"
              :class="isActive(conversation) ? 'text-white' : 'text-gray-300'"
            >
              {{ conversation.name }}
            </h3>
            <span v-if="conversation.unreadCount > 0" class="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              {{ conversation.unreadCount }}
            </span>
          </div>
          <p
            class="text-xs truncate mt-0.5"
            :class="isActive(conversation) ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ conversation.lastMessage || '暂无消息' }}
          </p>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="conversations.length === 0"
        class="flex flex-col items-center justify-center py-8 text-gray-500"
      >
        <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm">暂无历史对话</p>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span class="text-white font-medium text-sm">U</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">用户</p>
          <p class="text-xs text-gray-500 truncate">在线</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Conversation } from '../types';

defineProps<{
  conversations: Conversation[];
  currentConversation?: Conversation | null;
}>();

defineEmits<{
  'new-chat': [];
  'select-conversation': [conversation: Conversation];
}>();

// 获取头像文本
function getAvatarText(name: string): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

// 是否为当前选中的会话
function isActive(conversation: Conversation): boolean {
  return !!props.currentConversation?.conversationID === conversation.conversationID;
}

const props = defineProps<{
  conversations: Conversation[];
  currentConversation?: Conversation | null;
}>();
</script>
