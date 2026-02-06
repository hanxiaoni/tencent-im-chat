<template>
  <div class="border-t border-gray-800 bg-[#141414]">
    <div class="max-w-4xl mx-auto p-4">
      <div class="relative flex items-end gap-3 bg-gray-900 rounded-2xl border border-gray-700 focus-within:border-gray-600 transition-colors">
        <!-- 输入框 -->
        <textarea
          v-model="inputText"
          ref="textareaRef"
          placeholder="输入消息..."
          class="flex-1 bg-transparent text-gray-100 placeholder-gray-500 px-4 py-3 resize-none outline-none min-h-[24px] max-h-[200px]"
          rows="1"
          @keydown="handleKeyDown"
          @input="autoResize"
        />
        
        <!-- 发送按钮 -->
        <button
          @click="handleSend"
          :disabled="!canSend"
          class="px-4 py-2 mb-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[
            canSend 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-gray-800 text-gray-500'
          ]"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>发送</span>
          <svg v-if="!loading && canSend" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <!-- 提示信息 -->
      <div class="text-center text-xs text-gray-600 mt-2">
        按 Enter 发送，Shift + Enter 换行
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

const emit = defineEmits<{
  send: [text: string];
}>();

const inputText = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const loading = ref(false);

// 是否可以发送
const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !loading.value;
});

// 发送消息
async function handleSend() {
  if (!canSend.value) return;

  const text = inputText.value.trim();
  if (!text) return;

  loading.value = true;
  emit('send', text);
  inputText.value = '';

  // 重置输入框高度
  await nextTick();
  autoResize();
  loading.value = false;

  // 重新聚焦
  textareaRef.value?.focus();
}

// 处理键盘事件
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
}

// 自动调整输入框高度
function autoResize() {
  const textarea = textareaRef.value;
  if (!textarea) return;

  // 重置高度以获取正确的滚动高度
  textarea.style.height = 'auto';
  
  // 计算新高度
  const newHeight = Math.min(textarea.scrollHeight, 200);
  textarea.style.height = `${newHeight}px`;
}

// 聚焦输入框
function focus() {
  textareaRef.value?.focus();
}

defineExpose({
  focus,
});
</script>
