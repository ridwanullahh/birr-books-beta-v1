import { sdk } from './sdk';
import { BirrError, NotFoundError } from './errors';

export interface LibraryItem {
  id: string;
  uid: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  format: string;
  purchaseDate: Date;
  downloadUrl?: string;
  progress: number; // 0-100
  lastReadAt?: Date;
  bookmarks: string[];
  highlights: Array<{ text: string; page: number }>;
}

export class LibraryService {
  static async addToLibrary(
    userId: string,
    bookId: string,
    book: any,
    format: string,
    downloadUrl?: string
  ): Promise<LibraryItem> {
    try {
      const library = await sdk.get<LibraryItem>('library');

      // Check if already in library
      if (library.some(item => item.userId === userId && item.bookId === bookId)) {
        throw new BirrError('Book already in your library', 'DUPLICATE_LIBRARY_ITEM', 409);
      }

      const libraryItem = await sdk.insert<LibraryItem>('library', {
        userId,
        bookId,
        bookTitle: book.title,
        bookCover: book.cover,
        format,
        downloadUrl,
        purchaseDate: new Date(),
        progress: 0,
        bookmarks: [],
        highlights: [],
      } as any);

      console.log(`[LIBRARY] Added book to library: ${userId}/${bookId}`);
      return libraryItem;
    } catch (error) {
      console.error('[LIBRARY] Add to library error:', error);
      throw error;
    }
  }

  static async getLibrary(userId: string): Promise<LibraryItem[]> {
    try {
      const library = await sdk.get<LibraryItem>('library');
      return library.filter(item => item.userId === userId);
    } catch (error) {
      console.error('[LIBRARY] Get library error:', error);
      throw error;
    }
  }

  static async updateProgress(
    userId: string,
    bookId: string,
    progress: number
  ): Promise<LibraryItem> {
    try {
      const library = await sdk.get<LibraryItem>('library');
      const item = library.find(
        lib => lib.userId === userId && lib.bookId === bookId
      );

      if (!item) {
        throw new NotFoundError('Book not found in library');
      }

      return await sdk.update('library', item.id, {
        progress: Math.min(100, Math.max(0, progress)),
        lastReadAt: new Date(),
      });
    } catch (error) {
      console.error('[LIBRARY] Update progress error:', error);
      throw error;
    }
  }

  static async addBookmark(userId: string, bookId: string, page: number): Promise<LibraryItem> {
    try {
      const library = await sdk.get<LibraryItem>('library');
      const item = library.find(
        lib => lib.userId === userId && lib.bookId === bookId
      );

      if (!item) {
        throw new NotFoundError('Book not found in library');
      }

      const bookmarks = [...(item.bookmarks || []), page.toString()];
      return await sdk.update('library', item.id, { bookmarks });
    } catch (error) {
      console.error('[LIBRARY] Add bookmark error:', error);
      throw error;
    }
  }

  static async addHighlight(
    userId: string,
    bookId: string,
    text: string,
    page: number
  ): Promise<LibraryItem> {
    try {
      const library = await sdk.get<LibraryItem>('library');
      const item = library.find(
        lib => lib.userId === userId && lib.bookId === bookId
      );

      if (!item) {
        throw new NotFoundError('Book not found in library');
      }

      const highlights = [...(item.highlights || []), { text, page }];
      return await sdk.update('library', item.id, { highlights });
    } catch (error) {
      console.error('[LIBRARY] Add highlight error:', error);
      throw error;
    }
  }
}
