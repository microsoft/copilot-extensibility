# Copilot Extensibility Landing Site

The **Copilot Extensibility Landing Site** provides a single entry point for makers and developers who want to learn
how to extend Microsoft Copilot and build AI-powered solutions.

Rather than creating new content, the site **aggregates and organizes existing resources** across GitHub repositories,
blogs, videos, cookbooks, labs, workshops, samples, documentation, community initiatives, events, and more. The goal is
to improve discoverability, provide a consistent navigation experience, and create a unified front door for the rapidly
evolving Copilot extensibility ecosystem.

🌐 **Live site:** <https://microsoft.github.io/copilot-extensibility/>

## What's on the landing page

| Block | What it offers | Configured in |
| --- | --- | --- |
| Top menu | Navigation, *Resources* menu, site search, light/dark theme | [`site/src/data/navigation.json`](site/src/data/navigation.json) → `header` |
| Hero | Headline and main calls to action | [`site/src/data/hero.json`](site/src/data/hero.json) |
| Quick links | Learn · Build · Technologies · Community entry points | [`site/src/data/quick-links.json`](site/src/data/quick-links.json) |
| Featured content | Curated blogs, videos, labs and cookbooks | [`site/src/data/featured-content.json`](site/src/data/featured-content.json) |
| Technologies at a glance | The extensibility building blocks, linked to their docs | [`site/src/data/technologies.json`](site/src/data/technologies.json) |
| Recommended learning paths | Maker, Developer and Architect paths | [`site/src/data/learning-paths.json`](site/src/data/learning-paths.json) |
| Community & events | First-party events and community events/initiatives | [`site/src/data/community-events.json`](site/src/data/community-events.json) |
| Explore the ecosystem | Directory of communities, event series and resources | [`site/src/data/ecosystem.json`](site/src/data/ecosystem.json) |
| Footer | Link columns, communities, social and legal links | [`site/src/data/navigation.json`](site/src/data/navigation.json) → `footer` |

Every block is a reusable [Astro](https://astro.build) component driven by its own JSON configuration file, so the
content can be maintained **without touching any markup**.

## Getting started

Prerequisites: [Node.js](https://nodejs.org/) 22 LTS (see [`.nvmrc`](.nvmrc)) and npm.

```bash
cd site
npm ci           # install dependencies
npm run dev      # start the dev server → http://localhost:4321/copilot-extensibility/
npm run check    # type-check components and validate JSON configuration files
npm run build    # build the static site into ./dist
npm run preview  # preview the production build locally
```

See [docs/DEVELOPING.md](docs/DEVELOPING.md) for the full local development guide.

## Updating the content

1. Edit the JSON file of the block you want to change in [`site/src/data/`](site/src/data) (add an event, a featured item, a
   technology, a link…).
2. Run `npm run check` to validate the file against its contract in [`site/src/types/config.ts`](site/src/types/config.ts).
3. Open a pull request. Once merged into `main`, the site is rebuilt and published automatically by GitHub Actions.

## Project structure

```text
.github/workflows/deploy.yml     GitHub Actions workflow publishing ./site to GitHub Pages
docs/                            Architecture and publishing documentation
site/                            The Astro project (everything needed to build the site)
├── astro.config.mjs             Site URL and base path
├── package.json                 Dependencies and npm scripts
├── public/                      Static assets (logo, favicon)
└── src/
    ├── data/                    JSON configuration — one file per landing-page block
    ├── components/              Astro components — one per block + shared building blocks
    ├── layouts/                 HTML shell
    ├── pages/index.astro        Landing page composing all components
    ├── styles/global.css        Design tokens, light/dark themes, accent colors
    ├── types/config.ts          TypeScript contracts for the JSON files
    └── utils/                   URL, date and search helpers
```

## Documentation

- [Developing locally](docs/DEVELOPING.md) — running the site on localhost, editing content, adding components and pages.
- [Architecture and components](docs/ARCHITECTURE.md) — how the site is built and how each component works.
- [Publishing to GitHub Pages](docs/PUBLISHING.md) — step-by-step deployment and maintenance guide.

## Contributing

This project welcomes contributions and suggestions — new resources, events, community initiatives, fixes and
improvements. Please open an [issue](https://github.com/microsoft/copilot-extensibility/issues) to suggest content or
report a problem, or submit a pull request with your changes to the JSON files.

Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to,
and actually do, grant us the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact
[opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft
sponsorship. Any use of third-party trademarks or logos are subject to those third-party's policies.

## License

Licensed under the [MIT License](LICENSE).
