/**
 * Money denominations available in the vending machine
 */
export const MONEY_DENOMINATIONS = [2000, 5000, 10000, 20000, 50000] as const;

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = {
  FOOD: 'makanan',
  DRINK: 'minuman',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  TRANSACTIONS: '/transactions',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  HISTORY: '/history',
} as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
  PRODUCT_NAME_MIN_LENGTH: 3,
  PRODUCT_NAME_MAX_LENGTH: 50,
  MINIMUM_PRICE: 1000,
  MINIMUM_STOCK: 0,
} as const;

/**
 * UI Messages
 */
export const MESSAGES = {
  SUCCESS: {
    PRODUCT_ADDED: 'Produk berhasil ditambahkan!',
    PRODUCT_UPDATED: 'Produk berhasil diperbarui!',
    PRODUCT_DELETED: 'Produk berhasil dihapus!',
    PURCHASE_SUCCESS: 'Pembelian berhasil!',
  },
  ERROR: {
    FETCH_PRODUCTS_FAILED: 'Gagal memuat produk',
    FETCH_TRANSACTIONS_FAILED: 'Gagal memuat transaksi',
    SAVE_PRODUCT_FAILED: 'Gagal menyimpan produk',
    DELETE_PRODUCT_FAILED: 'Gagal menghapus produk',
    PURCHASE_FAILED: 'Gagal melakukan pembelian',
    OUT_OF_STOCK: 'Maaf, stok habis!',
    INSUFFICIENT_MONEY: 'Uang tidak cukup!',
  },
  CONFIRM: {
    DELETE_PRODUCT: 'Yakin ingin menghapus produk ini?',
  },
} as const;
