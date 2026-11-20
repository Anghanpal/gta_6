import { Link, Navigate, useParams } from "react-router-dom";
import { wildlife, wildlifeCategories } from "../data/wildlife.js";

export default function WildlifeDetailPage() {
  const { id } = useParams();
  const animal = wildlife.find((entry) => entry.id === id);
  if (!animal) return <Navigate to="/wildlife" replace />;

  return (
    <main id="main" className="wildlife-detail-page" data-page-title={`${animal.name} — GTA VI Wildlife`}>
      <section className="region-detail-hero"><img src={animal.image} alt={animal.name} fetchPriority="high" /><div className="region-detail-shade" /><div className="detail-shell region-detail-hero-copy"><Link className="region-back-link" to="/wildlife">← Wildlife database</Link><div className="section-kicker"><span>{wildlifeCategories.find((item) => item.id === animal.category)?.label}</span> Verified species record</div><h1>{animal.name}</h1><p>{animal.description}</p></div></section>
      <section className="region-detail-content detail-shell"><div className="region-detail-image"><img src={animal.image} alt={animal.name} /><a href={animal.source} target="_blank" rel="noreferrer">Open official image source ↗</a></div><div className="region-detail-copy"><div className="section-kicker"><span>SPECIES FILE</span> Confirmed details only</div><h2>{animal.name}</h2><p>{animal.description}</p><section><h3>Habitat</h3><p>{animal.habitat || "Unknown in official sources."}</p></section><section><h3>Verification</h3><p>{animal.verificationStatus}</p></section><a className="text-link" href={animal.source} target="_blank" rel="noreferrer">Open official Rockstar source <span aria-hidden="true">↗</span></a></div></section>
    </main>
  );
}