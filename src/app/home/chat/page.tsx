"use client";
import MessageBubble from '@/components/AI/MessageBubble';
import { useChatStore } from '@/lib/stores/chatStore';
import { useConversationStore } from '@/lib/stores/conversationStore';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useRef, useEffect } from 'react';
// import { fetchAIStreamResult } from '@/lib/agents/silision';
import { fetchDifyStreamResultAgent } from '@/lib/agents/dify_chat';
import { getTimestamp } from '@/lib/utils/time';
import Link from 'next/link';
export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const { started, messages, sendMessage, appendAIMessageChunk} = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const {  addConversation} = useConversationStore();
  const [welcomeMsgID, setWelcomeMsgID] = useState<number>(0);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    // 新增开场提示
    if (messages.length === 0 && !started) {
      let now = Date.now();
      setWelcomeMsgID(now);
      console.log('welcomeMsgID', welcomeMsgID);
      const welcomeMsg = {
        id: now,
        content: `👋 欢迎使用 TeachFlow 智能助手！\n\n**我能为您提供以下帮助：**\n\n - 生成教学方案\n- 解答学科问题\n- 优化课程内容\n\n请随时提问～\n\n✨🚀`,
        isUser: false,
        timestamp: getTimestamp(),
        thinkContent: '',
        conversationId: -1
      };
      sendMessage(welcomeMsg);
    }
  }, []);  // 空数组表示只在组件挂载时执行一次

  const handleSend = async () => {
    if (conversationId == 0) {
      setConversationId(Date.now());
      addConversation({
        id: conversationId,
        title: '智能助手' + Math.floor(Math.random() * 100),
        type: 'agent',
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
        // siliconflow api 
        // const generator = fetchAIStreamResult([...messages, userMsg].map(msg => ({
        //   role: msg.isUser ? 'user' : 'assistant',
        //   content: msg.content
        // })));
        const generator = fetchDifyStreamResultAgent([...messages, userMsg].map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })), '');

        for await (let chunk of generator) {
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  return (
    <div className="flex flex-col h-full p-4 max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4" ref={messagesEndRef}>
        <div />
        {messages.map((msg, index) => (
          <div key={index}>
            <MessageBubble
              content={msg.content}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              thinkingContent={msg.thinkContent}
            />
            {msg.id === welcomeMsgID && (
              <div className="mt-4 flex gap-3 px-4">
                <Link
                  href="/home/dashboard/paper"
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  📝 生成试卷
                </Link>
                <Link
                  href="/home/dashboard/resource"
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  📚 资源中心
                </Link>
                <Link
                  href="/home/dashboard/optimize"
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  ✨ 习题优化
                </Link>
              </div>
            )}
          </div>
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