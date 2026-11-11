import { ImgHTMLAttributes } from 'react';

interface PhotoProps {
  src?: string;
  alt: string;
  ratio?: string; // e.g. "16/9", "400/440"
  objectPosition?: string; // e.g. "50% 60%"
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  imageClassName?: string;
  scaleOnHover?: boolean;
}

export default function Photo({
  src,
  alt,
  ratio = '16/9',
  objectPosition = '50% 50%',
  width,
  height,
  loading = 'lazy',
  className = '',
  imageClassName = '',
  scaleOnHover = false,
}: PhotoProps) {
  // If no src is provided, show the "Photo to come" placeholder frame
  if (!src) {
    return (
      <div
        className={`w-full bg-[var(--rule)]/50 border border-[var(--rule)] rounded-[4px] overflow-hidden flex items-center justify-center select-none ${className}`}
        style={{ aspectRatio: ratio }}
        aria-label="Image placeholder"
      >
        <span className="font-mono-plex text-[12px] text-[var(--muted)] uppercase tracking-[0.08em]">
          Photo to come
        </span>
      </div>
    );
  }

  // Derive WebP alternative if src is a local .jpg
  const webpSrc = src.endsWith('.jpg') ? src.replace(/\.jpg$/, '.webp') : undefined;

  return (
    <div
      className={`w-full bg-[var(--rule)]/40 border border-[var(--rule)] rounded-[4px] overflow-hidden relative ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <picture className="w-full h-full block">
        {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          style={{ objectPosition }}
          className={`w-full h-full object-cover block will-change-transform ${
            scaleOnHover
              ? 'transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]'
              : ''
          } ${imageClassName}`}
        />
      </picture>
    </div>
  );
}
