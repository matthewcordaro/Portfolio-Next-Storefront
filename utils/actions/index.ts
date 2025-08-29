/**
 * Actions Index - Re-exports all server actions from organized modules
 * 
 * This file serves as a centralized export point for all server actions,
 * organized into logical groups for better maintainability:
 * 
 * - serverActions: Shared utility functions (auth, error handling, etc.)
 * - productActions: Product CRUD operations and management
 * - cartActions: Shopping cart functionality  
 * - orderActions: Order creation and management
 * - reviewActions: Product review system
 * - favoriteActions: User favorites functionality
 * 
 * Import any action function from '@/utils/actions' - this index file
 * will resolve the import to the appropriate module automatically.
 */

// Re-export all actions from their respective modules

// Server Actions (utility functions)
export {
  getAuthUser,
  getAdminUser,
  getCurrentUserType,
  renderError,
  updateOrCreateCartItem,
  fetchProduct
} from "./serverActions"

// Product Actions
export {
  fetchAdminProducts,
  fetchFeatureProducts,
  fetchAllProducts,
  fetchSingleProduct,
  createProductAction,
  deleteProductAction,
  fetchAdminProduct,
  updateProductAction,
  updateProductImageAction
} from "./productActions"

// Cart Actions
export {
  fetchNumberOfCartItems,
  fetchOrCreateCart,
  updateCart,
  addToCartAction,
  removeCartItemAction,
  updateCartItemAction
} from "./cartActions"

// Order Actions
export {
  createOrderAction,
  fetchUserOrders,
  fetchAdminOrders,
  deleteOldUnpaidOrders
} from "./orderActions"

// Review Actions
export {
  createReviewAction,
  fetchProductReviews,
  fetchProductRating,
  fetchProductReviewsWithProductForAuthUser,
  deleteReviewAction,
  updateReviewAction,
  findExistingReview
} from "./reviewActions"

// Favorite Actions
export {
  fetchFavoriteId,
  toggleFavoriteAction,
  fetchUserFavorites
} from "./favoriteActions"