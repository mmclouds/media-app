'use client';

import {
  Dialog,
  DialogContent,
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
        className="max-w-4xl max-h-[85vh] h-[85vh] p-6 bg-[#0a0a0a] border border-white/10"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AssetsManager mode="dialog" onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}