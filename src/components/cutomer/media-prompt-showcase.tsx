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
      <Container className="space-y-8">
        <div className="space-y-3">
          {subtitle ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        <div className="space-y-8">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="space-y-6 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm lg:p-10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {exampleLabel} {index + 1}
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                {item.description ? (
                  <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:pb-0.5">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-[300px] overflow-hidden rounded-2xl border border-border/70 bg-muted/40 p-5 md:h-[320px]">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {promptSetLabel}
                  </p>
                  <ul className="h-full space-y-3 overflow-y-auto pr-2 text-base leading-relaxed text-foreground">
                    {item.prompts.map((prompt, promptIndex) => (
                      <li key={`${item.title}-prompt-${promptIndex}`}>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {(() => {
                  const kind = getMediaKind(item.output);
                  return (
                    <div className="h-[300px] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-4 shadow-sm md:h-[320px]">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        {outputPreviewLabel}
                      </p>
                      {kind === 'video' ? (
                        <video
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-contain"
                          aria-label={`${item.title} output video`}
                        >
                          <source src={item.output} />
                        </video>
                      ) : (
                        <img
                          src={item.output}
                          alt={`${item.title} output`}
                          loading="lazy"
                          className="h-full w-full object-contain"
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
