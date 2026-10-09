# Developing the site locally

This guide explains how to run the Copilot Extensibility Landing Site on your machine, how to edit content, and how to
add components and pages. For background on how the pieces fit together see [ARCHITECTURE.md](./ARCHITECTURE.md);
to publish, see [PUBLISHING.md](./PUBLISHING.md).

> **TL;DR**
>
> ```bash
> cd site
> npm ci
> npm run dev
> ```
>
> Then open **<http://localhost:4321/copilot-extensibility/>** (note the `/copilot-extensibility/` path).

---

## 1. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | 22 LTS (≥ 22.12) | The repository root has an [`.nvmrc`](../.nvmrc), so `nvm use` selects the right version. |
| npm | 9.6.5 or later | Comes with Node.js. |
| Git | any recent version | To clone the repository and create branches. |
| VS Code (optional) | — | Accept the recommended **Astro** extension (`astro-build.astro-vscode`, listed in [`.vscode/extensions.json`](../.vscode/extensions.json)) for syntax highlighting, IntelliSense and inline type errors in `.astro` files. |

> You may see an `EBADENGINE` warning about `undici` on Node.js versions earlier than 22.19. It is harmless, but
> upgrading to the latest Node.js 22 removes it.

## 2. First-time setup

```bash
git clone https://github.com/microsoft/copilot-extensibility.git
cd copilot-extensibility
nvm use            # optional: switch to the Node.js version in .nvmrc
cd site            # all npm commands run inside the site/ folder
npm ci             # install the exact dependency versions from package-lock.json
```

Use `npm ci` (not `npm install`) so you get exactly the dependency versions in `package-lock.json`, the same as the
CI build. Use `npm install <package>` only when you deliberately add or upgrade a dependency, and commit the updated
`package-lock.json`.

## 3. Running the site on localhost

All commands are run from the **`site/`** folder.

### 3.1 Development server (hot reload)

```bash
npm run dev
```

```text
 astro  v7.x ready in 300 ms
┃ Local    http://localhost:4321/copilot-extensibility
┃ Network  use --host to expose
```

Open **<http://localhost:4321/copilot-extensibility/>**.

- The site is configured with the `/copilot-extensibility` base path (the same sub-path used on GitHub Pages), so
  `http://localhost:4321/` on its own returns a **404** page that links to the right URL.
- Saving a `.astro`, `.css`, `.ts` **or `.json`** file reloads the browser automatically. You don't need to restart
  the server after content edits.
- Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server.

Useful options (everything after `--` is passed through to Astro):

| Goal | Command |
| --- | --- |
| Open the browser automatically | `npm run dev -- --open` |
| Use a different port | `npm run dev -- --port 3000` |
| Test from a phone/tablet on the same network | `npm run dev -- --host` (then use the *Network* URL printed in the terminal) |
| Run in the background and keep using the terminal | `npm run dev -- --background` |
| Check whether a background server is running | `npx astro dev status` |
| Show/follow the background server's logs | `npx astro dev logs --follow` |
| Stop the background server | `npx astro dev stop` |

> Astro 7 allows **one dev server per project**. If you see *"Another astro dev server is already running"*, use
> the URL it prints, or stop that server with `npx astro dev stop`.

### 3.2 Serving the site from the root (optional)

To serve the site at `http://localhost:4321/` without the sub-path (for example to simulate a custom domain), set
`BASE_PATH`:

```bash
# macOS / Linux
BASE_PATH=/ npm run dev
```

```powershell
# Windows PowerShell
$env:BASE_PATH="/"; npm run dev; Remove-Item Env:BASE_PATH
```

All links and assets adapt automatically, because the components resolve URLs with the base path
(see [ARCHITECTURE.md §5.1](./ARCHITECTURE.md#51-urls-and-the-base-path)).

### 3.3 Production build and preview

Before opening a pull request, check the exact output that will be published:

```bash
npm run check     # type-check components and validate every JSON file against its contract
npm run build     # generate the static site into site/dist/
npm run preview   # serve site/dist/ at http://localhost:4321/copilot-extensibility/
```

`npm run preview` serves the built files, with no hot reload. Rebuild after each change. Stop it with
<kbd>Ctrl</kbd>+<kbd>C</kbd>.

### 3.4 Command reference

| Command (from `site/`) | What it does |
| --- | --- |
| `npm ci` | Install dependencies exactly as locked. |
| `npm run dev` | Start the development server with hot reload on port 4321. |
| `npm run check` | Run `astro check`: TypeScript and `.astro` diagnostics, including JSON-vs-contract validation. |
| `npm run build` | Build the static site into `site/dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run astro -- <cmd>` | Run any other Astro CLI command, e.g. `npm run astro -- --version`. |

---

## 4. Editing content

Content lives in the JSON files in [`site/src/data/`](../site/src/data). Each file feeds one block of the landing
page:

| Block on the page | File |
| --- | --- |
| Page title, description, favicon | `site.json` |
| Top menu / footer | `navigation.json` → `header` / `footer` |
| Hero banner | `hero.json` |
| Learn · Build · Technologies · Community cards | `quick-links.json` |
| Featured content | `featured-content.json` |
| Videos | `video.json` |
| Technologies at a glance | `technologies.json` |
| Recommended learning paths | `learning-paths.json` |
| Community & events | `community-events.json` → `firstPartyEvents` / `communityEvents` |
| Explore the ecosystem | `ecosystem.json` |
| Meet the team | `team.json` |

### 4.1 Typical workflow

1. Start the dev server (`npm run dev`) and open the site.
2. Edit the JSON file and save. The browser refreshes with the change.
3. Run `npm run check` to validate the file.
4. Commit on a branch and open a pull request (see [§7](#7-contribution-workflow)).

### 4.2 Conventions for JSON values

| Property | Convention |
| --- | --- |
| Links (`url`) | `https://…` for external resources (they open in a new tab automatically); `#section-id` to jump to a section of the page; `/path` for files in `site/public/` or other pages of this site (the base path is added automatically, **don't** include `/copilot-extensibility`). |
| `external` | Optional. Set `false` to open an external link in the same tab, or `true` to open an internal link in a new tab. |
| `icon` | The name of an icon defined in [`Icon.astro`](../site/src/components/Icon.astro), e.g. `puzzle`, `code`, `users`, `calendar`, `github`. Unknown names fall back to a generic icon and print a warning in the terminal. |
| Featured content `type` | One of `Cookbook`, `Blog`, `Lab`, `News`, `Article`, `Website`, `Video`. |
| `accent` | One of `purple`, `blue`, `green`, `orange`, `teal`, `pink`, `indigo`, `red`, `yellow`, `gray`. |
| `illustration` | `blocks`, `cubes`, `code` (learning paths) or `people`, `calendar`, `folder` (ecosystem). |
| Dates (`date`, `endDate`) | Use ISO format `YYYY-MM-DD` for dated events. Ranges are formatted automatically (`Nov 10–11, 2026`). The `date` property also accepts free text such as `"Monthly"`; free-text events are not sorted or filtered as dated events. |
| Video `url` | A canonical YouTube URL (`watch?v=`, `youtu.be/`, `/shorts/` or `/embed/`). The thumbnail image is derived from it at build time — don't add a separate thumbnail field. |
| Team `picture` | Path to a square headshot in `site/public/team/` (e.g. `/team/jane-doe.png`), rendered as a circle. |
| Images | Put the file in `site/public/` (e.g. `site/public/logos/mcp.svg`) and reference it as `/logos/mcp.svg`. |

#### Supported icons

Use any of the following names for an `icon` property:

- **Interface and navigation:** `arrow-right`, `chevron-down`, `close`, `compass`, `download`, `external`, `link`,
  `menu`, `moon`, `search`, `settings`, `sun`
- **Content, media and learning:** `article`, `book-open`, `bookmark`, `collection`, `file-text`, `flask`,
  `graduation-cap`, `lightbulb`, `microphone`, `newspaper`, `play-circle`, `podcast`, `presentation`, `tutorial`,
  `video`
- **Development and technology:** `api`, `bot`, `box`, `brain`, `cloud`, `code`, `cpu`, `cubes`, `database`,
  `git-branch`, `grid`, `hexagon`, `layout`, `monitor`, `network`, `package`, `plug`, `puzzle`, `rocket`, `shield`,
  `smartphone`, `spark`, `sparkles`, `terminal`, `wand`, `wrench`
- **Community, events and general use:** `award`, `calendar`, `chat`, `folder`, `globe`, `mountain`, `send`, `user`,
  `users`
- **Brands:** `github`, `linkedin`, `x`, `youtube`

### 4.3 Examples

**Add a first-party event** (`community-events.json` → `firstPartyEvents.items`):

```json
{
  "title": "Copilot Extensibility Office Hours",
  "description": "Bring your questions and get answers from the team.",
  "icon": "users",
  "accent": "blue",
  "organizer": "Copilot Extensibility team",
  "date": "2026-12-03",
  "link": { "label": "Register", "url": "https://developer.microsoft.com/reactor/" }
}
```

Use `communityEvents.items` instead for events organized by the community. With `"sortByDate": true` the order in the
file doesn't matter. With `"hidePast": true`, events whose date has passed are dropped at build time.

**Add a featured resource** (`featured-content.json` → `items`):

```json
{
  "type": "Sample",
  "title": "Declarative agent with an API plugin",
  "description": "End-to-end sample with authentication and adaptive cards.",
  "icon": "code",
  "accent": "teal",
  "link": { "label": "View sample", "url": "https://github.com/…" }
}
```

**Add a technology** (`technologies.json` → `items`). To use an official logo, add `"image": "/logos/<file>.svg"`:

```json
{ "name": "Agents SDK", "description": "Build agents with code.", "icon": "code", "accent": "indigo",
  "url": "https://learn.microsoft.com/microsoft-365/agents-sdk/" }
```

**Add a video** (`video.json` → `items`). Reuse the same `accent` as the matching entry in `technologies.json` for
a consistent badge color across the two sections:

```json
{
  "title": "Build your first MCP server",
  "technology": "MCP",
  "accent": "pink",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Add a team member** (`team.json` → `members`). Crop the photo to a square (any size — it's resized by CSS) before
placing it in `site/public/team/`:

```json
{ "name": "Jane Doe", "role": "Senior Cloud Advocate", "picture": "/team/jane-doe.png" }
```

Grids are responsive, so adding or removing items never requires CSS changes. New items in `featured-content.json`,
`video.json`, `technologies.json`, `learning-paths.json` and `community-events.json` are also picked up by the header
search automatically; team members aren't, since they don't link anywhere.

### 4.4 When validation fails

`npm run check` reports the file, the line and the property involved. The message can be long; read it from the
bottom up. For example, after removing the `link` of a featured item:

```text
src/pages/index.astro:42:7 - error ts(2322): Type '{ heading: …; items: (…)[]; }' is not assignable to type 'FeaturedContentConfig'.
  Types of property 'items' are incompatible.
    …
          Types of property 'link' are incompatible.
            Type 'undefined' is not assignable to type 'Link'.
```

The last lines name the culprit (`link` is required). The first line points at the `index.astro` line that imports
the faulty file (here `featured-content.json`). Fix the JSON and run the check again. The contracts for every file
are in [`site/src/types/config.ts`](../site/src/types/config.ts).

---

## 5. Developing components

Components live in [`site/src/components/`](../site/src/components). Each landing-page block is a component that
receives its JSON through a `config` prop. See the [component reference](./ARCHITECTURE.md#6-component-reference).

### 5.1 Changing an existing component

1. Open the component (e.g. `FeaturedContent.astro`). The top block (between `---` fences) runs at build time; the
   markup below it renders to HTML; the `<style>` block is **scoped** to the component.
2. Reuse the shared building blocks rather than writing new markup or styles:
   - Components: `SectionHeader`, `Icon`, `Illustration`, `EventGroup`.
   - CSS classes from `styles/global.css`: `.container`, `.section`, `.card`, `.card-interactive`, `.icon-tile`,
     `.badge`, `.link-arrow`, and `accent-<name>`.
   - Design tokens: `var(--surface)`, `var(--text-muted)`, `var(--accent)`, `var(--accent-soft)`.
3. Always build URLs with `resolveUrl()` and `linkAttrs()` from `utils/url.ts`, so links keep working under the base path.
4. If you add a JSON property, add it to the matching interface in `types/config.ts` too.
5. Check both themes (use the sun/moon toggle) and a narrow viewport (browser dev tools → device toolbar).

### 5.2 Adding a new block to the landing page

1. **Data:** create `site/src/data/my-block.json`.
2. **Contract:** add `export interface MyBlockConfig { … }` to `site/src/types/config.ts`.
3. **Component:** create `site/src/components/MyBlock.astro`:

   ```astro
   ---
   import type { MyBlockConfig } from '../types/config';
   import SectionHeader from './SectionHeader.astro';
   import { linkAttrs, resolveUrl } from '../utils/url';

   interface Props {
     config: MyBlockConfig;
   }
   const { config } = Astro.props;
   ---

   <section class="section container" id={config.heading.id} aria-labelledby={`${config.heading.id}-title`}>
     <SectionHeader heading={config.heading} />
     <!-- markup -->
   </section>

   <style>
     /* scoped styles */
   </style>
   ```

4. **Wire it up** in `site/src/pages/index.astro`:

   ```astro
   import MyBlock from '../components/MyBlock.astro';
   import myBlockJson from '../data/my-block.json';
   const myBlock: MyBlockConfig = myBlockJson;   // typed → validated by `npm run check`
   …
   <MyBlock config={myBlock} />
   ```

5. (Optional) Make it searchable by extending `buildSearchIndex()` in `site/src/utils/search.ts`.

### 5.3 Adding an icon

Add an entry to the `icons` map in [`Icon.astro`](../site/src/components/Icon.astro). Use a 24×24 viewBox and
stroke-based paths that inherit `currentColor`, then reference the new name from any JSON `icon` property.

---

## 6. Adding pages

Every `.astro` file in [`site/src/pages/`](../site/src/pages) becomes a page (file-based routing):

| File | URL on localhost |
| --- | --- |
| `src/pages/index.astro` | `http://localhost:4321/copilot-extensibility/` |
| `src/pages/events.astro` | `http://localhost:4321/copilot-extensibility/events` |
| `src/pages/learn/maker.astro` | `http://localhost:4321/copilot-extensibility/learn/maker` |

A new page reuses the layout, header and footer, and any block component with its own (or the same) JSON:

```astro
---
// site/src/pages/events.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import CommunityEvents from '../components/CommunityEvents.astro';
import type { CommunityEventsConfig, NavigationConfig } from '../types/config';
import navigationJson from '../data/navigation.json';
import eventsJson from '../data/community-events.json';

const navigation: NavigationConfig = navigationJson;
const events: CommunityEventsConfig = eventsJson;
---

<BaseLayout title="Events · Copilot Extensibility" description="All upcoming Copilot extensibility events.">
  <Header config={navigation.header} />
  <main id="main">
    <CommunityEvents config={events} />
  </main>
  <Footer config={navigation.footer} />
</BaseLayout>
```

Then link to it from any JSON file with a root-relative URL, e.g. `{ "label": "View all events", "url": "/events" }`.

> On other pages, section anchors such as `#community` point to that page. To link back to a landing-page section,
> use `/#community`.

---

## 7. Contribution workflow

```bash
git switch -c content/add-december-events     # 1. create a branch
# 2. edit files, with `npm run dev` running for live preview
npm run check && npm run build                # 3. validate (inside site/)
git add -A && git commit -m "Add December community events"
git push -u origin content/add-december-events
# 4. open a pull request on GitHub
```

Once the pull request is merged into `main`, the GitHub Actions workflow publishes the site (see
[PUBLISHING.md](./PUBLISHING.md)).

Before you request a review, check that:

- [ ] `npm run check` reports 0 errors and `npm run build` succeeds.
- [ ] The change looks right in light **and** dark mode, on desktop **and** mobile widths.
- [ ] New links work. External links point to the canonical resource (no tracking parameters).
- [ ] Logos and images follow the brand guidelines and are optimized (prefer SVG, or PNG ≤ 50 KB).

---

## 8. Troubleshooting

| Problem | Solution |
| --- | --- |
| `http://localhost:4321/` shows a 404 | Expected. Use `http://localhost:4321/copilot-extensibility/`, or run with `BASE_PATH=/` (§3.2). |
| *Another astro dev server is already running* | A server is already running (maybe in the background or another terminal). Open its URL, or run `npx astro dev stop`. |
| The site opened on port 4322 (or another port) | Port 4321 was busy, so Astro picked the next free port. Use the URL printed in the terminal, or force one with `npm run dev -- --port 3000`. |
| `npm ERR! code ENOENT … package.json` | You're in the repository root. Run `cd site` first. |
| `Cannot find module 'astro'` / missing packages | Run `npm ci` inside `site/`. |
| Unsupported Node.js version errors | Install Node.js 22 LTS (`nvm install 22 && nvm use`). |
| Changes don't appear | Hard-refresh the browser. If it persists, stop the server, delete `site/node_modules/.astro` and `site/.astro`, then run `npm run dev -- --force`. |
| Images/links work locally but 404 when published | The URL includes `/copilot-extensibility` explicitly, or doesn't use `resolveUrl()`. Write root-relative URLs (`/file.png`) and let the components add the base path. |
| `[Icon] Unknown icon "…"` warning | The `icon` name in JSON doesn't exist in `Icon.astro`. Fix the name or add the icon (§5.3). |
