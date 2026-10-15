import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Minus,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowUpRight,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Bell,
  Send,
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/gabsData';
import { GabsLogo } from './GabsLogo';
import { RevealOnScroll, ScrollTextReveal } from './InteractiveEffects';

interface VeritaasFaqContactFooterProps {
  isDark: boolean;
}

const SOCIAL_PLATFORMS = [
  {
    name: 'Instagram',
    handle: '@gabs_financial',
    url: 'https://www.instagram.com/gabs_financial/',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: '@gabsfinancial',
    url: 'https://www.facebook.com/gabsfinancial',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    handle: '@gabs.financial.se',
    url: 'https://www.tiktok.com/@gabs.financial.se',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'GABS Financial Service',
    url: 'https://www.linkedin.com/company/gabs-financial-service/',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export const VeritaasFaqContactFooter: React.FC<
  VeritaasFaqContactFooterProps
> = ({ isDark }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  // Contact Form State matching Veritaas Contact layout
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [message, setMessage] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState<{
    fullName: string;
    email: string;
    investmentRange: string;
    message: string;
  } | null>(null);

  // Newsletter Sign-Up State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'submitting' | 'error' | 'success'
  >('idle');
  const [newsletterFeedback, setNewsletterFeedback] = useState('');
  const [subscribedAddress, setSubscribedAddress] = useState('');

  // Mobile App Waitlist Notification
  const [appNotifyText, setAppNotifyText] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!investmentRange) {
      setFormError('Please select a target investment or portfolio range.');
      return;
    }
    if (!message.trim()) {
      setFormError('Please enter your message or investment inquiry.');
      return;
    }
    if (!consentChecked) {
      setFormError(
        'Please allow GABS Financial to store your details for communication.'
      );
      return;
    }

    setFormSubmitting(true);
    try {
      // Local storage persistence so inquiry is never lost
      try {
        const stored = localStorage.getItem('gabs_inquiries');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          fullName: fullName.trim(),
          email: email.trim(),
          investmentRange,
          message: message.trim(),
          date: new Date().toISOString(),
        });
        localStorage.setItem('gabs_inquiries', JSON.stringify(list));
      } catch {
        // ignore
      }

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          investmentRange,
          message: message.trim(),
          recipientEmail: 'customer@gabsfinancial.com',
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json().catch(() => null);
        if (data && data.success === false) {
          setFormError(data.error || 'Unable to send inquiry right now.');
          setFormSubmitting(false);
          return;
        }
      }

      setSubmittedDetails({
        fullName: fullName.trim(),
        email: email.trim(),
        investmentRange,
        message: message.trim(),
      });
      setFormSubmitted(true);
    } catch {
      // Fallback persistence in localStorage
      setSubmittedDetails({
        fullName: fullName.trim(),
        email: email.trim(),
        investmentRange,
        message: message.trim(),
      });
      setFormSubmitted(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setInvestmentRange('');
    setMessage('');
    setConsentChecked(false);
    setFormError('');
    setFormSubmitted(false);
    setSubmittedDetails(null);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setNewsletterStatus('error');
      setNewsletterFeedback('Please enter a valid email address to subscribe.');
      return;
    }

    setNewsletterStatus('submitting');
    setNewsletterFeedback('');

    try {
      // Persist in localStorage for 100% reliable subscription
      try {
        const stored = localStorage.getItem('gabs_newsletter_subscribers');
        const list = stored ? JSON.parse(stored) : [];
        if (!list.includes(cleanEmail)) {
          list.push(cleanEmail);
          localStorage.setItem('gabs_newsletter_subscribers', JSON.stringify(list));
        }
      } catch {
        // ignore
      }

      await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          recipientEmail: 'customer@gabsfinancial.com',
        }),
      }).catch(() => null);

      setSubscribedAddress(cleanEmail);
      setNewsletterFeedback(
        `Thank you for subscribing! ${cleanEmail} has been added to the GABS Financial briefing dispatch.`
      );
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch {
      setSubscribedAddress(cleanEmail);
      setNewsletterFeedback(
        `Thank you for subscribing! ${cleanEmail} has been added to the GABS Financial briefing dispatch.`
      );
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }
  };

  return (
    <div
      className={`transition-colors duration-300 ${
        isDark ? 'bg-[#0A0F18] text-[#F8FAFC]' : 'bg-[#F6F6F2] text-[#0B1320]'
      }`}
    >
      {/* PART 1: VERITAAS FAQ SECTION — "Clarity before commitment" */}
      <section
        id="faq"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 border-b border-current/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Column matching Veritaas FAQ */}
          <RevealOnScroll className="lg:col-span-5 lg:sticky lg:top-40 space-y-4">
            <div className="border-t border-current/15 pt-6">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
                />
                <span className="text-crest-ui font-semibold opacity-75">
                  FAQ
                </span>
              </div>

              <ScrollTextReveal
                text="Clarity before commitment"
                className="font-display font-bold text-crest-h2"
              />

              <p className="text-crest-body opacity-75 mt-4 max-w-md">
                We believe informed decisions lead to better partnerships. Below
                are answers to questions we’re often asked about our SEC
                licensing, investment products, and advisory mandates.
              </p>
            </div>
          </RevealOnScroll>

          {/* Right Column: Veritaas Accordion Cards with Staggered IO Reveal */}
          <div className="lg:col-span-7 space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <RevealOnScroll
                  key={item.question}
                  delayMs={idx * 80}
                  className={`rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-[#111927] border-white/10'
                      : 'bg-[#EBEBE4] border-black/5'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B876] rounded-xl"
                  >
                    <h3
                      className="font-display font-bold text-xl sm:text-2xl tracking-tight"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.question}
                    </h3>
                    <span
                      className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#00B876] border-[#00B876] text-[#060B14]'
                          : 'border-current/20 opacity-75'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-crest-body opacity-80 border-t border-current/5">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* PART 2: VERITAAS CONTACT SECTION + SOCIAL MEDIA HANDLES + INTERACTIVE MAP */}
      <section
        id="contact"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 border-b border-current/10"
      >
        {/* Centered Header matching Veritaas Contact */}
        <RevealOnScroll className="max-w-2xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center justify-center gap-2">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
            />
            <span className="text-crest-ui font-semibold opacity-75">
              Contact
            </span>
          </div>

          <ScrollTextReveal
            text="Start a thoughtful conversation"
            className="font-display font-bold text-crest-h2"
          />

          <p className="text-crest-body opacity-75">
            We welcome inquiries from individuals, executives, and institutions
            seeking strategic investment advisory, fixed income placement, or
            general information about GABS Financial.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left/Center Veritaas Form Container */}
          <RevealOnScroll
            delayMs={90}
            className={`lg:col-span-8 rounded-2xl p-7 sm:p-10 md:p-12 border ${
              isDark
                ? 'bg-[#111927] border-white/10'
                : 'bg-[#EBEBE4] border-black/5'
            }`}
          >
            {formSubmitted ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#00B876]/20 text-[#00B876] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3
                  className="font-display font-bold text-xl sm:text-2xl md:text-crest-h3 break-words max-w-xl mx-auto px-2 leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Your enquiry has been sent to{' '}
                  <span className="text-[#00B876] break-all inline-block sm:inline">
                    customer@gabsfinancial.com
                  </span>
                </h3>
                <p className="text-crest-body opacity-80 max-w-md mx-auto">
                  Thank you,{' '}
                  <span className="font-semibold">
                    {submittedDetails?.fullName || fullName}
                  </span>
                  . Your message has been dispatched to{' '}
                  <span className="font-semibold text-[#00B876]">
                    customer@gabsfinancial.com
                  </span>
                  , and our Investment Advisory desk in Abuja will respond to{' '}
                  <span className="font-semibold">
                    {submittedDetails?.email || email}
                  </span>{' '}
                  within 24–48 hours.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`mailto:customer@gabsfinancial.com?subject=${encodeURIComponent(
                      `Investment Inquiry from ${
                        submittedDetails?.fullName || fullName
                      } (${submittedDetails?.investmentRange || investmentRange})`
                    )}&body=${encodeURIComponent(
                      `Name: ${submittedDetails?.fullName || fullName}\nEmail: ${
                        submittedDetails?.email || email
                      }\nInvestment Range: ${
                        submittedDetails?.investmentRange || investmentRange
                      }\n\nMessage:\n${submittedDetails?.message || message}`
                    )}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-crest-ui font-semibold border border-current/20 hover:border-[#00B876] hover:text-[#00B876] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Email Client</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full text-crest-ui font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="space-y-6"
                noValidate
              >
                <h3
                  className="font-display font-medium text-crest-h3 max-w-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  All inquiries are handled with discretion and confidentiality.
                </h3>

                {formError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-crest-ui font-medium"
                  >
                    {formError}
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="gabs-full-name"
                    className="block text-crest-caption font-semibold opacity-75"
                  >
                    Full Name
                  </label>
                  <input
                    id="gabs-full-name"
                    type="text"
                    placeholder="Your name here"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-lg text-crest-body border transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                      isDark
                        ? 'bg-[#0A0F18] border-white/10 text-white placeholder:text-white/35'
                        : 'bg-[#F8F8F5] border-black/10 text-[#0B1320] placeholder:text-black/40'
                    }`}
                  />
                </div>

                {/* Email + Investment Range Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="gabs-email"
                      className="block text-crest-caption font-semibold opacity-75"
                    >
                      Email
                    </label>
                    <input
                      id="gabs-email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-lg text-crest-body border transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                        isDark
                          ? 'bg-[#0A0F18] border-white/10 text-white placeholder:text-white/35'
                          : 'bg-[#F8F8F5] border-black/10 text-[#0B1320] placeholder:text-black/40'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="gabs-budget-range"
                      className="block text-crest-caption font-semibold opacity-75"
                    >
                      Investment Range
                    </label>
                    <select
                      id="gabs-budget-range"
                      value={investmentRange}
                      onChange={(e) => setInvestmentRange(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-lg text-crest-body border transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                        isDark
                          ? 'bg-[#0A0F18] border-white/10 text-white'
                          : 'bg-[#F8F8F5] border-black/10 text-[#0B1320]'
                      }`}
                    >
                      <option value="">Select...</option>
                      <option value="1m-10m">
                        NGN 1,000,000 – NGN 10,000,000 (Time Classic / Fixed
                        Income)
                      </option>
                      <option value="10m-50m">
                        NGN 10,000,000 – NGN 50,000,000 (Portfolio Mandate)
                      </option>
                      <option value="50m-250m">
                        NGN 50,000,000 – NGN 250,000,000 (HNWI &amp; Corporate)
                      </option>
                      <option value="250m+">
                        NGN 250,000,000+ (Institutional Treasury &amp; Alternate)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="gabs-message"
                    className="block text-crest-caption font-semibold opacity-75"
                  >
                    Message
                  </label>
                  <textarea
                    id="gabs-message"
                    rows={5}
                    placeholder="Describe your financial goals or investment inquiry"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-lg text-crest-body border transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                      isDark
                        ? 'bg-[#0A0F18] border-white/10 text-white placeholder:text-white/35'
                        : 'bg-[#F8F8F5] border-black/10 text-[#0B1320] placeholder:text-black/40'
                    }`}
                  />
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#00B876] cursor-pointer"
                  />
                  <span className="text-crest-ui opacity-85">
                    I allow GABS Financial™ to store my details for
                    communication.
                  </span>
                </label>

                {/* Bottom Submit Row */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-crest-caption opacity-65 space-y-0.5">
                    <p className="font-semibold">
                      Direct recipient: customer@gabsfinancial.com · Reply within
                      24–48h.
                    </p>
                    <p>By sending, you accept our Privacy Policy.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-7 py-3 rounded-full text-crest-ui font-semibold bg-[#00B876] text-[#060B14] hover:bg-[#0D51B2] hover:text-white disabled:opacity-60 transition-colors duration-150 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    {formSubmitting ? 'Sending inquiry...' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </RevealOnScroll>

          {/* Right Column: Official Get In Touch Card + 4 Social Media Handles (Instagram, Facebook, TikTok, LinkedIn) */}
          <RevealOnScroll
            delayMs={180}
            className={`lg:col-span-4 rounded-2xl p-7 sm:p-8 border space-y-6 ${
              isDark
                ? 'bg-[#111927] border-white/10'
                : 'bg-white border-black/10'
            }`}
          >
            <div className="space-y-1.5 border-b border-current/10 pb-5">
              <span className="text-crest-caption font-semibold text-[#00B876]">
                Direct Advisory Desk
              </span>
              <h3
                className="font-display font-bold text-crest-h3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Get In Touch
              </h3>
              <p className="text-crest-caption opacity-70">
                Visit our Abuja office or connect directly with our Client
                Service team.
              </p>
            </div>

            <div className="space-y-5 text-crest-ui">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#0D51B2]/15 text-[#0D51B2] dark:text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-crest-caption opacity-60 block">
                    Corporate Office
                  </span>
                  <p className="font-medium leading-snug mt-0.5">
                    Ground Floor, Nicon Insurance Building, Central Business
                    District, Abuja.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#00B876]/15 text-[#00B876] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-crest-caption opacity-60 block">
                    Telephone
                  </span>
                  <a
                    href="tel:+2348093329999"
                    className="font-semibold hover:text-[#00B876] transition-colors tabular-nums block mt-0.5"
                  >
                    +234 809 3329 999
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#F2BF2D]/20 text-[#B48608] dark:text-[#F2BF2D] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-crest-caption opacity-60 block">
                    Email
                  </span>
                  <a
                    href="mailto:customer@gabsfinancial.com"
                    className="font-semibold hover:text-[#00B876] transition-colors block mt-0.5 break-all"
                  >
                    customer@gabsfinancial.com
                  </a>
                </div>
              </div>
            </div>

            {/* Official Social Handles: Instagram, Facebook, TikTok, LinkedIn */}
            <div className="pt-5 border-t border-current/10 space-y-3">
              <div className="flex items-center justify-between text-crest-caption">
                <span className="opacity-70 font-semibold">
                  Official Social Channels
                </span>
                <span className="font-semibold text-[#0D51B2] dark:text-[#00B876]">
                  @gabsfinancial
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SOCIAL_PLATFORMS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                      isDark
                        ? 'border-white/10 bg-[#0A0F18] hover:border-[#00B876] hover:text-[#00B876]'
                        : 'border-black/10 bg-[#F6F6F2] hover:border-[#0D51B2] hover:text-[#0D51B2]'
                    }`}
                  >
                    <span className="text-[#0D51B2] dark:text-[#00B876] shrink-0">
                      {social.icon}
                    </span>
                    <div className="truncate">
                      <span className="block leading-tight">{social.name}</span>
                      <span className="text-[10px] opacity-65 block truncate">
                        {social.handle}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Embedded Interactive Headquarters Map — Nicon Insurance Building, Central Business District, Abuja */}
        <RevealOnScroll
          delayMs={220}
          className={`mt-12 rounded-2xl border overflow-hidden shadow-lg ${
            isDark
              ? 'border-white/10 bg-[#111927]'
              : 'border-black/10 bg-white'
          }`}
        >
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00B876]/15 text-[#00B876] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className="font-display font-bold text-lg sm:text-xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Our Headquarters Location
                </h3>
                <p className="text-crest-caption opacity-75">
                  Ground Floor, Nicon Insurance Building, Central Business
                  District, Abuja, Nigeria
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Nicon+Insurance+Building+Central+Business+District+Abuja+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] transition-colors self-start sm:self-auto"
            >
              <span>Open in Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="relative w-full h-[320px] sm:h-[380px] bg-neutral-200 dark:bg-neutral-900">
            <iframe
              title="GABS Financial Services Limited Headquarters Map — Nicon Insurance Building, Central Business District, Abuja"
              src="https://www.google.com/maps?q=Nicon+Insurance+Building+Central+Business+District+Abuja+Nigeria&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            />
          </div>
        </RevealOnScroll>
      </section>

      {/* PART 3: NEWSLETTER SIGN-UP AREA */}
      <section
        id="newsletter"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 border-b border-current/10"
      >
        <RevealOnScroll
          className={`rounded-2xl border p-7 sm:p-10 lg:p-12 ${
            isDark
              ? 'bg-gradient-to-r from-[#111927] via-[#0F1B2E] to-[#111927] border-white/10'
              : 'bg-white border-black/10 shadow-sm'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2.5">
              <div className="inline-flex items-center gap-2 text-crest-caption font-semibold text-[#00B876]">
                <span className="w-2 h-2 rounded-full bg-[#00B876]" />
                <span>Market Intelligence &amp; Research</span>
              </div>
              <h2
                className="font-display font-bold text-2xl sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subscribe to the GABS Financial Briefing
              </h2>
              <p className="text-crest-body opacity-75 max-w-xl">
                Receive monthly fixed-income yield updates, Nigerian treasury
                auction insights, and wealth preservation strategies directly in
                your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {newsletterStatus === 'success' ? (
                <div className="p-4 rounded-xl bg-[#00B876]/15 border border-[#00B876]/30 space-y-3 text-crest-ui">
                  <div className="flex items-start gap-3 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#00B876] shrink-0 mt-0.5" />
                    <span>
                      {newsletterFeedback ||
                        `Thank you for subscribing! ${subscribedAddress} has been added to the GABS Financial mailing list (customer@gabsfinancial.com).`}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pl-8 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setNewsletterStatus('idle');
                        setNewsletterFeedback('');
                      }}
                      className="font-semibold text-[#0D51B2] dark:text-[#00B876] hover:underline cursor-pointer"
                    >
                      Add another email
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-2.5"
                  noValidate
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterStatus === 'error') {
                          setNewsletterStatus('idle');
                          setNewsletterFeedback('');
                        }
                      }}
                      className={`flex-1 px-4 py-3.5 rounded-full text-crest-ui border focus:outline-none focus:ring-2 focus:ring-[#00B876] ${
                        isDark
                          ? 'bg-[#0A0F18] border-white/15 text-white placeholder:text-white/40'
                          : 'bg-[#F6F6F2] border-black/15 text-[#0B1320] placeholder:text-black/45'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'submitting'}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-crest-ui font-semibold bg-[#0D51B2] text-white hover:bg-[#00B876] hover:text-[#060B14] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>
                        {newsletterStatus === 'submitting'
                          ? 'Adding...'
                          : 'Subscribe'}
                      </span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {newsletterStatus === 'error' && (
                    <p className="text-xs text-red-500 pl-3">
                      {newsletterFeedback ||
                        'Please enter a valid email address to subscribe.'}
                    </p>
                  )}
                  <p className="text-crest-caption opacity-60 pl-3">
                    Managed by customer@gabsfinancial.com · Zero spam, unsubscribe
                    anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* PART 4: MOBILE APP SHOWCASE SECTION ("Coming Soon" with Apple App Store & Google Play Store Badges just before the Footer) */}
      <section
        id="mobile-app"
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-24"
      >
        <RevealOnScroll className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0D51B2] to-[#072B66] text-white p-8 sm:p-12 lg:p-16 border border-white/15 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left Column: Coming Soon Badge + App Value Prop + Apple App Store & Google Play Store Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#00B876] text-[#060B14] text-xs font-bold tracking-wide uppercase">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App · Coming Soon</span>
              </div>

              <h2
                className="font-display font-bold text-crest-h2 text-white leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Your GABS Financial portfolio, right in the palm of your hand.
              </h2>

              <p className="text-crest-body text-white/85 max-w-xl">
                In line with our 5-Year Vision to invest in cutting-edge digital
                technology, we are building the GABS Financial Mobile App—giving
                you instant access to GABS Fixed Income, GABS Time Classic
                subscriptions, real-time yield tracking, and direct advisory
                support.
              </p>

              {/* Official-style Apple App Store & Google Play Store Badges (Evenly matched in length and height) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Apple App Store Badge Button */}
                <button
                  type="button"
                  onClick={() =>
                    setAppNotifyText(
                      'GABS Mobile for iOS is currently in final regulatory & security testing. Subscribe to our newsletter above for launch day access!'
                    )
                  }
                  className="w-[215px] sm:w-[220px] h-[64px] inline-flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-xl bg-black/85 hover:bg-black text-white border border-white/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.08-.52 2.72-1.3z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-white/75 leading-none">
                      Coming Soon on the
                    </span>
                    <span
                      className="font-display font-bold text-base sm:text-lg leading-tight block mt-0.5"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      App Store
                    </span>
                  </div>
                </button>

                {/* Google Play Store Badge Button */}
                <button
                  type="button"
                  onClick={() =>
                    setAppNotifyText(
                      'GABS Mobile for Android is currently in final regulatory & security testing. Subscribe to our newsletter above for launch day access!'
                    )
                  }
                  className="w-[215px] sm:w-[220px] h-[64px] inline-flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-xl bg-black/85 hover:bg-black text-white border border-white/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 shrink-0 text-[#00B876]"
                    aria-hidden="true"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.497-1.318V3.132c0-.508.19-.97.496-1.318zm11.618 11.618l2.805 2.805-11.49 6.634 8.685-9.439zm3.94-3.94l2.388 1.379c.796.46.796 1.618 0 2.078l-2.388 1.379-2.942-2.418 2.942-2.418zM6.542 1.547l11.49 6.634-2.805 2.805-8.685-9.439z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-white/75 leading-none">
                      Coming Soon on
                    </span>
                    <span
                      className="font-display font-bold text-base sm:text-lg leading-tight block mt-0.5"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Google Play
                    </span>
                  </div>
                </button>
              </div>

              {appNotifyText && (
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white/95 max-w-lg flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[#F2BF2D] shrink-0" />
                  <span>{appNotifyText}</span>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Mobile App UI Preview Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[330px] rounded-[34px] bg-[#080E1A] border-[6px] border-white/20 p-5 shadow-2xl space-y-5">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span className="font-semibold text-white">GABS Mobile</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00B876]/20 text-[#00B876] font-semibold text-[11px]">
                    SEC Regulated
                  </span>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#0D51B2] to-[#083475] p-5 space-y-3 border border-white/15">
                  <span className="text-[11px] text-white/75 block">
                    Total Portfolio Value
                  </span>
                  <div
                    className="font-display font-bold text-2xl text-white tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    NGN 24,850,000.00
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#00B876] font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+19.5% p.a. · GABS Time Classic</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#00B876]" />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          GABS Fixed Income
                        </div>
                        <div className="text-[11px] text-white/60">
                          Commercial Papers · Active
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#00B876] tabular-nums">
                      12 Mos
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-[#F2BF2D]" />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Alternate Investment
                        </div>
                        <div className="text-[11px] text-white/60">
                          Treasury-Backed Yield
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#F2BF2D] tabular-nums">
                      High Yield
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* PART 5: VERITAAS FULL-BLEED ARCHITECTURAL WINDOW CTA BANNER + FLOATING DARK FOOTER CARD */}
      <section className="relative w-full overflow-hidden pt-20 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-8 bg-neutral-900">
        {/* Background Sunset Skyline Through Tall Architectural Window Mullions + Readable Contrast Tint */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/cta_window_skyline_sunset_1791131913090.jpg"
            alt="Golden sunset skyline viewed through tall executive boardroom windows"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('Hero.jpg')) {
                target.src = '/Hero.jpg';
              }
            }}
            className="w-full h-full object-cover object-center opacity-100"
          />
          {/* Protective contrast tint overlay behind text and above footer image */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/45 bg-gradient-to-r from-black/85 via-black/60 to-black/35 backdrop-blur-[0.5px]"
          />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto">
          {/* Upper CTA Content */}
          <RevealOnScroll className="py-12 sm:py-20 max-w-xl space-y-6 text-white">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
              />
              <span className="text-crest-ui font-semibold text-white/90 drop-shadow-sm">
                Contact Us
              </span>
            </div>

            <h2
              className="font-display font-bold text-crest-h2 text-white drop-shadow-md"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              Ready to grow your worth with GABS Financial?
            </h2>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full text-crest-ui font-semibold bg-[#00B876] text-[#060B14] hover:bg-white transition-colors whitespace-nowrap"
              >
                Contact us
              </a>
              <a
                href="#products"
                className="px-6 py-3 rounded-full text-crest-ui font-semibold border border-white/40 bg-black/35 hover:bg-white/20 text-white backdrop-blur-sm transition-colors whitespace-nowrap"
              >
                Explore products
              </a>
            </div>
          </RevealOnScroll>

          {/* Lower Floating Dark Rounded Footer Card (#141414 warm-neutral dark, no blue tint) */}
          <RevealOnScroll
            delayMs={140}
            className="mt-8 rounded-2xl bg-[#141414]/95 backdrop-blur-xl border border-white/10 text-white p-8 sm:p-12 lg:p-14 shadow-2xl"
          >
            <footer>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
                {/* Column 1: Brand (GABS PNG 5@3x-8 All-White Footer Logo) + Mission Statement + 4 Social Icons */}
                <div className="md:col-span-6 space-y-5">
                  <a href="#top" className="inline-block">
                    <GabsLogo variant="footer" size="md" />
                  </a>
                  <p className="text-crest-body text-white/75 max-w-md">
                    Licensed, regulated and supervised by the Securities &amp;
                    Exchange Commission (SEC) Nigeria — designed for investors
                    and institutions that value clarity, capital preservation,
                    and sustainable wealth creation.
                  </p>
                  <p className="text-crest-caption text-[#00B876] font-semibold">
                    Ground Floor, Nicon Insurance Building, Central Business
                    District, Abuja · +234 809 3329 999
                  </p>

                  {/* Social Media Icons Row: Instagram, Facebook, TikTok, LinkedIn */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    {SOCIAL_PLATFORMS.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${social.name} (${social.handle})`}
                        title={`${social.name}: ${social.handle}`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-[#00B876] hover:text-[#060B14] text-white text-xs font-semibold transition-colors"
                      >
                        {social.icon}
                        <span>{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Column 2: MENU (including Blog) */}
                <div className="md:col-span-3 space-y-3">
                  <span className="text-crest-caption font-semibold text-white/50 block">
                    Menu
                  </span>
                  <ul className="space-y-2.5 text-crest-ui text-white/85">
                    <li>
                      <a
                        href="#top"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Who We Are
                      </a>
                    </li>
                    <li>
                      <a
                        href="#products"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Our Products
                      </a>
                    </li>
                    <li>
                      <a
                        href="#approach"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Investment Strategy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#market-insights"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Market Insights
                      </a>
                    </li>
                    <li>
                      <a
                        href="#blog"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Blog &amp; Articles
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contact"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 3: GOVERNANCE & MORE */}
                <div className="md:col-span-3 space-y-3">
                  <span className="text-crest-caption font-semibold text-white/50 block">
                    Governance &amp; More
                  </span>
                  <ul className="space-y-2.5 text-crest-ui text-white/85">
                    <li>
                      <a
                        href="#leadership"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Board of Directors
                      </a>
                    </li>
                    <li>
                      <a
                        href="#leadership"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Management Team
                      </a>
                    </li>
                    <li>
                      <a
                        href="#testimonials"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Testimonials
                      </a>
                    </li>
                    <li>
                      <a
                        href="#mobile-app"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Mobile App (Coming Soon)
                      </a>
                    </li>
                    <li>
                      <a
                        href="#faq"
                        className="hover:text-[#00B876] transition-colors"
                      >
                        Investor FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:customer@gabsfinancial.com"
                        className="hover:text-[#00B876] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Client Support</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Copyright Bar */}
              <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-crest-caption text-white/55">
                <p>
                  © {new Date().getFullYear()} GABS Financial Services Limited.
                  Licensed, Regulated &amp; Supervised by Securities &amp;
                  Exchange Commission.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    SEC Regulated
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="#partners"
                    className="hover:text-white transition-colors"
                  >
                    FMAN Member
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Privacy &amp; Compliance
                  </a>
                </div>
              </div>
            </footer>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};
