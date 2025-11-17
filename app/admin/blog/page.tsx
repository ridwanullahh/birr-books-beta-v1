'use client';

import { useEffect, useState } from 'react';
import { BlogService } from '@/lib/blog-service';
import Link from 'next/link';
import { BRAND_COLORS } from '@/lib/constants';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await BlogService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure?')) {
      try {
        await BlogService.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Blog Management</h1>
        <Link
          href="/admin/blog/create"
          className="rounded-lg px-6 py-2 text-white font-semibold"
          style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
        >
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Published</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-dark">{post.title}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
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
