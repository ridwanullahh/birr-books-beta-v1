import { sdk } from './sdk';
import { CartService } from './cart-service';
import { LibraryService } from './library-service';
import { BirrError, NotFoundError, ValidationError } from './errors';
import { ORDER_STATUS, PAYMENT_STATUS } from './constants';
import { sendEmail } from './email';

export interface Order {
  id: string;
  uid: string;
  userId: string;
  items: Array<{ bookId: string; title: string; price: number; quantity: number }>;
  total: number;
  discountCode?: string;
  discountAmount: number;
  shippingCost: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderService {
  static async createOrder(
    userId: string,
    paymentMethod: string,
    shippingAddress?: any
  ): Promise<Order> {
    try {
      const cart = await CartService.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new ValidationError('Cart is empty');
      }

      // Get book details
      const books = await sdk.get('books');
      const orderItems = cart.items.map(item => {
        const book = books.find((b: any) => b.id === item.bookId);
        return {
          bookId: item.bookId,
          title: book?.title || 'Unknown Book',
          price: item.price,
          quantity: item.quantity,
        };
      });

      // Create order
      const order = await sdk.insert<Order>('orders', {
        userId,
        items: orderItems,
        total: cart.total,
        discountCode: cart.discountCode,
        discountAmount: cart.discountAmount,
        shippingCost: shippingAddress ? 10 : 0, // Example: $10 shipping
        status: ORDER_STATUS.PENDING,
        paymentMethod,
        paymentStatus: PAYMENT_STATUS.UNPAID,
        shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      // Add books to user's library
      for (const item of orderItems) {
        const book = books.find((b: any) => b.id === item.bookId);
        if (book) {
          await LibraryService.addToLibrary(userId, item.bookId, book, 'digital');
        }
      }

      // Clear cart
      await CartService.clearCart(userId);

      console.log(`[ORDER] Order created: ${order.id}`);
      return order;
    } catch (error) {
      console.error('[ORDER] Create order error:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const orders = await sdk.get<Order>('orders');
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        throw new NotFoundError('Order');
      }

      const updated = await sdk.update('orders', orderId, {
        status,
        updatedAt: new Date(),
      });

      // Send notification email
      const user = (await sdk.get('users')).find((u: any) => u.id === order.userId);
      if (user) {
        await sendEmail({
          to: user.email,
          subject: `Your Order ${orderId} Status: ${status}`,
          html: `Your order status has been updated to: <strong>${status}</strong>`,
        });
      }

      console.log(`[ORDER] Order status updated: ${orderId} -> ${status}`);
      return updated;
    } catch (error) {
      console.error('[ORDER] Update order status error:', error);
      throw error;
    }
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const orders = await sdk.get<Order>('orders');
      return orders.find(o => o.id === orderId) || null;
    } catch (error) {
      console.error('[ORDER] Get order error:', error);
      return null;
    }
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const orders = await sdk.get<Order>('orders');
      return orders.filter(o => o.userId === userId);
    } catch (error) {
      console.error('[ORDER] Get user orders error:', error);
      return [];
    }
  }
}
