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
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
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
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className={`${className} transition-transform duration-500 ease-out hover:scale-[1.02]`}
      />
    </div>
  );
};
