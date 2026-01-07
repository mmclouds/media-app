'use client';

import { PromptEditor } from '../shared/prompt-editor';
import { ShortTextInput } from '../shared/short-text-input';
import type { MediaModelConfigProps } from '../types';

const STYLE_HELPER =
  'Examples: Jazz, Classical, Electronic, Pop, Rock, Hip-hop.';

export function SunoConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const style = typeof config.style === 'string' ? config.style : '';
  const title = typeof config.title === 'string' ? config.title : '';
  const negativeTags =
    typeof config.negativeTags === 'string' ? config.negativeTags : '';

  return (
    <div className="space-y-4">
      <ShortTextInput
        label="Title"
        placeholder="Track title"
        value={title}
        maxLength={80}
        onChange={(value) =>
          onChange({
            ...config,
            title: value,
          })
        }
      />
      <PromptEditor
        label="Prompt"
        placeholder="Describe the song you want to generate."
        value={prompt}
        maxLength={5000}
        onChange={onPromptChange}
      />
      <PromptEditor
        label="Style"
        placeholder="Describe the style or genre."
        helperText={STYLE_HELPER}
        value={style}
        maxLength={1000}
        onChange={(value) =>
          onChange({
            ...config,
            style: value,
          })
        }
      />
      <PromptEditor
        label="Negative tags"
        placeholder="Avoid specific styles or instruments."
        value={negativeTags}
        onChange={(value) =>
          onChange({
            ...config,
            negativeTags: value,
          })
        }
      />
    </div>
  );
}
