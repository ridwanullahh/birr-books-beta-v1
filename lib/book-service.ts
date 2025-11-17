import { sdk } from './sdk';
import { BirrError, ValidationError, NotFoundError } from './errors';

export interface Book {
  id: string;
  uid: string;
  title: string;
  subtitle?: string;
  authorId: string;
  price: number;
  discountPrice?: number;
  isbn?: string;
  category: string;
  description: string;
  cover: string;
  formats: string[];
  stock: number;
  rating: number;
  reviews: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class BookService {
  static async createBook(bookData: Partial<Book>): Promise<Book> {
    try {
      if (!bookData.title || !bookData.price) {
        throw new ValidationError('Title and price are required');
      }

      const book = await sdk.insert<Book>('books', {
        ...bookData,
        rating: 0,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      console.log(`[BOOKS] Created book: ${book.id}`);
      return book;
    } catch (error) {
      console.error('[BOOKS] Create book error:', error);
      throw error;
    }
  }

  static async updateBook(bookId: string, updates: Partial<Book>): Promise<Book> {
    try {
      const books = await sdk.get<Book>('books');
      const book = books.find(b => b.id === bookId);

      if (!book) {
        throw new NotFoundError('Book');
      }

      return await sdk.update('books', bookId, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('[BOOKS] Update book error:', error);
      throw error;
    }
  }

  static async deleteBook(bookId: string): Promise<void> {
    try {
      await sdk.delete('books', bookId);
      console.log(`[BOOKS] Deleted book: ${bookId}`);
    } catch (error) {
      console.error('[BOOKS] Delete book error:', error);
      throw error;
    }
  }

  static async getBooks(filters?: any): Promise<Book[]> {
    try {
      let books = await sdk.get<Book>('books');

      if (filters?.category) {
        books = books.filter(b => b.category === filters.category);
      }
      if (filters?.authorId) {
        books = books.filter(b => b.authorId === filters.authorId);
      }

      return books;
    } catch (error) {
      console.error('[BOOKS] Get books error:', error);
      throw error;
    }
  }

  static async getBook(bookId: string): Promise<Book | null> {
    try {
      const books = await sdk.get<Book>('books');
      return books.find(b => b.id === bookId) || null;
    } catch (error) {
      console.error('[BOOKS] Get book error:', error);
      return null;
    }
  }
}
