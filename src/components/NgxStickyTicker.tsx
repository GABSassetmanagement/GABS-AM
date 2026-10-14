import React, { useEffect, useRef } from 'react';

const NGX_SYMBOLS = [
  { proName: 'NSENG:NGX30', description: 'NGX 30 Index' },
  { proName: 'NSENG:GTCO', description: 'GTCO' },
  { proName: 'NSENG:ZENITHBANK', description: 'Zenith Bank' },
  { proName: 'NSENG:DANGCEM', description: 'Dangote Cement' },
  { proName: 'NSENG:MTNN', description: 'MTN Nigeria' },
  { proName: 'NSENG:BUAFOODS', description: 'BUA Foods' },
  { proName: 'NSENG:SEPLAT', description: 'Seplat Energy' },
  { proName: 'NSENG:ARADEL', description: 'Aradel Holdings' },
  { proName: 'NSENG:FIRSTHOLDCO', description: 'FirstHoldCo' },
  { proName: 'NSENG:NGXGROUP', description: 'NGX Group' },
];

const FALLBACK_TICKER_QUOTES = [
  { symbol: 'NGX30', name: 'NGX 30 Index', price: '3,684.42', change: '+1.42%', up: true },
  { symbol: 'GTCO', name: 'GTCO', price: '₦54.80', change: '+2.15%', up: true },
  { symbol: 'ZENITHBANK', name: 'Zenith Bank', price: '₦44.50', change: '+1.85%', up: true },
  { symbol: 'DANGCEM', name: 'Dangote Cement', price: '₦478.80', change: '+0.95%', up: true },
  { symbol: 'MTNN', name: 'MTN Nigeria', price: '₦242.00', change: '+1.12%', up: true },
  { symbol: 'BUAFOODS', name: 'BUA Foods', price: '₦394.90', change: '+2.60%', up: true },
  { symbol: 'SEPLAT', name: 'Seplat Energy', price: '₦5,700.00', change: '+3.10%', up: true },
  { symbol: 'ARADEL', name: 'Aradel Holdings', price: '₦598.00', change: '+1.75%', up: true },
  { symbol: 'FIRSTHOLDCO', name: 'FirstHoldCo', price: '₦29.45', change: '+0.85%', up: true },
  { symbol: 'NGXGROUP', name: 'NGX Group', price: '₦27.20', change: '+1.49%', up: true },
];

export const NgxStickyTicker: React.FC = () => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = widgetContainerRef.current;
    if (!container) return;

    // Clear previous embed script if re-mounted
    container.innerHTML = '';

    const widgetInner = document.createElement('div');
    widgetInner.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetInner);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: NGX_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });

    container.appendChild(script);
  }, []);

  return (
    <div
      id="ngx-ticker-bar"
      className="w-full bg-[#0b0b0b] text-[#cfcfcf] shadow-[0_2px_10px_rgba(0,0,0,0.25)] border-b border-white/10"
    >
      {/* Exact top label bar from gabsfinancial.com */}
      <div className="flex items-center justify-between gap-2.5 px-2.5 sm:px-4 py-1 bg-[#141414] text-[#cfcfcf] text-[9px] sm:text-[11px] leading-[1.4] font-sans">
        <span className="font-bold text-white uppercase tracking-[0.5px] whitespace-nowrap">
          NGX Market Watch
        </span>
        <span className="opacity-85 text-right truncate">
          Data may be delayed up to 15 minutes &middot; Source:{' '}
          <a
            href="https://ngxgroup.com/#tab1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9fd3ff] underline hover:text-white transition-colors"
          >
            NGX Group
          </a>{' '}
          &amp; TradingView
        </span>
      </div>

      {/* TradingView Ticker Tape Widget with instant resilient fallback behind it */}
      <div className="relative min-h-[44px] bg-[#0b0b0b] overflow-hidden flex items-center">
        {/* Resilient fallback ticker strip visible immediately while TradingView loads or if blocked */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none z-0"
        >
          <div className="animate-marquee flex items-center gap-8 px-4 text-xs font-mono">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 shrink-0">
                {FALLBACK_TICKER_QUOTES.map((item) => (
                  <div
                    key={`${dup}-${item.symbol}`}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="text-white/75 tabular-nums">
                      {item.price}
                    </span>
                    <span className="text-[#00B876] font-semibold tabular-nums">
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Official TradingView Widget Container from gabsfinancial.com */}
        <div
          ref={widgetContainerRef}
          className="tradingview-widget-container relative z-10 w-full leading-none"
        />
      </div>
    </div>
  );
};
