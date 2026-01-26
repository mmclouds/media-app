import { HeaderSection } from '@/components/layout/header-section';
import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-5.json
 */

type FeatureItem = {
  label: ReactNode;
  icon: ReactNode;
};

type Features2SectionProps = {
  title: string;
  subtitle: string;
  description: string;
  items: FeatureItem[];
  lightImageSrc: string;
  darkImageSrc: string;
  lightImageAlt: string;
  darkImageAlt: string;
};

export default function Features2Section({
  title,
  subtitle,
  description,
  items,
  lightImageSrc,
  darkImageSrc,
  lightImageAlt,
  darkImageAlt,
}: Features2SectionProps) {
  return (
    <section id="features2" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20">
        <HeaderSection
          title={title}
          subtitle={subtitle}
          subtitleAs="h2"
          description={description}
          descriptionAs="p"
        />

        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="lg:pr-0">
              <h2 className="text-4xl font-semibold">{title}</h2>
              <p className="mt-6">{description}</p>
            </div>

            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              {items.map((item, index) => (
                <li key={index}>
                  {item.icon}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src={darkImageSrc}
                className="hidden rounded-[15px] dark:block"
                alt={darkImageAlt}
                width={1207}
                height={929}
              />
              <Image
                src={lightImageSrc}
                className="rounded-[15px] shadow dark:hidden"
                alt={lightImageAlt}
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
