import CallToActionSection from '@/components/custom-blocks/calltoaction/calltoaction';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import Features3Section from '@/components/custom-blocks/features3/features3';
import HeroSection from '@/components/custom-blocks/hero/hero';
import AlternatingMediaSection from '@/components/custom-blocks/alternating-media/alternating-media';
import XContentSection from '@/components/custom-blocks/x-content/x-content';
import Container from '@/components/layout/container';
import { Navbar } from '@/components/layout/navbar';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import { constructMetadata } from '@/lib/metadata';
import {
  Download,
  Film,
  GraduationCap,
  Languages,
  Megaphone,
  PencilLine,
  Share2,
  Sliders,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

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
        'Turn text or images into cinematic short videos with improved physical realism, continuity, and sound. Sora 2 (2025) upgrades physical understanding, visual fidelity, and controllability for multi-shot storytelling.',
      cta: 'Start creating in the workspace below.',
      primaryLabel: 'Open studio',
      secondaryLabel: 'View capabilities',
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
      note: 'Generated videos include synchronized audio such as ambience, music, and simple dialogue.',
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
      primaryLabel: 'Back to studio',
      secondaryLabel: 'View FAQ',
    },
    social: {
      title: 'X Highlights',
      subtitle: 'Latest community takes on Sora 2',
      description: 'See how creators describe prompts and results in the wild.',
    },
  },
  zh: {
    meta: {
      title: 'Sora 2 Studio',
      description:
        '使用 OpenAI Sora 2 生成电影感 AI 视频，物理真实感更强、清晰度更高，并支持多场景控制。',
    },
    hero: {
      eyebrow: 'AI 视频生成',
      title: 'Sora 2 Studio',
      subtitle:
        '将文本或图片转化为电影感短视频，具备更强的物理真实感与连贯性。Sora 2（2025）在物理理解、画面清晰度与多镜头可控性上进一步升级。',
      cta: '在下方工作区开始创作。',
      primaryLabel: '进入工作室',
      secondaryLabel: '查看能力',
    },
    highlights: {
      title: '核心亮点',
      items: [
        {
          title: '物理一致的运动',
          description: '更真实的因果运动表现，如弹跳与惯性。',
        },
        {
          title: '更高保真与音效',
          description: '更清晰的光影与材质，并同步环境音、效果与对白。',
        },
        {
          title: '更强可控性',
          description: '支持多镜头提示词，跨镜头保持画面一致。',
        },
        {
          title: '角色注入',
          description: '将真人融入生成场景，保持稳定外观。',
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
      note: '生成视频包含同步音频，如环境声、音乐与简单对白。',
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
          description: '选择比例、清晰度、时长与变体数量。',
        },
        {
          title: '生成视频',
          description: 'Sora 在数秒到数分钟内输出带音频的短片。',
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
          answer: '是的，Sora 2 会同步生成环境声、音乐与基础对白。',
        },
        {
          question: '视频最长能生成多长？',
          answer: '长度受套餐限制，通常在 10-60 秒范围内。',
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
      title: 'X Highlights',
      subtitle: 'Latest community takes on Sora 2',
      description: 'See how creators describe prompts and results in the wild.',
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

  const workflowIcons = [
    <PencilLine key="workflow-1" className={iconClassName} />,
    <Sliders key="workflow-2" className={iconClassName} />,
    <Wand2 key="workflow-3" className={iconClassName} />,
    <Download key="workflow-4" className={iconClassName} />,
  ];

  const useCaseIcons = [
    <Users key="usecase-1" className={iconClassName} />,
    <GraduationCap key="usecase-2" className={iconClassName} />,
    <Megaphone key="usecase-3" className={iconClassName} />,
    <Film key="usecase-4" className={iconClassName} />,
  ];

  const communityIcons = [
    <Share2 key="community-1" className={iconClassName} />,
    <Sparkles key="community-2" className={iconClassName} />,
  ];
  const socialUrls = [
    'https://x.com/slow_developer/status/1973079395863548172',
    'https://x.com/AngryTomtweets/status/1975499455035220353',
    'https://x.com/azed_ai/status/1983488326708727882',
    'https://x.com/levelsio/status/1975505972765323447',
    'https://x.com/Raindropsmedia1/status/1974484908639691142',
    'https://x.com/goth600/status/1973424740133179667',
    'https://x.com/gabriel1/status/1973071380842229781',
  ];
  const highlightItems = [
    {
      title: content.highlights.items[0]?.title,
      description: content.highlights.items[0]?.description,
      image: {
        src: '/blocks/ai-models-integration.png',
        alt: 'Physics-consistent motion preview',
        width: 1207,
        height: 929,
        priority: true,
      },
    },
    {
      title: content.highlights.items[1]?.title,
      description: content.highlights.items[1]?.description,
      image: {
        src: '/blocks/pricing-free-trial.png',
        alt: 'Higher fidelity with sound preview',
        width: 1207,
        height: 929,
      },
    },
    {
      title: content.highlights.items[2]?.title,
      description: content.highlights.items[2]?.description,
      image: {
        src: '/blocks/fast-smooth-experience.png',
        alt: 'Stronger control preview',
        width: 1207,
        height: 929,
      },
    },
    {
      title: content.highlights.items[3]?.title,
      description: content.highlights.items[3]?.description,
      image: {
        src: '/blocks/multimodal-generation.png',
        alt: 'Character injection preview',
        width: 1207,
        height: 929,
      },
    },
  ];
  const capabilityItems = [
    {
      title: content.capabilities.items[0]?.title,
      description: content.capabilities.items[0]?.description,
      image: {
        src: '/blocks/multimodal-generation.png',
        alt: 'Text-to-video generation preview',
        width: 1207,
        height: 929,
        priority: true,
      },
    },
    {
      title: content.capabilities.items[1]?.title,
      description: content.capabilities.items[1]?.description,
      image: {
        src: '/blocks/fast-smooth-experience.png',
        alt: 'Image-to-video generation preview',
        width: 1207,
        height: 929,
      },
    },
  ];

  return (
    <>
      <Navbar scroll={true} />
      <main className="bg-background text-foreground">
        <HeroSection
          eyebrow={content.hero.eyebrow}
          title={content.hero.title}
          description={content.hero.subtitle}
          cta={content.hero.cta}
          primaryLabel={content.hero.primaryLabel}
          secondaryLabel={content.hero.secondaryLabel}
          primaryHref="#studio"
          secondaryHref="#capabilities"
        />

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
          </Container>
        </section>

        <AlternatingMediaSection
          id="highlights"
          title={content.highlights.title}
          items={highlightItems}
        />

        <AlternatingMediaSection
          id="capabilities"
          title={content.capabilities.title}
          description={content.capabilities.note}
          items={capabilityItems}
        />

        <Features3Section
          id="workflow"
          title={content.workflow.title}
          subtitle={null}
          description={null}
          items={content.workflow.steps.map((step, index) => ({
            title: step.title,
            description: step.description,
            icon: workflowIcons[index] ?? workflowIcons[0],
          }))}
        />

        <Features3Section
          id="use-cases"
          title={content.useCases.title}
          subtitle={null}
          description={null}
          items={content.useCases.items.map((item, index) => ({
            title: item,
            description: null,
            icon: useCaseIcons[index] ?? useCaseIcons[0],
          }))}
        />

        <Features3Section
          id="examples"
          title={content.examples.title}
          subtitle={null}
          description={null}
          items={content.examples.items.map((item) => ({
            title: item.language,
            description: (
              <>
                <span className="block text-foreground font-semibold">
                  {item.prompt}
                </span>
                <span className="mt-2 block text-muted-foreground">
                  {item.description}
                </span>
              </>
            ),
            icon: <Languages className={iconClassName} />,
          }))}
        />

        <XContentSection
          id="x-highlights"
          title={content.social.title}
          subtitle={content.social.subtitle}
          description={content.social.description}
          urls={socialUrls}
        />

        <FaqSection
          title={content.faq.title}
          subtitle={content.faq.subtitle}
          items={content.faq.items.map((item, index) => ({
            id: `faq-${index + 1}`,
            question: item.question,
            answer: item.answer,
          }))}
        />

        <Features3Section
          id="community"
          title={content.community.title}
          subtitle={null}
          description={null}
          items={content.community.items.map((item, index) => ({
            title: item.title,
            description: item.description,
            icon: communityIcons[index] ?? communityIcons[0],
          }))}
        />

        <CallToActionSection
          title={content.compliance.title}
          description={content.compliance.description}
          primaryLabel={content.compliance.primaryLabel}
          secondaryLabel={content.compliance.secondaryLabel}
          primaryHref="#studio"
          secondaryHref="#faqs"
        />
      </main>
    </>
  );
}
