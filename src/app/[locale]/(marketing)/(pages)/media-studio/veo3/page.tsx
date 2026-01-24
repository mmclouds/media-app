import AlternatingMediaSection from '@/components/custom-blocks/alternating-media/alternating-media';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import HeroSection from '@/components/custom-blocks/hero/hero';
import StudioPromoSection from '@/components/custom-blocks/studio-promo/studio-promo';
import WorkflowStepsSection from '@/components/custom-blocks/workflow-steps/workflow-steps';
import XContentSection from '@/components/custom-blocks/x-content/x-content';
import YouTubeContentSection from '@/components/custom-blocks/youtube-content/youtube-content';
import Container from '@/components/layout/container';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';

const PAGE_CONTENT = {
  en: {
    meta: {
      title: 'Veo 3 Studio',
      description:
        'Create cinematic AI videos with Veo 3 using a focused, high-fidelity workspace built for rapid iteration.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Veo 3 Studio',
      subtitle:
        'Veo 3.1 is built for creators and commercial teams who need controllable shots, stable identity, and platform-ready shorts. Think of it as a video engine that understands director-style instructions.',
      cta: 'Start creating in the workspace below.',
      primaryLabel: 'Open studio',
      secondaryLabel: 'View capabilities',
    },
    highlights: {
      title: 'Key Highlights',
      items: [
        {
          title: 'Reference-image video for stable characters and products',
          description:
            'Lock the look with a single reference image, then expand into multi-shot sequences while keeping identity, styling, and key visual details consistent.',
        },
        {
          title: 'First & last frame control for reliable transitions',
          description:
            'Provide a starting frame and an ending frame, and Veo 3.1 generates the transition path in between, ideal for product reveals and story beats.',
        },
        {
          title: 'Director-style camera language and continuity',
          description:
            'Use shot terms like tracking, push-in, wide angle, or shallow depth of field to drive consistent multi-shot storytelling.',
        },
      ],
    },
    capabilities: {
      title: 'Core Capabilities',
      items: [
        {
          title: 'Text-to-video',
          description:
            'Describe a scene in words and generate a short video sequence.',
        },
        {
          title: 'Image-to-video',
          description:
            'Animate a still image or extend a visual reference into motion.',
        },
      ],
      note: 'Output includes synced audio when supported by the selected preset.',
    },
    workflow: {
      title: 'How It Works',
      steps: [
        {
          title: 'Input your idea',
          description: 'Write a prompt or upload a reference image.',
        },
        {
          title: 'Set parameters',
          description:
            'Pick aspect ratio, duration, and the Veo 3.1 or Veo 3.1 Fast preset.',
        },
        {
          title: 'Generate',
          description:
            'Veo renders a short video sequence aligned to your shot intent.',
        },
        {
          title: 'Refine and export',
          description: 'Iterate, remix, and export MP4 for short platforms.',
        },
      ],
    },
    useCases: {
      title: 'Use Cases',
      items: [
        'Creators: rapid social clips without filming.',
        'Product teams: quick explainer videos and demos.',
        'Educators: visualize ideas and lessons.',
        'Previs: fast storyboards for films or games.',
      ],
    },
    examples: {
      title: 'Prompt Examples',
      items: [
        {
          language: 'English',
          prompt:
            'Reference image: a sleek smartwatch on a black stand. Prompt: a slow push-in, moody rim light, glossy reflections.',
          description:
            'Keeps product identity stable while the camera moves in.',
        },
        {
          language: 'English',
          prompt:
            'First frame: a runner at the start line. Last frame: the runner crossing the finish line, camera tracking left.',
          description:
            'First/last frame control ensures the transition path.',
        },
        {
          language: 'English',
          prompt:
            'Tracking shot, wide angle, shallow depth of field, city neon at night.',
          description:
            'Camera language guides motion and lens feel consistently.',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Common questions about Veo 3 generation.',
      items: [
        {
          question: 'What inputs does Veo 3 support?',
          answer: 'Use text prompts, reference images, and first/last frames.',
        },
        {
          question: 'Can I control style and duration?',
          answer:
            'Yes. Use prompts plus aspect ratio, quality, and duration settings.',
        },
        {
          question: 'How long are the outputs?',
          answer:
            'Clip length depends on the selected preset and plan limits.',
        },
        {
          question: 'Can I export videos?',
          answer: 'Yes. Download your results as MP4 files.',
        },
      ],
    },
    community: {
      title: 'Community Highlights',
      items: [
        {
          title: 'Veo 3 demos',
          description: 'Creator showcases of cinematic AI videos.',
        },
        {
          title: 'Prompt breakdowns',
          description: 'Real workflows and prompt engineering tips.',
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
      subtitle: 'Community takes on Veo 3',
      description: 'See how creators describe prompts and results.',
      iframeTitlePrefix: 'X post preview',
    },
    youtube: {
      title: 'YouTube Highlights',
      subtitle: 'Veo 3 in action',
      description: 'Watch creator demos, breakdowns, and workflows.',
      prevLabel: 'Scroll to previous videos',
      nextLabel: 'Scroll to next videos',
      iframeTitlePrefix: 'YouTube video',
    },
    studioPromo: {
      title: 'VLook.ai Studio: Fast AI video creation for teams',
      description:
        'Create high-fidelity clips with VLook.ai. Prompt, refine, and publish in minutes.',
      primaryLabel: 'Open VLook.ai Studio',
      secondaryLabel: 'Explore VLook.ai',
    },
    immersiveStudio: {
      label: 'Start immersive studio',
    },
  },
  zh: {
    meta: {
      title: 'Veo 3 工作室',
      description:
        'Veo 3.1 面向内容创作者与商业团队打造，可提供更强可控性、更稳定的一致性与适配短视频平台的输出形态。',
    },
    hero: {
      eyebrow: 'AI 视频生成',
      title: 'Veo 3 工作室',
      subtitle:
        'Veo 3.1 面向创作者与商业团队打造，强调可控镜头、稳定人设与平台可用的短视频输出，更像一台“能听懂导演指令”的视频生产引擎。',
      cta: '在下方工作区开始创作。',
      primaryLabel: '进入工作室',
      secondaryLabel: '查看能力',
    },
    highlights: {
      title: '关键亮点',
      items: [
        {
          title: '参考图视频生成，角色与产品更稳定',
          description:
            '用一张参考图锁定角色、产品或场景外观，再扩展成多镜头序列，保持身份、风格与关键细节一致。',
        },
        {
          title: '首尾帧控制，过渡更可靠',
          description:
            '提供首帧与尾帧，模型自动补全中间过渡路径，特别适合产品转场与叙事节奏推进。',
        },
        {
          title: '镜头语言可控，连续性更强',
          description:
            '支持跟拍、推进、广角、浅景深等镜头语言，帮助多镜头叙事保持风格与连贯性。',
        },
      ],
    },
    capabilities: {
      title: '核心能力',
      items: [
        {
          title: '文本生成视频',
          description: '用文字描述场景，生成短视频序列。',
        },
        {
          title: '图片生成视频',
          description: '让静态图像动起来，或扩展为连贯动作。',
        },
      ],
      note: '部分预设支持同步音频输出。',
    },
    workflow: {
      title: '工作流程',
      steps: [
        {
          title: '输入创意',
          description: '输入提示词或上传参考图。',
        },
        {
          title: '设置参数',
          description:
            '选择比例、时长，并决定使用 Veo 3.1 或 Veo 3.1 Fast。',
        },
        {
          title: '生成视频',
          description:
            '模型按你的镜头意图生成短视频序列。',
        },
        {
          title: '润色与导出',
          description: '迭代、重混并导出适配短视频平台的 MP4。',
        },
      ],
    },
    useCases: {
      title: '使用场景',
      items: [
        '创作者：快速生成社媒短片。',
        '产品团队：高效制作演示与讲解视频。',
        '教育场景：把概念与课程可视化。',
        '预演与分镜：影视与游戏的快速可视化。',
      ],
    },
    examples: {
      title: '提示词示例',
      items: [
        {
          language: '中文',
          prompt:
            '参考图：黑色支架上的智能手表。提示词：慢速推进，边缘冷光，高光反射。',
          description:
            '在镜头推进时保持产品外观一致。',
        },
        {
          language: '中文',
          prompt:
            '首帧：起跑线的跑者。尾帧：跑者冲线，镜头向左跟拍。',
          description:
            '首尾帧控制确保过渡路径准确。',
        },
        {
          language: '中文',
          prompt:
            '跟拍镜头、广角、浅景深、夜晚霓虹城市。',
          description:
            '镜头语言驱动运动与镜头质感统一。',
        },
      ],
    },
    faq: {
      title: '常见问题',
      subtitle: '关于 Veo 3 生成的常见疑问。',
      items: [
        {
          question: 'Veo 3 支持哪些输入？',
          answer: '支持文本提示词、参考图，以及首尾帧输入。',
        },
        {
          question: '可以控制风格和时长吗？',
          answer: '可以，通过提示词与比例、清晰度、时长等设置控制。',
        },
        {
          question: '输出视频能多长？',
          answer: '时长取决于所选预设与套餐限制。',
        },
        {
          question: '可以导出视频吗？',
          answer: '可以，支持导出 MP4 文件。',
        },
      ],
    },
    community: {
      title: '社区亮点',
      items: [
        {
          title: 'Veo 3 演示',
          description: '创作者分享的电影感 AI 视频案例。',
        },
        {
          title: '提示词拆解',
          description: '真实工作流与提示词拆解技巧。',
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
      subtitle: '社区最新的 Veo 3 观点',
      description: '看看创作者如何描述提示词与生成结果。',
      iframeTitlePrefix: 'X 帖子预览',
    },
    youtube: {
      title: 'YouTube 精选内容',
      subtitle: 'Veo 3 实战演示',
      description: '观看创作者演示、拆解与工作流。',
      prevLabel: '查看上一组视频',
      nextLabel: '查看下一组视频',
      iframeTitlePrefix: 'YouTube 视频',
    },
    studioPromo: {
      title: 'VLook.ai 工作室：团队级 AI 视频高效创作',
      description:
        '使用 VLook.ai 快速生成高质量短片：输入提示词、微调细节、分钟级发布。',
      primaryLabel: '打开 VLook.ai 工作室',
      secondaryLabel: '了解 VLook.ai',
    },
    immersiveStudio: {
      label: '开始沉浸式工作室',
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
    pathname: '/media-studio/veo3',
  });
}

interface Veo3StudioPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Veo3StudioPage(props: Veo3StudioPageProps) {
  const params = await props.params;
  const content =
    PAGE_CONTENT[params.locale as keyof typeof PAGE_CONTENT] ?? PAGE_CONTENT.en;

  const socialUrls: string[] = [];
  const youtubeUrls: string[] = [];
  const highlightItems = [
    {
      title: content.highlights.items[0]?.title,
      description: content.highlights.items[0]?.description,
      image: {
        src: '/images/generated/kitten-dreamy-20260123-001.jpg',
        alt: 'Cinematic motion preview',
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
        alt: 'High-fidelity lighting preview',
        width: 1207,
        height: 929,
        className: 'scale-95',
      },
    },
    {
      title: content.highlights.items[2]?.title,
      description: content.highlights.items[2]?.description,
      image: {
        src: '/images/generated/sora2-multishot-continuity-20260123-003.jpg',
        alt: 'Multi-shot continuity preview',
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
                preferredModelId="veo3"
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
