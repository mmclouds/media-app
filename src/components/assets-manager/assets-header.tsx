import { X } from 'lucide-react';
import { AssetsManagerProps } from './types';

interface AssetsHeaderProps {
  mode: 'dialog' | 'page';
  onClose?: () => void;
  className?: string;
}

export function AssetsHeader({ mode, onClose, className }: AssetsHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <h2 className="text-lg font-semibold text-white">Assets Manager</h2>
      {mode === 'dialog' && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}