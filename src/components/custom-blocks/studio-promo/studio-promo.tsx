import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { ReactNode } from 'react';

type StudioPromoSectionProps = {
  id?: string;
  title: ReactNode;
  description: ReactNode;
  primaryLabel: ReactNode;
  primaryHref?: string;
  secondaryLabel?: ReactNode;
  secondaryHref?: string;
  className?: string;
};

export default function StudioPromoSection({
  id,
  title,
  description,
  primaryLabel,
  primaryHref = '#studio',
  secondaryLabel,
  secondaryHref = '/',
  className,
}: StudioPromoSectionProps) {
  return (
    <section
      id={id ?? 'studio-promo'}
      className={cn(
        'relative overflow-hidden bg-muted/40 px-4 py-20 text-foreground',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_55%),radial-gradient(circle_at_bottom,rgba(251,146,60,0.14),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-3xl border border-border/60 bg-background/80 px-6 py-12 shadow-lg sm:px-10 lg:px-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex size-24 items-center justify-center bg-transparent">
              <Image
                src="/logo.png"
                alt="VLook logo"
                width={80}
                height={80}
                className="size-20"
              />
            </div>
            <h2 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              {title}
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <LocaleLink href={primaryHref}>{primaryLabel}</LocaleLink>
              </Button>
              {secondaryLabel ? (
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <LocaleLink href={secondaryHref}>{secondaryLabel}</LocaleLink>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
