import { CapabilitiesCardsSection } from '@/components/custom-blocks/capabilities-cards/capabilities-cards';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import HeroSection from '@/components/custom-blocks/hero/hero';
import StudioPromoSection from '@/components/custom-blocks/studio-promo/studio-promo';
import WorkflowStepsSection from '@/components/custom-blocks/workflow-steps/workflow-steps';
import ImageToMediaShowcase from '@/components/cutomer/image-to-media-showcase';
import type { ImageToMediaExample } from '@/components/cutomer/image-to-media-showcase';
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
      title: 'Kling 3.0 AI video generator',
      description:
        'Create cinematic 3-15s videos with Kling 3.0. Multi-shot direction, stronger subject consistency, native character-aware audio, and precise text rendering in one workflow.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Kling 3.0 AI video generator',
      subtitle:
        'Direct richer stories in one generation with multi-shot scene control, stronger reference consistency, native audio with speaker targeting, and native-level text rendering.',
      cta: 'Start creating in the workspace below.',
      primaryLabel: 'Open studio',
      secondaryLabel: 'View highlights',
    },
    highlights: {
      eyebrow: 'Key highlights',
      title: 'Key Highlights',
      description:
        'From cinematic shot planning to multilingual audio and precise lettering, Kling 3.0 is built for end-to-end visual storytelling.',
      cardLabel: 'Highlight',
      brandLabel: 'Kling 3.0',
      items: [
        {
          title: 'Multi-Shot: AI Director onboard, one-click cinematic output',
          description:
            'Describe shot coverage in one prompt and let Kling 3.0 automatically coordinate camera angles, compositions, and transitions for coherent cinematic flow.',
        },
        {
          title: 'World-first image-to-video with enhanced subject consistency',
          description:
            'Use multi-image references and element-level grounding to keep characters, objects, and environments stable as camera movement and scene progression evolve.',
        },
        {
          title:
            'Upgraded native audio with character referencing and more languages',
          description:
            'Assign speaking lines to specific characters, support multilingual dialogue and accents, and keep lip movement and expressions synchronized naturally.',
        },
        {
          title: 'Native-level text output with precise lettering',
          description:
            'Preserve or generate clear in-scene text, including packaging, captions, and signage, with structured layouts suitable for high-fidelity commercial content.',
        },
      ],
    },
    workflow: {
      title: 'How It Works',
      steps: [
        {
          title: 'Describe your scene',
          description:
            'Write a cinematic prompt with shot intent, dialogue, and motion.',
        },
        {
          title: 'Attach references',
          description:
            'Add one or more image/video elements to anchor subjects and style.',
        },
        {
          title: 'Set timing and language',
          description:
            'Choose 3-15s duration and configure multilingual native audio if needed.',
        },
        {
          title: 'Generate and iterate',
          description:
            'Render once, review pacing and continuity, then refine key beats.',
        },
      ],
    },
    multiShotShowcase: {
      title: 'Multi-Shot',
      subtitle: 'AI Director Onboard, One-Click Cinematic Output',
      inputLabel: 'Image URLs',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Villa Terrace Shot-Reverse Dialogue',
          description:
            "Prompt: Cinematic shot on a European villa's outdoor terrace. A young Caucasian woman in a blue and white striped short-sleeved shirt, khaki shorts with a brown belt, sits barefoot at a table with a blue-and-white checkered tablecloth. Opposite her sits a young Caucasian man in a white T-shirt. The camera slowly pushes in. The woman swirls juice in her glass, gazing at the distant woods, and says, “These trees will turn yellow in a month.” Close-up on the man as he lowers his head and whispers, “But they'll be green again next summer.” The woman then turns her head, smiling at him, and asks, “Are you always this optimistic?” The man looks up into her eyes and replies, “Only about summers with you.” High-quality, 4k, realistic textures, natural sunlight, emotional atmosphere.",
          prompt:
            "Cinematic shot on a European villa's outdoor terrace with shot-reverse-shot dialogue and emotional pacing.",
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770210949417_x41dja.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770210919472_j4m945.mp4',
        },
        {
          title: 'Orbiting Portrait with Warm Reunion Smile',
          description:
            'Prompt: The camera gradually orbits to the front of the girl, then she lifts her head, smiling warmly toward the camera as if seeing an old friend after many years.',
          prompt:
            'Orbit camera movement with natural expression transition and multi-reference consistency.',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211265229_b8ta0x.jpg',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211168009_dlazly.png',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211168011_9pju78.png',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211168012_tuqlyp.png',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211225176_74uzl2.mp4',
        },
      ],
    },
    nativeAudioShowcase: {
      title: 'Upgraded Native Audio Output',
      subtitle: 'Character Referencing & More Languages',
      inputLabel: 'Image URLs',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Family Living Room Multi-Speaker Dialogue',
          description:
            "Prompt: Indoor home environment with a subtle background hum of a living room air conditioner for realistic daily life; the mother exclaims softly with a tone of surprise, “Wow, I didn't expect this plot at all.”; the father responds in a low, flat voice, “Yeah, it's totally unexpected, never thought that would happen.”; the boy says cheerfully, “It's the best twist ever!”; the girl nods excitedly, “I can't believe they did that!”",
          prompt:
            'Multi-character dialogue with speaker targeting and household ambient sound.',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211317936_quj6rs.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211314559_1lz1nj.mp4',
        },
        {
          title: 'Korean Rooftop Night Conversation',
          description:
            'Prompt: Korean high school rooftop scene with distant city lights and subtle wind sounds in the background while stars twinkle in the night sky; the female lead leans against the railing dazing as the male lead approaches with two cans of cola and hands one to her, which she takes and opens; the male lead says in a relaxed tone, “숙제 다 했어? 왜 여기 있어?”; the female lead sighs and says, “시험이 너무 무서워.”; the male lead says gently, “걱정 마, 넌 잘할 거야.”',
          prompt:
            'Korean dialogue performance with ambient rooftop atmosphere and emotional timing.',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770191657884_766eiq.jpeg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770196418822_ourx0z.mp4',
        },
        {
          title: 'Madrid Street Bilingual Wayfinding Scene',
          description:
            'Prompt: Sunlight floods an old street in Madrid in front of a bakery where a female Chinese tourist and a male in a grey hoodie walk toward the clerk with polite smiles; the female tourist asks at a slightly slow pace with a clumsy accent in Spanish, “Disculpe, ¿dónde está la plaza mayor?”; the white-haired Spanish clerk turns slightly and points forward, saying in a lighthearted tone in Spanish, “Por allí, a dos calles. Muy cerca.”; the female tourist nods in gratitude and the male tourist also nods and adds in Spanish, “Muchas gracias.”; the clerk nods back with a smile as the two turn and walk towards the indicated direction.',
          prompt:
            'Multilingual Spanish dialogue with accent styling and natural street interaction.',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211365511_9av6ju.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211378159_vb2qio.mp4',
        },
      ],
    },
    textOutputShowcase: {
      title: 'Native-Level Text Output',
      subtitle: 'Precise Lettering Capabilities',
      inputLabel: 'Image URLs',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Paris Perfume Film with Golden Lettering',
          description:
            'Prompt: Parisian apartment window scene with soft French piano BGM in the background as afternoon golden sunlight filters through blinds onto a perfume bottle, creating dappled light and shadows; the camera slowly pushes from scattered rose petals to focus on the facets of the Kling perfume bottle with a voiceover (languid French female voice, British accent, slow pace): “Bathe in the golden hour.”; the camera slowly orbits the bottle, capturing the golden lettering and the flow of light and shadow on the glass with a voiceover: “Kling, a whisper of Parisian elegance.”; the camera pulls back to a wide shot of the full scene with the perfume bottle standing on a velvet pedestal and Parisian architecture faintly visible through the window as the voiceover concludes: “Wrap yourself in luxury with every breath.”',
          prompt:
            'Product storytelling with clear lettering, controlled camera motion, and polished voiceover.',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211450832_feisx9.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211415228_mhabei.mp4',
        },
      ],
    },
    elementReferenceShowcase: {
      title: 'Element Building',
      subtitle: 'Video Character Reference for Visual and Audio Consistency',
      inputLabel: 'Element References',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Lipstick Liquid Reveal with Logo Morph',
          description:
            'Prompt: Pure black background where a river of color matching the @kling lipstick bullet flows out of the darkness, leaving a saturated and flawless trail; subsequently, the trail comes alive like a liquid river, spreading and bleeding elegantly across the surface to form the pattern of @logo; then the liquid color converges into the actual bullet of the @kling lipstick placed on a water surface; the lipstick is surrounded by delicate water and flower buds, where the flowers slowly bloom as subtle ripples spread across the water surface.',
          prompt:
            'Element-driven product reveal with logo transformation and stable brand asset continuity.',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211564487_5f8ph3.jpg',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211681004_ej599z.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211666699_173y81.mp4',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Common questions about Kling 3.0 generation.',
      items: [
        {
          question: 'What is Kling 3.0?',
          answer:
            "Kling 3.0 is Kling AI's latest video generation model with multi-shot directing, stronger reference consistency, native audio, and precise text rendering.",
        },
        {
          question: 'How long can generated videos be?',
          answer: 'Kling 3.0 supports flexible duration from 3 to 15 seconds.',
        },
        {
          question: 'What references can I use?',
          answer:
            'You can use single or multiple images, and element references including video-based character references for stronger consistency.',
        },
        {
          question: 'Does it support multilingual audio?',
          answer:
            'Yes. Kling 3.0 supports Chinese, English, Japanese, Korean, and Spanish, including accents and mixed-language dialogue in one scene.',
        },
        {
          question: 'Can it generate clear in-scene text?',
          answer:
            'Yes. Kling 3.0 delivers native-level text rendering for signs, captions, and product lettering.',
        },
      ],
    },
    studioPromo: {
      title: 'VLook.ai Studio: cinematic Kling 3.0 creation',
      description:
        'Prompt, direct, and export cinematic 3-15 second clips with VLook.ai.',
      primaryLabel: 'Open VLook.ai Studio',
      secondaryLabel: 'Explore VLook.ai',
    },
    immersiveStudio: {
      label: 'Start immersive studio',
    },
  },
  zh: {
    meta: {
      title: 'Kling 3.0 AI 视频生成',
      description:
        '使用 Kling 3.0 生成 3-15 秒电影级视频：多镜头导演、一致性增强、原生音频与精准文字输出。',
    },
    hero: {
      eyebrow: 'AI 视频生成',
      title: 'Kling 3.0 AI 视频生成',
      subtitle:
        '通过多镜头场景控制、更强参考一致性、可指定说话角色的原生音频与原生级文字渲染，一次生成更完整的电影化叙事。',
      cta: '在下方工作区开始创作。',
      primaryLabel: '进入工作室',
      secondaryLabel: '查看亮点',
    },
    highlights: {
      eyebrow: '关键亮点',
      title: '关键亮点',
      description:
        '从镜头调度到多语言音频与文字渲染，Kling 3.0 提供端到端的视频创作能力。',
      cardLabel: '亮点',
      brandLabel: 'Kling 3.0',
      items: [
        {
          title: 'Multi-Shot：AI 导演上场，一次生成电影感成片',
          description:
            '在一个提示词中描述镜头覆盖，模型会自动协调机位、构图与转场，让叙事更连贯。',
        },
        {
          title: '全球首发：图生视频 + 主体一致性增强',
          description:
            '支持多图参考与元素级锚定，在镜头运动和剧情推进中稳定保持人物、物体与场景特征。',
        },
        {
          title: '原生音频升级：角色指向 + 更多语言',
          description:
            '可明确指定发声角色，支持多语言、多口音和同场景混合语言对话，口型与表情自然同步。',
        },
        {
          title: '原生级文本输出：更精准的字形与排版',
          description:
            '可保留或生成清晰场景文字，适用于品牌标识、包装文案、字幕标牌等高保真场景。',
        },
      ],
    },
    workflow: {
      title: '工作流程',
      steps: [
        {
          title: '描述场景',
          description: '编写包含镜头意图、动作与台词的提示词。',
        },
        {
          title: '添加参考元素',
          description: '上传一张或多张图片/视频元素，锁定主体与风格。',
        },
        {
          title: '设置时长与语言',
          description: '选择 3-15 秒时长，并按需启用多语言原生音频。',
        },
        {
          title: '生成并迭代',
          description: '先产出完整结果，再针对关键节拍精修。',
        },
      ],
    },
    multiShotShowcase: {
      title: 'Multi-Shot',
      subtitle: 'AI 导演上场，一键生成电影感成片',
      inputLabel: '图片地址',
      outputLabel: '视频输出',
      items: [
        {
          title: '别墅露台对切对白镜头',
          description:
            '提示词：欧洲别墅户外露台电影镜头。一位年轻白人女性身穿蓝白条纹短袖上衣、卡其短裤与棕色腰带，赤脚坐在铺有蓝白格子桌布的桌前；对面是一位身穿白色 T 恤的年轻白人男性。镜头缓慢推进。女性一边轻晃杯中的果汁，一边望向远处树林，说：“这些树一个月后就会变黄。”切到男性特写，他低头轻声说：“但明年夏天它们又会变绿。”随后女性转头对他微笑并问：“你总是这么乐观吗？”男性抬头看着她的眼睛回答：“只有和你一起度过的夏天。”高质量、4K、真实纹理、自然阳光、情绪氛围。',
          prompt: '欧洲别墅露台电影镜头，含对切对白与情绪递进。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770210949417_x41dja.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770210919472_j4m945.mp4',
        },
        {
          title: '环绕运镜与温暖抬头微笑',
          description:
            '提示词：镜头逐步环绕到女孩正面，随后她抬起头，朝镜头露出温暖笑容，仿佛多年后重逢老友。',
          prompt: '环绕运镜配合自然表情过渡，并保持多参考一致性。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211265229_b8ta0x.jpg',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211168009_dlazly.png',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211168011_9pju78.png',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211168012_tuqlyp.png',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211225176_74uzl2.mp4',
        },
      ],
    },
    nativeAudioShowcase: {
      title: '原生音频升级',
      subtitle: '角色指向与多语言能力',
      inputLabel: '图片地址',
      outputLabel: '视频输出',
      items: [
        {
          title: '家庭客厅多角色对白',
          description:
            '提示词：室内家庭环境，背景带有客厅空调轻微嗡鸣，营造真实日常氛围；母亲带着惊讶语气轻声感叹：“哇，我完全没想到剧情会这样。”；父亲用低沉平缓的声音回应：“是啊，太出乎意料了，真没想到会发生这种事。”；男孩开心地说：“这是最棒的反转！”；女孩兴奋点头：“我不敢相信他们真的这么拍了！”',
          prompt: '家庭场景多角色对白，支持角色指向与环境底噪。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211317936_quj6rs.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211314559_1lz1nj.mp4',
        },
        {
          title: '韩高天台夜景对话',
          description:
            '提示词：韩国高中天台夜景，远处城市灯火与轻微风声作背景，夜空繁星闪烁；女主倚着栏杆发呆，男主拿着两罐可乐走来递给她一罐，她接过后拉开；男主用轻松语气说：“숙제 다 했어? 왜 여기 있어?”；女主叹气说：“시험이 너무 무서워.”；男主温柔回应：“걱정 마, 넌 잘할 거야.”',
          prompt: '韩语天台对话，结合夜景氛围音与情绪节奏。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770191657884_766eiq.jpeg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770196418822_ourx0z.mp4',
        },
        {
          title: '马德里街头双语问路场景',
          description:
            '提示词：阳光洒满马德里老街，一家面包店门前，一位中国女游客和一位穿灰色连帽衫的男性面带礼貌微笑走向店员；女游客用稍慢且带点生涩口音的西语问：“Disculpe, ¿dónde está la plaza mayor?”；白发西班牙店员微微转身并指向前方，用轻松语气回答：“Por allí, a dos calles. Muy cerca.”；女游客感激地点头，男游客也点头并补充：“Muchas gracias.”；店员微笑点头，两人随后朝指示方向走去。',
          prompt: '西语多角色问路对话，带口音表达与街景互动。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211365511_9av6ju.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211378159_vb2qio.mp4',
        },
      ],
    },
    textOutputShowcase: {
      title: '原生级文本输出',
      subtitle: '精准字形与排版能力',
      inputLabel: '图片地址',
      outputLabel: '视频输出',
      items: [
        {
          title: '巴黎香水金色字样广告片',
          description:
            '提示词：巴黎公寓窗边场景，背景是柔和法式钢琴 BGM；午后金色阳光穿过百叶窗洒在香水瓶上，形成斑驳光影；镜头从散落玫瑰花瓣缓慢推进，聚焦 Kling 香水瓶切面，旁白（慵懒法语女声、英式口音、慢语速）：“Bathe in the golden hour.”；镜头缓慢环绕香水瓶，捕捉金色字样与玻璃上的光影流动，旁白：“Kling, a whisper of Parisian elegance.”；镜头拉回全景，香水瓶立于丝绒底座，窗外隐约可见巴黎建筑，旁白收尾：“Wrap yourself in luxury with every breath.”',
          prompt: '产品叙事短片，突出清晰字样、镜头控制与高质旁白。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211450832_feisx9.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211415228_mhabei.mp4',
        },
      ],
    },
    elementReferenceShowcase: {
      title: 'Element 构建',
      subtitle: '支持视频角色参考，保持视听一致性',
      inputLabel: '元素参考',
      outputLabel: '视频输出',
      items: [
        {
          title: '口红液态显形与 Logo 变换',
          description:
            '提示词：纯黑背景中，一道与 @kling 口红膏体同色的色流从黑暗中涌出，留下饱和且无瑕的轨迹；随后轨迹如液态河流般“活”起来，在表面优雅扩散、晕染，形成 @logo 图案；接着液态色彩重新汇聚为置于水面的 @kling 口红膏体；口红周围环绕细腻水波与花苞，花朵缓慢绽放，水面泛起轻柔涟漪。',
          prompt: '基于 Element 的产品显形，突出 Logo 变换与品牌要素稳定性。',
          inputImages: [
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211564487_5f8ph3.jpg',
            'https://p4-kling.klingai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211681004_ej599z.jpg',
          ],
          output:
            'https://v4-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-release-notes/20260204/1770211666699_173y81.mp4',
        },
      ],
    },
    faq: {
      title: '常见问题',
      subtitle: '关于 Kling 3.0 的常见疑问。',
      items: [
        {
          question: 'Kling 3.0 是什么？',
          answer:
            'Kling 3.0 是 Kling AI 的新一代视频生成模型，具备多镜头导演、参考一致性增强、原生音频与精准文字渲染能力。',
        },
        {
          question: '支持生成多长时长？',
          answer: '支持 3 到 15 秒的灵活视频生成。',
        },
        {
          question: '支持哪些参考输入？',
          answer:
            '支持单图、多图与元素参考，并可使用视频角色参考提升视觉与音频的一致性。',
        },
        {
          question: '支持多语言音频吗？',
          answer:
            '支持。当前可覆盖中文、英文、日文、韩文、西班牙文，并支持口音与同场景混合语言。',
        },
        {
          question: '文字渲染能力如何？',
          answer:
            '可实现原生级清晰文字输出，适用于标牌、字幕与产品包装等场景。',
        },
      ],
    },
    studioPromo: {
      title: 'VLook.ai 工作室：Kling 3.0 电影级创作',
      description: '在 VLook.ai 中快速生成并迭代 3-15 秒电影感视频。',
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
    pathname: '/media-studio/kling3',
  });
}

interface Kling3StudioPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Kling3StudioPage(props: Kling3StudioPageProps) {
  const params = await props.params;
  const content =
    PAGE_CONTENT[params.locale as keyof typeof PAGE_CONTENT] ?? PAGE_CONTENT.en;

  const highlightItems = content.highlights.items.map((item) => ({
    title: item.title,
    description: item.description,
  }));

  const multiShotItems: ImageToMediaExample[] =
    content.multiShotShowcase.items.map((item) => ({
      ...item,
      prompt: item.prompt,
      inputImages: [...item.inputImages],
    }));

  const nativeAudioItems: ImageToMediaExample[] =
    content.nativeAudioShowcase.items.map((item) => ({
      ...item,
      prompt: item.prompt,
      inputImages: [...item.inputImages],
    }));

  const textOutputItems: ImageToMediaExample[] =
    content.textOutputShowcase.items.map((item) => ({
      ...item,
      prompt: item.prompt,
      inputImages: [...item.inputImages],
    }));

  const elementReferenceItems: ImageToMediaExample[] =
    content.elementReferenceShowcase.items.map((item) => ({
      ...item,
      prompt: item.prompt,
      inputImages: [...item.inputImages],
    }));

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
                preferredModelId="kling-2.6"
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

        <CapabilitiesCardsSection
          id="highlights"
          eyebrow={content.highlights.eyebrow}
          title={content.highlights.title}
          description={content.highlights.description}
          items={highlightItems}
          getCardLabel={(index) => `${content.highlights.cardLabel} ${index}`}
          brandLabel={content.highlights.brandLabel}
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

        <ImageToMediaShowcase
          id="multi-shot-examples"
          title={content.multiShotShowcase.title}
          subtitle={content.multiShotShowcase.subtitle}
          inputLabel={content.multiShotShowcase.inputLabel}
          outputLabel={content.multiShotShowcase.outputLabel}
          items={multiShotItems}
        />

        <ImageToMediaShowcase
          id="native-audio-examples"
          title={content.nativeAudioShowcase.title}
          subtitle={content.nativeAudioShowcase.subtitle}
          inputLabel={content.nativeAudioShowcase.inputLabel}
          outputLabel={content.nativeAudioShowcase.outputLabel}
          items={nativeAudioItems}
        />

        <ImageToMediaShowcase
          id="text-output-examples"
          title={content.textOutputShowcase.title}
          subtitle={content.textOutputShowcase.subtitle}
          inputLabel={content.textOutputShowcase.inputLabel}
          outputLabel={content.textOutputShowcase.outputLabel}
          items={textOutputItems}
        />

        <ImageToMediaShowcase
          id="element-reference-examples"
          title={content.elementReferenceShowcase.title}
          subtitle={content.elementReferenceShowcase.subtitle}
          inputLabel={content.elementReferenceShowcase.inputLabel}
          outputLabel={content.elementReferenceShowcase.outputLabel}
          items={elementReferenceItems}
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
