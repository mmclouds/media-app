'use client';

import { useRef, useState } from 'react';

type SingleImageUploadFieldProps = {
  label: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  helperText?: string;
  maxSize?: number;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

export function SingleImageUploadField({
  label,
  value,
  onChange,
  helperText,
  maxSize = 8 * 1024 * 1024,
}: SingleImageUploadFieldProps) {
  const normalizedMaxSize = Math.max(1, Math.ceil(maxSize / (1024 * 1024)));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    if (file.size > maxSize) {
      setError(`File must be under ${normalizedMaxSize}MB.`);
      return;
    }

    setError(null);
    setIsReading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (readError) {
      console.error('读取图片失败', readError);
      setError('Failed to read image file.');
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
        {value ? (
          <button
            type="button"
            className="text-xs font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        ) : null}
      </div>

      <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/20 bg-black/60 transition hover:border-white/40 hover:bg-white/5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <div className="flex flex-col gap-3 p-4 text-sm text-white/70">
          {value ? (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <img
                src={value}
                alt="Reference"
                className="h-40 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white">
                Image attached
              </div>
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-white/60">
              <p className="text-sm font-semibold">Upload reference image</p>
              <p className="text-xs text-white/50">PNG, JPG or WEBP</p>
              <p className="text-[11px] text-white/40">
                Max {normalizedMaxSize}MB.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">
              {isReading ? 'Processing image...' : 'Attach an image to guide the video.'}
            </span>
            <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white transition group-hover:bg-white/20">
              {value ? 'Replace image' : 'Upload image'}
            </span>
          </div>
        </div>
      </label>
      {helperText ? (
        <p className="text-xs text-white/50">{helperText}</p>
      ) : null}
      <p className="text-[11px] text-white/40">
        Limit: single image, max {normalizedMaxSize}MB.
      </p>
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </div>
  );
}
