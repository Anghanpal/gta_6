const statusStorageKey = "gta-vi-world-mission-status";
const favoriteStorageKey = "gta-vi-world-mission-favorites";
const objectiveStorageKey = "gta-vi-world-mission-objectives";

function readObject(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function writeObject(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readMissionStatuses() {
  return readObject(statusStorageKey);
}

export function saveMissionStatus(missionId, status) {
  const statuses = readMissionStatuses();
  statuses[missionId] = status;
  return writeObject(statusStorageKey, statuses);
}

export function readMissionFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveMissionFavorites(favorites) {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
    return true;
  } catch {
    return false;
  }
}

export function readMissionObjectives() {
  return readObject(objectiveStorageKey);
}

export function saveMissionObjectives(objectives) {
  return writeObject(objectiveStorageKey, objectives);
}