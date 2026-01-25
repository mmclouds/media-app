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
import MediaPromptShowcase from '@/components/cutomer/media-prompt-showcase';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';

const PAGE_CONTENT = {
  en: {
    meta: {
      title: 'Veo 3 Studio',
      description:
        'Create 8-second, high-fidelity Veo 3.1 videos with native audio and flexible formats including 720p, 1080p, and 4k.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Google Veo 3 AI Video Generator',
      subtitle:
        'Veo 3.1 delivers 8-second, high-fidelity video in 720p, 1080p, or 4k with native audio. It supports vertical 9:16, first/last frame control, video extension, and multi-image guidance for dependable, director-style shots.',
      cta: 'Start creating in the workspace below.',
      primaryLabel: 'Open studio',
      secondaryLabel: 'View capabilities',
    },
    highlights: {
      title: 'Key Highlights',
      items: [
        {
          title: 'Native audio from a single prompt: dialogue, SFX, ambience',
          description:
            'Describe dialogue in quotes, call out SFX events like tire screeches or engine roars, and paint ambience such as low hum, wind, or birds. Veo 3 understands the details and generates a synchronized soundtrack.',
        },
        {
          title: 'First/last frame control for shot-to-shot storytelling',
          description:
            'Veo 3.1 lets you define the first and last frame to guide transitions, lock disappearance/appearance beats, and pin opening/closing shots for ads or storyboards.',
        },
        {
          title: 'Reference images for consistent subjects (up to three)',
          description:
            'Veo 3.1 supports up to three clear reference images to keep people, characters, or products visually consistent across outputs.',
        },
        {
          title: 'Aspect ratio + resolution control: 16:9 or 9:16, 720p–4K',
          description:
            'Choose 16:9 (default) or 9:16 for Reels/Shorts/TikTok, and generate 720p, 1080p, or 4K. Higher resolutions add latency and cost more.',
        },
      ],
    },
    capabilities: {
      title: 'Core Capabilities',
      items: [
        {
          title: 'Text-to-video',
          description: 'Generate high-fidelity 8-second clips from prompts.',
        },
        {
          title: 'Image guidance',
          description:
            'Guide generation with up to three reference images for consistency.',
        },
        {
          title: 'First/last frame control',
          description: 'Specify a start or end frame to lock key beats.',
        },
        {
          title: 'Vertical video',
          description: 'Choose 16:9 or 9:16 output for platform fit.',
        },
      ],
      note: 'Output includes native audio and supports 720p, 1080p, or 4k.',
    },
    workflow: {
      title: 'How It Works',
      steps: [
        {
          title: 'Input your idea',
          description:
            'Write a prompt and optionally add reference images or frames.',
        },
        {
          title: 'Set parameters',
          description:
            'Choose 16:9 or 9:16, resolution, and the Veo 3.1 preset.',
        },
        {
          title: 'Generate',
          description:
            'Veo renders an 8-second clip aligned to your shot intent.',
        },
        {
          title: 'Refine and export',
          description: 'Extend, remix, and export MP4 for short platforms.',
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
            'Use 3 reference images of a sneaker. Prompt: slow tracking shot, glossy studio lighting, macro detail.',
          description:
            'Keeps product identity stable across multi-shot sequences.',
        },
        {
          language: 'English',
          prompt:
            'First frame: a perfume bottle on a pedestal. Last frame: the bottle in a hand, vertical 9:16.',
          description:
            'First/last frame control locks the transition beats.',
        },
        {
          language: 'English',
          prompt:
            'Prompt: cinematic dialogue with synchronized ambient audio.',
          description:
            'Native audio adds realism for storytelling clips.',
        },
      ],
    },
    mediaShowcase: {
      title: 'Prompt to Visual Outputs',
      subtitle: 'Real prompts paired with image/video previews',
      items: [
        {
          title: 'Product cinematic sweep',
          description:
            'Use multi-shot guidance to keep lighting and texture consistent across angles.',
          prompts: [
            'Slow dolly-in on a matte-black sneaker, glossy studio lighting, macro texture detail.',
            'Cut to a top-down shot, soft bounce light, crisp edge highlights.',
          ],
          output: '/images/generated/kitten-dreamy-20260123-001.jpg',
        },
        {
          title: 'Vertical story beat with sound',
          description:
            'Combine first/last frame control with ambient audio cues for social-ready clips.',
          prompts: [
            'First frame: perfume bottle on a pedestal, 9:16 vertical, soft haze.',
            'Last frame: bottle held in hand, warm rim light, quiet room tone.',
          ],
          output:
            'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Common questions about Veo 3 generation.',
      items: [
        {
          question: 'What inputs does Veo 3 support?',
          answer:
            'Use text prompts, up to three reference images, and first/last frames.',
        },
        {
          question: 'Does it support vertical video?',
          answer: 'Yes, choose 16:9 or vertical 9:16 outputs.',
        },
        {
          question: 'What resolutions are available?',
          answer: 'Veo 3.1 supports 720p, 1080p, and 4k.',
        },
        {
          question: 'Can I extend a generated video?',
          answer:
            'Yes, you can extend a previously generated video for longer edits.',
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
        'Veo 3.1 可生成 8 秒高保真视频，支持 720p、1080p、4k 与原生音频输出。',
    },
    hero: {
      eyebrow: 'AI 视频生成',
      title: 'Google Veo 3 AI Video Generator',
      subtitle:
        'Veo 3.1 支持 8 秒 720p/1080p/4k 高保真视频与原生音频，同时提供 9:16 竖屏、首尾帧控制、视频扩展与多图参考，让镜头更可控。',
      cta: '在下方工作区开始创作。',
      primaryLabel: '进入工作室',
      secondaryLabel: '查看能力',
    },
    highlights: {
      title: '关键亮点',
      items: [
        {
          title: '原生音频：对话 / SFX / 环境声一条提示生成',
          description:
            'Veo 3 支持在提示词中直接描述音频：对话用引号写台词，音效（SFX）明确描述声音事件（如轮胎尖叫、引擎轰鸣），环境声描述声景氛围（如低频嗡鸣、风声、鸟鸣），模型会理解细节并生成同步音轨。',
        },
        {
          title: '首尾帧能力（First/Last Frame）：用“起始+结束”锁定镜头叙事',
          description:
            'Veo 3.1 支持通过指定第一帧与最后一帧来生成视频（仅适用于 Veo 3.1）。适合让镜头从 A 场景自然过渡到 B 场景，控制消失/出现/变形等关键结尾画面，并固定广告或剧情分镜的开头与收尾。',
        },
        {
          title: '参考图视频生成（Reference Images）：最多 3 张清晰参考图保持主体一致',
          description:
            'Veo 3.1 现支持最多 3 张参考图片（人物/角色/产品均可），用来指导生成并在输出中保留主体外观一致性。',
        },
        {
          title: '画幅与分辨率可控：横屏/竖屏 + 720p/1080p/4K',
          description:
            '画幅支持 16:9（默认）与 9:16，适配 Reels / Shorts / TikTok 等竖屏场景；分辨率可选 720p、1080p 或 4K，分辨率越高延迟越长且 4K 价格更高。',
        },
      ],
    },
    capabilities: {
      title: '核心能力',
      items: [
        {
          title: '文本生成视频',
          description: '用提示词生成 8 秒高保真短片。',
        },
        {
          title: '参考图引导',
          description: '最多三张参考图，保持风格与主体一致。',
        },
        {
          title: '首尾帧控制',
          description: '指定起始或结束画面，锁定关键镜头。',
        },
        {
          title: '竖屏输出',
          description: '支持 16:9 或 9:16，适配不同平台。',
        },
      ],
      note: '支持原生音频与 720p/1080p/4k 输出。',
    },
    workflow: {
      title: '工作流程',
      steps: [
        {
          title: '输入创意',
          description: '输入提示词，可选参考图或首尾帧。',
        },
        {
          title: '设置参数',
          description:
            '选择 16:9 或 9:16、分辨率与 Veo 3.1 预设。',
        },
        {
          title: '生成视频',
          description:
            '模型输出 8 秒短视频并保持镜头意图一致。',
        },
        {
          title: '润色与导出',
          description: '扩展、重混并导出适配平台的 MP4。',
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
            '参考图（3 张）：同款运动鞋。提示词：缓慢跟拍，棚拍柔光，细节特写。',
          description:
            '多参考图保持产品一致性。',
        },
        {
          language: '中文',
          prompt:
            '首帧：香水瓶在台座。尾帧：手持香水瓶，9:16 竖屏。',
          description:
            '首尾帧控制锁定关键过渡。',
        },
        {
          language: '中文',
          prompt:
            '提示词：电影感对白场景，带同步环境音。',
          description:
            '原生音频让叙事更完整。',
        },
      ],
    },
    mediaShowcase: {
      title: '提示词到视觉输出',
      subtitle: '真实提示词与图片/视频预览配对展示',
      items: [
        {
          title: '产品质感镜头',
          description: '多镜头提示让材质与光线在不同角度保持一致。',
          prompts: [
            '慢速推进镜头：哑光黑色球鞋，棚拍硬光，突出材质细节。',
            '切换俯拍：柔和反射光，边缘高光清晰。',
          ],
          output: '/images/generated/kitten-dreamy-20260123-001.jpg',
        },
        {
          title: '竖屏故事节奏',
          description: '首尾帧控制结合环境音，适合短视频发布。',
          prompts: [
            '首帧：香水瓶在台座上，9:16 竖屏，轻雾氛围。',
            '尾帧：手持香水瓶，暖色轮廓光，室内安静环境音。',
          ],
          output:
            'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        },
      ],
    },
    faq: {
      title: '常见问题',
      subtitle: '关于 Veo 3 生成的常见疑问。',
      items: [
        {
          question: 'Veo 3 支持哪些输入？',
          answer:
            '支持文本提示词、最多三张参考图，以及首尾帧输入。',
        },
        {
          question: '支持竖屏输出吗？',
          answer: '支持，可选择 16:9 或 9:16。',
        },
        {
          question: '支持哪些分辨率？',
          answer: '支持 720p、1080p 与 4k。',
        },
        {
          question: '可以扩展已生成的视频吗？',
          answer: '可以，对已有视频进行扩展生成。',
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
    {
      title: content.highlights.items[3]?.title,
      description: content.highlights.items[3]?.description,
      image: {
        src: '/images/generated/sora2-physics-realism-20260123-002.jpg',
        alt: 'Resolution and aspect ratio preview',
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

        <MediaPromptShowcase
          id="prompt-examples"
          title={content.mediaShowcase.title}
          subtitle={content.mediaShowcase.subtitle}
          items={content.mediaShowcase.items}
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
