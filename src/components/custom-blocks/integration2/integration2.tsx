import { Logo } from '@/components/layout/logo';
import {
  Gemini,
  GooglePaLM,
  MagicUI,
  MediaWiki,
  Replit,
  VSCodium,
} from '@/components/tailark/logos';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Integration2SectionProps = {
  title: ReactNode;
  description: ReactNode;
  primaryLabel: ReactNode;
  secondaryLabel: ReactNode;
  primaryHref?: string;
  secondaryHref?: string;
};

export default function Integration2Section({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryHref = '/',
  secondaryHref = '/',
}: Integration2SectionProps) {
  return (
    <section>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center sm:grid-cols-2">
            <div className="relative mx-auto w-fit">
              {/* <div className="bg-radial to-muted/50 dark:to-muted/50 absolute inset-0 z-10 from-transparent to-75%" /> */}
              <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <Replit />
                </IntegrationCard>
              </div>
              <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
                <IntegrationCard
                  borderClassName="border-black/25 dark:border-white/25"
                  className="dark:bg-muted"
                >
                  <Logo />
                </IntegrationCard>
                <IntegrationCard>
                  <VSCodium />
                </IntegrationCard>
              </div>

              <div className="mx-auto flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <MediaWiki />
                </IntegrationCard>

                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
              <h2 className="text-balance text-3xl font-semibold md:text-4xl">
                {title}
              </h2>
              <p className="text-muted-foreground">{description}</p>

              <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-4">
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
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  borderClassName,
}: {
  children: ReactNode;
  className?: string;
  borderClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex size-20 rounded-xl bg-muted dark:bg-muted/50',
        className
      )}
    >
      <div
        role="presentation"
        className={cn('absolute inset-0 rounded-xl', borderClassName)}
      />
      <div className="relative z-20 m-auto size-fit *:size-8">{children}</div>
    </div>
  );
};
