import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Image as ImageIcon,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BlogArticle } from '../data/gabsData';

interface ArticleCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: BlogArticle[];
  onArticlesUpdated: (updatedList: BlogArticle[]) => void;
  isDark: boolean;
}

const PRESET_IMAGES = [
  {
    name: 'Fixed Income & Treasury',
    url: '/src/assets/images/blog_fixed_income_treasury_1791591200706.jpg',
  },
  {
    name: 'Wealth Preservation & Legacy',
    url: '/src/assets/images/blog_wealth_preservation_strategy_1791591212093.jpg',
  },
  {
    name: 'SEC Governance & Compliance',
    url: '/src/assets/images/blog_sec_regulatory_governance_1791591222776.jpg',
  },
  {
    name: 'Corporate Treasury & Liquidity',
    url: '/src/assets/images/blog_corporate_treasury_liquidity_1791591242605.jpg',
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

export const ArticleCmsModal: React.FC<ArticleCmsModalProps> = ({
  isOpen,
  onClose,
  articles,
  onArticlesUpdated,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

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

  if (!isOpen) return null;

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

    const payload = {
      title,
      category,
      excerpt,
      author,
      authorRole,
      imageUrl,
      readTime,
      date,
      fullContent: fullContentArray.length > 0 ? fullContentArray : [excerpt],
      keyTakeaways: keyTakeawaysArray,
    };

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

      const data = await response.json();
      if (response.ok && data.success) {
        // Refresh articles list from server
        const listRes = await fetch('/api/articles');
        if (listRes.ok) {
          const listData = await listRes.json();
          onArticlesUpdated(listData.articles);
        }
        setStatusMessage({
          type: 'success',
          text: activeTab === 'edit' ? 'Article updated successfully.' : 'Article published to Insights & Articles.',
        });
        setTimeout(() => {
          setActiveTab('list');
          resetForm();
          setStatusMessage(null);
        }, 1500);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to save article.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error connecting to CMS server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove "${articleTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const listRes = await fetch('/api/articles');
        if (listRes.ok) {
          const listData = await listRes.json();
          onArticlesUpdated(listData.articles);
        }
        setStatusMessage({
          type: 'success',
          text: 'Article removed from editorial publications.',
        });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to delete article.',
      });
    }
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
        onArticlesUpdated(data.articles);
        setStatusMessage({
          type: 'success',
          text: 'Default executive articles restored successfully.',
        });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to restore default articles.',
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-[#101726] border-white/15 text-white'
            : 'bg-white border-black/10 text-neutral-900'
        }`}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-current/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D51B2] text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="cms-modal-title"
                  className="font-display font-bold text-xl sm:text-2xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  GABS Editorial Desk CMS
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#00B876]/15 text-[#00B876] border border-[#00B876]/25">
                  Content Studio
                </span>
              </div>
              <p className="text-xs opacity-70">
                Manage and publish articles for “Insights &amp; Articles · Market intelligence and wealth strategies from our desk”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close CMS modal"
              className="w-9 h-9 rounded-full border border-current/20 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-current/5 cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="px-6 py-3 bg-current/[0.03] border-b border-current/10 flex items-center justify-between gap-4 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#0D51B2] text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              Published Articles ({articles.length})
            </button>
            <button
              type="button"
              onClick={handleStartCreate}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#00B876] text-[#060B14] shadow-sm'
                  : 'opacity-70 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Article</span>
            </button>
            {activeTab === 'edit' && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F2BF2D]/20 text-[#B48608] dark:text-[#F2BF2D] border border-current/20">
                Editing Article
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="text-xs opacity-65 hover:opacity-100 inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Executive Defaults</span>
          </button>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-[#00B876]/15 text-[#00B876] border-[#00B876]/30'
                : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body Container (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                  Current Editorial Desk Publications
                </span>
                <span className="text-xs opacity-60">
                  Changes update the live website immediately
                </span>
              </div>

              <div className="divide-y divide-current/10 border border-current/10 rounded-xl overflow-hidden">
                {articles.map((art, idx) => (
                  <div
                    key={art.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-current/[0.02]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-[#00B876]">
                            {art.category}
                          </span>
                          <span className="opacity-40">·</span>
                          <span className="opacity-60">{art.date}</span>
                          <span className="opacity-40">·</span>
                          <span className="opacity-60">{art.readTime}</span>
                        </div>
                        <h4
                          className="font-display font-bold text-base sm:text-lg leading-snug"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {art.title}
                        </h4>
                        <div className="text-xs opacity-70">
                          By <strong className="font-semibold">{art.author}</strong> ({art.authorRole})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(art)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-current/20 hover:border-[#0D51B2] hover:text-[#0D51B2] dark:hover:text-[#60A5FA] cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'create' || activeTab === 'edit') && (
            <form onSubmit={handleSaveArticle} className="space-y-5">
              <div className="flex items-center justify-between border-b border-current/10 pb-3">
                <h4
                  className="font-display font-bold text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {activeTab === 'edit' ? 'Edit Article Details' : 'Create New Editorial Article'}
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="text-xs opacity-70 hover:opacity-100 hover:underline cursor-pointer"
                >
                  ← Back to List
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
                  <div className="flex gap-2">
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
                  </div>
                  {/* Preset quick author picker */}
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
                    Author Role
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
                            src={img.url}
                            alt={img.name}
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
                  Executive Excerpt / Summary *
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

              {/* Full Article Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Full Article Content (separate paragraphs with blank lines)
                </label>
                <textarea
                  rows={6}
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

              {/* Bottom Actions */}
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
                      ? 'Publishing...'
                      : activeTab === 'edit'
                      ? 'Update Published Article'
                      : 'Publish Article to Website'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
