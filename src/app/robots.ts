import { websiteConfig } from '@/config/website';
import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/urls/urls';

export default function robots(): MetadataRoute.Robots {
  const locales = Object.keys(websiteConfig.i18n.locales);
  const localeRootPaths = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/`,
  ]);
  return {
    rules: {
      userAgent: '*',
      allow: ['/', ...localeRootPaths],
      disallow: ['/*'],
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
