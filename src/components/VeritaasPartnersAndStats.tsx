import React from 'react';
import { PARTNER_INSTITUTIONS, VERITAAS_STATS } from '../data/gabsData';
import { RevealOnScroll, AnimatedCounter } from './InteractiveEffects';

interface VeritaasPartnersAndStatsProps {
  isDark: boolean;
}

/**
 * Replicates Veritaas "Companies we worked with" logo strip (PDF 2 page 2)
 * followed immediately by the Veritaas 4-row full-width metrics block (PDF 2 page 3)
 * with full Dark/Light mode support and IntersectionObserver animations.
 */
export const VeritaasPartnersAndStats: React.FC<
  VeritaasPartnersAndStatsProps
> = ({ isDark }) => {
  return (
    <section
      id="partners"
      className={`relative w-full transition-colors duration-300 border-b ${
        isDark
          ? 'bg-[#090C10] text-white border-white/10'
          : 'bg-[#EFEFE8] text-[#0B1320] border-black/10'
      }`}
    >
      {/* Part 1: Veritaas "COMPANIES WE WORKED WITH" / Partners & Stakeholders Strip */}
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-14">
        <div
          className={`border-t pt-10 flex flex-col items-center ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <RevealOnScroll className="inline-flex items-center gap-2.5 mb-10">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
            />
            <span className="text-crest-ui font-semibold tracking-wide opacity-85">
              Our Partners &amp; Stakeholders
            </span>
          </RevealOnScroll>

          {/* Partner Logos Grid with staggered IntersectionObserver reveal */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-center justify-items-center">
            {PARTNER_INSTITUTIONS.map((partner, idx) => (
              <RevealOnScroll
                key={partner.name}
                delayMs={idx * 80}
                className="group flex flex-col items-center text-center px-3 py-3 transition-opacity duration-200 opacity-80 hover:opacity-100"
              >
                <span
                  className="font-display font-bold text-lg sm:text-xl tracking-tight group-hover:text-[#0D51B2] dark:group-hover:text-[#00B876] transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {partner.shortName}
                </span>
                <span className="text-crest-caption opacity-60 mt-1">
                  {partner.name} · {partner.role}
                </span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* Part 2: Veritaas 4-Row Full-Width Institutional Metrics Block (Subheadings & Stats H3: 24px - 32px) */}
      <div
        id="impact"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pb-20 sm:pb-28"
      >
        <div
          className={`border-t ${
            isDark ? 'border-white/15' : 'border-black/15'
          }`}
        >
          {VERITAAS_STATS.map((stat, idx) => (
            <RevealOnScroll
              key={stat.label}
              delayMs={idx * 95}
              className={`group py-7 sm:py-9 border-b grid grid-cols-1 md:grid-cols-12 items-baseline gap-4 md:gap-8 transition-colors px-2 sm:px-4 ${
                isDark
                  ? 'border-white/15 hover:bg-white/[0.02]'
                  : 'border-black/15 hover:bg-black/[0.02]'
              }`}
            >
              {/* Left Column: Indicator Dot + Category Label (14px-15px UI Label) */}
              <div className="md:col-span-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    idx % 2 === 0 ? 'bg-[#00B876]' : 'bg-[#F2BF2D]'
                  }`}
                />
                <span className="text-crest-ui font-semibold opacity-85 tracking-normal">
                  {stat.label}
                </span>
              </div>

              {/* Right Column: Configured Subheadings & Stats H3 (24px–32px) + 12px Caption */}
              <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6">
                <h3
                  className="font-display font-bold text-crest-h3 tabular-nums group-hover:text-[#0D51B2] dark:group-hover:text-[#00B876] transition-colors duration-200"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <AnimatedCounter
                    prefix={stat.prefix}
                    target={stat.numericTarget}
                    startFrom={stat.numericStart ?? 0}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </h3>
                <span className="text-crest-caption opacity-65 max-w-xs sm:text-right">
                  {stat.sublabel}
                </span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
