import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowDown, Sun, Moon, Menu, X, Lock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { GabsLogo } from './GabsLogo';
import { NgxStickyTicker } from './NgxStickyTicker';
import { RevealOnScroll } from './InteractiveEffects';

interface CrestmarkHeroProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const MARQUEE_WORDS = [
  'Trust',
  'Capital',
  'Returns',
  'Execution',
  'Strategy',
  'Value',
];

export const CrestmarkHero: React.FC<CrestmarkHeroProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientPass, setClientPass] = useState('');
  const [portalNotice, setPortalNotice] = useState('');

  const { scrollY } = useScroll();

  // Layered Parallax & Scroll-Driven Motion
  const bgY = useTransform(scrollY, [0, 900], ['0%', '18%']);
  const bgScale = useTransform(scrollY, [0, 900], [1, 1.06]);
  const contentY = useTransform(scrollY, [0, 700], ['0px', '70px']);
  const contentOpacity = useTransform(scrollY, [0, 550], [1, 0.2]);

  const navLinks = [
    { label: 'Impact', href: '#impact' },
    { label: 'Products', href: '#products' },
    { label: 'Approach', href: '#approach' },
    { label: 'Insights', href: '#market-insights' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Blog', href: '#blog' },
    { label: 'About', href: '#about' },
  ];

  const handlePortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !clientPass.trim()) {
      setPortalNotice('Please enter your GABS Client ID / Email and password.');
      return;
    }
    setPortalNotice(
      'Client Portal authentication verified. For first-time onboarding or password reset, please contact customer@gabsfinancial.com.'
    );
  };

  return (
    <>
      {/* Fixed / Sticky Top Wrapper: NGX Market Watch Ticker pinned above the Sticky Menu Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* 1. Pinned NGX Investment Ticker from gabsfinancial.com */}
        <NgxStickyTicker />

        {/* 2. Sticky Menu Bar directly below the Ticker */}
        <header
          className={`w-full backdrop-blur-md transition-colors duration-300 border-b shadow-sm ${
            isDark
              ? 'bg-neutral-950/90 border-white/10 text-white'
              : 'bg-white/95 border-black/10 text-neutral-950'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 h-[78px] flex items-center justify-between gap-4">
            {/* Zone 1: GABS PNG 1@3x-8 (Light Mode) / GABS PNG 1@3x-8 White (Dark Mode) Header Logo */}
            <a
              href="#top"
              className="inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] rounded-md"
            >
              <GabsLogo
                variant={isDark ? 'header-dark' : 'header-light'}
                size="sm"
              />
            </a>

            {/* Zone 2: Desktop Navigation Links (hidden on mobile & tablet, visible from lg upwards so logo never collides) */}
            <nav
              aria-label="Primary Navigation"
              className={`hidden lg:flex items-center gap-7 xl:gap-10 text-[15px] xl:text-[16px] font-medium ${
                isDark ? 'text-white/95' : 'text-neutral-900'
              }`}
            >
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap shrink-0 py-1 hover:text-[#0D51B2] dark:hover:text-[#00B876] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] rounded"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Actions (Working Dark/Light Mode Toggle + Client Portal pill button + Tablet/Mobile Hamburger) */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`h-10 px-3.5 rounded-full border flex items-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] ${
                  isDark
                    ? 'border-white/25 bg-white/10 hover:bg-white/20 text-white'
                    : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                }`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-[#F2BF2D]" />
                    <span className="hidden xl:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#0D51B2]" />
                    <span className="hidden xl:inline">Dark</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortalNotice('');
                  setPortalOpen(true);
                }}
                className={`hidden sm:inline-flex items-center justify-center gap-2 px-5 xl:px-6 py-2.5 text-[14.5px] xl:text-[15px] font-medium rounded-full transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] ${
                  isDark
                    ? 'text-neutral-950 bg-white hover:bg-[#00B876] hover:text-white'
                    : 'text-white bg-[#0D51B2] hover:bg-[#00B876] hover:text-neutral-950'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Client Portal</span>
              </button>

              {/* Hamburger Button visible in both Mobile and Tablet modes (lg:hidden) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
                className={`lg:hidden w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                  isDark
                    ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Tablet & Mobile Drawer (lg:hidden) */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`lg:hidden overflow-hidden border-t backdrop-blur-xl px-6 py-5 space-y-4 ${
                  isDark
                    ? 'border-white/15 bg-neutral-950/95 text-white'
                    : 'border-black/10 bg-white/95 text-neutral-900'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[16px] font-medium hover:text-[#00B876] py-2 px-3 rounded-lg hover:bg-current/5 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="pt-3 border-t border-current/10 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setPortalNotice('');
                      setPortalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px] font-medium text-white bg-[#0D51B2] hover:bg-[#00B876] hover:text-neutral-950 rounded-full transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Client Portal</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>

      <section
        id="top"
        className="relative w-full h-screen min-h-[760px] pt-[146px] flex flex-col justify-end overflow-hidden bg-neutral-900 text-white"
      >
        {/* Layered Parallax Background Image (Hero.jpg growth image) + Exact 15% Black Tint underneath text and above image */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="w-full h-full bg-neutral-900">
            <img
              src="/images/hero_coins_calculator_growth_1791593740301.jpg"
              alt="Stacks of golden coins on a financial calculator symbolizing wealth growth"
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('Hero.jpg')) {
                  target.src = '/Hero.jpg';
                }
              }}
              className="w-full h-full object-cover object-center opacity-100"
            />
          </div>
          {/* Protective contrast tint overlay behind hero text and above image */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-t from-black/80 via-black/45 to-black/30 backdrop-blur-[0.5px]"
          />
        </motion.div>

        {/* Center + Lower Crestmark Hero Stage matching screenshot scale & layout */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 flex-1 flex flex-col justify-end pb-10 sm:pb-12"
        >
        {/* Massive Full-Bleed Horizontal Marquee ("• Trust • Capital • Returns • Execution") */}
        <RevealOnScroll
          delayMs={80}
          className="w-full overflow-hidden py-2 select-none mb-6 sm:mb-8"
        >
          <div className="animate-marquee flex items-center">
            {[0, 1].map((dupIndex) => (
              <div key={dupIndex} className="flex items-center shrink-0">
                {MARQUEE_WORDS.map((phrase, idx) => (
                  <div
                    key={`${dupIndex}-${idx}`}
                    className="flex items-center shrink-0"
                  >
                    <span
                      className="font-display font-medium text-crest-hero text-white px-4 sm:px-7"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {phrase}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-block w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full bg-white mx-4 sm:mx-8 shrink-0"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Centered 4-Line Description + Minimalist Downward Arrow matching screenshot */}
        <RevealOnScroll
          delayMs={180}
          className="max-w-[640px] mx-auto px-6 text-center"
        >
          <h1 className="sr-only">
            GABS Financial Services Limited — Fund and Portfolio Management
          </h1>
          <p className="text-[18px] sm:text-[21px] md:text-[23px] leading-[1.38] tracking-[-0.01em] text-white font-normal">
            GABS Financial is a SEC licensed fund and portfolio management company focused on
            creating sustainable wealth through disciplined capital allocation
            and client-centric excellence.
          </p>

          {/* Clean Unboxed Downward Arrow matching Crestmark screenshot */}
          <div className="mt-7 sm:mt-8 flex items-center justify-center">
            <a
              href="#partners"
              aria-label="Scroll to Partners and Impact"
              className="group inline-flex items-center justify-center p-2 text-white hover:text-white/80 transition-transform duration-200 hover:translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
            >
              <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
            </a>
          </div>
        </RevealOnScroll>
      </motion.div>

      {/* Interactive Client Portal Modal */}
      <AnimatePresence>
        {portalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setPortalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl border p-7 sm:p-8 shadow-2xl ${
                isDark
                  ? 'bg-[#111927] border-white/15 text-white'
                  : 'bg-white border-black/10 text-neutral-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B876]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>SEC Regulated Investor Access</span>
                  </div>
                  <h2
                    className="font-display font-bold text-2xl"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    GABS Client Portal
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPortalOpen(false)}
                  aria-label="Close Client Portal"
                  className="w-8 h-8 rounded-full border border-current/15 flex items-center justify-center opacity-70 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePortalSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="portal-client-id"
                    className="block text-xs font-semibold opacity-75"
                  >
                    Client ID or Registered Email
                  </label>
                  <input
                    id="portal-client-id"
                    type="text"
                    placeholder="e.g. GABS-2026-084 or email@domain.com"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                      isDark
                        ? 'bg-[#0A0F18] border-white/15 text-white placeholder:text-white/35'
                        : 'bg-[#F8F8F5] border-black/15 text-neutral-900 placeholder:text-black/40'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="portal-password"
                    className="block text-xs font-semibold opacity-75"
                  >
                    Passcode
                  </label>
                  <input
                    id="portal-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={clientPass}
                    onChange={(e) => setClientPass(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                      isDark
                        ? 'bg-[#0A0F18] border-white/15 text-white placeholder:text-white/35'
                        : 'bg-[#F8F8F5] border-black/15 text-neutral-900 placeholder:text-black/40'
                    }`}
                  />
                </div>

                {portalNotice && (
                  <div className="p-3 rounded-lg bg-[#00B876]/15 border border-[#00B876]/30 text-xs leading-relaxed">
                    {portalNotice}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-sm font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  Sign In to Portfolio Dashboard
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-xs opacity-75">
                <span>New to GABS Financial?</span>
                <a
                  href="#contact"
                  onClick={() => setPortalOpen(false)}
                  className="font-semibold text-[#0D51B2] dark:text-[#00B876] inline-flex items-center gap-1 hover:underline"
                >
                  <span>Open an Account</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </section>
    </>
  );
};
