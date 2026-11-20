import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { weaponCategories, weapons } from "../data/weapons.js";
import { readWeaponFavorites, saveWeaponFavorites } from "../data/weaponPreferences.js";

const statFields = [
  ["Damage", "damage"],
  ["Accuracy", "accuracy"],
  ["Fire rate", "fireRate"],
  ["Range", "range"],
  ["Reload speed", "reloadSpeed"],
];

function valueOrUnknown(value) {
  return value == null || value === "" ? "Unknown / not officially published" : String(value);
}

function WeaponStatBar({ label, value }) {
  const known = typeof value === "number" && Number.isFinite(value);
  const fillWidth = known ? `${Math.max(0, Math.min(value, 100))}%` : "0%";
  return <div className={`weapon-detail-stat${known ? " is-known" : " is-unknown"}`}><div><span>{label}</span><b>{known ? value : "UNKNOWN"}</b></div><span className="weapon-detail-stat-track" aria-hidden="true"><span style={{ width: fillWidth }} /></span></div>;
}

export default function WeaponDetailPage() {
  const { id } = useParams();
  const weapon = weapons.find((entry) => entry.id === id);
  const [activeImage, setActiveImage] = useState(weapon?.image || "");
  const [favorites, setFavorites] = useState(readWeaponFavorites);
  if (!weapon) return <Navigate to="/weapons" replace />;

  const favorite = favorites.includes(weapon.id);
  function toggleFavorite() {
    const next = favorite ? favorites.filter((favoriteId) => favoriteId !== weapon.id) : [...favorites, weapon.id];
    setFavorites(next);
    saveWeaponFavorites(next);
  }

  return (
    <main id="main" className="weapon-detail-page" data-page-title={`${weapon.name} — GTA VI WORLD`}>
      <section className="weapon-detail-hero"><img src={activeImage || weapon.image} alt={weapon.name} fetchPriority="high" /><div className="weapon-detail-shade" /><div className="detail-shell weapon-detail-hero-copy"><Link className="region-back-link" to="/weapons">← Weapons database</Link><div className="section-kicker"><span>{weaponCategories.find((item) => item.id === weapon.category)?.label}</span><strong className={`weapon-verification-badge ${weapon.verificationStatus.toLowerCase()}`}>{weapon.verificationStatus}</strong></div><h1>{weapon.name}</h1><p>{weapon.verificationNote}</p><button className={`weapon-detail-favorite${favorite ? " is-favorite" : ""}`} type="button" aria-pressed={favorite} onClick={toggleFavorite}>{favorite ? "★ Saved to favourites" : "☆ Add to favourites"}</button></div></section>
      <section className="weapon-detail-content detail-shell"><div className="weapon-detail-gallery"><div className="weapon-detail-main-image"><img src={activeImage || weapon.image} alt={`${weapon.name} official artwork`} /></div>{weapon.gallery?.length > 1 && <div className="weapon-gallery-thumbnails" aria-label={`${weapon.name} gallery`}>{weapon.gallery.map((image, index) => <button className={activeImage === image ? "is-active" : ""} type="button" aria-pressed={activeImage === image} aria-label={`Show image ${index + 1}`} onClick={() => setActiveImage(image)} key={image}><img src={image} alt="" loading="lazy" /></button>)}</div>}<a className="weapon-source-link" href={weapon.source} target="_blank" rel="noreferrer">Rockstar official image and source ↗</a></div><div className="weapon-detail-copy"><div className="section-kicker"><span>WEAPON FILE</span> {weapon.verificationStatus}</div><h2>{weapon.name}</h2><p>{weapon.description}</p><div className="weapon-detail-stats">{statFields.map(([label, field]) => <WeaponStatBar label={label} value={weapon[field]} key={field} />)}</div><dl className="weapon-detail-fields"><div><dt>Manufacturer</dt><dd>{weapon.manufacturer || "Unknown / not officially specified"}</dd></div><div><dt>Category</dt><dd>{weaponCategories.find((item) => item.id === weapon.category)?.label || "Unknown"}</dd></div><div><dt>Magazine capacity</dt><dd>{valueOrUnknown(weapon.magazineCapacity)}</dd></div><div><dt>Ammunition type</dt><dd>{weapon.ammunitionType || "Unknown / not officially specified"}</dd></div><div><dt>Recoil</dt><dd>{valueOrUnknown(weapon.recoil)}</dd></div><div><dt>Real-world inspiration</dt><dd>{weapon.realLifeInspiration || "Unknown / not reliably identified"}</dd></div><div><dt>Customization</dt><dd>{weapon.customization || "Unknown / not officially specified"}</dd></div><div><dt>Attachments & upgrades</dt><dd>{weapon.attachments || "Unknown / not officially specified"}</dd></div><div><dt>Price</dt><dd>{weapon.price == null ? "Unknown / not officially published" : `$${Number(weapon.price).toLocaleString()}`}</dd></div><div><dt>Where to find / unlock</dt><dd>{weapon.location || "Unknown / not officially specified"}</dd></div><div><dt>Availability</dt><dd>{weapon.availability || "Unknown / not officially specified"}</dd></div></dl><p className="weapon-detail-verification-note">{weapon.verificationNote} No GTA V weapon statistics are reused.</p></div></section>
    </main>
  );
}