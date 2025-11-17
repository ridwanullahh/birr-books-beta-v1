import { sdk } from './sdk';
import { ValidationError, NotFoundError } from './errors';

export interface BlogPost {
  id: string;
  uid: string;
  title: string;
  slug: string;
  authorId: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class BlogService {
  static async createPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    try {
      if (!postData.title || !postData.content) {
        throw new ValidationError('Title and content are required');
      }

      const slug = postData.slug || this.generateSlug(postData.title);

      const post = await sdk.insert<BlogPost>('blogs', {
        ...postData,
        slug,
        categories: postData.categories || [],
        tags: postData.tags || [],
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      console.log(`[BLOG] Created post: ${post.id}`);
      return post;
    } catch (error) {
      console.error('[BLOG] Create post error:', error);
      throw error;
    }
  }

  static async updatePost(postId: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const posts = await sdk.get<BlogPost>('blogs');
      const post = posts.find(p => p.id === postId);

      if (!post) {
        throw new NotFoundError('Blog post');
      }

      return await sdk.update('blogs', postId, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('[BLOG] Update post error:', error);
      throw error;
    }
  }

  static async publishPost(postId: string): Promise<BlogPost> {
    try {
      return await this.updatePost(postId, {
        published: true,
        publishedAt: new Date(),
      });
    } catch (error) {
      console.error('[BLOG] Publish post error:', error);
      throw error;
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      await sdk.delete('blogs', postId);
      console.log(`[BLOG] Deleted post: ${postId}`);
    } catch (error) {
      console.error('[BLOG] Delete post error:', error);
      throw error;
    }
  }

  static async getPosts(published?: boolean): Promise<BlogPost[]> {
    try {
      let posts = await sdk.get<BlogPost>('blogs');
      if (published !== undefined) {
        posts = posts.filter(p => p.published === published);
      }
      return posts.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
    } catch (error) {
      console.error('[BLOG] Get posts error:', error);
      throw error;
    }
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
