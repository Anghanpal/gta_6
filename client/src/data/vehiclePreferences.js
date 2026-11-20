const favoriteStorageKey = "gta-vi-world-vehicle-favorites";

export function readFavoriteIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function writeFavoriteIds(ids) {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(ids));
  } catch {
    return false;
  }
  return true;
}