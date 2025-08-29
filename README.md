# Portfolio Next Storefront

## Actions Structure

The server actions have been organized into logical modules within `utils/actions/`:

### Module Organization

- **`serverActions.ts`** - Shared utility functions
  - Authentication helpers (`getAuthUser`, `getAdminUser`)
  - User type detection (`getCurrentUserType`)
  - Error handling (`renderError`)
  - Cart item management helpers

- **`productActions.ts`** - Product management
  - Product CRUD operations
  - Product search and filtering
  - Admin product management
  - Image upload handling

- **`cartActions.ts`** - Shopping cart functionality
  - Cart creation and retrieval
  - Add/remove/update cart items
  - Cart calculations and updates

- **`orderActions.ts`** - Order management
  - Order creation and processing
  - User order history
  - Admin order management
  - Order cleanup tasks

- **`reviewActions.ts`** - Product review system
  - Review creation and management
  - Rating calculations
  - User review management

- **`favoriteActions.ts`** - User favorites
  - Favorite toggle functionality
  - User favorites listing

### Usage

All actions can be imported from the main actions module:

```typescript
import { 
  addToCartAction, 
  fetchUserOrders, 
  createReviewAction 
} from '@/utils/actions'
```

The index file (`utils/actions/index.ts`) re-exports all functions from the individual modules, maintaining backward compatibility while providing better code organization.
