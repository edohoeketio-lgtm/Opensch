'use client';

import { Bot, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function CurriculumCopilot({
  lessonContext
}: {
  lessonContext?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lessonId: lessonContext })
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
      if (!reader) throw new Error('No reader available');

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], content: updated[lastIdx].content + value };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl overflow-hidden shadow-xl shadow-black/20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2D2D2D] flex items-center justify-between bg-[#111111]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#B08D57]/20 rounded-lg shadow-sm">
            <Bot className="h-4 w-4 text-[#B08D57]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#FFFFFF] leading-tight">AI Copilot</h3>
            <p className="text-xs text-[#9CA3AF]">Syllabus-trained Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 pb-0 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-12 w-12 bg-[#2D2D2D] rounded-full flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-[#888888]" />
            </div>
            <p className="text-sm font-medium text-[#FFFFFF] mb-1">How can I help you today?</p>
            <p className="text-xs text-[#9CA3AF] max-w-[200px]">
              Ask me anything about your current active sprint or OpenSch technical stack.
            </p>
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[90%] ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                m.role === 'user' ? 'bg-white/10' : 'bg-[#B08D57]/20'
              }`}>
                {m.role === 'user' ? (
                  <User className="h-4 w-4 text-[#D1D5DB]" />
                ) : (
                  <Bot className="h-4 w-4 text-[#B08D57]" />
                )}
              </div>
              <div
                className={`flex flex-col gap-1 ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-[#2D2D2D] text-[#FFFFFF] rounded-tr-sm shadow-sm border border-[#3D3D3D]'
                      : 'bg-[#111111] text-[#D1D5DB] rounded-tl-sm border border-[#2D2D2D]'
                  }`}
                >
                  <span className="whitespace-pre-wrap leading-relaxed">{m.content}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 max-w-[90%]">
            <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-[#B08D57]/20">
              <Bot className="h-4 w-4 text-[#B08D57] animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#111111] border border-[#2D2D2D] rounded-tl-sm flex items-center gap-1">
               <div className="w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce" />
               <div className="w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce [animation-delay:0.2s]" />
               <div className="w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="pb-4" />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-[#1C1C1E] border-t border-[#2D2D2D]">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <input
            className="flex-1 px-4 py-2.5 bg-[#111111] border border-[#2D2D2D] rounded-xl text-sm text-[#FFFFFF] transition-colors focus:bg-[#1A1A1E] focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57] placeholder:text-[#888888]"
            value={input}
            placeholder="Ask your teaching assistant..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-[#B08D57] hover:bg-[#C2A069] disabled:opacity-50 disabled:cursor-not-allowed text-[#111111] rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08D57]/20 focus:ring-offset-1 focus:ring-offset-[#1C1C1E]"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
