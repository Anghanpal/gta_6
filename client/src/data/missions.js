export const missionCategories = [
  { id: "main-story", label: "Main story missions" },
  { id: "heists", label: "Heists" },
  { id: "side-missions", label: "Side missions" },
  { id: "random-encounters", label: "Random encounters" },
  { id: "character-specific", label: "Character-specific missions" },
  { id: "challenges", label: "Challenges" },
  { id: "collectibles", label: "Collectibles" },
  { id: "other-activities", label: "Other activities" },
];

export const missionCategoryLabels = Object.fromEntries(missionCategories.map(({ id, label }) => [id, label]));

export const missions = [];