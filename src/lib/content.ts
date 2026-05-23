import matter from 'gray-matter';
import { ContentFile, ContentMetadata } from '../types';

export async function getAllContent(): Promise<ContentFile[]> {
  const response = await fetch('/api/content');
  if (!response.ok) throw new Error('Failed to fetch content');
  const data = await response.json();
  
  return data.map((item: any) => {
    const { data: metadata, content } = matter(item.content);
    return {
      metadata: { ...metadata, type: item.type } as ContentMetadata,
      content,
    };
  });
}

export async function saveContent(type: string, slug: string, content: string) {
  const response = await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, slug, content }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save content');
  }
  return response.json();
}

export async function generateContentFromAI(type: string, query: string): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, query }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate content');
  }
  const data = await response.json();
  return data.mdx;
}
