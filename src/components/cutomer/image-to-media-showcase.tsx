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

export type ImageToMediaExample = {
  title: string;
  description?: string;
  prompt: string | string[];
  inputImages: string[];
  output: string;
};

type ImageToMediaShowcaseProps = {
  id?: string;
  title: string;
  subtitle?: string;
  exampleLabel?: string;
  inputLabel?: string;
  outputLabel?: string;
  items: ImageToMediaExample[];
  className?: string;
};

const ImageToMediaShowcase = ({
  id,
  title,
  subtitle,
  exampleLabel = 'Example',
  inputLabel = 'Input Images',
  outputLabel = 'Output',
  items,
  className,
}: ImageToMediaShowcaseProps) => {
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
          {items.map((item, index) => {
            const outputKind = getMediaKind(item.output);

            return (
              <div
                key={`${item.title}-${index}`}
                className="space-y-6 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm lg:p-8"
              >
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {exampleLabel} {index + 1}
                  </p>
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                  <div className="grid border-b border-border/60 bg-muted/40 text-sm font-semibold text-foreground sm:grid-cols-2">
                    <div className="px-4 py-3">{inputLabel}</div>
                    <div className="border-t border-border/60 px-4 py-3 sm:border-t-0 sm:border-l">
                      {outputLabel}
                    </div>
                  </div>
                  <div className="grid gap-6 p-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="grid gap-4">
                      {item.inputImages.map((image, imageIndex) => (
                        <div
                          key={`${item.title}-input-${imageIndex}`}
                          className="aspect-video overflow-hidden rounded-2xl bg-background/80"
                        >
                          <img
                            src={image}
                            alt={`${item.title} input image ${imageIndex + 1}`}
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-background/80">
                        {outputKind === 'video' ? (
                          <video
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            className="aspect-video h-full w-full object-contain"
                            aria-label={`${item.title} output video`}
                          >
                            <source src={item.output} />
                          </video>
                        ) : (
                          <img
                            src={item.output}
                            alt={`${item.title} output image`}
                            loading="lazy"
                            className="aspect-video h-full w-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ImageToMediaShowcase;
