import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import type { Message, Conversation, User, LoginConfig, MessageType, MessageDirection } from '../types';

// 全局 TIM 实例
let tim: any = null;
let isInitialized = false;

// 消息监听器
const messageListeners: ((message: Message) => void)[] = [];
const conversationListeners: ((conversations: Conversation[]) => void)[] = [];
const statusListeners: ((status: string) => void)[] = [];

// 初始化 TIM
export function initTIM(config: LoginConfig) {
  if (isInitialized) {
    console.warn('TIM already initialized');
    return tim;
  }

  // 创建 TIM 实例
  tim = TIM.create({
    SDKAppID: config.SDKAppID,
  });

  // 注册上传插件
  tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });

  // 设置日志级别
  tim.setLogLevel(0); // 0: 普通级别，日志量较多

  // 监听事件
  tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
  tim.on(TIM.EVENT.SDK_READY, onSDKReady);
  tim.on(TIM.EVENT.KICKED_OUT, onKickedOut);
  tim.on(TIM.EVENT.ERROR, onError);

  isInitialized = true;
  return tim;
}

// 登录
export async function login(config: LoginConfig): Promise<void> {
  try {
    if (!tim) {
      initTIM(config);
    }

    const res = await tim.login({
      userID: config.userID,
      userSig: config.userSig,
    });

    if (res.code !== 0) {
      throw new Error(`登录失败: ${res.message}`);
    }

    console.log('登录成功');
  } catch (error: any) {
    console.error('登录错误:', error);
    throw error;
  }
}

// 登出
export async function logout(): Promise<void> {
  if (!tim) return;

  try {
    await tim.logout();
    console.log('登出成功');
  } catch (error) {
    console.error('登出错误:', error);
    throw error;
  }
}

// 获取会话列表
export async function getConversationList(): Promise<Conversation[]> {
  if (!tim) return [];

  try {
    const res = await tim.getConversationList();
    if (res.code !== 0) {
      throw new Error(`获取会话列表失败: ${res.message}`);
    }

    return res.data.conversationList.map((conv: any) => ({
      conversationID: conv.conversationID,
      type: conv.type,
      name: conv.userProfile.nickName || conv.userProfile.userID || 'Unknown',
      avatar: conv.userProfile.avatar,
      lastMessage: conv.lastMessage?.payload?.text || '',
      lastMessageTime: conv.lastMessage?.lastTime || 0,
      unreadCount: conv.unreadCount,
    }));
  } catch (error) {
    console.error('获取会话列表错误:', error);
    return [];
  }
}

// 获取历史消息
export async function getMessageList(conversationID: string, nextReqMessageID?: string): Promise<any> {
  if (!tim) return { data: { messageList: [] }, nextReqMessageID: '' };

  try {
    const res = await tim.getMessageList({
      conversationID,
      count: 20,
      nextReqMessageID,
    });

    if (res.code !== 0) {
      throw new Error(`获取历史消息失败: ${res.message}`);
    }

    return {
      data: res.data,
      nextReqMessageID: res.data.nextReqMessageID,
      isCompleted: res.data.isCompleted,
    };
  } catch (error) {
    console.error('获取历史消息错误:', error);
    return { data: { messageList: [] }, nextReqMessageID: '', isCompleted: true };
  }
}

// 发送文本消息
export async function sendTextMessage(to: string, text: string): Promise<Message> {
  if (!tim) {
    throw new Error('TIM 未初始化');
  }

  try {
    // 创建文本消息
    const message = tim.createTextMessage({
      to,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        text,
      },
    });

    // 发送消息
    const res = await tim.sendMessage(message);

    if (res.code !== 0) {
      throw new Error(`发送消息失败: ${res.message}`);
    }

    // 转换为标准消息格式
    return {
      id: message.ID,
      conversationID: message.conversationID,
      from: message.from,
      to: message.to,
      type: message.type as MessageType,
      content: text,
      direction: 'sent' as MessageDirection,
      timestamp: message.time,
      status: 'sent',
    };
  } catch (error) {
    console.error('发送消息错误:', error);
    throw error;
  }
}

// 获取用户资料
export async function getUserProfile(userIDList: string[]): Promise<User[]> {
  if (!tim) return [];

  try {
    const res = await tim.getUserProfile({
      userIDList,
    });

    if (res.code !== 0) {
      throw new Error(`获取用户资料失败: ${res.message}`);
    }

    return res.data.map((profile: any) => ({
      userID: profile.userID,
      nickName: profile.nickName,
      avatar: profile.avatar,
    }));
  } catch (error) {
    console.error('获取用户资料错误:', error);
    return [];
  }
}

// 事件监听函数
function onMessageReceived(event: any) {
  const messages = event.data;
  messages.forEach((message: any) => {
    const msg: Message = {
      id: message.ID,
      conversationID: message.conversationID,
      from: message.from,
      to: message.to,
      type: message.type as MessageType,
      content: message.payload?.text || '',
      direction: 'received' as MessageDirection,
      timestamp: message.time,
      status: 'sent',
    };
    messageListeners.forEach(listener => listener(msg));
  });
}

function onConversationListUpdated(event: any) {
  const conversations: Conversation[] = event.data.map((conv: any) => ({
    conversationID: conv.conversationID,
    type: conv.type,
    name: conv.userProfile?.nickName || conv.userProfile?.userID || 'Unknown',
    avatar: conv.userProfile?.avatar,
    lastMessage: conv.lastMessage?.payload?.text || '',
    lastMessageTime: conv.lastMessage?.lastTime || 0,
    unreadCount: conv.unreadCount,
  }));
  conversationListeners.forEach(listener => listener(conversations));
}

function onSDKReady() {
  console.log('SDK Ready');
  statusListeners.forEach(listener => listener('ready'));
}

function onKickedOut() {
  console.warn('被踢出登录');
  statusListeners.forEach(listener => listener('kicked_out'));
}

function onError(error: any) {
  console.error('SDK 错误:', error);
  statusListeners.forEach(listener => listener('error'));
}

// 监听器管理
export function onMessage(listener: (message: Message) => void) {
  messageListeners.push(listener);
}

export function offMessage(listener: (message: Message) => void) {
  const index = messageListeners.indexOf(listener);
  if (index > -1) {
    messageListeners.splice(index, 1);
  }
}

export function onConversation(listener: (conversations: Conversation[]) => void) {
  conversationListeners.push(listener);
}

export function offConversation(listener: (conversations: Conversation[]) => void) {
  const index = conversationListeners.indexOf(listener);
  if (index > -1) {
    conversationListeners.splice(index, 1);
  }
}

export function onStatus(listener: (status: string) => void) {
  statusListeners.push(listener);
}

export function offStatus(listener: (status: string) => void) {
  const index = statusListeners.indexOf(listener);
  if (index > -1) {
    statusListeners.splice(index, 1);
  }
}

// 检查是否已初始化
export function isTIMReady(): boolean {
  return isInitialized && tim?.isReady();
}
