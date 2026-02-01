/**
 * Extracts the 9-digit partner pin from the end of the description string.
 * @param {string} description
 * @returns {string|null} The 9-digit pin or null if not found
 */
export const extractPartnerPin = (description) => {
  if (!description || typeof description !== "string") return null;
  const trimmed = description.trim();
  // Regex to find 9 digits at the very end of the string
  // Matches " 123456789" or "Something123456789"
  const match = trimmed.match(/(\d{9})$/);
  return match ? match[1] : null;
};
