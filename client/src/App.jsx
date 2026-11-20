import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteFooter from "./components/SiteFooter.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import VehicleAdminPage from "./pages/VehicleAdminPage.jsx";
import VehicleDetailPage from "./pages/VehicleDetailPage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";
import CharacterDirectoryPage from "./pages/CharacterDirectoryPage.jsx";
import CharacterProfilePage from "./pages/CharacterProfilePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MissionDetailPage from "./pages/MissionDetailPage.jsx";
import MissionsPage from "./pages/MissionsPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";
import MapExplorerPage from "./pages/MapExplorerPage.jsx";
import MapRegionDetailPage from "./pages/MapRegionDetailPage.jsx";
import WeaponsPage from "./pages/WeaponsPage.jsx";
import WeaponDetailPage from "./pages/WeaponDetailPage.jsx";
import WildlifePage from "./pages/WildlifePage.jsx";
import WildlifeDetailPage from "./pages/WildlifeDetailPage.jsx";

const pageTitles = {
  "/": "GTA VI WORLD — Explore Leonida",
  "/about": "About GTA VI — GTA VI WORLD",
  "/characters": "GTA VI Characters — GTA VI WORLD",
  "/vehicles": "GTA VI Vehicle Database — GTA VI WORLD",
  "/missions": "GTA VI Missions & Activities — GTA VI WORLD",
  "/news": "GTA VI News Archive — GTA VI WORLD",
  "/map": "GTA VI Map Explorer — GTA VI WORLD",
  "/weapons": "GTA VI Weapons Database — GTA VI WORLD",
  "/wildlife": "GTA VI Wildlife Database — GTA VI WORLD",
  "/admin/vehicles": "Vehicle Catalog Admin — GTA VI WORLD",
  "/history": "GTA VI Development History — GTA VI WORLD",
};

function PageEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const routeTitle = document.querySelector("[data-page-title]")?.getAttribute("data-page-title");
    document.title = routeTitle || pageTitles[pathname] || (pathname.startsWith("/vehicles/") ? "Vehicle details — GTA VI WORLD" : "GTA VI WORLD");
    document.body.classList.toggle("detail-page", pathname !== "/");
    document.body.classList.toggle("history-page", pathname === "/history");
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.classList.remove("detail-page", "history-page");
    };
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <PageEffects />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/characters" element={<CharacterDirectoryPage />} />
        <Route path="/characters/:slug" element={<CharacterProfilePage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/missions/:id" element={<MissionDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/map" element={<MapExplorerPage />} />
        <Route path="/map/:id" element={<MapRegionDetailPage />} />
        <Route path="/weapons" element={<WeaponsPage />} />
        <Route path="/weapons/:id" element={<WeaponDetailPage />} />
        <Route path="/wildlife" element={<WildlifePage />} />
        <Route path="/wildlife/:id" element={<WildlifeDetailPage />} />
        <Route path="/admin/vehicles" element={<VehicleAdminPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </>
  );
}