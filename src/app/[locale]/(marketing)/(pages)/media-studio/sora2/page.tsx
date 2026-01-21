import Container from '@/components/layout/container';
import { MediaOnlyGeneratorWorkspace } from '@/components/marketing/media-generator/media-only-generator-workspace';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import type { ReactNode } from 'react';

const PAGE_CONTENT = {
  en: {
    meta: {
      title: 'Sora 2 Studio',
      description:
        'Generate cinematic AI videos with OpenAI Sora 2. Stronger physics realism, higher fidelity, and better multi-scene control.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Sora 2 Studio',
      subtitle:
        'Turn text or images into cinematic short videos with improved physical realism, continuity, and sound.',
      cta: 'Start creating in the workspace below.',
    },
    overview: {
      title: 'Model Overview',
      description:
        'Sora is OpenAI’s text-to-video model introduced in 2024. Sora 2 (2025) upgrades physical understanding, visual fidelity, and controllability for multi-shot storytelling.',
      bullets: [
        'Public demos in 2024 with expanded access afterward.',
        'Sora 2 improves realism, motion coherence, and continuity.',
        'The Sora app pairs creation with sharing and remixing.',
      ],
    },
    highlights: {
      title: 'Key Highlights',
      items: [
        {
          title: 'Physics-consistent motion',
          description:
            'Better cause-and-effect behavior like realistic bounces and momentum.',
        },
        {
          title: 'Higher fidelity with sound',
          description:
            'Sharper lighting and textures with synced ambience, effects, and dialogue.',
        },
        {
          title: 'Stronger control',
          description:
            'Handles multi-shot prompts and keeps scenes consistent across cuts.',
        },
        {
          title: 'Character injection',
          description:
            'Blend real people into generated scenes with stable appearance.',
        },
      ],
    },
    capabilities: {
      title: 'Core Capabilities',
      items: [
        {
          title: 'Text-to-video',
          description:
            'Describe a scene in words and generate a short video with motion and sound.',
        },
        {
          title: 'Image-to-video',
          description:
            'Animate an uploaded image or extend a short clip into a sequence.',
        },
      ],
      note:
        'Generated videos include synchronized audio such as ambience, music, and simple dialogue.',
    },
    workflow: {
      title: 'How It Works',
      stepLabel: 'Step',
      steps: [
        {
          title: 'Input your idea',
          description:
            'Type a prompt or upload a starter image or clip from the editor.',
        },
        {
          title: 'Set parameters',
          description:
            'Choose aspect ratio, resolution, duration, and number of variations.',
        },
        {
          title: 'Generate',
          description:
            'Sora renders a short video in seconds to minutes with audio.',
        },
        {
          title: 'Refine and export',
          description:
            'Compare versions, remix, extend, and download MP4 files.',
        },
      ],
    },
    useCases: {
      title: 'Use Cases',
      items: [
        'Creators and influencers: rapid social clips without filming.',
        'Education: visualize concepts and historical scenes.',
        'Brand marketing: fast ad variations and product demos.',
        'Previs and visualization: quick storyboarding for films or games.',
      ],
    },
    examples: {
      title: 'Prompt Examples',
      items: [
        {
          language: 'Chinese',
          prompt: 'A blue dragon soaring above the Great Wall at sunset.',
          description:
            'A majestic dragon weaves along the wall with golden light and drifting clouds.',
        },
        {
          language: 'English',
          prompt: 'A group of cats playing jazz on a moonlit rooftop.',
          description:
            'A whimsical night performance with smooth camera pans and synced jazz.',
        },
        {
          language: 'Japanese',
          prompt: 'A giant robot protecting Tokyo at night.',
          description:
            'Neon cityscapes, anime-style action, and a heroic final pose.',
        },
        {
          language: 'Korean',
          prompt: 'A K-pop group performs on a futuristic stage.',
          description:
            'Holograms, tight choreography, and pulsing cyberpunk lighting.',
        },
        {
          language: 'Spanish',
          prompt: 'An enchanted forest lit by fireflies that whisper stories.',
          description:
            'Soft golden glows, ancient trees, and a calm mythical atmosphere.',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'How does Sora generate video?',
          answer:
            'It uses large generative diffusion models to transform text or image inputs into coherent video frames over time.',
        },
        {
          question: 'Does Sora output include audio?',
          answer:
            'Yes, Sora 2 adds synced ambience, music, and basic dialogue to complete the scene.',
        },
        {
          question: 'How long can videos be?',
          answer:
            'Official limits vary by plan, with typical ranges around 10 to 60 seconds.',
        },
        {
          question: 'Can I control style and length?',
          answer:
            'Yes. Use prompts plus settings like aspect ratio, resolution, and duration to guide output.',
        },
      ],
    },
    community: {
      title: 'Community Highlights',
      items: [
        {
          title: 'OpenAI Sora demos',
          description:
            'Official showcases of text-to-video scenes and cinematic realism.',
        },
        {
          title: 'Sora 2 launch clips',
          description:
            'Creators remixing and sharing multi-scene videos with new controls.',
        },
      ],
    },
    compliance: {
      title: 'Responsible Use',
      description:
        'Only upload content you own or have rights to use. Generated videos may include visible watermarks. Do not remove marks or misuse generated content.',
    },
  },
  zh: {
    meta: {
      title: 'Sora 2 Studio',
      description:
        'Generate cinematic AI videos with OpenAI Sora 2. Stronger physics realism, higher fidelity, and better multi-scene control.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Sora 2 Studio',
      subtitle:
        'Turn text or images into cinematic short videos with improved physical realism, continuity, and sound.',
      cta: 'Start creating in the workspace below.',
    },
    overview: {
      title: 'Model Overview',
      description:
        'Sora is OpenAI’s text-to-video model introduced in 2024. Sora 2 (2025) upgrades physical understanding, visual fidelity, and controllability for multi-shot storytelling.',
      bullets: [
        'Public demos in 2024 with expanded access afterward.',
        'Sora 2 improves realism, motion coherence, and continuity.',
        'The Sora app pairs creation with sharing and remixing.',
      ],
    },
    highlights: {
      title: 'Key Highlights',
      items: [
        {
          title: 'Physics-consistent motion',
          description:
            'Better cause-and-effect behavior like realistic bounces and momentum.',
        },
        {
          title: 'Higher fidelity with sound',
          description:
            'Sharper lighting and textures with synced ambience, effects, and dialogue.',
        },
        {
          title: 'Stronger control',
          description:
            'Handles multi-shot prompts and keeps scenes consistent across cuts.',
        },
        {
          title: 'Character injection',
          description:
            'Blend real people into generated scenes with stable appearance.',
        },
      ],
    },
    capabilities: {
      title: 'Core Capabilities',
      items: [
        {
          title: 'Text-to-video',
          description:
            'Describe a scene in words and generate a short video with motion and sound.',
        },
        {
          title: 'Image-to-video',
          description:
            'Animate an uploaded image or extend a short clip into a sequence.',
        },
      ],
      note:
        'Generated videos include synchronized audio such as ambience, music, and simple dialogue.',
    },
    workflow: {
      title: 'How It Works',
      stepLabel: 'Step',
      steps: [
        {
          title: 'Input your idea',
          description:
            'Type a prompt or upload a starter image or clip from the editor.',
        },
        {
          title: 'Set parameters',
          description:
            'Choose aspect ratio, resolution, duration, and number of variations.',
        },
        {
          title: 'Generate',
          description:
            'Sora renders a short video in seconds to minutes with audio.',
        },
        {
          title: 'Refine and export',
          description:
            'Compare versions, remix, extend, and download MP4 files.',
        },
      ],
    },
    useCases: {
      title: 'Use Cases',
      items: [
        'Creators and influencers: rapid social clips without filming.',
        'Education: visualize concepts and historical scenes.',
        'Brand marketing: fast ad variations and product demos.',
        'Previs and visualization: quick storyboarding for films or games.',
      ],
    },
    examples: {
      title: 'Prompt Examples',
      items: [
        {
          language: 'Chinese',
          prompt: 'A blue dragon soaring above the Great Wall at sunset.',
          description:
            'A majestic dragon weaves along the wall with golden light and drifting clouds.',
        },
        {
          language: 'English',
          prompt: 'A group of cats playing jazz on a moonlit rooftop.',
          description:
            'A whimsical night performance with smooth camera pans and synced jazz.',
        },
        {
          language: 'Japanese',
          prompt: 'A giant robot protecting Tokyo at night.',
          description:
            'Neon cityscapes, anime-style action, and a heroic final pose.',
        },
        {
          language: 'Korean',
          prompt: 'A K-pop group performs on a futuristic stage.',
          description:
            'Holograms, tight choreography, and pulsing cyberpunk lighting.',
        },
        {
          language: 'Spanish',
          prompt: 'An enchanted forest lit by fireflies that whisper stories.',
          description:
            'Soft golden glows, ancient trees, and a calm mythical atmosphere.',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'How does Sora generate video?',
          answer:
            'It uses large generative diffusion models to transform text or image inputs into coherent video frames over time.',
        },
        {
          question: 'Does Sora output include audio?',
          answer:
            'Yes, Sora 2 adds synced ambience, music, and basic dialogue to complete the scene.',
        },
        {
          question: 'How long can videos be?',
          answer:
            'Official limits vary by plan, with typical ranges around 10 to 60 seconds.',
        },
        {
          question: 'Can I control style and length?',
          answer:
            'Yes. Use prompts plus settings like aspect ratio, resolution, and duration to guide output.',
        },
      ],
    },
    community: {
      title: 'Community Highlights',
      items: [
        {
          title: 'OpenAI Sora demos',
          description:
            'Official showcases of text-to-video scenes and cinematic realism.',
        },
        {
          title: 'Sora 2 launch clips',
          description:
            'Creators remixing and sharing multi-scene videos with new controls.',
        },
      ],
    },
    compliance: {
      title: 'Responsible Use',
      description:
        'Only upload content you own or have rights to use. Generated videos may include visible watermarks. Do not remove marks or misuse generated content.',
    },
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const content =
    PAGE_CONTENT[locale as keyof typeof PAGE_CONTENT] ?? PAGE_CONTENT.en;

  return constructMetadata({
    title: `${content.meta.title} | VLook.AI`,
    description: content.meta.description,
    locale,
    pathname: '/media-studio/sora2',
  });
}

interface Sora2StudioPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Sora2StudioPage(props: Sora2StudioPageProps) {
  const params = await props.params;
  const content =
    PAGE_CONTENT[params.locale as keyof typeof PAGE_CONTENT] ??
    PAGE_CONTENT.en;

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(0,0%,90%,0.25),transparent_55%),radial-gradient(circle_at_top_right,hsla(0,0%,80%,0.2),transparent_60%)]"
        />
        <Container className="relative px-6 pb-16 pt-14 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {content.hero.eyebrow}
            </p>
            <h1 className="mt-6 text-4xl font-semibold text-foreground md:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {content.hero.subtitle}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {content.hero.cta}
            </p>
          </div>
          <div className="mt-12 rounded-3xl border border-border/60 bg-muted/40 p-3 shadow-lg">
            <MediaOnlyGeneratorWorkspace
              className="h-[720px]"
              preferredModelId="sora2"
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60">
        <Container className="space-y-12 px-6 py-16">
          <SectionHeader
            title={content.overview.title}
            description={content.overview.description}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {content.overview.bullets.map((item) => (
              <InfoCard key={item} description={item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60">
        <Container className="space-y-12 px-6 py-16">
          <SectionHeader title={content.highlights.title} />
          <div className="grid gap-4 md:grid-cols-2">
            {content.highlights.items.map((item) => (
              <InfoCard
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60">
        <Container className="space-y-12 px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-10">
              <SectionHeader
                title={content.capabilities.title}
                description={content.capabilities.note}
              />
              <div className="grid gap-4">
                {content.capabilities.items.map((item) => (
                  <InfoCard
                    key={item.title}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border/60 bg-muted/40 p-6">
              <h3 className="text-xl font-semibold text-foreground">
                {content.workflow.title}
              </h3>
              <div className="mt-6 space-y-4">
                {content.workflow.steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-border/60 bg-background p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {content.workflow.stepLabel} {index + 1}
                    </p>
                    <h4 className="mt-3 text-base font-semibold text-foreground">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60">
        <Container className="space-y-12 px-6 py-16">
          <SectionHeader title={content.useCases.title} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {content.useCases.items.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60">
        <Container className="space-y-12 px-6 py-16">
          <SectionHeader title={content.examples.title} />
          <div className="grid gap-4 md:grid-cols-2">
            {content.examples.items.map((item) => (
              <div
                key={item.prompt}
                className="rounded-2xl border border-border/60 bg-muted/40 p-4"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {item.language}
                </p>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {item.prompt}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60">
        <Container className="space-y-12 px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6">
              <SectionHeader title={content.faq.title} />
              <div className="space-y-4">
                {content.faq.items.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  >
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.question}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <SectionHeader title={content.community.title} />
              <div className="space-y-4">
                {content.community.items.map((item) => (
                  <InfoCard
                    key={item.title}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
              <div className="rounded-3xl border border-border/60 bg-foreground p-6 text-background">
                <h3 className="text-lg font-semibold">
                  {content.compliance.title}
                </h3>
                <p className="mt-3 text-sm text-background/80">
                  {content.compliance.description}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({
  title,
  description,
  footer,
}: {
  title?: string;
  description?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
      {title ? (
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
