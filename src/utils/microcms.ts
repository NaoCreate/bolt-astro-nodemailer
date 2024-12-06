import { createClient } from 'microcms-js-sdk';

if (!import.meta.env.MICROCMS_SERVICE_DOMAIN || !import.meta.env.MICROCMS_API_KEY) {
  throw new Error('Missing required environment variables for microCMS');
}

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export interface Category {
  id: string;
  name: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  category: Category;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  publishedAt: string;
  revisedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  contents: Blog[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface CategoryResponse {
  contents: Category[];
  totalCount: number;
  offset: number;
  limit: number;
}