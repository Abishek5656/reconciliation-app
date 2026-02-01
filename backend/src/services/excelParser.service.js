import xlsx from "xlsx";
import { extractPartnerPin } from "./partnerPin.service.js";
import SOURCES from "../constants/sources.js";

/**
 * Parses the Statement file
 * @param {Buffer} buffer
 * @returns {Array} List of extracted transactions
 */
export const parseStatement = (buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Get all data as arrays
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Logic: Delete rows 1-9 (indices 0-8) and 11 (index 10).
  // Valid data starts at Row 10 (index 9) for header (if needed) and Row 12 (index 11) for first data record?
  // User: "Delete rows 1 to 9 and 11".
  // Usually, Row 10 is header. data starts Row 12.

  // We will slice from index 11 onwards for data.
  // row indices: 0..8 (deleted), 9 (header?), 10 (deleted), 11..end (data)

  const dataRows = rows.slice(11); // Start from index 11

  const transactions = dataRows
    .map((row) => {
      // Col B -> Index 1 (Transaction Type)
      // Col D -> Index 3 (Description -> Partner Pin)
      // Col L -> Index 11 (Statement Amount)

      // Safety check if row is empty
      if (!row || row.length === 0) return null;

      const description = row[3];
      const extractedPin = extractPartnerPin(description);

      // Only return if we have critical info? Or return all and filter later?
      // If pin is missing, we might not be able to process, but let's keep it to verify.
      if (!extractedPin) return null;

      return {
        source: SOURCES.STATEMENT,
        partnerPin: extractedPin,
        transactionType: row[1], // Col B
        statementAmount: row[11], // Col L
        settlementAmountUSD: null,
        originalRow: row,
      };
    })
    .filter((t) => t !== null);

  return transactions;
};

/**
 * Parses the Settlement file
 * @param {Buffer} buffer
 * @returns {Array} List of extracted transactions
 */
export const parseSettlement = (buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // "Delete rows 1 and 2" (indices 0, 1).
  // Data likely starts from index 2 (Row 3) if Row 3 is header, or index 3 (Row 4)?
  // Standard "Header + Data" usually implies Header is the first line after deletion.
  // If we look at standard Excel exports, usually 1-2 headers.
  // Let's assume Row 3 (Index 2) is Header, Data starts Row 4 (Index 3).
  // Only "Delete 1 and 2" was said.
  // Actually, usually "Delete X" implies those are garbage.
  // Let's look at indices:
  // Col D (Index 3): Partner Pin
  // Col F (Index 5): Type
  // Col K (Index 10): PayoutAmt
  // Col M (Index 12): APIRate

  // Assuming data starts at index 2 (row 3) or index 3.
  // Safest is to check if row[3] looks like a Partner Pin.
  // I'll start from index 2.

  const dataRows = rows.slice(2);

  const transactions = dataRows
    .map((row) => {
      if (!row || row.length === 0) return null;

      const partnerPin = row[3]; // Col D (Direct)
      // Check if partnerPin is valid (not a header name like "Partner Pin")
      // Partner Pin is 9 digits. Header might be "Description" or "PartnerPin".
      if (
        !partnerPin ||
        (typeof partnerPin !== "string" && typeof partnerPin !== "number")
      )
        return null;
      // Basic check if it looks like a pin or we skip
      // If it matches header name, skip
      if (String(partnerPin).toLowerCase().includes("partner")) return null;

      const payoutAmt = parseFloat(row[10]); // Col K
      const apiRate = parseFloat(row[12]); // Col M

      let estimatedAmount = 0;
      if (!isNaN(payoutAmt) && !isNaN(apiRate) && apiRate !== 0) {
        estimatedAmount = payoutAmt / apiRate;
      }

      return {
        source: SOURCES.SETTLEMENT,
        partnerPin: String(partnerPin), // Ensure string
        transactionType: row[5], // Col F
        statementAmount: null,
        settlementAmountUSD: estimatedAmount,
        originalRow: row,
      };
    })
    .filter((t) => t !== null);

  return transactions;
};
