'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@/lib/sdk';
import { BookService } from '@/lib/book-service';
import Link from 'next/link';
import { BRAND_COLORS } from '@/lib/constants';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await BookService.getBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId: string) => {
    if (confirm('Are you sure?')) {
      try {
        await BookService.deleteBook(bookId);
        setBooks(books.filter(b => b.id !== bookId));
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Books Management</h1>
        <Link
          href="/admin/books/create"
          className="rounded-lg px-6 py-2 text-white font-semibold"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
        >
          Add New Book
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Author</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-dark">{book.title}</td>
                <td className="px-6 py-4 text-sm text-gray">{book.authorId}</td>
                <td className="px-6 py-4 text-sm text-dark font-semibold">${book.price}</td>
                <td className="px-6 py-4 text-sm text-dark">{book.stock}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/admin/books/${book.id}`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
