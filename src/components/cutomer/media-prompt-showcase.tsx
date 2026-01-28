import clsx from 'clsx';

import Container from '@/components/layout/container';

const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v']);

const getMediaKind = (url: string) => {
  const cleanUrl = url.split('?')[0]?.split('#')[0];
  const ext = cleanUrl?.split('.').pop()?.toLowerCase();
  if (!ext) {
    return 'image';
  }
  return VIDEO_EXTENSIONS.has(ext) ? 'video' : 'image';
};

export type MediaPromptExample = {
  title: string;
  description?: string;
  prompts: string[];
  output: string;
};

type MediaPromptShowcaseProps = {
  id?: string;
  title: string;
  subtitle?: string;
  exampleLabel?: string;
  promptSetLabel?: string;
  outputPreviewLabel?: string;
  items: MediaPromptExample[];
  className?: string;
};

const MediaPromptShowcase = ({
  id,
  title,
  subtitle,
  exampleLabel = 'Example',
  promptSetLabel = 'Prompt Set',
  outputPreviewLabel = 'Output Preview',
  items,
  className,
}: MediaPromptShowcaseProps) => {
  return (
    <section id={id} className={clsx('py-16 lg:py-24', className)}>
      <Container className="space-y-12">
        <div className="space-y-4">
          {subtitle ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        <div className="space-y-10">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="grid items-start gap-8 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:p-10"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {exampleLabel} {index + 1}
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/40 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    {promptSetLabel}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {item.prompts.map((prompt, promptIndex) => (
                      <li
                        key={`${item.title}-prompt-${promptIndex}`}
                        className="flex gap-3 text-base leading-relaxed text-foreground"
                      >
                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {promptIndex + 1}
                        </span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  {outputPreviewLabel}
                </p>
                {(() => {
                  const kind = getMediaKind(item.output);
                  return (
                    <div className="aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm">
                      {kind === 'video' ? (
                        <video
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                          aria-label={`${item.title} output video`}
                        >
                          <source src={item.output} />
                        </video>
                      ) : (
                        <img
                          src={item.output}
                          alt={`${item.title} output image`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default MediaPromptShowcase;
