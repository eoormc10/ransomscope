/* ------------------------------------------------------------------ *
 * PAPER DATA — content carried over from the CSCE 701 deliverable
 * ("To Pay a Ransom Is to Feed the Wolf") and the accompanying deck.
 *
 * Everything here is transcribed from the group's own paper/slides, so
 * the site and the write-up stay in sync. Figures keep the paper's
 * sourcing discipline: confirmed facts are attributed to the primary
 * source, and material that is only reported (not company-confirmed) is
 * flagged with `qualified: true` so the UI can label it as such.
 * ------------------------------------------------------------------ */

export const PAPER = {
  title: "To Pay a Ransom Is to Feed the Wolf",
  subtitle: "The Evolution of Ransomware and What Organizations Can Do About It",
  authors: ["Isabella Rios", "Braiton Mendoza", "Ivan Reyes"],
  course: "CSCE 701 — Fundamentals of Cybersecurity",
  instructor: "Dr. Shreyas Kumar",
  institution: "Texas A&M University · Dept. of Computer Science & Engineering",
  date: "July 25, 2026",
  thesis:
    "Although ransomware has evolved into a specialized criminal industry combining encryption, data theft, and social engineering, organizations can substantially reduce both the likelihood and impact of an attack through layered security controls and tested recovery planning.",
  abstract:
    "Ransomware has grown from a relatively simple form of malware into one of the most disruptive cybersecurity threats facing modern organizations. This paper uses a qualitative integrative literature review and comparative case-study analysis to examine ransomware's historical development, common access methods, organizational consequences, and mitigation strategies. The analysis prioritizes government guidance, regulatory filings, law-enforcement releases, and company reports, supplemented by peer-reviewed research and carefully qualified journalism. Four incidents — WannaCry, Colonial Pipeline, MGM Resorts, and Change Healthcare — were selected to represent different sectors, attack mechanisms, and forms of operational impact. The results show that no single technical failure explains ransomware harm; recurring factors include delayed patching, compromised credentials, weak identity verification, third-party concentration, and insufficiently tested recovery processes. The paper concludes that layered controls — especially phishing-resistant multifactor authentication, patching, network segmentation, secure backups, monitoring, and practiced incident response — reduce both the likelihood and impact of attacks, while ransom payment remains legally and operationally uncertain. Future research should use standardized incident data to compare control effectiveness, payment outcomes, and AI-assisted social engineering over time.",
};

export const RESEARCH_QUESTIONS = [
  "How has ransomware evolved from isolated file encryption into organized, multi-stage extortion?",
  "What recurring weaknesses and consequences appear across WannaCry, Colonial Pipeline, MGM Resorts, and Change Healthcare?",
  "Which defensive practices are most consistently supported by authoritative guidance and the case evidence?",
];

// Results section / deck slide 8.
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

// Deck slide 9 — how technical access becomes business pressure.
export const CHAIN = [
  {
    n: "01",
    stage: "Access weakness",
    items: ["Phishing", "Stolen / reused credentials", "Unpatched internet-facing systems", "Weak identity verification"],
  },
  {
    n: "02",
    stage: "Expansion + uncertainty",
    items: ["Privilege escalation", "Lateral movement", "Data theft before encryption", "Scope confusion"],
  },
  {
    n: "03",
    stage: "Operational leverage",
    items: ["Systems shut down", "Services paused to contain", "Customers affected", "Deployment timed for nights, weekends, holidays"],
  },
  {
    n: "04",
    stage: "Payment pressure",
    items: ["Legal exposure", "Operational deadlines", "Reputational damage", "Decisions made without full information"],
  },
];

// Case Study Findings — each examined across the paper's five themes.
export const CASES = [
  {
    id: "wannacry",
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
        "Harm was measured in halted services rather than a headline ransom figure — the outbreak showed a single missing security update could create widespread operational risk.",
      recovery:
        "Microsoft had released security update MS17-010 in March 2017, two months before the outbreak. Many systems remained unpatched; some organizations ran older equipment or lacked a complete inventory of vulnerable devices.",
      takeaway:
        "Patching is both a technical and a management issue: organizations need an inventory, assigned responsibility, testing procedures, maintenance windows, and a way to confirm updates were actually installed.",
    },
    sources: [
      { label: "Europol — WannaCry response", url: "https://www.europol.europa.eu/media-press/newsroom/news/wannacry-ransomware" },
      { label: "Microsoft MSRC — MS17-010 guidance", url: "https://msrc.microsoft.com/blog/2017/05/customer-guidance-for-wannacrypt-attacks/" },
    ],
  },
  {
    id: "colonial",
    name: "Colonial Pipeline",
    when: "May 2021",
    sector: "Energy · critical infrastructure",
    actor: "Linked to DarkSide",
    headline: "Critical infrastructure",
    lesson: "Containment can halt physical services",
    accent: "amber",
    link: "darkside", // jumps to the group profile above
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
    sources: [
      { label: "U.S. GAO — Colonial Pipeline response", url: "https://www.gao.gov/products/gao-22-104746" },
      { label: "DOJ — seizure of DarkSide ransom proceeds", url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside" },
    ],
  },
  {
    id: "mgm",
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
        "MGM's own filings describe a \"cybersecurity issue\" involving unauthorized access, system shutdowns, and operational disruptions. Shutting systems down disrupted domestic properties and guest-facing services.",
      impact:
        "The company reported exposure of some customer information and a negative effect on third-quarter performance.",
      recovery:
        "Recovery involved more than restoring servers. Hotels depend on interconnected systems guests expect to work immediately, so employees fell back on manual processes while guests experienced delays.",
      takeaway:
        "Support processes designed to restore access can be exploited when identity-verification procedures are not strong enough to resist persuasive impersonation. Business and reputational effects can become visible before investigators understand the technical scope.",
    },
    qualified:
      "MGM did not confirm the initial access method in its regulatory filing. The service-desk account is treated as well-sourced reporting, not an officially established fact.",
    sources: [
      { label: "MGM Resorts International — Form 8-K", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789570&type=8-K&dateb=&owner=include&count=40" },
      { label: "Reuters — MGM cyberattack coverage", url: "https://www.reuters.com/technology/mgm-resorts-says-cybersecurity-issue-affecting-some-its-systems-2023-09-11/" },
    ],
  },
  {
    id: "change",
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
    sources: [
      { label: "HHS — Change Healthcare cybersecurity incident", url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/change-healthcare-cybersecurity-incident-frequently-asked-questions/index.html" },
      { label: "UnitedHealth Group — Form 10-K", url: "https://www.unitedhealthgroup.com/investors/financial-reports.html" },
    ],
  },
];

// Deck slide 10 + the paper's "How Organizations Can Protect Themselves".
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

// "Should Organizations Pay the Ransom?" — the argument behind the title.
export const PAY = {
  question: "Should organizations pay the ransom?",
  intro:
    "The decision is complicated because an organization may be facing serious harm to customers, patients, or operations. But payment buys far less certainty than the pressure of the moment suggests.",
  notBuying: [
    "A working decryption key",
    "Removal of the attacker's persistent access",
    "Deletion of stolen information",
    "Protection from a repeat intrusion",
  ],
  buying: [
    "Reliable, tested backups",
    "Practiced recovery and tabletop exercises",
    "Segmented networks that limit blast radius",
    "Cyber insurance and emergency communication plans",
  ],
  positions: [
    {
      who: "FBI",
      what: "Does not support ransom payments: they encourage additional attacks and provide no guarantee that data will be returned.",
    },
    {
      who: "U.S. Treasury",
      what: "Warns that organizations and payment facilitators may face sanctions exposure when a transaction involves a sanctioned person or entity, and emphasizes prompt reporting and cooperation with government agencies.",
    },
  ],
  close:
    "Paying may help one victim in the moment, but it also supports a criminal system that will continue looking for new victims. The most effective response is not simply refusing to pay after an attack — it is building enough resilience before an attack that the organization is not forced to depend on the criminals who caused the disruption.",
};

export const METHOD = {
  design:
    "Qualitative integrative literature review combined with comparative case-study analysis. The review covers material available through July 25, 2026, while the historical discussion reaches back to the 1989 AIDS Trojan.",
  hierarchy: [
    { rank: "1", label: "Primary + authoritative", detail: "Government guidance, law-enforcement releases, regulatory filings, and company reports — used for incident facts, financial figures, and official recommendations." },
    { rank: "2", label: "Peer-reviewed research", detail: "Used for historical development, ransomware taxonomies, and payment-system analysis." },
    { rank: "3", label: "Qualified journalism", detail: "Used only when a material detail was not confirmed in an official source, and explicitly labeled as outside reporting." },
  ],
  selection:
    "The four cases were selected purposively rather than randomly, to span sectors and mechanisms: global worm-like outbreak, critical-infrastructure interdependence, social engineering and identity verification, and third-party concentration. Each was examined across five themes — access or propagation, operational disruption, financial or privacy consequences, response and recovery, and the principal defensive lesson.",
  limits: [
    "Public accounts may omit sensitive investigative details, and threat-actor attribution can remain disputed or change as investigations continue.",
    "Financial figures use the categories each organization chose to report, so they are not perfectly comparable.",
    "Four information-rich cases illustrate different forms of ransomware risk but cannot establish how frequently the observed patterns occur.",
    "The paper identifies recurring patterns and practical implications; it does not estimate prevalence or establish statistical causation.",
  ],
};

export const FUTURE_WORK = [
  "Standardized incident datasets that separate initial access, encryption, data theft, containment downtime, demand, payment, recovery time, and total cost",
  "Which controls actually change outcomes — not merely whether organizations adopted them",
  "Real recovery time and how often immutable backups remain usable during live incidents",
  "AI-assisted impersonation: whether it changes success rates or mainly increases scale and speed",
  "Payment outcomes, sanctions exposure, and attacker adaptation after law-enforcement disruption",
];

// Works cited (deck slide 13). `url` is included only where a stable
// public link was verified; the rest render as plain citations.
export const REFERENCES = [
  { cite: "Cybersecurity and Infrastructure Security Agency. (2023). #StopRansomware Guide.", url: "https://www.cisa.gov/resources-tools/resources/stopransomware-guide" },
  { cite: "Cybersecurity and Infrastructure Security Agency. (2021). BlackMatter Ransomware (AA21-291A).", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-291a" },
  { cite: "Cybersecurity and Infrastructure Security Agency. Understanding Ransomware Threat Actors.", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a" },
  { cite: "Europol. (2017). WannaCry Ransomware.", url: "https://www.europol.europa.eu/media-press/newsroom/news/wannacry-ransomware" },
  { cite: "Federal Bureau of Investigation. Ransomware.", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/ransomware" },
  { cite: "Federal Bureau of Investigation. Spoofing and Phishing.", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/spoofing-and-phishing" },
  { cite: "MGM Resorts International. (2023). Current Report, Form 8-K." },
  { cite: "Microsoft Security Response Center. (2017). Customer Guidance for WannaCrypt Attacks.", url: "https://msrc.microsoft.com/blog/2017/05/customer-guidance-for-wannacrypt-attacks/" },
  { cite: "O'Kane, P., Sezer, S., & Carlin, D. (2018). Evolution of Ransomware. IET Networks.", url: "https://doi.org/10.1049/iet-net.2017.0207" },
  { cite: "Oz, H., et al. (2022). A Survey on Ransomware. ACM Computing Surveys.", url: "https://doi.org/10.1145/3514229" },
  { cite: "Paquet-Clouston, M., Haslhofer, B., & Dupont, B. (2019). Ransomware Payments in the Bitcoin Ecosystem. Journal of Cybersecurity.", url: "https://doi.org/10.1093/cybsec/tyz003" },
  { cite: "Souppaya, M., et al. (2026). Ransomware Risk Management. NIST IR 8374 Rev. 1.", url: "https://csrc.nist.gov/pubs/ir/8374/final" },
  { cite: "UnitedHealth Group Incorporated. (2025). Annual Report, Form 10-K.", url: "https://www.unitedhealthgroup.com/investors/financial-reports.html" },
  { cite: "United States Department of Justice. (2021). Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to DarkSide.", url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside" },
  { cite: "United States Department of Health and Human Services. Change Healthcare Cybersecurity Incident FAQ.", url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/change-healthcare-cybersecurity-incident-frequently-asked-questions/index.html" },
  { cite: "United States Department of the Treasury. (2021). Updated Advisory on Potential Sanctions Risks for Facilitating Ransomware Payments.", url: "https://ofac.treasury.gov/media/912981/download" },
  { cite: "United States Government Accountability Office. Colonial Pipeline ransomware attack.", url: "https://www.gao.gov/products/gao-22-104746" },
];
