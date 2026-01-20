/**
 * Format number to Indonesian Rupiah currency format
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "Rp8.000")
 */
export const formatCurrency = (amount: number): string => {
  return `Rp${amount.toLocaleString('id-ID')}`;
};

/**
 * Format ISO date string to Indonesian locale
 * @param isoString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format ISO date to short format
 * @param isoString - ISO date string
 * @returns Short formatted date string (e.g., "20 Jan 2026")
 */
export const formatDateShort = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calculate change from transaction
 * @param moneyInserted - Total money inserted
 * @param price - Product price
 * @returns Change amount
 */
export const calculateChange = (moneyInserted: number, price: number): number => {
  return moneyInserted - price;
};

/**
 * Validate if money is sufficient for purchase
 * @param moneyInserted - Total money inserted
 * @param price - Product price
 * @returns Boolean indicating if money is sufficient
 */
export const isMoneySufficient = (moneyInserted: number, price: number): boolean => {
  return moneyInserted >= price;
};

/**
 * Validate if product is in stock
 * @param stock - Current stock
 * @returns Boolean indicating if product is available
 */
export const isProductAvailable = (stock: number): boolean => {
  return stock > 0;
};
