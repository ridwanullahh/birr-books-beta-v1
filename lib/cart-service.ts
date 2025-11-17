import { sdk } from './sdk';
import { BirrError, NotFoundError, ValidationError } from './errors';

export interface CartItem {
  bookId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  uid: string;
  userId: string;
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CartService {
  static async getCart(userId: string): Promise<Cart | null> {
    try {
      const carts = await sdk.get<Cart>('cart');
      return carts.find(c => c.userId === userId) || null;
    } catch (error) {
      console.error('[CART] Get cart error:', error);
      return null;
    }
  }

  static async addToCart(userId: string, bookId: string, quantity: number = 1): Promise<Cart> {
    try {
      if (quantity < 1) {
        throw new ValidationError('Quantity must be at least 1');
      }

      const books = await sdk.get('books');
      const book = books.find((b: any) => b.id === bookId);

      if (!book) {
        throw new NotFoundError('Book');
      }

      let cart = await this.getCart(userId);

      if (!cart) {
        // Create new cart
        cart = await sdk.insert<Cart>('cart', {
          userId,
          items: [{ bookId, quantity, price: book.price }],
          total: book.price * quantity,
          discountAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any);
      } else {
        // Update existing cart
        const existingItem = cart.items.find(item => item.bookId === bookId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ bookId, quantity, price: book.price });
        }

        const newTotal = cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        cart = await sdk.update('cart', cart.id, {
          items: cart.items,
          total: newTotal,
          updatedAt: new Date(),
        });
      }

      console.log(`[CART] Added to cart: ${userId}/${bookId}`);
      return cart;
    } catch (error) {
      console.error('[CART] Add to cart error:', error);
      throw error;
    }
  }

  static async removeFromCart(userId: string, bookId: string): Promise<Cart> {
    try {
      const cart = await this.getCart(userId);
      if (!cart) {
        throw new NotFoundError('Cart');
      }

      cart.items = cart.items.filter(item => item.bookId !== bookId);
      const newTotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const updated = await sdk.update('cart', cart.id, {
        items: cart.items,
        total: newTotal,
        updatedAt: new Date(),
      });

      console.log(`[CART] Removed from cart: ${userId}/${bookId}`);
      return updated;
    } catch (error) {
      console.error('[CART] Remove from cart error:', error);
      throw error;
    }
  }

  static async updateQuantity(userId: string, bookId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity < 0) {
        throw new ValidationError('Quantity cannot be negative');
      }

      const cart = await this.getCart(userId);
      if (!cart) {
        throw new NotFoundError('Cart');
      }

      if (quantity === 0) {
        return this.removeFromCart(userId, bookId);
      }

      const item = cart.items.find(i => i.bookId === bookId);
      if (!item) {
        throw new NotFoundError('Item not in cart');
      }

      item.quantity = quantity;
      const newTotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return await sdk.update('cart', cart.id, {
        items: cart.items,
        total: newTotal,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('[CART] Update quantity error:', error);
      throw error;
    }
  }

  static async applyCoupon(userId: string, code: string): Promise<Cart> {
    try {
      const cart = await this.getCart(userId);
      if (!cart) {
        throw new NotFoundError('Cart');
      }

      const discounts = await sdk.get('discounts');
      const discount = discounts.find((d: any) => d.code === code);

      if (!discount) {
        throw new BirrError('Discount code not found', 'INVALID_DISCOUNT', 404);
      }

      if (discount.usedCount >= discount.maxUses) {
        throw new BirrError('Discount code has expired', 'DISCOUNT_EXPIRED', 400);
      }

      let discountAmount = 0;
      if (discount.type === 'percentage') {
        discountAmount = (cart.total * discount.value) / 100;
      } else if (discount.type === 'fixed') {
        discountAmount = discount.value;
      }

      return await sdk.update('cart', cart.id, {
        discountCode: code,
        discountAmount,
        total: Math.max(0, cart.total - discountAmount),
      });
    } catch (error) {
      console.error('[CART] Apply coupon error:', error);
      throw error;
    }
  }

  static async clearCart(userId: string): Promise<void> {
    try {
      const cart = await this.getCart(userId);
      if (cart) {
        await sdk.delete('cart', cart.id);
      }
    } catch (error) {
      console.error('[CART] Clear cart error:', error);
      throw error;
    }
  }
}
