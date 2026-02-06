import { websiteConfig } from '@/config/website';
import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/urls/urls';

export default function robots(): MetadataRoute.Robots {
  const locales = Object.keys(websiteConfig.i18n.locales);
  const localeRootPaths = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/`,
  ]);
  const modelPaths = [
    '/media-studio',
    '/media-studio/sora2',
    '/media-studio/veo3',
    '/media-studio/kling-2-6',
    '/media-studio/nano-banana',
    '/media-studio/nano-banana-pro',
    '/media-studio/gpt-image-1-5',
    '/media-studio/z-image',
  ];
  const localeModelPaths = locales.flatMap((locale) =>
    modelPaths.map((path) => `/${locale}${path}`)
  );
  return {
    rules: {
      userAgent: '*',
      allow: ['/', ...localeRootPaths, ...modelPaths, ...localeModelPaths],
      disallow: ['/*'],
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
