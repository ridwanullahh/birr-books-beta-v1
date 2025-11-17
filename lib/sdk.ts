import { UniversalSDK } from './universal-sdk';

export { UniversalSDK as SDK };

// Initialize SDK with GitHub backend
export const sdk = new UniversalSDK({
  owner: process.env.GITHUB_OWNER!,
  repo: process.env.GITHUB_REPO!,
  token: process.env.GITHUB_TOKEN!,
  branch: process.env.GITHUB_BRANCH || 'main',
  basePath: 'db',
  mediaPath: 'media',
  cloudinary: {
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  smtp: {
    // Will be replaced with Nodemailer in email service
    endpoint: undefined,
  },
  auth: {
    requireEmailVerification: true,
    otpTriggers: ['register', 'login', 'passwordReset'],
  },
  paymentGateways: {
    paystack: {
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      secretKey: process.env.PAYSTACK_SECRET_KEY,
    },
    stripe: {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
    },
  },
});

// Initialize all required schemas and collections on startup
export async function initializeDatabase() {
  try {
    // Collections with their schemas
    const collections = {
      users: {
        required: ['email', 'password'],
        types: {
          email: 'string',
          password: 'string',
          name: 'string',
          phone: 'string',
          role: 'string',
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
          publisherId: 'string',
          price: 'number',
          discountPrice: 'number',
          isbn: 'string',
          category: 'string',
          subcategory: 'string',
          description: 'string',
          cover: 'string',
          formats: 'array',
          stock: 'number',
          rating: 'number',
          reviews: 'array',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
      audiobooks: {
        required: ['title', 'authorId', 'narratorId', 'price'],
        types: {
          title: 'string',
          authorId: 'string',
          narratorId: 'string',
          duration: 'number',
          price: 'number',
          description: 'string',
          cover: 'string',
          chapters: 'array',
          previewUrl: 'string',
          downloadUrl: 'string',
          createdAt: 'date',
        },
      },
      authors: {
        required: ['name'],
        types: {
          name: 'string',
          bio: 'string',
          photo: 'string',
          email: 'string',
          socialLinks: 'object',
          books: 'array',
        },
      },
      orders: {
        required: ['userId', 'items', 'total', 'status'],
        types: {
          userId: 'string',
          items: 'array',
          total: 'number',
          discountCode: 'string',
          discountAmount: 'number',
          shippingCost: 'number',
          status: 'string',
          paymentMethod: 'string',
          paymentStatus: 'string',
          shippingAddress: 'object',
          trackingNumber: 'string',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
      cart: {
        required: ['userId', 'items'],
        types: {
          userId: 'string',
          items: 'array',
          total: 'number',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
      wishlist: {
        required: ['userId', 'items'],
        types: {
          userId: 'string',
          items: 'array',
          createdAt: 'date',
        },
      },
      reviews: {
        required: ['userId', 'bookId', 'rating', 'text'],
        types: {
          userId: 'string',
          bookId: 'string',
          rating: 'number',
          text: 'string',
          helpful: 'number',
          createdAt: 'date',
        },
      },
      blogs: {
        required: ['title', 'authorId', 'content'],
        types: {
          title: 'string',
          slug: 'string',
          authorId: 'string',
          content: 'string',
          excerpt: 'string',
          featuredImage: 'string',
          categories: 'array',
          tags: 'array',
          published: 'boolean',
          publishedAt: 'date',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
      discounts: {
        required: ['code', 'type', 'value'],
        types: {
          code: 'string',
          type: 'string',
          value: 'number',
          minPurchase: 'number',
          maxUses: 'number',
          usedCount: 'number',
          validFrom: 'date',
          validUntil: 'date',
          createdAt: 'date',
        },
      },
      newsletter: {
        required: ['email'],
        types: {
          email: 'string',
          subscribed: 'boolean',
          subscribedAt: 'date',
        },
      },
      series: {
        required: ['name'],
        types: {
          name: 'string',
          description: 'string',
          cover: 'string',
          books: 'array',
          createdAt: 'date',
        },
      },
      settings: {
        required: ['key', 'value'],
        types: {
          key: 'string',
          value: 'string',
          category: 'string',
        },
      },
    };

    // Ensure all collections exist
    for (const [collectionName, schema] of Object.entries(collections)) {
      const exists = await sdk.collectionExists(collectionName);
      if (!exists) {
        await sdk.save(collectionName, []);
        console.log(`[DB] Created collection: ${collectionName}`);
      }
      sdk.setSchema(collectionName, schema);
      console.log(`[DB] Schema set for collection: ${collectionName}`);
    }

    console.log('[DB] Database initialization complete');
    return true;
  } catch (error) {
    console.error('[DB] Initialization error:', error);
    throw error;
  }
}
