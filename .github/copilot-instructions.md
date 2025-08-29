# Portfolio Next Storefront - GitHub Copilot Instructions

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a Next.js 14 e-commerce storefront application built with TypeScript, featuring Clerk authentication, Stripe payments, Prisma with PostgreSQL via Supabase, and Tailwind CSS. The application includes product catalog, shopping cart, user authentication, order management, and admin functionality.

## Working Effectively

### Initial Setup and Dependencies
- **Install dependencies**: `npm install` -- takes 27 seconds. NEVER CANCEL.
- **Node.js requirements**: Tested with Node.js v20.19.4 and npm v10.8.2
- **Environment setup**: Create `.env.local` file with all required environment variables (see Environment Variables section)

### Development Workflow  
- **Start development server**: `npm run dev` -- starts in 1.3 seconds on http://localhost:3000
  - **REQUIRES valid environment variables** - will fail with "Publishable key not valid" if using placeholder Clerk credentials
  - **REQUIRES working database connection** for full functionality
- **Lint code**: `npm run lint` -- takes 3 seconds, uses Next.js ESLint config
- **Build for production**: `npm run build` -- **FAILS in restricted environments** due to external dependencies

### Build Limitations and Workarounds
⚠️ **CRITICAL**: The build process requires external network access for:
1. **Prisma engines**: Downloads from binaries.prisma.sh 
2. **Google Fonts**: Downloads Varela Round font from fonts.googleapis.com

**In restricted environments, the build WILL FAIL**. Workarounds:
- Use `npm run dev` for development (works without external dependencies)
- Use `npm run lint` for code validation (works independently)
- Build issues are infrastructure-related, not code issues

### Environment Variables (Required)
Create `.env.local` file with these variables:

**CRITICAL**: All environment variables MUST have valid values. Placeholder values will cause application startup failures.

```bash
# Database (Supabase PostgreSQL) - REQUIRED
SUPABASE_DB_URL="postgresql://user:password@host:port/database"
SUPABASE_DIRECT_URL="postgresql://user:password@host:port/database"

# Supabase Services - REQUIRED
SUPABASE_PROJECT_URL="https://yourproject.supabase.co"
SUPABASE_PROJECT_API_KEY="your_supabase_anon_key"
SUPABASE_PROJECT_HOSTNAME="yourproject.supabase.co"

# Clerk Authentication - REQUIRED (must be valid Clerk keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_actual_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_actual_clerk_secret_key"

# Stripe Payments - REQUIRED (for checkout functionality)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Application Configuration
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"
ADMIN_USER_IDS='["clerk_user_id_1", "clerk_user_id_2"]'
REDIRECT_AFTER_ADDING_TO_CART="/cart"  # Optional
```

**IMPORTANT**: The application will not start with placeholder credentials. You must obtain valid credentials from:
- Supabase: https://supabase.com (for database and storage)
- Clerk: https://clerk.com (for authentication)
- Stripe: https://stripe.com (for payments)

## Database and Schema

### Prisma Setup
- **Generate Prisma client**: `npx prisma generate` -- **FAILS in restricted environments**
- **Seed database**: `node prisma/product-seeder.js` -- requires database connection
- **View database**: `npm run prisma` -- opens Prisma Studio

### Database Models
Key models in `prisma/schema.prisma`:
- `Product`: name, company, description, price, featured, image
- `Cart`: user cart with items, totals, tax, shipping
- `Order`: completed orders with payment status
- `Review`: product reviews with ratings
- `Favorite`: user favorites

## Validation and Testing

### What Works Without External Services
- **Code linting**: `npm run lint` -- ALWAYS works and should be run before committing
- **TypeScript validation**: Works during development and build processes
- **Dependency installation**: `npm install` -- Works independently

### What Requires External Services  
- **Development server**: Requires valid Clerk authentication credentials
- **Database operations**: Requires working Supabase database connection
- **Payment processing**: Requires valid Stripe credentials
- **Image uploads**: Requires Supabase storage access
- **User authentication**: Requires Clerk service access

### Code Quality
- **ALWAYS run linting**: `npm run lint` before committing changes -- takes 3 seconds
- **TypeScript validation**: Automatic via Next.js development server (when it runs)
- **No test suite**: This repository does not include tests

### Manual Validation Scenarios
**ALWAYS test these complete user workflows after making changes**:

1. **Product Browsing**: Visit homepage → browse products → view product details
2. **Shopping Cart**: Add products to cart → view cart → update quantities
3. **User Authentication**: Sign up → sign in → access protected routes
4. **Checkout Flow**: Add items → go to checkout → payment process
5. **Admin Functions**: Access admin panel → manage products → view orders

### Validation Commands
```bash
# Always-working validation pipeline
npm run lint                    # 3 seconds - ALWAYS PASS - validates code style

# Service-dependent validation (requires valid credentials)
npm run dev                     # 1.3 seconds startup - requires Clerk + Supabase
curl http://localhost:3000      # Test homepage loads - requires running dev server
```

**CRITICAL**: If development server fails to start, check:
1. All environment variables are present in `.env.local`
2. Clerk keys are valid (not placeholder values)
3. Database URL is accessible (if testing database functionality)

## Key Project Structure

### Core Application Files
```
app/
├── page.tsx                    # Homepage with featured products
├── layout.tsx                  # Root layout with Clerk auth
├── products/                   # Product catalog pages
├── cart/                       # Shopping cart functionality
├── checkout/                   # Stripe checkout integration
├── orders/                     # Order history and management
├── admin/                      # Admin dashboard (auto-redirects)
│   ├── products/               # Product management
│   ├── sales/                  # Sales dashboard
│   └── tasks/                  # Admin tasks
└── api/
    ├── confirm/route.ts        # Stripe webhook handler
    └── payment/route.ts        # Payment processing
```

### Core Utilities
```
utils/
├── actions.ts                  # Server actions (30KB - main business logic)
├── db.ts                       # Prisma client singleton
├── schema.ts                   # Zod validation schemas
├── supabase.ts                 # Supabase client and image upload
├── types.ts                    # TypeScript type definitions
└── env.ts                      # Environment variable handling
```

### UI Components
```
components/
├── navbar/                     # Navigation components
├── products/                   # Product display components
├── cart/                       # Cart-related components
├── admin/                      # Admin interface components
├── ui/                         # Reusable UI components (Radix UI)
└── global/                     # Global components and providers
```

## Common Tasks and Troubleshooting

### Application Startup Issues

**"Missing publishableKey" error**: 
- Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local` with a valid Clerk key

**"Publishable key not valid" error**:
- Replace placeholder Clerk credentials with actual values from Clerk dashboard

**Database connection errors**:
- Verify `SUPABASE_DB_URL` and `SUPABASE_DIRECT_URL` are correct
- Check if Supabase project is accessible

### Working Without Full Application Access

**When you cannot start the development server** (due to missing credentials):
1. **Code analysis**: Use file reading tools to examine component structure
2. **Schema validation**: Check `utils/schema.ts` for data validation rules  
3. **Type definitions**: Review `utils/types.ts` for understanding data structures
4. **Server actions**: Examine `utils/actions.ts` for business logic
5. **Linting**: Always use `npm run lint` to validate code changes

**Key files for understanding application logic**:
- `utils/actions.ts` - All server-side business logic (30KB file)
- `prisma/schema.prisma` - Database schema and relationships
- `middleware.ts` - Route protection and authentication logic
- `utils/schema.ts` - Input validation schemas with Zod

### Adding New Products
1. Navigate to `/admin/products/create`
2. Schema validation in `utils/schema.ts` (productSchema)
3. Server action: `createProductAction` in `utils/actions.ts`
4. Image upload via Supabase in `utils/supabase.ts`

### Modifying Cart Functionality
1. Cart logic in `utils/actions.ts`: `addToCartAction`, `updateCartItemAction`
2. Cart state management via server actions and revalidation
3. Cart UI components in `components/cart/`

### Payment Integration
1. Checkout page: `app/checkout/page.tsx`
2. Payment API: `app/api/payment/route.ts`
3. Confirmation handler: `app/api/confirm/route.ts`
4. Stripe configuration via environment variables

### Admin Functionality
1. Admin routes protected by middleware in `middleware.ts`
2. Admin user IDs configured in `ADMIN_USER_IDS` environment variable
3. Auto-redirect from `/admin` to `/admin/sales` (see `_page-redirect-note.txt`)

### Authentication (Clerk)
1. Layout wrapper in `app/layout.tsx`
2. Middleware protection in `middleware.ts`
3. User management via `utils/actions.ts`: `getAuthUser`, `getAdminUser`

## Time Expectations and Timeouts

**NEVER CANCEL these operations - set appropriate timeouts:**
- `npm install`: 30-45 seconds (set timeout to 60+ seconds)
- `npm run lint`: 3-5 seconds (set timeout to 30+ seconds)  
- `npm run dev`: 1-2 seconds startup (set timeout to 30+ seconds)
- `npm run build`: **FAILS in restricted environments** - do not attempt

## Network Dependencies and Limitations

**External services required for full functionality:**
- Prisma engine downloads (binaries.prisma.sh)
- Google Fonts API (fonts.googleapis.com)
- Supabase (for database and storage)
- Stripe (for payments)
- Clerk (for authentication)

**In restricted environments:**
- Development server works normally
- Linting works normally  
- Build process fails due to external dependencies
- Database operations require proper Supabase configuration

## Frequent File Locations

**When working with products**: Always check `utils/actions.ts` for server actions and `utils/schema.ts` for validation rules.

**When working with payments**: Check `app/api/payment/route.ts` for Stripe integration and `app/checkout/page.tsx` for UI.

**When working with authentication**: Check `middleware.ts` for route protection and `utils/actions.ts` for user utilities.

**When working with UI**: Check `components/ui/` for base components and specific feature folders for business logic components.

**Quick Reference Commands for Code Analysis**:
```bash
# File structure analysis
ls -la app/                     # Main application routes  
ls -la components/              # UI components
ls -la utils/                   # Business logic and utilities
wc -c utils/actions.ts          # 30,889 bytes - main business logic file

# Code exploration without running
head -50 utils/actions.ts       # View server actions structure
cat prisma/schema.prisma        # Database schema
cat utils/schema.ts             # Validation schemas
cat middleware.ts               # Route protection logic
```