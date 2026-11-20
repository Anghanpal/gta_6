const mediaBase = "https://www.rockstargames.com/VI/_next/static/media/";

export const weaponCategories = [
  { id: "pistols", label: "Pistols" },
  { id: "heavy-pistols", label: "Heavy pistols" },
  { id: "revolvers", label: "Revolvers" },
  { id: "submachine-guns", label: "Submachine guns (SMGs)" },
  { id: "assault-rifles", label: "Assault rifles" },
  { id: "carbines", label: "Carbines" },
  { id: "battle-rifles", label: "Battle rifles" },
  { id: "shotguns", label: "Shotguns" },
  { id: "sniper-rifles", label: "Sniper rifles" },
  { id: "marksman-rifles", label: "Marksman rifles" },
  { id: "lmgs", label: "Light machine guns (LMGs)" },
  { id: "heavy-weapons", label: "Heavy weapons" },
  { id: "rocket-launchers", label: "Rocket launchers" },
  { id: "explosives", label: "Explosives" },
  { id: "grenades", label: "Grenades" },
  { id: "melee-weapons", label: "Melee weapons" },
  { id: "knives", label: "Knives" },
  { id: "blunt-weapons", label: "Blunt weapons" },
  { id: "throwables", label: "Throwables" },
  { id: "special-weapons", label: "Special weapons" },
];

export const weapons = [
  {
    id: "hawk-little-morgan-revolvers",
    name: "Hawk & Little Morgan Revolvers",
    manufacturer: null,
    category: "revolvers",
    image: `${mediaBase}ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.0~3pdc~~sing4.jpg?akim=1&imdensity=1&imwidth=1200`,
    gallery: [
      `${mediaBase}ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.0~3pdc~~sing4.jpg?akim=1&imdensity=1&imwidth=1200`,
      `${mediaBase}ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_02.04e_9jco7lluf.jpg?akim=1&imdensity=1&imwidth=1200`,
    ],
    description: "Named and pictured in Rockstar’s official Ultimate Edition Benefits gallery. The source does not publish a manufacturer field, tested stats, or a real-world model match.",
    damage: null,
    accuracy: null,
    fireRate: null,
    range: null,
    reloadSpeed: null,
    recoil: null,
    magazineCapacity: null,
    ammunitionType: null,
    customization: null,
    attachments: null,
    price: null,
    location: null,
    gameMode: null,
    availability: "Featured in Rockstar’s Ultimate Edition Benefits media. In-game acquisition method and Story Mode / GTA Online availability are not stated in the cited gallery.",
    verificationStatus: "CONFIRMED",
    verificationNote: "Officially named and pictured by Rockstar Games.",
    source: "https://www.rockstargames.com/VI/downloads",
  },
];

export const verificationStatuses = [
  { id: "all", label: "All verification" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "REPORTED", label: "Reported" },
  { id: "UNKNOWN", label: "Unknown" },
];