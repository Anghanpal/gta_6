const favoriteStorageKey = "gta-vi-world-weapon-favorites";

export function readWeaponFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveWeaponFavorites(favorites) {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
    return true;
  } catch {
    return false;
  }
}