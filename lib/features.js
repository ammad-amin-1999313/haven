export const features = [
  {
    id: 1,
    title: "Simple Booking",
    description:
      "No complicated forms. Just select your dates and confirm your stay in seconds.",
  },
  {
    id: 2,
    title: "Pay on Arrival",
    description:
      "Keep your cash flow flexible. No upfront credit card charges required for most stays.",
  },
  {
    id: 3,
    title: "Best Rates",
    description:
      "We partner directly with hotel owners to bring you the most competitive prices.",
  },
];

export function formatDate(value, locale = "en-GB") {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale);
}

/**
 * Format date range: 12/03/2025 – 15/03/2025
 */
export function formatDateRange(start, end, locale = "en-GB") {
  const startStr = formatDate(start, locale);
  const endStr = formatDate(end, locale);

  if (!startStr && !endStr) return "";
  if (!endStr) return startStr;
  if (!startStr) return endStr;

  return `${startStr} – ${endStr}`;
}
