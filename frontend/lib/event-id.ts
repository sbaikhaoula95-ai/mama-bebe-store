/**
 * Generates a unique event ID for browser/server deduplication.
 * The same ID is sent to:
 * - the browser pixel event
 * - the backend order payload
 * - the server CAPI payload
 */
export function generateEventId(prefix: string = "order"): string {
  const timestamp = Date.now();
  const random =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${timestamp}_${random}`;
}
