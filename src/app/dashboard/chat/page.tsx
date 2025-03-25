"use client";
import MessageBubble from '@/components/AI/MessageBubble';
import { useChatStore, useConversationStore } from '@/lib/stores/chatStore';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useRef, useEffect } from 'react';
import { fetchAIStreamResult } from '@/lib/agents/silision';
import { getTimestamp } from '@/lib/utils/time';
export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, sendMessage, appendAIMessageChunk } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const { conversations, addConversation, deleteConversation, updateConversation } = useConversationStore();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (conversationId == -1) {
      setConversationId(Date.now());
      addConversation({
        id: conversationId,
        title: '新会话' + Math.floor(Math.random() * 100),
        conversationId: conversationId,
        timestamp: getTimestamp(),
      })
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

        const generator = fetchAIStreamResult([...messages, userMsg].map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })));

        for await (let chunk of generator) {
          console.log("回复", chunk);
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