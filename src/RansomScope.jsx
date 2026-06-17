import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip,
  PieChart, Pie,
} from "recharts";
import {
  ShieldAlert, Skull, Activity, GitBranch, Lock, KeyRound,
  Crosshair, Building2, Banknote, Radar, AlertTriangle,
  ExternalLink, FileText, Search, X, Target,
  Plus, Check, ArrowLeftRight, History, Rss, RefreshCw,
} from "lucide-react";
import { WORKER_URL } from "./config.js";

/* ------------------------------------------------------------------ *
 * RANSOMSCOPE — Threat Actor Intelligence Console
 * Data compiled from public reporting (GuidePoint/GRIT, Check Point,
 * CISA/FBI advisories, Chainalysis, DOJ/Europol, vendor IR reports).
 * Figures are reported/approximate and intended for education.
 * ------------------------------------------------------------------ */

const C = {
  ink: "#0A0D14",
  panel: "#10151F",
  panel2: "#161C28",
  line: "#232C3C",
  lineSoft: "#1B2230",
  text: "#E9EDF5",
  muted: "#828FA6",
  faint: "#5A6478",
  red: "#F0454F",     // active threat
  amber: "#E5A23A",   // disrupted
  slate: "#58647A",   // defunct
  cyan: "#36CFC0",    // data / selection accent
  violet: "#8C7BFF",  // secondary data
  green: "#34D399",   // live / fresh indicator
};

const STATUS = {
  active:    { label: "ACTIVE",    color: C.red,   icon: ShieldAlert },
  disrupted: { label: "DISRUPTED", color: C.amber, icon: AlertTriangle },
  defunct:   { label: "DEFUNCT",   color: C.slate, icon: Skull },
};

// id, name, aka, status, start/end (decimal year), disruptAt (optional marker)
// origin, parents[], children[], summary, access[], sectors[], encryption,
// ransom, victims[], peak (display string)
const GROUPS = [
  {
    id: "gandcrab", name: "GandCrab", aka: "—", status: "defunct",
    start: 2018.0, end: 2019.5, origin: "Russia-nexus",
    parents: [], children: ["revil"],
    summary: "RaaS pioneer that popularized the affiliate model. Operators announced 'retirement' in 2019, claiming over $2B extorted — then reappeared as REvil.",
    access: ["Exploit kits", "Phishing", "RDP"],
    sectors: ["Broad / opportunistic"],
    encryption: "Salsa20 + RSA-2048",
    ransom: "Reported ~$2B extorted across its run (operators' own claim).",
    victims: ["Widespread SMB campaigns"], peak: "Defined the RaaS template",
  },
  {
    id: "revil", name: "REvil", aka: "Sodinokibi", status: "defunct",
    start: 2019.3, end: 2022.0, origin: "Russia-nexus",
    parents: ["gandcrab"], children: ["darkside"],
    summary: "Successor to GandCrab and one of the most aggressive RaaS crews. Hit Kaseya and JBS before FBI disruption in 2021 and Russian arrests in early 2022.",
    access: ["Supply-chain (Kaseya VSA)", "Phishing", "Exploited public apps"],
    sectors: ["Managed service providers", "Food & agriculture", "Manufacturing"],
    encryption: "Salsa20 + Curve25519 / RSA",
    ransom: "Demanded $70M (Kaseya, 2021); JBS reportedly paid ~$11M.",
    victims: ["Kaseya", "JBS Foods", "Acer", "Travelex"], peak: "FBI disruption 2021",
  },
  {
    id: "darkside", name: "DarkSide", aka: "—", status: "defunct",
    start: 2020.6, end: 2021.4, origin: "Russia-nexus",
    parents: ["revil"], children: ["blackcat"],
    summary: "Short-lived but infamous for the Colonial Pipeline attack, which triggered fuel shortages on the US East Coast and intense law-enforcement heat. Disbanded weeks later; reappeared briefly as BlackMatter.",
    access: ["Compromised VPN credentials", "Phishing"],
    sectors: ["Energy", "Critical infrastructure"],
    encryption: "Salsa20 + RSA-1024",
    ransom: "Colonial Pipeline paid ~$4.4M (2021); DOJ later clawed back ~$2.3M.",
    victims: ["Colonial Pipeline"], peak: "Colonial Pipeline, May 2021",
  },
  {
    id: "conti", name: "Conti", aka: "—", status: "defunct",
    start: 2020.0, end: 2022.4, origin: "Russia-nexus (Wizard Spider)",
    parents: [], children: ["blackbasta", "play"],
    summary: "A prolific, corporately-structured operation. Imploded in 2022 after the 'Conti Leaks' exposed its internal chats following a pro-Russia stance on the Ukraine war. Members dispersed into Royal/BlackSuit, Black Basta and others.",
    access: ["Phishing (BazarLoader/TrickBot)", "Exploited public apps", "RDP"],
    sectors: ["Healthcare", "Government", "Manufacturing"],
    encryption: "Fast multithreaded AES-256",
    ransom: "Demands commonly $1M–$25M+; tens of millions collected.",
    victims: ["Costa Rica government", "Ireland HSE", "JVCKenwood"], peak: "Conti Leaks, 2022",
  },
  {
    id: "hive", name: "Hive", aka: "—", status: "defunct",
    start: 2021.0, end: 2023.1, origin: "Russia-nexus",
    parents: [], children: [],
    summary: "Double-extortion RaaS dismantled in a landmark FBI infiltration: agents quietly held the group's decryption keys for months, handing them to victims before seizing infrastructure in January 2023.",
    access: ["Phishing", "RDP", "Exploited public apps (ProxyShell)"],
    sectors: ["Healthcare", "Education", "Critical infrastructure"],
    encryption: "Hybrid AES + RSA (Go / Rust variants)",
    ransom: "DOJ estimated ~$100M+ extorted before takedown.",
    victims: ["Memorial Health System", "Costa Rica CCSS"], peak: "FBI takedown, Jan 2023",
  },
  {
    id: "clop", name: "Clop", aka: "Cl0p", status: "active",
    start: 2019.0, end: 2026.1, origin: "Russia-nexus (TA505)",
    parents: [], children: [],
    summary: "Specialists in mass exploitation of file-transfer software. Often skips encryption entirely — stealing data and extorting at scale. Ran the Accellion, GoAnywhere and MOVEit zero-day campaigns hitting hundreds of organizations at once.",
    access: ["Zero-day exploitation of file-transfer apps (MOVEit, GoAnywhere, Accellion)"],
    sectors: ["Finance", "Government", "Healthcare", "Education"],
    encryption: "Often data-theft only (extortion-first); CryptoMix lineage encryptor",
    ransom: "MOVEit demands varied; aggregate campaign extortion estimated in the hundreds of millions.",
    victims: ["MOVEit (600+ orgs)", "GoAnywhere", "Accellion"], peak: "MOVEit campaign, 2023",
  },
  {
    id: "lockbit", name: "LockBit", aka: "LockBit 3.0 / 5.0", status: "disrupted",
    start: 2019.6, end: 2026.1, disruptAt: 2024.13, origin: "Russia-nexus",
    parents: [], children: ["ransomhub"],
    summary: "For years the largest RaaS operation worldwide. 'Operation Cronos' seized its infrastructure in Feb 2024 and the gang 'unseized' a mirror hours later. Reputationally damaged but not gone — released LockBit 5.0 in 2025 and threatened critical infrastructure.",
    access: ["Phishing", "RDP / valid accounts", "Exploited public apps (Fortinet, ConnectWise)"],
    sectors: ["Manufacturing", "Professional services", "Healthcare", "Government"],
    encryption: "Highly optimized fast encryptor; ESXi-aware variants",
    ransom: "NCA traced ~$110M (2,200 BTC) in unlaundered proceeds; $10M US bounty on leaders.",
    victims: ["Boeing", "ICBC", "Royal Mail"], peak: "Op. Cronos takedown, Feb 2024",
  },
  {
    id: "blackcat", name: "BlackCat", aka: "ALPHV / Noberus", status: "defunct",
    start: 2021.8, end: 2024.2, origin: "Russia-nexus",
    parents: ["darkside"], children: ["ransomhub"],
    summary: "First major Rust-based ransomware — fast, cross-platform and ESXi-aware. After an apparent ~$22M payment tied to the Change Healthcare attack, leadership pulled an 'exit scam,' stiffing the affiliate and vanishing in early 2024.",
    access: ["Stolen credentials", "Exploited public apps", "Social engineering"],
    sectors: ["Healthcare", "Hospitality", "Financial services", "Manufacturing"],
    encryption: "Rust-based; AES / ChaCha20, ESXi-aware",
    ransom: "~$22M reported paid via Change Healthcare/Optum (2024).",
    victims: ["Change Healthcare", "MGM Resorts", "Reddit"], peak: "Exit scam, March 2024",
  },
  {
    id: "ransomhub", name: "RansomHub", aka: "—", status: "disrupted",
    start: 2024.1, end: 2025.3, origin: "Russia-linked",
    parents: ["blackcat", "lockbit"], children: ["qilin"],
    summary: "Filled the post-takedown vacuum by recruiting displaced ALPHV and LockBit affiliates with a generous 90% payout. Surged in 2024, then its own infrastructure went quiet in early 2025 — affiliates migrated onward, notably toward Qilin.",
    access: ["Affiliate-supplied access", "Stolen VPN credentials", "Exploited public apps"],
    sectors: ["Healthcare", "Critical infrastructure", "Retail"],
    encryption: "Cross-platform (Go/C++); ESXi & Windows payloads",
    ransom: "90% affiliate payout model; multi-million-dollar demands.",
    victims: ["Rite Aid", "Frontier Communications", "Christie's"], peak: "Affiliate magnet, 2024",
  },
  {
    id: "blackbasta", name: "Black Basta", aka: "—", status: "disrupted",
    start: 2022.3, end: 2025.6, disruptAt: 2025.1, origin: "Russia-nexus (ex-Conti)",
    parents: ["conti"], children: [],
    summary: "Emerged from the Conti diaspora and quickly became a top-tier double-extortion crew. Internal chat logs leaked in 2025, exposing operations and accelerating its decline.",
    access: ["Phishing (Qakbot)", "Social engineering / IT help-desk lures", "Exploited public apps"],
    sectors: ["Manufacturing", "Construction", "Healthcare"],
    encryption: "ChaCha20 + RSA; ESXi-aware",
    ransom: "Estimated $100M+ collected across its run.",
    victims: ["Ascension Health", "Capita", "ABB"], peak: "Chat leak, 2025",
  },
  {
    id: "play", name: "Play", aka: "PlayCrypt", status: "active",
    start: 2022.5, end: 2026.1, origin: "Russia-nexus (closed group)",
    parents: ["conti"], children: [],
    summary: "A 'closed' group that doesn't openly recruit affiliates, making it harder for law enforcement to penetrate. Consistently high-volume and a fixture of the top tier into 2026.",
    access: ["Exploited public apps (FortiOS, Exchange)", "Valid accounts", "RDP"],
    sectors: ["Government", "Manufacturing", "Professional services"],
    encryption: "AES-RSA hybrid; intermittent encryption for speed",
    ransom: "Multi-million-dollar demands; broad mid-market targeting.",
    victims: ["City of Oakland", "Rackspace", "Krispy Kreme"], peak: "Top-tier through 2026",
  },
  {
    id: "qilin", name: "Qilin", aka: "Agenda", status: "active",
    start: 2022.6, end: 2026.2, origin: "Russia-nexus",
    parents: ["ransomhub"], children: ["gentlemen"],
    summary: "The dominant operator of the moment. A turnkey RaaS that absorbed displaced affiliates after the 2024–25 takedowns and exploded — from 154 victims in 2024 to over 1,000 in 2025, holding the #1 spot for consecutive quarters into 2026.",
    access: ["IAB-purchased VPN credentials", "Phishing", "Exploited public apps (Fortinet)"],
    sectors: ["Manufacturing", "Professional services", "Finance", "Healthcare"],
    encryption: "Rust/Go cross-platform; ESXi-aware, configurable",
    ransom: "Large enterprise demands; leak-site listings topped 1,000 in 2025.",
    victims: ["Synnovis (NHS pathology)", "Yangfeng", "Court Services Victoria"], peak: "#1 group, 2025–26",
  },
  {
    id: "akira", name: "Akira", aka: "—", status: "active",
    start: 2023.2, end: 2026.2, origin: "Russia-nexus",
    parents: [], children: [],
    summary: "Persistent, technically capable and constantly refining. A CISA/FBI advisory updated in late 2025 tied Akira to 250+ organizations and expanding targeting of virtualized infrastructure — VMware ESXi, Hyper-V and Nutanix.",
    access: ["VPN without MFA (Cisco)", "Stolen credentials", "Exploited public apps"],
    sectors: ["Manufacturing", "Professional services", "Education", "Finance"],
    encryption: "ChaCha20 + RSA; ESXi / Hyper-V / Nutanix-aware",
    ransom: "CISA estimated ~$42M+ collected across 250+ victims.",
    victims: ["250+ organizations (CISA)"], peak: "CISA advisory, Nov 2025",
  },
  {
    id: "gentlemen", name: "The Gentlemen", aka: "—", status: "active",
    start: 2025.7, end: 2026.2, origin: "Russia-nexus (ex-Qilin)",
    parents: ["qilin"], children: [],
    summary: "Founded in late 2025 by a former Qilin affiliate. Jumped to #3 globally within months on the back of a pre-staged stockpile of compromised access — a sign of how fast affiliate spin-offs can scale.",
    access: ["Pre-staged access stockpile", "Stolen credentials"],
    sectors: ["APAC & LATAM enterprises", "Manufacturing", "Services"],
    encryption: "Cross-platform; modern RaaS toolkit",
    ransom: "Rapid scale: ~166 victims in Q1 2026 (a 315% jump).",
    victims: ["166 victims, Q1 2026"], peak: "#3 globally, Q1 2026",
  },
];

const GROUP_BY_ID = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

// Normalized initial-access techniques per group (for faceted filtering).
const TAGS = {
  gandcrab:  ["Exploit kits", "Phishing", "RDP / valid accounts"],
  revil:     ["Supply chain", "Phishing", "Exploited public apps"],
  darkside:  ["Stolen / VPN credentials", "Phishing"],
  conti:     ["Phishing", "Exploited public apps", "RDP / valid accounts"],
  hive:      ["Phishing", "RDP / valid accounts", "Exploited public apps"],
  clop:      ["File-transfer zero-days", "Exploited public apps"],
  lockbit:   ["Phishing", "RDP / valid accounts", "Exploited public apps"],
  blackcat:  ["Stolen / VPN credentials", "Exploited public apps", "Social engineering"],
  ransomhub: ["Stolen / VPN credentials", "Exploited public apps"],
  blackbasta:["Phishing", "Social engineering", "Exploited public apps"],
  play:      ["Exploited public apps", "RDP / valid accounts"],
  qilin:     ["Stolen / VPN credentials", "Phishing", "Exploited public apps"],
  akira:     ["Stolen / VPN credentials", "Exploited public apps"],
  gentlemen: ["Stolen / VPN credentials"],
};

// Facet vocabulary, ordered by how common it is across the roster.
const ACCESS_TAGS = [
  "Exploited public apps", "Phishing", "Stolen / VPN credentials",
  "RDP / valid accounts", "File-transfer zero-days", "Social engineering",
  "Supply chain", "Exploit kits",
];

// Authoritative references per group (verified resolving URLs).
const REFS = {
  gandcrab: [
    { label: "Krebs: Who's Behind GandCrab", url: "https://krebsonsecurity.com/2019/07/whos-behind-the-gandcrab-ransomware/", type: "vendor" },
    { label: "Europol: GandCrab decryptor", url: "https://www.europol.europa.eu/media-press/newsroom/news/pay-no-more-universal-gandcrab-decryption-tool-released-for-free-no-more-ransom", type: "gov" },
  ],
  revil: [
    { label: "Wikipedia: REvil", url: "https://en.wikipedia.org/wiki/REvil", type: "wiki" },
    { label: "Europol: REvil affiliates arrested", url: "https://www.europol.europa.eu/newsroom/news/five-affiliates-to-sodinokibi/revil-unplugged", type: "gov" },
    { label: "DOJ: REvil affiliate sentenced", url: "https://www.justice.gov/usao-ndtx/pr/sodinokibirevil-affiliate-sentenced-role-700m-ransomware-scheme", type: "gov" },
  ],
  darkside: [
    { label: "CISA: DarkSide (AA21-131A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a", type: "cisa" },
    { label: "Wikipedia: DarkSide", url: "https://en.wikipedia.org/wiki/DarkSide_(hacker_group)", type: "wiki" },
    { label: "Krebs: A Closer Look at DarkSide", url: "https://krebsonsecurity.com/2021/05/a-closer-look-at-the-darkside-ransomware-gang/", type: "vendor" },
  ],
  conti: [
    { label: "CISA: Conti Ransomware Advisory", url: "https://www.cisa.gov/news-events/news/cisa-fbi-and-nsa-release-conti-ransomware-advisory-help-organizations-reduce-risk-attack", type: "cisa" },
    { label: "Wikipedia: Conti", url: "https://en.wikipedia.org/wiki/Conti_(ransomware)", type: "wiki" },
  ],
  hive: [
    { label: "CISA: #StopRansomware Hive (AA22-321A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-321a", type: "cisa" },
    { label: "Wikipedia: Hive", url: "https://en.wikipedia.org/wiki/Hive_(ransomware)", type: "wiki" },
    { label: "DOJ: Hive ransomware disrupted", url: "https://www.justice.gov/usao-mdfl/pr/us-department-justice-disrupts-hive-ransomware-variant", type: "gov" },
  ],
  clop: [
    { label: "CISA: #StopRansomware Cl0p (AA23-158A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a", type: "cisa" },
    { label: "Wikipedia: Clop", url: "https://en.wikipedia.org/wiki/Clop_(hacker_group)", type: "wiki" },
    { label: "Wikipedia: 2023 MOVEit data breach", url: "https://en.wikipedia.org/wiki/2023_MOVEit_data_breach", type: "wiki" },
  ],
  lockbit: [
    { label: "CISA: Understanding LockBit (AA23-165A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a", type: "cisa" },
    { label: "Wikipedia: LockBit", url: "https://en.wikipedia.org/wiki/LockBit", type: "wiki" },
    { label: "NCA: Operation Cronos", url: "https://www.nationalcrimeagency.gov.uk/the-nca-announces-the-disruption-of-lockbit-with-operation-cronos", type: "gov" },
    { label: "DOJ: LockBit developer charged", url: "https://www.justice.gov/usao-nj/pr/us-charges-russian-national-developing-and-operating-lockbit-ransomware", type: "gov" },
  ],
  blackcat: [
    { label: "CISA: #StopRansomware ALPHV (AA23-353A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a", type: "cisa" },
    { label: "Wikipedia: BlackCat", url: "https://en.wikipedia.org/wiki/BlackCat_(cyber_gang)", type: "wiki" },
    { label: "Wikipedia: Change Healthcare attack", url: "https://en.wikipedia.org/wiki/2024_Change_Healthcare_ransomware_attack", type: "wiki" },
  ],
  ransomhub: [
    { label: "CISA: #StopRansomware RansomHub (AA24-242A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-242a", type: "cisa" },
    { label: "The Record: RansomHub advisory", url: "https://therecord.media/agencies-warn-against-ransomhub-group", type: "vendor" },
    { label: "Group-IB: RansomHub profile", url: "https://www.group-ib.com/masked-actors/ransomhub/", type: "vendor" },
  ],
  blackbasta: [
    { label: "CISA: #StopRansomware Black Basta (AA24-131A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-131a", type: "cisa" },
    { label: "GuidePoint: Black Basta leaked chats", url: "https://www.guidepointsecurity.com/blog/breaking-basta-insights-from-black-bastas-leaked-ransomware-chats/", type: "vendor" },
  ],
  play: [
    { label: "CISA: #StopRansomware Play (AA23-352A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-352a", type: "cisa" },
    { label: "Wikipedia: Play", url: "https://en.wikipedia.org/wiki/Play_(hacker_group)", type: "wiki" },
  ],
  qilin: [
    { label: "Wikipedia: Qilin", url: "https://en.wikipedia.org/wiki/Qilin_(cybercrime_group)", type: "wiki" },
    { label: "HHS HC3: Qilin/Agenda Threat Profile", url: "https://www.hhs.gov/sites/default/files/qilin-threat-profile-tlpclear.pdf", type: "gov" },
  ],
  akira: [
    { label: "CISA: #StopRansomware Akira (AA24-109A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-109a", type: "cisa" },
    { label: "Wikipedia: Akira", url: "https://en.wikipedia.org/wiki/Akira_(ransomware)", type: "wiki" },
  ],
  gentlemen: [
    { label: "Halcyon: The Gentlemen Threat Assessment", url: "https://www.halcyon.ai/ransomware-research-reports/threat-assessment-the-gentlemen-ransomware-group", type: "vendor" },
    { label: "Analyst1: The Gentlemen Profile", url: "https://analyst1.com/threat-actors/the-gentlemen/", type: "vendor" },
  ],
};

// Per-victim incident write-ups (keyed by the exact victim label used above).
const VICTIM_LINKS = {
  "Kaseya": "https://en.wikipedia.org/wiki/Kaseya_VSA_ransomware_attack",
  "JBS Foods": "https://en.wikipedia.org/wiki/JBS_S.A._ransomware_attack",
  "Colonial Pipeline": "https://en.wikipedia.org/wiki/Colonial_Pipeline_ransomware_attack",
  "Costa Rica government": "https://en.wikipedia.org/wiki/2022_Costa_Rican_ransomware_attack",
  "Ireland HSE": "https://en.wikipedia.org/wiki/Health_Service_Executive_ransomware_attack",
  "MOVEit (600+ orgs)": "https://en.wikipedia.org/wiki/2023_MOVEit_data_breach",
  "Boeing": "https://cyberscoop.com/boeing-confirms-attempted-200-million-ransomware-extortion-attempt/",
  "Royal Mail": "https://techcrunch.com/2023/02/23/royal-mail-restores-global-shipping-weeks-after-lockbit-ransomware-attack/",
  "Change Healthcare": "https://en.wikipedia.org/wiki/2024_Change_Healthcare_ransomware_attack",
  "MGM Resorts": "https://en.wikipedia.org/wiki/2023_MGM_Resorts_cyberattack",
  "City of Oakland": "https://en.wikipedia.org/wiki/Play_(hacker_group)",
  "Rackspace": "https://www.rackspace.com/newsroom/rackspace-technology-hosted-exchange-environment-update",
  "Synnovis (NHS pathology)": "https://www.england.nhs.uk/london/synnovis-ransomware-cyber-attack/",
};

// MITRE ATT&CK technique catalog (ids → names).
const ATTACK = {
  "T1190": "Exploit Public-Facing Application",
  "T1566": "Phishing",
  "T1078": "Valid Accounts",
  "T1133": "External Remote Services",
  "T1021.001": "Remote Desktop Protocol",
  "T1195.002": "Compromise Software Supply Chain",
  "T1189": "Drive-by Compromise",
  "T1656": "Impersonation",
  "T1486": "Data Encrypted for Impact",
  "T1490": "Inhibit System Recovery",
  "T1567.002": "Exfiltration to Cloud Storage",
};

// Map each normalized initial-access tag to its ATT&CK technique(s).
const TAG_TO_ATTACK = {
  "Exploited public apps": ["T1190"],
  "File-transfer zero-days": ["T1190"],
  "Phishing": ["T1566"],
  "Stolen / VPN credentials": ["T1078", "T1133"],
  "RDP / valid accounts": ["T1021.001"],
  "Social engineering": ["T1656"],
  "Supply chain": ["T1195.002"],
  "Exploit kits": ["T1189"],
};

// Derive a group's ATT&CK techniques: initial-access (from tags) + impact.
function attackFor(g) {
  const ids = new Set();
  (TAGS[g.id] || []).forEach((t) =>
    (TAG_TO_ATTACK[t] || []).forEach((id) => ids.add(id))
  );
  ids.add("T1486"); // Data Encrypted for Impact — definitional for ransomware
  ids.add("T1490"); // Inhibit System Recovery — near-universal
  if (g.id !== "gandcrab") ids.add("T1567.002"); // double-extortion exfil (post-2019 norm)
  return [...ids].map((id) => ({
    id,
    name: ATTACK[id],
    url: `https://attack.mitre.org/techniques/${id.replace(".", "/")}/`,
  }));
}

// Free-text search across a group's notable fields + technique tags.
function matchesQuery(g, q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    g.name, g.aka, g.origin, g.summary,
    ...(g.sectors || []), ...(g.victims || []), ...(TAGS[g.id] || []),
  ].join(" ").toLowerCase();
  return hay.includes(needle);
}

// Read shareable state from the URL hash (#group=…&status=…&q=…&access=…).
function readHashState() {
  if (typeof window === "undefined") return {};
  const h = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
  return {
    group: h.get("group"),
    status: h.get("status"),
    q: h.get("q"),
    access: h.get("access"),
    view: h.get("view"),
    cmp: h.get("cmp"),
  };
}

// Validate a comma-separated id list from the hash → known ids, capped at 3.
function parseCompare(raw) {
  if (!raw) return [];
  return raw.split(",").filter((id) => GROUP_BY_ID[id]).slice(0, 3);
}

const KPIS = [
  { label: "Named groups in 2025", value: "124", sub: "+46% year-over-year", accent: C.red },
  { label: "Q1 2026 victims posted", value: "2,122", sub: "to data-leak sites", accent: C.amber },
  { label: "Top-10 concentration", value: "71%", sub: "of all Q1 2026 victims", accent: C.cyan },
  { label: "Most prolific (2025)", value: "Qilin", sub: "1,044 victims claimed", accent: C.violet },
];

const SECTOR_DATA = [
  { name: "Manufacturing", v: 22 },
  { name: "Professional svc.", v: 16 },
  { name: "Healthcare", v: 12 },
  { name: "Construction", v: 9 },
  { name: "Technology", v: 8 },
  { name: "Retail / wholesale", v: 7 },
  { name: "Finance", v: 7 },
  { name: "Government", v: 6 },
  { name: "Education", v: 5 },
  { name: "Energy", v: 4 },
];

const GROWTH_DATA = [
  { year: "2019", v: 30 },
  { year: "2020", v: 34 },
  { year: "2021", v: 44 },
  { year: "2022", v: 52 },
  { year: "2023", v: 68 },
  { year: "2024", v: 85 },
  { year: "2025", v: 124 },
];

// Pre-2018 origins — milestone-based (evenly spaced, not linearly time-scaled).
const ERAS = ["Cryptovirology", "Early crypto", "Bitcoin era", "Worm era", "RaaS dawn"];
const ERA_COLOR = {
  "Cryptovirology": C.violet,
  "Early crypto": C.slate,
  "Bitcoin era": C.cyan,
  "Worm era": C.red,
  "RaaS dawn": C.amber,
};
const ORIGINS = [
  {
    id: "aids", year: "1989", name: "AIDS Trojan", era: "Cryptovirology",
    blurb: "The first known ransomware. Biologist Joseph Popp mailed 20,000 infected floppy disks to attendees of a WHO AIDS conference. After 90 reboots it hid directories and scrambled file names, demanding $189 sent to a PO box in Panama. The symmetric encryption was reversed quickly — but the extortion blueprint was set.",
    ref: { label: "Wikipedia: AIDS (Trojan horse)", url: "https://en.wikipedia.org/wiki/AIDS_(Trojan_horse)" },
  },
  {
    id: "cryptovirology", year: "1996", name: "Cryptoviral Extortion", era: "Cryptovirology",
    blurb: "Columbia researchers Adam Young and Moti Yung formalized 'cryptoviral extortion' — using public-key cryptography so that only the attacker holds the decryption key. The paper described modern ransomware years before it was practical, and named the field cryptovirology.",
    ref: { label: "Wikipedia: Cryptovirology", url: "https://en.wikipedia.org/wiki/Cryptovirology" },
  },
  {
    id: "gpcode", year: "2005", name: "GPCode / Archiveus", era: "Early crypto",
    blurb: "GPCode (a.k.a. PGPCoder) and Archiveus brought the theory to life, encrypting victims' files with RSA keys and demanding payment. Early keys were short enough to break, but it marked the decisive shift from merely hiding files to genuinely encrypting them.",
    ref: { label: "Wikipedia: PGPCoder", url: "https://en.wikipedia.org/wiki/PGPCoder" },
  },
  {
    id: "cryptolocker", year: "2013", name: "CryptoLocker", era: "Bitcoin era",
    blurb: "The watershed. CryptoLocker paired RSA-2048 encryption with Bitcoin ransoms and the Gameover Zeus botnet for distribution, extorting millions. It proved the model was massively profitable — and was only stopped by the international Operation Tovar takedown in 2014.",
    ref: { label: "Wikipedia: CryptoLocker", url: "https://en.wikipedia.org/wiki/CryptoLocker" },
  },
  {
    id: "keranger", year: "2016", name: "Locky · Cerber · KeRanger", era: "Bitcoin era",
    blurb: "Ransomware went industrial and cross-platform: Locky's mass spam campaigns, Cerber pioneering the Ransomware-as-a-Service affiliate model, and KeRanger — the first ransomware to successfully infect Apple's macOS.",
    ref: { label: "Wikipedia: KeRanger", url: "https://en.wikipedia.org/wiki/KeRanger" },
  },
  {
    id: "wannacry", year: "2017", name: "WannaCry", era: "Worm era",
    blurb: "WannaCry weaponized the leaked NSA 'EternalBlue' exploit to self-propagate, hitting 200,000+ machines across 150 countries in days and crippling the UK's NHS. A researcher's accidental kill-switch halted it; it was later attributed to North Korea.",
    ref: { label: "Wikipedia: WannaCry ransomware attack", url: "https://en.wikipedia.org/wiki/WannaCry_ransomware_attack" },
  },
  {
    id: "notpetya", year: "2017", name: "NotPetya", era: "Worm era",
    blurb: "Weeks later, NotPetya posed as ransomware but was a destructive wiper — recovery was impossible by design. Spread via a hijacked Ukrainian tax-software update, it caused an estimated $10B in global damage (Maersk, Merck, Mondelēz) and was attributed to Russia's Sandworm.",
    ref: { label: "Wikipedia: Petya and NotPetya", url: "https://en.wikipedia.org/wiki/Petya_and_NotPetya" },
  },
  {
    id: "ryuk", year: "2018", name: "SamSam · Ryuk", era: "RaaS dawn",
    blurb: "Attackers pivoted to 'big-game hunting' — fewer targets, far bigger payouts. SamSam paralyzed the City of Atlanta, and Ryuk paired with banking-trojan botnets to demand six- and seven-figure ransoms. The stage was set for the RaaS explosion charted below.",
    ref: { label: "Wikipedia: Ryuk (ransomware)", url: "https://en.wikipedia.org/wiki/Ryuk_(ransomware)" },
  },
];
const ORIGIN_BY_ID = Object.fromEntries(ORIGINS.map((m) => [m.id, m]));

/* ----------------------------- UI bits ----------------------------- */

function StatusBadge({ status, size = "sm" }) {
  const s = STATUS[status];
  const Icon = s.icon;
  const pad = size === "lg" ? "5px 11px" : "3px 8px";
  const fs = size === "lg" ? 12 : 10.5;
  return (
    <span
      className="rs-badge"
      style={{
        color: s.color, borderColor: s.color + "55",
        background: s.color + "16", padding: pad, fontSize: fs,
      }}
    >
      <Icon size={size === "lg" ? 13 : 11} strokeWidth={2.4} />
      {s.label}
    </span>
  );
}

function Chip({ children, tone = "neutral", onClick, active, href }) {
  const map = {
    neutral: { c: C.text, b: C.line, bg: C.panel2 },
    cyan: { c: C.cyan, b: C.cyan + "44", bg: C.cyan + "12" },
    red: { c: C.red, b: C.red + "44", bg: C.red + "12" },
  };
  const m = active ? map.cyan : map[tone];
  const style = { color: m.c, borderColor: m.b, background: m.bg };
  if (href) {
    return (
      <a
        className="rs-chip rs-chip-btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <span
      className={"rs-chip" + (onClick ? " rs-chip-btn" : "")}
      onClick={onClick}
      style={style}
    >
      {children}
    </span>
  );
}

/* --------------------------- Timeline ------------------------------ */

function LineageTimeline({ groups, selected, onSelect, matchIds, filtering }) {
  const yearMin = 2018, yearMax = 2026.3;
  const VW = 1000;
  const plotX0 = 152, plotX1 = 986;
  const top = 40, rowH = 24, rowGap = 7;

  const rows = useMemo(
    () => [...groups].sort((a, b) => a.start - b.start),
    [groups]
  );
  const indexOf = Object.fromEntries(rows.map((g, i) => [g.id, i]));
  const height = top + rows.length * (rowH + rowGap) + 8;

  const xFor = (yr) =>
    plotX0 + ((yr - yearMin) / (yearMax - yearMin)) * (plotX1 - plotX0);
  const yMid = (i) => top + i * (rowH + rowGap) + rowH / 2;

  const years = [];
  for (let y = 2018; y <= 2026; y++) years.push(y);

  // lineage edges (parent -> child)
  const edges = [];
  rows.forEach((g) => {
    g.children.forEach((cid) => {
      if (indexOf[cid] != null) edges.push({ from: g.id, to: cid });
    });
  });

  const sel = selected;
  const edgeActive = (e) => sel && (e.from === sel || e.to === sel);

  return (
    <svg
      viewBox={`0 0 ${VW} ${height}`}
      width="100%"
      role="img"
      aria-label="Ransomware group lineage and lifespan timeline"
      style={{ display: "block" }}
    >
      {/* year gridlines + labels */}
      {years.map((y) => {
        const x = xFor(y);
        return (
          <g key={y}>
            <line x1={x} y1={top - 8} x2={x} y2={height - 6}
              stroke={C.lineSoft} strokeWidth={1} />
            <text x={x} y={top - 14} fill={C.faint} fontSize="11"
              textAnchor="middle" fontFamily="ui-monospace, monospace">
              {y}
            </text>
          </g>
        );
      })}

      {/* lineage connectors (under bars) */}
      {edges.map((e, i) => {
        const pg = GROUP_BY_ID[e.from], cg = GROUP_BY_ID[e.to];
        const x1 = xFor(pg.end), y1 = yMid(indexOf[e.from]);
        const x2 = xFor(cg.start), y2 = yMid(indexOf[e.to]);
        const mx = (x1 + x2) / 2;
        const on = edgeActive(e);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={on ? C.cyan : C.faint}
            strokeWidth={on ? 1.8 : 1}
            strokeDasharray="3 3"
            opacity={on ? 0.95 : 0.22}
          />
        );
      })}

      {/* rows */}
      {rows.map((g, i) => {
        const x1 = xFor(g.start), x2 = xFor(g.end);
        const y = top + i * (rowH + rowGap);
        const isSel = sel === g.id;
        const col = STATUS[g.status].color;
        const dim = filtering && matchIds && !matchIds.has(g.id);
        return (
          <g
            key={g.id}
            className="rs-trow"
            onClick={() => onSelect(g.id)}
            style={{ cursor: "pointer" }}
          >
            <title>{`${g.name} — ${STATUS[g.status].label}`}</title>
            {/* hit area */}
            <rect x={0} y={y - 2} width={VW} height={rowH + 4} fill="transparent" />
            {/* label */}
            <text
              x={plotX0 - 10} y={y + rowH / 2 + 4}
              fill={isSel ? C.cyan : C.text} fontSize="12"
              textAnchor="end" fontFamily="ui-monospace, monospace"
              fontWeight={isSel ? 700 : 500}
              opacity={dim ? 0.28 : 1}
            >
              {g.name}
            </text>
            {/* bar */}
            <rect
              x={x1} y={y} width={Math.max(x2 - x1, 6)} height={rowH} rx={5}
              fill={col} opacity={dim ? 0.12 : isSel ? 0.95 : 0.7}
              stroke={isSel ? C.cyan : "none"} strokeWidth={isSel ? 2 : 0}
            />
            {/* disruption marker */}
            {g.disruptAt && (
              <line
                x1={xFor(g.disruptAt)} y1={y - 2}
                x2={xFor(g.disruptAt)} y2={y + rowH + 2}
                stroke={C.text} strokeWidth={1.5} strokeDasharray="2 2"
                opacity={dim ? 0.2 : 0.85}
              />
            )}
            {/* active arrow */}
            {g.status === "active" && (
              <polygon
                points={`${x2 + 2},${y + rowH / 2} ${x2 - 5},${y + 4} ${x2 - 5},${y + rowH - 4}`}
                fill={col} opacity={dim ? 0.12 : isSel ? 1 : 0.85}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------- Lineage graph --------------------------- */

// Layered DAG layout: x = generation (longest path from a root), y = stacked.
function lineageLayout() {
  const depth = {};
  const resolve = (id, seen) => {
    if (depth[id] != null) return depth[id];
    if (seen.has(id)) return 0;
    seen.add(id);
    const g = GROUP_BY_ID[id];
    const ps = g.parents.filter((p) => GROUP_BY_ID[p]);
    const v = ps.length ? 1 + Math.max(...ps.map((p) => resolve(p, seen))) : 0;
    return (depth[id] = v);
  };
  GROUPS.forEach((g) => resolve(g.id, new Set()));

  const connected = GROUPS.filter((g) => g.parents.length || g.children.length);
  const isolated = GROUPS.filter((g) => !g.parents.length && !g.children.length);

  const NW = 124, NH = 34, COLX = 158, ROWY = 52, X0 = 14, Y0 = 38;
  const cols = {};
  connected.forEach((g) => (cols[depth[g.id]] = cols[depth[g.id]] || []).push(g));
  Object.values(cols).forEach((c) => c.sort((a, b) => a.start - b.start));

  const pos = {};
  Object.entries(cols).forEach(([d, list]) =>
    list.forEach((g, i) => {
      pos[g.id] = { x: X0 + Number(d) * COLX, y: Y0 + i * ROWY };
    })
  );

  const maxCol = Math.max(...connected.map((g) => depth[g.id]), 0);
  const maxRows = Math.max(...Object.values(cols).map((c) => c.length), 1);
  const connectedBottom = Y0 + maxRows * ROWY;

  // Isolated nodes go in a labeled strip beneath the tree.
  const isoY = connectedBottom + 30;
  isolated.forEach((g, i) => {
    pos[g.id] = { x: X0 + i * COLX, y: isoY };
  });

  const edges = [];
  connected.forEach((g) =>
    g.children.forEach((cid) => {
      if (pos[cid]) edges.push({ from: g.id, to: cid });
    })
  );

  const width = X0 + maxCol * COLX + NW + 16;
  const height = isoY + (isolated.length ? NH + 16 : 0);
  return { pos, edges, connected, isolated, NW, NH, width, height, isoY, X0 };
}

const LINEAGE = lineageLayout();

function LineageGraph({ selected, onSelect, matchIds, filtering }) {
  const { pos, edges, connected, isolated, NW, NH, width, height, isoY, X0 } = LINEAGE;

  const node = (g) => {
    const p = pos[g.id];
    const isSel = selected === g.id;
    const dim = filtering && matchIds && !matchIds.has(g.id);
    const col = STATUS[g.status].color;
    return (
      <g
        key={g.id}
        onClick={() => onSelect(g.id)}
        style={{ cursor: "pointer" }}
        opacity={dim ? 0.18 : 1}
      >
        <title>{`${g.name} — ${STATUS[g.status].label}`}</title>
        <rect
          x={p.x} y={p.y} width={NW} height={NH} rx={8}
          fill={isSel ? col + "26" : C.panel2}
          stroke={isSel ? C.cyan : col + "99"} strokeWidth={isSel ? 2 : 1.3}
        />
        <circle cx={p.x + 13} cy={p.y + NH / 2} r={4} fill={col} />
        <text
          x={p.x + 24} y={p.y + NH / 2 + 4}
          fill={isSel ? C.cyan : C.text} fontSize="12"
          fontFamily="ui-monospace, monospace" fontWeight={isSel ? 700 : 500}
        >
          {g.name}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label="Ransomware group lineage graph"
      style={{ display: "block" }}
    >
      {/* edges parent -> child */}
      {edges.map((e, i) => {
        const a = pos[e.from], b = pos[e.to];
        const x1 = a.x + NW, y1 = a.y + NH / 2;
        const x2 = b.x, y2 = b.y + NH / 2;
        const mx = (x1 + x2) / 2;
        const on = selected && (e.from === selected || e.to === selected);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={on ? C.cyan : C.faint}
            strokeWidth={on ? 2 : 1.2}
            opacity={on ? 0.95 : 0.4}
            markerEnd=""
          />
        );
      })}
      {connected.map(node)}
      {isolated.length > 0 && (
        <text
          x={X0} y={isoY - 10} fill={C.faint} fontSize="10.5"
          fontFamily="ui-monospace, monospace" letterSpacing="0.5"
        >
          INDEPENDENT · NO KNOWN LINEAGE
        </text>
      )}
      {isolated.map(node)}
    </svg>
  );
}

/* --------------------------- Detail panel -------------------------- */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(yr) {
  if (yr >= 2026) return "present";
  const y = Math.floor(yr);
  const m = Math.round((yr - y) * 12);
  return m > 0 ? `${MONTHS[Math.min(m, 11)]} ${y}` : `${y}`;
}

function Field({ icon: Icon, label, children, wide }) {
  return (
    <div className="rs-field" style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <div className="rs-field-h">
        <Icon size={13} strokeWidth={2.2} style={{ color: C.cyan }} />
        <span>{label}</span>
      </div>
      <div className="rs-field-b">{children}</div>
    </div>
  );
}

function DetailPanel({ group, onSelect }) {
  if (!group) {
    return (
      <div className="rs-detail rs-detail-empty">
        <Radar size={30} style={{ color: C.faint }} strokeWidth={1.6} />
        <p>Select a group from the roster or timeline to load its profile.</p>
      </div>
    );
  }
  const fmt = fmtDate;
  const lineage = [
    ...group.parents.map((p) => ({ g: GROUP_BY_ID[p], rel: "from" })),
    ...group.children.map((c) => ({ g: GROUP_BY_ID[c], rel: "to" })),
  ].filter((x) => x.g);

  return (
    <div className="rs-detail">
      <div className="rs-detail-top">
        <div>
          <div className="rs-detail-name">{group.name}</div>
          <div className="rs-detail-aka">
            {group.aka !== "—" ? `aka ${group.aka} · ` : ""}{group.origin}
          </div>
        </div>
        <StatusBadge status={group.status} size="lg" />
      </div>

      <div className="rs-detail-meta">
        <span>{fmt(group.start)} → {fmt(group.end)}</span>
        <span className="rs-dot">•</span>
        <span style={{ color: C.text }}>{group.peak}</span>
      </div>

      <p className="rs-detail-summary">{group.summary}</p>

      <div className="rs-detail-grid">
        <Field icon={KeyRound} label="INITIAL ACCESS">
          <div className="rs-chiprow">
            {group.access.map((a) => <Chip key={a}>{a}</Chip>)}
          </div>
        </Field>
        <Field icon={Building2} label="TARGETED SECTORS">
          <div className="rs-chiprow">
            {group.sectors.map((s) => <Chip key={s}>{s}</Chip>)}
          </div>
        </Field>
        <Field icon={Lock} label="ENCRYPTION">
          <span>{group.encryption}</span>
        </Field>
        <Field icon={Banknote} label="RANSOM PROFILE">
          <span>{group.ransom}</span>
        </Field>
        <Field icon={Crosshair} label="NOTABLE VICTIMS">
          <div className="rs-chiprow">
            {group.victims.map((v) => {
              const href = VICTIM_LINKS[v];
              return href ? (
                <Chip key={v} tone="red" href={href}>
                  <ExternalLink size={10} style={{ marginRight: 4, opacity: 0.8 }} />{v}
                </Chip>
              ) : (
                <Chip key={v} tone="red">{v}</Chip>
              );
            })}
          </div>
        </Field>
        {lineage.length > 0 && (
          <Field icon={GitBranch} label="LINEAGE">
            <div className="rs-chiprow">
              {lineage.map(({ g, rel }) => (
                <Chip key={g.id + rel} tone="cyan" onClick={() => onSelect(g.id)}>
                  {rel === "from" ? "↰ " : "↳ "}{g.name}
                </Chip>
              ))}
            </div>
          </Field>
        )}
        <Field icon={Target} label="MITRE ATT&CK TECHNIQUES" wide>
          <div className="rs-chiprow">
            {attackFor(group).map((t) => (
              <a
                key={t.id}
                className="rs-attack"
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${t.id} · ${t.name}`}
              >
                <span className="rs-attack-id">{t.id}</span>
                <span className="rs-attack-name">{t.name}</span>
              </a>
            ))}
          </div>
        </Field>
        {REFS[group.id]?.length > 0 && (
          <Field icon={FileText} label="SOURCES / FURTHER READING" wide>
            <div className="rs-chiprow">
              {REFS[group.id].map((r) => (
                <Chip key={r.url} tone="cyan" href={r.url}>
                  <ExternalLink size={10} style={{ marginRight: 5, opacity: 0.85 }} />{r.label}
                </Chip>
              ))}
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Compare panel ------------------------- */

function ComparePanel({ groups, onSelect, onRemove, onClear }) {
  if (groups.length < 2) return null;
  const cols = `170px repeat(${groups.length}, minmax(190px, 1fr))`;
  const plainChips = (items) => (
    <div className="rs-chiprow">
      {(items || []).map((x) => (
        <span key={x} className="rs-chip"
          style={{ color: C.text, borderColor: C.line, background: C.panel2 }}>
          {x}
        </span>
      ))}
    </div>
  );
  const rows = [
    { label: "Active", cell: (g) => `${fmtDate(g.start)} → ${fmtDate(g.end)}` },
    { label: "Origin", cell: (g) => g.origin },
    { label: "Signature moment", cell: (g) => g.peak },
    { label: "Initial access", cell: (g) => plainChips(TAGS[g.id]) },
    { label: "Targeted sectors", cell: (g) => plainChips(g.sectors) },
    { label: "Encryption", cell: (g) => g.encryption },
    { label: "Ransom profile", cell: (g) => g.ransom },
    {
      label: "Notable victims",
      cell: (g) => (
        <div className="rs-chiprow">
          {g.victims.map((v) => (
            <Chip key={v} tone="red" href={VICTIM_LINKS[v]}>{v}</Chip>
          ))}
        </div>
      ),
    },
    {
      label: "MITRE ATT&CK",
      cell: (g) => (
        <div className="rs-chiprow">
          {attackFor(g).map((t) => (
            <a key={t.id} className="rs-attack" href={t.url} target="_blank"
              rel="noopener noreferrer" title={`${t.id} · ${t.name}`}>
              <span className="rs-attack-id">{t.id}</span>
            </a>
          ))}
        </div>
      ),
    },
    {
      label: "Lineage",
      cell: (g) => {
        const lin = [
          ...g.parents.map((p) => ({ g: GROUP_BY_ID[p], rel: "from" })),
          ...g.children.map((c) => ({ g: GROUP_BY_ID[c], rel: "to" })),
        ].filter((x) => x.g);
        if (!lin.length) return <span className="rs-cmp-muted">—</span>;
        return (
          <div className="rs-chiprow">
            {lin.map(({ g: lg, rel }) => (
              <Chip key={lg.id + rel} tone="cyan" onClick={() => onSelect(lg.id)}>
                {rel === "from" ? "↰ " : "↳ "}{lg.name}
              </Chip>
            ))}
          </div>
        );
      },
    },
  ];
  return (
    <section className="rs-card rs-compare">
      <div className="rs-card-h rs-th">
        <span>
          <ArrowLeftRight size={14} strokeWidth={2.2} style={{ color: C.cyan }} />{" "}
          COMPARE — {groups.length} GROUPS
        </span>
        <button className="rs-filter" onClick={onClear}>CLEAR ALL</button>
      </div>
      <div className="rs-cmp-scroll">
        <div className="rs-cmp-grid" style={{ gridTemplateColumns: cols }}>
          <div className="rs-cmp-corner" />
          {groups.map((g) => (
            <div className="rs-cmp-head" key={g.id}>
              <div className="rs-cmp-head-top">
                <button className="rs-cmp-name" onClick={() => onSelect(g.id)}
                  title="View full profile">{g.name}</button>
                <button className="rs-cmp-x" onClick={() => onRemove(g.id)}
                  aria-label={`Remove ${g.name}`}><X size={13} /></button>
              </div>
              <StatusBadge status={g.status} />
            </div>
          ))}
          {rows.map((row) => (
            <React.Fragment key={row.label}>
              <div className="rs-cmp-label">{row.label}</div>
              {groups.map((g) => (
                <div className="rs-cmp-cell" key={g.id}>{row.cell(g)}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Charts ------------------------------ */

function ChartCard({ title, note, children, h = 220 }) {
  return (
    <div className="rs-card">
      <div className="rs-card-h">{title}</div>
      <div style={{ height: h }}>{children}</div>
      {note && <div className="rs-card-note">{note}</div>}
    </div>
  );
}

function chartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: C.ink, border: `1px solid ${C.line}`, borderRadius: 6,
      padding: "6px 10px", fontSize: 12, color: C.text,
      fontFamily: "ui-monospace, monospace",
    }}>
      <div style={{ color: C.muted }}>{label}</div>
      <div style={{ color: C.cyan }}>{payload[0].value}</div>
    </div>
  );
}

/* --------------------------- Origins strip ------------------------- */

function OriginsStrip() {
  const [sel, setSel] = useState("aids");
  const m = ORIGIN_BY_ID[sel];
  return (
    <section className="rs-card rs-origins">
      <div className="rs-card-h rs-th">
        <span>
          <History size={14} strokeWidth={2.2} style={{ color: C.cyan }} />{" "}
          ORIGINS — 35 YEARS OF RANSOMWARE
        </span>
        <div className="rs-legend">
          {ERAS.map((e) => (
            <span key={e}><i style={{ background: ERA_COLOR[e] }} /> {e}</span>
          ))}
        </div>
      </div>
      <div className="rs-hint">
        From the 1989 AIDS Trojan to the dawn of Ransomware-as-a-Service. Click a milestone — the modern RaaS era continues below.
      </div>
      <div className="rs-mile-track">
        <div className="rs-mile-line" />
        {ORIGINS.map((o) => {
          const on = sel === o.id;
          return (
            <button
              key={o.id}
              className={"rs-mile" + (on ? " on" : "")}
              onClick={() => setSel(o.id)}
            >
              <span
                className="rs-mile-dot"
                style={{
                  background: ERA_COLOR[o.era],
                  boxShadow: on ? `0 0 0 4px ${C.cyan}33` : "none",
                  borderColor: on ? C.cyan : C.ink,
                }}
              />
              <span className="rs-mile-year">{o.year}</span>
              <span className="rs-mile-name">{o.name}</span>
            </button>
          );
        })}
        <span className="rs-mile-end">2018+ →</span>
      </div>
      <div className="rs-mile-detail">
        <div className="rs-mile-detail-h">
          <span className="rs-mile-detail-year" style={{ color: ERA_COLOR[m.era] }}>{m.year}</span>
          <span className="rs-mile-detail-name">{m.name}</span>
          <span
            className="rs-mile-era"
            style={{
              color: ERA_COLOR[m.era], borderColor: ERA_COLOR[m.era] + "55",
              background: ERA_COLOR[m.era] + "16",
            }}
          >
            {m.era}
          </span>
        </div>
        <p className="rs-mile-blurb">{m.blurb}</p>
        <Chip tone="cyan" href={m.ref.url}>
          <ExternalLink size={10} style={{ marginRight: 5, opacity: 0.85 }} />{m.ref.label}
        </Chip>
      </div>
    </section>
  );
}

/* ----------------------------- Live feed --------------------------- */

// Shared live-feed state — consumed by both the header badge and the section.
function useLiveFeed() {
  const [s, setS] = useState({ loading: true, error: null, data: null, updated: null });

  const load = (force) => {
    if (!WORKER_URL) {
      setS({ loading: false, error: null, data: null, updated: null });
      return;
    }
    setS((p) => ({ ...p, loading: true, error: null }));
    const url = force ? WORKER_URL + (WORKER_URL.includes("?") ? "&" : "?") + "nocache=1" : WORKER_URL;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (d.status !== "success") throw new Error(d.message || "feed error");
        setS({ loading: false, error: null, data: d.data, updated: d.lastUpdated });
      })
      .catch((e) => setS({ loading: false, error: e.message, data: null, updated: null }));
  };

  useEffect(() => { load(); }, []);
  return [s, load];
}

// Freshness helper: true if the feed was compiled within the last 20 minutes.
function feedFresh(updated) {
  if (!updated) return false;
  return (Date.now() - new Date(updated).getTime()) / 60000 < 20;
}

function LiveFeed({ s, onRefresh }) {
  // Not configured yet — show a setup hint instead of a broken section.
  if (!WORKER_URL) {
    return (
      <section className="rs-card rs-live">
        <div className="rs-card-h"><Rss size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> LIVE THREAT FEED</div>
        <div className="rs-live-setup">
          Not connected yet. Deploy the Cloudflare Worker in <code>worker/</code>, then paste its
          URL into <code>src/config.js</code> and push. See <code>worker/README.md</code> for steps.
        </div>
      </section>
    );
  }

  const vulns = s.data?.vulnerabilities || [];
  const victims = s.data?.recentVictims || [];
  const actors = s.data?.threatActors || [];
  const fresh = feedFresh(s.updated);

  return (
    <section className="rs-card rs-live">
      <div className="rs-card-h rs-th">
        <span><Rss size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> LIVE THREAT FEED</span>
        <div className="rs-live-meta">
          {s.updated && !s.error && (
            <span className="rs-live-fresh" style={{ color: fresh ? C.green : C.amber }}>
              <i
                className={fresh ? "rs-livedot" : ""}
                style={{
                  background: fresh ? C.green : C.amber,
                  boxShadow: fresh ? `0 0 6px ${C.green}` : "none",
                }}
              />
              compiled {new Date(s.updated).toLocaleString()}
            </span>
          )}
          <button className="rs-live-refresh" onClick={() => onRefresh(true)} disabled={s.loading}
            title="Refresh" aria-label="Refresh live feed">
            <RefreshCw size={13} className={s.loading ? "rs-spin" : ""} />
          </button>
        </div>
      </div>

      {s.loading && (
        <div className="rs-live-state">📡 Connecting to live intelligence feeds…</div>
      )}
      {s.error && !s.loading && (
        <div className="rs-live-state rs-live-err">
          ⚠️ Could not load live data: {s.error}{" "}
          <button className="rs-filter" onClick={load}>RETRY</button>
        </div>
      )}

      {!s.loading && !s.error && (
        <div className="rs-live-grid">
          <div className="rs-live-col">
            <div className="rs-live-h"><AlertTriangle size={13} /> Ransomware-linked CVEs <span className="rs-live-src">CISA KEV</span></div>
            {vulns.length === 0 ? (
              <div className="rs-live-empty">No items returned.</div>
            ) : vulns.map((v) => (
              <a key={v.cve} className="rs-live-item"
                href={`https://nvd.nist.gov/vuln/detail/${v.cve}`}
                target="_blank" rel="noopener noreferrer">
                <div className="rs-live-item-top">
                  <span className="rs-live-cve">{v.cve}</span>
                  <span className="rs-live-date">{v.dateAdded}</span>
                </div>
                <div className="rs-live-item-sub">
                  <strong>{v.vendor} {v.product}</strong> — {v.name}
                </div>
              </a>
            ))}
          </div>

          <div className="rs-live-col">
            <div className="rs-live-h"><Crosshair size={13} /> Recent leak-site victims <span className="rs-live-src">ransomware.live</span></div>
            {victims.length === 0 ? (
              <div className="rs-live-empty">No items returned.</div>
            ) : victims.map((v, i) => (
              <a key={(v.url || v.victim) + i} className="rs-live-item"
                href={v.url || undefined}
                target="_blank" rel="noopener noreferrer">
                <div className="rs-live-item-top">
                  <span className="rs-live-sig">{v.victim}</span>
                  <span className="rs-live-date">{v.date}</span>
                </div>
                <div className="rs-live-item-sub">
                  <strong>{v.group}</strong>
                  {v.sector ? ` · ${v.sector}` : ""}{v.country ? ` · ${v.country}` : ""}
                </div>
              </a>
            ))}
          </div>

          <div className="rs-live-col">
            <div className="rs-live-h"><Radar size={13} /> Threat-actor pulses <span className="rs-live-src">AlienVault OTX</span></div>
            {actors.length === 0 ? (
              <div className="rs-live-empty">No items returned (subscribe to OTX pulses to populate).</div>
            ) : actors.map((a, i) => (
              <a key={(a.id || a.name) + i} className="rs-live-item"
                href={a.id ? `https://otx.alienvault.com/pulse/${a.id}` : undefined}
                target="_blank" rel="noopener noreferrer">
                <div className="rs-live-item-sub">
                  <strong style={{ color: C.cyan }}>{a.name}</strong>
                </div>
                <div className="rs-live-item-top" style={{ marginTop: 4 }}>
                  <span className="rs-live-date">
                    {typeof a.indicators === "number" ? `${a.indicators} IOCs` : "OTX pulse"}
                  </span>
                  <span className="rs-live-date">{a.modified}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="rs-card-note">
        Live, unverified machine feeds — distinct from the curated intelligence above. Sources: CISA KEV · ransomware.live · AlienVault OTX.
      </div>
    </section>
  );
}

/* ------------------------------ App -------------------------------- */

export default function RansomScope() {
  // Initialize from the URL hash so deep-links restore the full view.
  const init = readHashState();
  const [selected, setSelected] = useState(
    init.group && GROUP_BY_ID[init.group] ? init.group : "qilin"
  );
  const [filter, setFilter] = useState(
    ["active", "disrupted", "defunct"].includes(init.status) ? init.status : "all"
  );
  const [query, setQuery] = useState(init.q || "");
  const [facet, setFacet] = useState(
    ACCESS_TAGS.includes(init.access) ? init.access : null
  );
  const [view, setView] = useState(init.view === "lineage" ? "lineage" : "timeline");
  const [compareIds, setCompareIds] = useState(() => parseCompare(init.cmp));
  const [live, loadLive] = useLiveFeed();
  const liveFresh = feedFresh(live.updated);

  const toggleCompare = (id) =>
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 3 ? prev : [...prev, id]
    );

  // Write current state to the URL hash (replaceState → no history spam).
  useEffect(() => {
    const p = new URLSearchParams();
    if (selected) p.set("group", selected);
    if (filter !== "all") p.set("status", filter);
    if (query.trim()) p.set("q", query.trim());
    if (facet) p.set("access", facet);
    if (view !== "timeline") p.set("view", view);
    if (compareIds.length) p.set("cmp", compareIds.join(","));
    const qs = p.toString();
    const newHash = qs ? "#" + qs : "";
    if (newHash !== window.location.hash) {
      window.history.replaceState(
        null, "", window.location.pathname + window.location.search + newHash
      );
    }
  }, [selected, filter, query, facet, view, compareIds]);

  // Respond to manual hash edits / back-forward navigation.
  useEffect(() => {
    const onHash = () => {
      const s = readHashState();
      if (s.group && GROUP_BY_ID[s.group]) setSelected(s.group);
      setFilter(["active", "disrupted", "defunct"].includes(s.status) ? s.status : "all");
      setQuery(s.q || "");
      setFacet(ACCESS_TAGS.includes(s.access) ? s.access : null);
      setView(s.view === "lineage" ? "lineage" : "timeline");
      setCompareIds(parseCompare(s.cmp));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const filtered = useMemo(
    () =>
      GROUPS.filter(
        (g) =>
          (filter === "all" || g.status === filter) &&
          (!facet || (TAGS[g.id] || []).includes(facet)) &&
          matchesQuery(g, query)
      ),
    [filter, facet, query]
  );
  const filteredIds = useMemo(() => new Set(filtered.map((g) => g.id)), [filtered]);
  const filtering = filter !== "all" || !!facet || query.trim() !== "";
  const group = selected ? GROUP_BY_ID[selected] : null;

  const statusCounts = useMemo(() => {
    const c = { active: 0, disrupted: 0, defunct: 0 };
    GROUPS.forEach((g) => c[g.status]++);
    return [
      { name: "Active", key: "active", value: c.active, color: C.red },
      { name: "Disrupted", key: "disrupted", value: c.disrupted, color: C.amber },
      { name: "Defunct", key: "defunct", value: c.defunct, color: C.slate },
    ];
  }, []);

  return (
    <div className="rs-root">
      <style>{css}</style>

      {/* header */}
      <header className="rs-header">
        <div className="rs-brand">
          <div className="rs-logo"><Radar size={20} strokeWidth={2.2} /></div>
          <div>
            <h1>RANSOMSCOPE</h1>
            <div className="rs-tag">Threat Actor Intelligence Console</div>
          </div>
        </div>
        <div className="rs-asof">
          {WORKER_URL && live.updated && !live.error ? (
            <>
              <span className="rs-pulse" style={{ "--pc": liveFresh ? C.green : C.amber }} />
              LIVE FEED · compiled {new Date(live.updated).toLocaleString()}
            </>
          ) : (
            <><span className="rs-pulse" /> LIVE FEED · {live.loading ? "connecting…" : "compiled June 2026"}</>
          )}
        </div>
      </header>

      {/* KPIs */}
      <section className="rs-kpis">
        {KPIS.map((k) => (
          <div className="rs-kpi" key={k.label}>
            <div className="rs-kpi-bar" style={{ background: k.accent }} />
            <div className="rs-kpi-val" style={{ color: k.accent }}>{k.value}</div>
            <div className="rs-kpi-label">{k.label}</div>
            <div className="rs-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </section>

      {/* origins (pre-2018) */}
      <OriginsStrip />

      {/* timeline */}
      <section className="rs-card rs-timeline-card">
        <div className="rs-card-h rs-th">
          <span><Activity size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> EVOLUTION &amp; LINEAGE — 2018 to present</span>
          <div className="rs-th-right">
            <div className="rs-viewtoggle">
              <button
                className={"rs-vt" + (view === "timeline" ? " on" : "")}
                onClick={() => setView("timeline")}
              >
                <Activity size={12} /> Timeline
              </button>
              <button
                className={"rs-vt" + (view === "lineage" ? " on" : "")}
                onClick={() => setView("lineage")}
              >
                <GitBranch size={12} /> Lineage
              </button>
            </div>
            <div className="rs-legend">
              <span><i style={{ background: C.red }} /> Active</span>
              <span><i style={{ background: C.amber }} /> Disrupted</span>
              <span><i style={{ background: C.slate }} /> Defunct</span>
            </div>
          </div>
        </div>
        <div className="rs-hint">
          {view === "timeline"
            ? "Click a group to trace its ancestry — dashed lines mark rebrands and where affiliates fled after takedowns."
            : "Family tree of rebrands and affiliate spin-offs. Arrows point parent → successor; columns are generations. Click any node."}
        </div>
        <div className="rs-facetbar">
          <span className="rs-facetbar-label"><KeyRound size={12} /> HIGHLIGHT BY INITIAL ACCESS</span>
          {ACCESS_TAGS.map((t) => {
            const n = GROUPS.filter((g) => (TAGS[g.id] || []).includes(t)).length;
            return (
              <button
                key={t}
                className={"rs-facet" + (facet === t ? " on" : "")}
                onClick={() => setFacet(facet === t ? null : t)}
                aria-pressed={facet === t}
              >
                {t} <span className="rs-facet-n">{n}</span>
              </button>
            );
          })}
          {facet && (
            <button className="rs-facet rs-facet-clear" onClick={() => setFacet(null)}>
              <X size={11} /> Clear
            </button>
          )}
        </div>
        {view === "timeline" ? (
          <LineageTimeline
            groups={GROUPS}
            selected={selected}
            onSelect={setSelected}
            matchIds={filteredIds}
            filtering={filtering}
          />
        ) : (
          <LineageGraph
            selected={selected}
            onSelect={setSelected}
            matchIds={filteredIds}
            filtering={filtering}
          />
        )}
      </section>

      {/* roster + detail */}
      <section className="rs-main">
        <div className="rs-roster">
          <div className="rs-roster-h">
            <div className="rs-roster-title">
              <span>ROSTER</span>
              <span className="rs-roster-count">{filtered.length}/{GROUPS.length}</span>
            </div>
            <div className="rs-search">
              <Search size={13} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search groups, victims, sectors…"
                aria-label="Search groups"
              />
              {query && (
                <button className="rs-search-x" onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="rs-filters">
              {["all", "active", "disrupted", "defunct"].map((f) => (
                <button
                  key={f}
                  className={"rs-filter" + (filter === f ? " on" : "")}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "ALL" : STATUS[f].label}
                </button>
              ))}
            </div>
          </div>
          <div className="rs-roster-list">
            {filtered.length === 0 ? (
              <div className="rs-empty">No groups match these filters.</div>
            ) : (
              filtered.map((g) => {
                const inCmp = compareIds.includes(g.id);
                const atCap = compareIds.length >= 3 && !inCmp;
                return (
                  <div
                    key={g.id}
                    className={"rs-rcard" + (selected === g.id ? " on" : "")}
                  >
                    <button className="rs-rcard-main" onClick={() => setSelected(g.id)}>
                      <span className="rs-rdot" style={{ background: STATUS[g.status].color }} />
                      <span className="rs-rname">{g.name}</span>
                      <span className="rs-ryears">
                        {Math.floor(g.start)}–{g.end >= 2026 ? "now" : Math.floor(g.end)}
                      </span>
                    </button>
                    <button
                      className={"rs-rcmp" + (inCmp ? " on" : "")}
                      onClick={() => toggleCompare(g.id)}
                      disabled={atCap}
                      aria-pressed={inCmp}
                      title={
                        inCmp ? "Remove from comparison"
                          : atCap ? "Comparison full (max 3)"
                          : "Add to comparison"
                      }
                    >
                      {inCmp ? <Check size={13} /> : <Plus size={13} />}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <DetailPanel group={group} onSelect={setSelected} />
      </section>

      {/* comparison */}
      <ComparePanel
        groups={compareIds.map((id) => GROUP_BY_ID[id]).filter(Boolean)}
        onSelect={setSelected}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
      />

      {/* charts */}
      <section className="rs-charts">
        <ChartCard
          title="GROUP PROLIFERATION → CONSOLIDATION"
          note="Distinct named groups tracked per year. A record 124 in 2025; yet by Q1 2026, 71% of victims came from just 10 operators."
          h={210}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GROWTH_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <XAxis dataKey="year" stroke={C.muted} fontSize={11}
                tickLine={false} axisLine={{ stroke: C.line }} />
              <YAxis stroke={C.muted} fontSize={11}
                tickLine={false} axisLine={false} />
              <Tooltip content={chartTooltip} cursor={{ fill: C.panel2 }} />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {GROWTH_DATA.map((d, i) => (
                  <Cell key={i} fill={i === GROWTH_DATA.length - 1 ? C.red : C.cyan} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="TOP TARGETED SECTORS"
          note="Approximate share of victims across the ecosystem. Manufacturing and professional services lead due to low tolerance for downtime."
          h={210}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={SECTOR_DATA}
              margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke={C.muted}
                fontSize={10.5} width={104} tickLine={false}
                axisLine={false} />
              <Tooltip content={chartTooltip} cursor={{ fill: C.panel2 }} />
              <Bar dataKey="v" radius={[0, 4, 4, 0]} fill={C.violet} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="OPERATIONAL STATUS"
          note={`Of ${GROUPS.length} tracked groups. Takedowns and exit scams thin the field, but survivors absorb the displaced.`}
          h={210}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={42} outerRadius={70}
                paddingAngle={3} stroke="none">
                {statusCounts.map((s) => <Cell key={s.key} fill={s.color} />)}
              </Pie>
              <Tooltip content={chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="rs-donut-legend">
            {statusCounts.map((s) => (
              <span key={s.key}>
                <i style={{ background: s.color }} /> {s.name} · {s.value}
              </span>
            ))}
          </div>
        </ChartCard>
      </section>

      {/* live feed (Cloudflare Worker proxy) */}
      <LiveFeed s={live} onRefresh={loadLive} />

      <footer className="rs-footer">
        <span>SOURCES — GuidePoint/GRIT · Check Point Research · CISA/FBI advisories · Chainalysis · DOJ &amp; Europol · vendor IR reporting.</span>
        <span>Figures are reported/approximate and compiled for educational use. Not operational intelligence.</span>
      </footer>
    </div>
  );
}

const css = `
.rs-root{
  --ink:${C.ink};
  background:radial-gradient(1200px 600px at 80% -10%, #131A28 0%, ${C.ink} 60%);
  color:${C.text}; min-height:100%; padding:22px;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-size:14px; line-height:1.5;
}
.rs-root *{box-sizing:border-box;}

.rs-header{display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;gap:12px;margin-bottom:18px;}
.rs-brand{display:flex;align-items:center;gap:13px;}
.rs-logo{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;
  background:${C.red}1a;color:${C.red};border:1px solid ${C.red}44;}
.rs-header h1{margin:0;font-size:21px;letter-spacing:3px;font-weight:800;}
.rs-tag{color:${C.muted};font-size:11.5px;letter-spacing:1.5px;text-transform:uppercase;
  font-family:ui-monospace,monospace;margin-top:1px;}
.rs-asof{color:${C.muted};font-size:11px;letter-spacing:1px;
  font-family:ui-monospace,monospace;display:flex;align-items:center;gap:8px;
  border:1px solid ${C.line};border-radius:20px;padding:6px 13px;background:${C.panel};}
.rs-pulse{--pc:${C.red};width:7px;height:7px;border-radius:50%;background:var(--pc);
  box-shadow:0 0 0 0 var(--pc);animation:rspulse 2s infinite;}
@keyframes rspulse{0%{box-shadow:0 0 0 0 var(--pc);}70%{box-shadow:0 0 0 7px transparent;}100%{box-shadow:0 0 0 0 transparent;}}

.rs-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px;}
.rs-kpi{position:relative;background:${C.panel};border:1px solid ${C.line};
  border-radius:12px;padding:15px 16px 14px;overflow:hidden;}
.rs-kpi-bar{position:absolute;left:0;top:0;bottom:0;width:3px;}
.rs-kpi-val{font-size:25px;font-weight:800;letter-spacing:0.5px;line-height:1;}
.rs-kpi-label{margin-top:7px;font-size:11.5px;color:${C.text};font-weight:600;}
.rs-kpi-sub{font-size:11px;color:${C.muted};margin-top:2px;
  font-family:ui-monospace,monospace;}

.rs-card{background:${C.panel};border:1px solid ${C.line};border-radius:14px;
  padding:16px;margin-bottom:14px;}
.rs-card-h{font-size:12px;letter-spacing:1.4px;font-weight:700;color:${C.text};
  text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:7px;
  font-family:ui-monospace,monospace;}
.rs-card-note{font-size:11.5px;color:${C.muted};margin-top:10px;line-height:1.45;}

.rs-timeline-card{padding-bottom:18px;}
.rs-th{justify-content:space-between;flex-wrap:wrap;gap:10px;}
.rs-legend{display:flex;gap:14px;font-size:10.5px;color:${C.muted};
  letter-spacing:0.5px;font-family:ui-monospace,monospace;flex-wrap:wrap;}
.rs-legend span{display:flex;align-items:center;gap:5px;}
.rs-legend i{width:11px;height:8px;border-radius:2px;display:inline-block;}
.rs-legend-dash i{width:14px;height:0;border-top:1.5px dashed ${C.faint};border-radius:0;}
.rs-hint{font-size:11.5px;color:${C.faint};margin-bottom:6px;font-style:italic;}
.rs-trow:hover rect:nth-of-type(2){opacity:1;}

.rs-main{display:grid;grid-template-columns:300px 1fr;gap:14px;margin-bottom:14px;}
.rs-roster{background:${C.panel};border:1px solid ${C.line};border-radius:14px;
  padding:14px;display:flex;flex-direction:column;}
.rs-roster-h{display:flex;flex-direction:column;gap:10px;margin-bottom:11px;}
.rs-roster-h>span{font-size:12px;letter-spacing:1.4px;font-weight:700;
  font-family:ui-monospace,monospace;}
.rs-filters{display:flex;gap:5px;flex-wrap:wrap;}
.rs-filter{font-size:9.5px;letter-spacing:0.6px;padding:4px 8px;border-radius:6px;
  border:1px solid ${C.line};background:transparent;color:${C.muted};cursor:pointer;
  font-family:ui-monospace,monospace;transition:all .15s;}
.rs-filter:hover{color:${C.text};border-color:${C.faint};}
.rs-filter.on{background:${C.cyan}14;color:${C.cyan};border-color:${C.cyan}55;}
.rs-roster-list{display:flex;flex-direction:column;gap:5px;overflow:auto;max-height:330px;}
.rs-rcard{display:flex;align-items:stretch;border-radius:9px;border:1px solid transparent;
  background:${C.panel2};overflow:hidden;transition:all .14s;}
.rs-rcard:hover{border-color:${C.line};}
.rs-rcard.on{border-color:${C.cyan}66;background:${C.cyan}10;}
.rs-rcard-main{flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:9px 11px;
  background:transparent;border:none;cursor:pointer;text-align:left;color:inherit;font:inherit;}
.rs-rcmp{flex:none;width:34px;display:grid;place-items:center;background:transparent;border:none;
  border-left:1px solid ${C.line};color:${C.faint};cursor:pointer;transition:all .14s;}
.rs-rcmp:hover:not(:disabled){color:${C.cyan};background:${C.cyan}12;}
.rs-rcmp.on{color:${C.cyan};background:${C.cyan}1a;}
.rs-rcmp:disabled{opacity:0.3;cursor:not-allowed;}
.rs-rdot{width:8px;height:8px;border-radius:50%;flex:none;}
.rs-rname{font-weight:600;font-size:13px;color:${C.text};flex:1;}
.rs-ryears{font-size:11px;color:${C.muted};font-family:ui-monospace,monospace;}

.rs-detail{background:${C.panel};border:1px solid ${C.line};border-radius:14px;
  padding:20px;min-height:300px;}
.rs-detail-empty{display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;color:${C.muted};text-align:center;}
.rs-detail-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.rs-detail-name{font-size:24px;font-weight:800;letter-spacing:0.3px;}
.rs-detail-aka{font-size:12px;color:${C.muted};margin-top:3px;
  font-family:ui-monospace,monospace;}
.rs-detail-meta{display:flex;align-items:center;gap:9px;margin-top:11px;
  font-size:11.5px;color:${C.muted};font-family:ui-monospace,monospace;}
.rs-dot{color:${C.faint};}
.rs-detail-summary{margin:14px 0 4px;font-size:13.5px;line-height:1.6;color:#CDD4E0;}
.rs-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 22px;margin-top:16px;}
.rs-field-h{display:flex;align-items:center;gap:6px;font-size:10.5px;letter-spacing:1px;
  color:${C.muted};font-family:ui-monospace,monospace;margin-bottom:7px;font-weight:600;}
.rs-field-b{font-size:13px;color:#D7DCE7;line-height:1.5;}
.rs-chiprow{display:flex;flex-wrap:wrap;gap:6px;}
.rs-chip{font-size:11.5px;padding:4px 9px;border-radius:7px;border:1px solid;
  display:inline-flex;align-items:center;line-height:1.2;}
.rs-chip-btn{cursor:pointer;transition:filter .14s;}
.rs-chip-btn:hover{filter:brightness(1.3);}
.rs-badge{display:inline-flex;align-items:center;gap:5px;border:1px solid;border-radius:7px;
  font-weight:700;letter-spacing:1px;font-family:ui-monospace,monospace;white-space:nowrap;}

.rs-charts{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.rs-charts .rs-card{margin-bottom:0;}
.rs-donut-legend{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;
  font-size:11px;color:${C.muted};font-family:ui-monospace,monospace;margin-top:4px;}
.rs-donut-legend span{display:flex;align-items:center;gap:5px;}
.rs-donut-legend i{width:9px;height:9px;border-radius:2px;}

.rs-footer{margin-top:16px;display:flex;flex-direction:column;gap:4px;
  font-size:10.5px;color:${C.faint};font-family:ui-monospace,monospace;line-height:1.5;}

/* search box + roster header */
.rs-roster-title{display:flex;align-items:center;justify-content:space-between;}
.rs-roster-count{font-size:10.5px;color:${C.muted};font-family:ui-monospace,monospace;font-weight:600;}
.rs-search{display:flex;align-items:center;gap:7px;background:${C.panel2};
  border:1px solid ${C.line};border-radius:8px;padding:6px 9px;transition:border-color .14s;}
.rs-search:focus-within{border-color:${C.cyan}66;}
.rs-search>svg{color:${C.faint};flex:none;}
.rs-search input{flex:1;min-width:0;background:transparent;border:none;outline:none;
  color:${C.text};font-size:12.5px;font-family:inherit;}
.rs-search input::placeholder{color:${C.faint};}
.rs-search-x{background:none;border:none;color:${C.faint};cursor:pointer;padding:0;
  display:grid;place-items:center;}
.rs-search-x:hover{color:${C.text};}
.rs-empty{color:${C.muted};font-size:12.5px;text-align:center;padding:22px 8px;font-style:italic;}

/* initial-access facet bar */
.rs-facetbar{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:2px 0 12px;}
.rs-facetbar-label{display:inline-flex;align-items:center;gap:5px;font-size:10px;
  letter-spacing:0.8px;color:${C.muted};font-family:ui-monospace,monospace;margin-right:4px;}
.rs-facetbar-label svg{color:${C.cyan};}
.rs-facet{font-size:10.5px;padding:4px 9px;border-radius:7px;border:1px solid ${C.line};
  background:${C.panel2};color:${C.muted};cursor:pointer;font-family:ui-monospace,monospace;
  display:inline-flex;align-items:center;gap:6px;transition:all .14s;}
.rs-facet:hover{color:${C.text};border-color:${C.faint};}
.rs-facet.on{background:${C.cyan}16;color:${C.cyan};border-color:${C.cyan}66;}
.rs-facet-n{font-size:9.5px;opacity:0.75;background:${C.ink};border-radius:20px;padding:0 6px;}
.rs-facet-clear{color:${C.red};border-color:${C.red}44;}
.rs-facet-clear:hover{color:${C.red};border-color:${C.red};}

a.rs-chip{text-decoration:none;}

/* origins milestone strip */
.rs-mile-track{position:relative;display:flex;gap:6px;align-items:flex-start;
  overflow-x:auto;padding:14px 2px 6px;margin-bottom:6px;}
.rs-mile-line{position:absolute;left:8px;right:8px;top:21px;height:2px;
  background:linear-gradient(90deg,${C.violet}55,${C.slate}55,${C.cyan}55,${C.red}55,${C.amber}55);}
.rs-mile{position:relative;flex:1 0 auto;min-width:84px;display:flex;flex-direction:column;
  align-items:center;gap:5px;background:none;border:none;cursor:pointer;padding:0 4px;
  text-align:center;z-index:1;}
.rs-mile-dot{width:15px;height:15px;border-radius:50%;border:2px solid ${C.ink};
  transition:box-shadow .14s;}
.rs-mile-year{font-size:11px;font-weight:700;color:${C.text};font-family:ui-monospace,monospace;}
.rs-mile-name{font-size:10.5px;color:${C.muted};line-height:1.3;max-width:108px;}
.rs-mile:hover .rs-mile-name{color:${C.text};}
.rs-mile.on .rs-mile-name{color:${C.cyan};}
.rs-mile-end{flex:none;align-self:center;font-size:11px;color:${C.faint};
  font-family:ui-monospace,monospace;padding-left:6px;white-space:nowrap;}
.rs-mile-detail{background:${C.panel2};border:1px solid ${C.line};border-radius:11px;
  padding:14px 16px;margin-top:8px;}
.rs-mile-detail-h{display:flex;align-items:center;gap:11px;flex-wrap:wrap;}
.rs-mile-detail-year{font-size:18px;font-weight:800;font-family:ui-monospace,monospace;}
.rs-mile-detail-name{font-size:16px;font-weight:700;color:${C.text};}
.rs-mile-era{font-size:10px;letter-spacing:0.8px;text-transform:uppercase;border:1px solid;
  border-radius:6px;padding:2px 8px;font-family:ui-monospace,monospace;}
.rs-mile-blurb{margin:10px 0 12px;font-size:13px;line-height:1.6;color:#CDD4E0;}

/* view toggle (timeline / lineage) */
.rs-th-right{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.rs-viewtoggle{display:inline-flex;background:${C.panel2};border:1px solid ${C.line};
  border-radius:8px;padding:2px;gap:2px;}
.rs-vt{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;letter-spacing:0.5px;
  padding:4px 10px;border-radius:6px;border:none;background:transparent;color:${C.muted};
  cursor:pointer;font-family:ui-monospace,monospace;text-transform:uppercase;transition:all .14s;}
.rs-vt:hover{color:${C.text};}
.rs-vt.on{background:${C.cyan}16;color:${C.cyan};}
.rs-vt svg{flex:none;}

/* MITRE ATT&CK technique chips */
.rs-attack{display:inline-flex;align-items:center;gap:7px;text-decoration:none;
  border:1px solid ${C.violet}44;background:${C.violet}12;border-radius:7px;
  padding:3px 5px 3px 3px;transition:filter .14s;}
.rs-attack:hover{filter:brightness(1.3);}
.rs-attack-id{font-size:10.5px;font-weight:700;color:${C.ink};background:${C.violet};
  border-radius:5px;padding:2px 6px;font-family:ui-monospace,monospace;}
.rs-attack-name{font-size:11.5px;color:${C.violet};padding-right:4px;}

/* live feed */
.rs-live-setup{font-size:12.5px;color:${C.muted};line-height:1.6;}
.rs-live-setup code{background:${C.panel2};border:1px solid ${C.line};border-radius:4px;
  padding:1px 5px;font-size:11.5px;color:${C.cyan};}
.rs-live-meta{display:flex;align-items:center;gap:10px;}
.rs-live-fresh{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;
  font-family:ui-monospace,monospace;text-transform:none;letter-spacing:0;}
.rs-live-fresh i{width:7px;height:7px;border-radius:50%;display:inline-block;}
.rs-livedot{animation:rslivepulse 1.8s infinite;}
@keyframes rslivepulse{0%{opacity:1;}50%{opacity:0.4;}100%{opacity:1;}}
.rs-live-refresh{background:none;border:1px solid ${C.line};border-radius:6px;color:${C.muted};
  cursor:pointer;padding:4px 6px;display:grid;place-items:center;}
.rs-live-refresh:hover:not(:disabled){color:${C.cyan};border-color:${C.cyan}55;}
.rs-live-refresh:disabled{opacity:0.5;cursor:default;}
.rs-spin{animation:rsspin 0.8s linear infinite;}
@keyframes rsspin{to{transform:rotate(360deg);}}
.rs-live-state{font-size:12.5px;color:${C.muted};padding:14px 4px;font-family:ui-monospace,monospace;}
.rs-live-err{color:${C.amber};display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.rs-live-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.rs-live-h{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;color:${C.text};
  margin-bottom:9px;font-family:ui-monospace,monospace;}
.rs-live-h svg{color:${C.cyan};}
.rs-live-src{margin-left:auto;font-size:9.5px;color:${C.faint};border:1px solid ${C.line};
  border-radius:20px;padding:1px 8px;font-weight:500;letter-spacing:0.4px;}
.rs-live-item{display:block;text-decoration:none;background:${C.panel2};border:1px solid ${C.lineSoft};
  border-radius:8px;padding:9px 11px;margin-bottom:6px;transition:border-color .14s;}
.rs-live-item:hover{border-color:${C.cyan}55;}
.rs-live-item-top{display:flex;justify-content:space-between;align-items:center;gap:8px;}
.rs-live-cve{font-size:12.5px;font-weight:700;color:${C.red};font-family:ui-monospace,monospace;}
.rs-live-sig{font-size:12.5px;font-weight:700;color:${C.violet};}
.rs-live-date{font-size:10px;color:${C.faint};font-family:ui-monospace,monospace;white-space:nowrap;}
.rs-live-item-sub{font-size:11.5px;color:${C.muted};margin-top:3px;line-height:1.4;}
.rs-live-item-sub strong{color:#CDD4E0;font-weight:600;}
.rs-live-hash{font-family:ui-monospace,monospace;color:${C.faint};word-break:break-all;}
.rs-live-empty{font-size:11.5px;color:${C.faint};font-style:italic;padding:6px 2px;}

/* comparison table */
.rs-compare{margin-top:0;}
.rs-cmp-scroll{overflow-x:auto;margin:0 -4px;padding:0 4px;}
.rs-cmp-grid{display:grid;min-width:520px;border-top:1px solid ${C.line};}
.rs-cmp-corner{background:${C.panel};border-bottom:1px solid ${C.line};position:sticky;left:0;z-index:2;}
.rs-cmp-head{padding:11px 13px;display:flex;flex-direction:column;gap:8px;background:${C.panel2};
  border-bottom:1px solid ${C.line};border-left:1px solid ${C.lineSoft};}
.rs-cmp-head-top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.rs-cmp-name{background:none;border:none;padding:0;color:${C.text};font-weight:700;font-size:15px;
  cursor:pointer;text-align:left;}
.rs-cmp-name:hover{color:${C.cyan};}
.rs-cmp-x{background:none;border:none;color:${C.faint};cursor:pointer;padding:2px;
  display:grid;place-items:center;}
.rs-cmp-x:hover{color:${C.red};}
.rs-cmp-label{padding:11px 13px;border-bottom:1px solid ${C.lineSoft};background:${C.panel};
  font-size:10px;letter-spacing:0.6px;color:${C.muted};font-family:ui-monospace,monospace;
  text-transform:uppercase;position:sticky;left:0;z-index:1;}
.rs-cmp-cell{padding:11px 13px;border-bottom:1px solid ${C.lineSoft};border-left:1px solid ${C.lineSoft};
  font-size:12.5px;color:#D7DCE7;line-height:1.5;}
.rs-cmp-muted{color:${C.faint};}

@media (max-width:880px){
  .rs-kpis{grid-template-columns:1fr 1fr;}
  .rs-main{grid-template-columns:1fr;}
  .rs-charts{grid-template-columns:1fr;}
  .rs-live-grid{grid-template-columns:1fr;}
  .rs-detail-grid{grid-template-columns:1fr;}
  .rs-roster-list{max-height:none;}
}
@media (prefers-reduced-motion:reduce){
  .rs-pulse{animation:none;}
}
`;
