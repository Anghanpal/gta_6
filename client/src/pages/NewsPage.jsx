import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { gtaViNews, officialNewsArchive } from "../data/news.js";

const newsCategories = ["All updates", ...new Set(gtaViNews.map((story) => story.category))];

export default function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All updates");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredStories = gtaViNews.filter((story) => (category === "All updates" || story.category === category)
    && [story.title, story.summary, story.category].join(" ").toLowerCase().includes(deferredQuery));

  return (
    <main id="main" className="news-archive-page">
      <section className="news-archive-hero"><img src="https://img.youtube.com/vi/VQRLujxTm3c/maxresdefault.jpg" alt="Official Grand Theft Auto VI Trailer 2 promotional artwork" fetchPriority="high" /><div className="news-archive-hero-shade" /><div className="detail-shell news-archive-hero-copy"><div className="section-kicker"><span>ROCKSTAR NEWSWIRE</span> GTA VI archive</div><h1>Every story<br /><em>so far.</em></h1><p>Official Grand Theft Auto VI Newswire posts, linked to Rockstar. Browse the current tagged archive snapshot.</p><div className="news-archive-hero-actions"><Link className="button button-lime" to="/news/trailer-1">Trailer 1 <span aria-hidden="true">↗</span></Link><Link className="button button-glass" to="/news/trailer-2">Trailer 2 <span aria-hidden="true">↗</span></Link></div><span className="news-archive-stamp">ARCHIVE CHECKED / NOV 20, 2026</span></div></section>

      <section className="news-archive-content detail-shell"><div className="news-archive-toolbar"><label><span>Search GTA VI news</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search headlines or summaries..." /></label><a href={officialNewsArchive} target="_blank" rel="noreferrer">Open live Rockstar archive ↗</a></div><div className="news-archive-filters" aria-label="Filter news by category">{newsCategories.map((item) => <button className={category === item ? "is-active" : ""} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}<span>{item === "All updates" ? gtaViNews.length : gtaViNews.filter((story) => story.category === item).length}</span></button>)}</div><div className="news-archive-count" aria-live="polite">{filteredStories.length} official {filteredStories.length === 1 ? "story" : "stories"}</div>

        {filteredStories.length ? <div className="news-archive-grid">{filteredStories.map((story, index) => <Link className={`news-archive-card${story.id.startsWith("trailer-") ? " is-trailer" : ""}`} to={`/news/${story.id}`} key={story.id}><span className="news-archive-image"><img src={story.image} alt={`${story.title} Rockstar Newswire artwork`} loading="lazy" /><span className="news-archive-category">{story.category}</span><span className="news-archive-card-number">{String(index + 1).padStart(2, "0")}</span></span><span className="news-archive-card-copy"><time dateTime={story.date}>{new Date(`${story.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time><b>{story.title}</b><small>{story.summary}</small><i>Read story ↗</i></span></Link>)}</div> : <div className="database-empty"><span className="section-kicker">NO MATCHES</span><h2>No GTA VI stories found.</h2><p>Try another search or category.</p></div>}
        <p className="news-archive-note">This page lists stories currently shown in Rockstar’s GTA VI Newswire tag. New posts may appear in the <a href={officialNewsArchive} target="_blank" rel="noreferrer">live official archive ↗</a>.</p>
      </section>
    </main>
  );
}