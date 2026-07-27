/* Generates the two paper figures as standalone SVGs, in a light variant for
 * the Google Docs write-up and a dark variant matching the deck / site.
 *   node handoff/figures/build.mjs
 * PNGs are produced from these by handoff/figures/topng.sh (headless Chrome).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));

const THEMES = {
  light: {
    bg: "#FFFFFF", panel: "#F4F7FA", line: "#D3DBE5", soft: "#E6EBF2",
    text: "#0E131C", muted: "#59637A", faint: "#8A93A5",
    red: "#D22F3B", amber: "#B57A15", slate: "#6B7688",
    cyan: "#0E8E80", violet: "#5B4BC4", green: "#0F8A5F",
  },
  dark: {
    bg: "#0A0D14", panel: "#161C28", line: "#232C3C", soft: "#1B2230",
    text: "#E9EDF5", muted: "#828FA6", faint: "#5A6478",
    red: "#F0454F", amber: "#E5A23A", slate: "#58647A",
    cyan: "#36CFC0", violet: "#8C7BFF", green: "#34D399",
  },
};

const SANS = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const MONO = "Consolas, Menlo, monospace";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------------- Figure 1 — extortion leverage --------------- */

const STAGES = [
  {
    n: "01", era: "2013 – 2019", model: "Encryption only", tone: "slate",
    holds: "Your access to your own files",
    how: ["Encrypt the files, sell back the key.", "Leverage ends the moment the victim", "restores from a clean backup."],
    effect: "Defeated outright by a tested backup.",
    ex: "CryptoLocker · GandCrab",
  },
  {
    n: "02", era: "2019 – present", model: "Double extortion", tone: "amber",
    holds: "Your files and your secrets",
    how: ["Copy sensitive data out first, then", "encrypt. Refusing to pay now risks", "publication on a leak site."],
    effect: "Backups no longer close the incident.",
    ex: "REvil · Conti · LockBit",
  },
  {
    n: "03", era: "2020 – present", model: "Triple extortion", tone: "red",
    holds: "Your files, secrets and relationships",
    how: ["Add pressure outside the victim —", "contacting customers, partners,", "patients or regulators directly."],
    effect: "Staying quiet stops being an option.",
    ex: "BlackCat · Black Basta",
  },
  {
    n: "04", era: "2023 – present", model: "Extortion-first", tone: "violet",
    holds: "Only your secrets",
    how: ["Skip encryption entirely. Steal at", "scale through one software flaw and", "extort every downstream victim."],
    effect: "Nothing to decrypt — restore-only recovery plans miss it.",
    ex: "Clop (MOVEit)",
  },
];

function figExtortion(t) {
  const W = 1680, H = 560, M = 40, GAP = 44;
  const BW = Math.round((W - M * 2 - GAP * 3) / 4);
  const BY = 132, BH = 372;
  const p = [];

  p.push(`<rect width="${W}" height="${H}" fill="${t.bg}"/>`);
  p.push(`<text x="${M}" y="52" font-family="${SANS}" font-size="27" font-weight="700" fill="${t.text}">What the attacker holds hostage</text>`);
  p.push(`<text x="${M}" y="82" font-family="${SANS}" font-size="15" fill="${t.muted}">Each stage adds a new source of leverage rather than replacing the last. Modern operations mix and match by victim.</text>`);
  p.push(`<line x1="${M}" y1="104" x2="${W - M}" y2="104" stroke="${t.line}" stroke-width="1"/>`);

  STAGES.forEach((s, i) => {
    const x = M + i * (BW + GAP);
    const col = t[s.tone];
    p.push(`<rect x="${x}" y="${BY}" width="${BW}" height="${BH}" rx="10" fill="${t.panel}" stroke="${t.line}"/>`);
    p.push(`<rect x="${x}" y="${BY}" width="${BW}" height="3" rx="1.5" fill="${col}"/>`);
    p.push(`<text x="${x + 18}" y="${BY + 34}" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${col}" letter-spacing="1">${s.n}</text>`);
    p.push(`<text x="${x + BW - 18}" y="${BY + 34}" font-family="${MONO}" font-size="12" fill="${t.faint}" text-anchor="end">${esc(s.era)}</text>`);
    p.push(`<text x="${x + 18}" y="${BY + 74}" font-family="${SANS}" font-size="21" font-weight="700" fill="${col}">${esc(s.model)}</text>`);

    p.push(`<text x="${x + 18}" y="${BY + 108}" font-family="${MONO}" font-size="10.5" font-weight="700" fill="${t.faint}" letter-spacing="1.1">HOLDS</text>`);
    const holds = s.holds.length > 30 ? [s.holds.slice(0, s.holds.lastIndexOf(" ", 30)), s.holds.slice(s.holds.lastIndexOf(" ", 30) + 1)] : [s.holds];
    holds.forEach((ln, k) =>
      p.push(`<text x="${x + 18}" y="${BY + 130 + k * 20}" font-family="${SANS}" font-size="14.5" font-weight="600" fill="${t.text}">${esc(ln)}</text>`)
    );

    const howY = BY + 130 + holds.length * 20 + 18;
    s.how.forEach((ln, k) =>
      p.push(`<text x="${x + 18}" y="${howY + k * 21}" font-family="${SANS}" font-size="13.5" fill="${t.muted}">${esc(ln)}</text>`)
    );

    // effect strip, pinned above the exemplars
    const effY = BY + BH - 74;
    p.push(`<line x1="${x + 18}" y1="${effY - 20}" x2="${x + BW - 18}" y2="${effY - 20}" stroke="${t.soft}"/>`);
    const eff = wrap(s.effect, 34);
    eff.slice(0, 2).forEach((ln, k) =>
      p.push(`<text x="${x + 18}" y="${effY + k * 17}" font-family="${SANS}" font-size="12.5" font-style="italic" fill="${t.faint}">${esc(ln)}</text>`)
    );

    p.push(`<text x="${x + 18}" y="${BY + BH - 20}" font-family="${MONO}" font-size="12" fill="${col}">${esc(s.ex)}</text>`);

    if (i < 3) {
      const ax = x + BW + GAP / 2, ay = BY + BH / 2;
      p.push(`<path d="M ${ax - 9} ${ay - 9} L ${ax + 5} ${ay} L ${ax - 9} ${ay + 9}" fill="none" stroke="${t.faint}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
  });

  p.push(`<text x="${M}" y="${H - 16}" font-family="${SANS}" font-size="12.5" fill="${t.faint}">Figure 1. Compiled from public reporting and government advisories cited in this review.</text>`);
  return svg(W, H, p.join("\n"));
}

function wrap(s, n) {
  const words = s.split(" "), out = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; }
    else cur += " " + w;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/* ------------------- Figure 2 — lineage ----------------------- */

const NODES = [
  // Row order matters: LockBit sits between the main chain and the Conti
  // cluster so its long edge into RansomHub sweeps through empty space
  // instead of crossing a node it has no relationship with.
  { id: "gandcrab",  label: "GandCrab",      col: 0, y: 150, st: "defunct",   note: "“Retired” 2019" },
  { id: "lockbit",   label: "LockBit",        col: 0, y: 300, st: "disrupted", note: "Op. Cronos, Feb 2024" },
  { id: "conti",     label: "Conti",          col: 0, y: 442, st: "defunct",   note: "Conti Leaks, 2022" },
  { id: "revil",     label: "REvil",          col: 1, y: 150, st: "defunct",   note: "FBI disruption, 2021" },
  { id: "blackbasta",label: "Black Basta",    col: 1, y: 442, st: "disrupted", note: "Chat leak, 2025" },
  { id: "play",      label: "Play",           col: 1, y: 534, st: "active",    note: "Closed group" },
  { id: "darkside",  label: "DarkSide",       col: 2, y: 150, st: "defunct",   note: "Disbanded after Colonial" },
  { id: "blackcat",  label: "BlackCat",       col: 3, y: 150, st: "defunct",   note: "Exit scam, Mar 2024" },
  { id: "ransomhub", label: "RansomHub",      col: 4, y: 236, st: "disrupted", note: "Went quiet, 2025" },
  { id: "qilin",     label: "Qilin",          col: 5, y: 236, st: "active",    note: "#1 group, 2025–26" },
  { id: "gentlemen", label: "The Gentlemen",  col: 6, y: 236, st: "active",    note: "Founded by ex-affiliate" },
];
const EDGES = [
  ["gandcrab", "revil"], ["revil", "darkside"], ["darkside", "blackcat"],
  ["blackcat", "ransomhub"], ["lockbit", "ransomhub"], ["ransomhub", "qilin"],
  ["qilin", "gentlemen"], ["conti", "blackbasta"], ["conti", "play"],
];

function figLineage(t) {
  const W = 1680, H = 688, M = 40;
  const NW = 152, NH = 46, COLX = 228;
  const ST = { active: t.red, disrupted: t.amber, defunct: t.slate };
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const nx = (n) => M + n.col * COLX;
  const p = [];

  p.push(`<rect width="${W}" height="${H}" fill="${t.bg}"/>`);
  p.push(`<text x="${M}" y="52" font-family="${SANS}" font-size="27" font-weight="700" fill="${t.text}">Every disruption removed a brand, not the people</text>`);
  p.push(`<text x="${M}" y="82" font-family="${SANS}" font-size="15" fill="${t.muted}">Rebrands and affiliate migration across the ransomware ecosystem. Arrows point from predecessor to successor; columns are generations.</text>`);
  p.push(`<line x1="${M}" y1="104" x2="${W - M}" y2="104" stroke="${t.line}" stroke-width="1"/>`);

  EDGES.forEach(([a, b]) => {
    const A = byId[a], B = byId[b];
    const x1 = nx(A) + NW, y1 = A.y + NH / 2;
    const x2 = nx(B), y2 = B.y + NH / 2;
    const mx = (x1 + x2) / 2;
    p.push(`<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 9} ${y2}" fill="none" stroke="${t.faint}" stroke-width="1.7" opacity="0.75"/>`);
    p.push(`<path d="M ${x2 - 9} ${y2 - 5} L ${x2 - 1} ${y2} L ${x2 - 9} ${y2 + 5} Z" fill="${t.faint}"/>`);
  });

  NODES.forEach((n) => {
    const x = nx(n), col = ST[n.st];
    p.push(`<rect x="${x}" y="${n.y}" width="${NW}" height="${NH}" rx="9" fill="${t.panel}" stroke="${col}" stroke-width="1.6"/>`);
    p.push(`<circle cx="${x + 15}" cy="${n.y + NH / 2}" r="4.5" fill="${col}"/>`);
    p.push(`<text x="${x + 28}" y="${n.y + NH / 2 + 5}" font-family="${SANS}" font-size="15" font-weight="700" fill="${t.text}">${esc(n.label)}</text>`);
    if (n.note) p.push(`<text x="${x}" y="${n.y + NH + 17}" font-family="${MONO}" font-size="11" fill="${t.faint}">${esc(n.note)}</text>`);
  });

  // legend
  const ly = H - 54;
  [["Active", t.red], ["Disrupted", t.amber], ["Defunct", t.slate]].forEach(([lab, c], i) => {
    const lx = M + i * 132;
    p.push(`<rect x="${lx}" y="${ly - 9}" width="12" height="9" rx="2" fill="${c}"/>`);
    p.push(`<text x="${lx + 19}" y="${ly}" font-family="${SANS}" font-size="13" fill="${t.muted}">${lab}</text>`);
  });
  p.push(`<text x="${M}" y="${H - 16}" font-family="${SANS}" font-size="12.5" fill="${t.faint}">Figure 2. Lineage compiled from government advisories and vendor incident reporting cited in this review.</text>`);
  return svg(W, H, p.join("\n"));
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n${body}\n</svg>\n`;

for (const [name, fn] of [["extortion-model", figExtortion], ["lineage", figLineage]]) {
  for (const [tn, t] of Object.entries(THEMES)) {
    const file = join(OUT, `${name}-${tn}.svg`);
    writeFileSync(file, fn(t), "utf8");
    console.log("wrote", file.replace(OUT, "handoff/figures"));
  }
}
