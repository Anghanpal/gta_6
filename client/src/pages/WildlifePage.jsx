import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { wildlife, wildlifeCategories } from "../data/wildlife.js";

export default function WildlifePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = wildlife.filter((animal) => (category === "all" || animal.category === category) && [animal.name, animal.description, animal.habitat].join(" ").toLowerCase().includes(deferredQuery));

  return (
    <main id="main" className="encyclopedia-page wildlife-page">
      <section className="encyclopedia-hero wildlife-hero"><img src="https://www.rockstargames.com/VI/_next/static/media/Mount_Kalaga_National_Park_01.0v5fl0f83hjv_.jpg?akim=1&imdensity=1&imwidth=1600" alt="Official Rockstar Games Mount Kalaga National Park artwork; no animal species identified" fetchPriority="high" /><div className="encyclopedia-hero-shade" /><div className="detail-shell encyclopedia-hero-copy"><div className="section-kicker"><span>LEONIDA NATURALIST</span> Verified wildlife only</div><h1>Wild things,<br /><em>untold.</em></h1><p>Species and habitat records appear only when confirmed by official Rockstar material.</p></div></section>
      <section className="encyclopedia-content detail-shell"><div className="encyclopedia-toolbar"><label><span>Search wildlife</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Species, habitat or description..." /></label><span className="encyclopedia-count">{filtered.length} verified entries</span></div><div className="encyclopedia-filters" aria-label="Filter by wildlife category"><button type="button" className={category === "all" ? "is-active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>All categories <span>{wildlife.length}</span></button>{wildlifeCategories.map((wildlifeCategory) => <button type="button" className={category === wildlifeCategory.id ? "is-active" : ""} aria-pressed={category === wildlifeCategory.id} onClick={() => setCategory(wildlifeCategory.id)} key={wildlifeCategory.id}>{wildlifeCategory.label}<span>{wildlife.filter((animal) => animal.category === wildlifeCategory.id).length}</span></button>)}</div>
        {filtered.length ? <div className="encyclopedia-card-grid">{filtered.map((animal) => <Link className="encyclopedia-card" to={`/wildlife/${animal.id}`} key={animal.id}><span className="encyclopedia-card-image"><img src={animal.image} alt={animal.name} loading="lazy" /><span>{animal.verificationStatus}</span></span><span className="encyclopedia-card-copy"><span>{wildlifeCategories.find((item) => item.id === animal.category)?.label}</span><b>{animal.name}</b><small>{animal.description}</small><i>Open species file ↗</i></span></Link>)}</div> : <div className="database-empty"><span className="empty-file-mark" aria-hidden="true">VI</span><span className="section-kicker">NO VERIFIED SPECIES</span><h2>{query ? "No matching species." : "No wildlife list has been published."}</h2><p>The official Rockstar pages reviewed name Leonida regions and show natural environments, but do not provide a verified animal-species catalog with habitats. No species or habitat has been inferred from imagery.</p><a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Rockstar GTA VI ↗</a></div>}
        <p className="encyclopedia-source-note">A landscape image is not treated as evidence that a species appears in the game.</p>
      </section>
    </main>
  );
}