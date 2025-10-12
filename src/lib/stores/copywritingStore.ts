import { create } from 'zustand';
import { produce } from 'immer';

interface Message {
  id: number;
  content: string;
  thinkContent: string;
  isUser: boolean;
  timestamp: string;
  conversationId: number;
}

interface ChatState {
  messages: Message[];
  started: boolean;
  sendMessage: (message: Message) => void;
  clearMessages: () => void;
  appendAIMessageChunk: (id: number, chunk: string, isThinking : boolean) => void;
}
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  started: false,
  sendMessage: (message) => set((state) => ({
    started: true,
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] }),
  appendAIMessageChunk: (id: number, chunk: string, isThinking: boolean) => set(produce(state => {
    // 为 find 方法中的回调函数参数 m 指定类型
    const message = state.messages.find((m : Message)=> m.id === id);
    if (message && isThinking) {
      message.thinkContent += chunk;
    }else if (message) {
      message.content += chunk;
    }
  }))
}));

