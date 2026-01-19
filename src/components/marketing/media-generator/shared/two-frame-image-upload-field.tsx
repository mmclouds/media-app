'use client';

import {
  buildPublicFileDownloadUrl,
  uploadFileToBucket,
} from '@/lib/file-transfer';
import { useMemo, useRef, useState } from 'react';

type UploadSlot = 'first' | 'last';

type TwoFrameImageUploadFieldProps = {
  label: string;
  bucket?: string;
  apiBaseUrl?: string;
  fileName?: string;
  firstValue?: string | null;
  lastValue?: string | null;
  onChange: (value: { first?: string | null; last?: string | null }) => void;
  helperText?: string;
  maxSize?: number;
  onUploaded?: (params: {
    slot: UploadSlot;
    file: {
      uuid: string;
      downloadUrl: string;
      bucketName?: string;
      objectKey?: string;
      fileName?: string;
    };
  }) => void;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function TwoFrameImageUploadField({
  label,
  bucket,
  apiBaseUrl,
  fileName,
  firstValue,
  lastValue,
  onChange,
  helperText,
  maxSize = 10 * 1024 * 1024,
  onUploaded,
}: TwoFrameImageUploadFieldProps) {
  const normalizedMaxSize = Math.max(1, Math.ceil(maxSize / (1024 * 1024)));
  const resolvedBucket =
    bucket || process.env.NEXT_PUBLIC_UPLOAD_BUCKET || '0-image';
  const fallbackTenantId = useMemo(
    () => process.env.NEXT_PUBLIC_TENANT_ID || '0',
    []
  );
  const inputRefs = {
    first: useRef<HTMLInputElement | null>(null),
    last: useRef<HTMLInputElement | null>(null),
  };
  const [isUploading, setIsUploading] = useState<Record<UploadSlot, boolean>>({
    first: false,
    last: false,
  });
  const [isDragging, setIsDragging] = useState<Record<UploadSlot, boolean>>({
    first: false,
    last: false,
  });
  const [errors, setErrors] = useState<Record<UploadSlot, string | null>>({
    first: null,
    last: null,
  });

  const resolvePreviewUrl = (candidate?: string | null) => {
    if (!candidate) {
      return null;
    }

    const trimmed = candidate.trim();
    if (!trimmed) {
      return null;
    }

    const isDirectUrl =
      trimmed.startsWith('data:') ||
      trimmed.startsWith('http') ||
      trimmed.startsWith('/');
    if (isDirectUrl) {
      return trimmed;
    }

    if (UUID_PATTERN.test(trimmed) && fallbackTenantId) {
      return buildPublicFileDownloadUrl({
        uuid: trimmed,
        tenantId: fallbackTenantId,
        apiBaseUrl,
      });
    }

    return trimmed;
  };

  const previewUrls = {
    first: resolvePreviewUrl(firstValue),
    last: resolvePreviewUrl(lastValue),
  };

  const handleFiles = async (slot: UploadSlot, files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    if (file.size > maxSize) {
      setErrors((current) => ({
        ...current,
        [slot]: `Each file must be under ${normalizedMaxSize}MB.`,
      }));
      return;
    }

    setErrors((current) => ({ ...current, [slot]: null }));
    setIsUploading((current) => ({ ...current, [slot]: true }));

    try {
      const resolvedFileName = fileName
        ? `${fileName}-${slot}-${Date.now()}`
        : undefined;
      const result = await uploadFileToBucket({
        file,
        bucket: resolvedBucket,
        fileName: resolvedFileName,
        apiBaseUrl,
      });

      if (!result.uuid) {
        throw new Error('Upload succeeded without file uuid.');
      }

      const downloadUrl = buildPublicFileDownloadUrl({
        uuid: result.uuid,
        tenantId: fallbackTenantId,
        apiBaseUrl,
      });

      onChange({
        first: slot === 'first' ? downloadUrl : firstValue ?? null,
        last: slot === 'last' ? downloadUrl : lastValue ?? null,
      });

      onUploaded?.({
        slot,
        file: {
          uuid: result.uuid,
          downloadUrl,
          bucketName: result.bucketName,
          objectKey: result.objectKey,
          fileName: resolvedFileName || result.objectKey,
        },
      });

      if (inputRefs[slot].current) {
        inputRefs[slot].current.value = '';
      }
    } catch (uploadError) {
      console.error('上传图片失败', uploadError);
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : 'Failed to upload image.';
      setErrors((current) => ({ ...current, [slot]: message }));
    } finally {
      setIsUploading((current) => ({ ...current, [slot]: false }));
    }
  };

  const renderSlot = (slot: UploadSlot, title: string, value: string | null) => {
    const previewUrl = slot === 'first' ? previewUrls.first : previewUrls.last;
    const uploading = isUploading[slot];
    const dragging = isDragging[slot];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            {title}
          </p>
          {value ? (
            <button
              type="button"
              className="text-[11px] font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
              onClick={() =>
                onChange({
                  first: slot === 'first' ? null : firstValue ?? null,
                  last: slot === 'last' ? null : lastValue ?? null,
                })
              }
            >
              Remove
            </button>
          ) : null}
        </div>

        <label
          className={`group relative flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-black/60 transition hover:border-white/40 hover:bg-white/5 ${
            dragging ? 'border-white/50 bg-white/10' : ''
          } ${
            uploading
              ? 'pointer-events-none border-blue-400/70 bg-blue-500/10 shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_0_18px_rgba(249,115,22,0.25)]'
              : ''
          }`}
          aria-busy={uploading}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!uploading) {
              setIsDragging((current) => ({ ...current, [slot]: true }));
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!uploading) {
              event.dataTransfer.dropEffect = 'copy';
              setIsDragging((current) => ({ ...current, [slot]: true }));
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsDragging((current) => ({ ...current, [slot]: false }));
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging((current) => ({ ...current, [slot]: false }));
            if (uploading) {
              return;
            }
            handleFiles(slot, event.dataTransfer.files);
          }}
        >
          <input
            ref={inputRefs[slot]}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(event) => handleFiles(slot, event.target.files)}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`${title} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-xs text-white/60">
              <span className="text-sm font-semibold">Upload image</span>
              <span className="text-[11px] text-white/40">PNG, JPG or WEBP</span>
            </div>
          )}
          {uploading ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45">
              <div className="flex items-center gap-2 rounded-full border border-blue-400/60 bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                Uploading...
              </div>
            </div>
          ) : null}
        </label>

        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span className={uploading ? 'text-blue-200' : undefined}>
            {uploading ? 'Uploading...' : 'Max 10MB.'}
          </span>
          <span>{previewUrl ? 'Image attached' : 'No image'}</span>
        </div>
        {errors[slot] ? (
          <p className="text-xs text-rose-400">{errors[slot]}</p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {renderSlot('first', 'First frame', firstValue ?? null)}
        {renderSlot('last', 'Last frame', lastValue ?? null)}
      </div>
      {helperText ? (
        <p className="text-xs text-white/50">{helperText}</p>
      ) : null}
      <p className="text-[11px] text-white/40">
        Limit: up to 2 images, max {normalizedMaxSize}MB each.
      </p>
    </div>
  );
}
