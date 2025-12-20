'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import { UserAvatar } from '@/components/layout/user-avatar';
import { UserButton } from '@/components/layout/user-button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useLocalePathname } from '@/i18n/navigation';
import { MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MediaType, MediaTypeOption } from './types';

type MediaGeneratorMenuProps = {
  options: MediaTypeOption[];
  value: MediaType;
  onChange: (value: MediaType) => void;
};

export function MediaGeneratorMenu({
  options,
  value,
  onChange,
}: MediaGeneratorMenuProps) {
  const currentPath = useLocalePathname();
  const currentUser = useCurrentUser();

  return (
    <aside className="flex h-full w-[72px] flex-col items-center justify-between border-r border-white/5 bg-[#060606] py-5 text-white">
      <div className="flex flex-col items-center gap-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 text-lg font-semibold tracking-tight">
          VA
        </div>

        <nav className="flex flex-col items-center gap-5">
          {options.map((item) => (
            <SidebarButton
              key={item.id}
              icon={item.icon}
              active={value === item.id}
              label={item.label}
              onClick={() => onChange(item.id)}
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-5">
        {currentUser ? (
          <UserAvatar
            name={currentUser.name}
            image={currentUser.image}
            className="border border-white/20"
          />
        ) : (
          <LoginWrapper callbackUrl={currentPath}>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white"
            >
              Sign In
            </button>
          </LoginWrapper>
        )}



        {currentUser ? (
          <UserButton
            user={currentUser}
            trigger={
              <button
                type="button"
                className="text-white/60 transition hover:text-white"
              >
                <MoreHorizontal className="h-6 w-6" />
              </button>
            }
          />
        ) : null}
      </div>
    </aside>
  );
}

function SidebarButton({
  icon: Icon,
  active,
  label,
  onClick,
}: {
  icon: LucideIcon;
  active?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${active
          ? 'bg-white/10 text-white'
          : 'text-white/50 hover:bg-white/5 hover:text-white'
        }`}
      aria-pressed={active}
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
