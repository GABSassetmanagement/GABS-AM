import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  CORE_VALUES,
  WHY_INVEST_REASONS,
  GABS_PRODUCTS,
  INVESTMENT_STRATEGY_INSTRUMENTS,
  GABS_SERVICES,
  VALUE_PROPOSITIONS,
  FIVE_YEAR_VISION_PILLARS,
} from '../data/gabsData';
import {
  RevealOnScroll,
  ScrollTextReveal,
  TiltCutawayCard,
  ScrollRotatingSeal,
  AnimatedCounter,
} from './InteractiveEffects';

interface VeritaasCoreSectionsProps {
  isDark: boolean;
}

export const VeritaasCoreSections: React.FC<VeritaasCoreSectionsProps> = ({
  isDark,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    GABS_PRODUCTS[0].id
  );
  const [calcAmount, setCalcAmount] = useState<number>(5000000);
  const [calcTenureMonths, setCalcTenureMonths] = useState<number>(12);

  // Illustrative yield calculation for GABS Time Classic (6-36 months, min NGN 1,000,000)
  const annualYieldRate =
    calcTenureMonths >= 24 ? 0.215 : calcTenureMonths >= 12 ? 0.195 : 0.175;
  const estimatedReturn = Math.round(
    calcAmount * annualYieldRate * (calcTenureMonths / 12)
  );
  const totalMaturityValue = calcAmount + estimatedReturn;

  return (
    <div
      className={`transition-colors duration-300 ${
        isDark ? 'bg-[#0A0F18] text-[#F8FAFC]' : 'bg-[#F6F6F2] text-[#0B1320]'
      }`}
    >
      {/* SECTION 1: WHO WE ARE + VISION, MISSION & CORE VALUES (Brochure Pages 2, 3, 4) */}
      <section
        id="about"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 border-b border-current/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Column: Section Kicker + H2 (40px-48px) + Body Copy (16px-18px) */}
          <RevealOnScroll className="lg:col-span-5 lg:sticky lg:top-40 space-y-6">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Who We Are
              </span>
            </div>

            <ScrollTextReveal
              text="Built on trust, expertise, and client-centricity."
              highlightWords={['trust,', 'expertise,', 'client-centricity.']}
              className="font-display font-bold text-crest-h2"
            />

            <p className="text-crest-body opacity-85">
              We are pleased to introduce GABS Financial Services Limited (GABS
              Financial), a company incorporated on the 11th of June 2021.
            </p>
            <p className="text-crest-body opacity-75">
              In July 2024, the Securities and Exchange Commission licensed the
              company as a fund and portfolio management company built on the
              principles of trust, expertise, and client-centricity. As a proud
              member of the Fund Managers Association of Nigeria, we adhere to
              the highest industry standards, ensuring the security and growth
              of your investments.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <ScrollRotatingSeal isDark={isDark} />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-crest-h3 text-[#0D51B2] dark:text-[#60A5FA]">
                  Grow Your Worth
                </h3>
                <p className="text-crest-caption opacity-70 max-w-xs">
                  Licensed, Regulated &amp; Supervised by Securities &amp;
                  Exchange Commission (SEC) Nigeria.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right Column: Executive Suite Visual + Vision & Mission + 5 Core Values */}
          <div className="lg:col-span-7 space-y-10">
            {/* Executive Advisory Image with Layered Hover Cutaway + Tailwind Lift & Scale */}
            <TiltCutawayCard
              delayMs={100}
              className={`rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl ${
                isDark
                  ? 'border-white/10 bg-[#111927]'
                  : 'border-black/10 bg-white'
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-neutral-900">
                <img
                  src="/frontdesk.jpg"
                  alt="GABS Financial Front Desk and Executive Reception in Abuja"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.04] saturate-[1.05] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-crest-caption text-white/80">
                      Headquarters · Central Business District, Abuja
                    </p>
                    <h3
                      className="font-display font-bold text-crest-h3 mt-0.5"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      GABS Financial Services Limited
                    </h3>
                  </div>
                  <span className="text-crest-caption text-[#00B876] font-semibold">
                    SEC Licensed · FMAN Member
                  </span>
                </div>
              </div>

              {/* Vision & Mission Split inside card footer */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-crest-caption font-semibold text-[#0D51B2] dark:text-[#60A5FA]">
                    <span>01. Our Vision</span>
                  </div>
                  <h3 className="font-display font-bold text-crest-h3">
                    To be the most sought after investment manager in Africa.
                  </h3>
                </div>
                <div className="space-y-2 md:border-l md:border-current/10 md:pl-8">
                  <div className="flex items-center gap-2 text-crest-caption font-semibold text-[#00B876]">
                    <span>02. Our Mission</span>
                  </div>
                  <p className="text-crest-body opacity-85">
                    To create sustainable wealth by delivering innovative
                    investment solutions with integrity, speed, and a strong
                    focus on value.
                  </p>
                </div>
              </div>
            </TiltCutawayCard>

            {/* Our Core Values (Value, Innovation, Integrity, Speed, Sustainability) */}
            <RevealOnScroll delayMs={150} className="space-y-4">
              <div className="flex items-center justify-between border-b border-current/10 pb-3">
                <h3 className="font-display font-bold text-crest-h3">
                  Our Core Values
                </h3>
                <span className="text-crest-caption opacity-60">
                  5 Guiding Pillars · GABS Identity
                </span>
              </div>

              <div className="divide-y divide-current/10">
                {CORE_VALUES.map((val, idx) => (
                  <RevealOnScroll
                    key={val.step}
                    delayMs={idx * 70}
                    className="py-4 sm:py-5 px-3 -mx-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 group transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-current/[0.03]"
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className="font-display font-bold text-crest-ui text-[#00B876] tabular-nums"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {val.step}.
                      </span>
                      <h4
                        className="font-display font-bold text-crest-h3 group-hover:text-[#0D51B2] dark:group-hover:text-[#00B876] transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {val.name}
                      </h4>
                    </div>
                    <p className="text-crest-body opacity-75 sm:max-w-md sm:text-right">
                      {val.detail}
                    </p>
                  </RevealOnScroll>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Sub-block: Why Invest with GABS Financial? (Brochure Page 4) */}
        <div className="mt-20 pt-16 border-t border-current/10">
          <RevealOnScroll className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#0D51B2]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Why Invest with GABS Financial?
              </span>
            </div>
            <h2 className="font-display font-bold text-crest-h2">
              We understand that investors seek security, transparency, and
              consistent returns.
            </h2>
            <p className="text-crest-body opacity-80">
              Our investment solutions are designed to provide exactly that.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_INVEST_REASONS.map((reason, idx) => (
              <TiltCutawayCard
                key={reason.step}
                delayMs={idx * 80}
                className={`p-6 rounded-xl border transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl ${
                  isDark
                    ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/50'
                    : 'border-black/10 bg-white hover:border-[#0D51B2]/50'
                }`}
              >
                <div className="flex flex-col justify-between h-full space-y-5">
                  <span
                    className="font-display font-bold text-crest-h3 text-[#0D51B2] dark:text-[#00B876] tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {reason.step}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl leading-snug">
                      {reason.title}
                    </h3>
                    <p className="text-crest-body opacity-75">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </TiltCutawayCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR PRODUCTS & INTERACTIVE PRODUCT POSITIONING + YIELD ESTIMATOR (Brochure Page 5) */}
      <section
        id="products"
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
                Our Products
              </span>
            </div>
            <ScrollTextReveal
              text="Tailored investment solutions engineered to grow your worth."
              highlightWords={['grow', 'your', 'worth.']}
              className="font-display font-bold text-crest-h2"
            />
          </div>
          <p className="text-crest-body opacity-75 max-w-md">
            Select any GABS Financial product below to inspect its positioning,
            underlying instruments, and subscription parameters.
          </p>
        </RevealOnScroll>

        {/* 3 Product Cards with Staggered IO Reveal, Cursor-Tracking Tilt, and Subtle Scale-Up & Shadow-Lift Hover Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {GABS_PRODUCTS.map((product, idx) => {
            const isSelected = product.id === selectedProductId;
            const accentBarColor =
              product.accentColor === 'blue'
                ? 'bg-[#0D51B2]'
                : product.accentColor === 'emerald'
                ? 'bg-[#00B876]'
                : 'bg-[#F2BF2D]';

            const accentBadgeBg =
              product.accentColor === 'blue'
                ? 'bg-[#0D51B2]/10 text-[#0D51B2] dark:text-[#60A5FA] border-[#0D51B2]/20'
                : product.accentColor === 'emerald'
                ? 'bg-[#00B876]/10 text-[#00B876] border-[#00B876]/20'
                : 'bg-[#F2BF2D]/10 text-[#B48608] dark:text-[#F2BF2D] border-[#F2BF2D]/20';

            return (
              <TiltCutawayCard
                key={product.id}
                delayMs={idx * 100}
                onClick={() => {
                  setSelectedProductId(product.id);
                  if (product.id === 'gabs-time-classic') {
                    setCalcTenureMonths(12);
                  } else if (product.id === 'gabs-fixed-income') {
                    setCalcTenureMonths(6);
                  } else {
                    setCalcTenureMonths(24);
                  }
                }}
                glowColor={
                  product.accentColor === 'emerald'
                    ? 'rgba(0, 184, 118, 0.22)'
                    : product.accentColor === 'gold'
                    ? 'rgba(242, 191, 45, 0.22)'
                    : 'rgba(13, 81, 178, 0.22)'
                }
                className={`rounded-2xl border p-7 sm:p-8 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-2xl ${
                  isSelected
                    ? isDark
                      ? 'border-[#00B876] bg-[#121D2F] shadow-xl shadow-[#00B876]/10'
                      : 'border-[#0D51B2] bg-white shadow-xl shadow-[#0D51B2]/10'
                    : isDark
                    ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/40 hover:shadow-[#00B876]/15'
                    : 'border-black/10 bg-white/90 hover:border-[#0D51B2]/40 hover:shadow-[#0D51B2]/15'
                }`}
              >
                <div className="flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-display font-bold text-crest-h3 text-[#0D51B2] dark:text-[#00B876] tabular-nums"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {product.step}
                      </span>
                      <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md border ${accentBadgeBg}`}>
                        {product.positioning}
                      </span>
                    </div>

                    <div className={`h-1 w-12 rounded-full ${accentBarColor} transition-all duration-300 group-hover:w-20`} />

                    <h3 className="font-display font-bold text-crest-h3 group-hover:text-[#00B876] transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-crest-body opacity-85 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Cutaway Extended Details on Hover / Focus */}
                    <p className="text-crest-body opacity-70 pt-2 border-t border-current/10 text-xs sm:text-sm">
                      {product.extendedCopy}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-current/10">
                    {product.highlights.map((hl) => (
                      <div
                        key={hl.label}
                        className="flex items-center justify-between text-crest-ui gap-2 text-xs sm:text-sm"
                      >
                        <span className="opacity-65">{hl.label}</span>
                        <span className="font-semibold text-right tabular-nums">
                          {hl.value}
                        </span>
                      </div>
                    ))}

                    <div className="pt-3 flex items-center justify-between text-crest-ui font-semibold text-[#0D51B2] dark:text-[#00B876] text-xs sm:text-sm">
                      <span>
                        {isSelected ? '✓ Selected · Simulating Below' : 'Click to Select & Plan Yield'}
                      </span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </TiltCutawayCard>
            );
          })}
        </div>

        {/* Interactive GABS Time Classic Tenure & Subscription Planner */}
        <div className="mt-12">
          <RevealOnScroll
            delayMs={120}
            className={`rounded-2xl border p-7 sm:p-10 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-xl ${
              isDark
                ? 'border-white/10 bg-[#111927]'
                : 'border-black/10 bg-white'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-crest-caption font-semibold text-[#00B876]">
                    Interactive Tenure Planner · GABS Time Classic
                  </span>
                  <span className="text-crest-caption opacity-65 tabular-nums">
                    Min: NGN 1,000,000
                  </span>
                </div>

                <h3 className="font-display font-bold text-crest-h3">
                  Simulate Your Structured Deposit Horizon
                </h3>

                {/* Subscription Amount Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline">
                    <label
                      htmlFor="subscription-amount"
                      className="text-crest-ui opacity-75"
                    >
                      Principal Subscription (NGN)
                    </label>
                    <span className="font-display font-bold text-crest-h3 tabular-nums text-[#0D51B2] dark:text-[#00B876]">
                      NGN {calcAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    id="subscription-amount"
                    type="range"
                    min={1000000}
                    max={100000000}
                    step={1000000}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-[#00B876] cursor-pointer"
                  />
                  <div className="flex justify-between text-crest-caption opacity-55 tabular-nums">
                    <span>NGN 1M (Minimum)</span>
                    <span>NGN 50M</span>
                    <span>NGN 100M+</span>
                  </div>
                </div>

                {/* Flexible Tenure Selector (6 to 36 Months per Brochure Page 5) */}
                <div className="space-y-2 pt-2">
                  <span className="text-crest-ui opacity-75 block">
                    Flexible Investment Tenure (6 to 36 Months)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[6, 12, 24, 36].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setCalcTenureMonths(months)}
                        className={`py-2.5 px-3 rounded-lg text-crest-ui font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                          calcTenureMonths === months
                            ? 'bg-[#00B876] text-[#060B14]'
                            : isDark
                            ? 'bg-white/5 hover:bg-white/10 text-white'
                            : 'bg-black/5 hover:bg-black/10 text-[#0B1320]'
                        }`}
                      >
                        {months} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Projection Summary */}
              <div
                className={`lg:col-span-5 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
                  isDark
                    ? 'bg-[#0A0F18] border border-white/10'
                    : 'bg-[#F6F6F2] border border-black/10'
                }`}
              >
                <div className="space-y-2">
                  <span className="text-crest-caption opacity-65 block">
                    Projected Value at {calcTenureMonths}-Month Maturity
                  </span>
                  <span
                    className="font-display font-bold text-crest-h2 tabular-nums block text-[#0D51B2] dark:text-[#00B876]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    NGN {totalMaturityValue.toLocaleString()}
                  </span>
                  <span className="text-crest-caption opacity-70 block tabular-nums">
                    Estimated Return: +NGN {estimatedReturn.toLocaleString()}
                  </span>
                </div>
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-crest-ui font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] transition-colors whitespace-nowrap"
                >
                  Request Term Sheet
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* SECTION 3: OUR INVESTMENT STRATEGY & OUR SERVICES + VALUE PROPOSITION (Brochure Pages 6, 7, 15, 16) */}
      <section
        id="approach"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 border-b border-current/10"
      >
        {/* Part A: Our Investment Strategy (6 SEC-Sanctioned Instruments) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <RevealOnScroll className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#F2BF2D]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Our Investment Strategy
              </span>
            </div>
            <ScrollTextReveal
              text="Strategically deployed into SEC-sanctioned instruments."
              highlightWords={['SEC-sanctioned', 'instruments.']}
              highlightColorClass="text-[#0D51B2] dark:text-[#00B876]"
              className="font-display font-bold text-crest-h2"
            />
            <p className="text-crest-body opacity-80">
              Client funds are strategically deployed into carefully selected
              SEC sanctioned investment instruments. This diversified approach
              allows us to generate stable income while managing risk
              effectively.
            </p>
          </RevealOnScroll>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {INVESTMENT_STRATEGY_INSTRUMENTS.map((inst, idx) => (
              <TiltCutawayCard
                key={inst.step}
                delayMs={idx * 75}
                className={`p-6 rounded-xl border transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl ${
                  isDark
                    ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/40'
                    : 'border-black/10 bg-white hover:border-[#0D51B2]/40'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-crest-caption">
                    <span
                      className="font-display font-bold text-crest-h3 text-[#00B876] tabular-nums"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {inst.step}
                    </span>
                    <span className="opacity-60">{inst.category}</span>
                  </div>
                  <h3 className="font-display font-bold text-crest-h3">
                    {inst.name}
                  </h3>
                  <p className="text-crest-body opacity-75">
                    {inst.description}
                  </p>
                </div>
              </TiltCutawayCard>
            ))}
          </div>
        </div>

        {/* Part B: Our Services (Asset Management, Investment Advisory, Client Service — Brochure Page 7) */}
        <div className="mt-24 pt-16 border-t border-current/10">
          <RevealOnScroll className="max-w-2xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Our Services &amp; Value Proposition
              </span>
            </div>
            <h2 className="font-display font-bold text-crest-h2">
              Comprehensive wealth creation, preservation, and advisory.
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {GABS_SERVICES.map((srv, idx) => (
              <TiltCutawayCard
                key={srv.step}
                delayMs={idx * 100}
                className={`p-7 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl ${
                  isDark
                    ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/40'
                    : 'border-black/10 bg-white hover:border-[#0D51B2]/40'
                }`}
              >
                <div className="space-y-4">
                  <span
                    className="font-display font-bold text-crest-h3 text-[#0D51B2] dark:text-[#00B876] tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {srv.step}.
                  </span>
                  <h3 className="font-display font-bold text-crest-h3">
                    {srv.title}
                  </h3>
                  <p className="text-crest-body opacity-80">
                    {srv.description}
                  </p>
                </div>
                <p className="mt-6 pt-4 border-t border-current/10 text-crest-ui font-semibold text-[#00B876]">
                  {srv.tagline}
                </p>
              </TiltCutawayCard>
            ))}
          </div>

          {/* Value Proposition 3 Editorial Rows (Brochure Page 16) */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-current/10">
            {VALUE_PROPOSITIONS.map((vp, idx) => (
              <RevealOnScroll
                key={vp.step}
                delayMs={idx * 90}
                className="p-5 -m-5 rounded-xl space-y-2 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:bg-current/[0.03]"
              >
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="font-display font-bold text-crest-ui text-[#0D51B2] dark:text-[#F2BF2D] tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {vp.step}.
                  </span>
                  <h3 className="font-display font-bold text-crest-h3">
                    {vp.title}
                  </h3>
                </div>
                <p className="text-crest-body opacity-75">{vp.description}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Part C: The Journey Ahead — The 5 Year Vision (Brochure Page 15) */}
        <RevealOnScroll
          delayMs={120}
          className={`mt-20 rounded-2xl p-8 sm:p-12 border ${
            isDark
              ? 'border-[#0D51B2]/40 bg-gradient-to-br from-[#0D51B2]/25 via-[#111927] to-[#0A0F18]'
              : 'border-[#0D51B2]/20 bg-[#0D51B2] text-white'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2BF2D]" />
                <span className="text-crest-ui font-semibold opacity-90">
                  The Journey Ahead — The 5 Year Vision
                </span>
              </div>
              <h2
                className="font-display font-bold text-crest-h2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                GABS Financial projects reaching{' '}
                <span className="text-[#F2BF2D]">
                  <AnimatedCounter
                    prefix="NGN "
                    target={1}
                    startFrom={0.1}
                    suffix=" trillion"
                    decimals={1}
                  />
                </span>{' '}
                in assets under management within the next{' '}
                <AnimatedCounter target={5} startFrom={1} suffix=" years." />
              </h2>
              <p className="text-crest-body opacity-85">
                Our vision for the next five years is ambitious yet achievable.
                We aim to be recognized as one of the top 5 portfolio management
                companies in Nigeria, by consistently delivering superior
                investment performance, providing exceptional client service,
                and building a reputation for trust and innovation.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIVE_YEAR_VISION_PILLARS.map((pillar, idx) => (
                <RevealOnScroll
                  key={pillar.step}
                  delayMs={idx * 80}
                  className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-1.5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] hover:bg-white/15 hover:shadow-lg"
                >
                  <span
                    className="font-display font-bold text-crest-ui text-[#F2BF2D] tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {pillar.step}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-crest-caption text-white/85">
                    {pillar.description}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};
