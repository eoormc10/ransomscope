import React, { useState } from "react";
import {
  ExternalLink, Eye, Siren, RotateCcw, ShieldCheck, Landmark,
  FlaskConical, AlertTriangle, Fingerprint, ListChecks, ChevronRight,
  Banknote, Lock, FileWarning, Megaphone, DatabaseZap,
} from "lucide-react";
import { C } from "./theme.js";
import {
  CASES, FINDINGS, DEFENSES, EXTORTION_STAGES, PAYMENT_OUTCOMES,
} from "./paperData.js";

/* ------------------------------------------------------------------ *
 * CASE SECTIONS — the four incidents the paper analyzes, the findings
 * that emerge across them, and the defensive model they support.
 * Kept in its own module so RansomScope.jsx stays the actor console.
 * ------------------------------------------------------------------ */

const TONE = {
  red: C.red, amber: C.amber, cyan: C.cyan,
  violet: C.violet, green: C.green, slate: C.slate,
};

const DEFENSE_ICON = {
  "GOVERN + IDENTIFY": Landmark,
  PROTECT: ShieldCheck,
  DETECT: Eye,
  RESPOND: Siren,
  RECOVER: RotateCcw,
};

/* ---------------- How the extortion model evolved ------------------ */

const STAGE_ICON = [Lock, FileWarning, Megaphone, DatabaseZap];

export function ExtortionEvolution({ onSelectGroup }) {
  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><Banknote size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> WHAT THE ATTACKER HOLDS HOSTAGE — THE EXTORTION MODEL</span>
        <span className="rs-src-tag">Leverage evolution · 2013 – present</span>
      </div>
      <div className="rs-hint">
        How criminals break in has changed. What they hold over you has changed more. Each stage adds leverage rather than replacing the last — modern crews mix and match depending on what pressures a particular victim.
      </div>
      <div className="rs-ext">
        {EXTORTION_STAGES.map((s, i) => {
          const col = TONE[s.tone] || C.cyan;
          const Icon = STAGE_ICON[i] || Lock;
          return (
            <React.Fragment key={s.n}>
              <div className="rs-ext-step" style={{ borderTopColor: col }}>
                <div className="rs-ext-top">
                  <span className="rs-ext-n" style={{ color: col }}>{s.n}</span>
                  <Icon size={13} strokeWidth={2.3} style={{ color: col }} />
                  <span className="rs-ext-era">{s.era}</span>
                </div>
                <div className="rs-ext-model" style={{ color: col }}>{s.model}</div>
                <div className="rs-ext-holds">Holds: {s.holds}</div>
                <div className="rs-ext-how">{s.how}</div>
                <div className="rs-ext-counter">{s.counter}</div>
                <div className="rs-ext-ex">
                  {s.examples.map((e) =>
                    s.link && onSelectGroup ? (
                      <button key={e} className="rs-ext-tag rs-ext-tag-btn"
                        onClick={() => onSelectGroup(s.link)}
                        title="Open this actor's profile">{e}</button>
                    ) : (
                      <span key={e} className="rs-ext-tag">{e}</span>
                    )
                  )}
                </div>
              </div>
              {i < EXTORTION_STAGES.length - 1 && (
                <div className="rs-ext-arrow"><ChevronRight size={17} /></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------- Did paying actually work? ------------------- */

export function PaymentOutcomes() {
  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><Banknote size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> DID PAYING ACTUALLY WORK?</span>
        <span className="rs-src-tag">Payment outcomes on record</span>
      </div>
      <div className="rs-hint">
        The FBI does not support ransom payments: they encourage further attacks and guarantee nothing. Four documented outcomes show what a payment does — and does not — buy.
      </div>
      <div className="rs-po-grid">
        {PAYMENT_OUTCOMES.map((p) => {
          const col = p.paid ? C.red : C.green;
          return (
            <div className="rs-po" key={p.case}>
              <div className="rs-po-h">
                <div>
                  <div className="rs-po-case">{p.case}</div>
                  <div className="rs-po-year">{p.year}</div>
                </div>
                <span className="rs-po-badge"
                  style={{ color: col, borderColor: col + "55", background: col + "16" }}>
                  {p.paid ? "PAID" : "DID NOT PAY"}
                </span>
              </div>
              <div className="rs-po-amt" style={{ color: col }}>{p.amount}</div>
              <div className="rs-po-body">{p.outcome}</div>
              <div className="rs-po-verdict">{p.verdict}</div>
              <a className="rs-po-ref" href={p.ref.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={10} /> {p.ref.label}
              </a>
            </div>
          );
        })}
      </div>
      <div className="rs-card-note">
        Payment also carries legal exposure: the U.S. Treasury warns that organizations and payment facilitators may face sanctions risk when a transaction involves a sanctioned person or entity. Preparation — tested backups, segmentation, practiced recovery — is what creates the option not to pay.
      </div>
    </section>
  );
}

/* --------------------------- Case studies -------------------------- */

const THEME_ROWS = [
  { key: "access", label: "ACCESS / PROPAGATION" },
  { key: "disruption", label: "OPERATIONAL DISRUPTION" },
  { key: "impact", label: "FINANCIAL / PRIVACY IMPACT" },
  { key: "recovery", label: "RESPONSE & RECOVERY" },
  { key: "takeaway", label: "DEFENSIVE LESSON" },
];

// `selected`/`onSelect` are controlled by the app so the timeline's
// incident markers and the Origins strip can open a specific case.
export function CaseStudies({ onSelectGroup, selected, onSelect }) {
  const c = CASES.find((x) => x.id === selected) || CASES[0];
  const accent = TONE[c.accent] || C.cyan;

  return (
    <section className="rs-card" id="rs-cases">
      <div className="rs-card-h rs-th">
        <span><FlaskConical size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> FOUR CASES, FOUR FORMS OF RISK</span>
        <span className="rs-src-tag">Case evidence · 2017–2024</span>
      </div>
      <div className="rs-hint">
        Each case illustrates a different way ransomware creates organizational pressure. Click a case to read it across five themes — with primary sources for every claim.
      </div>

      <div className="rs-case-tabs">
        {CASES.map((x) => {
          const on = x.id === c.id;
          const a = TONE[x.accent] || C.cyan;
          return (
            <button
              key={x.id}
              className={"rs-case-tab" + (on ? " on" : "")}
              onClick={() => onSelect(x.id)}
              style={on ? { borderColor: a + "88", background: a + "14" } : undefined}
            >
              <span className="rs-case-dot" style={{ background: a }} />
              <span className="rs-case-tab-name" style={on ? { color: a } : undefined}>{x.name}</span>
              <span className="rs-case-tab-when">{x.when}</span>
              <span className="rs-case-tab-lesson">{x.headline}</span>
            </button>
          );
        })}
      </div>

      <div className="rs-case-body">
        <div className="rs-case-head">
          <div>
            <div className="rs-case-name" style={{ color: accent }}>{c.name}</div>
            <div className="rs-case-meta">{c.when} · {c.sector}</div>
          </div>
          <div className="rs-case-tags">
            <span className="rs-chip" style={{ color: accent, borderColor: accent + "55", background: accent + "16" }}>
              {c.lesson}
            </span>
            {c.link && onSelectGroup && (
              <button className="rs-chip rs-chip-btn rs-case-jump"
                onClick={() => onSelectGroup(c.link)}
                title="Open this actor's profile in the roster above">
                ↑ View actor profile
              </button>
            )}
          </div>
        </div>

        <div className="rs-case-actor">
          <Fingerprint size={12} style={{ color: C.faint }} /> {c.actor}
        </div>

        {c.stats && (
          <div className="rs-case-stats">
            {c.stats.map((s) => (
              <div className="rs-case-stat" key={s.l} style={{ borderLeftColor: accent }}>
                <div className="rs-case-stat-v" style={{ color: accent }}>{s.v}</div>
                <div className="rs-case-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {c.qualified && (
          <div className="rs-qualified">
            <AlertTriangle size={13} style={{ color: C.amber, flex: "none", marginTop: 2 }} />
            <span><strong>Sourcing note.</strong> {c.qualified}</span>
          </div>
        )}

        <div className="rs-case-themes">
          {THEME_ROWS.map((t) => (
            <div className="rs-case-theme" key={t.key}>
              <div className="rs-case-theme-l" style={{ borderColor: accent + "44" }}>{t.label}</div>
              <div className="rs-case-theme-b">{c.themes[t.key]}</div>
            </div>
          ))}
        </div>

        <div className="rs-case-refs">
          <div className="rs-case-refs-h">SOURCES / FURTHER READING</div>
          <div className="rs-chiprow">
            {c.refs.map((r) => (
              <a key={r.url} className="rs-chip rs-chip-btn" href={r.url}
                target="_blank" rel="noopener noreferrer"
                style={{ color: C.cyan, borderColor: C.cyan + "44", background: C.cyan + "12" }}>
                <ExternalLink size={10} style={{ marginRight: 5, opacity: 0.85 }} />{r.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Findings ----------------------------- */

export function Findings() {
  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><ListChecks size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> WHAT THE FOUR CASES SHOW</span>
        <span className="rs-src-tag">Cross-case findings</span>
      </div>
      <div className="rs-findings">
        {FINDINGS.map((f, i) => (
          <div className="rs-finding" key={f.head}>
            <div className="rs-finding-n">{String(i + 1).padStart(2, "0")}</div>
            <div className="rs-finding-head">{f.head}</div>
            <div className="rs-finding-body">{f.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Defenses ----------------------------- */

export function DefenseStack() {
  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><ShieldCheck size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> LAYERED DEFENSE — WHAT ORGANIZATIONS CAN DO</span>
        <a className="rs-src-tag rs-src-tag-link"
          href="https://csrc.nist.gov/pubs/ir/8374/final"
          target="_blank" rel="noopener noreferrer">
          Structured on NIST IR 8374 <ExternalLink size={9} />
        </a>
      </div>
      <div className="rs-hint">
        No single product stops every ransomware attack. Make entry harder, limit movement, detect earlier, and recover faster — the goal is to reduce the pressure to pay by creating viable recovery options before an incident occurs.
      </div>
      <div className="rs-def-grid">
        {DEFENSES.map((d) => {
          const col = TONE[d.tone] || C.cyan;
          const Icon = DEFENSE_ICON[d.fn] || ShieldCheck;
          return (
            <div className="rs-def" key={d.fn} style={{ borderTopColor: col }}>
              <div className="rs-def-h" style={{ color: col }}>
                <Icon size={13} strokeWidth={2.3} /> {d.fn}
              </div>
              <div className="rs-def-aim">{d.aim}</div>
              <ul className="rs-def-list">
                {d.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <div className="rs-def-note">{d.note}</div>
            </div>
          );
        })}
      </div>
      <div className="rs-card-note">
        Further reading: <a className="rs-inline-link" href="https://www.cisa.gov/resources-tools/resources/stopransomware-guide" target="_blank" rel="noopener noreferrer">CISA #StopRansomware Guide</a> · <a className="rs-inline-link" href="https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/ransomware" target="_blank" rel="noopener noreferrer">FBI ransomware guidance</a>
      </div>
    </section>
  );
}

/* ------------------------------ CSS -------------------------------- */

export const paperCss = `
.rs-src-tag{font-size:10px;letter-spacing:0.6px;color:${C.faint};
  font-family:ui-monospace,monospace;text-transform:none;font-weight:500;}
.rs-src-tag-link{display:inline-flex;align-items:center;gap:4px;text-decoration:none;}
.rs-src-tag-link:hover{color:${C.cyan};}
.rs-inline-link{color:${C.cyan};text-decoration:none;border-bottom:1px solid ${C.cyan}44;}
.rs-inline-link:hover{filter:brightness(1.3);}

/* --- extortion model --- */
.rs-ext{display:flex;align-items:stretch;gap:3px;margin-top:6px;}
.rs-ext-step{flex:1;min-width:0;background:${C.panel2};border:1px solid ${C.line};
  border-top-width:2px;border-radius:0 0 11px 11px;padding:13px;
  display:flex;flex-direction:column;}
.rs-ext-top{display:flex;align-items:center;gap:7px;}
.rs-ext-n{font-family:ui-monospace,monospace;font-size:11px;font-weight:800;
  letter-spacing:1px;}
.rs-ext-era{margin-left:auto;font-size:10px;color:${C.faint};
  font-family:ui-monospace,monospace;}
.rs-ext-model{font-size:14px;font-weight:800;margin-top:7px;letter-spacing:0.2px;}
.rs-ext-holds{font-size:11.5px;color:${C.text};font-weight:600;margin-top:4px;}
.rs-ext-how{font-size:11.5px;line-height:1.55;color:${C.muted};margin-top:8px;flex:1;}
.rs-ext-counter{font-size:11px;line-height:1.5;color:${C.faint};font-style:italic;
  margin-top:9px;padding-top:9px;border-top:1px solid ${C.lineSoft};}
.rs-ext-ex{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;}
.rs-ext-tag{font-size:10.5px;padding:3px 7px;border-radius:6px;border:1px solid ${C.line};
  color:${C.muted};background:${C.ink};font-family:ui-monospace,monospace;}
.rs-ext-tag-btn{cursor:pointer;transition:all .14s;}
.rs-ext-tag-btn:hover{color:${C.cyan};border-color:${C.cyan}55;}
.rs-ext-arrow{display:grid;place-items:center;color:${C.faint};flex:none;}

/* --- payment outcomes --- */
.rs-po-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;}
.rs-po{background:${C.panel2};border:1px solid ${C.line};border-radius:11px;
  padding:14px;display:flex;flex-direction:column;}
.rs-po-h{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;}
.rs-po-case{font-size:13.5px;font-weight:700;color:${C.text};line-height:1.25;}
.rs-po-year{font-size:10.5px;color:${C.faint};font-family:ui-monospace,monospace;
  margin-top:2px;}
.rs-po-badge{font-size:9.5px;letter-spacing:0.8px;font-weight:700;padding:3px 7px;
  border-radius:6px;border:1px solid;font-family:ui-monospace,monospace;flex:none;
  white-space:nowrap;}
.rs-po-amt{font-size:12.5px;font-weight:700;margin-top:9px;
  font-family:ui-monospace,monospace;}
.rs-po-body{font-size:11.5px;line-height:1.55;color:${C.muted};margin-top:7px;flex:1;}
.rs-po-verdict{font-size:11.5px;line-height:1.5;color:#D2D8E4;margin-top:9px;
  padding-top:9px;border-top:1px solid ${C.lineSoft};font-weight:600;}
.rs-po-ref{display:inline-flex;align-items:center;gap:5px;margin-top:10px;font-size:11px;
  color:${C.cyan};text-decoration:none;}
.rs-po-ref:hover{filter:brightness(1.3);}

/* --- case studies --- */
.rs-case-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0 14px;}
.rs-case-tab{display:flex;flex-direction:column;align-items:flex-start;gap:2px;
  background:${C.panel2};border:1px solid ${C.line};border-radius:11px;
  padding:11px 13px;cursor:pointer;text-align:left;transition:all .15s;
  color:inherit;font:inherit;}
.rs-case-tab:hover{border-color:${C.faint};}
.rs-case-dot{width:8px;height:8px;border-radius:50%;margin-bottom:3px;}
.rs-case-tab-name{font-size:13.5px;font-weight:700;color:${C.text};}
.rs-case-tab-when{font-size:10.5px;color:${C.faint};font-family:ui-monospace,monospace;}
.rs-case-tab-lesson{font-size:11px;color:${C.muted};margin-top:4px;}
.rs-case-body{background:${C.panel2};border:1px solid ${C.line};border-radius:12px;
  padding:17px 18px;}
.rs-case-head{display:flex;justify-content:space-between;align-items:flex-start;
  gap:12px;flex-wrap:wrap;}
.rs-case-name{font-size:20px;font-weight:800;letter-spacing:0.2px;}
.rs-case-meta{font-size:11.5px;color:${C.muted};font-family:ui-monospace,monospace;
  margin-top:3px;}
.rs-case-tags{display:flex;gap:7px;flex-wrap:wrap;align-items:center;}
.rs-case-jump{color:${C.cyan};border-color:${C.cyan}44;background:${C.cyan}12;
  font:inherit;font-size:11.5px;}
.rs-case-actor{display:flex;align-items:center;gap:6px;margin-top:9px;font-size:11.5px;
  color:${C.faint};font-family:ui-monospace,monospace;}
.rs-qualified{display:flex;gap:9px;margin-top:12px;padding:10px 12px;font-size:12px;
  line-height:1.55;color:#D5CBB4;background:${C.amber}12;
  border:1px solid ${C.amber}33;border-radius:9px;}
.rs-case-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px;}
.rs-case-stat{background:${C.ink};border:1px solid ${C.line};border-left-width:2px;
  border-radius:0 9px 9px 0;padding:11px 13px;}
.rs-case-stat-v{font-size:19px;font-weight:800;letter-spacing:0.2px;line-height:1.1;}
.rs-case-stat-l{font-size:11px;color:${C.muted};margin-top:4px;line-height:1.35;}
.rs-case-themes{margin-top:15px;display:flex;flex-direction:column;gap:12px;}
.rs-case-theme{display:grid;grid-template-columns:186px 1fr;gap:16px;align-items:start;}
.rs-case-theme-l{font-size:10px;letter-spacing:1px;color:${C.muted};font-weight:700;
  font-family:ui-monospace,monospace;padding:2px 0 2px 11px;border-left:2px solid;}
.rs-case-theme-b{font-size:13px;line-height:1.6;color:#D2D8E4;}
.rs-case-refs{margin-top:16px;padding-top:14px;border-top:1px solid ${C.line};}
.rs-case-refs-h{font-size:10px;letter-spacing:1px;color:${C.muted};font-weight:700;
  font-family:ui-monospace,monospace;margin-bottom:8px;}

/* --- findings --- */
.rs-findings{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;}
.rs-finding{background:${C.panel2};border:1px solid ${C.line};border-radius:11px;
  padding:14px;}
.rs-finding-n{font-family:ui-monospace,monospace;font-size:19px;font-weight:800;
  color:${C.cyan}66;line-height:1;}
.rs-finding-head{margin-top:8px;font-size:13px;font-weight:700;color:${C.text};
  line-height:1.4;}
.rs-finding-body{margin-top:6px;font-size:12px;line-height:1.55;color:${C.muted};}

/* --- defenses --- */
.rs-def-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;}
.rs-def{background:${C.panel2};border:1px solid ${C.line};border-top-width:2px;
  border-radius:0 0 11px 11px;padding:13px;display:flex;flex-direction:column;}
.rs-def-h{display:flex;align-items:center;gap:6px;font-size:10.5px;letter-spacing:1px;
  font-weight:700;font-family:ui-monospace,monospace;}
.rs-def-aim{margin-top:7px;font-size:12.5px;color:${C.text};font-weight:600;
  line-height:1.4;}
.rs-def-list{margin:10px 0 0;padding-left:15px;font-size:11.5px;line-height:1.6;
  color:${C.muted};flex:1;}
.rs-def-list li{margin-bottom:5px;}
.rs-def-note{margin-top:11px;padding-top:10px;border-top:1px solid ${C.lineSoft};
  font-size:11px;line-height:1.5;color:${C.faint};font-style:italic;}

@media (max-width: 1080px){
  .rs-case-tabs{grid-template-columns:repeat(2,1fr);}
  .rs-findings{grid-template-columns:repeat(2,1fr);}
  .rs-def-grid{grid-template-columns:repeat(2,1fr);}
  .rs-po-grid{grid-template-columns:repeat(2,1fr);}
  .rs-ext{flex-direction:column;}
  .rs-ext-arrow{transform:rotate(90deg);padding:2px 0;}
}
@media (max-width: 720px){
  .rs-case-tabs{grid-template-columns:1fr;}
  .rs-case-stats{grid-template-columns:1fr;}
  .rs-case-theme{grid-template-columns:1fr;gap:5px;}
  .rs-findings,.rs-def-grid,.rs-po-grid{grid-template-columns:1fr;}
}
`;
