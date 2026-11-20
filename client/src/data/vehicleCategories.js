export const vehicleCategories = [
  { id: "supercars", label: "Supercars" },
  { id: "sports-cars", label: "Sports cars" },
  { id: "muscle-cars", label: "Muscle cars" },
  { id: "sedans", label: "Sedans" },
  { id: "suvs", label: "SUVs" },
  { id: "pickup-trucks", label: "Pickup trucks" },
  { id: "off-road", label: "Off-road vehicles" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "dirt-bikes", label: "Dirt bikes" },
  { id: "choppers", label: "Choppers" },
  { id: "boats", label: "Boats & watercraft" },
  { id: "jet-skis", label: "Jet skis" },
  { id: "helicopters", label: "Helicopters" },
  { id: "airplanes", label: "Airplanes" },
  { id: "police", label: "Police vehicles" },
  { id: "emergency", label: "Emergency vehicles" },
  { id: "commercial", label: "Commercial vehicles" },
  { id: "unclassified", label: "Unclassified" },
];

export const vehicleCategoryLabels = Object.fromEntries(vehicleCategories.map(({ id, label }) => [id, label]));