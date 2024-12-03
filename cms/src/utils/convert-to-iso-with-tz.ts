/**
 * Converts a given Date object to an ISO 8601 string with timezone offset.
 *
 * @param date - The Date object to be converted.
 * @returns The ISO 8601 formatted string with timezone offset.
 *
 * @example
 * ```typescript
 * const date = new Date();
 * const isoString = convertToIsoWithTz(date);
 * console.log(isoString); // Outputs something like "2023-03-15T13:45:30+02:00"
 * ```
 */
export const convertToIsoWithTz = (date: Date): string => {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";

  // Pad numbers to ensure 2 digits
  const pad = (num: number) => String(num).padStart(2, "0");

  const hours = pad(Math.floor(Math.abs(offset) / 60));
  const minutes = pad(Math.abs(offset) % 60);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${hours}:${minutes}`;
};
