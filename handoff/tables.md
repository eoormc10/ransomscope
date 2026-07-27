# Tables for the paper

Paste-ready for Google Docs. Both are drawn from material already in the paper —
no new claims — but reorganized so the comparison the Methodology promises is
actually visible in the Results.

**Where they go**
- Table 1 → open the **Case Study Findings** section, before the WannaCry subsection.
- Table 2 → inside **Should Organizations Pay the Ransom?**, after the FBI paragraph.

**Paste tip:** in Google Docs use *Insert → Table*, then paste cell by cell, or
paste the block into a blank doc first and use *Format → Convert to table* if
your Docs version offers it. Keep the caption above each table (APA/MLA style),
and keep the source line beneath it in smaller type.

---

## Table 1 — Cross-case comparison across the five analytic themes

*Table 1. Comparison of the four selected incidents across the five themes
defined in the Methodology.*

| Theme | WannaCry (May 2017) | Colonial Pipeline (May 2021) | MGM Resorts (Sept 2023) | Change Healthcare (Feb 2024) |
| --- | --- | --- | --- | --- |
| **Sector** | Global; healthcare, transport, manufacturing, government | Energy; critical infrastructure | Hospitality and gaming | Healthcare claims and payment processing |
| **Access or propagation** | Worm-like spread between unpatched Windows systems; no user action required per host | Business information systems compromised; operational pipeline equipment never directly affected | Reported social engineering of the IT service desk † | Unauthorized access to a centralized claims and payment platform |
| **Operational disruption** | Hospitals, transport companies, manufacturers and government offices across many countries; Europol called the scale unprecedented | Colonial disconnected systems monitoring physical pipeline functions and suspended operations while containing the incident | System shutdowns disrupted domestic properties and guest-facing services | Pharmacy claims, medical claims and payment services disrupted for providers nationwide |
| **Financial or privacy consequence** | No headline ransom figure; harm measured in halted services | Approximately 75 bitcoin paid; about 63.7 bitcoin later traced and seized by the DOJ | Exposure of some customer information; negative effect on third-quarter performance | $2.2B direct response costs, an estimated $867M in business disruption, more than $9B in provider loans, and approximately 192.7M individuals affected |
| **Response and recovery** | MS17-010 had been available for two months; many systems remained unpatched and device inventories were incomplete | The FBI followed transactions on the public blockchain and obtained control of an address holding part of the payment | Employees fell back on manual processes while guests experienced delays; effects were visible before technical scope was understood | Restoration staged across claims, pharmacy and payment services while providers operated without normal payment infrastructure |
| **Principal defensive lesson** | Patching is a management problem as much as a technical one: inventory, ownership, testing and verification | Containment of business systems can halt physical services; uncertainty about attacker reach alone can force a shutdown | Support processes built to restore access can be exploited when identity verification is weak | Third-party concentration converts one provider outage into a sector-wide event |

† MGM did not confirm the initial access method in its regulatory filing. The
service-desk account is well-sourced reporting rather than an officially
established fact, and is treated as such throughout this paper.

*Sources: Europol; Microsoft Security Response Center; U.S. Government
Accountability Office; U.S. Department of Justice; MGM Resorts International
Form 8-K; Bloomberg; U.S. Department of Health and Human Services; UnitedHealth
Group Form 10-K.*

---

## Table 2 — What ransom payment actually purchased

*Table 2. Documented payment outcomes. Payment did not reliably produce
recovery in any of the four incidents examined.*

| Incident | Paid? | Amount | What the payment actually produced | Primary source |
| --- | --- | --- | --- | --- |
| **Colonial Pipeline** (2021) | Yes | ~75 BTC (≈ $4.4M) | Recovery came from the company's own restoration effort and from law enforcement, not from the purchase; the DOJ traced and seized about 63.7 BTC | U.S. Department of Justice |
| **Change Healthcare** (2024) | Yes | ~$22M (reported) | ALPHV leadership retained the payment and ceased operations, leaving the affiliate who held the stolen data unpaid and the victim exposed to renewed extortion | Reported; not confirmed in UnitedHealth filings |
| **Hive victims** (2021–23) | No | ~$130M in demands averted | The FBI held Hive's decryption keys covertly for months and provided them to victims at no cost before seizing the infrastructure | U.S. Department of Justice |
| **Ireland HSE** (2021) | No | No ransom paid | A decryption key was supplied without payment, yet restoring the national health service still required months of manual work and substantial recovery expenditure | Health Service Executive reporting |

**Reading of the table.** Across all four incidents, the factor that determined
recovery was preparation and law-enforcement engagement rather than the decision
to pay. This supports the paper's central argument and the FBI's position that
payment encourages further attacks while guaranteeing nothing (Federal Bureau of
Investigation, "Ransomware"), and it is compounded by the sanctions exposure the
U.S. Treasury describes for organizations and payment facilitators (United
States Department of the Treasury).

> **Verify before submitting.** The Change Healthcare payment amount and the
> affiliate dispute come from security reporting rather than a company filing.
> Label the row as reported, consistent with how the paper already handles the
> MGM service-desk account. Confirm the HSE recovery-cost figure against a
> source your group is willing to cite before attaching a number to it.
