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
  sendMessage: (message: Message) => void;
  clearMessages: () => void;
  appendAIMessageChunk: (id: number, chunk: string, isThinking : boolean) => void;
}
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sendMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] }),
  appendAIMessageChunk: (id: number, chunk: string, isThinking: boolean) => set(produce(state => {
    // 为 find 方法中的回调函数参数 m 指定类型
    const message = state.messages.find((m : Message)=> m.id === id);
    console.log("message :" , message)
    if (message && isThinking) {
      message.thinkContent += chunk;
    }else if (message) {
      message.content += chunk;
    }
  }))
}));


interface Conversation {
  id: number;  // 全局id主键
  conversationId: number;
  title: string;
  timestamp: string;
}

interface ConversationState {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  deleteConversation: (id: number) => void;
  updateConversation: (id: number, title: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, conversation]
  })),
  deleteConversation: (id) => set((state) => ({
    conversations: state.conversations.filter((conversation) => conversation.id !== id)
  })),
  updateConversation: (id, title) => set((state) => ({
    conversations: state.conversations.map((conversation) =>
      conversation.id === id ? { ...conversation, title } : conversation
    ) 
  }))
}))