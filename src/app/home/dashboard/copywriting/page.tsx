"use client";
import MessageBubble from '@/components/AI/MessageBubble';
import { useChatStore} from '@/lib/stores/copywritingStore';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useRef, useEffect } from 'react';
import { fetchDifyStreamResultAgent } from '@/lib/agents/dify_chat';
import { getTimestamp } from '@/lib/utils/time';
export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, started,sendMessage, appendAIMessageChunk } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    // 新增开场提示
    if (messages.length === 0 && !started) {
      const welcomeMsg = {
        id: Date.now(),
        content: `👋 欢迎使用 **文案生成**！\n\n请随时告诉我你想编写的文案内容～\n\n✨🚀`,
        isUser: false,
        timestamp: getTimestamp(),
        thinkContent: '',
        conversationId: -1
      };
      sendMessage(welcomeMsg);
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);  // 空数组表示只在组件挂载时执行一次

  const handleSend = async () => {
    if (conversationId == -1) {
      setConversationId(Date.now());
    }

    if (inputMessage.trim()) {
      const userMsgId = Date.now();
      const userMsg = {
        id: userMsgId,
        content: inputMessage,
        isUser: true,
        timestamp: getTimestamp(),
        thinkContent: '',
        conversationId: conversationId
      };
      const aiMsgId = userMsgId + 1;
      sendMessage(userMsg);
      setInputMessage('');
      setLoading(true);

      try {
        sendMessage({
          id: aiMsgId,
          content: '',
          isUser: false,
          timestamp: getTimestamp(),
          thinkContent: '',
          conversationId: conversationId
        });
        appendAIMessageChunk(aiMsgId, '', true);
        // siliconflow api 
        // const generator = fetchAIStreamResult([...messages, userMsg].map(msg => ({
        //   role: msg.isUser ? 'user' : 'assistant',
        //   content: msg.content
        // })));
        const generator = fetchDifyStreamResultAgent([...messages, userMsg].map(msg => ({
          role: msg.isUser? 'user' : 'assistant',
          content: msg.content
        })), '');

        for await (const chunk of generator) {
          if (chunk.thinking) {
            appendAIMessageChunk(aiMsgId, chunk.word, true);
          }
          else {
            appendAIMessageChunk(aiMsgId, chunk.word, false);
          }
        }
      } catch (error) {
        console.error('AI响应错误:', error);
        appendAIMessageChunk(Date.now(), '抱歉，暂时无法处理您的请求', false);
        setLoading(false);
      } finally {
        setLoading(false);
        // 滑动到底部
        messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
      }
    }
  };


  return (
    <div className="flex flex-col h-full p-4 max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4" ref={messagesEndRef}>
        <div />
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            content={msg.content}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
            thinkingContent={msg.thinkContent}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <TextareaAutosize
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 p-2 border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          placeholder="输入消息（Shift+Enter换行）..."
          minRows={1}
          maxRows={6}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
};