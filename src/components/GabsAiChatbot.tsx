import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GabsAiChatbotProps {
  isDark: boolean;
}

const INITIAL_PROMPTS = [
  'What is GABS Time Classic?',
  'How is client capital protected?',
  'What is the minimum investment?',
  'Who leads GABS Financial?',
];

export const GabsAiChatbot: React.FC<GabsAiChatbotProps> = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: 'Welcome to GABS Financial Services Limited. I am your AI Investment & Advisory Specialist. How can I assist you with our SEC-licensed portfolio management, GABS Time Classic, fixed income solutions, or wealth creation strategies today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        'Thank you for your inquiry. Our advisory desk can be reached directly at customer@gabsfinancial.com.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        text: 'I apologize for the interruption. You can contact our advisory desk directly at customer@gabsfinancial.com or +234 810 598 4880.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: 'Chat history cleared. How may I assist your investment portfolio or corporate treasury today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-lg text-xs font-semibold cursor-pointer animate-fade-in transition-all hover:scale-105 ${
              isDark
                ? 'bg-[#111927] border-white/20 text-white'
                : 'bg-white border-black/15 text-neutral-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00B876] animate-pulse" />
            <span>Chat with GABS AI</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close GABS AI Chat' : 'Open GABS AI Chat'}
          title="Chat with GABS AI Advisory Agent"
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] hover:scale-105 active:scale-95 ${
            isOpen
              ? isDark
                ? 'bg-[#1E293B] text-white border-white/20'
                : 'bg-neutral-900 text-white border-black/20'
              : 'bg-gradient-to-tr from-[#0D51B2] to-[#00B876] text-white border-white/30 hover:shadow-[#00B876]/30 hover:shadow-2xl'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.4]" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#F2BF2D] border-2 border-white dark:border-neutral-900 animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="GABS AI Chat Assistant"
          className={`fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[560px] max-h-[82vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95 ${
            isDark
              ? 'bg-[#0E1524]/95 border-white/20 text-white'
              : 'bg-white/95 border-black/15 text-neutral-900'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDark
                ? 'bg-[#121D30] border-white/10'
                : 'bg-gradient-to-r from-[#0D51B2] to-[#0a3f8c] text-white border-black/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00B876] text-[#060B14] flex items-center justify-center font-display font-bold text-sm shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base leading-none">
                    GABS Advisory AI
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#00B876]/20 text-[#00B876] dark:text-[#4ade80] border border-[#00B876]/30">
                    SEC Regulated Desk
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] opacity-80 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B876] animate-pulse" />
                  <span>Licensed Knowledge · Always Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Restart conversation"
                aria-label="Clear chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/10 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/10 cursor-pointer transition-all"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Thread Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[#00B876]/15 text-[#00B876] flex items-center justify-center shrink-0 mt-0.5 border border-[#00B876]/20">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed space-y-1.5 ${
                      isUser
                        ? 'bg-[#0D51B2] text-white rounded-br-none shadow-md'
                        : isDark
                        ? 'bg-[#162136] text-white/95 rounded-bl-none border border-white/10'
                        : 'bg-neutral-100 text-neutral-900 rounded-bl-none border border-black/5'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`text-[10px] text-right opacity-60 ${
                        isUser ? 'text-white/70' : ''
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[#0D51B2] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00B876]/15 text-[#00B876] flex items-center justify-center shrink-0 mt-0.5 border border-[#00B876]/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div
                  className={`rounded-2xl p-3.5 rounded-bl-none border flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-[#162136] border-white/10 text-white'
                      : 'bg-neutral-100 border-black/5 text-neutral-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00B876] animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-[#00B876] animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#00B876] animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestion Chips */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-t border-current/10">
              {INITIAL_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className={`text-[11px] px-3 py-1 rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                    isDark
                      ? 'border-white/15 bg-white/5 hover:bg-[#00B876]/20 hover:border-[#00B876]/40 text-white/90'
                      : 'border-black/10 bg-black/5 hover:bg-[#0D51B2]/10 hover:border-[#0D51B2]/40 text-neutral-800'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Quick Contact Bar */}
          <div className="px-4 py-1.5 bg-current/[0.03] border-t border-current/10 flex items-center justify-between text-[11px] shrink-0 opacity-75">
            <span>Direct Email: customer@gabsfinancial.com</span>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-[#00B876] hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              Inquiry Form <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-current/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about GABS Financial..."
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                isDark
                  ? 'bg-[#121B2A] border-white/15 text-white placeholder:text-white/40'
                  : 'bg-neutral-50 border-black/15 text-neutral-900 placeholder:text-neutral-400'
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send Message"
              className="w-10 h-10 rounded-xl bg-[#00B876] text-[#060B14] hover:bg-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="w-4 h-4 stroke-[2.2]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
