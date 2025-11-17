# Birr Books Platform - Development Standards
## Production-Grade Islamic Bookshop Platform

**Bismillah Ar-Rahman Ar-Roheem**

---

## 1. CODING STANDARDS

### 1.1 Architecture Principles
- **Single Responsibility**: Each module handles one concern
- **Database Source of Truth**: All data persists in SDK-backed GitHub database
- **Type Safety**: Full TypeScript implementation with strict mode
- **Error Handling**: Comprehensive try-catch with proper logging
- **Schema Validation**: All data validated against defined schemas before persistence
- **Audit Trails**: All data mutations tracked in audit logs

### 1.2 TypeScript Guidelines
\`\`\`typescript
// ✅ Correct - Full types, proper generics
interface Book {
  id: string;
  uid: string;
  title: string;
  authorId: string;
  price: number;
  createdAt: Date;
}

// ❌ Avoid - Any types, loose typing
const book: any = { ...data };
\`\`\`

### 1.3 Database Operations
- Always validate schema before insert/update
- Use transaction-like patterns for multi-step operations
- Cache aggressively with SDK subscribe pattern
- Implement retry logic for network failures
- Log all mutations with timestamps

### 1.4 File Organization
\`\`\`
src/
├── lib/
│   ├── sdk.ts              # Initialized SDK instance
│   ├── schemas.ts          # All collection schemas
│   ├── validations.ts      # Input validation
│   ├── errors.ts           # Custom error classes
│   └── constants.ts        # App constants & enums
├── api/
│   ├── auth/
│   ├── books/
│   ├── orders/
│   └── admin/
├── components/
│   ├── admin/
│   ├── public/
│   └── shared/
├── hooks/
│   ├── useAuth.ts
│   ├── useBooks.ts
│   └── useCart.ts
└── app/
    ├── page.tsx           # Home
    ├── layout.tsx
    └── (routes)/
\`\`\`

### 1.5 Naming Conventions
- **Collections**: Lowercase plural (books, orders, users)
- **Functions**: Camelcase, action-focused (fetchBooks, createOrder)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL, MAX_RETRIES)
- **Interfaces**: PascalCase with prefix if needed (IUser, BookInput)
- **Classes**: PascalCase (AuthService, BookRepository)

### 1.6 Error Handling
\`\`\`typescript
// Custom error hierarchy
class BirrError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// Usage
throw new BirrError("Email already exists", "DUPLICATE_EMAIL", 409);
\`\`\`

### 1.7 Logging Standards
\`\`\`typescript
// Structured logging
console.log("[AUDIT]", { action: "INSERT", collection: "books", itemId: "123" });
console.error("[ERROR]", { code: "DB_ERROR", message: error.message });
console.warn("[WARN]", { message: "High memory usage", timestamp: Date.now() });
\`\`\`

---

## 2. UI/UX DESIGN STANDARDS

### 2.1 Brand Colors (MANDATORY)
- **Primary Green**: `#05B34D` - Primary actions, navigation
- **Accent Gold**: `#F2B91C` - Highlights, special offers
- **Dark Slate**: `#181F25` - Text, headers, dark mode
- **Minted Glow**: `#E9FBF1` - Light backgrounds, subtle overlays
- **Utility White**: `#FFFFFF` - Cards, modals, pure white
- **Neutral Gray**: `#6B7280` - Secondary text, borders

### 2.2 Design Tokens (Tailwind CSS)
\`\`\`css
@theme {
  --color-primary: #05B34D;
  --color-accent: #F2B91C;
  --color-dark: #181F25;
  --color-light: #E9FBF1;
  --color-white: #FFFFFF;
  --color-gray: #6B7280;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2);
}
\`\`\`

### 2.3 Mobile-First Principles
- Design for 320px minimum width
- Touch targets minimum 44x44px
- Bottom navigation for mobile (Home, Browse, Library, Cart, Account)
- Swipe gestures for navigation
- Pull-to-refresh for content reload
- Loading skeletons instead of spinners

### 2.4 Component Hierarchy
1. **Foundation**: Buttons, inputs, cards (no business logic)
2. **Features**: Forms, lists, filters (domain logic)
3. **Containers**: Pages, layouts, sections (routing)

### 2.5 Typography
- **Headings**: IBM Plex Sans (600 weight)
- **Body**: IBM Plex Sans (400 weight)
- **Code**: IBM Plex Mono (400 weight)
- **Line Heights**: 1.5 for body, 1.3 for headings
- **Minimum Font Size**: 14px (16px on mobile)

### 2.6 Elevation & Shadows (E-Learning App Style)
\`\`\`
Level 0: No shadow (background)
Level 1: shadow-sm (text, subtle elements)
Level 2: shadow-md (cards, input fields)
Level 3: shadow-lg (modals, popovers, buttons on hover)
Level 4: shadow-xl (floating buttons, sticky headers)
\`\`\`

### 2.7 Spacing Scale (8px base)
\`\`\`
xs: 4px    (0.25rem)
sm: 8px    (0.5rem)
md: 16px   (1rem)
lg: 24px   (1.5rem)
xl: 32px   (2rem)
2xl: 48px  (3rem)
\`\`\`

### 2.8 Responsive Breakpoints
\`\`\`
Mobile:  <640px   (default, optimized)
Tablet:  ≥640px   (md prefix)
Desktop: ≥1024px  (lg prefix)
Wide:    ≥1280px  (xl prefix)
\`\`\`

### 2.9 Accessibility Requirements
- WCAG 2.1 AA compliance minimum
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation on all interactive elements
- ARIA labels for screen readers
- Alt text for all images
- Focus indicators visible

### 2.10 Loading States
- Use skeleton loaders not spinners
- Animated skeleton with pulse effect
- Maintain layout to prevent CLS (Cumulative Layout Shift)

---

## 3. DATABASE STANDARDS

### 3.1 Collection Evolution
\`\`\`typescript
// Check and create/update collections on app start
async function ensureSchemas() {
  const requiredSchemas = {
    books: { /* schema */ },
    users: { /* schema */ },
    orders: { /* schema */ }
  };
  
  for (const [collection, schema] of Object.entries(requiredSchemas)) {
    const exists = await sdk.collectionExists(collection);
    if (!exists) {
      await sdk.save(collection, []);
    }
    sdk.setSchema(collection, schema);
  }
}
\`\`\`

### 3.2 Schema Validation
- Required fields enforced on insert/update
- Type checking for all fields
- Constraint validation (email format, price > 0, etc.)
- Automatic timestamps (createdAt, updatedAt)

### 3.3 Audit Logging
- Every mutation logged with action, timestamp, user
- Retention: Last 100 entries per collection
- Access via audit API endpoint

---

## 4. SECURITY STANDARDS

### 4.1 Authentication
- Session-based with secure tokens
- Email verification before full account access
- Password hashing with salt
- OTP for sensitive operations
- Refresh session on critical actions

### 4.2 Authorization
- Role-based access control (RBAC)
- Permissions checked on API routes
- Admin actions logged separately
- Sensitive data masked in audit trails

### 4.3 Data Protection
- All passwords hashed (non-reversible)
- Sensitive fields excluded from API responses
- Payment info never stored in plain text
- CORS configured for trusted origins only

---

## 5. PERFORMANCE STANDARDS

### 5.1 Target Metrics
- Page load: < 2 seconds (3G network)
- Interaction: < 100ms response time
- Cache hit rate: > 80% for repeated requests

### 5.2 Optimization Techniques
- SDK subscription caching
- Image lazy loading with blur-up
- Code splitting by route
- API response compression
- Database query indexing

---

## 6. TESTING STANDARDS

### 6.1 Coverage Requirements
- Unit tests for all utilities: 80%+
- Integration tests for API routes: 70%+
- E2E tests for critical flows (login, checkout)

### 6.2 Test Organization
\`\`\`
tests/
├── unit/
├── integration/
└── e2e/
\`\`\`

---

## 7. DEPLOYMENT STANDARDS

### 7.1 Environment Variables
- `.env.local` for development (never committed)
- `.env.production` for live (managed by platform)
- All secrets in environment, never in code

### 7.2 Git Workflow
- Main branch protected
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Require PR review before merge

---

**La hawla wa la quwwata illa billah**
