import { CapabilitiesCardsSection } from '@/components/custom-blocks/capabilities-cards/capabilities-cards';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import HeroSection from '@/components/custom-blocks/hero/hero';
import StudioPromoSection from '@/components/custom-blocks/studio-promo/studio-promo';
import WorkflowStepsSection from '@/components/custom-blocks/workflow-steps/workflow-steps';
import XContentSection from '@/components/custom-blocks/x-content/x-content';
import YouTubeContentSection from '@/components/custom-blocks/youtube-content/youtube-content';
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
        'Create cinematic 3-15 second videos with Kling 3.0. Direct multiple shots, keep characters consistent, add native multilingual audio, and render clear in-scene text in one workflow.',
    },
    hero: {
      eyebrow: 'AI video generation',
      title: 'Kling 3.0 AI video generator',
      subtitle:
        'Go from prompt to polished 3-15 second video in one workflow. Plan multiple shots, keep subjects consistent, assign dialogue by character, and render clear on-screen text.',
      cta: 'Generate your first Kling 3.0 clip below.',
      primaryLabel: 'Open studio',
      secondaryLabel: 'See what is new in 3.0',
    },
    highlights: {
      eyebrow: 'Key highlights',
      title: 'Key Highlights',
      description:
        'Kling 3.0 helps creators move from idea to publish-ready video faster, with stronger control over shots, audio, and text.',
      cardLabel: 'Highlight',
      brandLabel: 'Kling 3.0',
      items: [
        {
          title: 'Direct multiple shots in a single prompt',
          description:
            'Describe sequence, angle, and motion once, and Kling 3.0 coordinates shot order and transitions for a smoother cinematic flow.',
        },
        {
          title: 'Keep characters and scenes consistent',
          description:
            'Use multiple references and element-level grounding to keep faces, objects, and environments stable across scene changes.',
        },
        {
          title: 'Add native audio with speaker-level control',
          description:
            'Assign lines to specific characters, generate multilingual dialogue with accents, and keep voice and motion naturally aligned.',
        },
        {
          title: 'Render clear in-scene text for brand content',
          description:
            'Preserve or generate readable labels, captions, and signage so product videos stay usable for real campaigns.',
        },
      ],
    },
    workflow: {
      title: 'How It Works',
      steps: [
        {
          title: 'Write the scene',
          description:
            'Describe the story, camera intent, motion, and dialogue in one prompt.',
        },
        {
          title: 'Add references',
          description:
            'Upload image or element references to lock identity, product details, and style.',
        },
        {
          title: 'Set duration and audio',
          description:
            'Choose a 3-15 second length and set multilingual audio when needed.',
        },
        {
          title: 'Generate, review, refine',
          description:
            'Render the first pass, review pacing and continuity, then iterate on key moments.',
        },
      ],
    },
    differentiation: {
      eyebrow: '3.0 differences',
      title: 'Why Kling 3.0 Is Different',
      description:
        'Kling 3.0 is not only a quality upgrade. It adds native multimodal generation, longer structured storytelling, and deeper audio-visual reference control.',
      cardLabel: 'Difference',
      brandLabel: 'Kling 3.0',
      items: [
        {
          title: 'Unified multimodal model across creation tasks',
          description:
            'Text-to-video, image-to-video, reference-to-video, and video editing workflows are integrated into one native model, improving consistency across tasks.',
        },
        {
          title: '3-15s output with storyboard-level shot control',
          description:
            'You can generate up to 15 seconds and define per-shot timing, size, perspective, and camera movement for smoother narrative progression.',
        },
        {
          title: 'Native audio engine with speaker-level precision',
          description:
            'The model supports character-targeted dialogue, multiple languages, dialects, and mixed-language scenes with coherent lip sync and expressions.',
        },
        {
          title: 'Elements 3.0 with video character and voice reference',
          description:
            'Build subjects from short character videos and optional voice input to preserve identity and voice traits across scenes.',
        },
      ],
    },
    multiShotShowcase: {
      title: 'Multi-Shot',
      subtitle: 'AI Director Onboard, One-Click Cinematic Output',
      inputLabel: 'Input',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Villa Terrace Shot-Reverse Dialogue',
          description:
            "Prompt: Cinematic shot on a European villa's outdoor terrace. A young Caucasian woman in a blue and white striped short-sleeved shirt, khaki shorts with a brown belt, sits barefoot at a table with a blue-and-white checkered tablecloth. Opposite her sits a young Caucasian man in a white T-shirt. The camera slowly pushes in. The woman swirls juice in her glass, gazing at the distant woods, and says, “These trees will turn yellow in a month.” Close-up on the man as he lowers his head and whispers, “But they'll be green again next summer.” The woman then turns her head, smiling at him, and asks, “Are you always this optimistic?” The man looks up into her eyes and replies, “Only about summers with you.” High-quality, 4k, realistic textures, natural sunlight, emotional atmosphere.",
          prompt:
            "Cinematic shot on a European villa's outdoor terrace with shot-reverse-shot dialogue and emotional pacing.",
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770210949417_x41dja.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770210919472_j4m945.mp4',
        },
        {
          title: 'Orbiting Portrait with Warm Reunion Smile',
          description:
            'Prompt: The camera gradually orbits to the front of the girl, then she lifts her head, smiling warmly toward the camera as if seeing an old friend after many years.',
          prompt:
            'Orbit camera movement with natural expression transition and multi-reference consistency.',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770211265229_b8ta0x.jpg',
            'https://media.vlook.ai/media/download/0/public/1770211168009_dlazly.png',
            'https://media.vlook.ai/media/download/0/public/1770211168011_9pju78.png',
            'https://media.vlook.ai/media/download/0/public/1770211168012_tuqlyp.png',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211225176_74uzl2.mp4',
        },
      ],
    },
    nativeAudioShowcase: {
      title: 'Upgraded Native Audio Output',
      subtitle: 'Character Referencing & More Languages',
      inputLabel: 'Input',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Family Living Room Multi-Speaker Dialogue',
          description:
            "Prompt: Indoor home environment with a subtle background hum of a living room air conditioner for realistic daily life; the mother exclaims softly with a tone of surprise, “Wow, I didn't expect this plot at all.”; the father responds in a low, flat voice, “Yeah, it's totally unexpected, never thought that would happen.”; the boy says cheerfully, “It's the best twist ever!”; the girl nods excitedly, “I can't believe they did that!”",
          prompt:
            'Multi-character dialogue with speaker targeting and household ambient sound.',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770211317936_quj6rs.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211314559_1lz1nj.mp4',
        },
        {
          title: 'Korean Rooftop Night Conversation',
          description:
            'Prompt: Korean high school rooftop scene with distant city lights and subtle wind sounds in the background while stars twinkle in the night sky; the female lead leans against the railing dazing as the male lead approaches with two cans of cola and hands one to her, which she takes and opens; the male lead says in a relaxed tone, “숙제 다 했어? 왜 여기 있어?”; the female lead sighs and says, “시험이 너무 무서워.”; the male lead says gently, “걱정 마, 넌 잘할 거야.”',
          prompt:
            'Korean dialogue performance with ambient rooftop atmosphere and emotional timing.',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770191657884_766eiq.jpeg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770196418822_ourx0z.mp4',
        },
        {
          title: 'Madrid Street Bilingual Wayfinding Scene',
          description:
            'Prompt: Sunlight floods an old street in Madrid in front of a bakery where a female Chinese tourist and a male in a grey hoodie walk toward the clerk with polite smiles; the female tourist asks at a slightly slow pace with a clumsy accent in Spanish, “Disculpe, ¿dónde está la plaza mayor?”; the white-haired Spanish clerk turns slightly and points forward, saying in a lighthearted tone in Spanish, “Por allí, a dos calles. Muy cerca.”; the female tourist nods in gratitude and the male tourist also nods and adds in Spanish, “Muchas gracias.”; the clerk nods back with a smile as the two turn and walk towards the indicated direction.',
          prompt:
            'Multilingual Spanish dialogue with accent styling and natural street interaction.',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770211365511_9av6ju.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211378159_vb2qio.mp4',
        },
      ],
    },
    textOutputShowcase: {
      title: 'Native-Level Text Output',
      subtitle: 'Precise Lettering Capabilities',
      inputLabel: 'Input',
      outputLabel: 'Video Output',
      items: [
        {
          title: 'Paris Perfume Film with Golden Lettering',
          description:
            'Prompt: Parisian apartment window scene with soft French piano BGM in the background as afternoon golden sunlight filters through blinds onto a perfume bottle, creating dappled light and shadows; the camera slowly pushes from scattered rose petals to focus on the facets of the Kling perfume bottle with a voiceover (languid French female voice, British accent, slow pace): “Bathe in the golden hour.”; the camera slowly orbits the bottle, capturing the golden lettering and the flow of light and shadow on the glass with a voiceover: “Kling, a whisper of Parisian elegance.”; the camera pulls back to a wide shot of the full scene with the perfume bottle standing on a velvet pedestal and Parisian architecture faintly visible through the window as the voiceover concludes: “Wrap yourself in luxury with every breath.”',
          prompt:
            'Product storytelling with clear lettering, controlled camera motion, and polished voiceover.',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770211450832_feisx9.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211415228_mhabei.mp4',
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
            'https://media.vlook.ai/media/download/0/public/1770211564487_5f8ph3.jpg',
            'https://media.vlook.ai/media/download/0/public/1770211681004_ej599z.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211666699_173y81.mp4',
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
            'Kling 3.0 is an AI video model for cinematic short-form production, with multi-shot direction, stronger consistency, native audio, and clear text rendering.',
        },
        {
          question: 'How long can generated videos be?',
          answer: 'Kling 3.0 supports flexible duration from 3 to 15 seconds.',
        },
        {
          question: 'What references can I use?',
          answer:
            'You can use single or multiple images plus element references, including video character references for stronger visual and audio consistency.',
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
        {
          question:
            'What is the difference between Kling 3.0 and Kling 2.6/O1?',
          answer:
            'Kling 3.0 introduces a unified multimodal training framework, extends generation up to 15 seconds, adds shot-level storyboard control, and upgrades Elements with video character plus voice reference for stronger audio-visual consistency.',
        },
      ],
    },
    social: {
      title: 'X Highlights',
      subtitle: 'Latest community takes on Kling 3.0',
      description:
        'See how creators share prompts, clips, and results in the wild.',
      iframeTitlePrefix: 'X post preview',
    },
    youtube: {
      title: 'YouTube Highlights',
      subtitle: 'Kling 3.0 in action',
      description:
        'Watch creator demos, breakdowns, and real production workflows.',
      prevLabel: 'Scroll to previous videos',
      nextLabel: 'Scroll to next videos',
      iframeTitlePrefix: 'YouTube video',
    },
    studioPromo: {
      title: 'VLook.ai Studio for Kling 3.0',
      description:
        'Create, iterate, and export cinematic 3-15 second videos in minutes.',
      primaryLabel: 'Open Kling 3.0 Studio',
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
        '使用 Kling 3.0 在一个流程中生成 3-15 秒电影级视频：多镜头调度、角色一致性增强、多语言原生音频与清晰场景文字。',
    },
    hero: {
      eyebrow: 'AI 视频生成',
      title: 'Kling 3.0 AI 视频生成器',
      subtitle:
        '从提示词到成片，一次完成 3-15 秒视频创作。支持多镜头叙事、主体一致性控制、角色指向对白与清晰文字渲染。',
      cta: '在下方生成你的第一条 Kling 3.0 视频。',
      primaryLabel: '进入工作室',
      secondaryLabel: '查看 3.0 新增能力',
    },
    highlights: {
      eyebrow: '关键亮点',
      title: '关键亮点',
      description:
        'Kling 3.0 帮你更快把创意变成可发布的视频，并在镜头、音频与文字上保留更高可控性。',
      cardLabel: '亮点',
      brandLabel: 'Kling 3.0',
      items: [
        {
          title: '一个提示词完成多镜头调度',
          description:
            '在一次生成中描述镜头顺序、机位与运动，模型自动编排转场，让叙事更连贯。',
        },
        {
          title: '角色与场景跨镜头更稳定',
          description:
            '支持多图参考和元素级锚定，在场景切换中稳定保留人物、物体和环境特征。',
        },
        {
          title: '原生音频支持角色级对白控制',
          description:
            '可指定具体角色发声，支持多语言与口音表达，并保持语音与画面节奏自然匹配。',
        },
        {
          title: '场景文字清晰可读，适合商用内容',
          description:
            '可保留或生成清晰的标牌、字幕和包装文字，让视频更适合品牌和营销场景。',
        },
      ],
    },
    workflow: {
      title: '工作流程',
      steps: [
        {
          title: '写下场景',
          description: '在提示词中说明故事、镜头意图、动作与台词。',
        },
        {
          title: '添加参考',
          description: '上传图片或元素参考，锁定人物身份、产品细节和视觉风格。',
        },
        {
          title: '设置时长与音频',
          description: '选择 3-15 秒时长，并按需配置多语言原生音频。',
        },
        {
          title: '生成、复盘、迭代',
          description: '先产出首版，再根据节奏和连贯性优化关键镜头。',
        },
      ],
    },
    differentiation: {
      eyebrow: '3.0 差异化',
      title: 'Kling 3.0 与前代的关键差异',
      description:
        'Kling 3.0 不只是画质升级，还在原生多模态、长时叙事与音画参考控制上完成了系统级进化。',
      cardLabel: '差异点',
      brandLabel: 'Kling 3.0',
      items: [
        {
          title: '统一多模态模型覆盖多类创作任务',
          description:
            '将文生视频、图生视频、参考生视频与视频编辑等任务整合进同一原生模型，跨任务一致性更强。',
        },
        {
          title: '3-15 秒输出并支持分镜级控制',
          description:
            '单次可生成最长 15 秒，并可按镜头定义时长、景别、视角与运镜，让叙事节奏更完整。',
        },
        {
          title: '原生音频引擎支持角色级精准对白',
          description:
            '支持指定角色发声、多语言与口音、同场景混合语种，并保持口型和表情更自然一致。',
        },
        {
          title: 'Elements 3.0 支持视频角色 + 声音参考',
          description:
            '可通过短视频提取角色外观与声音特征，在跨镜头与跨场景中维持更高的人物一致性。',
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
            'https://media.vlook.ai/media/download/0/public/1770210949417_x41dja.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770210919472_j4m945.mp4',
        },
        {
          title: '环绕运镜与温暖抬头微笑',
          description:
            '提示词：镜头逐步环绕到女孩正面，随后她抬起头，朝镜头露出温暖笑容，仿佛多年后重逢老友。',
          prompt: '环绕运镜配合自然表情过渡，并保持多参考一致性。',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770211265229_b8ta0x.jpg',
            'https://media.vlook.ai/media/download/0/public/1770211168009_dlazly.png',
            'https://media.vlook.ai/media/download/0/public/1770211168011_9pju78.png',
            'https://media.vlook.ai/media/download/0/public/1770211168012_tuqlyp.png',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211225176_74uzl2.mp4',
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
            'https://media.vlook.ai/media/download/0/public/1770211317936_quj6rs.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211314559_1lz1nj.mp4',
        },
        {
          title: '韩高天台夜景对话',
          description:
            '提示词：韩国高中天台夜景，远处城市灯火与轻微风声作背景，夜空繁星闪烁；女主倚着栏杆发呆，男主拿着两罐可乐走来递给她一罐，她接过后拉开；男主用轻松语气说：“숙제 다 했어? 왜 여기 있어?”；女主叹气说：“시험이 너무 무서워.”；男主温柔回应：“걱정 마, 넌 잘할 거야.”',
          prompt: '韩语天台对话，结合夜景氛围音与情绪节奏。',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770191657884_766eiq.jpeg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770196418822_ourx0z.mp4',
        },
        {
          title: '马德里街头双语问路场景',
          description:
            '提示词：阳光洒满马德里老街，一家面包店门前，一位中国女游客和一位穿灰色连帽衫的男性面带礼貌微笑走向店员；女游客用稍慢且带点生涩口音的西语问：“Disculpe, ¿dónde está la plaza mayor?”；白发西班牙店员微微转身并指向前方，用轻松语气回答：“Por allí, a dos calles. Muy cerca.”；女游客感激地点头，男游客也点头并补充：“Muchas gracias.”；店员微笑点头，两人随后朝指示方向走去。',
          prompt: '西语多角色问路对话，带口音表达与街景互动。',
          inputImages: [
            'https://media.vlook.ai/media/download/0/public/1770211365511_9av6ju.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211378159_vb2qio.mp4',
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
            'https://media.vlook.ai/media/download/0/public/1770211450832_feisx9.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211415228_mhabei.mp4',
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
            'https://media.vlook.ai/media/download/0/public/1770211564487_5f8ph3.jpg',
            'https://media.vlook.ai/media/download/0/public/1770211681004_ej599z.jpg',
          ],
          output:
            'https://media.vlook.ai/media/download/0/public/1770211666699_173y81.mp4',
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
            'Kling 3.0 是面向电影感短视频创作的 AI 模型，支持多镜头调度、更强一致性、原生音频与清晰文字渲染。',
        },
        {
          question: '支持生成多长时长？',
          answer: '支持 3 到 15 秒的灵活视频生成。',
        },
        {
          question: '支持哪些参考输入？',
          answer:
            '支持单图、多图和元素参考，也支持视频角色参考以提升视觉与音频的一致性。',
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
        {
          question: 'Kling 3.0 与 Kling 2.6 / O1 的主要差异是什么？',
          answer:
            'Kling 3.0 引入统一多模态训练框架，支持最长 15 秒输出与分镜级控制，并将 Elements 升级为可结合视频角色与声音参考，显著提升长叙事中的视听一致性。',
        },
      ],
    },
    social: {
      title: 'X 精选内容',
      subtitle: '社区最新的 Kling 3.0 观点',
      description: '看看创作者如何分享提示词、视频片段与生成结果。',
      iframeTitlePrefix: 'X 帖子预览',
    },
    youtube: {
      title: 'YouTube 精选内容',
      subtitle: 'Kling 3.0 实战演示',
      description: '观看创作者演示、拆解与真实生产工作流。',
      prevLabel: '查看上一组视频',
      nextLabel: '查看下一组视频',
      iframeTitlePrefix: 'YouTube 视频',
    },
    studioPromo: {
      title: 'VLook.ai Kling 3.0 工作室',
      description: '在几分钟内完成生成、迭代并导出 3-15 秒电影感视频。',
      primaryLabel: '打开 Kling 3.0 工作室',
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

  const socialUrls = [
    'https://x.com/Kling_ai/status/2019228615775604784',
    'https://x.com/NasirBiswasTech/status/2019722657000993049',
    'https://x.com/PJaccetturo/status/2019072637192843463',
    'https://x.com/maxescu/status/2019069933175427427',
    'https://x.com/mxvdxn/status/2019791311218335991',
    'https://x.com/Diesol/status/2019064764589089256',
    'https://x.com/techhalla/status/2019416032977514583',
    'https://x.com/OrctonAI/status/2019089992748765214',
  ];
  const youtubeUrls = [
    'https://www.youtube.com/watch?v=XD_7FNPhZQY',
    'https://www.youtube.com/watch?v=z84WQAn6U0I',
    'https://www.youtube.com/watch?v=Rme22R7a9O8',
    'https://www.youtube.com/watch?v=YFF8x0kU4mU',
  ];

  const highlightItems = content.highlights.items.map((item) => ({
    title: item.title,
    description: item.description,
  }));
  const differentiationItems = content.differentiation.items.map((item) => ({
    title: item.title,
    description: item.description,
  }));
  const faqItems = content.faq.items.map((item, index) => ({
    id: `faq-${index + 1}`,
    question: item.question,
    answer: item.answer,
  }));
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

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
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <div className="mb-12 lg:mb-16">
          <HeroSection
            eyebrow={content.hero.eyebrow}
            title={content.hero.title}
            description={content.hero.subtitle}
            cta={content.hero.cta}
            primaryLabel={content.hero.primaryLabel}
            secondaryLabel={content.hero.secondaryLabel}
            primaryHref="#studio"
            secondaryHref="#differentiation"
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

        <CapabilitiesCardsSection
          id="differentiation"
          eyebrow={content.differentiation.eyebrow}
          title={content.differentiation.title}
          description={content.differentiation.description}
          items={differentiationItems}
          getCardLabel={(index) =>
            `${content.differentiation.cardLabel} ${index}`
          }
          brandLabel={content.differentiation.brandLabel}
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
            items={faqItems}
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
