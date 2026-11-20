const rockstarPage = "https://www.rockstargames.com/VI";

const facts = [
  { label: "Full name", value: "Grand Theft Auto VI", note: "Rockstar’s official product page uses this title.", source: "Rockstar Games", href: rockstarPage },
  { label: "Developer", value: "Rockstar Games", note: "Rockstar identifies itself as the studio behind the game.", source: "Official game page", href: rockstarPage },
  { label: "Publisher", value: "Rockstar Games", note: "Rockstar Games is named as publisher in official store listings.", source: "Official game page", href: rockstarPage },
  { label: "Parent company", value: "Take-Two Interactive Software, Inc.", note: "Take-Two’s corporate site lists Rockstar Games among its labels.", source: "Take-Two Interactive", href: "https://www.take2games.com/" },
  { label: "Genre", value: "Action", note: "The PlayStation product listing categorizes the game as Action.", source: "PlayStation Store category", href: "https://www.playstation.com/GTAVIfeatures/" },
  { label: "Release date", value: "November 19, 2026", note: "Rockstar confirmed the date in its launch announcement.", source: "Launch announcement", href: "https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available" },
  { label: "Officially listed platforms", value: <>PlayStation 5<br />Xbox Series X|S</>, note: "These are the platforms currently listed on Rockstar’s official game page.", source: "Rockstar platform details", href: rockstarPage },
  { label: "Game engine", value: "Not officially specified", note: "The cited official product information does not identify an engine.", source: "No engine named on the product page", href: rockstarPage },
  { label: "Setting", value: "Leonida, including Vice City", note: "Rockstar’s official synopsis names Vice City and the state of Leonida.", source: "Welcome to Leonida", href: rockstarPage },
  { label: "PS5 Store editions", value: <>Standard Edition<br />Ultimate Edition</>, note: "These editions are listed on PlayStation; availability can vary by platform and region.", source: "PlayStation edition listings", href: "https://www.playstation.com/GTAVIfeatures/" },
];

const organizations = [
  { index: "A / DEVELOPER & PUBLISHER", title: "Rockstar Games", body: "Rockstar Games is identified on the official Grand Theft Auto VI product page as the company behind the game. Its Newswire is the primary source for official announcements, videos and post-launch notices.", links: [["GTA VI official site", rockstarPage], ["Rockstar Newswire", "https://www.rockstargames.com/newswire"]] },
  { index: "B / PARENT COMPANY", title: "Take-Two Interactive", body: "Take-Two Interactive Software, Inc. is Rockstar Games’ parent company. Take-Two’s investor-relations materials provide corporate and financial reporting context; they do not establish a GTA VI development budget.", links: [["Take-Two Interactive", "https://www.take2games.com/"], ["Investor relations", "https://www.take2games.com/ir"]] },
  { index: "C / DEVELOPMENT TEAM", title: "Rockstar’s team", body: "Rockstar Games is the confirmed developer. The public sources linked here do not provide a verified, complete studio-by-studio credit list or a staff total, so none is claimed on this page.", links: [["Rockstar corporate information", "https://www.rockstargames.com/corpinfo"]] },
];

const announcements = [
  ["01", "Rockstar Newswire", "Official announcements and updates ↗", "https://www.rockstargames.com/newswire"],
  ["02", "Grand Theft Auto VI", "Official product information ↗", rockstarPage],
  ["03", "Rockstar Games on YouTube", "Official video releases ↗", "https://www.youtube.com/@RockstarGames"],
];

export default function AboutPage() {
  return (
    <main id="main">
      <section className="detail-hero about-hero"><img src="https://img.youtube.com/vi/VQRLujxTm3c/maxresdefault.jpg" alt="Official Grand Theft Auto VI trailer artwork" fetchPriority="high" /><div className="detail-hero-shade" /><div className="detail-hero-copy"><p className="section-kicker"><span>REFERENCE / 01</span> Confirmed information</p><h1>About<br /><em>GTA VI.</em></h1><p>Game facts, from the official record.</p><a className="button button-lime" href="#game-info">Explore the details <span aria-hidden="true">↓</span></a></div><span className="detail-hero-note">LAST CHECKED / NOV 20, 2026</span></section>

      <section className="fact-section" id="game-info"><div className="detail-shell"><div className="detail-heading"><div className="section-kicker"><span>01</span> Game information</div><h2>The facts,<br /><em>in one place.</em></h2><p>Information below is limited to Rockstar Games, Take-Two Interactive and official platform materials. Each fact links to a primary source.</p></div><dl className="fact-grid">{facts.map((fact) => <div className="fact-card" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd><p className="fact-card-note">{fact.note}</p><a href={fact.href} target="_blank" rel="noreferrer">{fact.source} ↗</a></div>)}</dl><p className="fact-note"><span className="confirmed-mark" aria-hidden="true">✓</span> Rockstar also describes the Vintage Vice City Pack as an early-purchase bonus. The Standard and Ultimate editions above are listed on PlayStation’s official product page; edition names, offers and availability may differ by platform and region.</p></div></section>

      <section className="story-section"><div className="detail-shell story-layout"><div><div className="section-kicker"><span>02</span> Story overview</div><h2>Trust is<br /><em>everything.</em></h2></div><div className="story-copy"><p>Jason and Lucia have always known the deck is stacked against them. When an easy score goes wrong, they find themselves on the darkest side of the sunniest place in America, caught in a criminal conspiracy stretching across Leonida.</p><p>Rockstar’s official synopsis says they must rely on each other more than ever if they want to make it out alive. The story follows the pair across Vice City and the wider state.</p><a className="text-link" href={rockstarPage} target="_blank" rel="noreferrer">Read Rockstar’s synopsis <span aria-hidden="true">↗</span></a></div></div></section>

      <section className="context-section"><div className="detail-shell"><div className="section-kicker"><span>03</span> The organizations</div><h2>Who makes<br /><em>the game.</em></h2><div className="context-grid">{organizations.map((organization) => <article className="context-card" key={organization.index}><span className="context-index">{organization.index}</span><h3>{organization.title}</h3><p>{organization.body}</p>{organization.links.map(([label, href]) => <a href={href} target="_blank" rel="noreferrer" key={label}>{label} ↗</a>)}</article>)}</div></div></section>

      <section className="official-section"><div className="detail-shell official-layout"><div><div className="section-kicker"><span>04</span> Official game announcements</div><h2>Primary sources.<br /><em>No guesswork.</em></h2></div><div className="official-links">{announcements.map(([number, title, description, href]) => <a href={href} target="_blank" rel="noreferrer" key={number}><span>{number}</span><b>{title}</b><i>{description}</i></a>)}<a href="/history"><span>04</span><b>Development history</b><i>View the sourced timeline ↗</i></a></div></div></section>

      <section className="status-section"><div className="detail-shell status-layout"><div className="status-label"><span className="confirmed-mark" aria-hidden="true">✓</span> Confirmed</div><div><h2>What is not confirmed?</h2><p>Rockstar has not officially named the game engine on the cited product page. We do not publish rumors, assumed PC availability, unverified development start dates, speculative costs, or staff estimates as facts. “Publicly confirmed in development” is not a claim about when development began.</p></div><a className="text-link" href="/history">See the sourcing policy <span aria-hidden="true">↗</span></a></div></section>
    </main>
  );
}