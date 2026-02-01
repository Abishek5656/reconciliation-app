/**
 * Calculates variance amount.
 * @param {number} settlementAmount
 * @param {number} statementAmount
 * @returns {number}
 */
export const calculateVariance = (settlementAmount, statementAmount) => {
  const s1 = parseFloat(settlementAmount) || 0;
  const s2 = parseFloat(statementAmount) || 0;
  // Variance = Settlement - Statement (as per typical accounting, or Request implied comparison)
  // "compare the Amount (USD) in the Settlement File with Col L (Settle.Amt) in the Statement File"
  // Usually Variance = Actual - Expected.
  // Let's store difference.
  return s1 - s2;
};
