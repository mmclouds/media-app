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
  inputLabel?: string;
  outputLabel?: string;
  items: ImageToMediaExample[];
  className?: string;
};

const ImageToMediaShowcase = ({
  id,
  title,
  subtitle,
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
                    Example {index + 1}
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

                <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                      {inputLabel}
                    </p>
                    <div className="grid w-full gap-3 sm:grid-cols-2">
                      {item.inputImages.map((image, imageIndex) => (
                        <div
                          key={`${item.title}-input-${imageIndex}`}
                          className="aspect-video overflow-hidden rounded-2xl bg-muted/30"
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
                  </div>

                  <div className="flex w-full flex-col items-center justify-center space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                      {outputLabel}
                    </p>
                    <div className="flex w-full max-w-[720px] aspect-video items-center justify-center overflow-hidden rounded-2xl bg-muted/30 shadow-sm">
                      {outputKind === 'video' ? (
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
                          alt={`${item.title} output image`}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      )}
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
