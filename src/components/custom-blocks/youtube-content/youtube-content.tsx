'use client';

import { HeaderSection } from '@/components/layout/header-section';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef } from 'react';

type YouTubeContentSectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  urls: string[];
  className?: string;
  cardClassName?: string;
  iframeClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
  iframeTitlePrefix?: string;
};

const getYoutubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '');
    }
    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? '';
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? '';
    }
    const id = parsed.searchParams.get('v');
    if (id) {
      return id;
    }
  } catch {}

  const match = url.match(
    /(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]+)/
  );
  return match?.[1] ?? '';
};

const getEmbedUrl = (url: string) => {
  const id = getYoutubeId(url);
  if (!id) {
    return '';
  }
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
};

export default function YouTubeContentSection({
  id,
  title,
  subtitle,
  description,
  urls,
  className,
  cardClassName,
  iframeClassName,
  prevLabel = 'Scroll to previous videos',
  nextLabel = 'Scroll to next videos',
  iframeTitlePrefix = 'YouTube video',
}: YouTubeContentSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const items = useMemo(
    () =>
      urls
        .map((url) => ({
          url,
          embedUrl: getEmbedUrl(url),
        }))
        .filter((item) => item.embedUrl),
    [urls]
  );

  const showHeader = title || subtitle || description;

  const handleScroll = (direction: 'prev' | 'next') => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const offset = Math.round(container.clientWidth * 0.9);
    container.scrollBy({
      left: direction === 'next' ? offset : -offset,
      behavior: 'smooth',
    });
  };

  if (!items.length) {
    return null;
  }

  return (
    <section
      id={id ?? 'youtube-content'}
      className={cn('px-4 py-16', className)}
    >
      <div className="w-full space-y-8 lg:space-y-12">
        {showHeader ? (
          <HeaderSection
            title={title ?? undefined}
            subtitle={subtitle ?? undefined}
            subtitleAs="h2"
            description={description ?? undefined}
            descriptionAs="p"
          />
        ) : null}

        <div className="relative">
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => handleScroll('prev')}
            className="absolute left-0 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-lg transition duration-200 hover:scale-105 hover:bg-primary/10 md:flex"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {items.map((item, index) => (
              <div
                key={`${item.url}-${index}`}
                className={cn(
                  'snap-start shrink-0 rounded-2xl border border-border/60 bg-background/80 shadow-lg',
                  cardClassName
                )}
              >
                <iframe
                  className={cn(
                    'h-[198px] w-[344px] rounded-2xl sm:h-[296px] sm:w-[525px]',
                    iframeClassName
                  )}
                  src={item.embedUrl}
                  title={`${iframeTitlePrefix} ${index + 1}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => handleScroll('next')}
            className="absolute right-0 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-lg transition duration-200 hover:scale-105 hover:bg-primary/10 md:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
