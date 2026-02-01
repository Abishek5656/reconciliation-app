import SOURCES from "../constants/sources.js";

/**
 * Tags transactions with shouldReconcile flag based on business rules.
 * @param {Array} transactions
 * @returns {Array}
 */
export const tagShouldReconcile = (transactions) => {
  return transactions.map((t) => {
    let shouldReconcile = false;
    const type = t.transactionType || "";

    if (t.source === SOURCES.STATEMENT) {
      if (t.isDuplicate) {
        // Statement Duplicate Rules
        if (type.includes("Cancel")) {
          shouldReconcile = true;
        } else if (type.includes("Dollar Received")) {
          shouldReconcile = false;
        } else {
          // Default for other duplicate types?
          // Assuming False to be safe, or per specific instruction absence
          shouldReconcile = false;
        }
      } else {
        // Statement Non-Duplicate Rules
        // "Select the non-duplicated transactions and tag them as Should Reconcile"
        shouldReconcile = true;
      }
    } else if (t.source === SOURCES.SETTLEMENT) {
      if (t.isDuplicate) {
        // Settlement Duplicate Rules
        // "Tag the Cancel type ... as Should Reconcile"
        if (type.includes("Cancel")) {
          shouldReconcile = true;
        } else {
          shouldReconcile = false;
        }
      } else {
        // Settlement Non-Duplicate Rules
        // "Select the non-duplicated transactions and tag them as Should Reconcile"
        shouldReconcile = true;
      }
    }

    return {
      ...t,
      shouldReconcile,
    };
  });
};
