import { HeaderSection } from '@/components/layout/header-section';
import type { ReactNode } from 'react';

/**
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-4.json
 */

type FeatureItem = {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
};

type Features3SectionProps = {
  title: ReactNode;
  subtitle: ReactNode;
  description: ReactNode;
  items: FeatureItem[];
};

export default function Features3Section({
  title,
  subtitle,
  description,
  items,
}: Features3SectionProps) {
  return (
    <section id="features3" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20">
        <HeaderSection
          title={title}
          subtitle={subtitle}
          subtitleAs="h2"
          description={description}
          descriptionAs="p"
        />

        <div className="relative mx-auto grid divide-x divide-y border *:p-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                {item.icon}
                <h3 className="text-base font-medium">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
