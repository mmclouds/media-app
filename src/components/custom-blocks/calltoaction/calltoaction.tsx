import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import type { ReactNode } from 'react';

type CallToActionSectionProps = {
  title: ReactNode;
  description: ReactNode;
  primaryLabel: ReactNode;
  secondaryLabel: ReactNode;
  primaryHref?: string;
  secondaryHref?: string;
};

export default function CallToActionSection({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryHref = '/',
  secondaryHref = '/',
}: CallToActionSectionProps) {
  return (
    <section id="call-to-action" className="px-4 py-24 bg-muted/50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-muted-foreground">{description}</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <LocaleLink href={primaryHref}>
                <span>{primaryLabel}</span>
              </LocaleLink>
            </Button>

            <Button asChild size="lg" variant="outline">
              <LocaleLink href={secondaryHref}>
                <span>{secondaryLabel}</span>
              </LocaleLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
