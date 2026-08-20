/**
 * Normalize a user-entered US phone number to E.164 format for AWS SNS.
 * Accepts inputs like "301-555-1234", "(301) 555 1234", "13015551234",
 * "+13015551234" and returns "+13015551234".
 *
 * Returns null if the input can't be turned into a plausible US number.
 */
const normalizePhone = function (raw: string): string | null {
  if (!raw) return null;

  // Keep a leading + if present, strip everything else that isn't a digit.
  const hasPlus = raw.trim().startsWith("+");
  const digits = raw.replace(/\D/g, "");

  if (hasPlus) {
    // Already international; trust it as long as it has enough digits.
    return digits.length >= 11 ? `+${digits}` : null;
  }

  if (digits.length === 10) {
    // Bare US 10-digit number.
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    // US number with country code but no plus.
    return `+${digits}`;
  }

  return null;
};

export default normalizePhone;
