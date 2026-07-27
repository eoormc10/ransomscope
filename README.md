# RansomScope

Threat Actor Intelligence Console — the interactive companion to the CSCE 701
research paper *"To Pay a Ransom Is to Feed the Wolf: The Evolution of Ransomware
and What Organizations Can Do About It"* (Rios, Mendoza & Reyes, Texas A&M
University, July 2026).

The site pairs a live-updating threat-actor dashboard with the paper's written
argument: 35 years of ransomware history, group lineage and TTPs (2018–2026),
the four case studies, the layered-defense model, and the payment question.
Built with React + Vite + Recharts.

## Where the content lives

| File | Contents |
| --- | --- |
| [`src/RansomScope.jsx`](src/RansomScope.jsx) | Dashboard: group roster, lineage timeline/graph, origins strip, charts, live feed |
| [`src/paperData.js`](src/paperData.js) | Everything transcribed from the paper + deck — abstract, research questions, four cases, findings, defenses, methodology, references |
| [`src/PaperSections.jsx`](src/PaperSections.jsx) | Components + styles that render `paperData.js` |
| [`src/theme.js`](src/theme.js) | Shared color palette |
| [`worker/`](worker/) | Cloudflare Worker proxying the live threat feeds |

Group intel in `RansomScope.jsx` is hard-coded from public reporting; the paper
sections in `paperData.js` are transcribed from the group's own write-up.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs static site to dist/
npm run preview  # serve the built dist/ locally
```

## Deploy

Pushing to `main` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions.**
