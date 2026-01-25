'use client';

import MediaPromptShowcase from '@/components/cutomer/media-prompt-showcase';
import type { MediaPromptExample } from '@/components/cutomer/media-prompt-showcase';
import { useLocale } from 'next-intl';

type ShowcaseCopy = {
  title: string;
  subtitle: string;
  items: MediaPromptExample[];
};

const CONTENT: Record<string, ShowcaseCopy> = {
  en: {
    title: 'Sora2 prompt-to-video examples',
    subtitle: 'Real prompts with Sora2 output previews',
    items: [
      {
        title: 'Cyberpunk alley tracking shot',
        description: 'Neon reflections, rain-soaked streets, and a synth-driven atmosphere.',
        prompts: [
          'A cyberpunk teaser: rain trickles off neon signs, wet alleyways mirror vibrant colours, and a low tracking shot glides through steam-filled passages while a pulsing synth score swells.',
        ],
        output: 'https://media.vlook.ai/media/download/0/public/sora2.mp4',
      },
      {
        title: 'Neon Times Square panda',
        description: 'Wild breakdance energy with fast, social-style camera cuts.',
        prompts: [
          'In neon-lit Times Square at night, a panda in sunglasses breakdances wildly as cheering crowds and flashing billboards surround it. The camera weaves through the scene with TikTok-style quick cuts and spinning close-ups.',
        ],
        output: 'https://media.vlook.ai/media/download/0/public/sora2-2.mp4',
      },
    ],
  },
  zh: {
    title: 'Sora2 文生视频示例',
    subtitle: '真实提示词与 Sora2 输出预览',
    items: [
      {
        title: '赛博朋克巷道跟拍',
        description: '霓虹倒影、雨湿街巷与合成器氛围。',
        prompts: [
          '赛博朋克预告：雨水从霓虹灯牌滑落，潮湿的小巷映出鲜艳色彩，低机位跟拍穿行在蒸汽弥漫的通道中，脉动的合成器配乐逐渐推高。',
        ],
        output: 'https://media.vlook.ai/media/download/0/public/sora2.mp4',
      },
      {
        title: '霓虹时代广场熊猫',
        description: '疯狂霹雳舞，社交短视频风格的快切镜头。',
        prompts: [
          '夜晚的霓虹时代广场，一只戴墨镜的熊猫疯狂跳霹雳舞，周围是欢呼的人群和闪烁的广告牌。镜头在场景中穿梭，带有 TikTok 风格的快速剪辑与旋转特写。',
        ],
        output: 'https://media.vlook.ai/media/download/0/public/sora2-2.mp4',
      },
    ],
  },
};

export default function MediaShowcaseSection() {
  const locale = useLocale();
  const content = locale.startsWith('zh') ? CONTENT.zh : CONTENT.en;

  return (
    <MediaPromptShowcase
      id="sora2-examples"
      title={content.title}
      subtitle={content.subtitle}
      items={content.items}
    />
  );
}
