'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname?.includes('/media-studio');

  return (
    <div className="flex flex-col min-h-screen">
      {!hideFooter && <Navbar scroll={true} />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
