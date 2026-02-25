# Migrating to Turborepo Monorepo

This guide explains how to add the Turborepo monorepo structure to an existing ArchFlow frontend project on another system (e.g. when you cannot clone the repo and must apply the change manually).

**Result:** The current Vite React app becomes `apps/web`; the repo root gains Turborepo and npm workspaces. Running `npm run dev` or `npm run build` from the root runs the same commands in the web app.

---

## Prerequisites

- Node.js 18+
- npm (workspaces and Turbo 2 require a recent npm; `packageManager` is set to `npm@10.2.0` in the root `package.json`)

---

## Step 1: Create the `apps/web` directory

From the **repository root**:

```bash
mkdir -p apps/web
```

---

## Step 2: Move the existing app into `apps/web`

Move these **from the repo root** **into** `apps/web/`:

| Move from root | Move to |
|----------------|---------|
| `src/`         | `apps/web/src/` |
| `public/`      | `apps/web/public/` |
| `index.html`   | `apps/web/index.html` |
| `vite.config.ts` | `apps/web/vite.config.ts` |
| `tailwind.config.ts` | `apps/web/tailwind.config.ts` |
| `postcss.config.js` | `apps/web/postcss.config.js` |
| `components.json` | `apps/web/components.json` |
| `eslint.config.js` | `apps/web/eslint.config.js` |
| `tsconfig.json` | `apps/web/tsconfig.json` |
| `tsconfig.app.json` | `apps/web/tsconfig.app.json` |
| `tsconfig.node.json` | `apps/web/tsconfig.node.json` |
| `package.json` | see Step 3 (do not move as-is; use it to create `apps/web/package.json`) |

**Commands (run from repo root):**

```bash
mv src apps/web/
mv public apps/web/
mv index.html apps/web/
mv vite.config.ts apps/web/
mv tailwind.config.ts apps/web/
mv postcss.config.js apps/web/
mv components.json apps/web/
mv eslint.config.js apps/web/
mv tsconfig.json apps/web/
mv tsconfig.app.json apps/web/
mv tsconfig.node.json apps/web/
```

Do **not** move `.git/`, `.gitignore`, or `node_modules`. Do **not** move the root `package.json` yet; you will replace it in Step 4.

---

## Step 3: Create `apps/web/package.json`

Create **`apps/web/package.json`** with the **same content as your current root `package.json`**, with one change:

- Set **`"name": "web"`** (replace the previous app name, e.g. `vite_react_shadcn_ts`).

Keep all existing `scripts`, `dependencies`, and `devDependencies` unchanged. Do **not** add a `workspaces` field; that belongs only at the root.

Example (only the `name` line is different from your current app):

```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

Copy your full current root `package.json`, change `name` to `"web"`, and save it as `apps/web/package.json`. Then delete the old root `package.json` only after Step 4 (when you create the new root one).

---

## Step 4: Create the new root `package.json`

**Replace** the repository root **`package.json`** with the monorepo root config. It should contain **only**:

- `name` (e.g. `"archflow"`)
- `"private": true`
- `scripts` that delegate to Turbo
- `devDependencies` with `turbo`
- `workspaces`
- `packageManager` (required for Turbo 2)

**Root `package.json` (full file):**

```json
{
  "name": "archflow",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "preview": "turbo run preview"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  },
  "workspaces": [
    "apps/*"
  ],
  "packageManager": "npm@10.2.0"
}
```

If you use a different npm version, you can change `packageManager` (e.g. `npm@9.8.0`), but Turbo 2 may expect a recent npm.

---

## Step 5: Create root `turbo.json`

Create a new file at the **repository root** named **`turbo.json`**:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "outputs": ["dist"],
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "preview": {
      "cache": false,
      "persistent": true
    }
  }
}
```

This tells Turbo how to run `build`, `dev`, `lint`, and `preview` in each workspace (e.g. `apps/web`).

---

## Step 6: Update root `.gitignore`

Add these lines to the **root** `.gitignore` so workspace build artifacts and dependencies are ignored:

```
apps/*/node_modules
apps/*/dist
```

Your existing `node_modules` and `dist` entries at the root already cover the root; the above covers each app under `apps/`.

---

## Step 7: Clean install from root

From the **repository root**:

1. Remove the old root `node_modules` and, if you want a clean state, the root `package-lock.json`:
   ```bash
   rm -rf node_modules
   # Optional: rm -f package-lock.json
   ```

2. Install dependencies (this installs Turbo at the root and all workspace dependencies):
   ```bash
   npm install
   ```

3. Verify the build:
   ```bash
   npm run build
   ```

4. Verify dev (then stop with Ctrl+C):
   ```bash
   npm run dev
   ```

The web app should run as before (e.g. Vite dev server on port 8080 if that is what `apps/web/vite.config.ts` specifies).

---

## Step 8: Optional cleanup

- You can remove the old root `dist/` if it existed at the root before the migration.
- Keep `DOCS.md`, `README.md`, and any other repo-level docs at the root; only the app and its configs live under `apps/web`.

---

## Layout after migration

```
<repo-root>/
├── package.json          # Root: workspaces, turbo, scripts
├── turbo.json
├── .gitignore
├── apps/
│   └── web/
│       ├── package.json  # name: "web", app deps and scripts
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── tsconfig.app.json
│       ├── tsconfig.node.json
│       ├── index.html
│       ├── src/
│       ├── public/
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── components.json
│       └── eslint.config.js
└── ...
```

---

## Troubleshooting

- **"Could not resolve workspaces" / "Missing packageManager"**  
  Ensure the root `package.json` includes `"packageManager": "npm@10.2.0"` (or another supported version).

- **Build or dev fails for `web`**  
  Run from the root: `cd apps/web && npm run build` (or `npm run dev`) to see the same commands Turbo runs. Fix any path or config issues inside `apps/web`.

- **Path alias `@/` not working**  
  `vite.config.ts` and `tsconfig` in `apps/web` use `./src`; they are unchanged by the migration. Ensure those files were moved into `apps/web` and not edited for root-relative paths.

- **Adding more apps later**  
  Create e.g. `apps/api/` with its own `package.json` and scripts. Root `workspaces: ["apps/*"]` will include it automatically; no change to `package.json` needed. Add any new tasks to `turbo.json` if required.
