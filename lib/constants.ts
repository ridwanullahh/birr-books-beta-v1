// Brand colors and constants
export const BRAND_COLORS = {
  PRIMARY_GREEN: '#05B34D',
  ACCENT_GOLD: '#F2B91C',
  DARK_SLATE: '#181F25',
  MINTED_GLOW: '#E9FBF1',
  UTILITY_WHITE: '#FFFFFF',
  NEUTRAL_GRAY: '#6B7280',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  AUTHOR: 'author',
  MODERATOR: 'moderator',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const BOOK_FORMATS = {
  PDF: 'pdf',
  EPUB: 'epub',
  MOBI: 'mobi',
  PHYSICAL: 'physical',
  AUDIOBOOK: 'audiobook',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  BOOKS: '/api/books',
  ORDERS: '/api/orders',
  CART: '/api/cart',
  USERS: '/api/users',
  ADMIN: '/api/admin',
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_BOOK_PRICE: 0,
  MAX_BOOK_PRICE: 1000000,
  OTP_EXPIRY_MINUTES: 10,
} as const;
