import { HeaderSection } from '@/components/layout/header-section';
import { PricingTable } from '@/components/pricing/pricing-table';
import type { ReactNode } from 'react';

type PricingSectionProps = {
  subtitle: string;
  description: string;
  subtitleClassName?: string;
};

export default function PricingSection({
  subtitle,
  description,
  subtitleClassName = 'text-4xl font-bold',
}: PricingSectionProps) {
  return (
    <section id="pricing" className="px-4 py-16">
      <div className="mx-auto max-w-6xl px-6 space-y-16">
        <HeaderSection
          subtitle={subtitle}
          subtitleAs="h2"
          subtitleClassName={subtitleClassName}
          description={description}
          descriptionAs="p"
        />

        <PricingTable />
      </div>
    </section>
  );
}
