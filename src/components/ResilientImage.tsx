import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2EFE9] via-[#EAE5DC] to-[#E2DBD0] text-[#635D55] p-6 text-center ${className}`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="mb-3 opacity-60"
          aria-hidden="true"
        >
          <path d="M12 2L9 6H5L3 11L6 13V21H18V13L21 11L19 6H15L12 2Z" />
        </svg>
        <span className="font-serif text-base text-[#1A1816]">
          {fallbackTitle || 'Maimoona Noor Fashion'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
