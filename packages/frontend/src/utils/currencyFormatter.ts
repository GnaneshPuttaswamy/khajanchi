const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2, // Always show two decimal places
  maximumFractionDigits: 2, // Prevent more than two decimal places
});

/**
 * Converts an integer amount in paise to a formatted Rupee string.
 * @param {number | null | undefined} paiseAmount - The amount in paise (integer).
 * @returns {string} - Formatted Rupee string (e.g., "₹1,234.50") or an empty string for invalid input.
 */
function convertPaiseToRupees(paiseAmount: number | null | undefined) {
  // Handle null, undefined, or non-numeric input gracefully
  // Return empty string if input is not a number or is NaN
  // instead of throwing an error
  if (typeof paiseAmount !== 'number' || isNaN(paiseAmount)) {
    console.warn('Invalid input to formatRupees:', paiseAmount);
    return ''; // Or return a default like '₹0.00' or '-'
  }

  // Convert paise to rupees
  const rupees = paiseAmount / 100;

  // Format the rupee value
  return rupeeFormatter.format(rupees);
}

export { convertPaiseToRupees };
