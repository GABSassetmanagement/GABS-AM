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
  'Where is your Abuja office located?',
];

function generateLizKnowledgeResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Greetings & Identity
  if (
    q === 'hi' ||
    q === 'hello' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.includes('who are you') ||
    q.includes('your name') ||
    q.includes('what is your name') ||
    q.includes('what are you')
  ) {
    return 'Hello! I am Liz, your Virtual Investment & Advisory Specialist at GABS Financial Services Limited. I can assist you with our SEC-licensed portfolio mandates, GABS Time Classic yields, corporate treasury management, account onboarding, and capital protection. How can I help you today?';
  }

  // GABS Time Classic & Yields
  if (
    q.includes('time classic') ||
    q.includes('yield') ||
    q.includes('rate') ||
    q.includes('interest') ||
    q.includes('tenure') ||
    q.includes('fixed income') ||
    q.includes('returns')
  ) {
    return 'GABS Time Classic is our flagship fixed-income investment product tailored for capital preservation and high predictable yields:\n\n• Minimum Investment: ₦1,000,000\n• Competitive Yield: 15.0% – 19.5% per annum\n• Flexible Tenures: 90, 180, and 365 days\n• Interest Payment: Paid upfront, quarterly, or upon maturity\n• Backing: SEC-sanctioned commercial papers and high-grade sovereign paper\n\nWould you like to speak with an advisor or submit an inquiry to lock in current rates?';
  }

  // Minimum Investment
  if (
    q.includes('minimum') ||
    q.includes('how much') ||
    q.includes('starting') ||
    q.includes('entry')
  ) {
    return 'Our investment thresholds are tailored to both retail and institutional wealth creators:\n\n1. GABS Time Classic (Fixed Income): Minimum of ₦1,000,000\n2. GABS Target Growth (Capital Appreciation): Minimum of ₦250,000\n3. Corporate Treasury & Alternate Investment: Minimum of ₦1,000,000 (bespoke institutional mandates customized up to ₦100M+)\n\nAll funds are held in segregated custodian accounts with Zenith Nominees Limited.';
  }

  // Target Growth & Equities
  if (
    q.includes('target growth') ||
    q.includes('growth') ||
    q.includes('equity') ||
    q.includes('equities') ||
    q.includes('stock')
  ) {
    return 'GABS Target Growth is engineered for medium to long-term capital accumulation:\n\n• Minimum Subscription: ₦250,000\n• Target Return: 14.5% – 17.5% p.a.\n• Strategy: Disciplined allocation across dividend-yielding blue-chip Nigerian equities and resilient fixed income instruments\n• Liquidity: Semi-annual portfolio rebalancing and quarterly performance reports.';
  }

  // Protection, SEC Regulation, Custodianship & Safety
  if (
    q.includes('protect') ||
    q.includes('safety') ||
    q.includes('safe') ||
    q.includes('sec') ||
    q.includes('regulation') ||
    q.includes('regulated') ||
    q.includes('license') ||
    q.includes('licensed') ||
    q.includes('custodian') ||
    q.includes('zenith') ||
    q.includes('fman') ||
    q.includes('risk')
  ) {
    return 'At GABS Financial, investor security is our foremost institutional pillar:\n\n1. Regulatory Oversight: Fully licensed, regulated, and supervised by the Securities & Exchange Commission (SEC) Nigeria as a Fund/Portfolio Manager.\n2. Asset Segregation: Client funds are strictly ring-fenced and held independently with Zenith Nominees Limited (Custodian).\n3. Industry Standards: Active member of the Fund Managers Association of Nigeria (FMAN).\n4. Compliance & Audit: Robust AML/CFT frameworks and periodic forensic audits overseen by our dedicated compliance committee.';
  }

  // Leadership, Board & Management
  if (
    q.includes('lead') ||
    q.includes('leader') ||
    q.includes('board') ||
    q.includes('management') ||
    q.includes('director') ||
    q.includes('ceo') ||
    q.includes('idika') ||
    q.includes('bolatito') ||
    q.includes('team')
  ) {
    return 'GABS Financial is stewarded by prominent institutional leaders:\n\n• Board of Directors:\n  - Bolatito Laditan (Chairman)\n  - Idika Uma Kalu (MD/CEO)\n  - Claudius Otegbade (Non-Executive Director)\n  - Aisha Gambo (Non-Executive Director)\n  - Joseph Ajayi (Non-Executive Director)\n\n• Executive Management:\n  - Olubukunola Emmanuel (Head of Business)\n  - Oyelowo Ayodeji (Head of Compliance)\n  - Esther Owolabi, ACA (Acting Head of FINCON)\n  - Stella Tinuola Yakubu (Head of Legal)';
  }

  // Office Location & Address
  if (
    q.includes('address') ||
    q.includes('office') ||
    q.includes('location') ||
    q.includes('abuja') ||
    q.includes('visit') ||
    q.includes('where are you')
  ) {
    return 'Our corporate headquarters is located at:\n\nGround Floor, Nicon Insurance Building, Central Business District, Abuja, Federal Capital Territory, Nigeria.\n\nOur doors are open Monday through Friday from 8:30 AM to 5:00 PM for private advisory sessions.';
  }

  // Contact Info & Phone / Email
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('telephone') ||
    q.includes('call') ||
    q.includes('email') ||
    q.includes('reach') ||
    q.includes('customer service')
  ) {
    return 'You can connect directly with our advisory desk:\n\n• Telephone: +234 809 3329 999\n• Email: customer@gabsfinancial.com\n• Office: Ground Floor, Nicon Insurance Building, CBD, Abuja\n• Social Media:\n  - Instagram: @gabs_financial\n  - TikTok: @gabs.financial.se\n  - LinkedIn: GABS Financial Service\n\nOur client response time is typically within 24 hours.';
  }

  // Account Opening & Onboarding
  if (
    q.includes('open') ||
    q.includes('account') ||
    q.includes('start') ||
    q.includes('onboard') ||
    q.includes('sign up') ||
    q.includes('register') ||
    q.includes('document') ||
    q.includes('requirement')
  ) {
    return 'Opening an investment portfolio with GABS Financial is straightforward:\n\nRequired Documents:\n1. Valid Government ID (National ID/NIN, International Passport, or Voter\'s Card)\n2. Proof of Address (Utility bill dated within the last 3 months)\n3. Passport Photograph\n4. Bank Verification Number (BVN)\n\nYou can submit an inquiry via our website contact form or visit our Abuja headquarters to begin onboarding today.';
  }

  // Corporate Treasury & Alternate Investment
  if (
    q.includes('corporate') ||
    q.includes('treasury') ||
    q.includes('institution') ||
    q.includes('alternate') ||
    q.includes('liquidity')
  ) {
    return 'GABS Institutional Treasury & Alternate Investment service helps corporate CFOs and institutional treasurers optimize surplus cash:\n\n• Custom cash-flow matching for tax, dividend, and CAPEX horizons\n• Access to top-tier commercial paper issuances and treasury bills\n• Dedicated institutional relationship management\n• Rigorous credit-screening and transparent periodic accounting.';
  }

  // General Fallback
  return `Thank you for asking! GABS Financial Services Limited is an SEC-licensed asset management firm based in Abuja, offering GABS Time Classic (15.0% - 19.5% p.a.), Target Growth, and Institutional Treasury Management.\n\nCould you clarify if you are interested in our investment yields, opening an account, our corporate governance, or speaking directly with an advisor? You can also reach our team at customer@gabsfinancial.com or +234 809 3329 999.`;
}

export const GabsAiChatbot: React.FC<GabsAiChatbotProps> = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: 'Hello! I am Liz, your Virtual Investment & Advisory Specialist at GABS Financial Services Limited. How can I assist you with GABS Time Classic yields, our SEC-licensed portfolio management, or opening an investment account today?',
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
      let replyText = '';

      // Try server API first if running in fullstack dev server
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const history = messages.map((m) => ({
          role: m.role,
          text: m.text,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.reply) {
            replyText = data.reply;
          }
        }
      } catch {
        // Fall back to client knowledge engine
      }

      if (!replyText) {
        // Use Liz's comprehensive advisory knowledge engine
        replyText = generateLizKnowledgeResponse(text);
      }

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
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        text: generateLizKnowledgeResponse(text),
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
        text: 'Chat history cleared. I am Liz, ready to assist your investment portfolio or corporate treasury inquiries.',
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
            <span>Chat with Liz</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close Liz Chat' : 'Open Liz Chat Assistant'}
          title="Chat with Liz — GABS Virtual Advisory Specialist"
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
          aria-label="Liz — GABS AI Advisory Assistant"
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
              <div className="w-10 h-10 rounded-xl bg-[#00B876] text-[#060B14] flex items-center justify-center font-display font-bold text-sm shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base leading-none">
                    Liz · GABS Advisory
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#00B876]/20 text-[#00B876] dark:text-[#4ade80] border border-[#00B876]/30">
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] opacity-80 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B876] animate-pulse" />
                  <span>SEC Licensed Knowledge Specialist</span>
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
                    <div className="w-7 h-7 rounded-lg bg-[#00B876]/15 text-[#00B876] flex items-center justify-center shrink-0 mt-0.5 border border-[#00B876]/20 font-bold text-xs">
                      L
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
                      className={`text-[10px] tabular-nums ${
                        isUser ? 'text-white/60 text-right' : 'opacity-50 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[#0D51B2]/20 text-[#0D51B2] dark:text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#00B876]/15 text-[#00B876] flex items-center justify-center shrink-0 mt-0.5 border border-[#00B876]/20 font-bold text-xs">
                  L
                </div>
                <div
                  className={`rounded-2xl rounded-bl-none p-3.5 flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-[#162136] border border-white/10'
                      : 'bg-neutral-100 border border-black/5'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[#00B876] animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
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
            <span>Desk: customer@gabsfinancial.com</span>
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
              placeholder="Ask Liz anything about GABS Financial..."
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
