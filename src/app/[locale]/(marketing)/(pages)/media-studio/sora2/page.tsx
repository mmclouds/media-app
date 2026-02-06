import AlternatingMediaSection from '@/components/custom-blocks/alternating-media/alternating-media';
import CallToActionSection from '@/components/custom-blocks/calltoaction/calltoaction';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import Features3Section from '@/components/custom-blocks/features3/features3';
import HeroSection from '@/components/custom-blocks/hero/hero';
import StudioPromoSection from '@/components/custom-blocks/studio-promo/studio-promo';
import WorkflowStepsSection from '@/components/custom-blocks/workflow-steps/workflow-steps';
import XContentSection from '@/components/custom-blocks/x-content/x-content';
import YouTubeContentSection from '@/components/custom-blocks/youtube-content/youtube-content';
import Container from '@/components/layout/container';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import FooterSection from '@/components/tailark/preview/footer/one/page';
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';

const PAGE_CONTENT = {
  en: {
    meta: {
      title: 'Sora2 AI Video Generator',
      description:
        'Generate cinematic AI videos with OpenAI Sora 2, featuring stronger physics realism, higher fidelity, and better multi-scene control.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Sora2 AI Video Generator',
      subtitle:
        'Turn text or images into cinematic short videos with stronger realism, continuity, and control. Sora 2 upgrades physics understanding, visual fidelity, and multi-shot consistency for storytelling.',
      cta: 'Start creating in the workspace below.',
      primaryLabel: 'Open studio',
      secondaryLabel: 'View capabilities',
    },
    highlights: {
      title: 'Key Highlights',
      items: [
        {
          title: 'Better physics, more believable motion',
          description:
            'Sora 2 follows real-world cause and effect so scenes feel grounded and coherent.',
        },
        {
          title: 'Cinematic visuals with synced audio',
          description:
            'Sora 2 improves realism, lighting, texture, and motion continuity. It can also generate matching dialogue, sound effects, and music with tight sync for deeper immersion.',
        },
        {
          title: 'Longer continuity and shot control',
          description:
            'Sora 2 understands complex directions, supports multi-shot and multi-scene generation, and keeps people, environments, and objects consistent. Character injection lets you reuse specific faces and voices for controllable storytelling.',
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
      note: 'Generated videos can include synchronized audio such as ambience, music, and simple dialogue.',
    },
    workflow: {
      title: 'How It Works',
      steps: [
        {
          title: 'Input your idea',
          description:
            'Type a prompt or upload a starter image or clip from the editor.',
        },
        {
          title: 'Set parameters',
          description:
            'Choose aspect ratio, resolution, duration, and variations.',
        },
        {
          title: 'Generate',
          description:
            'Sora can render a short video in seconds to minutes with audio.',
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
      subtitle: 'Common questions about Sora 2 generation.',
      items: [
        {
          question: 'How does Sora generate video?',
          answer:
            'It uses large generative diffusion models to transform text or image inputs into coherent video frames over time.',
        },
        {
          question: 'Does Sora output include audio?',
          answer:
            'Sora 2 can generate synced ambience, music, and simple dialogue to complete the scene.',
        },
        {
          question: 'How long can videos be?',
          answer:
            'Length depends on plan and settings; typical outputs are short clips around 10-15 seconds.',
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
      primaryLabel: 'Back to studio',
      secondaryLabel: 'View FAQ',
    },
    social: {
      title: 'X Highlights',
      subtitle: 'Latest community takes on Sora 2',
      description: 'See how creators describe prompts and results in the wild.',
      iframeTitlePrefix: 'X post preview',
    },
    youtube: {
      title: 'YouTube Highlights',
      subtitle: 'Sora 2 in action',
      description: 'Watch creator demos, breakdowns, and real workflows.',
      prevLabel: 'Scroll to previous videos',
      nextLabel: 'Scroll to next videos',
      iframeTitlePrefix: 'YouTube video',
    },
    studioPromo: {
      title: 'VLook.ai Studio: Cinematic AI video creation for everyone',
      description:
        'Create high-fidelity clips fast with VLook.ai. Prompt, refine, and export in minutes.',
      primaryLabel: 'Open VLook.ai Studio',
      secondaryLabel: 'Explore VLook.ai',
    },
    immersiveStudio: {
      label: 'Start immersive studio',
    },
  },
  zh: {
    meta: {
      title: 'Sora2 AI Video Generator',
      description:
        '使用 OpenAI Sora 2 生成电影感 AI 视频，物理真实感更强、清晰度更高，并支持多场景控制。',
    },
    hero: {
      eyebrow: 'AI 视频生成',
      title: 'Sora2 AI Video Generator',
      subtitle:
        '将文本或图片转化为电影感短视频，具备更强的真实感、连贯性与可控性。Sora 2 在物理理解、画面清晰度与多镜头一致性上进一步升级。',
      cta: '在下方工作区开始创作。',
      primaryLabel: '进入工作室',
      secondaryLabel: '查看能力',
    },
    highlights: {
      title: '核心亮点',
      items: [
        {
          title: '更真实的物理表现',
          description:
            'Sora 2 更贴近真实世界的因果关系，让画面动作更自然、更可信。',
        },
        {
          title: '电影级画质与同步音频',
          description:
            'Sora 2 在画面真实度、光影质感与动作连续性上大幅提升，并可生成匹配的对白、音效与背景音乐，画面与声音更一致。',
        },
        {
          title: '更高可控性与长程一致性',
          description:
            'Sora 2 能理解复杂指令，支持多镜头、多场景连续生成，并保持人物、环境与物体的一致性。“角色注入”可复用特定人物外貌与声音，提升叙事可控性。',
        },
      ],
    },
    capabilities: {
      title: '核心能力',
      items: [
        {
          title: '文本生成视频',
          description: '用文字描述场景，生成带运动与音效的短视频。',
        },
        {
          title: '图片生成视频',
          description: '动画化上传图片或扩展短片为连贯序列。',
        },
      ],
      note: '生成视频可包含同步音频，如环境声、音乐与简单对白。',
    },
    workflow: {
      title: '工作流程',
      steps: [
        {
          title: '输入创意',
          description: '输入提示词或上传起始图片/片段。',
        },
        {
          title: '设置参数',
          description: '选择比例、清晰度、时长与变体。',
        },
        {
          title: '生成视频',
          description: 'Sora 可在数秒到数分钟内输出带音频的短片。',
        },
        {
          title: '润色与导出',
          description: '对比版本、重混、扩展并导出 MP4。',
        },
      ],
    },
    useCases: {
      title: '使用场景',
      items: [
        '创作者与达人：快速生成社媒短片。',
        '教育：可视化概念与历史场景。',
        '品牌营销：快速制作广告与产品演示。',
        '预演与可视化：用于影视/游戏分镜。',
      ],
    },
    examples: {
      title: '提示词示例',
      items: [
        {
          language: '中文',
          prompt: '一条蓝色巨龙在夕阳下飞越长城。',
          description: '金色光线与云层交织，巨龙沿城墙盘旋。',
        },
        {
          language: '英文',
          prompt: 'A group of cats playing jazz on a moonlit rooftop.',
          description: '夜色轻松，镜头平滑移动，爵士同步。',
        },
        {
          language: '日文',
          prompt: 'A giant robot protecting Tokyo at night.',
          description: '霓虹城市与动漫风动作，英雄式定格。',
        },
        {
          language: '韩文',
          prompt: 'A K-pop group performs on a futuristic stage.',
          description: '全息舞台与整齐编舞，赛博灯光律动。',
        },
        {
          language: '西班牙文',
          prompt: 'An enchanted forest lit by fireflies that whisper stories.',
          description: '温暖萤光与古树交错，氛围宁静奇幻。',
        },
      ],
    },
    faq: {
      title: '常见问题',
      subtitle: '关于 Sora 2 生成的常见疑问。',
      items: [
        {
          question: 'Sora 如何生成视频？',
          answer: '基于扩散式生成模型，将文本或图像转化为连贯视频帧。',
        },
        {
          question: '输出是否包含音频？',
          answer: 'Sora 2 可同步生成环境声、音乐与基础对白。',
        },
        {
          question: '视频最长能生成多长？',
          answer: '长度受套餐与参数限制，通常为 10-15 秒的短片。',
        },

        {
          question: '可以控制风格和长度吗？',
          answer: '可以，通过提示词与比例、清晰度、时长等参数控制。',
        },
      ],
    },
    community: {
      title: '社区亮点',
      items: [
        {
          title: 'OpenAI Sora 演示',
          description: '官方展示的文本生成视频与电影级画面。',
        },
        {
          title: 'Sora 2 发布片段',
          description: '创作者分享多镜头视频与新控制能力。',
        },
      ],
    },
    compliance: {
      title: '负责任使用',
      description:
        '仅上传你拥有或有权使用的内容。生成视频可能带有水印，请勿移除或滥用。',
      primaryLabel: '返回工作室',
      secondaryLabel: '查看常见问题',
    },
    social: {
      title: 'X 精选内容',
      subtitle: '社区最新的 Sora 2 观点',
      description: '看看创作者如何描述提示词与生成结果。',
      iframeTitlePrefix: 'X 帖子预览',
    },
    youtube: {
      title: 'YouTube 精选内容',
      subtitle: 'Sora 2 实战演示',
      description: '观看创作者演示、拆解与真实工作流。',
      prevLabel: '查看上一组视频',
      nextLabel: '查看下一组视频',
      iframeTitlePrefix: 'YouTube 视频',
    },
    studioPromo: {
      title: 'VLook.ai 工作室：人人可用的电影级 AI 视频创作',
      description:
        '通过 VLook.ai 快速生成高质量视频：输入提示词、微调细节、数分钟内导出。',
      primaryLabel: '打开 VLook.ai 工作室',
      secondaryLabel: '了解 VLook.ai',
    },
    immersiveStudio: {
      label: '开始沉浸式工作室',
    },
  },
} as const;

const iconClassName = 'size-4';

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
    PAGE_CONTENT[params.locale as keyof typeof PAGE_CONTENT] ?? PAGE_CONTENT.en;

  const socialUrls = [
    'https://x.com/slow_developer/status/1973079395863548172',
    'https://x.com/AngryTomtweets/status/1975499455035220353',
    'https://x.com/azed_ai/status/1983488326708727882',
    'https://x.com/levelsio/status/1975505972765323447',
    'https://x.com/Raindropsmedia1/status/1974484908639691142',
    'https://x.com/goth600/status/1973424740133179667',
    'https://x.com/gabriel1/status/1973071380842229781',
    'https://x.com/AviSchiffmann/status/1758199766234624333',
  ];
  const youtubeUrls = [
    'https://www.youtube.com/watch?v=OY2x0TyKzIQ',
    'https://www.youtube.com/watch?v=HK6y8DAPN_0',
    'https://www.youtube.com/watch?v=iVtqtu6HceI',
    'https://www.youtube.com/watch?v=iiRwMCeDPkM',
  ];
  const highlightItems = [
    {
      title: content.highlights.items[0]?.title,
      description: content.highlights.items[0]?.description,
      image: {
        src: '/images/generated/sora2-physics-realism-20260123-002.jpg',
        alt: 'Physics-first realism preview',
        width: 1207,
        height: 929,
        className: 'scale-95',
        priority: true,
      },
    },
    {
      title: content.highlights.items[1]?.title,
      description: content.highlights.items[1]?.description,
      image: {
        src: '/images/generated/sora2-fidelity-audio-20260123-003.jpg',
        alt: 'High-fidelity visuals and audio preview',
        width: 1207,
        height: 929,
        className: 'scale-95',
      },
    },
    {
      title: content.highlights.items[2]?.title,
      description: content.highlights.items[2]?.description,
      image: {
        src: '/images/generated/sora2-character-injection-20260123-003.jpg',
        alt: 'Character injection preview',
        width: 1207,
        height: 929,
        className: 'scale-95',
      },
    },
  ];
  return (
    <>
      <Navbar scroll={true} />
      <main className="bg-background text-foreground">
        <div className="mb-12 lg:mb-16">
          <HeroSection
            eyebrow={content.hero.eyebrow}
            title={content.hero.title}
            description={content.hero.subtitle}
            cta={content.hero.cta}
            primaryLabel={content.hero.primaryLabel}
            secondaryLabel={content.hero.secondaryLabel}
            primaryHref="#studio"
            secondaryHref="#highlights"
          />
        </div>

        <section id="studio" className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(0,0%,90%,0.25),transparent_55%),radial-gradient(circle_at_top_right,hsla(0,0%,80%,0.2),transparent_60%)]"
          />
          <Container className="relative px-6 pb-16 pt-10 lg:pt-16">
            <div className="mt-10 rounded-3xl border border-border/60 bg-muted/40 p-3 shadow-lg">
              <MediaGeneratorWorkspace
                className="h-[720px]"
                initialMediaType="video"
                preferredModelId="sora2"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                size="lg"
                className="cursor-pointer h-12 px-8 text-base md:h-14 md:px-10 md:text-lg"
              >
                <Link href="/media-studio">
                  {content.immersiveStudio.label}
                </Link>
              </Button>
            </div>
          </Container>
        </section>

        <AlternatingMediaSection
          id="highlights"
          subtitle={content.highlights.title}
          items={highlightItems}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <WorkflowStepsSection
          id="workflow"
          title={undefined}
          subtitle={content.workflow.title}
          description={undefined}
          items={content.workflow.steps.map((step) => ({
            title: step.title,
            description: step.description,
          }))}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <YouTubeContentSection
          id="youtube-highlights"
          title={content.youtube.title}
          subtitle={content.youtube.subtitle}
          description={content.youtube.description}
          prevLabel={content.youtube.prevLabel}
          nextLabel={content.youtube.nextLabel}
          iframeTitlePrefix={content.youtube.iframeTitlePrefix}
          urls={youtubeUrls}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <XContentSection
          id="x-highlights"
          title={content.social.title}
          subtitle={content.social.subtitle}
          description={content.social.description}
          iframeTitlePrefix={content.social.iframeTitlePrefix}
          urls={socialUrls}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <div className="[&_h2]:text-4xl [&_h2]:font-bold">
          <FaqSection
            title={content.faq.title}
            subtitle={content.faq.subtitle}
            items={content.faq.items.map((item, index) => ({
              id: `faq-${index + 1}`,
              question: item.question,
              answer: item.answer,
            }))}
          />
        </div>

        {/* <CallToActionSection
          title={content.compliance.title}
          description={content.compliance.description}
          primaryLabel={content.compliance.primaryLabel}
          secondaryLabel={content.compliance.secondaryLabel}
          primaryHref="#studio"
          secondaryHref="#faqs"
        /> */}

        <StudioPromoSection
          id="studio-promo"
          title={content.studioPromo.title}
          description={content.studioPromo.description}
          primaryLabel={content.studioPromo.primaryLabel}
          secondaryLabel={content.studioPromo.secondaryLabel}
          primaryHref="#studio"
          secondaryHref="/"
        />

        <Footer />
      </main>
    </>
  );
}
