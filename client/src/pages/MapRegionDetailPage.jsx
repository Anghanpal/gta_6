import { Link, Navigate, useParams } from "react-router-dom";
import { mapRegions } from "../data/mapRegions.js";

export default function MapRegionDetailPage() {
  const { id } = useParams();
  const region = mapRegions.find((entry) => entry.id === id);
  if (!region) return <Navigate to="/map" replace />;

  return (
    <main id="main" className="region-detail-page" data-page-title={`${region.name} — GTA VI Map Explorer`}>
      <section className="region-detail-hero"><img src={region.image} alt={region.imageAlt} fetchPriority="high" /><div className="region-detail-shade" /><div className="detail-shell region-detail-hero-copy"><Link className="region-back-link" to="/map">← Map explorer</Link><div className="section-kicker"><span>{region.region}</span> Officially named region</div><h1>{region.name}</h1><p>{region.description}</p></div></section>
      <section className="region-detail-content detail-shell"><div className="region-detail-image"><img src={region.image} alt={region.imageAlt} /><a href={region.imageSource} target="_blank" rel="noreferrer">Open official image source ↗</a></div><div className="region-detail-copy"><div className="section-kicker"><span>REGION FILE</span> Verified information only</div><h2>{region.name}</h2><p>{region.description}</p><section><h3>Landmarks</h3>{region.landmarks.length ? <ul>{region.landmarks.map((landmark) => <li key={landmark}>{landmark}</li>)}</ul> : <p>No specific landmark is named in the cited official material.</p>}</section><section><h3>Interesting details</h3><ul>{region.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></section><section><h3>Related confirmed characters</h3>{region.relatedCharacters.length ? <div className="region-related-characters">{region.relatedCharacters.map((character) => <Link to={`/characters/${character.slug}`} key={character.slug}>{character.name} ↗</Link>)}</div> : <p>No character-to-region relationship is listed in the cited material.</p>}</section><a className="text-link" href={region.source} target="_blank" rel="noreferrer">Rockstar regional reference <span aria-hidden="true">↗</span></a></div></section>
      <section className="map-integrity-note region-detail-integrity detail-shell"><b>Map placement</b> No coordinate or boundary is provided here. This detail page records the region name and official description only.</section>
    </main>
  );
}