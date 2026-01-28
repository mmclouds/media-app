'use client';

import {
  buildPublicFileDownloadUrl,
  uploadFileToBucket,
} from '@/lib/file-transfer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RemoteImagePickerDialog } from './remote-image-picker-dialog';

type SingleImageUploadFieldProps = {
  label: string;
  bucket?: string;
  apiBaseUrl?: string;
  fileName?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  helperText?: string;
  maxSize?: number;
  onUploaded?: (params: {
    uuid: string;
    downloadUrl: string;
    bucketName?: string;
    objectKey?: string;
    fileName?: string;
  }) => void;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function SingleImageUploadField({
  label,
  bucket,
  apiBaseUrl,
  fileName,
  value,
  onChange,
  helperText,
  maxSize = 8 * 1024 * 1024,
  onUploaded,
}: SingleImageUploadFieldProps) {
  const normalizedMaxSize = Math.max(1, Math.ceil(maxSize / (1024 * 1024)));
  const resolvedBucket =
    bucket || process.env.NEXT_PUBLIC_UPLOAD_BUCKET || '0-image';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  useEffect(() => {
    setPreviewUrl((previous) => {
      if (previous?.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }
      return resolvePreviewUrl(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fallbackTenantId, apiBaseUrl]);

  useEffect(
    () => () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

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
    setIsUploading(true);

    const tempPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(tempPreviewUrl);

    try {
      const result = await uploadFileToBucket({
        file,
        bucket: resolvedBucket,
        fileName,
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

      setPreviewUrl(downloadUrl);
      onChange(downloadUrl);
      onUploaded?.({
        uuid: result.uuid,
        downloadUrl,
        bucketName: result.bucketName,
        objectKey: result.objectKey,
        fileName: fileName || result.objectKey,
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (uploadError) {
      console.error('上传图片失败', uploadError);
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : 'Failed to upload image.';
      setError(message);
      setPreviewUrl(resolvePreviewUrl(value));
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(tempPreviewUrl);
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
            onClick={() => {
              setPreviewUrl(null);
              onChange(null);
            }}
          >
            Remove
          </button>
        ) : null}
      </div>

      <label
        className={`group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/20 bg-black/60 transition hover:border-white/40 hover:bg-white/5 ${
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
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <div className="flex flex-col gap-3 p-4 text-sm text-white/70">
          {previewUrl ? (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <img
                src={previewUrl}
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
            <span
              className={`text-xs ${isUploading ? 'text-blue-200' : 'text-white/60'}`}
            >
              {isUploading
                ? 'Uploading image...'
                : 'Attach an image to guide the video.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/30 hover:bg-white/20"
                onClick={(event) => {
                  event.preventDefault();
                  setRemoteOpen(true);
                }}
              >
                Choose from library
              </button>
              <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white transition group-hover:bg-white/20">
                {previewUrl ? 'Replace image' : 'Upload image'}
              </span>
            </div>
          </div>
        </div>
        {isUploading ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45">
            <div className="flex items-center gap-2 rounded-full border border-blue-400/60 bg-black/70 px-3 py-1 text-xs font-semibold text-white">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
              Uploading...
            </div>
          </div>
        ) : null}
      </label>
      <RemoteImagePickerDialog
        open={remoteOpen}
        onOpenChange={setRemoteOpen}
        apiBaseUrl={apiBaseUrl}
        onSelect={(item) => {
          setError(null);
          setPreviewUrl(item.downloadUrl);
          onChange(item.downloadUrl);
          onUploaded?.({
            uuid: item.fileUuid,
            downloadUrl: item.downloadUrl,
          });
        }}
      />
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
