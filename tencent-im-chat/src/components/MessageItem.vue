<template>
  <div
    :class="[
      'flex gap-3 mb-4 animate-fade-in',
      direction === 'sent' ? 'flex-row-reverse' : 'flex-row',
    ]"
  >
    <!-- 头像 -->
    <div
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
        direction === 'sent' ? 'bg-blue-600' : 'bg-gray-700',
      ]"
    >
      {{ avatarText }}
    </div>

    <!-- 消息内容 -->
    <div
      :class="[
        'max-w-[70%] rounded-2xl px-4 py-3',
        direction === 'sent'
          ? 'bg-blue-600 text-white rounded-br-md'
          : 'bg-gray-800 text-gray-100 rounded-bl-md',
      ]"
    >
      <div class="text-sm leading-relaxed whitespace-pre-wrap break-words">
        {{ displayContent }}
        <span v-if="isStreaming" class="cursor-blink ml-1">|</span>
      </div>
      
      <!-- 时间戳 -->
      <div
        :class="[
          'text-xs mt-1',
          direction === 'sent' ? 'text-blue-200' : 'text-gray-500',
        ]"
      >
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  direction: 'sent' | 'received';
  content: string;
  timestamp: number;
  from?: string;
  isStreaming?: boolean;
}>();

// 头像文本
const avatarText = computed(() => {
  if (props.from && props.from.length > 0) {
    return props.from.charAt(0).toUpperCase();
  }
  return props.direction === 'sent' ? '我' : 'AI';
});

// 显示内容（支持 Markdown 简单格式）
const displayContent = computed(() => {
  return props.content;
});

// 格式化时间
const formattedTime = computed(() => {
  const date = new Date(props.timestamp);
  const now = new Date();
  
  // 如果是今天，只显示时间
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // 否则显示日期和时间
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
