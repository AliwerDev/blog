import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/new-post'],
    },
    sitemap: 'https://alisher.blog/sitemap.xml',
  };
}
