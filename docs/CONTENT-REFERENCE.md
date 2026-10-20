# JSON content reference for editors

Use this guide when adding or updating content in [`site/src/data/`](../site/src/data/).
The tables describe the fields and supported choices in the current site, including defaults and display behavior.
Values are case-sensitive: use `"Blog"`, not `"blog"`, and `"purple"`, not `"Purple"`.

The source of truth is the [configuration contracts](../site/src/types/config.ts), together with the rendering
components and helpers linked below. JSON files contain plain text, not Markdown or HTML markup.

## 1. Choose the content file

Field paths below are relative to each file. `items[]` means an entry in the `items` array.
"Required" describes the configuration contract, even when a component can render a fallback.

| File | Where to add content | Required fields per entry | Optional fields per entry |
| --- | --- | --- | --- |
| [`featured-content.json`](../site/src/data/featured-content.json) | `items[]` | `type`, `title`, `publishedAt`, `description`, `icon`, `accent`, `link` | None |
| [`video.json`](../site/src/data/video.json) | `items[]` | `title`, `technology`, `accent`, `url` | `kind` |
| [`technologies.json`](../site/src/data/technologies.json) | `items[]` | `name`, `icon`, `accent`, `url` | `description`, `image` |
| [`learning-paths.json`](../site/src/data/learning-paths.json) | `items[]` | `title`, `description`, `icon`, `accent`, `illustration`, `link` | None |
| [`quick-links.json`](../site/src/data/quick-links.json) | `items[]` | `title`, `description`, `icon`, `accent`, `link` | None |
| [`community-events.json`](../site/src/data/community-events.json) | `firstPartyEvents.items[]` or `communityEvents.items[]` | `title`, `description`, `icon`, `accent`, `link` | `organizer`, `date`, `endDate`, `dateLabel` |
| [`ecosystem.json`](../site/src/data/ecosystem.json) | `cards[]` | `title`, `accent`, `illustration`, `links` (array of link objects) | None |
| [`team.json`](../site/src/data/team.json) | `members[]` | `name`, `role`, `picture` | None |

**Visibility note:** the ecosystem component is currently commented out in the
[home page](../site/src/pages/index.astro) and excluded from its search index. Editing its JSON alone will not
make that section visible.

### Shared text and heading fields

All files in the table above except quick links have a required `heading` object.

| Field | Value | Editor guidance |
| --- | --- | --- |
| `title` / `name` | Plain-text string | The visible card title or name. Use a concise, descriptive value. |
| `description` | Plain-text string | A short summary. On technology tiles this is a tooltip and search text, rather than a visible paragraph. |
| `heading.id` | String, for example `"videos"` | A unique page anchor. Keep existing IDs unless also updating every link that targets them. |
| `heading.title` | Plain-text string | Section heading. |
| `heading.subtitle` | Optional plain-text string | Supporting text under the heading. Omit if not needed. |
| `heading.viewAll` | Optional link object | Section-wide link, such as "View all videos". See the link fields below. |

## 2. Featured content: `type` and `publishedAt`

These fields belong to entries in [`featured-content.json`](../site/src/data/featured-content.json).

| `type` value | Use for | Suggested `icon` (not mandatory) |
| --- | --- | --- |
| `"Cookbook"` | Collections of recipes or implementation guidance | `"book-open"` |
| `"Blog"` | Blog posts | `"file-text"` |
| `"Lab"` | Hands-on labs or exercises | `"flask"` |
| `"News"` | Announcements and news updates | `"newspaper"` |
| `"Article"` | Articles and technical write-ups | `"article"` |
| `"Website"` | Websites, portals, or resource hubs | `"globe"` |
| `"Video"` | A video featured as a resource card | `"video"` |

`type` controls the badge text only. It does not select the icon, accent, destination, or layout.
Choose `icon` and `accent` separately. Unsupported types fail validation when the page is built.

| Field or behavior | Accepted value / rule |
| --- | --- |
| `publishedAt` | Required ISO date and time with seconds and a timezone, for example `"2026-10-20T13:00:00Z"` or `"2026-10-20T15:00:00+02:00"`. |
| Fractional seconds | Optional, exactly three digits when used: `"2026-10-20T13:00:00.000Z"`. |
| Date-only values | Not supported here. `"2026-10-20"` is an event-date format, not a featured timestamp. |
| Display order | Newest `publishedAt` first. Equal timestamps retain their JSON order. |
| Display limit | Only the newest **eight** entries are rendered as featured cards. |
| Future timestamps | Not a scheduling mechanism: future-dated entries are included and sorted normally. |
| Invalid timestamp | Stops the build with an error. |

See [FeaturedContent.astro](../site/src/components/FeaturedContent.astro) for timestamp validation and selection.

## 3. `icon`: supported names

Use these exact names wherever an `icon` field is present. The same names can be used in
`hero.json` -> `floatingIcons`, header actions, and footer social links.
Icons are names, not emoji, image paths, or arbitrary icon-library identifiers.

| `icon` value | Appearance / suggested use |
| --- | --- |
| `"api"` | Code brackets with a slash; APIs and integrations |
| `"article"` | Text in a square; articles |
| `"arrow-right"` | Right arrow; calls to action |
| `"award"` | Medal; achievements and certifications |
| `"book-open"` | Open book; documentation and cookbooks |
| `"bookmark"` | Bookmark; saved resources |
| `"bot"` | Robot; agents and assistants |
| `"box"` | Single cube; building blocks |
| `"brain"` | Brain; intelligence and AI |
| `"calendar"` | Calendar; events and schedules |
| `"chat"` | Speech bubble; conversations |
| `"chevron-down"` | Down chevron; dropdowns |
| `"close"` | Cross; closing UI |
| `"cloud"` | Cloud; cloud services |
| `"code"` | Code brackets; development |
| `"collection"` | Stacked resource display; collections and playlists |
| `"compass"` | Compass; discovery and guidance |
| `"cpu"` | Processor; computing and AI |
| `"cubes"` | Connected cubes; technologies and architecture |
| `"database"` | Database cylinder; data sources |
| `"download"` | Down arrow; downloads |
| `"external"` | Arrow leaving a square; external resources |
| `"file-text"` | Document with text; posts and documents |
| `"flask"` | Laboratory flask; labs and experiments |
| `"folder"` | Folder; resource directories |
| `"git-branch"` | Branch diagram; source control |
| `"github"` | GitHub brand mark (filled) |
| `"globe"` | Globe; websites and global communities |
| `"graduation-cap"` | Graduation cap; learning and skills |
| `"grid"` | Four tiles; galleries and registries |
| `"hexagon"` | Nested hexagons; protocols and extensibility |
| `"layout"` | Panel layout; apps and low-code tools |
| `"lightbulb"` | Light bulb; ideas and tips |
| `"link"` | Chain links; connectors and related resources |
| `"linkedin"` | LinkedIn brand mark (filled) |
| `"menu"` | Three horizontal lines; navigation |
| `"microphone"` | Microphone; speakers and audio |
| `"monitor"` | Desktop display; applications and demos |
| `"moon"` | Crescent moon; dark theme |
| `"mountain"` | Mountain peaks; summits and challenges |
| `"network"` | Connected nodes; networks and integrations |
| `"newspaper"` | Newspaper; news and announcements |
| `"package"` | Package; SDKs and distributions |
| `"play-circle"` | Play button in a circle; video playback |
| `"plug"` | Lightning-shaped symbol; integrations |
| `"podcast"` | Broadcast symbol; podcasts |
| `"presentation"` | Presentation screen; sessions and talks |
| `"puzzle"` | Puzzle piece; extensibility |
| `"rocket"` | Rocket; getting started and launches |
| `"search"` | Magnifying glass; search |
| `"send"` | Paper plane; outreach and events |
| `"settings"` | Gear; configuration and plugins |
| `"shield"` | Shield with check; governance and security |
| `"smartphone"` | Phone; mobile experiences |
| `"spark"` | Single four-point sparkle; general highlight |
| `"sparkles"` | Multiple sparkles; Copilot and AI |
| `"sun"` | Sun; light theme |
| `"terminal"` | Terminal window; command-line tools |
| `"tutorial"` | Screen with play symbol; tutorials |
| `"user"` | Single person; personas |
| `"users"` | Multiple people; communities and teams |
| `"video"` | Video frame with play symbol; videos |
| `"wand"` | Wand with sparkles; assisted creation |
| `"wrench"` | Wrench; tools |
| `"x"` | X brand mark (filled) |
| `"youtube"` | YouTube brand mark (filled) |

Unknown names produce a terminal warning and fall back to `"spark"`; they do not add a new icon.
Most icons inherit the surrounding color as a stroke; the four brand icons are filled.
Adding a new name requires a code change in [Icon.astro](../site/src/components/Icon.astro).

## 4. `accent`: supported colors

Use a palette name, not a hex value or CSS class. For example, use `"accent": "blue"`, not
`"accent": "#2563eb"` or `"accent": "accent-blue"`.
The name selects both the foreground color and a matching soft background. Exact usage depends on the component.

| `accent` value | Light-theme foreground | Dark-theme foreground |
| --- | --- | --- |
| `"purple"` | `#7c3aed` | `#a78bfa` |
| `"blue"` | `#2563eb` | `#60a5fa` |
| `"green"` | `#16a34a` | `#4ade80` |
| `"orange"` | `#ea6c0c` | `#fb923c` |
| `"teal"` | `#0d9488` | `#2dd4bf` |
| `"pink"` | `#db2777` | `#f472b6` |
| `"indigo"` | `#4f46e5` | `#818cf8` |
| `"red"` | `#dc2626` | `#f87171` |
| `"yellow"` | `#b7791f` | `#facc15` |
| `"gray"` | `#475569` | `#94a3b8` |

All ten colors work in any supported `accent` field; there is no enforced mapping between content types,
technologies, icons, and colors. For consistency, reuse a technology's accent on related video badges.
Unknown accent names have no matching palette helper and will not provide the intended styling.
The contract currently accepts any string, so a type check alone does not catch misspellings.
Palette definitions and helper classes live in [global.css](../site/src/styles/global.css).

## 5. `illustration`: decorative artwork

Unlike `icon`, `illustration` selects larger decorative artwork. All six names below are implemented by the
shared [Illustration.astro](../site/src/components/Illustration.astro) component and work in either
`learning-paths.json` -> `items[].illustration` or `ecosystem.json` -> `cards[].illustration`.
The typical placements are conventions, not restrictions.

| `illustration` value | Artwork | Typical placement |
| --- | --- | --- |
| `"blocks"` | Green isometric cube cluster | Maker learning path |
| `"code"` | Purple code window | Developer learning path |
| `"cubes"` | Blue isometric cube stack | Architect learning path |
| `"people"` | Green people silhouettes | Ecosystem communities |
| `"calendar"` | Purple calendar | Ecosystem events |
| `"folder"` | Blue folder with code symbol | Ecosystem resources |

The artwork has its own colors; `accent` does not recolor it. Unknown names render no artwork.
Illustration names are currently typed as strings, so check them manually.

## 6. Videos: `kind`, `technology`, and `url`

These fields belong to [`video.json`](../site/src/data/video.json); use `kind`, not the featured-card `type`.

| Field / value | Required? | Meaning and behavior |
| --- | --- | --- |
| `kind: "video"` | No; default when omitted | Single-video card with a play overlay. |
| `kind: "playlist"` | No | Stacked-thumbnail styling and a "Playlist" badge. Include a `list` parameter in the URL. |
| `technology` | Yes | Free-text badge, for example `"Copilot Studio"` or `"MCP"`. It is not an enum or a reference that must match a technology entry. Prefer consistent existing names. |
| `accent` | Yes | Badge color from the palette above. |
| `url` | Yes | YouTube URL. The destination and thumbnail are derived from it; there is no separate thumbnail field. |

| URL form | Example / guidance |
| --- | --- |
| Watch | `https://www.youtube.com/watch?v=VIDEO_ID` |
| Short link | `https://youtu.be/VIDEO_ID` |
| Shorts | `https://www.youtube.com/shorts/VIDEO_ID` |
| Embed | `https://www.youtube.com/embed/VIDEO_ID` |
| Live | `https://www.youtube.com/live/VIDEO_ID` |
| Playlist with thumbnail | `https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID` (use a representative video) |
| Bare playlist | `https://www.youtube.com/playlist?list=PLAYLIST_ID` links to a playlist but cannot provide a thumbnail; avoid for normal publishing. |

Replace the placeholder IDs with actual YouTube IDs. Items render in JSON order, with no featured-style
eight-item limit. Unsupported `kind` values fail at build time. A playlist without `list`, or a URL from which
no thumbnail can be derived, produces a warning; the latter renders a fallback icon instead of an image.
See [Videos.astro](../site/src/components/Videos.astro) and the [YouTube helpers](../site/src/utils/youtube.ts).

## 7. Links and image paths

A link object has the following shape wherever `link`, `links[]`, `viewAll`, or `footerLink` is used.

| Field | Required? | Choices / behavior |
| --- | --- | --- |
| `label` | Yes | Visible action text, for example `"Read article"`, `"Register"`, or `"Start learning"`. |
| `url` | Yes | Absolute URL, in-page anchor such as `"#videos"`, or root-relative site path such as `"/team/Paolo-Pialorsi.png"`. |
| `external` | No | Boolean, not a quoted string. Omitted: external URLs open in a new tab and internal links in the same tab. `true`: force a new tab. `false`: force the same tab. |

The [URL helpers](../site/src/utils/url.ts) recognize HTTP(S), protocol-relative, `mailto:`, and `tel:` links
as external. New-tab links receive `rel="noopener noreferrer"`.
The `external` override applies only to link objects and navigation items; direct URL entries such as videos,
technologies, header actions, and footer social links use automatic behavior.
Brand links render in the same tab.

| Image field | Location | Guidance |
| --- | --- | --- |
| `image` | Technology entry | Optional image replacing the icon. `icon` remains required by the contract. |
| `picture` | Team member | Required headshot; use a square image, displayed as a circle. |
| `logo` | Header/footer brand | Brand image. |
| `favicon` | Site settings | Use a PNG or SVG path; the layout chooses the icon MIME type from the `.svg` suffix. |

Store local images in [`site/public/`](../site/public/) and reference them with a leading `/`, without `public`
or the deployment prefix. For example, a file under `site/public/team/` is referenced as `"/team/name.png"`.
Do not add `/copilot-extensibility` to JSON paths; components add the deployment base automatically.
Absolute image URLs are also supported.

## 8. Community events: dates and group options

Use `firstPartyEvents` for Microsoft/team events and `communityEvents` for community events and initiatives.

| Event field | Choices / behavior |
| --- | --- |
| `organizer` | Optional plain-text organizer name; shown as a tooltip and used in search. |
| `date` | Optional valid `"YYYY-MM-DD"` date, or a free-text schedule such as `"Bi-weekly"` or `"Multiple dates"`. Omit for an undated community/resource. |
| `endDate` | Optional valid `"YYYY-MM-DD"` end date for multi-day events. Use an end date on or after the start date. |
| `dateLabel` | Optional legacy display override. Takes precedence over the displayed `date`/range, but does not change filtering or sorting. Prefer free-text `date` for new recurring schedules; keep ISO dates when filtering is needed. |

Each group requires `title` and `items` and supports these optional settings:

| Group field | Default when omitted | Behavior |
| --- | --- | --- |
| `viewAll` | No link | Link object displayed beside the group title. |
| `footerLink` | No link | Link object below the event list. |
| `hidePast` | `false` | When `true`, removes items whose `endDate` (if supplied), otherwise `date`, is a valid ISO date before the current UTC day. Items ending today remain visible. Undated/free-text schedules remain visible. |
| `sortByDate` | `false` | When `true`, sorts ISO start dates earliest first; undated/free-text entries follow in their original relative order. Otherwise preserves JSON order. |

Filtering happens **at build time**, not when someone visits the page. A new build is needed to remove newly
expired events. Free-text schedules are displayed verbatim, not parsed into dates. Keep ISO dates valid:
unrecognized dates are treated as free text rather than reliably rejected.
See the [date helpers](../site/src/utils/dates.ts).

## 9. Other configuration options

These settings usually need changing less often than content cards.

| File / field | Choices / guidance |
| --- | --- |
| [`hero.json`](../site/src/data/hero.json) -> `title`, `description` | Required plain-text strings. |
| `hero.json` -> `titleLine2` | Required object with `highlight` (gradient-highlighted text) and `text` (remaining text). |
| `hero.json` -> `primaryAction`, `secondaryAction` | Required link objects. |
| `hero.json` -> `floatingIcons` | Required array of supported icon names. Only the first six are displayed. |
| [`navigation.json`](../site/src/data/navigation.json) -> `header.brand`, `footer.brand` | Required `name`, `logo`, `url`; footer brand also requires `tagline`. |
| `navigation.json` -> `header.items[]` | Required `label`; optional `url`, `external`, and `children`. A nonempty `children` array makes a dropdown instead of a direct link. Give direct items a URL. |
| `navigation.json` -> `header.items[].children[]` | Link objects with optional plain-text `description`. |
| `navigation.json` -> `header.search` | Required `enabled` boolean and `placeholder` string; optional `fallbackUrl` and `fallbackLabel`. Use `{query}` in the fallback URL for the search query. |
| `navigation.json` -> `header.themeToggle.enabled` | Required boolean controlling visibility of the theme-toggle button. |
| `navigation.json` -> `header.actions[]`, `footer.social[]` | Entries require `label`, `icon`, `url`. The label provides accessible text for the icon link. |
| `navigation.json` -> `footer.columns[]` | Entries require `title` and `links` (array of link objects). |
| [`team.json`](../site/src/data/team.json) -> `members[].role` | Required plain-text role/job title. |
| [`site.json`](../site/src/data/site.json) -> `title`, `description` | Required page metadata, also used for social sharing. |
| `site.json` -> `lang` | Required HTML language tag, for example `"en"`. |
| `site.json` -> `themeColor` | Required CSS color string for browser theme metadata, not an `accent` palette name. |

## 10. Example entries

Add these objects to the relevant `items` array, replacing the example text, URLs, and IDs.
Do not replace the entire file or remove its `heading`.

### Featured article

```json
{
  "type": "Article",
  "title": "A guide to extending Copilot",
  "publishedAt": "2026-10-20T13:00:00Z",
  "description": "Practical guidance for choosing an extensibility approach.",
  "icon": "article",
  "accent": "blue",
  "link": {
    "label": "Read article",
    "url": "https://example.com/copilot-guide"
  }
}
```

### YouTube playlist

```json
{
  "title": "Copilot development sessions",
  "technology": "Microsoft Copilot",
  "accent": "indigo",
  "kind": "playlist",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID"
}
```

## 11. Before publishing

| Check | What to verify |
| --- | --- |
| Valid JSON | Double-quoted keys/strings, lowercase `true`/`false`, no comments, and no trailing commas. |
| Supported choices | Check `type`, `kind`, `icon`, `accent`, and `illustration` against the tables above. |
| Contract check | From `site/`, run `npm run check` to catch missing fields and incompatible shapes/types. |
| Build check | From `site/`, run `npm run build` to exercise runtime parsers, timestamp validation, and rendering warnings. A type check alone does not validate every allowed value. |
| Visual check | Preview the site and inspect the affected section, links, thumbnails, and both themes. Check ordering, featured limits, and event filters if an item seems missing. |
| Publish | Open a pull request. Merging changes under `site/` into `main` triggers deployment. |

For local setup, see [Developing locally](DEVELOPING.md). For deployment details, see
[Publishing to GitHub Pages](PUBLISHING.md).
