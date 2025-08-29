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