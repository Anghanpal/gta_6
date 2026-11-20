import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { vehicleCategoryLabels } from "../data/vehicleCategories.js";
import { readFavoriteIds, writeFavoriteIds } from "../data/vehiclePreferences.js";

function DetailField({ label, value, unit = "" }) {
  const visibleValue = value === null || value === undefined || value === "" ? "Unknown / not officially published" : `${value}${unit}`;
  return <div className="vehicle-detail-field"><dt>{label}</dt><dd>{visibleValue}</dd></div>;
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setVehicle(null);
    setError("");
    fetch(`/api/vehicles/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? "Vehicle not found." : "Vehicle details could not be loaded.");
        return response.json();
      })
      .then((data) => {
        setVehicle(data);
        setActiveImage(data.imageUrl);
        setError("");
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (vehicle) document.title = `${vehicle.name} — GTA VI WORLD`;
  }, [vehicle]);

  if (loading) return <main className="vehicle-detail-state" id="main">Loading vehicle details…</main>;
  if (error) return <main className="vehicle-detail-state" id="main"><h1>{error}</h1><Link className="text-link" to="/vehicles">Back to vehicle database ↗</Link></main>;
  if (!vehicle) return <Navigate to="/vehicles" replace />;

  const gallery = [...new Set([vehicle.imageUrl, ...(vehicle.gallery || [])].filter(Boolean))];
  const isFavorite = favoriteIds.includes(vehicle.id);

  function toggleFavorite() {
    const next = isFavorite ? favoriteIds.filter((favoriteId) => favoriteId !== vehicle.id) : [...favoriteIds, vehicle.id];
    setFavoriteIds(next);
    writeFavoriteIds(next);
  }

  return (
    <main id="main" className="vehicle-detail-page" data-page-title={`${vehicle.name} — GTA VI WORLD`}>
      <section className="vehicle-detail-hero"><img src={activeImage || vehicle.imageUrl} alt={vehicle.name} fetchPriority="high" /><div className="vehicle-detail-hero-shade" /><div className="detail-shell vehicle-detail-hero-copy"><Link className="vehicle-back-link" to="/vehicles">← All vehicles</Link><div className="section-kicker"><span>{vehicleCategoryLabels[vehicle.category] || "Vehicle"}</span> Rockstar-source record</div><h1>{vehicle.name}</h1><p>{vehicle.manufacturer || "Manufacturer unknown"} / {vehicleCategoryLabels[vehicle.category] || "Class unconfirmed"}</p><button className={`vehicle-detail-favorite${isFavorite ? " is-favorite" : ""}`} type="button" aria-pressed={isFavorite} onClick={toggleFavorite}>{isFavorite ? "★ Saved to favourites" : "☆ Add to favourites"}</button></div><span className="vehicle-detail-verification">{vehicle.verificationStatus}</span></section>

      <section className="vehicle-detail-content detail-shell"><div className="vehicle-detail-gallery"><div className="vehicle-main-image"><img src={activeImage || vehicle.imageUrl} alt={`${vehicle.name} official artwork`} /></div>{gallery.length > 1 && <div className="vehicle-gallery-thumbs" aria-label={`${vehicle.name} image gallery`}>{gallery.map((image, index) => <button className={activeImage === image ? "is-active" : ""} type="button" onClick={() => setActiveImage(image)} aria-label={`Show ${vehicle.name} gallery image ${index + 1}`} aria-pressed={activeImage === image} key={image}><img src={image} alt="" loading="lazy" /></button>)}</div>}</div><div className="vehicle-detail-copy"><div className="section-kicker"><span>DATABASE FILE</span> {vehicle.verificationStatus}</div><h2>{vehicle.name}</h2><p>{vehicle.description || "No verified description has been added."}</p><div className="vehicle-detail-fields"><DetailField label="Manufacturer" value={vehicle.manufacturer} /><DetailField label="Category" value={vehicleCategoryLabels[vehicle.category] || vehicle.category} /><DetailField label="Real-world inspiration" value={vehicle.realLifeInspiration} /><DetailField label="Maximum speed" value={vehicle.maxSpeed} unit={vehicle.speedUnit ? ` ${vehicle.speedUnit}` : ""} /><DetailField label="Acceleration rating" value={vehicle.accelerationRating} /><DetailField label="Handling rating" value={vehicle.handlingRating} /><DetailField label="Braking rating" value={vehicle.brakingRating} /><DetailField label="In-game price" value={vehicle.inGamePrice == null ? null : `$${Number(vehicle.inGamePrice).toLocaleString()}`} /><DetailField label="Spawn / location" value={vehicle.spawnLocation} /></div><p className="vehicle-category-basis"><b>Category verification</b>{vehicle.categoryBasis || "Category not verified."}</p><a className="text-link vehicle-official-source" href={vehicle.sourceUrl} target="_blank" rel="noreferrer">Open official source <span aria-hidden="true">↗</span></a></div></section>

      <section className="vehicle-detail-footer"><div className="detail-shell"><p><b>Verification status</b>{vehicle.verificationStatus}. Unknown fields are intentionally left unfilled until tested or confirmed by a source.</p><Link className="text-link" to="/vehicles">Return to vehicle database <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}