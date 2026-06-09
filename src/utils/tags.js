// Pure, client-safe helpers (no fs/glob) so they can be used in components.

// URL-safe slug for a tag, e.g. "C++" -> "c", "Hack Club" -> "hack-club".
export const tagSlug = (t) =>
  String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
