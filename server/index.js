import express from "express";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { vehicleCategories } from "../client/src/data/vehicleCategories.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const buildDirectory = path.resolve(currentDirectory, "../dist");
const vehiclesFile = path.resolve(currentDirectory, "../data/vehicles.json");
const app = express();
const defaultPort = process.argv.includes("--dev") ? 3001 : 3000;
const port = Number(process.env.PORT || defaultPort);
const validCategories = new Set(vehicleCategories.map(({ id }) => id));

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

async function readVehicles() {
  return JSON.parse(await readFile(vehiclesFile, "utf8"));
}

async function writeVehicles(vehicles) {
  const temporaryFile = `${vehiclesFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(vehicles, null, 2)}\n`, "utf8");
  await rename(temporaryFile, vehiclesFile);
}

function authorizeAdmin(request, response, next) {
  const expectedToken = process.env.VEHICLE_ADMIN_TOKEN;
  const providedToken = request.get("authorization")?.replace(/^Bearer\s+/i, "") || "";

  if (!expectedToken) {
    return response.status(503).json({ error: "Admin editing is disabled. Set VEHICLE_ADMIN_TOKEN on the server." });
  }

  const expectedBytes = Buffer.from(expectedToken);
  const providedBytes = Buffer.from(providedToken);
  if (expectedBytes.length !== providedBytes.length || !timingSafeEqual(expectedBytes, providedBytes)) {
    return response.status(401).json({ error: "Invalid admin token." });
  }

  next();
}

function validateVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object" || Array.isArray(vehicle)) return "Vehicle must be an object.";
  for (const field of ["id", "name", "category", "description", "verificationStatus", "imageUrl", "sourceUrl"]) {
    if (typeof vehicle[field] !== "string" || !vehicle[field].trim()) return `${field} is required.`;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(vehicle.id)) return "id must be a lowercase URL-safe slug.";
  if (!validCategories.has(vehicle.category)) return "category must be one of the configured vehicle categories.";
  if (vehicle.manufacturer !== null && typeof vehicle.manufacturer !== "string") return "manufacturer must be text or null.";
  if (!Array.isArray(vehicle.gallery) || vehicle.gallery.length > 20 || vehicle.gallery.some((image) => typeof image !== "string" || !image.trim())) {
    return "gallery must be an array of up to 20 image URLs.";
  }
  for (const field of ["maxSpeed", "accelerationRating", "handlingRating", "brakingRating", "inGamePrice"]) {
    if (vehicle[field] !== null && (!Number.isFinite(vehicle[field]) || vehicle[field] < 0)) return `${field} must be a non-negative number or null.`;
  }
  return null;
}

app.get("/api/vehicles", async (_request, response) => {
  try {
    response.json(await readVehicles());
  } catch {
    response.status(500).json({ error: "Vehicle data could not be read." });
  }
});

app.get("/api/vehicles/:id", async (request, response) => {
  try {
    const vehicle = (await readVehicles()).find((entry) => entry.id === request.params.id);
    if (!vehicle) return response.status(404).json({ error: "Vehicle not found." });
    response.json(vehicle);
  } catch {
    response.status(500).json({ error: "Vehicle data could not be read." });
  }
});

app.get("/api/admin/vehicles", authorizeAdmin, async (_request, response) => {
  try {
    response.json(await readVehicles());
  } catch {
    response.status(500).json({ error: "Vehicle data could not be read." });
  }
});

app.post("/api/admin/vehicles", authorizeAdmin, async (request, response) => {
  const validationError = validateVehicle(request.body);
  if (validationError) return response.status(400).json({ error: validationError });

  try {
    const vehicles = await readVehicles();
    if (vehicles.some((vehicle) => vehicle.id === request.body.id)) return response.status(409).json({ error: "A vehicle with this id already exists." });
    vehicles.push(request.body);
    await writeVehicles(vehicles);
    response.status(201).json(request.body);
  } catch {
    response.status(500).json({ error: "Vehicle data could not be saved." });
  }
});

app.put("/api/admin/vehicles/:id", authorizeAdmin, async (request, response) => {
  const validationError = validateVehicle(request.body);
  if (validationError) return response.status(400).json({ error: validationError });
  if (request.body.id !== request.params.id) return response.status(400).json({ error: "Vehicle id cannot be changed during an update." });

  try {
    const vehicles = await readVehicles();
    const index = vehicles.findIndex((vehicle) => vehicle.id === request.params.id);
    if (index < 0) return response.status(404).json({ error: "Vehicle not found." });
    vehicles[index] = request.body;
    await writeVehicles(vehicles);
    response.json(request.body);
  } catch {
    response.status(500).json({ error: "Vehicle data could not be saved." });
  }
});

app.delete("/api/admin/vehicles/:id", authorizeAdmin, async (request, response) => {
  try {
    const vehicles = await readVehicles();
    const remaining = vehicles.filter((vehicle) => vehicle.id !== request.params.id);
    if (remaining.length === vehicles.length) return response.status(404).json({ error: "Vehicle not found." });
    await writeVehicles(remaining);
    response.status(204).end();
  } catch {
    response.status(500).json({ error: "Vehicle data could not be saved." });
  }
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "gta-vi-world" });
});

app.use(express.static(buildDirectory));

app.get("*", (_request, response) => {
  response.sendFile(path.join(buildDirectory, "index.html"), (error) => {
    if (error && !response.headersSent) {
      response.status(503).send("Build the React app first with npm run build.");
    }
  });
});

app.listen(port, () => {
  console.log(`GTA VI WORLD is running at http://localhost:${port}`);
});