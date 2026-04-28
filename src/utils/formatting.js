export const formatCurrency = (value, currencySymbol = '₹') => {
  let isoCurrencyCode = 'INR'; // Default to INR for '₹'

  // A more robust solution would involve a map for various symbols to ISO codes
  // For now, we'll assume '₹' maps to 'INR'
  if (currencySymbol === '₹') {
    isoCurrencyCode = 'INR';
  } else {
    // If we have other symbols, we'd need a mapping here.
    // For simplicity, if it's not '₹', we might default to a common one or throw an error.
    // For now, we'll just use the symbol directly if it's not '₹', which might still cause issues if it's not a valid ISO code.
    // A better approach would be to store ISO codes in Redux, not symbols.
    // However, to fix the immediate error given the current Redux state, we assume INR for ₹.
    // If the currencySymbol is already an ISO code, this will work.
    isoCurrencyCode = currencySymbol; // Fallback, might still be problematic if it's a symbol
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: isoCurrencyCode, // Use the ISO currency code
    currencyDisplay: 'symbol', // Display the currency symbol
    maximumFractionDigits: 0,
  }).format(value || 0);
};
