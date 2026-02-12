# ArchFlow Frontend – Setup from scratch (no clone)

Use this guide when you **cannot clone** the repo. You create a new project on the other device, install packages yourself, then copy this project’s source and config (e.g. via USB, zip, or cloud).

---

## Prerequisites on the new device

- **Node.js 18+** – [nodejs.org](https://nodejs.org/) (LTS)
- **npm** (included with Node)

---

## Step 1: Create a new Vite + React + TypeScript project

In a folder where you want the app (e.g. Desktop):

```bash
npm create vite@latest ArchFlowFE -- --template react-ts
cd ArchFlowFE
```

This creates a minimal React + TypeScript app. You will replace parts of it in the next steps.

---

## Step 2: Replace package.json and install dependencies

Copy the **entire** `package.json` from the ArchFlowFE project (current device) into the new project’s root, overwriting the one created by Vite.

Then install everything:

```bash
npm install
```

That installs all production and dev dependencies in one go.

---

## Step 2 (alternative): Install packages by hand

If you **don’t have** the full `package.json`, create the Vite project as in Step 1, then run the commands below. Vite’s template already gives you `react`, `react-dom`, `@types/react`, `@types/react-dom`, `typescript`, and `vite`. Install everything else yourself.

### Production dependencies (install yourself)

```bash
npm install @hookform/resolvers @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @tanstack/react-query @xyflow/react class-variance-authority clsx cmdk date-fns embla-carousel-react framer-motion input-otp lucide-react next-themes react-day-picker react-hook-form react-resizable-panels react-router-dom recharts sonner tailwind-merge tailwindcss-animate vaul zod
```

### Dev dependencies (install yourself)

```bash
npm install -D @eslint/js @tailwindcss/typography @types/node @vitejs/plugin-react-swc autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals postcss tailwindcss typescript-eslint
```

Optional (skip if you don’t use Lovable):

```bash
npm install -D lovable-tagger
```

---

## Step 3: Copy project files from the existing codebase

Transfer the ArchFlowFE project from the **current device** to the new one (USB, zip, cloud). Then copy the following **into** the new Vite project, overwriting where files already exist:

| What to copy | Notes |
|--------------|--------|
| **`src/`** | Entire folder (components, hooks, pages, types, App, main, styles) |
| **`public/`** | Entire folder (favicon, placeholder, robots.txt) |
| **`index.html`** | Root HTML |
| **`vite.config.ts`** | Vite config; has `@` alias. Set `port: 5173` (or remove port) so it doesn’t conflict with backend on 8080. Remove `componentTagger()` (lovable-tagger) if you didn’t install that package. |
| **`tsconfig.json`** | Path alias `@/*` → `./src/*` |
| **`tsconfig.app.json`** | App TypeScript config |
| **`tsconfig.node.json`** | Node TypeScript config |
| **`tailwind.config.ts`** | Theme, colors, animations (required for UI) |
| **`postcss.config.js`** | PostCSS for Tailwind |
| **`components.json`** | shadcn config (aliases) |
| **`eslint.config.js`** | ESLint config |
| **`.gitignore`** | Optional |

Do **not** copy `node_modules` or `dist`. If you used the full `package.json`, you can copy `package-lock.json` from the original project before running `npm install` if you want identical dependency versions.

---

## Step 4: Optional environment

The app uses **`http://localhost:8080/api/v1/diagram`** by default. No `.env` is required. To use another backend later, add a `.env` and update the hook to read `import.meta.env.VITE_API_BASE_URL`.

---

## Step 5: Run the app

```bash
npm run dev
```

- **Frontend:** http://localhost:5173 (or the port you set in `vite.config.ts`)
- **Backend for diagram generation:** http://localhost:8080

Other commands: `npm run build` (production build), `npm run preview` (serve build), `npm run lint` (ESLint).

---

## Checklist (new device, no clone)

| Step | Action |
|------|--------|
| 1 | Install Node.js 18+ |
| 2 | `npm create vite@latest ArchFlowFE -- --template react-ts` then `cd ArchFlowFE` |
| 3 | Copy `package.json` from this project and run `npm install` **or** install all packages manually (see Step 2 alternative) |
| 4 | Copy `src/`, `public/`, `index.html`, and all config files (vite, tsconfig, tailwind, postcss, components.json, eslint). Fix Vite port and remove lovable-tagger in config if needed. |
| 5 | (Optional) Add `.env` for a different API URL |
| 6 | `npm run dev` and open the dev URL; ensure backend is on 8080 if you use Generate |

---

**ArchFlow Frontend** – by Sagnik Ghosh
