import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { vehicleCategories, vehicleCategoryLabels } from "../data/vehicleCategories.js";
import { readFavoriteIds, writeFavoriteIds } from "../data/vehiclePreferences.js";

function displayValue(value, unit = "") {
  if (value === null || value === undefined || value === "") return "Not published";
  return `${value}${unit}`;
}

function VehicleCard({ vehicle, favorite, compared, onToggleFavorite, onToggleCompare }) {
  return (
    <article className="vehicle-database-card">
      <Link className="vehicle-database-card-main" to={`/vehicles/${vehicle.id}`}>
        <span className="vehicle-database-image"><img src={vehicle.imageUrl} alt={vehicle.name} loading="lazy" /><span className="vehicle-image-status">{vehicle.verificationStatus}</span><span className="vehicle-card-open" aria-hidden="true">↗</span></span>
        <span className="vehicle-card-copy"><span className="vehicle-card-category">{vehicleCategoryLabels[vehicle.category] || "Unclassified"}</span><b>{vehicle.name}</b><span>{vehicle.manufacturer || "Manufacturer unknown"}</span></span>
      </Link>
      <div className="vehicle-card-actions"><button className={`vehicle-icon-action${favorite ? " is-favorite" : ""}`} type="button" aria-label={favorite ? `Remove ${vehicle.name} from favourites` : `Add ${vehicle.name} to favourites`} aria-pressed={favorite} onClick={() => onToggleFavorite(vehicle.id)}><span aria-hidden="true">{favorite ? "★" : "☆"}</span><span>{favorite ? "Saved" : "Favourite"}</span></button><button className={`vehicle-icon-action${compared ? " is-compared" : ""}`} type="button" aria-label={compared ? `Remove ${vehicle.name} from comparison` : `Compare ${vehicle.name}`} aria-pressed={compared} onClick={() => onToggleCompare(vehicle.id)}><span aria-hidden="true">⇄</span><span>{compared ? "Comparing" : "Compare"}</span></button></div>
    </article>
  );
}

function ComparisonPanel({ vehicles, onRemove }) {
  const rows = [
    ["Manufacturer", (vehicle) => vehicle.manufacturer || "Unknown"],
    ["Category", (vehicle) => vehicleCategoryLabels[vehicle.category] || "Unclassified"],
    ["Maximum speed", (vehicle) => displayValue(vehicle.maxSpeed, ` ${vehicle.speedUnit || "mph"}`)],
    ["Acceleration rating", (vehicle) => displayValue(vehicle.accelerationRating)],
    ["Handling rating", (vehicle) => displayValue(vehicle.handlingRating)],
    ["Braking rating", (vehicle) => displayValue(vehicle.brakingRating)],
    ["In-game price", (vehicle) => vehicle.inGamePrice == null ? "Unknown" : `$${Number(vehicle.inGamePrice).toLocaleString()}`],
  ];

  return (
    <section className="vehicle-comparison" aria-label="Vehicle comparison">
      <div className="comparison-heading"><div><span className="section-kicker">SIDE-BY-SIDE</span><h2>Vehicle comparison</h2></div><p>Only recorded values are compared. Unpublished values remain unknown.</p></div>
      <div className="comparison-table" style={{ "--compare-columns": vehicles.length }}><div className="comparison-label-spacer" />{vehicles.map((vehicle) => <div className="comparison-vehicle-heading" key={vehicle.id}><img src={vehicle.imageUrl} alt="" /><b>{vehicle.name}</b><button type="button" onClick={() => onRemove(vehicle.id)} aria-label={`Remove ${vehicle.name} from comparison`}>Remove</button></div>)}{rows.map(([label, value]) => <div className="comparison-row" key={label}><b>{label}</b>{vehicles.map((vehicle) => <span key={vehicle.id}>{value(vehicle)}</span>)}</div>)}</div>
    </section>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds);
  const [compareIds, setCompareIds] = useState([]);
  const [compareMessage, setCompareMessage] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/vehicles", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Vehicle catalog could not be loaded.");
        return response.json();
      })
      .then((data) => {
        setVehicles(Array.isArray(data) ? data : []);
        setLoadError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function toggleFavorite(id) {
    const next = favoriteIds.includes(id) ? favoriteIds.filter((favoriteId) => favoriteId !== id) : [...favoriteIds, id];
    setFavoriteIds(next);
    writeFavoriteIds(next);
  }

  function toggleCompare(id) {
    setCompareMessage("");
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id);
      if (current.length >= 2) {
        setCompareMessage("Compare up to two vehicles at a time.");
        return current;
      }
      return [...current, id];
    });
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesCategory = activeCategory === "all" || vehicle.category === activeCategory;
    const matchesFavorite = !favoritesOnly || favoriteIds.includes(vehicle.id);
    const searchableText = [vehicle.name, vehicle.manufacturer, vehicle.category, vehicle.description, vehicle.categoryBasis].filter(Boolean).join(" ").toLowerCase();
    return matchesCategory && matchesFavorite && searchableText.includes(deferredQuery);
  }).sort((left, right) => {
    if (sortBy === "tested-speed") {
      const speedDifference = (right.maxSpeed ?? Number.NEGATIVE_INFINITY) - (left.maxSpeed ?? Number.NEGATIVE_INFINITY);
      return speedDifference || left.name.localeCompare(right.name);
    }
    return left.name.localeCompare(right.name);
  });

  const comparedVehicles = compareIds.map((id) => vehicles.find((vehicle) => vehicle.id === id)).filter(Boolean);

  return (
    <main id="main" className="vehicle-database-page">
      <section className="vehicle-database-hero"><img src="https://www.rockstargames.com/VI/_next/static/media/desktop.0f24gg8jqbkum.jpg?akim=1&imdensity=1&imwidth=1600" alt="Official Grand Theft Auto VI Leonida artwork" fetchPriority="high" /><div className="vehicle-database-hero-shade" /><div className="detail-shell vehicle-database-hero-copy"><div className="section-kicker"><span>LEONIDA MOTOR REGISTER</span> Rockstar-source entries</div><h1>Built for<br /><em>the road.</em></h1><p>Officially named vehicles with source-linked images. Untested stats, prices and locations stay blank until verified.</p><div className="vehicle-database-count">{vehicles.length.toString().padStart(2, "0")} VERIFIED NAMES / {vehicleCategories.length - 1} CATEGORIES</div></div></section>

      <section className="vehicle-directory detail-shell" aria-label="Vehicle database">
        <div className="vehicle-directory-toolbar"><label className="vehicle-search"><span>Search vehicles</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, manufacturer or type..." /></label><label className="vehicle-sort"><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Name A–Z</option><option value="tested-speed">Tested top speed</option></select></label><button className={`favorites-filter${favoritesOnly ? " is-active" : ""}`} type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly((active) => !active)}>★ {favoritesOnly ? "Showing favourites" : "Favourites"}</button></div>

        <div className="vehicle-category-filters" aria-label="Filter by vehicle category"><button className={`vehicle-category-filter${activeCategory === "all" ? " is-active" : ""}`} type="button" aria-pressed={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All types <span>{vehicles.length}</span></button>{vehicleCategories.map((category) => <button className={`vehicle-category-filter${activeCategory === category.id ? " is-active" : ""}`} type="button" aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)} key={category.id}>{category.label}<span>{vehicles.filter((vehicle) => vehicle.category === category.id).length}</span></button>)}</div>

        <div className="vehicle-results-bar"><p aria-live="polite">{filteredVehicles.length} {filteredVehicles.length === 1 ? "vehicle" : "vehicles"}</p><Link to="/admin/vehicles">Catalog administration ↗</Link></div>
        {compareMessage && <p className="compare-message" role="status">{compareMessage}</p>}
        {loading ? <p className="vehicle-state">Loading the verified vehicle catalog…</p> : loadError ? <div className="vehicle-state vehicle-state-error"><h2>Catalog unavailable</h2><p>{loadError}</p><button className="text-link" type="button" onClick={() => window.location.reload()}>Retry <span aria-hidden="true">↻</span></button></div> : filteredVehicles.length ? <div className="vehicle-database-grid">{filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} favorite={favoriteIds.includes(vehicle.id)} compared={compareIds.includes(vehicle.id)} onToggleFavorite={toggleFavorite} onToggleCompare={toggleCompare} />)}</div> : <div className="vehicle-state vehicle-state-empty"><h2>No verified listings in this selection.</h2><p>This category is ready for sourced entries. Rockstar has not named a vehicle in the current record reviewed for this database.</p></div>}

        {comparedVehicles.length === 2 && <ComparisonPanel vehicles={comparedVehicles} onRemove={toggleCompare} />}
        {comparedVehicles.length === 1 && <p className="compare-hint">Select one more vehicle to compare published values side by side.</p>}
        <p className="vehicle-source-note">“Verified” means Rockstar names or depicts the vehicle in official GTA VI media. Category labels may be editorial when Rockstar does not publish an in-game class. No untested performance values, in-game prices, or spawn locations are supplied.</p>
      </section>
    </main>
  );
}