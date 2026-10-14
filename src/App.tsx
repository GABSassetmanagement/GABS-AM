import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { CrestmarkHero } from './components/CrestmarkHero';
import { VeritaasPartnersAndStats } from './components/VeritaasPartnersAndStats';
import { VeritaasCoreSections } from './components/VeritaasCoreSections';
import { NigerianMarketInsights } from './components/NigerianMarketInsights';
import { VeritaasLeadershipSection } from './components/VeritaasLeadershipSection';
import { VeritaasTestimonialsAndBlog } from './components/VeritaasTestimonialsAndBlog';
import { VeritaasFaqContactFooter } from './components/VeritaasFaqContactFooter';
import { GabsCmsPage } from './components/GabsCmsPage';
import { GabsAiChatbot } from './components/GabsAiChatbot';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return (window.location.pathname + window.location.hash).toLowerCase();
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath((window.location.pathname + window.location.hash).toLowerCase());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const rootEl = document.documentElement;
    if (isDark) {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 400);

      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
        setScrollProgress(pct);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPublicSite = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current URL is the dedicated editor CMS route (/cms, /editor, #cms, #editor)
  const isCmsRoute =
    currentPath.startsWith('/cms') ||
    currentPath.startsWith('/editor') ||
    currentPath.includes('#cms') ||
    currentPath.includes('#editor');

  if (isCmsRoute) {
    return (
      <GabsCmsPage
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onBackToSite={handleNavigateToPublicSite}
      />
    );
  }

  // Dynamic color interpolation across GABS brand palette (#0D51B2 -> #00B876 -> #F2BF2D) based on reading progress
  const activeBarColor =
    scrollProgress < 45
      ? '#0D51B2'
      : scrollProgress < 80
      ? '#00B876'
      : '#F2BF2D';

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0A0F18] text-[#F8FAFC]' : 'bg-[#F6F6F2] text-[#0B1320]'
      }`}
    >
      {/* Thin, Color-Changing Reading Progress Bar at the Very Top of the Screen */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none"
      >
        <div
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, #0D51B2 0%, #00B876 55%, ${activeBarColor} 100%)`,
            boxShadow:
              scrollProgress > 1 ? `0 0 10px ${activeBarColor}88` : 'none',
          }}
          className="h-full transition-[width,background-color] duration-150 ease-out"
        />
      </div>

      {/* 1. Crestmark Exact Hero Structure & Look */}
      <CrestmarkHero isDark={isDark} onToggleTheme={handleToggleTheme} />

      {/* 2. Veritaas "Companies we worked with" (Partners & Stakeholders) + 4-Row Institutional Impact Metrics */}
      <main>
        <VeritaasPartnersAndStats isDark={isDark} />

        {/* 3. Veritaas Editorial Sections: Who We Are, Vision/Mission/Values, Why Invest, Products + Interactive Tenure Planner, Investment Strategy, Services, Value Proposition, and 5-Year Vision */}
        <VeritaasCoreSections isDark={isDark} />

        {/* 4. Real-time Market Insights: Latest Financial News Relevant to the Nigerian Investment Sector */}
        <NigerianMarketInsights isDark={isDark} />

        {/* 5. Board of Directors & Management Team with Official Portraits, Interactive Filter & Full Executive Bio Modal */}
        <VeritaasLeadershipSection isDark={isDark} />

        {/* 6. Nigerian Client Testimonials (No Images) & Horizontally Slidable Blog Section */}
        <VeritaasTestimonialsAndBlog isDark={isDark} />

        {/* 7. Veritaas FAQ, Contact + Socials + Map, Newsletter Sign-Up, Mobile App Coming Soon, and Floating Dark Footer */}
        <VeritaasFaqContactFooter isDark={isDark} />
      </main>

      {/* Floating Scroll Back Up Button (positioned above floating chat button) */}
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="Scroll back to top"
        title="Back to top"
        className={`fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        } ${
          isDark
            ? 'bg-[#00B876] text-[#060B14] border-white/20 hover:bg-white'
            : 'bg-[#0D51B2] text-white border-white/20 hover:bg-[#00B876] hover:text-[#060B14]'
        }`}
      >
        <ArrowUp className="w-5 h-5 stroke-[2.4]" />
      </button>

      {/* Floating GABS AI Advisory Chatbot Button & Dialog */}
      <GabsAiChatbot isDark={isDark} />
    </div>
  );
}

export default App;
