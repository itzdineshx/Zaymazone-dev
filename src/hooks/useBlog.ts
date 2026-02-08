import { useState, useEffect } from 'react';
import { api, getImageUrl } from '../lib/api';

export interface Author {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: Author;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  readTime: string;
  publishedAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

// Helper function to transform blog post image URLs
const transformBlogPost = (post: any): BlogPost => {
  return {
    ...post,
    featuredImage: getImageUrl(post.featuredImage),
    author: {
      ...post.author,
      avatar: getImageUrl(post.author.avatar)
    }
  };
};

export const useBlogPosts = (filters: BlogFilters = {}) => {
  const [data, setData] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {};
        if (filters.category) params.category = filters.category;
        if (filters.tag) params.tag = filters.tag;
        if (filters.search) params.search = filters.search;
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
        if (filters.featured !== undefined) params.featured = filters.featured;

        const result = await api.getBlogPosts(params);
        
        // Transform image URLs for all posts
        const transformedPosts = result.posts.map(transformBlogPost);
        setData({
          ...result,
          posts: transformedPosts
        });
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [filters.category, filters.tag, filters.search, filters.page, filters.limit, filters.featured]);

  return { data, loading, error };
};

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const result = await api.getBlogPost(slug);
        setPost(transformBlogPost(result));
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  return { post, loading, error };
};

export const useFeaturedBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await api.getFeaturedBlogPosts();
        setPosts(result.map(transformBlogPost));
      } catch (err) {
        console.error('Error fetching featured posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch featured posts');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  return { posts, loading, error };
};

export const useBlogCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await api.getBlogCategories();
        setCategories(result);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useBlogTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await api.getBlogTags();
        setTags(result);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
};

// Blog actions
export const likeBlogPost = async (postId: string): Promise<{ success: boolean; likes: number }> => {
  try {
    const result = await api.likeBlogPost(postId);
    return { success: true, likes: result.likes };
  } catch (error) {
    console.error('Error liking post:', error);
    return { success: false, likes: 0 };
  }
};

export const getRelatedPosts = async (postId: string): Promise<BlogPost[]> => {
  try {
    const result = await api.getRelatedBlogPosts(postId);
    return result.map(transformBlogPost);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};