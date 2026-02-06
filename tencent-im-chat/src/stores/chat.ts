import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Message, Conversation, MessageType, MessageDirection } from '../types';
import {
  login as timLogin,
  logout as timLogout,
  getConversationList,
  getMessageList,
  sendTextMessage,
  onMessage,
  onConversation,
  onStatus,
  isTIMReady,
} from '../services/timService';

export const useChatStore = defineStore('chat', () => {
  // 状态
  const currentConversation = ref<Conversation | null>(null);
  const conversations = ref<Conversation[]>([]);
  const messages = ref<Record<string, Message[]>>({});
  const isLogin = ref(false);
  const status = ref<'init' | 'ready' | 'kicked_out' | 'error'>('init');
  const loading = ref(false);

  // 计算属性
  const currentMessages = computed(() => {
    if (!currentConversation.value) return [];
    return messages.value[currentConversation.value.conversationID] || [];
  });

  // 登录
  async function login(config: { SDKAppID: number; userID: string; userSig: string }) {
    try {
      loading.value = true;
      await timLogin(config);
      isLogin.value = true;
      
      // 加载会话列表
      await loadConversations();
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // 登出
  async function logout() {
    try {
      await timLogout();
      isLogin.value = false;
      currentConversation.value = null;
      conversations.value = [];
      messages.value = {};
      status.value = 'init';
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  }

  // 加载会话列表
  async function loadConversations() {
    if (!isTIMReady()) return;

    const convList = await getConversationList();
    conversations.value = convList;

    // 如果有会话且当前没有选中的会话，自动选中第一个
    if (convList.length > 0 && !currentConversation.value) {
      selectConversation(convList[0]);
    }
  }

  // 选择会话
  async function selectConversation(conversation: Conversation) {
    currentConversation.value = conversation;

    // 加载该会话的消息
    if (!messages.value[conversation.conversationID]) {
      await loadMessages(conversation.conversationID);
    }
  }

  // 加载消息
  async function loadMessages(conversationID: string, nextReqMessageID?: string) {
    if (!isTIMReady()) return;

    const result = await getMessageList(conversationID, nextReqMessageID);
    
    const messageList = result.data.messageList.map((msg: any) => ({
      id: msg.ID,
      conversationID: msg.conversationID,
      from: msg.from,
      to: msg.to,
      type: msg.type as MessageType,
      content: msg.payload?.text || '',
      direction: (msg.from === 'user' ? 'sent' : 'received') as MessageDirection,
      timestamp: msg.time,
      status: 'sent',
    }));

    // 合并消息
    if (!messages.value[conversationID]) {
      messages.value[conversationID] = messageList.reverse();
    } else {
      messages.value[conversationID] = [...messageList.reverse(), ...messages.value[conversationID]];
    }
  }

  // 发送消息
  async function sendMessage(text: string) {
    if (!currentConversation.value || !isTIMReady()) {
      throw new Error('未选择会话或未登录');
    }

    // 创建临时消息
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      conversationID: currentConversation.value.conversationID,
      from: 'user',
      to: currentConversation.value.conversationID,
      type: 'TIMTextElem' as MessageType,
      content: text,
      direction: 'sent' as MessageDirection,
      timestamp: Date.now(),
      status: 'sending',
    };

    // 添加到消息列表
    if (!messages.value[currentConversation.value.conversationID]) {
      messages.value[currentConversation.value.conversationID] = [];
    }
    messages.value[currentConversation.value.conversationID].push(tempMessage);

    try {
      // 发送消息
      const sentMessage = await sendTextMessage(currentConversation.value.conversationID, text);

      // 更新消息状态
      const msgList = messages.value[currentConversation.value.conversationID];
      const index = msgList.findIndex((m: Message) => m.id === tempMessage.id);
      if (index > -1) {
        msgList[index] = sentMessage;
      }
    } catch (error) {
      // 发送失败，更新状态
      const msgList = messages.value[currentConversation.value.conversationID];
      const index = msgList.findIndex((m: Message) => m.id === tempMessage.id);
      if (index > -1) {
        msgList[index].status = 'failed';
      }
      throw error;
    }
  }

  // 更新流式消息（模拟打字机效果）
  function updateStreamingMessage(messageId: string, newContent: string, isEnd: boolean = false) {
    if (!currentConversation.value) return;

    const msgList = messages.value[currentConversation.value.conversationID];
    const message = msgList.find(m => m.id === messageId);

    if (message) {
      message.content = newContent;
      if (isEnd) {
        message.isStreaming = false;
      }
    }
  }

  // 初始化监听器
  function initListeners() {
    onMessage((message) => {
      if (!messages.value[message.conversationID]) {
        messages.value[message.conversationID] = [];
      }
      messages.value[message.conversationID].push(message);

      // 更新会话列表
      loadConversations();
    });

    onConversation((convList) => {
      conversations.value = convList;
    });

    onStatus((newStatus) => {
      status.value = newStatus as any;
    });
  }

  // 清理监听器
  function cleanupListeners() {
    // 注意：这里不传递参数，因为它们是移除监听器的函数
    // 在实际应用中，你可能需要使用不同的方式管理监听器
  }

  return {
    // 状态
    currentConversation,
    conversations,
    messages,
    currentMessages,
    isLogin,
    status,
    loading,

    // 方法
    login,
    logout,
    loadConversations,
    selectConversation,
    loadMessages,
    sendMessage,
    updateStreamingMessage,
    initListeners,
    cleanupListeners,
  };
});
