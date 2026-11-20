import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { mapRegions } from "../data/mapRegions.js";

const officialMapPreview = "https://www.rockstargames.com/VI/_next/static/media/mapPromoCard.0gcwsrkum~6o_.jpg?akim=1&imdensity=1&imwidth=2048";
const officialMapSource = "https://www.rockstargames.com/VI/downloads";

export default function MapExplorerPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(mapRegions[0]?.id || "");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredRegions = mapRegions.filter((place) => [place.name, place.region, place.description, ...place.details, ...place.landmarks].join(" ").toLowerCase().includes(deferredQuery));
  const selectedRegion = filteredRegions.find((region) => region.id === selectedId) || filteredRegions[0];

  return (
    <main id="main" className="explorer-page">
      <section className="explorer-hero"><img src={officialMapPreview} alt="Official Rockstar Games map poster preview for Leonida" fetchPriority="high" /><div className="explorer-hero-shade" /><div className="detail-shell explorer-hero-copy"><div className="section-kicker"><span>LEONIDA FIELD ATLAS</span> Official regional references</div><h1>Find your<br /><em>way around.</em></h1><p>Explore named regions from Rockstar’s official pages. This preview is official promotional map artwork; the region index below does not add pins or claim relative positions.</p><a className="button button-lime" href={officialMapSource} target="_blank" rel="noreferrer">Official map poster <span aria-hidden="true">↗</span></a></div></section>

      <section className="explorer-content detail-shell">
        <div className="explorer-heading"><div><div className="section-kicker"><span>01</span> Regional index</div><h2>Six named<br /><em>places.</em></h2></div><p>Rockstar’s official game site and media gallery name these locations. Where no landmark or boundary is published, it remains unlisted.</p></div>
        <label className="explorer-search"><span>Search regions</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a region or detail..." /></label>

        {selectedRegion && <div className="official-map-explorer"><div className="official-map-image"><img src={officialMapPreview} alt="Official Rockstar Leonida map poster preview; no region pins added" loading="lazy" /><a href={officialMapSource} target="_blank" rel="noreferrer">ROCKSTAR OFFICIAL MAP ART ↗</a></div><div className="map-region-inspector"><span className="section-kicker"><span>SELECTED REGION</span> {selectedRegion.region}</span><img src={selectedRegion.image} alt={selectedRegion.imageAlt} loading="lazy" /><h2>{selectedRegion.name}</h2><p>{selectedRegion.description}</p><Link className="text-link" to={`/map/${selectedRegion.id}`}>Open region details <span aria-hidden="true">↗</span></Link></div></div>}

        <div className="region-card-grid">{filteredRegions.map((region) => <article className={`region-card${selectedRegion?.id === region.id ? " is-selected" : ""}`} key={region.id}><button className="region-card-select" type="button" aria-pressed={selectedRegion?.id === region.id} onClick={() => setSelectedId(region.id)}><img src={region.image} alt={region.imageAlt} loading="lazy" /><span className="region-card-region">{region.region}</span><b>{region.name}</b></button><div className="region-card-bottom"><span>{region.landmarks.length ? `${region.landmarks.length} named landmark${region.landmarks.length > 1 ? "s" : ""}` : "No named landmarks confirmed"}</span><Link to={`/map/${region.id}`} aria-label={`View ${region.name} details`}>↗</Link></div></article>)}</div>
        {filteredRegions.length === 0 && <div className="database-empty"><h2>No matching regions.</h2><p>Try another search. The regional index only includes official names.</p></div>}
        <p className="map-integrity-note"><b>Geography note</b> The official preview image is credited to Rockstar Games. This explorer does not interpret its pixels as a navigable map or draw unverified borders, coordinates, routes, or region pins.</p>
      </section>
    </main>
  );
}