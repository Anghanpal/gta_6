import { useState } from "react";
import { Link } from "react-router-dom";
import { vehicleCategories, vehicleCategoryLabels } from "../data/vehicleCategories.js";

const emptyVehicle = {
  id: "",
  name: "",
  manufacturer: "",
  category: "unclassified",
  categoryBasis: "",
  realLifeInspiration: "",
  maxSpeed: "",
  speedUnit: "mph",
  accelerationRating: "",
  handlingRating: "",
  brakingRating: "",
  inGamePrice: "",
  spawnLocation: "",
  description: "",
  verificationStatus: "",
  imageUrl: "",
  galleryText: "",
  sourceUrl: "https://www.rockstargames.com/VI/downloads",
};

const numericFields = new Set(["maxSpeed", "accelerationRating", "handlingRating", "brakingRating", "inGamePrice"]);

function slugify(value) {
  return value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function vehicleToForm(vehicle) {
  return {
    ...emptyVehicle,
    ...vehicle,
    manufacturer: vehicle.manufacturer || "",
    realLifeInspiration: vehicle.realLifeInspiration || "",
    spawnLocation: vehicle.spawnLocation || "",
    galleryText: (vehicle.gallery || []).join("\n"),
  };
}

export default function VehicleAdminPage() {
  const [token, setToken] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyVehicle);
  const [editingId, setEditingId] = useState("");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    const result = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.error || "The catalog update failed.");
    return result;
  }

  async function connect(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await request("/api/admin/vehicles");
      setVehicles(data);
      setConnected(true);
      setMessage("Admin access verified. Changes are saved to the server catalog.");
    } catch (requestError) {
      setError(requestError.message);
      setConnected(false);
    } finally {
      setBusy(false);
    }
  }

  function startNewVehicle() {
    setEditingId("");
    setForm(emptyVehicle);
    setError("");
    setMessage("");
  }

  function editVehicle(vehicle) {
    setEditingId(vehicle.id);
    setForm(vehicleToForm(vehicle));
    setError("");
    setMessage("");
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveVehicle(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const id = form.id.trim() || slugify(form.name);
    const payload = {
      ...form,
      id,
      manufacturer: form.manufacturer.trim() || null,
      realLifeInspiration: form.realLifeInspiration.trim() || null,
      spawnLocation: form.spawnLocation.trim() || null,
      maxSpeed: form.maxSpeed === "" ? null : Number(form.maxSpeed),
      accelerationRating: form.accelerationRating === "" ? null : Number(form.accelerationRating),
      handlingRating: form.handlingRating === "" ? null : Number(form.handlingRating),
      brakingRating: form.brakingRating === "" ? null : Number(form.brakingRating),
      inGamePrice: form.inGamePrice === "" ? null : Number(form.inGamePrice),
      gallery: form.galleryText.split("\n").map((image) => image.trim()).filter(Boolean),
    };
    delete payload.galleryText;

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/vehicles/${encodeURIComponent(editingId)}` : "/api/admin/vehicles";
      await request(url, { method, body: JSON.stringify(payload) });
      const data = await request("/api/admin/vehicles");
      setVehicles(data);
      setEditingId(id);
      setForm(vehicleToForm(data.find((vehicle) => vehicle.id === id)));
      setMessage("Vehicle record saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteVehicle(vehicle) {
    if (!window.confirm(`Delete ${vehicle.name} from the catalog?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await request(`/api/admin/vehicles/${encodeURIComponent(vehicle.id)}`, { method: "DELETE" });
      const data = await request("/api/admin/vehicles");
      setVehicles(data);
      if (editingId === vehicle.id) startNewVehicle();
      setMessage(`${vehicle.name} removed from the catalog.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main" className="vehicle-admin-page">
      <section className="admin-hero"><div className="detail-shell"><div className="section-kicker"><span>PRIVATE TOOL</span> Catalog maintenance</div><h1>Vehicle<br /><em>records.</em></h1><p>Changes require the server-side VEHICLE_ADMIN_TOKEN and are written to the JSON catalog.</p><Link className="text-link" to="/vehicles">Return to vehicle database <span aria-hidden="true">↗</span></Link></div></section>
      <section className="vehicle-admin-content detail-shell">
        {!connected ? <form className="admin-connect" onSubmit={connect}><label htmlFor="admin-token">Admin bearer token</label><input id="admin-token" type="password" autoComplete="current-password" value={token} onChange={(event) => setToken(event.target.value)} required /><button className="button button-lime" type="submit" disabled={busy}>{busy ? "Checking…" : "Unlock catalog"}</button><p>The token is held only in this page’s memory and is never stored in the browser.</p></form> : <div className="admin-workspace"><aside className="admin-record-list"><div className="admin-list-heading"><h2>Catalog</h2><button className="button button-dark" type="button" onClick={startNewVehicle}>New record</button></div>{vehicles.map((vehicle) => <div className={`admin-record${editingId === vehicle.id ? " is-active" : ""}`} key={vehicle.id}><button type="button" onClick={() => editVehicle(vehicle)}><b>{vehicle.name}</b><span>{vehicleCategoryLabels[vehicle.category] || "Unclassified"}</span></button><button type="button" className="admin-delete" onClick={() => deleteVehicle(vehicle)} aria-label={`Delete ${vehicle.name}`} disabled={busy}>×</button></div>)}</aside>
          <form className="admin-vehicle-form" onSubmit={saveVehicle}><div className="admin-form-heading"><div><div className="section-kicker"><span>{editingId ? "EDIT RECORD" : "NEW ENTRY"}</span> Vehicle information</div><h2>{editingId ? form.name : "Add a vehicle"}</h2></div><button className="button button-lime" type="submit" disabled={busy}>{busy ? "Saving…" : "Save record"}</button></div>
            <label>Vehicle name<input name="name" value={form.name} onChange={updateField} required /></label><div className="admin-form-row"><label>Record ID<input name="id" value={form.id} onChange={updateField} placeholder="Generated from name if blank" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label><label>Manufacturer<input name="manufacturer" value={form.manufacturer} onChange={updateField} placeholder="Unknown if unverified" /></label></div>
            <div className="admin-form-row"><label>Category<select name="category" value={form.category} onChange={updateField}>{vehicleCategories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></label><label>Verification status<input name="verificationStatus" value={form.verificationStatus} onChange={updateField} required /></label></div>
            <label>Category basis / verification note<textarea name="categoryBasis" value={form.categoryBasis} onChange={updateField} rows="2" /></label>
            <label>Description<textarea name="description" value={form.description} onChange={updateField} rows="3" required /></label>
            <label>Real-world inspiration<input name="realLifeInspiration" value={form.realLifeInspiration} onChange={updateField} placeholder="Leave blank unless verified" /></label>
            <div className="admin-form-row admin-numeric-row"><label>Tested max speed<input name="maxSpeed" type="number" min="0" step="any" value={form.maxSpeed ?? ""} onChange={updateField} /></label><label>Speed unit<select name="speedUnit" value={form.speedUnit} onChange={updateField}><option value="mph">mph</option><option value="km/h">km/h</option></select></label><label>Tested acceleration<input name="accelerationRating" type="number" min="0" step="any" value={form.accelerationRating ?? ""} onChange={updateField} /></label><label>Tested handling<input name="handlingRating" type="number" min="0" step="any" value={form.handlingRating ?? ""} onChange={updateField} /></label><label>Tested braking<input name="brakingRating" type="number" min="0" step="any" value={form.brakingRating ?? ""} onChange={updateField} /></label><label>In-game price<input name="inGamePrice" type="number" min="0" step="1" value={form.inGamePrice ?? ""} onChange={updateField} /></label></div>
            <label>Verified spawn / location<input name="spawnLocation" value={form.spawnLocation} onChange={updateField} placeholder="Leave blank unless verified" /></label><label>Primary image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} required /></label><label>Gallery image URLs <span>One URL per line</span><textarea name="galleryText" value={form.galleryText} onChange={updateField} rows="4" /></label><label>Source URL<input name="sourceUrl" type="url" value={form.sourceUrl} onChange={updateField} required /></label>
          </form></div>}
        {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}{message && <p className="admin-feedback" role="status">{message}</p>}
      </section>
    </main>
  );
}