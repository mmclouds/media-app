'use client';

import ImageToMediaShowcase from '@/components/cutomer/image-to-media-showcase';
import type { ImageToMediaExample } from '@/components/cutomer/image-to-media-showcase';
import MediaPromptShowcase from '@/components/cutomer/media-prompt-showcase';
import type { MediaPromptExample } from '@/components/cutomer/media-prompt-showcase';
import { useLocale } from 'next-intl';

type ShowcaseCopy = {
  promptShowcase: {
    title: string;
    subtitle: string;
    exampleLabel: string;
    promptSetLabel: string;
    outputPreviewLabel: string;
    items: MediaPromptExample[];
  };
  referenceShowcase: {
    title: string;
    subtitle: string;
    exampleLabel: string;
    inputLabel: string;
    outputLabel: string;
    items: ImageToMediaExample[];
  };
  frameShowcase: {
    title: string;
    subtitle: string;
    exampleLabel: string;
    inputLabel: string;
    outputLabel: string;
    items: ImageToMediaExample[];
  };
};

const CONTENT: Record<string, ShowcaseCopy> = {
  en: {
    promptShowcase: {
      title: 'Sora2 prompt-to-video examples',
      subtitle: 'Real prompts with Sora2 output previews',
      exampleLabel: 'Example',
      promptSetLabel: 'Prompt Set',
      outputPreviewLabel: 'Output Preview',
      items: [
        {
          title: 'Cyberpunk alley tracking shot',
          description:
            'Neon reflections, rain-soaked streets, and a synth-driven atmosphere.',
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
    referenceShowcase: {
      title: 'Veo3.1 reference-image-to-video',
      subtitle: 'Reference images + Veo3.1 video prompt in',
      exampleLabel: 'Example',
      inputLabel: 'Input Images',
      outputLabel: 'Output',
      items: [
        {
          title: 'Surreal macro sink surfers',
          description:
            'A hyper-realistic macro photo of miniature surfers riding waves in a rustic stone bathroom sink. An old-fashioned brass faucet runs water, creating an eternal surf sound. Surreal, whimsical, bright natural light. Audio: "Surfing? In my bathtub?"',
          prompt: [
            'A hyper-realistic macro photo of miniature surfers riding waves in a rustic stone bathroom sink. An old-fashioned brass faucet runs water, creating an eternal surf sound. Surreal, whimsical, bright natural light.',
            'Audio: "Surfing? In my bathtub?"',
          ],
          inputImages: ['/images/generated/veo3-sink-surfers-input.png'],
          output: '/images/generated/veo3-sink-surfers-output.gif',
        },
      ],
    },
    frameShowcase: {
      title: 'Veo3.1 first/last frame video control',
      subtitle: 'Define the opening and closing frame for a guided Veo3.1 video clip',
      exampleLabel: 'Example',
      inputLabel: 'First & Last Frames',
      outputLabel: 'Output',
      items: [
        {
          title: 'Ginger cat race launch',
          description:
            'First image: A high-quality photorealistic front-facing image of an orange tabby cat driving a red convertible car along the French Riviera coast. Last image: Show what happens when the car takes off from a cliff.',
          prompt: [
            'First image: A high-quality photorealistic front-facing image of an orange tabby cat driving a red convertible car along the French Riviera coast.',
            'Last image: Show what happens when the car takes off from a cliff.',
          ],
          inputImages: [
            '/images/generated/veo3-race-cat-first.jpeg',
            '/images/generated/veo3-race-cat-last.jpeg',
          ],
          output: '/images/generated/veo3-race-cat-output.gif',
        },
      ],
    },
  },
  zh: {
    promptShowcase: {
      title: 'Sora2 文生视频示例',
      subtitle: '真实提示词与 Sora2 输出预览',
      exampleLabel: '示例',
      promptSetLabel: '提示词组',
      outputPreviewLabel: '输出预览',
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
    referenceShowcase: {
      title: 'Veo3.1 参考图生成视频',
      subtitle: '参考图 + Veo3.1 提示词生成视频',
      exampleLabel: '示例',
      inputLabel: '参考图片',
      outputLabel: '输出',
      items: [
        {
          title: '超现实微缩水槽冲浪',
          description:
            '超写实微距：微型冲浪者在乡村石质水槽里乘浪。复古黄铜水龙头流水，形成持续的冲浪声。超现实、俏皮、明亮自然光。音频：“在浴缸里冲浪？”',
          prompt: [
            '超写实微距：微型冲浪者在乡村石质水槽里乘浪。复古黄铜水龙头流水，形成持续的冲浪声。超现实、俏皮、明亮自然光。',
            '音频：“在浴缸里冲浪？”',
          ],
          inputImages: ['/images/generated/veo3-sink-surfers-input.png'],
          output: '/images/generated/veo3-sink-surfers-output.gif',
        },
      ],
    },
    frameShowcase: {
      title: 'Veo3.1 首尾帧生成视频',
      subtitle: '指定首帧与尾帧，引导生成完整视频',
      exampleLabel: '示例',
      inputLabel: '首帧与尾帧',
      outputLabel: '输出',
      items: [
        {
          title: '姜黄色猫咪赛车起飞',
          description:
            '首张图：高质量写实正面图，橘色虎斑猫驾驶红色敞篷车沿法国里维埃拉海岸行驶。尾帧：展示汽车从悬崖起飞后的画面。',
          prompt: [
            '首张图：高质量写实正面图，橘色虎斑猫驾驶红色敞篷车沿法国里维埃拉海岸行驶。',
            '尾帧：展示汽车从悬崖起飞后的画面。',
          ],
          inputImages: [
            '/images/generated/veo3-race-cat-first.jpeg',
            '/images/generated/veo3-race-cat-last.jpeg',
          ],
          output: '/images/generated/veo3-race-cat-output.gif',
        },
      ],
    },
  },
};

export default function MediaShowcaseSection() {
  const locale = useLocale();
  const content = locale.startsWith('zh') ? CONTENT.zh : CONTENT.en;

  return (
    <>
      <MediaPromptShowcase
        id="sora2-examples"
        title={content.promptShowcase.title}
        subtitle={content.promptShowcase.subtitle}
        exampleLabel={content.promptShowcase.exampleLabel}
        promptSetLabel={content.promptShowcase.promptSetLabel}
        outputPreviewLabel={content.promptShowcase.outputPreviewLabel}
        items={content.promptShowcase.items}
      />

      <ImageToMediaShowcase
        id="reference-to-video"
        title={content.referenceShowcase.title}
        subtitle={content.referenceShowcase.subtitle}
        exampleLabel={content.referenceShowcase.exampleLabel}
        inputLabel={content.referenceShowcase.inputLabel}
        outputLabel={content.referenceShowcase.outputLabel}
        items={content.referenceShowcase.items}
      />

      <ImageToMediaShowcase
        id="first-last-frame"
        title={content.frameShowcase.title}
        subtitle={content.frameShowcase.subtitle}
        exampleLabel={content.frameShowcase.exampleLabel}
        inputLabel={content.frameShowcase.inputLabel}
        outputLabel={content.frameShowcase.outputLabel}
        items={content.frameShowcase.items}
      />
    </>
  );
}
