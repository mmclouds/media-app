import { HeaderSection } from '@/components/layout/header-section';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { ReactNode } from 'react';

type AlternatingMediaItem = {
  title: ReactNode;
  description: ReactNode;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
  };
};

type AlternatingMediaSectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items: AlternatingMediaItem[];
  className?: string;
};

export default function AlternatingMediaSection({
  id,
  title,
  subtitle,
  description,
  items,
  className,
}: AlternatingMediaSectionProps) {
  const showHeader = title || subtitle || description;

  return (
    <section
      id={id ?? 'alternating-media'}
      className={cn('px-4 py-16', className)}
    >
      <div className="mx-auto max-w-6xl space-y-12 lg:space-y-20">
        {showHeader ? (
          <HeaderSection
            title={title}
            subtitle={subtitle}
            subtitleAs="h2"
            description={description}
            descriptionAs="p"
          />
        ) : null}

        <div className="space-y-16 lg:space-y-24">
          {items.map((item, index) => {
            const isEven = index % 2 === 1;
            const imageWidth = item.image.width ?? 1200;
            const imageHeight = item.image.height ?? 900;

            return (
              <div
                key={index}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={cn('space-y-4', isEven && 'lg:order-2')}>
                  <h3 className="text-3xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/30 shadow-sm">
                    <div className="aspect-[4/3] w-full">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={imageWidth}
                        height={imageHeight}
                        priority={item.image.priority}
                        className={cn(
                          'h-full w-full object-cover',
                          item.image.className
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
