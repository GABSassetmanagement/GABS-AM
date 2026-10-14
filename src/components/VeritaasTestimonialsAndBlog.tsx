import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Quote,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  Edit3,
} from 'lucide-react';
import {
  BLOG_ARTICLES,
  NIGERIAN_TESTIMONIALS,
  BlogArticle,
} from '../data/gabsData';
import {
  RevealOnScroll,
  ScrollTextReveal,
  TiltCutawayCard,
} from './InteractiveEffects';

interface VeritaasTestimonialsAndBlogProps {
  isDark: boolean;
}

export const VeritaasTestimonialsAndBlog: React.FC<
  VeritaasTestimonialsAndBlogProps
> = ({ isDark }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(
    null
  );
  const [allArticlesOpen, setAllArticlesOpen] = useState<boolean>(false);

  // Fetch live articles from CMS backend or localStorage (for GitHub Pages static hosts)
  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      // Check cached/custom articles from local CMS storage first
      try {
        const cached = localStorage.getItem('gabs_cms_articles');
        if (cached && isMounted) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
          }
        }
      } catch {
        // ignore
      }

      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.articles && Array.isArray(data.articles)) {
            setArticles(data.articles);
            localStorage.setItem('gabs_cms_articles', JSON.stringify(data.articles));
          }
        }
      } catch (err) {
        console.warn('Could not fetch articles from server CMS, using cached articles:', err);
      }
    };

    fetchArticles();

    // Synchronize if user edited articles in CMS in another tab or route
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gabs_cms_articles' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setArticles(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSlide = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = Math.max(container.clientWidth * 0.75, 340);
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`transition-colors duration-300 ${
        isDark ? 'bg-[#0A0F18] text-[#F8FAFC]' : 'bg-[#F6F6F2] text-[#0B1320]'
      }`}
    >
      {/* SECTION 1: CLIENT TESTIMONIALS (Text-Only, No Images, Authentic Nigerian Names) */}
      <section
        id="testimonials"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 border-b border-current/10"
      >
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Client Testimonials
              </span>
            </div>
            <ScrollTextReveal
              text="Trusted by discerning Nigerian investors and institutions."
              highlightWords={['Trusted', 'Nigerian', 'investors']}
              className="font-display font-bold text-crest-h2"
            />
          </div>
          <p className="text-crest-body opacity-75 max-w-md">
            Enduring partnerships built on capital preservation, regulatory
            integrity, and consistent investment performance.
          </p>
        </RevealOnScroll>

        {/* 2x2 Editorial Grid of Text-Only Testimonials with Nigerian Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {NIGERIAN_TESTIMONIALS.map((item, idx) => (
            <TiltCutawayCard
              key={item.id}
              delayMs={idx * 90}
              className={`rounded-2xl border p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:shadow-xl ${
                isDark
                  ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/40'
                  : 'border-black/10 bg-white hover:border-[#0D51B2]/40'
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0D51B2]/15 text-[#0D51B2] dark:bg-[#00B876]/15 dark:text-[#00B876] flex items-center justify-center">
                    <Quote className="w-5 h-5" />
                  </div>
                  <span className="text-crest-caption font-semibold px-3 py-1 rounded-full bg-[#00B876]/15 text-[#00B876]">
                    {item.productTag}
                  </span>
                </div>

                <blockquote className="text-crest-body leading-relaxed opacity-90">
                  “{item.quote}”
                </blockquote>
              </div>

              {/* Nigerian Client Attribution (No portrait image per user specification) */}
              <div className="mt-8 pt-5 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div
                    className="font-display font-bold text-lg sm:text-xl text-[#0D51B2] dark:text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.name}
                  </div>
                  <div className="text-crest-caption opacity-70">
                    {item.role}
                  </div>
                </div>
                <span className="text-crest-caption font-semibold opacity-60">
                  {item.location}
                </span>
              </div>
            </TiltCutawayCard>
          ))}
        </div>
      </section>

      {/* SECTION 2: HORIZONTALLY SLIDABLE BLOG & MARKET INSIGHTS SECTION WITH LEFT/RIGHT ARROWS & READ MORE CTA */}
      <section
        id="blog"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 border-b border-current/10"
      >
        <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#0D51B2]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Insights &amp; Articles
              </span>
            </div>
            <ScrollTextReveal
              text="Market intelligence and wealth strategies from our desk."
              highlightWords={['Market', 'intelligence', 'wealth']}
              className="font-display font-bold text-crest-h2"
            />
          </div>

          {/* Left & Right Slide Arrow Controls + Desk CMS Button + Read More Blogs Button */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSlide('left')}
                aria-label="Slide blog articles left"
                title="Previous articles"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] ${
                  isDark
                    ? 'border-white/20 bg-[#111927] text-white hover:bg-[#00B876] hover:text-[#060B14] hover:border-[#00B876]'
                    : 'border-black/15 bg-white text-[#0B1320] hover:bg-[#0D51B2] hover:text-white hover:border-[#0D51B2]'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSlide('right')}
                aria-label="Slide blog articles right"
                title="Next articles"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] ${
                  isDark
                    ? 'border-white/20 bg-[#111927] text-white hover:bg-[#00B876] hover:text-[#060B14] hover:border-[#00B876]'
                    : 'border-black/15 bg-white text-[#0B1320] hover:bg-[#0D51B2] hover:text-white hover:border-[#0D51B2]'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAllArticlesOpen(true)}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-crest-ui font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Read More Blogs</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#cms"
              onClick={() => {
                window.location.hash = '#cms';
              }}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-crest-ui font-semibold border transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                isDark
                  ? 'border-white/20 bg-[#111927] text-white hover:bg-[#00B876] hover:text-[#060B14] hover:border-[#00B876]'
                  : 'border-black/15 bg-white text-[#0B1320] hover:bg-[#0D51B2] hover:text-white hover:border-[#0D51B2]'
              }`}
              title="Open Editorial Desk CMS to write, edit, and publish articles"
            >
              <Edit3 className="w-4 h-4 text-[#00B876]" />
              <span>Editorial CMS</span>
            </a>
          </div>
        </RevealOnScroll>

        {/* Horizontally Slidable Carousel of Blog Articles */}
        <div
          ref={sliderRef}
          className="flex gap-6 sm:gap-7 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {articles.map((article, idx) => (
            <div
              key={article.id}
              className="snap-start shrink-0 w-[86vw] sm:w-[400px] lg:w-[420px]"
            >
              <TiltCutawayCard
                delayMs={idx * 90}
                onClick={() => setSelectedArticle(article)}
                className={`h-full rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:shadow-xl ${
                  isDark
                    ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/50'
                    : 'border-black/10 bg-white hover:border-[#0D51B2]/50'
                }`}
              >
                <div>
                  {/* Article Cover Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-neutral-900">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-crest-caption font-semibold bg-black/65 text-white backdrop-blur-md border border-white/15">
                      {article.category}
                    </span>
                  </div>

                  {/* Article Body */}
                  <div className="p-6 sm:p-7 space-y-3.5">
                    <div className="flex items-center gap-4 text-crest-caption opacity-65">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold text-xl sm:text-2xl leading-snug group-hover:text-[#0D51B2] dark:group-hover:text-[#00B876] transition-colors"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {article.title}
                    </h3>

                    <p className="text-crest-body opacity-75 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Article Footer */}
                <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-current/10 flex items-center justify-between gap-3">
                  <div>
                    <div
                      className="font-display font-bold text-sm"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {article.author}
                    </div>
                    <div className="text-crest-caption opacity-65">
                      {article.authorRole}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-crest-ui font-semibold text-[#0D51B2] dark:text-[#00B876]">
                    <span>Read</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </TiltCutawayCard>
            </div>
          ))}
        </div>
      </section>

      {/* Single Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
                isDark
                  ? 'bg-[#111927] border-white/15 text-white'
                  : 'bg-white border-black/10 text-[#0B1320]'
              }`}
            >
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-neutral-900">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Close article"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center hover:bg-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-5 left-6 right-6 text-white space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#00B876] text-[#060B14]">
                    {selectedArticle.category}
                  </span>
                  <h2
                    className="font-display font-bold text-2xl sm:text-3xl leading-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-9 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-current/10 text-crest-caption opacity-75">
                  <div>
                    By{' '}
                    <span className="font-semibold">
                      {selectedArticle.author}
                    </span>{' '}
                    ({selectedArticle.authorRole})
                  </div>
                  <div>
                    {selectedArticle.date} · {selectedArticle.readTime}
                  </div>
                </div>

                <div className="space-y-4 text-crest-body leading-relaxed opacity-90">
                  {selectedArticle.fullContent.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div
                  className={`rounded-xl p-5 space-y-3 border ${
                    isDark
                      ? 'bg-[#0A0F18] border-white/10'
                      : 'bg-[#F6F6F2] border-black/10'
                  }`}
                >
                  <h4
                    className="font-display font-bold text-base text-[#0D51B2] dark:text-[#00B876]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Key Takeaways for Investors
                  </h4>
                  <ul className="space-y-2 text-crest-ui">
                    {selectedArticle.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#00B876] shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="px-5 py-2.5 rounded-full text-crest-ui font-semibold border border-current/20 hover:bg-current/5 cursor-pointer"
                  >
                    Close Article
                  </button>
                  <a
                    href="#contact"
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2.5 rounded-full text-crest-ui font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] transition-colors"
                  >
                    Speak with an Advisor
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Blogs & Articles Hub Modal */}
      <AnimatePresence>
        {allArticlesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
            onClick={() => setAllArticlesOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 sm:p-10 shadow-2xl ${
                isDark
                  ? 'bg-[#0A0F18] border-white/15 text-white'
                  : 'bg-[#F6F6F2] border-black/10 text-[#0B1320]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-current/10">
                <div>
                  <span className="text-crest-caption font-semibold text-[#00B876]">
                    GABS Financial Knowledge Hub
                  </span>
                  <h2
                    className="font-display font-bold text-2xl sm:text-3xl mt-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    All Research, Blogs &amp; Market Articles
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="#cms"
                    onClick={() => {
                      setAllArticlesOpen(false);
                      window.location.hash = '#cms';
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border border-current/20 hover:border-[#00B876] hover:text-[#00B876] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#00B876]" />
                    <span>Editorial CMS</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setAllArticlesOpen(false)}
                    aria-label="Close blog hub"
                    className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-current/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setAllArticlesOpen(false);
                      setSelectedArticle(art);
                    }}
                    className={`rounded-xl border p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:-translate-y-1 ${
                      isDark
                        ? 'bg-[#111927] border-white/10 hover:border-[#00B876]'
                        : 'bg-white border-black/10 hover:border-[#0D51B2]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-crest-caption opacity-70">
                        <span className="font-semibold text-[#00B876]">
                          {art.category}
                        </span>
                        <span>
                          {art.date} · {art.readTime}
                        </span>
                      </div>
                      <h3
                        className="font-display font-bold text-xl"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {art.title}
                      </h3>
                      <p className="text-crest-body opacity-75">{art.excerpt}</p>
                    </div>
                    <div className="pt-3 border-t border-current/10 flex items-center justify-between text-crest-ui font-semibold text-[#0D51B2] dark:text-[#00B876]">
                      <span>By {art.author}</span>
                      <span className="inline-flex items-center gap-1">
                        Read Article <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
