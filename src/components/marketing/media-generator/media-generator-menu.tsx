'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import { UserAvatar } from '@/components/layout/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditsBalanceMenu } from '@/components/layout/credits-balance-menu';
import { useAvatarLinks } from '@/config/avatar-config';
import { websiteConfig } from '@/config/website';
import { useLocalePathname, useLocaleRouter } from '@/i18n/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { authClient } from '@/lib/auth-client';
import { LogOutIcon, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MediaType, MediaTypeOption } from './types';
import { useTranslations } from 'next-intl';
import { type User } from 'better-auth';
import { toast } from 'sonner';
import { useState } from 'react';

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
    <aside className="flex h-full w-[72px] flex-col items-center justify-between border-r border-white/5 bg-[#060606] pt-5 pb-0 text-white">
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

      <div className="flex flex-col items-center gap-4 pb-6 pt-1">
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

        {currentUser ? <MediaGeneratorUserMenu user={currentUser} /> : null}
      </div>
    </aside>
  );
}

function MediaGeneratorUserMenu({ user }: { user: User }) {
  const t = useTranslations();
  const avatarLinks = useAvatarLinks();
  const localeRouter = useLocaleRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log('sign out success');
          localeRouter.replace('/');
        },
        onError: (error) => {
          console.error('sign out error:', error);
          toast.error(t('Common.logoutFailed'));
        },
      },
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-white/60 transition hover:text-white"
          aria-label="Open user menu"
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={92}
        avoidCollisions={false}
        className="max-h-[calc(100vh-16px)] min-w-[220px] origin-bottom-left shadow-2xl"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {websiteConfig.credits.enableCredits && (
          <>
            <DropdownMenuItem className="cursor-pointer">
              <CreditsBalanceMenu />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {avatarLinks.map((item) => (
          <DropdownMenuItem
            key={item.title}
            className="cursor-pointer"
            onClick={() => {
              if (item.href) {
                localeRouter.push(item.href);
              }
            }}
          >
            <div className="flex items-center space-x-2.5">
              {item.icon ? item.icon : null}
              <p className="text-sm">{item.title}</p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault();
            setOpen(false);
            handleSignOut();
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOutIcon className="size-4" />
            <p className="text-sm">{t('Common.logout')}</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
