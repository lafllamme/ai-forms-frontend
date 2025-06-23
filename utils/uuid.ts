// utils/uuid.ts
export function generateSessionId(): string {
  // Uses Web Crypto API (in every modern browser)
  return `SESSION-${crypto.randomUUID()}`
}
