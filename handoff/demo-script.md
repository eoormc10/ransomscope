# Demo slide + 60-second script

The deck runs 13 slides in 8 minutes — about 37 seconds each, which is tight.
This buys you the time and spends it on the one thing no other group will have.

---

## Step 1 — Fix this first

**Slide 7 has an internal note printed on the slide face**, not in the speaker
notes:

> *"Design pass: replaced the dense table with case cards for quicker reading
> during an 8-minute presentation."*

Delete that text box. It will otherwise be projected.

---

## Step 2 — Buy the time

Compress these three, which an introductory-cybersecurity audience does not need
in full:

| Slide | Now | Change | Saves |
| --- | --- | --- | --- |
| 3 — Background & significance | Three stacked cards | Keep the one-line thesis and one card | ~25s |
| 4 — Related work | Three strands, full slide | Fold into slide 6 as a single "evidence base" line | ~30s |
| 6 — Methodology | Three numbered steps | Keep steps 1 and 3; drop the case-selection step (slide 7 already shows it) | ~20s |

That recovers roughly **75 seconds** — enough for the demo with margin.

---

## Step 3 — New slide, placed after slide 7 (the four cases)

**Title:** Seeing the pattern — interactive companion

**Body (three short lines, no paragraphs):**
- Same four cases, plotted against the operators behind them
- MGM and Change Healthcare — five months apart, same actor
- Every claim linked to its primary source

**Footer:** `eoormc10.github.io/ransomscope`

**Speaker note:** *Do not read the slide. Switch to the browser and run the
script below. If the network fails, stay on this slide and use the backup
screenshots in the appendix.*

---

## Step 4 — The 60-second demo script

Open these **before** you present, in two tabs, so nothing loads cold on stage.

| | URL |
| --- | --- |
| Tab 1 | `https://eoormc10.github.io/ransomscope/#group=blackcat&case=change` |
| Tab 2 | `https://eoormc10.github.io/ransomscope/#group=qilin&view=lineage` |

> Confirm the Pages URL resolves before you rely on it. If the repository is
> private or Pages is not yet enabled, the site will 404 — run `npm run dev` and
> present from `localhost:5173` instead, using the same hash fragments.

### Beat 1 — the timeline (~20s) · Tab 1

> "This is every major ransomware operation from 2018 to now. Colored bars are
> lifespans — red is active, amber disrupted, grey defunct. The diamonds are the
> four cases from our paper, pinned to the group responsible."

Point at the two diamonds on the BlackCat row.

> "These two are MGM and Change Healthcare. Same operator, five months apart."

### Beat 2 — the case (~20s)

> "Clicking through opens the case."

Click the Change Healthcare diamond.

> "Two-point-two billion in response costs. A hundred ninety-two million people
> affected. And every figure here links to the HHS notice or the UnitedHealth
> 10-K — no claim in this project is unsourced."

### Beat 3 — the argument (~20s) · switch to Tab 2

> "This is why the takedowns don't end it."

Trace left to right across the lineage graph.

> "GandCrab becomes REvil. REvil gets disrupted, DarkSide appears. DarkSide hits
> Colonial and disbands. That lineage becomes BlackCat. BlackCat exit-scams, and
> its affiliates go to RansomHub. RansomHub goes quiet, and they move to Qilin —
> the number one group today. Every arrest removed a brand. Nobody removed the
> people."

**Land on the thesis:** *"Which is why the answer isn't refusing to pay after an
attack. It's being able to recover without them."*

Advance to slide 8 (Major findings).

---

## Step 5 — Appendix slides (hidden, after References)

Right-click each → **Hide Slide**. They will not appear during the run, but you
can jump to them in Q&A by typing the slide number and pressing Enter.

| # | Content | Answers the question |
| --- | --- | --- |
| A1 | Table 2, payment outcomes | *"Should they just have paid?"* |
| A2 | Lineage figure | *"Do takedowns actually work?"* |
| A3 | Cross-case matrix (Table 1) | *"How did you compare them?"* |
| A4 | Screenshots of the demo | Network failure insurance |

---

## Timing check

| Segment | Slides | Target |
| --- | --- | --- |
| Open + research questions | 1–2 | 1:00 |
| Background + evidence base | 3–4 (compressed) | 0:45 |
| Evolution | 5 | 0:45 |
| Methodology | 6 (compressed) | 0:30 |
| Four cases | 7 | 1:15 |
| **Demo** | **new** | **1:00** |
| Findings + interpretation | 8–9 | 1:15 |
| Defenses | 10 | 0:45 |
| Limitations + conclusion | 11–12 | 0:45 |
| | | **~8:00** |

Rehearse the demo twice with the browser already open. The most common failure
is not the network — it is spending fifteen seconds finding the right tab.
