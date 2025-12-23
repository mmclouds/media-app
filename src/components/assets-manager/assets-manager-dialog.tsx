'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AssetsManager } from './assets-manager';
import type { AssetsManagerDialogProps } from './types';

export function AssetsManagerDialog({
  open,
  onOpenChange,
  trigger,
}: AssetsManagerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="inset-0 translate-x-0 translate-y-0 w-[100dvw] h-[100dvh] max-w-none max-h-none p-6 bg-[#0a0a0a] border border-white/10 rounded-none flex flex-col min-h-0 sm:max-w-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Assets Manager</DialogTitle>
        <AssetsManager mode="dialog" onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
