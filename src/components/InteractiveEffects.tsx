import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/**
 * Native IntersectionObserver Fade-In and Slide-Up Reveal Wrapper
 * Guarantees smooth scroll-triggered animations across all sections, cards, and blocks.
 */
interface RevealOnScrollProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  threshold?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delayMs = 0,
  className = '',
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`io-reveal ${isVisible ? 'io-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Native IntersectionObserver Word-by-Word Staggered Text Reveal
 * Uses Crestmark Section Heading (H2: 40px - 48px) by default.
 */
interface ScrollTextRevealProps {
  text: string;
  className?: string;
  as?: 'h2' | 'h3' | 'p' | 'div';
  highlightWords?: string[];
  highlightColorClass?: string;
}

export const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  text,
  className = '',
  as: Tag = 'h2',
  highlightWords = [],
  highlightColorClass = 'text-[#00B876]',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={containerRef as React.RefObject<any>}
      className={className}
      style={{ textWrap: 'balance' }}
    >
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[.,?!:;]/g, '');
        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
        );
        return (
          <span
            key={idx}
            className="inline-block overflow-hidden align-bottom mr-[0.26em] pb-[0.06em]"
          >
            <span
              style={{ transitionDelay: `${idx * 42}ms` }}
              className={`io-word ${isVisible ? 'io-visible' : ''} ${
                isHighlighted ? highlightColorClass : ''
              }`}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
};

/**
 * Cursor-Tracking & 3D Tilt Cutaway Card with Built-In IntersectionObserver Fade-In & Slide-Up
 */
interface TiltCutawayCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  delayMs?: number;
}

export const TiltCutawayCard: React.FC<TiltCutawayCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(0, 184, 118, 0.14)',
  onClick,
  delayMs = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({
    x: 50,
    y: 50,
    rotateX: 0,
    rotateY: 0,
    active: false,
  });

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const pctX = (relX / rect.width) * 100;
    const pctY = (relY / rect.height) * 100;
    const rotateY = ((pctX - 50) / 50) * 4.2;
    const rotateX = -((pctY - 50) / 50) * 4.2;

    setCoords({ x: pctX, y: pctY, rotateX, rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 50, y: 50, rotateX: 0, rotateY: 0, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: !isVisible
          ? 'translate3d(0, 36px, 0) scale(0.98)'
          : coords.active
          ? `perspective(1000px) translate3d(0, -8px, 0) scale(1.025) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg)`
          : undefined,
        transition: coords.active
          ? 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms cubic-bezier(0.16, 1, 0.3, 1)'
          : `transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
      className={`relative overflow-hidden group transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.025] hover:shadow-2xl hover:shadow-[#0D51B2]/15 dark:hover:shadow-[#00B876]/15 ${className}`}
    >
      {/* Subtle top edge ambient reflection line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-current/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
      />
      {/* Cursor-tracking radial spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: coords.active ? 1 : 0,
          background: `radial-gradient(520px circle at ${coords.x}% ${coords.y}%, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/**
 * Scroll-Driven Rotation & Layered Parallax emblem
 */
export const ScrollRotatingSeal: React.FC<{ isDark: boolean }> = ({
  isDark,
}) => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div
      style={{ rotate }}
      className={`w-28 h-28 md:w-32 md:h-32 rounded-full border flex items-center justify-center select-none ${
        isDark
          ? 'border-white/15 bg-[#0D1525]/80 text-white'
          : 'border-[#0D51B2]/20 bg-white/90 text-[#0D51B2]'
      } backdrop-blur-md shadow-sm`}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full p-2">
        <defs>
          <path
            id="circlePath"
            d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text
          fill="currentColor"
          className="text-[9.2px] font-medium tracking-[0.18em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <textPath href="#circlePath" startOffset="0%">
            SEC LICENSED · GROW YOUR WORTH · FMAN MEMBER ·
          </textPath>
        </text>
        {/* Center upward arrow mark */}
        <path
          d="M50 70L70 50M70 50H54M70 50V66"
          stroke="#00B876"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
};

/**
 * Animated Counter for Figures (supports count-up and count-down when scrolling into view)
 */
interface AnimatedCounterProps {
  prefix?: string;
  target: number;
  startFrom?: number;
  suffix?: string;
  durationMs?: number;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  prefix = '',
  target,
  startFrom = 0,
  suffix = '',
  durationMs = 1800,
  decimals = 0,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [currentValue, setCurrentValue] = useState<number>(startFrom);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let rafId: number | null = null;

    const animateValue = (from: number, to: number) => {
      if (rafId) cancelAnimationFrame(rafId);
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Smooth easeOutQuart curve
        const eased = 1 - Math.pow(1 - progress, 4);
        const nextVal = from + (to - from) * eased;
        setCurrentValue(nextVal);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setCurrentValue(to);
        }
      };

      rafId = requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
      setCurrentValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate up/down from startFrom to target when entering viewport
            animateValue(startFrom, target);
          } else {
            // Count back toward startFrom when leaving viewport so re-scrolling animates again
            animateValue(target, startFrom);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, startFrom, durationMs]);

  const formattedNumber =
    decimals > 0
      ? currentValue.toFixed(decimals)
      : Math.round(currentValue).toLocaleString();

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

