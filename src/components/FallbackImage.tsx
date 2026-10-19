import React, { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  category?: string;
}

export const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  aspectRatioClass = "aspect-[16/10]",
  category = "Fashion Design"
}) => {
  // Normalize path: convert /src/assets/images/... to /images/... for production compatibility
  const normalizedSrc = src.startsWith('/src/assets/images/') 
    ? src.replace('/src/assets/images/', '/images/') 
    : src;

  const [currentSrc, setCurrentSrc] = useState(normalizedSrc);
  const [hasError, setHasError] = useState(false);
  const [retried, setRetried] = useState(false);

  const handleError = () => {
    // If /images/... failed, try /src/assets/images/... or vice versa once
    if (!retried) {
      setRetried(true);
      if (currentSrc.startsWith('/images/')) {
        setCurrentSrc(currentSrc.replace('/images/', '/src/assets/images/'));
        return;
      } else if (currentSrc.startsWith('/src/assets/images/')) {
        setCurrentSrc(currentSrc.replace('/src/assets/images/', '/images/'));
        return;
      }
    }
    setHasError(true);
  };

  if (hasError || !currentSrc) {
    return (
      <div
        className={`${aspectRatioClass} w-full bg-stone-900 text-stone-300 flex flex-col items-center justify-center p-6 relative overflow-hidden border border-stone-800`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle architectural grain lines pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #a8a29e 0, #a8a29e 1px, transparent 0, transparent 24px)`
          }}
        />
        <div className="relative z-10 text-center space-y-2 max-w-sm">
          <span className="text-[11px] uppercase tracking-widest text-stone-400 font-sans block">
            {category} · Archive Plate
          </span>
          <p className="font-serif italic text-base text-stone-200 line-clamp-2">
            {alt}
          </p>
          <div className="w-8 h-px bg-stone-600 mx-auto mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${aspectRatioClass}`}>
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={handleError}
        className={`${className} transition-transform duration-500 ease-out hover:scale-[1.02]`}
      />
    </div>
  );
};
