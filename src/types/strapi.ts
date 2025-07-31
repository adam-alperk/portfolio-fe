export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface MediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large?: MediaFormat;
      medium?: MediaFormat;
      small?: MediaFormat;
      thumbnail: MediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Project {
  id: number;
  attributes: {
    title: string;
    description: string;
    technologies: string[];
    github_url?: string;
    live_url?: string;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    featured_image: {
      data: StrapiMedia;
    };
    gallery?: {
      data: StrapiMedia[];
    };
  };
}

export interface About {
  id: number;
  attributes: {
    bio: string;
    skills: string[];
    resume_url?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    profile_image: {
      data: StrapiMedia;
    };
  };
}

export interface BlogPost {
  id: number;
  attributes: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    published_date: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    featured_image: {
      data: StrapiMedia;
    };
  };
}
