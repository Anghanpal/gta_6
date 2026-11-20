import { Link, Navigate, useParams } from "react-router-dom";
import { characterCategories, getCharacter, getRelatedCharacters } from "../data/characters.js";

const fields = [
  ["Biography", "biography"],
  ["Background", "background"],
  ["Personality", "personality"],
  ["Relationships", "relationships"],
  ["Story involvement", "storyInvolvement"],
  ["Associated locations", "locations"],
];

function FieldValue({ value }) {
  if (Array.isArray(value)) return value.length ? <ul>{value.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Unknown in official sources.</p>;
  return <p>{value || "Unknown in official sources."}</p>;
}

export default function CharacterProfilePage() {
  const { slug } = useParams();
  const character = getCharacter(slug);

  if (!character) return <Navigate to="/characters" replace />;

  const relatedCharacters = getRelatedCharacters(character);
  const categoryLabels = character.categories.map((category) => characterCategories.find((item) => item.id === category)?.label).filter(Boolean);

  return (
    <main id="main" className="character-profile-page" data-page-title={`${character.name} — GTA VI WORLD`}>
      <section className="character-profile-hero"><img src={character.portrait} alt={character.portraitAlt} fetchPriority="high" style={{ objectPosition: character.portraitPosition }} /><div className="profile-hero-shade" /><div className="detail-shell profile-hero-copy"><Link className="profile-back-link" to="/characters">← All characters</Link><div className="section-kicker"><span>OFFICIAL PROFILE</span> Rockstar Games / Leonida</div><h1>{character.name}</h1><p>{character.role}</p><div className="profile-tags">{categoryLabels.map((label) => <span key={label}>{label}</span>)}</div></div><span className="profile-art-credit">PORTRAIT / ROCKSTAR GAMES</span></section>

      <section className="profile-content detail-shell"><div className="profile-overview"><div className="section-kicker"><span>CHARACTER FILE</span> Confirmed details only</div><h2>{character.fullName}</h2><p>{character.biography}</p><a className="text-link" href={character.source} target="_blank" rel="noreferrer">Official character profile <span aria-hidden="true">↗</span></a><a className="profile-image-link" href={character.imageSource} target="_blank" rel="noreferrer">View Rockstar character artwork <span aria-hidden="true">↗</span></a></div><div className="profile-facts">{fields.map(([label, key]) => <section className="profile-fact" key={key}><h3>{label}</h3><FieldValue value={character[key]} /></section>)}</div></section>

      <section className="related-section"><div className="detail-shell"><div className="section-heading"><div><div className="section-kicker"><span>CONNECTED FILES</span> Officially named relationships</div><h2>Related<br /><em>characters.</em></h2></div><Link className="text-link" to="/characters">Browse all profiles <span aria-hidden="true">↗</span></Link></div>{relatedCharacters.length ? <div className="related-grid">{relatedCharacters.map((related) => <Link className="related-card" to={`/characters/${related.slug}`} key={related.slug}><img src={related.portrait} alt={related.portraitAlt} loading="lazy" style={{ objectPosition: related.portraitPosition }} /><span className="related-overlay" /><span className="related-card-name">{related.name}</span><span className="related-card-arrow" aria-hidden="true">↗</span></Link>)}</div> : <p className="related-unknown">No direct relationship to another profile in this database has been confirmed by the cited official material.</p>}</div></section>

      <section className="profile-source-note"><div className="detail-shell"><p><b>Source note</b> Biographical summaries are paraphrased from Rockstar Games’ official character profiles. Any unstated identity, trait, relationship or story outcome is intentionally left unknown.</p><a href={character.source} target="_blank" rel="noreferrer">Open Rockstar’s character page ↗</a></div></section>
    </main>
  );
}