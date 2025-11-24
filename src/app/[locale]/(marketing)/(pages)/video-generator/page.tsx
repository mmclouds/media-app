import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: 'Video Generator | ' + t('title'),
    description:
      'Create immersive video stories with our upcoming AI-powered video generator.',
    canonicalUrl: getUrlWithLocale('/video-generator', locale),
  });
}

export default async function VideoGeneratorPage(props: NextPageProps) {
  const params = await props.params;
  const locale = params?.locale as Locale | undefined;

  return (
    <div className="w-full bg-background px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="space-y-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {locale ?? 'en'} · Internal Preview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            AI Video Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Configure prompts, fine-tune render details, and review each output
            in a focused workspace designed for storytelling workflows.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
          <Card className="border-zinc-800/60 bg-muted/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                Video configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Prompt builder
                </p>
                <div className="rounded-2xl border border-dashed border-muted-foreground/40 bg-background/40 p-5 text-left text-sm text-muted-foreground">
                  High-level description, reference shots, and motion cues will
                  live here. Tie this area into the actual prompt form later.
                </div>
              </div>

              <Separator className="bg-muted-foreground/30" />

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Generation mode
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Switch between text, image, or hybrid pipelines.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {['Text to Video', 'Image to Video', 'Multi Elements'].map(
                      (label) => (
                        <div
                          key={label}
                          className="rounded-xl border border-muted-foreground/30 bg-background/50 px-3 py-2 text-center text-xs text-muted-foreground"
                        >
                          {label}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-muted-foreground/40 bg-background/40 p-4 text-sm text-muted-foreground">
                  Additional configuration inputs (models, aspect ratios, sound
                  tracks, output count…) can be nested here as the workflow
                  matures.
                </div>
              </div>

              <Button className="w-full" size="lg" variant="default">
                Prepare generation
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-background/80">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-base font-medium text-foreground">
                  Preview timeline
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Video 2.5 Turbo</Badge>
                  <Badge variant="outline">Professional Mode</Badge>
                  <Badge variant="outline">Sound FX On</Badge>
                </div>
              </div>
              <Button size="sm" variant="secondary">
                Export draft
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-muted-foreground/30 bg-muted/20 p-4 text-sm text-muted-foreground">
                Summarize the current prompt or storyline here to help reviewers
                understand what the preview represents.
              </div>

              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex-1">
                  <AspectRatio ratio={16 / 9}>
                    <div className="flex h-full items-center justify-center rounded-3xl border border-muted-foreground/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-sm text-muted-foreground">
                      Video playback surface
                    </div>
                  </AspectRatio>
                </div>
                <div className="flex w-full flex-row gap-3 lg:w-32 lg:flex-col">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-2xl border border-muted-foreground/30 bg-muted/20"
                    >
                      <AspectRatio ratio={1}>
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          Shot {index}
                        </div>
                      </AspectRatio>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">
                    Frame annotations
                  </p>
                  <p className="text-muted-foreground">
                    Log notes, feedback, or sync comments per output.
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Open notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
