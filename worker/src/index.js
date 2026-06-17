/* ------------------------------------------------------------------ *
 * RansomScope live-feed proxy — Cloudflare Worker
 *
 * Aggregates keyless public threat-intel feeds into one CORS-enabled JSON
 * payload for the static GitHub Pages frontend. Augments the curated
 * dashboard; it does NOT replace it.
 *
 * Sources (all keyless except OTX):
 *   - CISA KEV  (Known Exploited Vulnerabilities) — ransomware-linked CVEs
 *   - ransomware.live — recent ransomware leak-site victims
 *   - AlienVault OTX (optional) — only if OTX_API_KEY secret is set
 *
 * Deliberately omits MITRE enterprise-attack.json: at ~35 MB it blows the
 * free-tier 10 ms CPU / 128 MB limits. ATT&CK is curated in the frontend.
 *
 * Responses are edge-cached for CACHE_SECONDS to stay well under the
 * 100k-requests/day budget and to be kind to the upstream APIs.
 * ------------------------------------------------------------------ */

const CACHE_SECONDS = 600; // 10 minutes

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // Serve from edge cache when warm (skip with ?nocache, e.g. manual refresh).
    const url = new URL(request.url);
    const bypass = url.searchParams.has("nocache");
    const cache = caches.default;
    const cacheKey = new Request(url.origin + "/feed", { method: "GET" });
    if (!bypass) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    const [cisa, rl, otx] = await Promise.allSettled([
      getCisaRansomwareCves(),
      getRecentVictims(),
      env.OTX_API_KEY ? getOtxPulses(env.OTX_API_KEY) : Promise.resolve([]),
    ]);

    const payload = {
      status: "success",
      lastUpdated: new Date().toISOString(),
      sources: {
        vulnerabilities: cisa.status === "fulfilled" ? "ok" : "error",
        recentVictims: rl.status === "fulfilled" ? "ok" : "error",
        threatActors: otx.status === "fulfilled" ? "ok" : "error",
      },
      data: {
        vulnerabilities: cisa.status === "fulfilled" ? cisa.value : [],
        recentVictims: rl.status === "fulfilled" ? rl.value : [],
        threatActors: otx.status === "fulfilled" ? otx.value : [],
      },
    };

    const resp = json(payload, 200, {
      "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
    });
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
    return resp;
  },
};

// --- CISA KEV: CVEs flagged as used in ransomware campaigns ---------
async function getCisaRansomwareCves() {
  const url =
    "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
  const res = await fetch(url, { cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } });
  if (!res.ok) throw new Error(`CISA ${res.status}`);
  const data = await res.json();
  return (data.vulnerabilities || [])
    .filter((v) => v.knownRansomwareCampaignUse === "Known")
    .sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1)) // newest first
    .slice(0, 8)
    .map((v) => ({
      cve: v.cveID,
      vendor: v.vendorProject,
      product: v.product,
      name: v.vulnerabilityName,
      dateAdded: v.dateAdded,
    }));
}

// --- ransomware.live: recent leak-site victims ----------------------
async function getRecentVictims() {
  const res = await fetch("https://api.ransomware.live/v2/recentvictims", {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`ransomware.live ${res.status}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : [])
    .slice(0, 10)
    .map((v) => ({
      victim: v.victim,
      group: v.group,
      sector: v.activity && v.activity !== "Not Found" ? v.activity : "",
      country: v.country || "",
      date: (v.attackdate || v.discovered || "").slice(0, 10),
      url: v.url || "",
    }));
}

// --- AlienVault OTX (optional) --------------------------------------
async function getOtxPulses(key) {
  const res = await fetch(
    "https://otx.alienvault.com/api/v1/pulses/subscribed?limit=6",
    { headers: { "X-OTX-API-KEY": key, "Content-Type": "application/json" } }
  );
  if (!res.ok) throw new Error(`OTX ${res.status}`);
  const data = await res.json();
  return (data.results || []).map((p) => ({
    name: p.name,
    indicators: p.indicator_count,
    modified: p.modified,
  }));
}
