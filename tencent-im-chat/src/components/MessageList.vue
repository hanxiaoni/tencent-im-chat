<template>
  <div class="flex-1 overflow-y-auto p-6 scroll-smooth" ref="messagesContainer">
    <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
      <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <p class="text-lg">开始对话吧！</p>
    </div>

    <template v-else>
      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :direction="message.direction"
        :content="message.content"
        :timestamp="message.timestamp"
        :from="message.from"
        :is-streaming="message.isStreaming"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import MessageItem from './MessageItem.vue';
import type { Message } from '../types';

const props = defineProps<{
  messages: Message[];
}>();

const messagesContainer = ref<HTMLElement | null>(null);

// 监听消息变化，自动滚动到底部
watch(
  () => props.messages,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  },
  { deep: true, immediate: true }
);

// 滚动到底部的方法（供外部调用）
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

defineExpose({
  scrollToBottom,
});
</script>
