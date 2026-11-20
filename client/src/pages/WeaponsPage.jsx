import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { verificationStatuses, weaponCategories, weapons } from "../data/weapons.js";
import { readWeaponFavorites, saveWeaponFavorites } from "../data/weaponPreferences.js";

const sortOptions = [
  { id: "name", label: "Name A–Z" },
  { id: "damage", label: "Highest damage" },
  { id: "accuracy", label: "Best accuracy" },
  { id: "fireRate", label: "Fastest fire rate" },
  { id: "range", label: "Longest range" },
  { id: "price", label: "Lowest price" },
];

const comparisonFields = [
  ["Manufacturer", (weapon) => weapon.manufacturer || "Unknown"],
  ["Category", (weapon) => weaponCategories.find((category) => category.id === weapon.category)?.label || "Unknown"],
  ["Verification", (weapon) => weapon.verificationStatus],
  ["Damage", (weapon) => formatUnknown(weapon.damage)],
  ["Accuracy", (weapon) => formatUnknown(weapon.accuracy)],
  ["Fire rate", (weapon) => formatUnknown(weapon.fireRate)],
  ["Range", (weapon) => formatUnknown(weapon.range)],
  ["Reload speed", (weapon) => formatUnknown(weapon.reloadSpeed)],
  ["Magazine capacity", (weapon) => formatUnknown(weapon.magazineCapacity)],
  ["Ammunition", (weapon) => weapon.ammunitionType || "Unknown"],
  ["Recoil", (weapon) => formatUnknown(weapon.recoil)],
  ["Customization", (weapon) => weapon.customization || "Unknown"],
  ["Attachments", (weapon) => weapon.attachments || "Unknown"],
  ["Price", (weapon) => weapon.price == null ? "Unknown" : `$${Number(weapon.price).toLocaleString()}`],
  ["Availability", (weapon) => weapon.availability || "Unknown"],
];

function formatUnknown(value) {
  return value == null || value === "" ? "Not tested / unknown" : String(value);
}

function WeaponStatBar({ label, value }) {
  const known = typeof value === "number" && Number.isFinite(value);
  const fillWidth = known ? `${Math.max(0, Math.min(value, 100))}%` : "0%";
  return <div className={`weapon-stat-bar${known ? " is-tested" : " is-unknown"}`}><div><span>{label}</span><b>{known ? value : "Not tested"}</b></div><span className="weapon-stat-track" aria-hidden="true"><span style={{ width: fillWidth }} /></span></div>;
}

function WeaponCard({ weapon, favorite, compared, onFavorite, onCompare }) {
  const category = weaponCategories.find((item) => item.id === weapon.category)?.label || "Unclassified";
  return (
    <article className="weapon-record-card">
      <Link className="weapon-record-main" to={`/weapons/${weapon.id}`}>
        <span className="weapon-record-image"><img src={weapon.image} alt={weapon.name} loading="lazy" /><span className={`weapon-verification-badge ${weapon.verificationStatus.toLowerCase()}`}>{weapon.verificationStatus}</span><span className="weapon-card-open" aria-hidden="true">↗</span></span>
        <span className="weapon-record-copy"><span className="weapon-record-category">{category}</span><b>{weapon.name}</b><span>{weapon.manufacturer || "Manufacturer unknown"}</span><small>{weapon.verificationNote}</small></span>
      </Link>
      <div className="weapon-card-stats"><WeaponStatBar label="Damage" value={weapon.damage} /><WeaponStatBar label="Accuracy" value={weapon.accuracy} /><WeaponStatBar label="Fire rate" value={weapon.fireRate} /></div>
      <div className="weapon-card-actions"><button className={`weapon-action${favorite ? " is-favorite" : ""}`} type="button" aria-pressed={favorite} onClick={() => onFavorite(weapon.id)}>{favorite ? "★ Favourite" : "☆ Favourite"}</button><button className={`weapon-action${compared ? " is-compared" : ""}`} type="button" aria-pressed={compared} onClick={() => onCompare(weapon.id)}>{compared ? "✓ Selected" : "＋ Compare"}</button></div>
    </article>
  );
}

function WeaponComparison({ items, onRemove }) {
  return (
    <section className="weapon-comparison"><div className="weapon-comparison-heading"><div><div className="section-kicker"><span>SIDE-BY-SIDE</span> Verified values only</div><h2>Weapon comparison</h2></div><p>Unknown and untested fields remain labeled. Scroll horizontally to compare selections.</p></div><div className="weapon-comparison-scroll"><div className="weapon-comparison-table" style={{ "--weapon-columns": items.length }}><div className="weapon-comparison-label-spacer" />{items.map((weapon) => <div className="weapon-comparison-head" key={weapon.id}><img src={weapon.image} alt="" /><b>{weapon.name}</b><button type="button" onClick={() => onRemove(weapon.id)}>Remove</button></div>)}{comparisonFields.map(([label, value]) => <div className="weapon-comparison-row" key={label}><b>{label}</b>{items.map((weapon) => <span key={weapon.id}>{value(weapon)}</span>)}</div>)}</div></div></section>
  );
}

export default function WeaponsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [verification, setVerification] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(readWeaponFavorites);
  const [compareIds, setCompareIds] = useState([]);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredWeapons = weapons.filter((weapon) => (category === "all" || weapon.category === category)
    && (verification === "all" || weapon.verificationStatus === verification)
    && (!favoritesOnly || favorites.includes(weapon.id))
    && [weapon.name, weapon.manufacturer, weapon.description, weapon.availability].filter(Boolean).join(" ").toLowerCase().includes(deferredQuery))
    .sort((left, right) => {
      if (sortBy === "name") return left.name.localeCompare(right.name);
      const difference = (right[sortBy] ?? Number.NEGATIVE_INFINITY) - (left[sortBy] ?? Number.NEGATIVE_INFINITY);
      return difference || left.name.localeCompare(right.name);
    });

  const comparedWeapons = compareIds.map((id) => weapons.find((weapon) => weapon.id === id)).filter(Boolean);

  function toggleFavorite(id) {
    const next = favorites.includes(id) ? favorites.filter((favoriteId) => favoriteId !== id) : [...favorites, id];
    setFavorites(next);
    saveWeaponFavorites(next);
  }

  function toggleCompare(id) {
    setCompareIds((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]);
  }

  return (
    <main id="main" className="encyclopedia-page weapons-page">
      <section className="encyclopedia-hero weapons-hero"><img src="https://img.youtube.com/vi/VQRLujxTm3c/maxresdefault.jpg" alt="Official Grand Theft Auto VI promotional artwork; not weapon-specific" fetchPriority="high" /><div className="encyclopedia-hero-shade" /><div className="detail-shell encyclopedia-hero-copy"><div className="section-kicker"><span>LEONIDA ARMORY</span> Rockstar-source records</div><h1>Tools of<br /><em>the trade.</em></h1><p>Weapons named in official GTA VI material. Untested stats, prices, and unlock details stay unknown.</p></div></section>
      <section className="encyclopedia-content detail-shell">
        <div className="weapon-filter-toolbar"><label><span>Search weapons</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by weapon name..." /></label><label><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>{sortOptions.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label><button className={`weapon-favorites-filter${favoritesOnly ? " is-active" : ""}`} type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly((active) => !active)}>★ Favourites</button></div>
        <div className="weapon-verification-filters" aria-label="Filter by verification status">{verificationStatuses.map((status) => <button className={verification === status.id ? "is-active" : ""} type="button" aria-pressed={verification === status.id} onClick={() => setVerification(status.id)} key={status.id}>{status.label}<span>{status.id === "all" ? weapons.length : weapons.filter((weapon) => weapon.verificationStatus === status.id).length}</span></button>)}</div>
        <div className="encyclopedia-filters weapon-category-filters" aria-label="Filter by weapon category"><button type="button" className={category === "all" ? "is-active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>All categories <span>{weapons.length}</span></button>{weaponCategories.map((weaponCategory) => <button type="button" className={category === weaponCategory.id ? "is-active" : ""} aria-pressed={category === weaponCategory.id} onClick={() => setCategory(weaponCategory.id)} key={weaponCategory.id}>{weaponCategory.label}<span>{weapons.filter((weapon) => weapon.category === weaponCategory.id).length}</span></button>)}</div>
        <div className="weapon-results-line"><p aria-live="polite">{filteredWeapons.length} records</p><p>{compareIds.length} selected for comparison</p></div>
        {filteredWeapons.length ? <div className="encyclopedia-card-grid weapon-card-grid">{filteredWeapons.map((weapon) => <WeaponCard key={weapon.id} weapon={weapon} favorite={favorites.includes(weapon.id)} compared={compareIds.includes(weapon.id)} onFavorite={toggleFavorite} onCompare={toggleCompare} />)}</div> : <div className="weapon-empty"><span className="section-kicker">NO MATCHING OFFICIAL RECORDS</span><h2>{query ? "No matching confirmed weapons." : "This category has no named weapons yet."}</h2><p>Rockstar’s cited media currently names and pictures the Hawk &amp; Little Morgan Revolvers. Other weapon families remain ready for official additions; leaks and GTA V statistics are not included.</p><a href="https://www.rockstargames.com/VI/downloads" target="_blank" rel="noreferrer">Rockstar media & artwork ↗</a></div>}
        {comparedWeapons.length >= 2 && <WeaponComparison items={comparedWeapons} onRemove={toggleCompare} />}
        {comparedWeapons.length === 1 && <p className="weapon-compare-hint">Select one or more additional weapons to compare them side by side.</p>}
        <p className="encyclopedia-source-note">CONFIRMED means named or pictured in official Rockstar GTA VI material. REPORTED is reserved for credible non-official reporting and is not treated as fact. UNKNOWN means the detail has not been verified. No GTA V stats are reused.</p>
      </section>
    </main>
  );
}