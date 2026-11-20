import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { characterCategories, characters } from "../data/characters.js";

export default function CharacterDirectoryPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredCharacters = characters.filter((character) => {
    const matchesCategory = activeCategory === "all" || character.categories.includes(activeCategory);
    const searchText = [character.name, character.fullName, character.role, character.biography, character.background, ...character.locations].join(" ").toLowerCase();
    return matchesCategory && searchText.includes(deferredQuery);
  });

  return (
    <main id="main" className="character-database-page">
      <section className="database-hero"><img src="https://www.rockstargames.com/VI/_next/static/media/desktop.0f24gg8jqbkum.jpg?akim=1&imdensity=1&imwidth=1600" alt="Leonida at sunset in official Grand Theft Auto VI artwork" fetchPriority="high" /><div className="database-hero-shade" /><div className="detail-shell database-hero-copy"><div className="section-kicker"><span>THE LEONIDA INDEX</span> Officially profiled characters</div><h1>Faces of<br /><em>Leonida.</em></h1><p>Search the confirmed cast. Character details and portraits link to Rockstar’s official profile material.</p><span className="database-count">{characters.length.toString().padStart(2, "0")} PROFILES / SOURCE-LINKED</span></div></section>

      <section className="character-directory detail-shell" aria-label="Character directory">
        <div className="directory-toolbar"><label className="directory-search"><span>Search characters</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, role, background, location..." /></label><p className="directory-result-count" aria-live="polite">{filteredCharacters.length} {filteredCharacters.length === 1 ? "profile" : "profiles"}</p></div>
        <div className="category-filters" aria-label="Filter by character category">{characterCategories.map((category) => <button className={`category-filter${activeCategory === category.id ? " is-active" : ""}`} type="button" aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)} key={category.id}>{category.label}</button>)}</div>
        {filteredCharacters.length ? <div className="character-directory-grid">{filteredCharacters.map((character) => <Link className="directory-card" to={`/characters/${character.slug}`} key={character.slug}><span className="directory-card-image"><img src={character.portrait} alt={character.portraitAlt} loading="lazy" style={{ objectPosition: character.portraitPosition }} /><span className="directory-card-index">{character.name === "Jason Duval" ? "01" : character.name === "Lucia Caminos" ? "02" : "CONFIRMED"}</span><span className="directory-card-arrow" aria-hidden="true">↗</span></span><span className="directory-card-body"><span className="directory-card-categories">{character.categories.slice(0, 2).map((category) => characterCategories.find((item) => item.id === category)?.label).filter(Boolean).join(" / ")}</span><b>{character.name}</b><span>{character.role}</span></span></Link>)}</div> : <div className="directory-empty"><h2>No matches</h2><p>Try another name, role, location, or category.</p><button className="text-link" type="button" onClick={() => { setQuery(""); setActiveCategory("all"); }}>Clear filters <span aria-hidden="true">↺</span></button></div>}
        <p className="directory-source-note">“Full name,” personality and relationship details not stated by Rockstar are marked unknown. Bae-Luxe and Roxy use the official shared Real Dimez portrait because Rockstar publishes their profile together.</p>
      </section>
    </main>
  );
}