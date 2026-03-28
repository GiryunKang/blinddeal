import DOMPurify from "isomorphic-dompurify"

export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ""
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim()
}

export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return ""
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  }).trim()
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhone(phone: string): boolean {
  return /^[\d\-+() ]{8,20}$/.test(phone)
}

export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return input.slice(0, maxLength)
}
