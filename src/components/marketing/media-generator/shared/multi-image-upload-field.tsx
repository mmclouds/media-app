'use client';

import {
  buildPublicFileDownloadUrl,
  uploadFileToBucket,
} from '@/lib/file-transfer';
import { useMemo, useRef, useState } from 'react';
import { RemoteImagePickerDialog } from './remote-image-picker-dialog';

type MultiImageUploadFieldProps = {
  label: string;
  bucket?: string;
  apiBaseUrl?: string;
  fileName?: string;
  value?: string[] | null;
  onChange: (value: string[]) => void;
  helperText?: string;
  maxSize?: number;
  maxFiles?: number;
  onUploaded?: (
    files: {
      uuid: string;
      downloadUrl: string;
      bucketName?: string;
      objectKey?: string;
      fileName?: string;
    }[]
  ) => void;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function MultiImageUploadField({
  label,
  bucket,
  apiBaseUrl,
  fileName,
  value,
  onChange,
  helperText,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 10,
  onUploaded,
}: MultiImageUploadFieldProps) {
  const normalizedMaxSize = Math.max(1, Math.ceil(maxSize / (1024 * 1024)));
  const normalizedMaxFiles = Math.max(1, Math.floor(maxFiles));
  const resolvedBucket =
    bucket || process.env.NEXT_PUBLIC_UPLOAD_BUCKET || '0-image';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteOpen, setRemoteOpen] = useState(false);
  const fallbackTenantId = useMemo(
    () => process.env.NEXT_PUBLIC_TENANT_ID || '0',
    []
  );

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

  const resolvedValue = Array.isArray(value) ? value : [];
  const canAddMore = resolvedValue.length < normalizedMaxFiles;
  const previewItems = useMemo(
    () =>
      resolvedValue
        .map((item, index) => ({
          index,
          previewUrl: resolvePreviewUrl(item),
        }))
        .filter((item): item is { index: number; previewUrl: string } =>
          Boolean(item.previewUrl)
        ),
    [resolvedValue, fallbackTenantId, apiBaseUrl]
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(files);

    if (resolvedValue.length + selectedFiles.length > normalizedMaxFiles) {
      setError(`You can upload up to ${normalizedMaxFiles} images.`);
      return;
    }

    if (selectedFiles.some((file) => file.size > maxSize)) {
      setError(`Each file must be under ${normalizedMaxSize}MB.`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const uploadedFiles: {
      uuid: string;
      downloadUrl: string;
      bucketName?: string;
      objectKey?: string;
      fileName?: string;
    }[] = [];

    for (const [index, file] of selectedFiles.entries()) {
      try {
        const resolvedFileName = fileName
          ? `${fileName}-${Date.now()}-${index + 1}`
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

        uploadedFiles.push({
          uuid: result.uuid,
          downloadUrl,
          bucketName: result.bucketName,
          objectKey: result.objectKey,
          fileName: resolvedFileName || result.objectKey,
        });
      } catch (uploadError) {
        console.error('上传图片失败', uploadError);
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : 'Failed to upload image.';
        setError(message);
        break;
      }
    }

    if (uploadedFiles.length > 0) {
      const nextUrls = [
        ...resolvedValue,
        ...uploadedFiles.map((item) => item.downloadUrl),
      ];
      onChange(nextUrls);
      onUploaded?.(uploadedFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
        {resolvedValue.length > 0 ? (
          <button
            type="button"
            className="text-xs font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
            onClick={() => onChange([])}
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div
        className={`relative rounded-2xl border border-dashed border-white/20 bg-black/60 p-3 transition hover:border-white/40 hover:bg-white/5 ${
          isDragging ? 'border-white/50 bg-white/10' : ''
        } ${
          isUploading
            ? 'border-blue-400/70 bg-blue-500/10 shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_0_24px_rgba(249,115,22,0.25)]'
            : ''
        }`}
        aria-busy={isUploading}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isUploading) {
            setIsDragging(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isUploading) {
            event.dataTransfer.dropEffect = 'copy';
            setIsDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (isUploading) {
            return;
          }
          handleFiles(event.dataTransfer.files);
        }}
      >
        <div className="flex flex-wrap gap-3">
          {previewItems.map((item) => (
            <div
              key={`${item.previewUrl}-${item.index}`}
              className="group relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-black/40"
            >
              <img
                src={item.previewUrl}
                alt="Reference"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white/80 opacity-0 transition group-hover:opacity-100"
                onClick={() => {
                  const next = resolvedValue.filter(
                    (_, index) => index !== item.index
                  );
                  onChange(next);
                }}
              >
                Remove
              </button>
            </div>
          ))}

          {canAddMore ? (
            <label
              className={`group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/60 text-3xl font-semibold text-white/60 transition hover:border-white/40 hover:text-white ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
              aria-label="Add image"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
                onChange={(event) => handleFiles(event.target.files)}
              />
              <span aria-hidden="true">+</span>
            </label>
          ) : null}
        </div>
        {isUploading ? (
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-full border border-blue-400/60 bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            Uploading...
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-xs text-white/60">
        <span className={isUploading ? 'text-blue-200' : undefined}>
          {isUploading
            ? 'Uploading images...'
            : `Up to ${normalizedMaxFiles} images.`}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
            onClick={() => setRemoteOpen(true)}
          >
            Choose from library
          </button>
          <span>
            {resolvedValue.length}/{normalizedMaxFiles}
          </span>
        </div>
      </div>

      {helperText ? (
        <p className="text-xs text-white/50">{helperText}</p>
      ) : null}
      <p className="text-[11px] text-white/40">
        Limit: up to {normalizedMaxFiles} images, max {normalizedMaxSize}MB
        each.
      </p>
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
      <RemoteImagePickerDialog
        open={remoteOpen}
        onOpenChange={setRemoteOpen}
        apiBaseUrl={apiBaseUrl}
        onSelect={(item) => {
          if (!canAddMore) {
            setError(`You can upload up to ${normalizedMaxFiles} images.`);
            return;
          }
          setError(null);
          const nextUrls = [...resolvedValue, item.downloadUrl].slice(
            0,
            normalizedMaxFiles
          );
          onChange(nextUrls);
          onUploaded?.([
            {
              uuid: item.fileUuid,
              downloadUrl: item.downloadUrl,
            },
          ]);
        }}
      />
    </div>
  );
}
