import { HeaderSection } from '@/components/layout/header-section';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

type WorkflowStep = {
  title: ReactNode;
  description: ReactNode;
};

type WorkflowStepsSectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items: WorkflowStep[];
  className?: string;
};

export default function WorkflowStepsSection({
  id,
  title,
  subtitle,
  description,
  items,
  className,
}: WorkflowStepsSectionProps) {
  return (
    <section
      id={id ?? 'workflow-steps'}
      className={cn('px-4 py-16', className)}
    >
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-16">
        <HeaderSection
          title={title}
          subtitle={subtitle}
          subtitleAs="h2"
          description={description}
          descriptionAs="p"
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          {items.map((item, index) => (
            <Fragment key={`workflow-step-${index + 1}`}>
              <div className="flex-1 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold leading-none text-background">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {index < items.length - 1 ? (
                <div className="flex items-center justify-center md:w-12">
                  <ArrowRight className="hidden size-5 text-muted-foreground md:block" />
                  <ArrowDown className="size-5 text-muted-foreground md:hidden" />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
