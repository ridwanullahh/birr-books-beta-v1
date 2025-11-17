export const COLLECTION_SCHEMAS = {
  users: {
    required: ['email', 'password'],
    types: {
      email: 'string',
      password: 'string',
      name: 'string',
      phone: 'string',
      role: 'string', // 'admin' | 'user'
      permissions: 'array',
      verified: 'boolean',
      createdAt: 'date',
      updatedAt: 'date',
    },
  },
  books: {
    required: ['title', 'authorId', 'price'],
    types: {
      title: 'string',
      subtitle: 'string',
      authorId: 'string',
      price: 'number',
      discountPrice: 'number',
      isbn: 'string',
      category: 'string',
      description: 'string',
      cover: 'string',
      formats: 'array',
      stock: 'number',
      rating: 'number',
      createdAt: 'date',
    },
  },
  // ... other schemas
} as const;

export type CollectionName = keyof typeof COLLECTION_SCHEMAS;
