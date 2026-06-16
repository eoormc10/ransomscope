# RansomScope

Threat Actor Intelligence Console — an educational React dashboard visualizing
ransomware groups (2018–2026): their lineage, lifespans, TTPs, and victim trends.
Built with React + Vite + Recharts. All data is hard-coded from public reporting.

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
