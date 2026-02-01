/**
 * Identifies duplicates in a list of transactions based on partnerPin.
 * Returns the list with 'isDuplicate' property updated.
 * @param {Array} transactions
 * @returns {Array}
 */
export const identifyDuplicates = (transactions) => {
  const pinCounts = {};

  // Count occurrences
  transactions.forEach((t) => {
    const pin = t.partnerPin;
    if (pin) {
      pinCounts[pin] = (pinCounts[pin] || 0) + 1;
    }
  });

  // Mark duplicates
  return transactions.map((t) => {
    const count = pinCounts[t.partnerPin] || 0;
    return {
      ...t,
      isDuplicate: count > 1,
    };
  });
};
