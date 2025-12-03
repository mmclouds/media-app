'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Clock,
  Headphones,
  Home,
  Image as ImageIcon,
  MoreHorizontal,
  Music,
  Shirt,
  Video,
} from 'lucide-react';

const navItems: Array<{ icon: LucideIcon; label: string; active?: boolean }> = [
  { icon: Home, label: 'Home' },
  { icon: ImageIcon, label: 'Images' },
  { icon: Video, label: 'Videos', active: true },
  { icon: Music, label: 'Audio' },
  { icon: Shirt, label: 'Fashion' },
  { icon: Headphones, label: 'Podcasts' },
  { icon: Clock, label: 'History' },
];

export function MediaGeneratorSidebar() {
  return (
    <aside className="flex h-full w-[72px] flex-col items-center justify-between border-r border-white/5 bg-[#060606] py-5 text-white">
      <div className="flex flex-col items-center gap-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 text-lg font-semibold tracking-tight">
          VA
        </div>

        <nav className="flex flex-col items-center gap-5">
          {navItems.map((item) => (
            <SidebarButton
              key={item.label}
              icon={item.icon}
              active={item.active}
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-5">
        <button className="text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white">
          Sign In
        </button>

        <div className="text-center text-[10px] font-semibold text-[#ccff00]">
          <span className="block rounded-sm border border-[#ccff00] px-1 py-0.5">
            50% OFF
          </span>
          <span className="mt-1 block text-white/70">Creator plan</span>
        </div>

        <button className="text-white/60 transition hover:text-white">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>
    </aside>
  );
}

function SidebarButton({
  icon: Icon,
  active,
}: {
  icon: LucideIcon;
  active?: boolean;
}) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/50 hover:bg-white/5 hover:text-white'
      }`}
      aria-pressed={active}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
