# Prose additions for the paper

Two drafted passages, written to match the existing voice: plain declarative
sentences, no jargon inflation, parenthetical citations in the paper's current
style. Both are additions rather than rewrites — drop them in and adjust the
surrounding transitions.

---

## 1. Contribution statement → end of **Related Work**

The Related Work section currently describes three strands of literature and
then moves on. It never states what this paper adds. Reviewers and graders look
for that sentence explicitly. Append this to the final paragraph:

> This paper's contribution is not a new dataset but a disciplined comparison.
> Existing work tends to treat ransomware either historically, economically, or
> operationally; this review applies all three lenses to the same four incidents
> and holds them to an explicit evidence hierarchy that separates
> company-confirmed facts from qualified outside reporting. That separation
> matters for a threat whose most widely repeated details often originate in
> journalism rather than in filings or advisories, and it allows the recurring
> patterns identified here to be traced back to the strength of the evidence
> supporting them.

**Why it helps.** It converts your MGM sourcing discipline — which you already
practice but never name as a method — into a stated contribution. That is the
most defensible original claim the paper makes.

---

## 2. Affiliate displacement → **Emerging Threats and Policy Implications**

The section currently asserts that "developers, affiliates, and access brokers
may move to other platforms without abandoning the broader Ransomware-as-a-Service
model" and cites CISA and Oz et al. The claim is correct but undemonstrated.
Insert this paragraph immediately after it:

> This displacement is observable rather than theoretical. GandCrab's operators
> announced their retirement in 2019 and the same lineage reappeared as REvil;
> after REvil was disrupted, DarkSide emerged, and DarkSide disbanded within
> weeks of the Colonial Pipeline attack under law-enforcement pressure. The
> lineage continued into BlackCat, the first major Rust-based operation. When
> Operation Cronos seized LockBit's infrastructure in February 2024 and
> BlackCat's leadership abandoned its own affiliates weeks later, RansomHub
> recruited the displaced affiliates with an unusually generous payout share and
> expanded rapidly. When RansomHub's infrastructure went quiet in early 2025,
> those affiliates moved again, most visibly to Qilin, whose claimed victim
> count rose sharply across 2025; a former Qilin affiliate then founded a new
> operation of its own. The pattern is consistent: each disruption removed a
> brand without removing the people, the tooling, or the purchased network
> access behind it. Policy responses that measure success by infrastructure
> seizures alone therefore risk overstating their effect, because the labor
> market for intrusion survives the platform.

**Why it helps.** It is the paper's most publishable idea and currently occupies
one sentence. It also gives the Conclusion something concrete to point at when
it argues that resilience matters more than any single disruption.

> **Before you submit.** The specific figures behind this paragraph — RansomHub's
> payout share, Qilin's victim counts, The Gentlemen's ranking — come from vendor
> threat reporting, not government sources. I deliberately wrote the paragraph
> without hard numbers so it stands on the sourcing you already have. If your
> group wants the numbers in, attach citations at the same standard as the rest
> of the paper and label them as vendor reporting, the way the Methodology's
> evidence hierarchy requires.

---

## 3. Optional: one sentence for the **Methodology**

If you cite the companion site anywhere, the Methodology is the honest place —
it is a presentation artifact, not a source:

> A companion interactive artifact was produced alongside this review to
> visualize the evolution, lineage, and case evidence discussed here. It
> presents the same material and introduces no findings of its own.
