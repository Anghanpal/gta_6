import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand footer-brand" to="/" aria-label="GTA VI World home"><span className="brand-mark">VI</span><span className="brand-name">GTA <b>VI</b><small>WORLD</small></span></Link>
        <div className="footer-about"><span className="footer-label">Independent fan site</span><p>GTA VI World is an independent fan-made guide to the world of Grand Theft Auto VI.</p></div>
        <div className="footer-links"><span className="footer-label">Explore</span><Link to="/about">About GTA VI</Link><Link to="/characters">Characters</Link><Link to="/vehicles">Vehicles</Link><Link to="/missions">Missions</Link><Link to="/map">Map explorer</Link><Link to="/weapons">Weapons</Link><Link to="/wildlife">Wildlife</Link><Link to="/history">Development history</Link></div>
        <div className="footer-links"><span className="footer-label">Official links</span><a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Rockstar Games ↗</a><a href="https://www.rockstargames.com/newswire" target="_blank" rel="noreferrer">Newswire ↗</a><a href="https://www.youtube.com/@RockstarGames" target="_blank" rel="noreferrer">YouTube ↗</a></div>
      </div>
      <div className="footer-bottom"><p><b>Disclaimer</b> Grand Theft Auto, GTA VI and all related names, marks and artwork are trademarks and copyrights of Rockstar Games, Inc. This unofficial fan site is not affiliated with or endorsed by Rockstar Games.</p><span>© 2026 GTA VI WORLD / FAN-MADE</span><a href="#home">Back to top ↑</a></div>
    </footer>
  );
}