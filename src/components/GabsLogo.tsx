import React from 'react';

interface GabsLogoProps {
  /**
   * 'header-light' -> Uses GABS PNG 1@3x-8.png (Blue & Green Icon + Black GABS Financial wordmark)
   * 'header-dark'  -> Uses GABS PNG 1@3x-8 White.png (Blue & Green Icon + White GABS Financial wordmark)
   * 'footer'       -> Uses GABS PNG 5@3x-8.png (All-White Icon + White GABS Financial wordmark)
   */
  variant?: 'header-light' | 'header-dark' | 'footer' | 'header' | 'color' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GabsLogo: React.FC<GabsLogoProps> = ({
  variant = 'header-light',
  size = 'md',
  className = '',
}) => {
  const heightClass = {
    sm: 'h-9 sm:h-10',
    md: 'h-11 sm:h-12',
    lg: 'h-12 sm:h-14',
  }[size];

  let logoSrc = '/logos/gabs-header-logo.png';
  if (variant === 'header-dark') {
    logoSrc = '/logos/gabs-header-logo-dark.png';
  } else if (variant === 'footer' || variant === 'light') {
    logoSrc = '/logos/gabs-footer-logo.png';
  }

  return (
    <span className={`inline-flex items-center select-none shrink-0 ${className}`}>
      <img
        src={logoSrc}
        alt="GABS Financial"
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto object-contain block`}
      />
    </span>
  );
};
