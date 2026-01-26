import { HeaderSection } from '@/components/layout/header-section';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type XContentSectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  urls: string[];
  className?: string;
  cardClassName?: string;
  iframeClassName?: string;
  cardHeight?: string;
  iframeTitlePrefix?: string;
};

const getTweetId = (url: string) => {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? '';
};

const getEmbedUrl = (url: string) => {
  const id = getTweetId(url);
  if (!id) {
    return '';
  }
  return `https://platform.twitter.com/embed/Tweet.html?dnt=true&theme=light&id=${id}`;
};

export default function XContentSection({
  id,
  title,
  subtitle,
  description,
  urls,
  className,
  cardClassName,
  iframeClassName,
  cardHeight = 'h-[460px]',
  iframeTitlePrefix = 'X post preview',
}: XContentSectionProps) {
  const showHeader = title || subtitle || description;

  return (
    <section id={id ?? 'x-content'} className={cn('px-4 py-16', className)}>
      <div className="w-full space-y-8 lg:space-y-16">
        {showHeader ? (
          <HeaderSection
            title={title ?? undefined}
            subtitle={subtitle ?? undefined}
            subtitleAs="h2"
            description={description ?? undefined}
            descriptionAs="p"
          />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {urls.map((url, index) => {
            const embedUrl = getEmbedUrl(url);
            if (!embedUrl) {
              return null;
            }
            return (
              <Card
                key={`${url}-${index}`}
                className={cn(
                  'overflow-hidden border-border/60 bg-background/80 p-0 shadow-lg',
                  cardClassName
                )}
              >
                <div className={cn('w-full bg-background', cardHeight)}>
                  <iframe
                    className={cn('h-full w-full', iframeClassName)}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    src={embedUrl}
                    title={`${iframeTitlePrefix} ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
