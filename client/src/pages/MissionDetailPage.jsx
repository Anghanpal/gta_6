import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { missionCategoryLabels, missions } from "../data/missions.js";
import { readMissionFavorites, readMissionObjectives, readMissionStatuses, saveMissionFavorites, saveMissionObjectives, saveMissionStatus } from "../data/missionProgress.js";

const statusOptions = [
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

function DetailValue({ children, unknown = "Unknown in official sources." }) {
  return children ? <p>{children}</p> : <p>{unknown}</p>;
}

export default function MissionDetailPage() {
  const { id } = useParams();
  const mission = missions.find((entry) => entry.id === id);
  const [statuses, setStatuses] = useState(readMissionStatuses);
  const [favorites, setFavorites] = useState(readMissionFavorites);
  const [objectivesByMission, setObjectivesByMission] = useState(readMissionObjectives);

  if (!mission) {
    return <main id="main" className="mission-detail-empty detail-shell" data-page-title="Mission not verified — GTA VI WORLD"><Link className="mission-back-link" to="/missions">← Mission encyclopedia</Link><div className="section-kicker"><span>UNVERIFIED RECORD</span> No mission detail available</div><h1>This mission is not in the verified catalog.</h1><p>No official Rockstar source reviewed for this encyclopedia confirms this mission name or its details. No walkthrough, objectives, rewards, or story outcome has been invented.</p><a className="text-link" href="https://www.rockstargames.com/newswire" target="_blank" rel="noreferrer">Check Rockstar Newswire <span aria-hidden="true">↗</span></a></main>;
  }

  const status = statuses[mission.id] || "not-started";
  const completedObjectives = objectivesByMission[mission.id] || [];
  const favorite = favorites.includes(mission.id);

  function updateStatus(nextStatus) {
    setStatuses((current) => ({ ...current, [mission.id]: nextStatus }));
    saveMissionStatus(mission.id, nextStatus);
  }

  function toggleFavorite() {
    const next = favorite ? favorites.filter((favoriteId) => favoriteId !== mission.id) : [...favorites, mission.id];
    setFavorites(next);
    saveMissionFavorites(next);
  }

  function toggleObjective(objectiveId) {
    const current = completedObjectives;
    const nextForMission = current.includes(objectiveId) ? current.filter((entry) => entry !== objectiveId) : [...current, objectiveId];
    const next = { ...objectivesByMission, [mission.id]: nextForMission };
    setObjectivesByMission(next);
    saveMissionObjectives(next);
  }

  return (
    <main id="main" className="mission-detail-page" data-page-title={`${mission.name} — GTA VI Missions`}>
      <section className="mission-detail-hero"><img src={mission.thumbnail} alt={mission.name} fetchPriority="high" /><div className="mission-detail-shade" /><div className="detail-shell mission-detail-hero-copy"><Link className="mission-back-link" to="/missions">← All missions</Link><div className="section-kicker"><span>{missionCategoryLabels[mission.category]}</span> Verified mission record</div><h1>{mission.name}</h1><p>{mission.description}</p></div></section>

      <section className="mission-detail-content detail-shell"><div className="mission-detail-toolbar"><label><span>Mission status</span><select value={status} onChange={(event) => updateStatus(event.target.value)}>{statusOptions.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label><button className={favorite ? "is-favorite" : ""} type="button" aria-pressed={favorite} onClick={toggleFavorite}>{favorite ? "★ Favourited" : "☆ Favourite mission"}</button></div><div className="mission-detail-grid"><section><h2>Mission overview</h2><DetailValue>{mission.storyOverview}</DetailValue><h2>Walkthrough</h2><DetailValue>{mission.walkthrough}</DetailValue></section><aside><h2>Mission file</h2><dl><div><dt>Characters involved</dt><dd>{mission.characters?.length ? mission.characters.map((character) => <Link to={`/characters/${character.slug}`} key={character.slug}>{character.name}</Link>) : "Unknown"}</dd></div><div><dt>Location</dt><dd>{mission.location || "Unknown"}</dd></div><div><dt>Difficulty</dt><dd>{mission.difficulty || "Not tested"}</dd></div><div><dt>Rewards</dt><dd>{mission.rewards || "Unknown"}</dd></div><div><dt>Verification</dt><dd>{mission.verificationStatus}</dd></div></dl></aside></div>

        <section className="mission-objective-list"><h2>Objectives</h2>{mission.objectives?.length ? mission.objectives.map((objective) => <label className="mission-objective" key={objective.id}><input type="checkbox" checked={completedObjectives.includes(objective.id)} onChange={() => toggleObjective(objective.id)} /><span>{objective.text}</span></label>) : <p>Unknown in official sources.</p>}</section>

        <section className="mission-related"><h2>Related missions</h2>{mission.relatedMissions?.length ? <div>{mission.relatedMissions.map((related) => <Link to={`/missions/${related.id}`} key={related.id}>{related.name} ↗</Link>)}</div> : <p>Unknown in official sources.</p>}</section>
        <a className="text-link" href={mission.sourceUrl} target="_blank" rel="noreferrer">Open official source <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}