// Re-export all actions that were previously exported from utils/actions.ts

// User actions
export { getCurrentUserType } from "./userActions"

// Product actions
export {
  fetchFeatureProducts,
  fetchAllProducts,
  fetchSingleProduct,
  createProductAction,
  updateProductAction,
  updateProductImageAction,
} from "./productActions"

// Favorite actions
export {
  fetchFavoriteId,
  toggleFavoriteAction,
  fetchUserFavorites,
} from "./favoriteActions"

// Review actions
export {
  createReviewAction,
  fetchProductReviews,
  fetchProductRating,
  fetchProductReviewsWithProductForAuthUser,
  deleteReviewAction,
  updateReviewAction,
  findExistingReview,
} from "./reviewActions"

// Cart actions
export {
  fetchNumberOfCartItems,
  fetchOrCreateCart,
  updateCart,
  addToCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from "./cartActions"

// Order actions
export {
  createOrderAction,
  fetchUserOrders,
} from "./orderActions"

// Admin actions
export {
  fetchAdminProducts,
  deleteProductAction,
  fetchAdminProduct,
  fetchAdminOrders,
  deleteOldUnpaidOrders,
} from "./adminActions"