import React, { useState } from "react";
import {
  BookOpen, ExternalLink, ChevronRight, Layers, Eye, Siren, RotateCcw,
  ShieldCheck, Landmark, FlaskConical, AlertTriangle, Ban, CheckCircle2,
  Scale, Fingerprint, ListChecks, Quote,
} from "lucide-react";
import { C } from "./theme.js";
import {
  PAPER, RESEARCH_QUESTIONS, FINDINGS, CHAIN, CASES, DEFENSES, PAY,
  METHOD, FUTURE_WORK, REFERENCES,
} from "./paperData.js";

/* ------------------------------------------------------------------ *
 * PAPER SECTIONS — the research paper and presentation, rendered into
 * the dashboard. Kept in its own module so RansomScope.jsx stays the
 * threat-actor console; these sections carry the written argument.
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

function SourceLink({ label, url }) {
  return (
    <a className="rs-src-link" href={url} target="_blank" rel="noopener noreferrer">
      <ExternalLink size={10} />
      {label}
    </a>
  );
}

/* ------------------------- Paper identity -------------------------- */

export function PaperBand() {
  const [open, setOpen] = useState(false);
  return (
    <section className="rs-card rs-paper">
      <div className="rs-card-h rs-th">
        <span><BookOpen size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> THE RESEARCH BEHIND THIS CONSOLE</span>
        <span className="rs-paper-course">{PAPER.course}</span>
      </div>

      <div className="rs-paper-grid">
        <div>
          <h2 className="rs-paper-title">{PAPER.title}</h2>
          <div className="rs-paper-sub">{PAPER.subtitle}</div>
          <div className="rs-paper-by">
            {PAPER.authors.join(" · ")}
            <span className="rs-dot"> • </span>
            {PAPER.instructor}
            <span className="rs-dot"> • </span>
            {PAPER.date}
          </div>
          <div className="rs-paper-inst">{PAPER.institution}</div>

          <blockquote className="rs-thesis">
            <Quote size={13} style={{ color: C.cyan, flex: "none", marginTop: 3 }} />
            <span>{PAPER.thesis}</span>
          </blockquote>

          <button className="rs-filter rs-abs-toggle" onClick={() => setOpen(!open)}>
            {open ? "HIDE ABSTRACT" : "READ ABSTRACT"}
          </button>
          {open && <p className="rs-abstract">{PAPER.abstract}</p>}
        </div>

        <div className="rs-rqs">
          <div className="rs-rq-h">RESEARCH QUESTIONS</div>
          {RESEARCH_QUESTIONS.map((q, i) => (
            <div className="rs-rq" key={i}>
              <span className="rs-rq-n">{String(i + 1).padStart(2, "0")}</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Attack chain -------------------------- */

export function AttackChain() {
  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><Layers size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> ANATOMY OF AN INCIDENT</span>
        <span className="rs-src-tag">Paper — Common Attack Methods · Interpretation</span>
      </div>
      <div className="rs-hint">
        Across every case, attackers convert technical access into business pressure. The visible encryption event is usually the last stage, not the first.
      </div>
      <div className="rs-chain">
        {CHAIN.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="rs-chain-step">
              <div className="rs-chain-n">{s.n}</div>
              <div className="rs-chain-stage">{s.stage}</div>
              <ul className="rs-chain-list">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
            {i < CHAIN.length - 1 && (
              <div className="rs-chain-arrow"><ChevronRight size={18} /></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="rs-card-note">
        Key takeaway: cybersecurity controls are also business-continuity controls. Identity security, dependency mapping, asset visibility, and recovery speed determine how much leverage an attacker gains.
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

export function CaseStudies({ onSelectGroup }) {
  const [sel, setSel] = useState(CASES[0].id);
  const c = CASES.find((x) => x.id === sel) || CASES[0];
  const accent = TONE[c.accent] || C.cyan;

  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><FlaskConical size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> FOUR CASES, FOUR FORMS OF RISK</span>
        <span className="rs-src-tag">Paper — Case Study Findings</span>
      </div>
      <div className="rs-hint">
        Each case was selected to illustrate a different way ransomware creates organizational pressure. Click a case to read it across the paper's five analytic themes.
      </div>

      <div className="rs-case-tabs">
        {CASES.map((x) => {
          const on = x.id === sel;
          const a = TONE[x.accent] || C.cyan;
          return (
            <button
              key={x.id}
              className={"rs-case-tab" + (on ? " on" : "")}
              onClick={() => setSel(x.id)}
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

        <div className="rs-case-srcs">
          {c.sources.map((s) => <SourceLink key={s.url} {...s} />)}
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
        <span><ListChecks size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> MAJOR FINDINGS</span>
        <span className="rs-src-tag">Paper — Results · Cross-Case Findings</span>
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
        <span className="rs-src-tag">Paper — Discussion · NIST IR 8374 structure</span>
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
    </section>
  );
}

/* --------------------------- Pay or not ---------------------------- */

export function PayPanel() {
  return (
    <section className="rs-card rs-pay">
      <div className="rs-card-h rs-th">
        <span><Scale size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> SHOULD ORGANIZATIONS PAY THE RANSOM?</span>
        <span className="rs-src-tag">Paper — the argument behind the title</span>
      </div>
      <div className="rs-hint">{PAY.intro}</div>

      <div className="rs-pay-grid">
        <div className="rs-pay-col rs-pay-no">
          <div className="rs-pay-h" style={{ color: C.red }}>
            <Ban size={13} strokeWidth={2.4} /> WHAT A PAYMENT DOES NOT BUY
          </div>
          <ul>{PAY.notBuying.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="rs-pay-col rs-pay-yes">
          <div className="rs-pay-h" style={{ color: C.green }}>
            <CheckCircle2 size={13} strokeWidth={2.4} /> WHAT PREPARATION BUYS
          </div>
          <ul>{PAY.buying.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>

      <div className="rs-pay-positions">
        {PAY.positions.map((p) => (
          <div className="rs-pos" key={p.who}>
            <span className="rs-pos-who">{p.who}</span>
            <span className="rs-pos-what">{p.what}</span>
          </div>
        ))}
      </div>

      <div className="rs-pay-close">
        <span className="rs-wolf">“To pay a ransom is to feed the wolf.”</span>
        {PAY.close}
      </div>
    </section>
  );
}

/* ------------------- Methodology, limits, sources ------------------- */

export function MethodNotes() {
  const [tab, setTab] = useState("method");
  const TABS = [
    { k: "method", label: "METHODOLOGY" },
    { k: "limits", label: "LIMITATIONS" },
    { k: "future", label: "FUTURE WORK" },
    { k: "refs", label: `REFERENCES (${REFERENCES.length})` },
  ];
  return (
    <section className="rs-card">
      <div className="rs-card-h rs-th">
        <span><BookOpen size={14} strokeWidth={2.2} style={{ color: C.cyan }} /> HOW THIS WAS RESEARCHED</span>
        <div className="rs-filters">
          {TABS.map((t) => (
            <button key={t.k}
              className={"rs-filter" + (tab === t.k ? " on" : "")}
              onClick={() => setTab(t.k)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "method" && (
        <div className="rs-method">
          <p className="rs-method-p">{METHOD.design}</p>
          <div className="rs-hier">
            {METHOD.hierarchy.map((h) => (
              <div className="rs-hier-row" key={h.rank}>
                <span className="rs-hier-n">{h.rank}</span>
                <div>
                  <div className="rs-hier-l">{h.label}</div>
                  <div className="rs-hier-d">{h.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="rs-method-p">{METHOD.selection}</p>
        </div>
      )}

      {tab === "limits" && (
        <ul className="rs-bullets">
          {METHOD.limits.map((l) => <li key={l}>{l}</li>)}
        </ul>
      )}

      {tab === "future" && (
        <ul className="rs-bullets">
          {FUTURE_WORK.map((f) => <li key={f}>{f}</li>)}
        </ul>
      )}

      {tab === "refs" && (
        <ol className="rs-refs">
          {REFERENCES.map((r) => (
            <li key={r.cite}>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.cite} <ExternalLink size={10} style={{ opacity: 0.7 }} />
                </a>
              ) : (
                <span>{r.cite}</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/* ------------------------------ CSS -------------------------------- */

export const paperCss = `
.rs-src-tag{font-size:10px;letter-spacing:0.6px;color:${C.faint};
  font-family:ui-monospace,monospace;text-transform:none;font-weight:500;}
.rs-src-link{display:inline-flex;align-items:center;gap:5px;font-size:11px;
  color:${C.cyan};text-decoration:none;border:1px solid ${C.cyan}33;
  background:${C.cyan}0e;border-radius:7px;padding:4px 9px;transition:filter .14s;}
.rs-src-link:hover{filter:brightness(1.35);}

/* --- paper band --- */
.rs-paper-course{font-size:10.5px;letter-spacing:0.8px;color:${C.muted};
  font-family:ui-monospace,monospace;text-transform:none;font-weight:500;}
.rs-paper-grid{display:grid;grid-template-columns:1fr 340px;gap:26px;}
.rs-paper-title{margin:0;font-size:26px;font-weight:800;letter-spacing:0.2px;
  line-height:1.15;color:${C.text};}
.rs-paper-sub{margin-top:5px;font-size:14px;color:#C3CBDA;line-height:1.4;}
.rs-paper-by{margin-top:11px;font-size:11.5px;color:${C.muted};
  font-family:ui-monospace,monospace;}
.rs-paper-inst{margin-top:2px;font-size:11px;color:${C.faint};
  font-family:ui-monospace,monospace;}
.rs-thesis{display:flex;gap:9px;margin:15px 0 0;padding:12px 14px;
  border-left:2px solid ${C.cyan};background:${C.cyan}0d;border-radius:0 9px 9px 0;
  font-size:13px;line-height:1.55;color:#D7DCE7;}
.rs-abs-toggle{margin-top:13px;}
.rs-abstract{margin:11px 0 0;font-size:12.5px;line-height:1.65;color:#BFC7D6;
  padding:12px 14px;background:${C.panel2};border:1px solid ${C.line};border-radius:10px;}
.rs-rqs{background:${C.panel2};border:1px solid ${C.line};border-radius:12px;padding:15px;}
.rs-rq-h{font-size:10.5px;letter-spacing:1.2px;color:${C.muted};font-weight:700;
  font-family:ui-monospace,monospace;margin-bottom:11px;}
.rs-rq{display:flex;gap:10px;font-size:12.5px;line-height:1.5;color:#D0D7E4;
  padding:9px 0;border-top:1px solid ${C.lineSoft};}
.rs-rq:first-of-type{border-top:none;padding-top:0;}
.rs-rq-n{color:${C.cyan};font-family:ui-monospace,monospace;font-weight:700;
  font-size:12px;flex:none;}

/* --- attack chain --- */
.rs-chain{display:flex;align-items:stretch;gap:4px;margin-top:6px;}
.rs-chain-step{flex:1;background:${C.panel2};border:1px solid ${C.line};
  border-radius:11px;padding:13px 14px;min-width:0;}
.rs-chain-n{font-family:ui-monospace,monospace;font-size:11px;color:${C.cyan};
  font-weight:700;letter-spacing:1px;}
.rs-chain-stage{font-size:13.5px;font-weight:700;color:${C.text};margin-top:3px;}
.rs-chain-list{margin:9px 0 0;padding-left:15px;font-size:12px;line-height:1.65;
  color:${C.muted};}
.rs-chain-arrow{display:grid;place-items:center;color:${C.faint};flex:none;}

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
.rs-case-themes{margin-top:15px;display:flex;flex-direction:column;gap:12px;}
.rs-case-theme{display:grid;grid-template-columns:186px 1fr;gap:16px;align-items:start;}
.rs-case-theme-l{font-size:10px;letter-spacing:1px;color:${C.muted};font-weight:700;
  font-family:ui-monospace,monospace;padding:2px 0 2px 11px;border-left:2px solid;}
.rs-case-theme-b{font-size:13px;line-height:1.6;color:#D2D8E4;}
.rs-case-srcs{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px;
  padding-top:14px;border-top:1px solid ${C.line};}

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

/* --- pay --- */
.rs-pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:6px;}
.rs-pay-col{border:1px solid ${C.line};border-radius:11px;padding:13px 15px;
  background:${C.panel2};}
.rs-pay-no{border-color:${C.red}33;background:${C.red}0b;}
.rs-pay-yes{border-color:${C.green}33;background:${C.green}0b;}
.rs-pay-h{display:flex;align-items:center;gap:6px;font-size:10.5px;letter-spacing:1px;
  font-weight:700;font-family:ui-monospace,monospace;margin-bottom:9px;}
.rs-pay-col ul{margin:0;padding-left:16px;font-size:12.5px;line-height:1.75;color:#D2D8E4;}
.rs-pay-positions{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:11px;}
.rs-pos{background:${C.panel2};border:1px solid ${C.line};border-radius:11px;
  padding:12px 14px;}
.rs-pos-who{display:block;font-size:10.5px;letter-spacing:1.2px;font-weight:700;
  color:${C.cyan};font-family:ui-monospace,monospace;margin-bottom:6px;}
.rs-pos-what{font-size:12.5px;line-height:1.55;color:#D2D8E4;}
.rs-pay-close{margin-top:13px;padding:14px 16px;border-radius:11px;
  border:1px solid ${C.line};background:${C.ink};font-size:13px;line-height:1.6;
  color:#D2D8E4;}
.rs-wolf{display:block;font-size:15px;font-weight:700;color:${C.red};
  margin-bottom:7px;letter-spacing:0.2px;}

/* --- method / limits / refs --- */
.rs-method-p{margin:0 0 13px;font-size:13px;line-height:1.6;color:#D2D8E4;}
.rs-hier{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.rs-hier-row{display:flex;gap:12px;align-items:flex-start;background:${C.panel2};
  border:1px solid ${C.line};border-radius:10px;padding:11px 13px;}
.rs-hier-n{font-family:ui-monospace,monospace;font-size:14px;font-weight:800;
  color:${C.cyan};flex:none;width:16px;}
.rs-hier-l{font-size:12.5px;font-weight:700;color:${C.text};}
.rs-hier-d{font-size:12px;line-height:1.55;color:${C.muted};margin-top:3px;}
.rs-bullets{margin:0;padding-left:18px;font-size:13px;line-height:1.7;color:#D2D8E4;}
.rs-bullets li{margin-bottom:7px;}
.rs-refs{margin:0;padding-left:20px;font-size:12.5px;line-height:1.65;color:${C.muted};}
.rs-refs li{margin-bottom:7px;}
.rs-refs a{color:${C.text};text-decoration:none;border-bottom:1px solid ${C.line};}
.rs-refs a:hover{color:${C.cyan};border-color:${C.cyan}66;}

@media (max-width: 1080px){
  .rs-paper-grid{grid-template-columns:1fr;}
  .rs-chain{flex-direction:column;}
  .rs-chain-arrow{transform:rotate(90deg);padding:2px 0;}
  .rs-case-tabs{grid-template-columns:repeat(2,1fr);}
  .rs-findings{grid-template-columns:repeat(2,1fr);}
  .rs-def-grid{grid-template-columns:repeat(2,1fr);}
}
@media (max-width: 720px){
  .rs-case-tabs{grid-template-columns:1fr;}
  .rs-case-theme{grid-template-columns:1fr;gap:5px;}
  .rs-findings,.rs-def-grid,.rs-pay-grid,.rs-pay-positions{grid-template-columns:1fr;}
}
`;
