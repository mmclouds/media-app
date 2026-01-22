import { HeaderSection } from '@/components/layout/header-section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type IntegrationItem = {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  link?: string;
};

type Integration3SectionProps = {
  title: ReactNode;
  subtitle: ReactNode;
  description: ReactNode;
  learnMoreLabel: ReactNode;
  items: IntegrationItem[];
};

export default function Integration3Section({
  title,
  subtitle,
  description,
  learnMoreLabel,
  items,
}: Integration3SectionProps) {
  return (
    <section id="integration3" className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <HeaderSection
          title={title}
          subtitle={subtitle}
          description={description}
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <IntegrationCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              link={item.link}
              learnMoreLabel={learnMoreLabel}
            />
          ))}
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
  learnMoreLabel,
}: {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  link?: string;
  learnMoreLabel: ReactNode;
}) => {
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
              {learnMoreLabel}
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </LocaleLink>
          </Button>
        </div>
      </div>
    </Card>
  );
};
