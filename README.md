# GTA VI WORLD

React frontend built with Vite and served in production by Express.

## Requirements

- Node.js 20.19 or newer
- npm

## Development

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`. Express runs separately on port 3001 for the `/api/health` endpoint.

## Production

```powershell
npm.cmd run build
npm.cmd start
```

The Express server serves the production build at `http://localhost:3000`.

## Vehicle Catalog

The verified seed catalog lives in `data/vehicles.json`. Unknown performance, price, real-world inspiration, and spawn fields are stored as `null`. The public vehicle browser reads this file through `/api/vehicles`.

Vehicle edits are available at `/admin/vehicles` only when the server is started with a `VEHICLE_ADMIN_TOKEN`. In PowerShell, set a private token in the terminal before starting the server:

```powershell
$env:VEHICLE_ADMIN_TOKEN = 'replace-with-a-private-random-token'
npm.cmd run dev
```

Then enter that token on the admin page. It is not stored in the browser or repository. Without the token, admin write endpoints remain disabled. Saved changes are written to `data/vehicles.json`.