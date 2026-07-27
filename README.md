# RansomScope

Threat Actor Intelligence Console — the interactive companion to the CSCE 701
research paper *"To Pay a Ransom Is to Feed the Wolf: The Evolution of Ransomware
and What Organizations Can Do About It"* (Rios, Mendoza & Reyes, Texas A&M
University, July 2026).

The site is a threat-actor dashboard — 35 years of ransomware history, group
lineage and TTPs (2018–2026), and a live feed — plus the paper's case evidence:
the four incidents it analyzes, what they show together, and the layered-defense
model they support. Every claim links out to its primary source. Built with
React + Vite + Recharts.

## Where the content lives

| File | Contents |
| --- | --- |
| [`src/RansomScope.jsx`](src/RansomScope.jsx) | Dashboard: group roster, lineage timeline/graph, origins strip, charts, live feed |
| [`src/paperData.js`](src/paperData.js) | Case evidence from the paper — the four case studies, cross-case findings, and the defense model |
| [`src/PaperSections.jsx`](src/PaperSections.jsx) | Components + styles that render `paperData.js` |
| [`src/theme.js`](src/theme.js) | Shared color palette |
| [`worker/`](worker/) | Cloudflare Worker proxying the live threat feeds |

All data is hard-coded from public reporting. The site carries the paper's case
findings, not the paper itself — methodology, limitations, and the full works
cited stay in the write-up.

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
