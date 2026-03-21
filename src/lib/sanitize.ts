import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    return dirty.replace(/<[^>]*>/g, "");
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "s", "ul", "ol", "li", "p", "br", "code", "pre"],
    ALLOWED_ATTR: [],
  });
}

export function plainTextToSafeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}