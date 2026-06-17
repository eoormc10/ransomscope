# RansomScope live-feed proxy (Cloudflare Worker)

A serverless proxy that fetches public threat-intel feeds (CISA KEV +
MalwareBazaar, plus optional AlienVault OTX) and returns one CORS-enabled
JSON payload for the static dashboard. Keeps API keys server-side and
edge-caches responses for 10 minutes.

## Deploy

You need a free Cloudflare account.

```bash
cd worker
npx wrangler login          # opens a browser to authorize (one time)
npx wrangler deploy
```

`wrangler deploy` prints your Worker URL, e.g.
`https://ransomscope-proxy.<your-subdomain>.workers.dev`

### Connect it to the frontend

Paste that URL into [`src/config.js`](../src/config.js):

```js
export const WORKER_URL = "https://ransomscope-proxy.your-subdomain.workers.dev";
```

Then commit + push — GitHub Actions rebuilds and the LIVE FEED section goes live.

## Optional: AlienVault OTX

The threat-actor source is skipped unless you provide a key:

```bash
npx wrangler secret put OTX_API_KEY
```

(OTX `pulses/subscribed` only returns pulses your account is subscribed to,
so it may be empty until you subscribe to some.)

## Response shape

```json
{
  "status": "success",
  "lastUpdated": "2026-06-17T...Z",
  "sources": { "vulnerabilities": "ok", "malwareSamples": "ok", "threatActors": "ok" },
  "data": {
    "vulnerabilities": [{ "cve": "...", "vendor": "...", "product": "...", "name": "...", "dateAdded": "..." }],
    "malwareSamples":  [{ "hash": "...", "signature": "...", "fileType": "...", "tags": [], "firstSeen": "..." }],
    "threatActors":    [{ "name": "...", "indicators": 0, "modified": "..." }]
  }
}
```
