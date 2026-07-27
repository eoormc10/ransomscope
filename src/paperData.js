/* ------------------------------------------------------------------ *
 * PAPER DATA — the case evidence and practical conclusions from the
 * CSCE 701 deliverable ("To Pay a Ransom Is to Feed the Wolf").
 *
 * Only the substantive content lives here: the four case studies, the
 * cross-case findings, and the layered-defense model. The academic
 * apparatus (abstract, methodology, works cited) stays in the paper.
 *
 * Sourcing follows the paper's own discipline: confirmed facts are
 * attributed to a primary source, and material that is only reported —
 * not company-confirmed — is flagged with `qualified` so the UI can
 * label it as outside reporting rather than established fact.
 * ------------------------------------------------------------------ */

// Case Study Findings — each examined across the paper's five themes.
export const CASES = [
  {
    id: "wannacry",
    stats: [
      { v: "200K+", l: "machines affected" },
      { v: "150+", l: "countries hit" },
      { v: "2 months", l: "patch was available beforehand" },
    ],
    name: "WannaCry",
    when: "May 2017",
    sector: "Global · healthcare, transport, manufacturing, government",
    actor: "Attributed to North Korea",
    headline: "Cross-border scale",
    lesson: "Patching + asset visibility",
    accent: "red",
    themes: {
      access:
        "Combined ransomware with worm-like behavior, moving to other vulnerable Windows computers without requiring each user to open a separate malicious attachment.",
      disruption:
        "Disrupted hospitals, transportation companies, manufacturers, and government offices worldwide. Europol called the international scale unprecedented and coordinated the response.",
      impact:
        "Harm was measured in halted services rather than a headline ransom figure — the outbreak showed that a single missing security update could create widespread operational risk.",
      recovery:
        "Microsoft had released security update MS17-010 in March 2017, two months before the outbreak. Many systems remained unpatched; some organizations ran older equipment or lacked a complete inventory of vulnerable devices.",
      takeaway:
        "Patching is both a technical and a management issue: organizations need an inventory, assigned responsibility, testing procedures, maintenance windows, and a way to confirm updates were actually installed.",
    },
    refs: [
      { label: "Microsoft MSRC: Guidance for WannaCrypt attacks", url: "https://msrc.microsoft.com/blog/2017/05/customer-guidance-for-wannacrypt-attacks/", type: "vendor" },
      { label: "Wikipedia: WannaCry ransomware attack", url: "https://en.wikipedia.org/wiki/WannaCry_ransomware_attack", type: "wiki" },
      { label: "CISA: Indicators associated with WannaCry", url: "https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware", type: "cisa" },
    ],
  },
  {
    id: "colonial",
    stats: [
      { v: "~75 BTC", l: "paid (≈$4.4M)" },
      { v: "63.7 BTC", l: "traced and seized by DOJ" },
      { v: "IT only", l: "ransomware never reached the pipeline" },
    ],
    name: "Colonial Pipeline",
    when: "May 2021",
    sector: "Energy · critical infrastructure",
    actor: "Linked to DarkSide",
    headline: "Critical infrastructure",
    lesson: "Containment can halt physical services",
    accent: "amber",
    link: "darkside", // jumps to the actor profile in the roster above
    themes: {
      access:
        "The attack affected the company's business information systems rather than the equipment that physically moves fuel.",
      disruption:
        "Colonial disconnected certain systems used to monitor and control physical pipeline functions so they would not be compromised, suspending pipeline operations while it contained the incident.",
      impact:
        "Colonial reported to the FBI that it paid approximately 75 bitcoin. The Department of Justice later announced investigators had traced and seized about 63.7 bitcoin connected to that payment.",
      recovery:
        "Early law-enforcement involvement mattered: the FBI followed transactions on the public blockchain and obtained control of an address holding part of the payment. Cryptocurrency should not be viewed as completely invisible.",
      takeaway:
        "An attack on business systems can interrupt physical services and public confidence even when ransomware never touched operational equipment. Uncertainty about what an attacker reached may itself require suspending operations.",
    },
    refs: [
      { label: "DOJ: Seizure of DarkSide ransom proceeds", url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside", type: "gov" },
      { label: "CISA: DarkSide Ransomware (AA21-131A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a", type: "cisa" },
      { label: "Wikipedia: Colonial Pipeline ransomware attack", url: "https://en.wikipedia.org/wiki/Colonial_Pipeline_ransomware_attack", type: "wiki" },
    ],
  },
  {
    id: "mgm",
    stats: [
      { v: "Service desk", l: "reported entry point" },
      { v: "Guest-facing", l: "systems taken offline" },
      { v: "Q3 2023", l: "financial impact disclosed" },
    ],
    name: "MGM Resorts",
    when: "September 2023",
    sector: "Hospitality · gaming",
    actor: "Linked by outside reporting to ALPHV and Scattered Spider",
    headline: "Hospitality + trust",
    lesson: "Identity verification matters",
    accent: "violet",
    link: "blackcat",
    themes: {
      access:
        "Bloomberg reported the intrusion began with social engineering directed at MGM's IT service desk, based on a cybersecurity executive familiar with the investigation.",
      disruption:
        "MGM's own filings describe a “cybersecurity issue” involving unauthorized access, system shutdowns, and operational disruptions. Shutting systems down disrupted domestic properties and guest-facing services.",
      impact:
        "The company reported exposure of some customer information and a negative effect on third-quarter performance.",
      recovery:
        "Recovery involved more than restoring servers. Hotels depend on interconnected systems guests expect to work immediately, so employees fell back on manual processes while guests experienced delays.",
      takeaway:
        "Support processes designed to restore access can be exploited when identity-verification procedures are not strong enough to resist persuasive impersonation. Business and reputational effects can become visible before investigators understand the technical scope.",
    },
    qualified:
      "MGM did not confirm the initial access method in its regulatory filing. The service-desk account is treated as well-sourced reporting, not an officially established fact.",
    refs: [
      { label: "CISA: #StopRansomware ALPHV Blackcat (AA23-353A)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a", type: "cisa" },
      { label: "Wikipedia: 2023 MGM Resorts cyberattack", url: "https://en.wikipedia.org/wiki/2023_MGM_Resorts_cyberattack", type: "wiki" },
    ],
  },
  {
    id: "change",
    stats: [
      { v: "$2.2B", l: "direct response costs" },
      { v: "192.7M", l: "individuals affected" },
      { v: "$9B+", l: "in loans to providers" },
    ],
    name: "Change Healthcare",
    when: "February 2024",
    sector: "Healthcare · claims & payment processing",
    actor: "Linked to ALPHV / BlackCat",
    headline: "Healthcare dependency",
    lesson: "Third-party concentration risk",
    accent: "cyan",
    link: "blackcat",
    themes: {
      access:
        "UnitedHealth Group isolated affected systems after discovering unauthorized access to Change Healthcare, which supports pharmacy claims, medical claims, and payment processing.",
      disruption:
        "The shutdown disrupted services used by providers and pharmacies nationwide. HHS described the incident as having an unprecedented magnitude and widespread impact on patients and health care providers.",
      impact:
        "UnitedHealth's 2024 annual filing reported $2.2B in direct response costs and an estimated $867M in business-disruption impacts, plus more than $9B in interest-free loans to support care providers. HHS later reported roughly 192.7 million individuals were affected.",
      recovery:
        "Restoration was staged across claims, pharmacy, and payment services while providers operated without the payment infrastructure they normally depend on.",
      takeaway:
        "One compromised service provider can create privacy, financial, and patient-care consequences across an entire industry. The cost of ransomware cannot be measured only by the ransom amount.",
    },
    refs: [
      { label: "HHS: Change Healthcare incident FAQ", url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/change-healthcare-cybersecurity-incident-frequently-asked-questions/index.html", type: "gov" },
      { label: "UnitedHealth Group: Financial reports (Form 10-K)", url: "https://www.unitedhealthgroup.com/investors/financial-reports.html", type: "vendor" },
      { label: "Wikipedia: 2024 Change Healthcare ransomware attack", url: "https://en.wikipedia.org/wiki/2024_Change_Healthcare_ransomware_attack", type: "wiki" },
    ],
  },
];

/* ---------------- How the extortion model evolved ------------------ *
 * The paper's central evolutionary claim: what attackers hold hostage
 * has changed even more than how they break in. Each stage adds a new
 * source of leverage rather than replacing the last — modern crews mix
 * and match depending on what pressures a particular victim.
 * ------------------------------------------------------------------ */
export const EXTORTION_STAGES = [
  {
    n: "01",
    model: "Encryption only",
    era: "2013 – 2019",
    tone: "slate",
    holds: "Your access to your own files",
    how: "Encrypt the files, sell back the key. If the victim restores from a clean backup, the attacker has no remaining leverage.",
    counter: "A tested backup defeats it outright.",
    examples: ["CryptoLocker", "GandCrab"],
  },
  {
    n: "02",
    model: "Double extortion",
    era: "2019 – present",
    tone: "amber",
    holds: "Your files + your secrets",
    how: "Copy sensitive data out of the network first, then encrypt. Refusing to pay now risks publication on a leak site, so good backups alone no longer end the incident.",
    counter: "Backups no longer close the case — egress monitoring and data minimization matter.",
    examples: ["REvil", "Conti", "LockBit"],
    link: "lockbit",
  },
  {
    n: "03",
    model: "Triple extortion",
    era: "2020 – present",
    tone: "red",
    holds: "Your files, secrets + your relationships",
    how: "Add direct pressure outside the victim organization — contacting customers, partners, patients, or regulators to make silence impossible.",
    counter: "Pre-drafted customer and regulator communications reduce the surprise value.",
    examples: ["BlackCat", "Black Basta"],
    link: "blackcat",
  },
  {
    n: "04",
    model: "Extortion-first",
    era: "2023 – present",
    tone: "violet",
    holds: "Only your secrets",
    how: "Skip encryption entirely. Steal at scale through one software flaw and extort every downstream victim at once — faster, quieter, and harder to spot as a ransomware event.",
    counter: "Nothing to decrypt means recovery plans built only around restoring files miss the incident.",
    examples: ["Clop (MOVEit)"],
    link: "clop",
  },
];

/* -------------------- Did paying actually work? -------------------- *
 * The FBI does not support ransom payments: they encourage further
 * attacks and guarantee nothing. These four outcomes are the evidence.
 * ------------------------------------------------------------------ */
export const PAYMENT_OUTCOMES = [
  {
    case: "Colonial Pipeline",
    year: "2021",
    paid: true,
    amount: "~75 BTC (≈$4.4M)",
    outcome:
      "The decryptor was reportedly too slow to be useful, and Colonial restored from its own backups anyway. What money came back came from the FBI — the DOJ traced and seized about 63.7 BTC.",
    verdict: "Recovery came from backups and law enforcement, not the purchase.",
    ref: { label: "DOJ: seizure announcement", url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside" },
  },
  {
    case: "Change Healthcare",
    year: "2024",
    paid: true,
    amount: "~$22M reported",
    outcome:
      "ALPHV leadership took the payment, then pulled an exit scam — stiffing the affiliate who had actually done the intrusion and still held the stolen data. The affiliate re-extorted the victim.",
    verdict: "Paying bought neither deletion of the data nor an end to the extortion.",
    ref: { label: "Change Healthcare attack", url: "https://en.wikipedia.org/wiki/2024_Change_Healthcare_ransomware_attack" },
  },
  {
    case: "Hive victims",
    year: "2021 – 23",
    paid: false,
    amount: "$130M in demands averted",
    outcome:
      "The FBI infiltrated Hive and quietly held the group's decryption keys for months, handing them to victims free of charge before seizing the infrastructure in January 2023.",
    verdict: "Keys came from law enforcement — reporting early paid better than paying.",
    ref: { label: "DOJ: Hive disruption", url: "https://www.justice.gov/usao-mdfl/pr/us-department-justice-disrupts-hive-ransomware-variant" },
  },
  {
    case: "Ireland HSE",
    year: "2021",
    paid: false,
    amount: "No ransom paid",
    outcome:
      "Conti handed over a decryption key without payment, but that barely mattered: restoring the national health service took months of manual work, and reported recovery costs ran into the hundreds of millions of euro.",
    verdict: "Even a free decryptor does not undo the disruption — recovery is the real cost.",
    ref: { label: "HSE ransomware attack", url: "https://en.wikipedia.org/wiki/Health_Service_Executive_ransomware_attack" },
  },
];

/* ------------- Initial-access tag → defensive control -------------- *
 * Maps the roster's normalized access tags to the specific controls the
 * paper recommends, so every actor profile answers "what raises the bar
 * against this group?" without a separate essay.
 * ------------------------------------------------------------------ */
export const TAG_TO_CONTROL = {
  "Exploited public apps":
    "Risk-prioritized patching of internet-facing systems, regular vulnerability scanning, and compensating controls when a patch cannot ship immediately.",
  "File-transfer zero-days":
    "Segment and monitor managed file-transfer appliances, minimize the data left sitting in them, and hold vendors to patch timelines.",
  "Phishing":
    "Phishing-resistant MFA, training built on realistic behavior rather than annual videos, and a blame-free path to report mistakes fast.",
  "Stolen / VPN credentials":
    "Phishing-resistant MFA on all remote access, credential monitoring for exposed passwords, and account-lockout controls.",
  "RDP / valid accounts":
    "Never expose remote desktop directly to the internet, apply least privilege, and remove unused accounts promptly.",
  "Social engineering":
    "Strong help-desk identity verification before any password reset or MFA change — the control MGM's attackers went around.",
  "Supply chain":
    "Vendor and dependency inventory, plus segmentation of vendor-managed tooling so one provider cannot reach everything.",
  "Exploit kits":
    "Keep browsers and plugins patched, deploy endpoint detection, and filter known-malicious web infrastructure.",
};

// Applies no matter how the attacker got in.
export const UNIVERSAL_CONTROLS =
  "Regardless of entry: offline or immutable backups with tested restoration, network segmentation to limit lateral movement, monitoring for large outbound transfers, and a written, rehearsed incident-response plan.";

/* --------------- Case incidents pinned to the timeline -------------- *
 * Plots each case as a marker on the row of the actor responsible, so
 * the incidents the paper analyzes sit inside the ecosystem view rather
 * than beside it. WannaCry (2017) predates the 2018 window and is not a
 * tracked RaaS group — it is reachable from the Origins strip instead.
 * `at` is a decimal year, matching the timeline's scale.
 * ------------------------------------------------------------------ */
export const CASE_MARKERS = [
  { id: "colonial", group: "darkside", at: 2021.35, name: "Colonial Pipeline", when: "May 2021" },
  { id: "mgm", group: "blackcat", at: 2023.7, name: "MGM Resorts", when: "Sept 2023" },
  { id: "change", group: "blackcat", at: 2024.12, name: "Change Healthcare", when: "Feb 2024" },
];

// Cross-case findings — what the four incidents show when read together.
export const FINDINGS = [
  {
    head: "Entry paths vary, but access failures repeat.",
    body: "Incidents begin through different mechanisms, yet failures in patching, credential protection, identity verification, or third-party governance repeatedly create usable access.",
  },
  {
    head: "The largest effects are not always encryption alone.",
    body: "Containment decisions, system interdependence, and uncertainty about how far an attacker reached can stop operations on their own.",
  },
  {
    head: "Centralized providers multiply consequences.",
    body: "One compromised service provider can spread consequences far beyond the initially compromised organization — to customers, partners, and entire sectors.",
  },
  {
    head: "Resilience requires layers.",
    body: "Coordinated prevention, detection, response, and recovery matter more than any single security product.",
  },
];

// What organizations can do — structured on the NIST IR 8374 functions.
export const DEFENSES = [
  {
    fn: "GOVERN + IDENTIFY",
    tone: "violet",
    aim: "Know what you own and depend on.",
    items: [
      "Inventory devices, software, cloud resources, accounts, vendors, and important data",
      "Assign owners and recovery priorities to critical systems",
      "Map business dependencies, including third-party providers",
    ],
    note: "An unknown server cannot be patched reliably, and an unknown dependency cannot be included in a recovery plan.",
  },
  {
    fn: "PROTECT",
    tone: "cyan",
    aim: "Make entry and expansion harder.",
    items: [
      "Phishing-resistant MFA on email, remote access, and critical accounts",
      "Least privilege; separate admin accounts; remove unused accounts promptly",
      "Risk-prioritized patching, with internet-facing systems first",
      "Network segmentation between user devices, servers, backups, and OT",
      "Awareness training with strong help-desk identity verification",
    ],
    note: "Compensate with temporary controls — restricted access, disabled features, added monitoring — when a patch cannot ship immediately.",
  },
  {
    fn: "DETECT",
    tone: "amber",
    aim: "See the intrusion before the encryption stage.",
    items: [
      "Unusual administrator activity and new remote-access software",
      "Large or unexpected outbound data transfers",
      "Security tooling being disabled; rapid file changes",
      "Alerts reviewed by trained personnel, with logs preserved",
    ],
    note: "A security tool cannot help if no one investigates its warnings or if logs are deleted before responders can use them.",
  },
  {
    fn: "RESPOND",
    tone: "red",
    aim: "Decide under pressure using a plan you already wrote.",
    items: [
      "Quickly identify and isolate affected systems, prioritizing daily-operations systems",
      "Named decision authority, emergency contacts, and evidence preservation",
      "Legal, insurance, and law-enforcement reporting procedures",
      "Coordinated communications across leadership, legal, comms, finance, and operations",
    ],
    note: "Incident response is not an IT-only activity — the decisions are legal, financial, and reputational.",
  },
  {
    fn: "RECOVER",
    tone: "green",
    aim: "Restore fast enough that paying is not the only option.",
    items: [
      "Multiple backup copies, offline or immutable where possible",
      "Backups kept off the accounts and networks used in normal operations",
      "Restoration tested against real recovery-time requirements",
      "Tabletop exercises so hard choices are rehearsed, not improvised",
    ],
    note: "A backup that exists but cannot be restored within the required time is not an effective recovery plan.",
  },
];
