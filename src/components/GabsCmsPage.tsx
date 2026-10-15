import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { GabsLogo } from './GabsLogo';
import { BlogArticle, BLOG_ARTICLES } from '../data/gabsData';
import { getAssetUrl } from '../utils/assets';

interface GabsCmsPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onBackToSite: () => void;
}

const PRESET_IMAGES = [
  {
    name: 'Fixed Income & Treasury',
    url: '/images/blog_fixed_income_treasury_1791591200706.jpg',
  },
  {
    name: 'Wealth Preservation & Legacy',
    url: '/images/blog_wealth_preservation_strategy_1791591212093.jpg',
  },
  {
    name: 'SEC Governance & Compliance',
    url: '/images/blog_sec_regulatory_governance_1791591222776.jpg',
  },
  {
    name: 'Corporate Treasury & Liquidity',
    url: '/images/blog_corporate_treasury_liquidity_1791591242605.jpg',
  },
  {
    name: 'Executive Office Reception',
    url: '/frontdesk.jpg',
  },
  {
    name: 'Capital Growth & Calculator',
    url: '/Hero.jpg',
  },
];

const PRESET_AUTHORS = [
  { name: 'Idika Uma Kalu', role: 'MD/CEO, GABS Financial' },
  { name: 'Olubukunola Emmanuel', role: 'Head of Business, GABS Financial' },
  { name: 'Oyelowo Ayodeji', role: 'Head of Compliance, GABS Financial' },
  { name: 'Esther Owolabi, ACA', role: 'Acting Head of FINCON, GABS Financial' },
  { name: 'Stella Tinuola Yakubu', role: 'Head of Legal, GABS Financial' },
  { name: 'GABS Financial Editorial Desk', role: 'Investment Committee' },
];

const PRESET_CATEGORIES = [
  'Fixed Income & Treasury',
  'Wealth & Legacy Advisory',
  'Regulation & Compliance',
  'Institutional Treasury',
  'Capital Markets & Equities',
  'Alternate Investments',
  'Macroeconomics & Policy',
];

export const GabsCmsPage: React.FC<GabsCmsPageProps> = ({
  isDark,
  onToggleTheme,
  onBackToSite,
}) => {
  // Authorized Personnel Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gabs_cms_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    if (
      clean === 'gabs2026' ||
      clean === 'gabs@admin' ||
      clean === 'admin123' ||
      clean === 'gabs'
    ) {
      setIsAuthenticated(true);
      setPasswordError('');
      try {
        sessionStorage.setItem('gabs_cms_auth', 'true');
      } catch {
        // ignore
      }
    } else {
      setPasswordError(
        'Incorrect password. Access is restricted to authorized GABS Financial editorial personnel.'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
    try {
      sessionStorage.removeItem('gabs_cms_auth');
    } catch {
      // ignore
    }
  };

  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState(PRESET_AUTHORS[0].name);
  const [authorRole, setAuthorRole] = useState(PRESET_AUTHORS[0].role);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [readTime, setReadTime] = useState('5 min read');
  const [date, setDate] = useState('October 2026');
  const [contentParagraphs, setContentParagraphs] = useState<string>('');
  const [takeawaysText, setTakeawaysText] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [isStaticMode, setIsStaticMode] = useState<boolean>(false);

  // Load articles from backend on mount, falling back to localStorage for static hosts (e.g. GitHub Pages)
  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      // Check localStorage first for instant rendering
      try {
        const cached = localStorage.getItem('gabs_cms_articles');
        if (cached && isMounted) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
          }
        }
      } catch {
        // ignore storage parse error
      }

      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.articles && Array.isArray(data.articles)) {
            setArticles(data.articles);
            localStorage.setItem('gabs_cms_articles', JSON.stringify(data.articles));
            setIsStaticMode(false);
          }
        } else {
          setIsStaticMode(true);
        }
      } catch (err) {
        console.warn('CMS server API unavailable, using local browser storage mode:', err);
        setIsStaticMode(true);
      }
    };
    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory(PRESET_CATEGORIES[0]);
    setExcerpt('');
    setAuthor(PRESET_AUTHORS[0].name);
    setAuthorRole(PRESET_AUTHORS[0].role);
    setImageUrl(PRESET_IMAGES[0].url);
    setReadTime('5 min read');
    setDate('October 2026');
    setContentParagraphs('');
    setTakeawaysText('');
    setEditingArticleId(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setActiveTab('create');
  };

  const handleStartEdit = (article: BlogArticle) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setExcerpt(article.excerpt);
    setAuthor(article.author);
    setAuthorRole(article.authorRole);
    setImageUrl(article.imageUrl);
    setReadTime(article.readTime);
    setDate(article.date);
    setContentParagraphs(article.fullContent.join('\n\n'));
    setTakeawaysText(article.keyTakeaways.join('\n'));
    setActiveTab('edit');
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      setStatusMessage({ type: 'error', text: 'Title and Excerpt are required.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const fullContentArray = contentParagraphs
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const keyTakeawaysArray = takeawaysText
      .split('\n')
      .map((t) => t.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    const payload: BlogArticle = {
      id: editingArticleId || `article-${Date.now()}`,
      title,
      category,
      excerpt,
      author,
      authorRole,
      imageUrl,
      readTime,
      date,
      fullContent: fullContentArray.length > 0 ? fullContentArray : [excerpt],
      keyTakeaways: keyTakeawaysArray.length > 0 ? keyTakeawaysArray : ['Preserve capital with institutional oversight.'],
    };

    let serverSaved = false;

    try {
      const url =
        activeTab === 'edit' && editingArticleId
          ? `/api/articles/${editingArticleId}`
          : '/api/articles';
      const method = activeTab === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          serverSaved = true;
          const listRes = await fetch('/api/articles');
          if (listRes.ok) {
            const listData = await listRes.json();
            setArticles(listData.articles);
            localStorage.setItem('gabs_cms_articles', JSON.stringify(listData.articles));
          }
        }
      }
    } catch {
      // Backend not running (e.g. GitHub Pages static deployment)
    }

    // Always ensure local state and localStorage are updated
    setArticles((prev) => {
      let updated: BlogArticle[];
      if (activeTab === 'edit' && editingArticleId) {
        updated = prev.map((art) => (art.id === editingArticleId ? payload : art));
      } else {
        updated = [payload, ...prev];
      }
      try {
        localStorage.setItem('gabs_cms_articles', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setStatusMessage({
      type: 'success',
      text: activeTab === 'edit'
        ? `Article updated successfully${serverSaved ? '' : ' (saved to browser storage)'}.`
        : `Article published successfully${serverSaved ? '' : ' (saved to browser storage)'}.`,
    });

    setTimeout(() => {
      setActiveTab('list');
      resetForm();
      setStatusMessage(null);
    }, 1200);

    setIsSubmitting(false);
  };

  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"?`)) {
      return;
    }

    try {
      await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
    } catch {
      // Ignore network fail in static hosting
    }

    setArticles((prev) => {
      const updated = prev.filter((art) => art.id !== articleId);
      try {
        localStorage.setItem('gabs_cms_articles', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setStatusMessage({
      type: 'success',
      text: 'Article deleted successfully.',
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        'Restore default executive articles from GABS Financial editorial committee?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/articles/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
        localStorage.setItem('gabs_cms_articles', JSON.stringify(data.articles));
        setStatusMessage({
          type: 'success',
          text: 'Restored default editorial articles.',
        });
        setTimeout(() => setStatusMessage(null), 3000);
        return;
      }
    } catch {
      // Static fallback
    }

    setArticles(BLOG_ARTICLES);
    try {
      localStorage.setItem('gabs_cms_articles', JSON.stringify(BLOG_ARTICLES));
    } catch {
      // ignore
    }
    setStatusMessage({
      type: 'success',
      text: 'Restored default editorial articles.',
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };


  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === 'All' || art.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 ${
          isDark ? 'bg-[#090E17] text-[#F8FAFC]' : 'bg-[#F4F4F0] text-[#0B1320]'
        }`}
      >
        {/* Top Header */}
        <header
          className={`w-full border-b backdrop-blur-md px-5 sm:px-8 py-4 flex items-center justify-between ${
            isDark ? 'bg-[#0E1524]/90 border-white/10' : 'bg-white/95 border-black/10 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToSite}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-black/15 bg-black/5 hover:bg-black/10 text-neutral-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Website</span>
            </button>
            <div className="h-6 w-[1px] bg-current/15 hidden sm:block" />
            <GabsLogo variant={isDark ? 'header-dark' : 'header-light'} size="sm" />
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light theme"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'border-white/15 bg-[#172338] text-white hover:bg-white/10'
                : 'border-black/15 bg-neutral-100 text-[#0B1320] hover:bg-neutral-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        {/* Password Gate Card */}
        <main className="flex-1 flex items-center justify-center p-5 sm:p-8">
          <div
            className={`w-full max-w-md rounded-2xl border p-7 sm:p-9 shadow-2xl space-y-6 animate-fade-in ${
              isDark
                ? 'bg-[#111927] border-white/15 text-white'
                : 'bg-white border-black/10 text-[#0B1320]'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#00B876]/15 text-[#00B876] border border-[#00B876]/25 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00B876]">
                Restricted Editorial Desk
              </span>
              <h2
                className="font-display font-bold text-2xl sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CMS Authorization
              </h2>
              <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
                Only authorized GABS Financial personnel are permitted to create, edit, or publish research and blog articles.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cms-password"
                  className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-2"
                >
                  Enter Access Password
                </label>
                <div className="relative">
                  <input
                    id="cms-password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter editorial password"
                    autoFocus
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm pr-11 focus:outline-none focus:ring-2 focus:ring-[#00B876] transition-all ${
                      isDark
                        ? 'bg-[#0A0F18] border-white/15 text-white placeholder:text-white/35'
                        : 'bg-neutral-50 border-black/15 text-neutral-900 placeholder:text-neutral-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl font-semibold text-sm bg-[#00B876] text-[#060B14] hover:bg-[#009e65] transition-all cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Editorial Desk</span>
              </button>
            </form>

            <div className="pt-4 border-t border-current/10 flex items-center justify-between text-xs opacity-65">
              <span>Security Protected</span>
              <button
                type="button"
                onClick={onBackToSite}
                className="hover:underline text-[#0D51B2] dark:text-[#00B876] font-medium cursor-pointer"
              >
                Return to Site &rarr;
              </button>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-xs opacity-50 border-t border-current/10">
          © {new Date().getFullYear()} GABS Financial Services Limited · Internal Systems
        </footer>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? 'bg-[#090E17] text-[#F8FAFC]' : 'bg-[#F4F4F0] text-[#0B1320]'
      }`}
    >
      {/* Top Editor Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#0E1524]/90 border-white/10'
            : 'bg-white/95 border-black/10 shadow-sm'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToSite}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-black/15 bg-black/5 hover:bg-black/10 text-neutral-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Website</span>
            </button>

            <div className="h-6 w-[1px] bg-current/15 hidden sm:block" />

            <div className="flex items-center gap-3">
              <GabsLogo variant={isDark ? 'header-dark' : 'header-light'} size="sm" />
              <div className="hidden md:block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#00B876]">
                  Editorial Desk CMS
                </span>
                <span className="text-xs opacity-60 block">
                  Authoring &amp; Article Manager
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle dark/light theme"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-[#172338] text-white hover:bg-white/10'
                  : 'border-black/15 bg-neutral-100 text-[#0B1320] hover:bg-neutral-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Lock Editorial Desk and sign out"
              aria-label="Lock and sign out"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-white'
                  : 'border-black/15 bg-black/5 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 text-neutral-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock / Sign Out</span>
            </button>

            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#00B876] text-[#060B14] hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-current/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00B876]" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Content Management System
              </span>
            </div>
            <h1
              className="font-display font-bold text-2xl sm:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Insights &amp; Articles Manager
            </h1>
            <p className="text-sm opacity-75 max-w-xl">
              Publish and update articles for the “Market intelligence and wealth strategies from our desk” section.
              Changes update the live website immediately.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#0D51B2] text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              Articles ({articles.length})
            </button>
            <button
              type="button"
              onClick={handleStartCreate}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#00B876] text-[#060B14] shadow-sm'
                  : 'opacity-70 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
            {activeTab === 'edit' && (
              <span className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F2BF2D]/20 text-[#B48608] dark:text-[#F2BF2D] border border-current/20">
                Editing Article
              </span>
            )}
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-[#00B876]/15 text-[#00B876] border-[#00B876]/30'
                : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* TAB 1: LIST VIEW */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, author, or excerpt..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#121B2A] border-white/15 text-white'
                      : 'bg-white border-black/15 text-neutral-900 shadow-sm'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#121B2A] border-white/15 text-white'
                      : 'bg-white border-black/15 text-neutral-900 shadow-sm'
                  }`}
                >
                  <option value="All">All Categories ({articles.length})</option>
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="text-xs opacity-65 hover:opacity-100 inline-flex items-center gap-1.5 hover:underline cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    isDark
                      ? 'bg-[#111927] border-white/10 hover:border-[#00B876]/40'
                      : 'bg-white border-black/10 hover:border-[#0D51B2]/40 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900">
                      <img
                        src={getAssetUrl(art.imageUrl)}
                        alt={art.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback) {
                            target.dataset.triedFallback = '1';
                            target.src = '.' + art.imageUrl;
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0A0F18]/85 text-white backdrop-blur-md">
                        {art.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{art.date}</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h3
                      className="font-display font-bold text-lg sm:text-xl leading-snug line-clamp-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm opacity-75 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>

                    <div className="text-xs opacity-80 pt-2 border-t border-current/10">
                      By <strong className="font-semibold">{art.author}</strong> ({art.authorRole})
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-current/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(art)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-current/20 hover:border-[#0D51B2] hover:text-[#0D51B2] dark:hover:text-[#60A5FA] cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Article</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16 border border-dashed border-current/20 rounded-2xl space-y-3">
                <BookOpen className="w-10 h-10 opacity-30 mx-auto" />
                <p className="text-sm opacity-70">No articles match your search or filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('All');
                  }}
                  className="text-xs text-[#00B876] font-semibold hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 & 3: CREATE / EDIT FORM */}
        {(activeTab === 'create' || activeTab === 'edit') && (
          <form
            onSubmit={handleSaveArticle}
            className={`max-w-4xl mx-auto rounded-2xl border p-6 sm:p-10 space-y-6 ${
              isDark
                ? 'bg-[#111927] border-white/10'
                : 'bg-white border-black/10 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between border-b border-current/10 pb-4">
              <div>
                <h2
                  className="font-display font-bold text-xl sm:text-2xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {activeTab === 'edit' ? 'Edit Article' : 'Compose New Article'}
                </h2>
                <p className="text-xs opacity-70">
                  Fill in the article details below to publish to the GABS Financial knowledge desk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="text-xs font-semibold opacity-70 hover:opacity-100 hover:underline cursor-pointer"
              >
                ← Back to Articles List
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Navigating High-Yield Fixed Income & Commercial Papers in Nigeria"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                  isDark
                    ? 'bg-[#0B1320] border-white/20 text-white'
                    : 'bg-white border-black/20 text-neutral-900'
                }`}
              />
            </div>

            {/* Category & Read Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#0B1320] border-white/20 text-white'
                      : 'bg-white border-black/20 text-neutral-900'
                  }`}
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#0B1320] border-white/20 text-white'
                      : 'bg-white border-black/20 text-neutral-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Publication Date
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. October 2026"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#0B1320] border-white/20 text-white'
                      : 'bg-white border-black/20 text-neutral-900'
                  }`}
                />
              </div>
            </div>

            {/* Author & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Idika Uma Kalu"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#0B1320] border-white/20 text-white'
                      : 'bg-white border-black/20 text-neutral-900'
                  }`}
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_AUTHORS.slice(0, 4).map((pa) => (
                    <button
                      key={pa.name}
                      type="button"
                      onClick={() => {
                        setAuthor(pa.name);
                        setAuthorRole(pa.role);
                      }}
                      className="text-[11px] px-2 py-0.5 rounded border border-current/15 opacity-70 hover:opacity-100 hover:bg-current/5 cursor-pointer"
                    >
                      {pa.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Author Executive Role
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. MD/CEO, GABS Financial"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                    isDark
                      ? 'bg-[#0B1320] border-white/20 text-white'
                      : 'bg-white border-black/20 text-neutral-900'
                  }`}
                />
              </div>
            </div>

            {/* Cover Image Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Cover Photography
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_IMAGES.map((img) => {
                  const isSelected = imageUrl === img.url;
                  return (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#00B876] ring-2 ring-[#00B876]'
                          : 'border-current/15 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-neutral-900">
                        <img
                          src={getAssetUrl(img.url)}
                          alt={img.name}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.triedFallback) {
                              target.dataset.triedFallback = '1';
                              target.src = '.' + img.url;
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] font-medium pt-1 px-1 truncate">
                        {img.name}
                      </div>
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or enter custom image URL"
                className={`w-full px-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-[#00B876] ${
                  isDark
                    ? 'bg-[#0B1320] border-white/20 text-white'
                    : 'bg-white border-black/20 text-neutral-900'
                }`}
              />
            </div>

            {/* Excerpt / Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Executive Excerpt / Briefing Summary *
              </label>
              <textarea
                required
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise 1-2 sentence executive briefing shown on cards and preview lists..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                  isDark
                    ? 'bg-[#0B1320] border-white/20 text-white'
                    : 'bg-white border-black/20 text-neutral-900'
                }`}
              />
            </div>

            {/* Key Takeaways */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Key Takeaways (one bullet per line)
              </label>
              <textarea
                rows={3}
                value={takeawaysText}
                onChange={(e) => setTakeawaysText(e.target.value)}
                placeholder="Ladder maturities between 6 and 36 months to balance liquidity and peak yield curves.
Prioritize SEC-sanctioned commercial papers backed by strong corporate balance sheets.
Combine sovereign Treasury Bills with structured deposits for capital preservation."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                  isDark
                    ? 'bg-[#0B1320] border-white/20 text-white'
                    : 'bg-white border-black/20 text-neutral-900'
                }`}
              />
            </div>

            {/* Full Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Full Article Content (separate paragraphs with blank lines)
              </label>
              <textarea
                rows={7}
                value={contentParagraphs}
                onChange={(e) => setContentParagraphs(e.target.value)}
                placeholder="Paragraph 1: In an evolving macroeconomic environment, capital preservation paired with real yield generation remains the cornerstone of disciplined portfolio management in Nigeria...

Paragraph 2: Through GABS Fixed Income and GABS Time Classic, our investment committee rigorously screens corporate issuers and sovereign maturities...

Paragraph 3: Whether managing corporate working-capital reserves or personal family wealth, aligning duration with verified SEC-sanctioned instruments ensures your capital works harder..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                  isDark
                    ? 'bg-[#0B1320] border-white/20 text-white'
                    : 'bg-white border-black/20 text-neutral-900'
                }`}
              />
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-current/10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-current/20 hover:bg-current/5 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#00B876] text-[#060B14] hover:bg-white transition-colors cursor-pointer disabled:opacity-50 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Saving...'
                    : activeTab === 'edit'
                    ? 'Update Published Article'
                    : 'Publish Article'}
                </span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
