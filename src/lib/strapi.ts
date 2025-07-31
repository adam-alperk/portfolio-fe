import { StrapiResponse, Project, About, BlogPost } from "@/types/strapi";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchAPI<T>(
  endpoint: string,
): Promise<StrapiResponse<T>> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}?populate=*`, {
    headers: {
      "Content-Type": "application/json",
    },
    // Add cache options for production
    ...(process.env.NODE_ENV === "production" && {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetchAPI<Project[]>("/projects");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const response = await fetchAPI<Project>(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function getAbout(): Promise<About | null> {
  try {
    const response = await fetchAPI<About>("/about");
    return response.data;
  } catch (error) {
    console.error("Error fetching about:", error);
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await fetchAPI<BlogPost[]>("/blog-posts");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetchAPI<BlogPost[]>(
      `/blog-posts?filters[slug][$eq]=${slug}`,
    );
    return Array.isArray(response.data) && response.data.length > 0
      ? response.data[0]
      : null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Helper function to get full URL for Strapi media
export function getStrapiURL(path: string = ""): string {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(media: any): string {
  if (!media?.data?.attributes?.url) return "";
  const { url } = media.data.attributes;
  return url.startsWith("/") ? getStrapiURL(url) : url;
}
