'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname?.includes('/media-studio');

  return (
    <div className="flex min-h-screen flex-col">
      {!hideFooter && <Navbar scroll={true} />}
      <main className="flex-1 min-h-0">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
