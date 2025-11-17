'use server';

import { SDK } from './sdk';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  bookCount: number;
  subcategories: Category[];
  featured: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string;
    price: number;
    rating: number;
  }>;
}

export async function getCategoryDetails(categorySlug: string): Promise<Category | null> {
  const sdk = SDK.getInstance();

  try {
    const categories = await sdk.query('categories', {
      where: { slug: categorySlug }
    });

    if (!categories || categories.length === 0) return null;

    const category = categories[0];

    // Get subcategories
    const subcategories = await sdk.query('categories', {
      where: { parentId: category._id }
    });

    // Get book count
    const bookCount = await sdk.count('books', {
      where: { category: category._id }
    });

    // Get featured books
    const featured = await sdk.query('books', {
      where: { category: category._id, featured: true },
      limit: 6,
      orderBy: { rating: 'desc' }
    });

    return {
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      image: category.image,
      bookCount,
      subcategories: subcategories.map((s: any) => ({
        id: s._id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        bookCount: 0,
        subcategories: [],
        featured: []
      })),
      featured: featured.map((b: any) => ({
        id: b._id,
        title: b.title,
        author: b.author,
        coverImage: b.coverImage,
        price: b.price,
        rating: b.rating || 0
      }))
    };
  } catch (error) {
    console.error('[v0] Failed to get category:', error);
    return null;
  }
}

export async function getCategoryHierarchy(): Promise<Category[]> {
  const sdk = SDK.getInstance();

  try {
    const topLevelCategories = await sdk.query('categories', {
      where: { parentId: null },
      orderBy: { order: 'asc' }
    });

    const withSubcategories = await Promise.all(
      topLevelCategories.map(async (cat: any) => {
        const subs = await sdk.query('categories', {
          where: { parentId: cat._id },
          orderBy: { order: 'asc' }
        });

        const bookCount = await sdk.count('books', { where: { category: cat._id } });

        return {
          id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          image: cat.image,
          bookCount,
          subcategories: subs.map((s: any) => ({
            id: s._id,
            name: s.name,
            slug: s.slug,
            description: s.description,
            bookCount: 0,
            subcategories: [],
            featured: []
          })),
          featured: []
        };
      })
    );

    return withSubcategories;
  } catch (error) {
    console.error('[v0] Failed to get category hierarchy:', error);
    return [];
  }
}
