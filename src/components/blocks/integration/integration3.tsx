import { HeaderSection } from '@/components/layout/header-section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import {
  AudioLines,
  BadgeDollarSign,
  ChevronRight,
  Gauge,
  Image,
  Layers,
  Video,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type * as React from 'react';

const iconClassName = 'size-5';

export default function Integration3Section() {
  const t = useTranslations('HomePage.integration3');

  return (
    <section id="integration3" className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          description={t('description')}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <IntegrationCard
            title={t('items.item-1.title')}
            description={t('items.item-1.description')}
            icon={<Image className={iconClassName} />}
          />

          <IntegrationCard
            title={t('items.item-2.title')}
            description={t('items.item-2.description')}
            icon={<Video className={iconClassName} />}
          />

          <IntegrationCard
            title={t('items.item-3.title')}
            description={t('items.item-3.description')}
            icon={<AudioLines className={iconClassName} />}
          />

          <IntegrationCard
            title={t('items.item-4.title')}
            description={t('items.item-4.description')}
            icon={<Layers className={iconClassName} />}
          />

          <IntegrationCard
            title={t('items.item-5.title')}
            description={t('items.item-5.description')}
            icon={<BadgeDollarSign className={iconClassName} />}
          />

          <IntegrationCard
            title={t('items.item-6.title')}
            description={t('items.item-6.description')}
            icon={<Gauge className={iconClassName} />}
          />
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  title,
  description,
  icon,
  link = '/media-studio',
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}) => {
  const t = useTranslations('HomePage.integration3');

  return (
    <Card className="p-6 bg-transparent hover:bg-accent dark:hover:bg-card">
      <div className="relative">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground">
          {icon}
        </div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1 pr-2 shadow-none"
          >
            <LocaleLink href={link}>
              {t('learnMore')}
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </LocaleLink>
          </Button>
        </div>
      </div>
    </Card>
  );
};
