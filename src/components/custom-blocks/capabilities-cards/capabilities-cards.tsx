import Container from '@/components/layout/container';

type CapabilityCardItem = {
  title: string;
  description: string;
};

type CapabilitiesCardsSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  items: CapabilityCardItem[];
  getCardLabel: (index: number) => string;
  brandLabel: string;
};

export function CapabilitiesCardsSection({
  id,
  eyebrow,
  title,
  description,
  items,
  getCardLabel,
  brandLabel,
}: CapabilitiesCardsSectionProps) {
  return (
    <section id={id} className="px-4 py-16">
      <Container className="px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold text-foreground lg:text-4xl">
            {title}
          </h2>
          <p className="text-base text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group relative flex min-h-[260px] flex-col rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <span>{getCardLabel(index + 1)}</span>
                <span className="text-[10px]">{brandLabel}</span>
              </div>
              <h3 className="mt-4 min-h-[3.25rem] text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 min-h-[3.5rem] text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
