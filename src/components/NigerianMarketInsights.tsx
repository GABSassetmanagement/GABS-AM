import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Landmark,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { RevealOnScroll, ScrollTextReveal, TiltCutawayCard } from './InteractiveEffects';

export interface MarketInsightItem {
  id: string;
  category: 'Capital Markets' | 'Fixed Income & CBN' | 'SEC Regulations' | 'Macro & Growth';
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  date: string;
  statBadge?: string;
  implication: string;
}

export const LATEST_NIGERIAN_MARKET_INSIGHTS: MarketInsightItem[] = [
  {
    id: 'ngx-capital-mobilization-2026',
    category: 'Capital Markets',
    title: 'NGX Facilitates Over ₦13.6 Trillion in FGN Bonds and Corporate Listings',
    summary:
      'The Nigerian Exchange Group accelerated capital formation with over ₦10.84 trillion mobilized through Federal Government Bonds and ₦2.76 trillion in corporate listings across commercial papers and equities, advancing toward a ₦300 trillion market capitalization target.',
    source: 'NGX Group / Financial Markets Desk',
    sourceUrl: 'https://ngxgroup.com',
    date: 'October 2026',
    statBadge: '₦13.6T+ Mobilized',
    implication:
      'Robust primary market activity provides institutional and private wealth investors with high-grade corporate debt and prime yield opportunities.',
  },
  {
    id: 'sec-portfolio-management-rules',
    category: 'SEC Regulations',
    title: 'SEC Enforces Enhanced Rules for Fund & Portfolio Management Operations',
    summary:
      'The Securities and Exchange Commission (SEC) Nigeria enacted comprehensive amendments to regulations governing portfolio managers. New guidelines mandate segregated custody, strict mitigation of conflict-of-interest, and retail investor capital protection strictly in SEC-sanctioned instruments.',
    source: 'Securities & Exchange Commission (SEC) Nigeria',
    sourceUrl: 'https://sec.gov.ng',
    date: 'Effective Late 2026',
    statBadge: 'SEC Supervised',
    implication:
      'Validates GABS Financial’s licensed, custodial-grade architecture, ensuring investor principal remains insulated and strictly held in permissible asset classes.',
  },
  {
    id: 'cbn-treasury-bills-yields',
    category: 'Fixed Income & CBN',
    title: 'Nigerian Treasury Bills 364-Day Stop Rates Anchor at 15.85% – 17.35% Range',
    summary:
      'Central Bank of Nigeria (CBN) Open Market Operations and NTB auctions maintained strong institutional demand with 364-day stop rates around 15.85% (effective annualized true yield near 19% under discount pricing), with substantial oversubscription on long tenors.',
    source: 'Central Bank of Nigeria / Debt Management Office',
    sourceUrl: 'https://cbn.gov.ng',
    date: 'October 2026',
    statBadge: '~19% True Yield',
    implication:
      'Underpins competitive rates on GABS Fixed Income and GABS Time Classic structured deposits for wealth preservation.',
  },
  {
    id: 'imf-worldbank-gdp-outlook',
    category: 'Macro & Growth',
    title: 'IMF & World Bank Project Nigeria’s Economic Expansion at 4.2% – 4.3%',
    summary:
      'Macroeconomic forecasts from multilateral lenders project Nigerian GDP growth accelerating to 4.2% in 2026 and 4.3% in 2027, propelled by key fiscal reforms, enhanced foreign exchange liquidity, and 65 strategic national investment pipelines totaling $78.5 billion.',
    source: 'World Bank & IMF Sub-Saharan Africa Monitor',
    sourceUrl: 'https://www.worldbank.org',
    date: '2026 Economic Outlook',
    statBadge: '4.2% GDP Forecast',
    implication:
      'Provides a constructive multi-year economic runway for strategic equity, alternative asset deployment, and structured private wealth growth.',
  },
  {
    id: 'banking-recapitalization-ngx-invest',
    category: 'Capital Markets',
    title: 'Banking Recapitalization: NGX Invest Digital Channel Powers ₦2.8T Inflows',
    summary:
      'The Central Bank banking recapitalization exercise reached a pivotal milestone as NGX Invest digital platform routed over 60% of all public offers and rights issues across 33 tier-1 and tier-2 deposit money institutions.',
    source: 'Capital Market Operators Association / NGX',
    sourceUrl: 'https://ngxgroup.com',
    date: 'Financial Sector Review',
    statBadge: '₦2.8T Digital Volume',
    implication:
      'Deepens capital market liquidity and creates attractive hybrid instruments for institutional portfolio asset managers.',
  },
  {
    id: 'sustainability-reporting-standards',
    category: 'SEC Regulations',
    title: 'FRC & SEC Issue Roadmap for IFRS S1 & S2 Sustainability Governance',
    summary:
      'Nigeria leads continental corporate transparency with an official regulatory timeline requiring public companies and SEC-licensed managers to integrate climate, sustainability, and rigorous ESG disclosures into governance reporting.',
    source: 'Financial Reporting Council of Nigeria / SEC',
    sourceUrl: 'https://sec.gov.ng',
    date: 'Regulatory Directive',
    statBadge: 'IFRS S1 & S2',
    implication:
      'Reinforces GABS Financial’s fifth core pillar: Sustainable Wealth, prioritizing long-term stability and resilient capital allocation.',
  },
];

interface NigerianMarketInsightsProps {
  isDark: boolean;
}

export const NigerianMarketInsights: React.FC<NigerianMarketInsightsProps> = ({
  isDark,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedInsight, setSelectedInsight] = useState<MarketInsightItem | null>(null);
  const [insights, setInsights] = useState<MarketInsightItem[]>(LATEST_NIGERIAN_MARKET_INSIGHTS);
  const [lastUpdated, setLastUpdated] = useState<string>('October 2026');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  // Fetch latest daily market insights from the server
  useEffect(() => {
    let isMounted = true;
    const fetchInsights = async () => {
      try {
        const res = await fetch('/api/market-insights');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.items && Array.isArray(data.items)) {
            setInsights(data.items);
            if (data.lastUpdatedFormatted) {
              setLastUpdated(data.lastUpdatedFormatted);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch daily market insights:', err);
      }
    };

    fetchInsights();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshMessage(null);

    try {
      const res = await fetch('/api/market-insights/refresh', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setInsights(data.items);
          if (data.lastUpdatedFormatted) {
            setLastUpdated(data.lastUpdatedFormatted);
          }
          setRefreshMessage('Daily feed updated with latest disclosures.');
          setTimeout(() => setRefreshMessage(null), 4000);
        }
      }
    } catch {
      setRefreshMessage('Sync failed. Please check connection.');
      setTimeout(() => setRefreshMessage(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const categories = ['All', 'Capital Markets', 'Fixed Income & CBN', 'SEC Regulations', 'Macro & Growth'];

  const filteredInsights =
    activeCategory === 'All'
      ? insights
      : insights.filter((item) => item.category === activeCategory);

  return (
    <section
      id="market-insights"
      className={`relative w-full py-20 sm:py-28 border-b border-current/10 transition-colors duration-300 ${
        isDark ? 'bg-[#0A0F18] text-[#F8FAFC]' : 'bg-[#F6F6F2] text-[#0B1320]'
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 gap-6">
          <RevealOnScroll className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 flex-wrap">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#00B876] animate-pulse"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Market Insights &amp; Intelligence
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#00B876]/15 text-[#00B876] border border-[#00B876]/25">
                Auto-Updated Daily
              </span>
            </div>

            <ScrollTextReveal
              text="Real-time pulse of the Nigerian investment sector."
              highlightWords={['Nigerian', 'investment', 'sector.']}
              highlightColorClass="text-[#0D51B2] dark:text-[#00B876]"
              className="font-display font-bold text-crest-h2"
            />

            <p className="text-crest-body opacity-80">
              Curated financial market intelligence on the Nigerian Exchange (NGX),
              Securities and Exchange Commission (SEC) supervisory directives, Central Bank
              treasury auctions, and sovereign macroeconomic dynamics.
            </p>

            {/* Daily Synchronization Live Status Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs opacity-75">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B876]" />
                Daily feed synchronized: <strong className="font-semibold tabular-nums">{lastUpdated}</strong>
              </span>
              <span>·</span>
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 font-semibold text-[#0D51B2] dark:text-[#00B876] hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Updating feed...' : 'Refresh Feed Now'}</span>
              </button>
              {refreshMessage && (
                <span className="text-[#00B876] font-medium animate-fade-in">
                  ✓ {refreshMessage}
                </span>
              )}
            </div>
          </RevealOnScroll>

          {/* Interactive Category Filter Tabs */}
          <RevealOnScroll delayMs={100} className="shrink-0">
            <div
              className={`p-1.5 rounded-2xl border flex flex-wrap gap-1 ${
                isDark
                  ? 'bg-[#111927] border-white/10'
                  : 'bg-white border-black/10 shadow-sm'
              }`}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? isDark
                          ? 'bg-[#00B876] text-[#060B14] font-semibold shadow-sm'
                          : 'bg-[#0D51B2] text-white font-semibold shadow-sm'
                        : isDark
                        ? 'text-white/70 hover:text-white hover:bg-white/5'
                        : 'text-neutral-700 hover:text-neutral-950 hover:bg-black/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>

        {/* 6 High-Fidelity Intelligence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredInsights.map((insight, idx) => (
            <TiltCutawayCard
              key={insight.id}
              delayMs={idx * 75}
              onClick={() => setSelectedInsight(insight)}
              glowColor={
                insight.category === 'Fixed Income & CBN'
                  ? 'rgba(0, 184, 118, 0.16)'
                  : insight.category === 'SEC Regulations'
                  ? 'rgba(13, 81, 178, 0.18)'
                  : 'rgba(242, 191, 45, 0.16)'
              }
              className={`rounded-2xl border p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:shadow-xl ${
                isDark
                  ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/40'
                  : 'border-black/10 bg-white hover:border-[#0D51B2]/40 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Card Meta Row (Quiet Unboxed Text per Anti-Slop Discipline) */}
                <div className="flex items-center justify-between text-xs text-opacity-70">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        insight.category === 'Fixed Income & CBN'
                          ? 'text-[#00B876]'
                          : insight.category === 'SEC Regulations'
                          ? 'text-[#0D51B2] dark:text-[#60A5FA]'
                          : 'text-[#B48608] dark:text-[#F2BF2D]'
                      }`}
                    >
                      {insight.category}
                    </span>
                    <span aria-hidden="true" className="opacity-40">
                      ·
                    </span>
                    <span className="opacity-60 tabular-nums">{insight.date}</span>
                  </div>

                  {insight.statBadge && (
                    <span className="text-[11px] font-mono font-semibold opacity-80 tabular-nums">
                      {insight.statBadge}
                    </span>
                  )}
                </div>

                {/* Article Headline */}
                <h3
                  className="font-display font-bold text-xl sm:text-2xl leading-snug tracking-tight hover:text-[#00B876] transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {insight.title}
                </h3>

                {/* Summary Copy */}
                <p className="text-crest-body opacity-80 line-clamp-3">
                  {insight.summary}
                </p>

                {/* GABS Investment Implication Callout */}
                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    isDark
                      ? 'bg-[#0A0F18]/80 border-white/10 text-white/85'
                      : 'bg-[#F6F6F2] border-black/5 text-neutral-800'
                  }`}
                >
                  <span className="font-semibold text-[#00B876] block mb-1">
                    Portfolio Allocation Impact:
                  </span>
                  <span>{insight.implication}</span>
                </div>
              </div>

              {/* Card Footer: Source Attribution & Read Action */}
              <div className="pt-5 mt-6 border-t border-current/10 flex items-center justify-between text-xs">
                <span className="opacity-60 truncate max-w-[210px]">
                  Source: {insight.source}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-[#0D51B2] dark:text-[#00B876]">
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </TiltCutawayCard>
          ))}
        </div>

        {/* Bottom Institutional Disclaimer & Macro Data Banner */}
        <RevealOnScroll
          delayMs={150}
          className={`mt-14 rounded-2xl p-6 sm:p-8 border flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDark
              ? 'bg-[#121D2F] border-white/10'
              : 'bg-[#EBF2FC] border-[#0D51B2]/15 text-[#0A1A33]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D51B2] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4
                className="font-display font-bold text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Institutional Yield &amp; Regulatory Grounding
              </h4>
              <p className="text-xs sm:text-sm opacity-80 max-w-2xl mt-0.5">
                Market data is synchronized with Nigerian Exchange Group (NGX) disclosures,
                Debt Management Office (DMO) auctions, and SEC circulars to guide our fund and portfolio mandates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#products"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#00B876] text-[#060B14] hover:bg-white transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              Explore Yield Products
            </a>
            <a
              href="#contact"
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-black/20 text-neutral-900 hover:bg-black/5'
              }`}
            >
              Advisory Desk
            </a>
          </div>
        </RevealOnScroll>
      </div>

      {/* Modal Dialog for Deep Insight Review */}
      {selectedInsight && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedInsight(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-2xl border p-7 sm:p-9 shadow-2xl space-y-6 ${
              isDark
                ? 'bg-[#111927] border-white/15 text-white'
                : 'bg-white border-black/10 text-neutral-900'
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-current/10 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#00B876] uppercase tracking-wider">
                  {selectedInsight.category} · {selectedInsight.date}
                </span>
                <h3
                  className="font-display font-bold text-2xl sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {selectedInsight.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                aria-label="Close Insight modal"
                className="w-8 h-8 rounded-full border border-current/20 flex items-center justify-center opacity-70 hover:opacity-100 cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-crest-body">
              <p className="leading-relaxed opacity-90">{selectedInsight.summary}</p>

              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  isDark
                    ? 'bg-[#0A0F18] border-white/10'
                    : 'bg-[#F8F8F5] border-black/10'
                }`}
              >
                <div className="text-xs font-semibold text-[#00B876]">
                  Strategic GABS Portfolio Context:
                </div>
                <p className="text-sm opacity-85 leading-relaxed">
                  {selectedInsight.implication}
                </p>
              </div>

              <div className="text-xs opacity-70 pt-2">
                Published Source: <span className="font-semibold">{selectedInsight.source}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-current/10 flex items-center justify-between gap-4">
              <a
                href={selectedInsight.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D51B2] dark:text-[#00B876] hover:underline"
              >
                <span>Visit Source Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] transition-colors cursor-pointer"
              >
                Close Insight
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
