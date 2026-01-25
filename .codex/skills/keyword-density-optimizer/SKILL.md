---
name: keyword-density-optimizer
description: 优化页面 SEO 关键词密度与总字数（不少于800），从 Next.js/TSX 页面与其本地引用组件、next-intl 文案中抽取文本，统计 1-4 gram 密度，并按用户给定的目标关键词与密度区间迭代修改页面内容直到满足要求。适用于 page.tsx、messages/locale.json 等页面文案密度优化场景。
---

# Keyword Density Optimizer

用于对指定页面（含其本地引用文本与翻译文案）进行关键词密度分析与优化，输出 1/2/3/4-gram 密度最高关键词，并在保持结构与语义的前提下调整文案使目标关键词密度落入指定区间，同时确保总字数 >= 800。

## 工作流（按顺序执行）

### 1) 确定范围与语言
- 确认目标页面路径（如 `src/app/[locale]/(marketing)/(pages)/media-studio/veo3/page.tsx`）。
- 确认 locale（默认 `en`）。
- **前台展示内容**：保持与现有语言一致；非多语言页面默认英文。

### 2) 提取页面文本（含引用）
使用脚本递归读取页面与相对导入的本地组件，并提取：
- JSX 直文本（`<h1>Text</h1>`）
- 字符串字面量
- `t('key')` 对应的 `messages/locale.json` 文案

命令示例：
```bash
python3 .codex/skills/keyword-density-optimizer/scripts/extract_page_text.py \
  --page src/app/[locale]/(marketing)/(pages)/media-studio/veo3/page.tsx \
  --locale en \
  --include-jsx \
  --include-literals \
  --out /tmp/veo3-text.txt
```

注意：
- 若文案来自运行时数据、CMS、API 等，使用 `--extra` 提供补充文本文件。
- 如需控制递归范围，使用 `--max-depth`。

### 3) 统计当前 1-4 gram 密度最高关键词
```bash
python3 .codex/skills/keyword-density-optimizer/scripts/keyword_density.py \
  --text /tmp/veo3-text.txt \
  --top 10
```
输出中记录每个 n-gram 的 Top 1（密度最高关键词），并统计总字数（按规则计）。

### 4) 向用户询问目标关键词与密度区间
- 让用户分别提供 1/2/3/4-gram 的目标关键词（新版本关键词）。
- 询问目标密度区间（默认 `3%–5%`）。
- 若用户未指定区间，提示默认区间并征得确认。

### 5) 修改页面文案以匹配密度区间
**必须满足：**
- 保持原文结构与段落数量不变。
- 语义保持一致，可用同义改写、插入补充句，但不要新增/删除段落。
- 仅修改页面自身或其专属文案文件（如 `messages/en.json`），**避免改动通用组件**；如需改动先向用户确认。
- 总字数（按脚本规则）必须 >= 800。

优先修改位置：
1. 当前页面 `page.tsx` 中的文本
2. 当前页面对应的 `messages/locale.json` 文案
3. 页面内部局部组件（仅当确认是页面专属）

### 6) 复算并迭代直到满足要求
- 重复第 2-3 步，检查：
  - 目标关键词密度是否落入区间
  - 总字数是否 >= 800
- 使用 `--target` 快速检查指定关键词密度：
```bash
python3 .codex/skills/keyword-density-optimizer/scripts/keyword_density.py \
  --text /tmp/veo3-text.txt \
  --target "your keyword" \
  --target "another keyword"
```
- 不达标则继续微调文案，直到全部满足。

## 规则细节（需严格遵守）
- **英文**按单词计数；**非英文**按字符计数（中文及其他语言同此规则）。
- 忽略大小写与特殊字符。
- 密度 = 关键词出现次数 / 总词数（或对应 n-gram 总数）。
- 目标页文案总字数（按脚本统计）>= 800。

## 资源
### scripts/
- `extract_page_text.py`：抽取页面与引用文本，输出合并文本。
- `keyword_density.py`：统计 1-4 gram 密度与总字数。
