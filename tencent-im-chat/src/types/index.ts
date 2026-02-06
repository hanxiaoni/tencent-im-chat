// 消息类型
export const MessageType = {
  TEXT: 'TIMTextElem',
  IMAGE: 'TIMImageElem',
  AUDIO: 'TIMSoundElem',
  VIDEO: 'TIMVideoFileElem',
  CUSTOM: 'TIMCustomElem',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

// 消息方向
export const MessageDirection = {
  SENT: 'sent',
  RECEIVED: 'received',
} as const;

export type MessageDirection = typeof MessageDirection[keyof typeof MessageDirection];

// 会话信息
export interface Conversation {
  conversationID: string;
  type: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
}

// 消息信息
export interface Message {
  id: string;
  conversationID: string;
  from: string;
  to: string;
  type: MessageType;
  content: string;
  direction: MessageDirection;
  timestamp: number;
  status: 'sending' | 'sent' | 'failed';
  isStreaming?: boolean; // 是否为流式输出中
}

// 用户信息
export interface User {
  userID: string;
  nickName?: string;
  avatar?: string;
}

// 登录配置
export interface LoginConfig {
  SDKAppID: number;
  userID: string;
  userSig: string;
}

// 流式响应块
export interface StreamChunk {
  content: string;
  isEnd: boolean;
}
