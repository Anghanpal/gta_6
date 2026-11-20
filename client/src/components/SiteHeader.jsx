import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About GTA 6", href: "/about" },
  { label: "Characters", href: "/characters" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Missions", href: "/missions" },
  { label: "Map", href: "/map" },
  { label: "Weapons", href: "/weapons" },
  { label: "Wildlife", href: "/wildlife" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/#gallery" },
  { label: "History", href: "/history" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const matches = navigation.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [location.pathname, location.hash]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header${location.pathname === "/" ? "" : " detail-header"}`} id="home">
      <Link className="brand" to="/" aria-label="GTA VI World home" onClick={closeMenu}>
        <span className="brand-mark">VI</span>
        <span className="brand-name">GTA <b>VI</b><small>WORLD</small></span>
      </Link>
      <button className="menu-toggle icon-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((open) => !open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <nav className={`main-nav${menuOpen ? " is-open" : ""}`} id="main-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link key={item.label} to={item.href} onClick={closeMenu} aria-current={location.pathname === item.href ? "page" : undefined}>{item.label}</Link>
        ))}
      </nav>
      <div className="search-wrap">
        <button className="search-toggle icon-button" type="button" aria-label="Search the site" aria-expanded={searchOpen} aria-controls="site-search" onClick={() => setSearchOpen((open) => !open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
        </button>
        {searchOpen && (
          <div className="search-panel" id="site-search">
            <label htmlFor="search-input">Search GTA VI World</label>
            <input id="search-input" type="search" placeholder="Try characters, map, news..." autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            {query.trim() && <div className="search-results" aria-live="polite">
              {matches.length ? matches.map((item) => <Link className="search-result" key={item.label} to={item.href} onClick={() => setSearchOpen(false)}>{item.label}</Link>) : <p className="search-empty">No matching sections. Try another search.</p>}
            </div>}
          </div>
        )}
      </div>
    </header>
  );
}