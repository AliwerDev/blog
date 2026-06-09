import { MetadataRoute } from 'next';
import { getPosts, Post } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alisher.blog';
  
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch (error) {
    console.error('Sitemap post fetch error:', error);
  }

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.2,
    },
    ...postUrls,
  ];
}
