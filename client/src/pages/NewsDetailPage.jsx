import { Link, Navigate, useParams } from "react-router-dom";
import { gtaViNews, officialNewsArchive } from "../data/news.js";

export default function NewsDetailPage() {
  const { id } = useParams();
  const story = gtaViNews.find((entry) => entry.id === id);
  if (!story) return <Navigate to="/news" replace />;

  const storyDate = new Date(`${story.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <main id="main" className="news-detail-page" data-page-title={`${story.title} — GTA VI WORLD`}>
      <section className="news-detail-hero"><img src={story.image} alt={`${story.title} official Rockstar artwork`} fetchPriority="high" /><div className="news-detail-shade" /><div className="detail-shell news-detail-hero-copy"><Link className="news-back-link" to="/news">← All GTA VI news</Link><div className="section-kicker"><span>{story.category}</span> Official Rockstar Newswire</div><time dateTime={story.date}>{storyDate}</time><h1>{story.title}</h1><p>{story.summary}</p></div></section>
      <section className="news-detail-content detail-shell"><div className="news-detail-story"><div className="section-kicker"><span>NEWS FILE</span> Rockstar Games / Grand Theft Auto VI</div><h2>{story.title}</h2><p>{story.summary}</p>{story.video && <a className="news-video-link" href={story.video} target="_blank" rel="noreferrer"><span className="news-video-play" aria-hidden="true">▶</span><span><small>OFFICIAL VIDEO</small><b>{story.videoLabel}</b></span><span className="news-video-arrow" aria-hidden="true">↗</span></a>}<p className="news-detail-attribution">This entry summarizes the official post headline and preview. For the complete article, use Rockstar’s original source.</p><a className="button button-lime" href={story.source} target="_blank" rel="noreferrer">Read the official Newswire post <span aria-hidden="true">↗</span></a></div><aside className="news-detail-aside"><span className="section-kicker"><span>ORIGINAL SOURCE</span> Rockstar Games</span><a href={story.source} target="_blank" rel="noreferrer">{story.title} ↗</a><a href={officialNewsArchive} target="_blank" rel="noreferrer">GTA VI Newswire archive ↗</a></aside></section>
    </main>
  );
}