import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { missionCategories, missionCategoryLabels, missions } from "../data/missions.js";
import { readMissionFavorites, readMissionStatuses, saveMissionFavorites, saveMissionStatus } from "../data/missionProgress.js";

const missionStatuses = [
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

function MissionCard({ mission, status, favorite, onStatusChange, onFavorite }) {
  return (
    <article className="mission-record-card">
      <Link className="mission-record-main" to={`/missions/${mission.id}`}>
        <span className="mission-record-image"><img src={mission.thumbnail} alt={mission.name} loading="lazy" /><span>{missionCategories.find((category) => category.id === mission.category)?.label}</span></span>
        <span className="mission-record-copy"><span className="mission-record-kicker">{mission.verificationStatus}</span><b>{mission.name}</b><span>{mission.description}</span></span>
      </Link>
      <div className="mission-record-actions"><label><span>Progress</span><select value={status} onChange={(event) => onStatusChange(mission.id, event.target.value)}>{missionStatuses.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label><button className={favorite ? "is-favorite" : ""} type="button" aria-pressed={favorite} onClick={() => onFavorite(mission.id)}>{favorite ? "★ Favourited" : "☆ Favourite"}</button></div>
    </article>
  );
}

export default function MissionsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [statuses, setStatuses] = useState(readMissionStatuses);
  const [favorites, setFavorites] = useState(readMissionFavorites);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredMissions = missions.filter((mission) => {
    const status = statuses[mission.id] || "not-started";
    const text = [mission.name, mission.description, mission.storyOverview, mission.location, ...(mission.characters || [])].join(" ").toLowerCase();
    return (category === "all" || mission.category === category)
      && (statusFilter === "all" || status === statusFilter)
      && (!favoritesOnly || favorites.includes(mission.id))
      && text.includes(deferredQuery);
  });

  function changeStatus(missionId, status) {
    const next = { ...statuses, [missionId]: status };
    setStatuses(next);
    saveMissionStatus(missionId, status);
  }

  function toggleFavorite(missionId) {
    const next = favorites.includes(missionId) ? favorites.filter((id) => id !== missionId) : [...favorites, missionId];
    setFavorites(next);
    saveMissionFavorites(next);
  }

  return (
    <main id="main" className="missions-page">
      <section className="missions-hero"><img src="https://img.youtube.com/vi/VQRLujxTm3c/maxresdefault.jpg" alt="Official Grand Theft Auto VI trailer artwork; not mission-specific" fetchPriority="high" /><div className="missions-hero-shade" /><div className="detail-shell missions-hero-copy"><div className="section-kicker"><span>LEONIDA CASE FILES</span> Verified information only</div><h1>Stories in<br /><em>motion.</em></h1><p>Mission and activity records are added only when Rockstar publishes verifiable names and details.</p><span className="missions-hero-status">ROCKSTAR MISSION INDEX / NOT PUBLISHED</span></div></section>

      <section className="missions-directory detail-shell" aria-label="Mission and activity encyclopedia">
        <div className="missions-toolbar"><label className="missions-search"><span>Search missions and activities</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search verified mission details..." /></label><label className="missions-status-filter"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{missionStatuses.map((status) => <option value={status.id} key={status.id}>{status.label}</option>)}</select></label><button className={`missions-favorites-filter${favoritesOnly ? " is-active" : ""}`} type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly((active) => !active)}>★ Favourites</button></div>

        <div className="missions-category-filters" aria-label="Filter by mission category"><button className={`missions-category-filter${category === "all" ? " is-active" : ""}`} type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All categories <span>{missions.length}</span></button>{missionCategories.map((missionCategory) => <button className={`missions-category-filter${category === missionCategory.id ? " is-active" : ""}`} type="button" aria-pressed={category === missionCategory.id} onClick={() => setCategory(missionCategory.id)} key={missionCategory.id}>{missionCategory.label}<span>{missions.filter((mission) => mission.category === missionCategory.id).length}</span></button>)}</div>

        <div className="missions-results-line"><p aria-live="polite">{filteredMissions.length} verified entries</p><a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Official GTA VI source ↗</a></div>
        {filteredMissions.length ? <div className="missions-grid">{filteredMissions.map((mission) => <MissionCard key={mission.id} mission={mission} status={statuses[mission.id] || "not-started"} favorite={favorites.includes(mission.id)} onStatusChange={changeStatus} onFavorite={toggleFavorite} />)}</div> : <section className="missions-empty"><span className="empty-file-mark" aria-hidden="true">VI</span><p className="section-kicker">NO VERIFIED RECORDS</p><h2>{query ? "No matching mission records." : "Rockstar has not published a mission list."}</h2><p>The official GTA VI pages reviewed publish character bios, trailers, and setting information, but no named mission catalog or mission objectives. This encyclopedia stays empty until verifiable mission details are available.</p><div className="mission-source-links"><a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Rockstar GTA VI ↗</a><a href="https://www.rockstargames.com/newswire" target="_blank" rel="noreferrer">Rockstar Newswire ↗</a></div></section>}
        <p className="missions-local-note">Mission status, favourites, and objective checklists are stored locally in this browser.</p>
      </section>
    </main>
  );
}