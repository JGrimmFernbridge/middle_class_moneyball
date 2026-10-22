/* The Holy Grail of Distribution — course app
   Compiled to app.js with esbuild. Content lives in content.js (window.COURSE). */
const { useState, useMemo, useEffect, useRef } = React;
const C = window.COURSE;

/* ───────────────────────── helpers ───────────────────────── */
const fmt$ = (n, d = 0) => "$" + Math.round(n).toLocaleString("en-US", { maximumFractionDigits: d });
const pct = (n, d = 0) => (n * 100).toFixed(d) + "%";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TAG = {
  JG: { label: "JG", title: "Jonathan Grimm — his words", cls: "tag tag-jg" },
  RD: { label: "RD", title: "Ray Dalio — inherited idea", cls: "tag tag-rd" },
  HM: { label: "HM", title: "Harry Markowitz — inherited idea", cls: "tag tag-hm" },
  ML: { label: "ML", title: "Michael Lewis's Moneyball and the Oakland A's — inherited frame", cls: "tag tag-ml" },
  CL: { label: "CL", title: "Claude — interpretation or expansion, for Jonathan to keep or cut", cls: "tag tag-cl" },
};
function Tag({ who }) {
  const t = TAG[who] || TAG.CL;
  return <span className={t.cls} title={t.title}>{t.label}</span>;
}
function useHashRoute() {
  const read = () => (location.hash || "#home").replace(/^#/, "").replace(/[^a-z0-9._~-]/gi, "") || "home";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
function Num({ id, label, value, set, min, max, step, prefix, suffix, width }) {
  return (
    <label className="num">
      <span className="num-l">{label}</span>
      <span className="num-f">
        {prefix && <span className="num-x">{prefix}</span>}
        <input id={id} type="number" value={value} min={min} max={max} step={step || 1}
          style={width ? { width } : null}
          onChange={e => set(e.target.value === "" ? 0 : Number(e.target.value))} />
        {suffix && <span className="num-x">{suffix}</span>}
      </span>
    </label>
  );
}
function Range({ id, label, value, set, min, max, step, show }) {
  return (
    <label className="rng">
      <span className="rng-l"><span>{label}</span><strong className="mono">{show}</strong></span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} />
    </label>
  );
}

/* ───────────────────────── layout ───────────────────────── */
function App() {
  const route = useHashRoute();
  const modIdx = C.modules.findIndex(m => m.id === route);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => { setNavOpen(false); }, [route]);
  return (
    <div className="app">
      <header className="top">
        <a href="#home" className="brand" aria-label="Middle Class Moneyball, home">
          <img src="brand/tfp-logo-stacked-light-ink.svg" alt="The Future Poor" className="brand-logo" />
          <span className="brand-txt">
            <span className="brand-k">Let's fix retirement</span>
            <span className="brand-t">{C.title}</span>
          </span>
        </a>
        <button className="navbtn" onClick={() => setNavOpen(o => !o)} aria-expanded={navOpen} aria-controls="sidenav">
          {navOpen ? "Close" : "Modules"}
        </button>
      </header>
      <div className={"frame" + (route === "home" ? " frame-home" : "")}>
        <nav id="sidenav" className={"side" + (navOpen ? " open" : "")} aria-label="Course modules">
          <a href="#home" className={"side-a" + (route === "home" ? " on" : "")}>Start here</a>
          {C.modules.map((m, i) => (
            <React.Fragment key={m.id}>
              {m.part !== "Start here" && (i === 0 || C.modules[i - 1].part !== m.part) && <div className="side-part">{m.part}</div>}
              <a href={"#" + m.id} className={"side-a" + (route === m.id ? " on" : "")}>
                <span className="side-n mono">{m.number}</span><span>{m.title}</span>
              </a>
            </React.Fragment>
          ))}
          <div className="side-sep" />
          <a href="#notebook" className={"side-a" + (route === "notebook" ? " on" : "")}>From the notebook</a>
          <a href="#lineage" className={"side-a" + (route === "lineage" ? " on" : "")}>Lineage &amp; attribution</a>
        </nav>
        <main className="main">
          {route === "home" && <Home />}
          {route === "notebook" && <Notebook />}
          {route === "lineage" && <Lineage />}
          {modIdx >= 0 && <Module m={C.modules[modIdx]} idx={modIdx} />}
          {route !== "home" && route !== "notebook" && route !== "lineage" && modIdx < 0 && <Home />}
        </main>
      </div>
      <footer className="foot">
        <div className="foot-in">
          <img src="brand/tfp-logo-stacked-light-ink.svg" alt="The Future Poor" className="foot-logo" />
          <div className="foot-txt">
            <p className="foot-line">Middle Class Moneyball and the Holy Grail of Distribution are the work of {C.author}. The interactive models are teaching illustrations with hypothetical figures, not projections and not Otto.</p>
            <div className="tfp-disclosure"><span className="tfp-disclosure__label">Disclosures</span><span>For educational content only, not investment, insurance, tax or legal advice. As a fiduciary, Jonathan and his team offer professional financial advice through Fernbridge Advisors, LLC. <a href="https://www.fernbridge.us">www.fernbridge.us</a></span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────── home ───────────────────────── */
const STRIP = [
  ["Dollars buy players. Players score runs. Runs win the financial game of life.", "The Future Poor"],
  ["I hate to break it to you, but there is no financial super star.", "Middle Class Moneyball notes"],
  ["Using your $ is where all the risk is.", "Holy Grail notes"],
  ["What you need money for is more important than how much money you have.", "Holy Grail deck"],
  ["Less tools = less types = less money, for life.", "Moneyball notes"],
  ["Every strength is a weakness.", "Podcast, Moneyball part 3"],
  ["We are reinventing retirement so that people don't really do it.", "Course notes"],
];
const FILLS = ["navy", "diamond", "pearl", "sage", "gold", "navy", "pearl", "sage", "pearl"];
const SPANS = [4, 2, 2, 2, 2, 3, 3, 3, 3];
function QuoteStrip() {
  const run = STRIP.map(([q], i) => <React.Fragment key={i}><span>“{q}”</span><span className="tfp-quotes__star" aria-hidden="true">✦</span></React.Fragment>);
  return (
    <div className="tfp-quotes strip" aria-label="Lines from Jonathan Grimm">
      <div className="tfp-quotes__track">{run}<span aria-hidden="true" className="strip-dup">{run}</span></div>
    </div>
  );
}
function Home() {
  return (
    <div className="home">
      <section className="tfp-bento">
        <div className="tfp-tile tfp-tile--navy tfp-tile--span6 hero-tile">
          <span className="tfp-tile__eyebrow">A course by {C.author}</span>
          <h1 className="h-display">{C.title} <em>{C.titleEm}</em></h1>
          <p className="hero-lede">“Most people see a problem with the player — you. I see a problem with the game.” <Tag who="JG" /></p>
          <div className="tfp-row">
            <a className="tfp-btn tfp-btn--gold" href="#orientation">Start the course →</a>
            <a className="tfp-btn tfp-btn--outline on-navy" href="#notebook">See the original notes</a>
          </div>
        </div>
      </section>

      <QuoteStrip />

      <section className="home-sec">
        <p className="eyebrow">Stop trying to fit a broken game</p>
        <h2 className="h2">The course</h2>
        <div className="tfp-bento">
          {C.modules.map((m, i) => (
            <a key={m.id} href={"#" + m.id} className={"tfp-tile tfp-tile--" + FILLS[i % FILLS.length] + " tfp-tile--span" + SPANS[i % SPANS.length]}>
              <span className="tfp-tile__eyebrow">{m.number} · {m.part}</span>
              <span className="tfp-tile__title">{m.title}</span>
              <span className="tile-line">{m.bookLesson ? "Middle Class Moneyball · " + m.bookLesson : m.kicker}</span>
              <span className="tfp-tile__cta">Open →</span>
            </a>
          ))}
          <a href="#notebook" className="tfp-tile tfp-tile--pearl tfp-tile--span3">
            <span className="tfp-tile__eyebrow">Provenance</span>
            <span className="tfp-tile__title">From the notebook</span>
            <span className="tile-line">The handwritten pages, dated where they can be.</span>
            <span className="tfp-tile__cta">Open →</span>
          </a>
          <a href="#lineage" className="tfp-tile tfp-tile--sage tfp-tile--span3">
            <span className="tfp-tile__eyebrow">Attribution</span>
            <span className="tfp-tile__title">Lineage &amp; attribution</span>
            <span className="tile-line">What is Jonathan's, what he inherited, and what Claude drafted.</span>
            <span className="tfp-tile__cta">Open →</span>
          </a>
        </div>
      </section>

      <section className="home-sec">
        <p className="eyebrow">The story, the math, the old manual, the synthesis</p>
        <h2 className="h2">Where the idea comes from</h2>
        <div className="lin-row">
          {C.lineage.map(l => (
            <div key={l.who} className={"lin " + (l.tag === "JG" ? "lin-jg" : "")}>
              <div className="lin-top"><Tag who={l.tag} /><span className="muted">{l.role} · {l.year}</span></div>
              <div className="lin-who">{l.who}</div>
              <div className="lin-idea">{l.idea}</div>
              <p className="lin-note">{l.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-sec">
        <div className="ix">
          <div className="ix-head"><p className="eyebrow">How you get more out of less</p><h2 className="h3">Same wins, a third of the price</h2></div>
          <CostPerWin />
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── module page ───────────────────────── */
function Module({ m, idx }) {
  const prev = C.modules[idx - 1], next = C.modules[idx + 1];
  return (
    <article className="page">
      <header className="mhead">
        <p className="eyebrow"><span className="mono">Module {m.number}</span> · {m.part} · {m.kicker}</p>
        <h1 className="h1">{m.title}</h1>
        <p className="lede">{m.summary} <Tag who="CL" /></p>
        {m.bookLesson && <p className="booklesson"><span className="mbp-ball sm" aria-hidden="true" /> Middle Class Moneyball · {m.bookLesson}</p>}
      </header>

      <section className="sec">
        <h2 className="h3">In Jonathan's words</h2>
        <div className="quotes">
          {m.quotes.map((q, i) => (
            <blockquote key={i} className="q">
              <p>“{q.text}”</p>
              <footer><Tag who={q.who} /> <span>{q.src}</span></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <Interactive id={m.id} m={m} />

      {m.claude && (
        <section className="sec cl-box">
          <div className="cl-head"><Tag who="CL" /><h2 className="h3">{m.claude.heading}</h2></div>
          <p>{m.claude.body}</p>
        </section>
      )}

      <section className="sec lesson">
        <div className="lesson-head"><Tag who="JG" /><h2 className="h3">Jonathan's lesson</h2></div>
        {m.lesson ? <div className="lesson-body">{m.lesson}</div> : (
          <p className="lesson-empty">Reserved for Jonathan's own lesson text. Edit the <code>lesson</code> field for <code>{m.id}</code> in <code>content.js</code>.</p>
        )}
      </section>

      <nav className="pn">
        {prev ? <a href={"#" + prev.id} className="pn-a">← {prev.number}. {prev.kicker}</a> : <span />}
        {next ? <a href={"#" + next.id} className="pn-a">{next.number}. {next.kicker} →</a> : <a href="#notebook" className="pn-a">From the notebook →</a>}
      </nav>
    </article>
  );
}

function Interactive({ id, m }) {
  switch (id) {
    case "moneyball": return (
      <>
        <Sec title="Two ways to win" note="Bill James's run-differential formula: expected wins from runs scored and runs allowed. Move either side."><RunDifferential /></Sec>
        <Sec title="Cost per win" note="Same number of wins, same season. From Jonathan's notes."><CostPerWin /></Sec>
        <Sec title="The ten lessons" note="The book map, as Jonathan wrote it. The rest of this course follows it."><Lessons items={m.lessons} /></Sec>
        <Sec title="Reading Moneyball" note="The passages Jonathan marked in Michael Lewis's book, with his margin notes and where each one shows up in this course."><LewisNotes /></Sec>
      </>
    );
    case "old-game": return (
      <>
        <Sec title="Player or game?" note="The usual diagnosis on the left. Flip each card to see the game behind it, in Jonathan's numbers."><PlayerGame items={m.playerGame} /></Sec>
        <Sec title="The flip" note="Toggle the order and watch what changes."><TwoUniverses /></Sec>
        <Sec title="The dartboard" note="The industry's target versus a set of situations with a player for each."><Dartboard /></Sec>
      </>
    );
    case "types-of-money": return (
      <>
        <Sec title="Types of money" note="Jonathan's 'Big Paradigm': every dollar sits on three switches. Tap tools to build a roster and see which pairings are hedged."><TypesOfMoney /></Sec>
        <Sec title="The exchange rate" note="How many saved dollars does it take to put one spendable dollar in your hand?"><ExchangeRate /></Sec>
        <Sec title="A slump in the wrong year" note="Same returns, same withdrawals, opposite order."><SequenceDemo /></Sec>
      </>
    );
    case "risk-universe": return <Sec title="The scouting report" note="Four families from Jonathan's spreadsheet. Tap a risk to see which tools answer it (Claude's draft mapping)."><RiskGrid /></Sec>;
    case "holy-grail": return (
      <>
        <Sec title="The math: Dalio's curve" note="Risk left in a portfolio of N equally risky return streams with pairwise correlation ρ."><DalioCurve /></Sec>
        <Sec title="The lineup" note="Switch on different kinds of tools. Every different one takes 5 points of lifetime risk off the table."><ToolStack /></Sec>
      </>
    );
    case "plan-backwards": return <Sec title="Every pitch is a new situation" note="Pick a roster, then hit a ball. Tap a position or press Next pitch."><Diamond /></Sec>;
    case "magic-circle": return <Sec title="The Magic Circle, scored" note="Type hypothetical figures into the seven rings. The score follows 'The Algorithm' sheet in Jonathan's spreadsheet."><MagicCircle /></Sec>;
    case "built-in": return <Sec title="Three resolutions of one idea"><Stack items={m.stack} /></Sec>;
    default: return null;
  }
}
function Sec({ title, note, children }) {
  return (
    <section className="sec ix">
      <div className="ix-head"><h2 className="h3">{title}</h2>{note && <p className="muted">{note}</p>}</div>
      {children}
    </section>
  );
}

/* ───────────────────────── 1. two universes ───────────────────────── */
function dalioRisk(n, rho) { return Math.sqrt(1 / n + rho * (1 - 1 / n)); }
function TwoUniverses({ compact }) {
  const [order, setOrder] = useState("DA");
  const W = 320, H = 200, pad = { l: 36, r: 12, t: 16, b: 30 };
  const px = i => pad.l + (i - 1) / 19 * (W - pad.l - pad.r);
  const py = v => pad.t + (1 - v) * (H - pad.t - pad.b);
  const rhos = [0, 0.1, 0.3, 0.6];
  const layers = 6;
  const dx = i => pad.l + i / layers * (W - pad.l - pad.r);
  // distribution: risk rises as money is used; each added tool layer lowers the curve
  const distCurve = k => {
    const top = 1 - k * 0.15;
    return Array.from({ length: 21 }, (_, i) => {
      const t = i / 20;
      const v = top * (1 - Math.exp(-4 * t)) ;
      return [pad.l + t * (W - pad.l - pad.r), py(v)];
    });
  };
  return (
    <div className={"tu" + (compact ? " tu-c" : "")}>
      <div className="tu-order">
        <button className={"pill" + (order === "AD" ? " on" : "")} onClick={() => setOrder("AD")}>Accumulation → Distribution</button>
        <button className={"pill" + (order === "DA" ? " on" : "")} onClick={() => setOrder("DA")}>Distribution → Accumulation</button>
      </div>
      <div className="tu-grid">
        <figure className="fig">
          <figcaption><Tag who="RD" /> Accumulation: more uncorrelated streams, less risk</figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Risk falling as return streams are added">
            <line x1={pad.l} y1={py(0)} x2={W - pad.r} y2={py(0)} className="ax" />
            <line x1={pad.l} y1={py(1)} x2={pad.l} y2={py(0)} className="ax" />
            {rhos.map((r, k) => (
              <path key={r} className={"ln ln" + k} d={Array.from({ length: 20 }, (_, i) => `${i ? "L" : "M"}${px(i + 1).toFixed(1)},${py(dalioRisk(i + 1, r)).toFixed(1)}`).join(" ")} />
            ))}
            {rhos.map((r, k) => <text key={r} x={W - pad.r - 2} y={py(dalioRisk(20, r)) - 3} className="lbl" textAnchor="end">ρ={r}</text>)}
            <text x={pad.l} y={H - 8} className="lbl">1 stream</text>
            <text x={W - pad.r} y={H - 8} className="lbl" textAnchor="end">20 streams</text>
            <text x={10} y={py(1) + 4} className="lbl">risk</text>
            <text x={10} y={py(0.02)} className="lbl">0</text>
          </svg>
        </figure>
        <figure className="fig">
          <figcaption><Tag who="JG" /> Distribution: risk rises as money is used; each kind of tool lowers it</figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Distribution risk rising with use, lowered by each tool layer">
            <line x1={pad.l} y1={py(0)} x2={W - pad.r} y2={py(0)} className="ax" />
            <line x1={pad.l} y1={py(1)} x2={pad.l} y2={py(0)} className="ax" />
            {Array.from({ length: layers + 1 }, (_, k) => (
              <path key={k} className={"ln ln" + (k % 4)} style={{ opacity: 1 - k * 0.11 }} d={distCurve(k).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} />
            ))}
            <text x={W - pad.r - 2} y={py(0.98) + 10} className="lbl" textAnchor="end">0 tools</text>
            <text x={W - pad.r - 2} y={py(0.12) - 3} className="lbl" textAnchor="end">6 kinds of tools</text>
            <text x={pad.l} y={H - 8} className="lbl">start using money</text>
            <text x={W - pad.r} y={H - 8} className="lbl" textAnchor="end">years of use</text>
            <text x={10} y={py(1) + 4} className="lbl">risk</text>
          </svg>
        </figure>
      </div>
      <div className={"tu-read " + (order === "AD" ? "bad" : "good")}>
        {order === "AD" ? (
          <>
            <strong>The industry's order.</strong> Grow the biggest pile you can, then at sixty find out what it buys. Every distribution risk is inherited at the end, and the tools that answer them may be unaffordable or unavailable by then. <em>“Good for firms, then you.”</em>
          </>
        ) : (
          <>
            <strong>Jonathan's order.</strong> Name the jobs the money will have to do, choose the tools that do each job well, and let that decide where to accumulate. The risks are answered before they arrive. <em>“Good for you, then firms.”</em>
          </>
        )}
        <span className="src"><Tag who="JG" /> Handwritten 'Dalio notes'</span>
      </div>
    </div>
  );
}

/* ───────────────────────── 2. dalio curve ───────────────────────── */
function DalioCurve() {
  const [n, setN] = useState(1);
  const [rho, setRho] = useState(0.1);
  const r = dalioRisk(n, rho);
  const W = 420, H = 230, pad = { l: 40, r: 14, t: 14, b: 30 };
  const px = i => pad.l + (i - 1) / 19 * (W - pad.l - pad.r);
  const py = v => pad.t + (1 - v) * (H - pad.t - pad.b);
  return (
    <div className="ix-grid">
      <div className="ctrl">
        <Range id="dal-n" label="Return streams (N)" min={1} max={20} step={1} value={n} set={setN} show={n} />
        <Range id="dal-r" label="Correlation between them (ρ)" min={0} max={0.9} step={0.05} value={rho} set={setRho} show={rho.toFixed(2)} />
        <div className="stat-row">
          <div className="stat"><span className="stat-l">Risk remaining</span><span className="stat-v mono">{pct(r)}</span></div>
          <div className="stat"><span className="stat-l">Risk removed</span><span className="stat-v mono">{pct(1 - r)}</span></div>
          <div className="stat"><span className="stat-l">Expected return</span><span className="stat-v mono">unchanged</span></div>
        </div>
        <p className="muted small">With ρ = 0, twenty streams remove about 78% of the risk. With ρ = 0.6, twenty streams remove about 21%, and most of that came from the second one. <Tag who="CL" /></p>
      </div>
      <figure className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart">
          <line x1={pad.l} y1={py(0)} x2={W - pad.r} y2={py(0)} className="ax" />
          <line x1={pad.l} y1={py(1)} x2={pad.l} y2={py(0)} className="ax" />
          {[0.25, 0.5, 0.75, 1].map(v => <g key={v}><line x1={pad.l} y1={py(v)} x2={W - pad.r} y2={py(v)} className="grid" /><text x={pad.l - 4} y={py(v) + 3} className="lbl" textAnchor="end">{v * 100}%</text></g>)}
          <path className="ln ln0" d={Array.from({ length: 20 }, (_, i) => `${i ? "L" : "M"}${px(i + 1).toFixed(1)},${py(dalioRisk(i + 1, rho)).toFixed(1)}`).join(" ")} />
          <circle cx={px(n)} cy={py(r)} r={5} className="dot" />
          <text x={px(n) + 8} y={py(r) - 8} className="lbl strong">{n} stream{n > 1 ? "s" : ""}: {pct(r)}</text>
          {[1, 5, 10, 15, 20].map(i => <text key={i} x={px(i)} y={H - 8} className="lbl" textAnchor="middle">{i}</text>)}
          <text x={W / 2} y={H - 18} className="lbl" textAnchor="middle" style={{ opacity: .6 }}>uncorrelated return streams</text>
        </svg>
      </figure>
    </div>
  );
}

/* ───────────────────────── 3a. exchange rate ───────────────────────── */
function ExchangeRate() {
  const [need, setNeed] = useState(100000);
  const [fed, setFed] = useState(22);
  const [state, setState] = useState(9.3);
  const [cg, setCg] = useState(15);
  const [gainShare, setGainShare] = useState(50);
  const rows = useMemo(() => {
    const inc = (fed + state) / 100;
    const r = [
      { tool: "401(k) / IRA before 59½", ring: "growth", rate: 1 - inc - 0.10, note: "10% penalty + income tax" },
      { tool: "401(k) / IRA after 59½", ring: "growth", rate: 1 - inc, note: "income tax" },
      { tool: "Brokerage (sell shares)", ring: "growth", rate: 1 - (cg + state) / 100 * gainShare / 100, note: `capital gains on the ${gainShare}% that is gain` },
      { tool: "Roth IRA contributions", ring: "taxfree", rate: 1, note: "no tax, no penalty, any age" },
      { tool: "Cash value by policy loan", ring: "capital", rate: 1, note: "a loan, not income; the dollar keeps working" },
      { tool: "HSA, for medical bills", ring: "medical", rate: 1, note: "never taxed when used for its job" },
    ];
    return r.map(x => ({ ...x, gross: need / x.rate }));
  }, [need, fed, state, cg, gainShare]);
  const ringColor = id => (C.rings.find(r => r.id === id) || {}).color;
  const maxG = Math.max(...rows.map(r => r.gross));
  return (
    <div>
      <div className="ctrl-row">
        <Num id="er-need" label="Dollars you need in hand" value={need} set={setNeed} min={0} step={1000} prefix="$" width="8.5em" />
        <Num id="er-fed" label="Federal rate" value={fed} set={setFed} min={0} max={50} step={1} suffix="%" width="4.5em" />
        <Num id="er-st" label="State rate" value={state} set={setState} min={0} max={15} step={0.1} suffix="%" width="4.5em" />
        <Num id="er-cg" label="Capital gains rate" value={cg} set={setCg} min={0} max={30} step={1} suffix="%" width="4.5em" />
        <Num id="er-gs" label="Brokerage: share that is gain" value={gainShare} set={setGainShare} min={0} max={100} step={5} suffix="%" width="4.5em" />
      </div>
      <div className="bars">
        {rows.map(r => (
          <div key={r.tool} className="bar-row">
            <div className="bar-l"><span className="swatch" style={{ background: ringColor(r.ring) }} />{r.tool}<span className="muted small"> · {r.note}</span></div>
            <div className="bar-t"><div className="bar-f" style={{ width: pct(r.gross / maxG), background: ringColor(r.ring) }} /></div>
            <div className="bar-v mono">{fmt$(r.gross)} <span className="muted">out for {fmt$(need)} in hand · rate {pct(r.rate)}</span></div>
          </div>
        ))}
      </div>
      <p className="muted small">Jonathan's own example: $100,000 out of a 401(k) before 59½ in California left about $71,000, and getting $100,000 in hand took about $155,000 out. The 22% + 9.3% defaults reproduce that. <Tag who="JG" /> Episode 3 prep notes. Simplified: flat rates, no brackets or deductions. <Tag who="CL" /></p>
    </div>
  );
}

/* ───────────────────────── 3b. sequence of returns ───────────────────────── */
const SEQ = [-9, -12, -22, 28, 11, 5, 16, 6, -37, 26, 15, 2, 16, 32, 14];
function runSeq(returns, start, wd) {
  let b = start; const path = [b];
  for (const r of returns) { b = (b - wd) * (1 + r / 100); b = Math.max(0, b); path.push(b); }
  return path;
}
function SequenceDemo() {
  const [start, setStart] = useState(500000);
  const [wd, setWd] = useState(25000);
  const fwd = runSeq(SEQ, start, wd), rev = runSeq([...SEQ].reverse(), start, wd);
  const avg = SEQ.reduce((a, b) => a + b, 0) / SEQ.length;
  const W = 480, H = 220, pad = { l: 50, r: 12, t: 14, b: 28 };
  const maxV = Math.max(...fwd, ...rev) * 1.05 || 1;
  const px = i => pad.l + i / SEQ.length * (W - pad.l - pad.r);
  const py = v => pad.t + (1 - v / maxV) * (H - pad.t - pad.b);
  const line = p => p.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  return (
    <div className="ix-grid">
      <div className="ctrl">
        <Num id="sq-start" label="Starting balance" value={start} set={setStart} min={0} step={10000} prefix="$" width="8.5em" />
        <Num id="sq-wd" label="Withdrawn each year" value={wd} set={setWd} min={0} step={1000} prefix="$" width="8.5em" />
        <div className="stat-row">
          <div className="stat"><span className="stat-l">Average return (both)</span><span className="stat-v mono">{avg.toFixed(1)}%</span></div>
          <div className="stat"><span className="stat-l">Ends with, losses first</span><span className="stat-v mono bad-t">{fmt$(fwd[fwd.length - 1])}</span></div>
          <div className="stat"><span className="stat-l">Ends with, gains first</span><span className="stat-v mono good-t">{fmt$(rev[rev.length - 1])}</span></div>
        </div>
        <p className="muted small">An illustrative 15-year sequence. Both lines use the same fifteen annual returns and the same withdrawals; only the order differs. Without withdrawals the two would end in the same place. <Tag who="CL" /></p>
      </div>
      <figure className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart">
          <line x1={pad.l} y1={py(0)} x2={W - pad.r} y2={py(0)} className="ax" />
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={py(0)} className="ax" />
          {[0.5, 1].map(f => <g key={f}><line x1={pad.l} y1={py(maxV * f / 1.05)} x2={W - pad.r} y2={py(maxV * f / 1.05)} className="grid" /><text x={pad.l - 4} y={py(maxV * f / 1.05) + 3} className="lbl" textAnchor="end">{fmt$(maxV * f / 1.05 / 1000)}k</text></g>)}
          <path className="ln ln-bad" d={line(fwd)} />
          <path className="ln ln-good" d={line(rev)} />
          <text x={px(SEQ.length)} y={py(fwd[fwd.length - 1]) + 12} className="lbl bad-t" textAnchor="end">losses first</text>
          <text x={px(SEQ.length)} y={py(rev[rev.length - 1]) - 6} className="lbl good-t" textAnchor="end">gains first</text>
          {[0, 5, 10, 15].map(i => <text key={i} x={px(i)} y={H - 8} className="lbl" textAnchor="middle">yr {i}</text>)}
        </svg>
      </figure>
    </div>
  );
}

/* ───────────────────────── 4. risk grid ───────────────────────── */
function RiskGrid() {
  const [sel, setSel] = useState("sequence of returns");
  const tools = C.tools.filter(t => t.answers.includes(sel));
  const ring = id => C.rings.find(r => r.id === id);
  const total = C.riskFamilies.reduce((a, f) => a + f.risks.length, 0);
  return (
    <div>
      <div className="rg">
        {C.riskFamilies.map(f => (
          <div key={f.id} className="rg-fam">
            <div className="rg-h"><span>{f.name}</span><span className="mono muted">{f.risks.length}</span></div>
            <div className="rg-list">
              {f.risks.map(r => <button key={r} className={"chip" + (r === sel ? " on" : "")} onClick={() => setSel(r)}>{r}</button>)}
            </div>
          </div>
        ))}
      </div>
      <div className="rg-ans">
        <div className="rg-ans-h"><span className="muted">{total} risks. Selected:</span> <strong>{sel}</strong></div>
        {tools.length ? (
          <ul className="rg-tools">
            {tools.map(t => <li key={t.id}><span className="swatch" style={{ background: ring(t.ring).color }} />{t.name}<span className="muted"> · {ring(t.ring).name} ring</span></li>)}
          </ul>
        ) : (
          <p className="muted">No single tool answers this one in the draft mapping. This is the kind of risk a plan answers with orchestration, a floor, and community, rather than a product. <Tag who="CL" /></p>
        )}
        <p className="muted small">Market risk is one of {total}. <Tag who="JG" /> spreadsheet, 'Risk Factors Being Accounted For'. Tool pairings are a draft. <Tag who="CL" /></p>
      </div>
    </div>
  );
}

/* ───────────────────────── 5. tool stack ───────────────────────── */
function ToolStack() {
  const [on, setOn] = useState(() => new Set(["k401"]));
  const toggle = id => setOn(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const ring = id => C.rings.find(r => r.id === id);
  const n = on.size;
  const risk = Math.max(0, 100 - 5 * n);
  const answered = useMemo(() => { const s = new Set(); C.tools.forEach(t => { if (on.has(t.id)) t.answers.forEach(a => s.add(a)); }); return s; }, [on]);
  const totalRisks = C.riskFamilies.reduce((a, f) => a + f.risks.length, 0);
  const ringsFilled = new Set(C.tools.filter(t => on.has(t.id)).map(t => t.ring));
  // "8 and 4 is 12": output index. One tool alone = its headline rate; paired tools add because
  // neither has to be sold at the wrong time or in the wrong tax form. Illustrative.
  const output = Math.round(100 * (1 + 0.5 * Math.min(n, 20) / 20 + 0.6 * ringsFilled.size / 7));
  return (
    <div className="ix-grid">
      <div>
        <div className="stat-row">
          <div className="stat big"><span className="stat-l">Lifetime risk left</span><span className={"stat-v mono " + (risk === 0 ? "good-t" : risk < 50 ? "" : "bad-t")}>{risk}%</span></div>
          <div className="stat big"><span className="stat-l">Kinds of tools on</span><span className="stat-v mono">{n} <span className="muted">/ 20</span></span></div>
          <div className="stat big"><span className="stat-l">Risks answered</span><span className="stat-v mono">{answered.size} <span className="muted">/ {totalRisks}</span></span></div>
          <div className="stat big"><span className="stat-l">Output at the moment of use</span><span className="stat-v mono">{output}</span><span className="muted small">one tool alone = 100</span></div>
        </div>
        <div className="meter"><div className="meter-f" style={{ width: (100 - risk) + "%" }} /></div>
        <div className="ts-rings">
          {C.rings.map(r => (
            <div key={r.id} className="ts-ring">
              <div className="ts-ring-h"><span className="swatch" style={{ background: r.color }} />{r.name}{ringsFilled.has(r.id) ? <span className="mono good-t"> ●</span> : <span className="mono muted"> ○ hole</span>}</div>
              <div className="ts-tools">
                {C.tools.filter(t => t.ring === r.id).map(t => (
                  <button key={t.id} className={"chip" + (on.has(t.id) ? " on" : "")} style={on.has(t.id) ? { borderColor: r.color, background: r.color + "22" } : null} onClick={() => toggle(t.id)}>{t.name}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <StackChart n={n} />
        <p className="muted small">The staircase is Jonathan's bottom-right chart: risk running low to high, each kind of tool a step down. 'Every different one −5%.' <Tag who="JG" /> The output index is an illustration of '8 and 4 is 12', not a projection. <Tag who="CL" /></p>
      </div>
    </div>
  );
}
function StackChart({ n }) {
  const W = 460, H = 240, pad = { l: 36, r: 110, t: 14, b: 28 };
  const py = v => pad.t + (1 - v) * (H - pad.t - pad.b);
  const steps = Math.min(n, 20);
  const curve = k => { const top = Math.max(0, 1 - k * 0.05); return Array.from({ length: 21 }, (_, i) => { const t = i / 20; return [pad.l + t * (W - pad.l - pad.r), py(top * (1 - Math.exp(-4 * t)))]; }); };
  const d = pts => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <figure className="fig">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart">
        <line x1={pad.l} y1={py(0)} x2={W - pad.r} y2={py(0)} className="ax" />
        <line x1={pad.l} y1={py(1)} x2={pad.l} y2={py(0)} className="ax" />
        {Array.from({ length: steps + 1 }, (_, k) => <path key={k} className="ln" style={{ stroke: "var(--muted)", opacity: 0.25 }} d={d(curve(k))} />)}
        <path className="ln ln0" style={{ strokeWidth: 2.5 }} d={d(curve(steps))} />
        <path className="ln" style={{ stroke: "var(--bad)", strokeDasharray: "4 4" }} d={d(curve(0))} />
        <text x={W - pad.r + 4} y={py(1) + 4} className="lbl bad-t">0 tools · 100%</text>
        <text x={W - pad.r + 4} y={py(Math.max(0, 1 - steps * 0.05)) + 4} className="lbl strong">{steps} kinds · {Math.max(0, 100 - steps * 5)}%</text>
        <text x={pad.l} y={H - 8} className="lbl">start using money</text>
        <text x={W - pad.r} y={H - 8} className="lbl" textAnchor="end">years of use</text>
        <text x={8} y={py(1) + 4} className="lbl">high</text>
        <text x={8} y={py(0)} className="lbl">low</text>
      </svg>
    </figure>
  );
}

/* ───────────────────────── 7. magic circle ───────────────────────── */
function MagicCircle() {
  const defaults = { income: 6900, capital: 90000, guaranteed: 75000, taxfree: 150000, medical: 2000000, growth: 275000, legacy: 1000000 };
  const [vals, setVals] = useState(defaults);
  const [band, setBand] = useState(40);
  const [years, setYears] = useState(20);
  const set = (id, v) => setVals(s => ({ ...s, [id]: v }));
  const ratios = C.rings.map(r => ({ ...r, value: vals[r.id], ratio: vals[r.id] / r.benchmark }));
  const points = ratios.reduce((a, r) => a + r.ratio, 0);
  const score = points / band;
  const infl = (C.inflationFactors.slice().reverse().find(f => years >= f.years) || { factor: 1 }).factor;
  const adjusted = score * infl;
  return (
    <div className="ix-grid mc">
      <div className="ctrl">
        {C.rings.map(r => (
          <div key={r.id} className="mc-row">
            <span className="swatch" style={{ background: r.color }} />
            <Num id={"mc-" + r.id} label={`${r.name} (${r.unit})`} value={vals[r.id]} set={v => set(r.id, v)} min={0} step={r.id === "income" ? 100 : 5000} prefix="$" width="8em" />
            <span className={"mono small " + (vals[r.id] / r.benchmark >= 1 ? "good-t" : "bad-t")}>{(vals[r.id] / r.benchmark).toFixed(2)}×</span>
          </div>
        ))}
        <label className="num"><span className="num-l">Lifestyle band (household income)</span>
          <select id="mc-band" value={band} onChange={e => setBand(Number(e.target.value))}>
            {C.lifestyleBands.map(b => <option key={b.band} value={b.band}>{b.label} → {b.band}</option>)}
          </select>
        </label>
        <Range id="mc-years" label="Years until the money is needed" min={0} max={40} step={5} value={years} set={setYears} show={`${years} yrs · ×${infl}`} />
        <div className="stat-row">
          <div className="stat"><span className="stat-l">Health points</span><span className="stat-v mono">{points.toFixed(2)}</span></div>
          <div className="stat"><span className="stat-l">Financial Health Score</span><span className="stat-v mono">{pct(score, 1)}</span></div>
          <div className="stat"><span className="stat-l">Adjusted for inflation</span><span className="stat-v mono">{pct(adjusted, 1)}</span></div>
        </div>
        <p className="muted small">Score = Σ(ring total ÷ ring benchmark) ÷ lifestyle band × inflation factor. Benchmarks per ring: {C.rings.map(r => `${r.name} ${fmt$(r.benchmark)}`).join(" · ")}. The defaults are the worked example in the sheet (29.38 points, 73.4%, 58.8% adjusted). <Tag who="JG" /> 'The Algorithm' sheet. Teaching version only; Otto runs the real score. <Tag who="CL" /></p>
      </div>
      <RingDiagram ratios={ratios} />
    </div>
  );
}
function RingDiagram({ ratios }) {
  const S = 480, cx = S / 2, cy = S / 2, r0 = 22, step = 19;
  const arc = (ri, ro) => {
    // full annulus path
    return `M${cx + ro},${cy} A${ro},${ro} 0 1,1 ${cx - ro},${cy} A${ro},${ro} 0 1,1 ${cx + ro},${cy} Z M${cx + ri},${cy} A${ri},${ri} 0 1,0 ${cx - ri},${cy} A${ri},${ri} 0 1,0 ${cx + ri},${cy} Z`;
  };
  return (
    <figure className="fig">
      <svg viewBox={`0 0 ${S} ${S}`} className="chart ring-svg" role="img" aria-label="Magic Circle, seven rings centre out">
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--muted)" strokeWidth="1" opacity="0.5" />
          </pattern>
        </defs>
        {ratios.map((r, i) => {
          const ri = i === 0 ? 0 : r0 + (i - 1) * step, ro = r0 + i * step;
          const cov = clamp(r.ratio, 0, 1);
          return (
            <g key={r.id}>
              {i === 0 ? <circle cx={cx} cy={cy} r={ro} fill={r.color} opacity={0.25 + 0.75 * cov} /> : <path d={arc(ri, ro)} fillRule="evenodd" fill={r.color} opacity={0.25 + 0.75 * cov} />}
              {cov < 1 && (i === 0 ? <circle cx={cx} cy={cy} r={ro} fill="url(#hatch)" /> : <path d={arc(ri, ro)} fillRule="evenodd" fill="url(#hatch)" />)}
              <circle cx={cx} cy={cy} r={ro} fill="none" stroke="var(--bg)" strokeWidth="1.5" />
            </g>
          );
        })}
        {ratios.map((r, i) => {
          const ro = r0 + i * step, rm = i === 0 ? 0 : r0 + (i - 0.5) * step;
          const ang = -Math.PI / 2 + i * (Math.PI * 2 / 7) ;
          const lx = cx + Math.cos(ang) * (r0 + 6.6 * step + 14), ly = cy + Math.sin(ang) * (r0 + 6.6 * step + 14);
          const px = cx + Math.cos(ang) * rm, py = cy + Math.sin(ang) * rm;
          return (
            <g key={r.id + "l"}>
              <line x1={px} y1={py} x2={lx} y2={ly} className="ax" style={{ opacity: .5 }} />
              <text x={lx + Math.cos(ang) * 6} y={ly + Math.sin(ang) * 6 + 3} className={"lbl strong"} textAnchor={Math.cos(ang) < -0.2 ? "end" : Math.cos(ang) > 0.2 ? "start" : "middle"}>{r.name} {r.ratio.toFixed(1)}×</text>
            </g>
          );
        })}
      </svg>
      <figcaption>Centre out: Income, Capital, Guaranteed, Tax-Free, Medical, Growth, Legacy. Hatching marks a ring below its benchmark: a hole. Income and Legacy are the gold bookends. <Tag who="JG" /></figcaption>
    </figure>
  );
}

/* ───────────────────────── 8. dartboard ───────────────────────── */
function Dartboard() {
  const [mode, setMode] = useState("range");
  const jobs = C.diamond;
  return (
    <div>
      <div className="tu-order">
        <button className={"pill" + (mode === "range" ? " on" : "")} onClick={() => setMode("range")}>The industry: one big target</button>
        <button className={"pill" + (mode === "jobs" ? " on" : "")} onClick={() => setMode("jobs")}>Jonathan: a tool for each job</button>
      </div>
      <div className="ix-grid">
        <figure className="fig">
          <svg viewBox={mode === "range" ? "0 0 420 240" : "0 0 420 330"} className="chart">
            {mode === "range" ? (
              <g>
                <rect x="40" y="40" width="340" height="150" rx="6" fill="var(--bad)" opacity="0.12" stroke="var(--bad)" strokeDasharray="5 4" />
                <text x="210" y="110" className="lbl strong" textAnchor="middle" style={{ fontSize: 14 }}>“Somewhere between $500,000 and $5,000,000”</text>
                <text x="210" y="134" className="lbl" textAnchor="middle">one number, one tool, one withdrawal rate</text>
                {[70, 150, 250, 330].map((x, i) => <circle key={i} cx={x} cy={60 + (i % 2) * 110} r="4" fill="var(--bad)" />)}
                <text x="210" y="215" className="lbl" textAnchor="middle">“Let's just get you five more darts.”</text>
              </g>
            ) : (
              <g>
                {jobs.map((j, i) => {
                  const cols = 3, w = 120, h = 90, x = 30 + (i % cols) * 125, y = 30 + Math.floor(i / cols) * 100;
                  const col = C.rings.find(r => r.id === j.ring).color;
                  return (
                    <g key={j.pos}>
                      <rect x={x} y={y} width={w} height={h} rx="6" fill={col} opacity="0.18" stroke={col} />
                      <circle cx={x + w / 2} cy={y + 34} r="10" fill="none" stroke={col} strokeWidth="2" />
                      <circle cx={x + w / 2} cy={y + 34} r="3" fill={col} />
                      <foreignObject x={x + 4} y={y + 50} width={w - 8} height={h - 52}>
                        <div xmlns="http://www.w3.org/1999/xhtml" className="dart-l">{j.situation}</div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </figure>
        <div>
          {mode === "range" ? (
            <p>Probabilities and historical averages aim at one precise number that nobody can know, so the honest answer is a range. The range is the dartboard. The industry's fix is more darts: more contribution, more years, more return. <Tag who="CL" /></p>
          ) : (
            <p>Name the situations and each one becomes a small target with a player built for it. The question changes from “will the pile be big enough?” to “is each position covered?” That question has a precise answer today. <Tag who="CL" /></p>
          )}
          <blockquote className="q small-q"><p>“As opposed to being more precise with our calculations and more precise of what people need money for, what vehicles do that really, really well. How do we create a completely different model for advising that actually creates much better precision and maps onto real life.”</p><footer><Tag who="JG" /> Podcast, Sep 2025</footer></blockquote>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 9. stack ───────────────────────── */
function Stack({ items }) {
  return (
    <div className="stack">
      {items.map((s, i) => (
        <div key={s.name} className="stack-i">
          <div className="stack-n mono">{i + 1}</div>
          <div><div className="stack-h">{s.name} <span className="muted">· {s.role}</span></div><p>{s.desc}</p></div>
        </div>
      ))}
    </div>
  );
}


/* ───────────────────────── reading Moneyball ───────────────────────── */
function LewisNotes() {
  const [filter, setFilter] = useState("all");
  const mods = C.modules.filter(m => C.lewis.some(l => l.uses === m.id));
  const items = C.lewis.filter(l => filter === "all" || l.uses === filter);
  const title = id => (C.modules.find(m => m.id === id) || {}).title;
  return (
    <div>
      <div className="tu-order">
        <button className={"pill" + (filter === "all" ? " on" : "")} onClick={() => setFilter("all")}>All {C.lewis.length}</button>
        {mods.map(m => <button key={m.id} className={"pill" + (filter === m.id ? " on" : "")} onClick={() => setFilter(m.id)}>{m.number}. {m.title}</button>)}
      </div>
      <div className="lw">
        {items.map((l, i) => (
          <article key={i} className="lw-card">
            <div className="lw-ref"><Tag who="ML" /> <span>{[l.ref, l.page].filter(Boolean).join(" · ")}</span></div>
            {l.quote ? <p className="lw-q">“{l.quote}”</p> : <p className="lw-topic">{l.topic} <Tag who="CL" /></p>}
            <div className="lw-notes">
              {l.notes.map((n, j) => <span key={j} className="lw-note">{n}</span>)}
              <span className="lw-src"><Tag who="JG" /> {l.src}</span>
            </div>
            <a className="lesson-go" href={"#" + l.uses}>→ {title(l.uses)}</a>
          </article>
        ))}
      </div>
      <p className="muted small">{C.lewisNote}</p>
    </div>
  );
}

/* ───────────────────────── player or game ───────────────────────── */
function PlayerGame({ items }) {
  const [flipped, setFlipped] = useState(() => new Set());
  const all = flipped.size === items.length;
  const flip = i => setFlipped(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <div>
      <div className="tu-order">
        <button className={"pill" + (flipped.size === 0 ? " on" : "")} onClick={() => setFlipped(new Set())}>Blame the player</button>
        <button className={"pill" + (all ? " on" : "")} onClick={() => setFlipped(new Set(items.map((_, i) => i)))}>Look at the game</button>
      </div>
      <div className="pg">
        {items.map((it, i) => {
          const on = flipped.has(i);
          return (
            <button key={i} className={"pg-card" + (on ? " on" : "")} onClick={() => flip(i)} aria-pressed={on}>
              <span className="pg-k">{on ? "The game" : "The player"}</span>
              {on ? (
                <>
                  <span className="pg-g">{it.game}</span>
                  <span className="pg-s"><Tag who="JG" /> {it.src}</span>
                </>
              ) : (
                <span className="pg-p">“{it.player}.”</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="muted small">{flipped.size} of {items.length} flipped. Every left-hand diagnosis asks the same person for more effort; every right-hand fact is about the rules of the game. <Tag who="CL" /></p>
    </div>
  );
}

/* ───────────────────────── run differential (Bill James) ───────────────────────── */
function pyth(rs, ra) { return rs * rs / (rs * rs + ra * ra); }
function RunDifferential() {
  const [rs, setRs] = useState(800);
  const [ra, setRa] = useState(653);
  const w = pyth(rs, ra) * 162;
  const base = pyth(800, 653) * 162;
  const plusRS = pyth(rs + 50, ra) * 162 - w;
  const minusRA = pyth(rs, Math.max(300, ra - 50)) * 162 - w;
  const W = 420, H = 210, pad = { l: 16, r: 16, t: 18, b: 34 };
  const maxR = 1000, bw = (W - pad.l - pad.r - 30) / 2;
  const bh = v => (v / maxR) * (H - pad.t - pad.b);
  return (
    <div className="ix-grid">
      <div className="ctrl">
        <Range id="rd-rs" label="Runs scored (growth tools)" min={500} max={1000} step={5} value={rs} set={setRs} show={rs} />
        <Range id="rd-ra" label="Runs allowed (what gets through)" min={450} max={1000} step={5} value={ra} set={setRa} show={ra} />
        <div className="tu-order">
          <button className="pill" onClick={() => { setRs(800); setRa(653); }}>2002 A's</button>
          <button className="pill" onClick={() => { setRs(850); setRa(800); }}>All offence</button>
          <button className="pill" onClick={() => { setRs(700); setRa(560); }}>Scores less, allows far less</button>
        </div>
        <div className="stat-row">
          <div className="stat big"><span className="stat-l">Expected wins of 162</span><span className="stat-v mono">{w.toFixed(0)}</span></div>
          <div className="stat"><span className="stat-l">+50 runs scored</span><span className="stat-v mono good-t">+{plusRS.toFixed(1)} wins</span></div>
          <div className="stat"><span className="stat-l">−50 runs allowed</span><span className="stat-v mono good-t">+{minusRA.toFixed(1)} wins</span></div>
        </div>
        <p className="muted small">DePodesta's target was 800–850 scored and no more than 650–670 allowed; the 2002 A's scored 800 and allowed 653. <Tag who="JG" /> notes. The formula expects about {base.toFixed(0)} wins from that; they won 103. <Tag who="ML" /> Keeping runs off the board counts at least as much as scoring them. In money: protection is not the opposite of growth; it is the other half of winning. <Tag who="CL" /></p>
      </div>
      <figure className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Runs scored and runs allowed">
          <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} className="ax" />
          <rect x={pad.l + 10} y={H - pad.b - bh(rs)} width={bw} height={bh(rs)} rx="4" fill="var(--diamond)" />
          <rect x={pad.l + 20 + bw} y={H - pad.b - bh(ra)} width={bw} height={bh(ra)} rx="4" fill="var(--bad)" opacity="0.8" />
          <text x={pad.l + 10 + bw / 2} y={H - pad.b - bh(rs) - 6} className="lbl strong" textAnchor="middle">{rs}</text>
          <text x={pad.l + 20 + bw * 1.5} y={H - pad.b - bh(ra) - 6} className="lbl strong" textAnchor="middle">{ra}</text>
          <text x={pad.l + 10 + bw / 2} y={H - 16} className="lbl" textAnchor="middle">runs scored · growth</text>
          <text x={pad.l + 20 + bw * 1.5} y={H - 16} className="lbl" textAnchor="middle">runs allowed · unprotected</text>
          <text x={W / 2} y={H - 2} className="lbl" textAnchor="middle">win % = RS² ÷ (RS² + RA²) = {(pyth(rs, ra) * 100).toFixed(1)}%</text>
        </svg>
      </figure>
    </div>
  );
}

/* ───────────────────────── situational diamond ───────────────────────── */
function Diamond() {
  const [roster, setRoster] = useState(() => new Set(C.rosters.superstar.tools));
  const [play, setPlay] = useState(null);
  const [log, setLog] = useState([]);
  const toolName = id => (C.tools.find(t => t.id === id) || { name: id }).name;
  const ring = id => C.rings.find(r => r.id === id);
  const toggle = id => setRoster(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const field = d => d.fielders.filter(f => roster.has(f));
  const hit = d => {
    const f = field(d);
    setPlay({ d, f });
    setLog(l => [{ pos: d.pos, out: f.length > 0 }, ...l].slice(0, 12));
  };
  const next = () => hit(C.diamond[Math.floor(Math.random() * C.diamond.length)]);
  const covered = C.diamond.filter(d => field(d).length).length;
  const outs = log.filter(x => x.out).length, runs = log.length - outs;
  const fallback = roster.has("k401") ? "the 401(k), at the exchange rate" : roster.size ? "whatever is liquid, at a cost" : "out of pocket";
  const preset = k => { setRoster(new Set(C.rosters[k].tools)); setPlay(null); setLog([]); };
  const home = { x: 200, y: 260 };
  return (
    <div className="ix-grid dia">
      <div className="ctrl">
        <div className="tu-order">
          <button className="pill" onClick={() => preset("superstar")}>{C.rosters.superstar.label}</button>
          <button className="pill" onClick={() => preset("team")}>{C.rosters.team.label}</button>
        </div>
        <div className="ts-tools">
          {C.tools.map(t => (
            <button key={t.id} className={"chip" + (roster.has(t.id) ? " on" : "")} onClick={() => toggle(t.id)}>{t.name}</button>
          ))}
        </div>
        <div className="stat-row">
          <div className="stat"><span className="stat-l">Positions covered</span><span className={"stat-v mono " + (covered === 9 ? "good-t" : "")}>{covered} / 9</span></div>
          <div className="stat"><span className="stat-l">Outs / runs allowed</span><span className="stat-v mono">{outs} / <span className={runs ? "bad-t" : ""}>{runs}</span></span></div>
        </div>
        <button className="tfp-btn tfp-btn--navy" onClick={next}>Next pitch →</button>
        <div className="dia-play" aria-live="polite">
          {play ? (
            <>
              <div className="dia-sit"><span className="mono muted">{play.d.pos}</span> {play.d.situation}</div>
              {play.f.length ? (
                <div className="good-t"><strong>Out.</strong> Fielded by {play.f.map(toolName).join(", ")}.</div>
              ) : (
                <div className="bad-t"><strong>It gets through.</strong> Nobody in position; paid from {fallback}. Players who make this play: {play.d.fielders.map(toolName).join(", ")}.</div>
              )}
              <blockquote className="q small-q"><p>“{play.d.jg}”</p><footer><Tag who="JG" /> {play.d.jgSrc}</footer></blockquote>
            </>
          ) : <p className="muted">Start with one superstar, press Next pitch a few times, then switch to the A's way.</p>}
        </div>
      </div>
      <figure className="fig">
        <svg viewBox="0 0 400 310" className="chart dia-svg" role="img" aria-label="Baseball diamond with nine positions">
          <path d="M200,300 L20,120 A255,255 0 0 1 380,120 Z" fill="var(--diamond)" opacity="0.14" />
          <path d="M200,260 L280,190 L200,120 L120,190 Z" fill="var(--clay)" opacity="0.22" stroke="var(--clay)" strokeWidth="1" />
          {[[200,260],[280,190],[200,120],[120,190]].map(([x,y],i) => <rect key={i} x={x-5} y={y-5} width="10" height="10" fill="var(--bg)" stroke="var(--muted)" transform={`rotate(45 ${x} ${y})`} />)}
          {C.diamond.map(d => {
            const ok = field(d).length > 0, col = ring(d.ring).color, sel = play && play.d.pos === d.pos;
            return (
              <g key={d.pos} className="dia-pos" onClick={() => hit(d)} role="button" tabIndex="0" onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(d); } }} aria-label={d.pos + ": " + d.situation}>
                <circle cx={d.x} cy={d.y} r={sel ? 17 : 15} fill={ok ? col : "var(--bg)"} stroke={ok ? col : "var(--bad)"} strokeWidth="2" strokeDasharray={ok ? "none" : "3 3"} />
                <text x={d.x} y={d.y + 4} className="lbl strong" textAnchor="middle" style={{ fill: ok ? "#fff" : "var(--bad)", fontSize: 10 }}>{d.pos}</text>
              </g>
            );
          })}
          {play && <circle key={play.d.pos + log.length} className="dia-ball" cx={play.d.x} cy={play.d.y + 22} r="4.5" fill="#fff" stroke="var(--bad)" style={{ "--fx": (home.x - play.d.x) + "px", "--fy": (home.y - play.d.y - 22) + "px" }} />}
          <text x="10" y="16" className="lbl">tap a position · dashed = nobody there</text>
        </svg>
        <div className="dia-log">{log.map((x, i) => <span key={i} className={"mono " + (x.out ? "good-t" : "bad-t")}>{x.out ? "out" : "run"}</span>)}</div>
      </figure>
    </div>
  );
}

/* ───────────────────────── moneyball ───────────────────────── */
function CostPerWin() {
  const rows = C.costPerWin.map(r => ({ ...r, per: r.payroll / r.wins }));
  const max = Math.max(...rows.map(r => r.per));
  return (
    <div>
      <div className="bars">
        {rows.map((r, i) => (
          <div key={r.team} className="bar-row">
            <div className="bar-l"><span className="swatch" style={{ background: i ? "var(--good)" : "var(--bad)" }} />{r.team}<span className="muted small"> · {fmt$(r.payroll / 1e6)}m payroll · {r.wins} wins</span></div>
            <div className="bar-t"><div className="bar-f" style={{ width: pct(r.per / max), background: i ? "var(--good)" : "var(--bad)" }} /></div>
            <div className="bar-v mono">{fmt$(r.per)} <span className="muted">per win</span></div>
          </div>
        ))}
      </div>
      <p className="muted small">The Yankees paid about {(rows[0].per / rows[1].per).toFixed(1)}× as much for each win. <Tag who="JG" /> 'Middle Class Moneyball' notes. This is the scoreboard version of 'less money in, more money out'. <Tag who="CL" /></p>
    </div>
  );
}
function TypesOfMoney() {
  const [on, setOn] = useState(() => new Set(["401(k) / 403(b)"]));
  const [spOnly, setSpOnly] = useState(false);
  const toggle = n => setOn(s => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x; });
  const list = C.typesOfMoney.filter(t => !spOnly || t.sp);
  const sel = C.typesOfMoney.filter(t => on.has(t.name));
  const pairs = [
    { label: "Market", a: sel.filter(t => t.market).length, bl: "Non-market", b: sel.filter(t => !t.market).length, jg: "hedge market money with non-market money" },
    { label: "59½ money", a: sel.filter(t => !t.before595).length, bl: "Non-59½ money", b: sel.filter(t => t.before595).length, jg: "hedge 59½ money with money you can reach now" },
    { label: "Taxable", a: sel.filter(t => t.taxable).length, bl: "Non-taxable", b: sel.filter(t => !t.taxable).length, jg: "hedge taxable money with non-taxable money" },
  ];
  const cell = (market, taxable) => list.filter(t => t.market === market && t.taxable === taxable);
  return (
    <div>
      <div className="tu-order">
        <button className={"pill" + (!spOnly ? " on" : "")} onClick={() => setSpOnly(false)}>All tools</button>
        <button className={"pill" + (spOnly ? " on" : "")} onClick={() => setSpOnly(true)}>Only ways to own the S&amp;P 500</button>
      </div>
      <div className="tom">
        <div className="tom-corner" />
        <div className="tom-h">Taxable</div>
        <div className="tom-h">Non-taxable</div>
        {[true, false].map(mk => (
          <React.Fragment key={String(mk)}>
            <div className="tom-r">{mk ? "Market" : "Non-market"}</div>
            {[true, false].map(tx => (
              <div key={String(tx)} className="tom-cell">
                {cell(mk, tx).map(t => (
                  <button key={t.name} className={"chip" + (on.has(t.name) ? " on" : "")} onClick={() => toggle(t.name)} title={(t.note ? t.note + ". " : "") + (t.who === "JG" ? "Placed by Jonathan" : "Placed by Claude, draft")}>
                    {t.name}<span className={"tom-age " + (t.before595 ? "good-t" : "bad-t")}>{t.before595 ? "now" : "59½"}</span>
                  </button>
                ))}
                {cell(mk, tx).length === 0 && <span className="muted small">none</span>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="stat-row" style={{ marginTop: 12 }}>
        {pairs.map(p => {
          const hedged = p.a > 0 && p.b > 0;
          return (
            <div key={p.label} className="stat">
              <span className="stat-l">{p.label} / {p.bl}</span>
              <span className="stat-v mono">{p.a} / {p.b}</span>
              <span className={"small " + (hedged ? "good-t" : sel.length ? "bad-t" : "muted")}>{sel.length === 0 ? "pick tools" : hedged ? "hedged" : "unhedged: " + p.jg}</span>
            </div>
          );
        })}
      </div>
      <p className="muted small">"now" means reachable before 59½; "59½" means penalty or rules until then. The first five placements are Jonathan's own table (Lesson 01); the rest are Claude's draft placements, hover a chip to see which. <Tag who="JG" /> <Tag who="CL" /> Pairing rule from Lesson 02: "sometimes players score runs, sometimes they save you from giving up runs."</p>
    </div>
  );
}
function Lessons({ items }) {
  const title = id => (C.modules.find(m => m.id === id) || {}).title;
  return (
    <ol className="lessons">
      {items.map(l => typeof l === "string" ? (
        <li key={l}><span className="mono stack-n">{l.slice(0, 2)}</span><span>{l.slice(3)}</span></li>
      ) : (
        <li key={l.n}><span className="mono stack-n">{l.n}</span><span>{l.text}{l.mod && title(l.mod) ? <> <a className="lesson-go" href={"#" + l.mod}>→ {title(l.mod)}</a></> : null}</span></li>
      ))}
    </ol>
  );
}

/* ───────────────────────── notebook ───────────────────────── */
function Notebook() {
  const [open, setOpen] = useState(null);
  return (
    <div className="page">
      <header className="mhead">
        <p className="eyebrow">Provenance</p>
        <h1 className="h1">From the notebook</h1>
        <p className="lede">Jonathan's handwritten pages and the whiteboard, with a line on what each one holds. This is where the ideas on the other pages were first written down.</p>
      </header>
      <div className="nb">
        {C.notebook.map((n, i) => (
          <figure key={n.file || n.title} className="nb-i">
            {n.file ? (
              <button className="nb-b" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <img src={n.file} alt={n.title} loading="lazy" />
              </button>
            ) : (
              <a className="nb-b nb-doc" href={n.link} target="_blank" rel="noopener">
                <span className="nb-doc-k">Document</span>
                <span className="nb-doc-t">{n.title}</span>
                <span className="nb-doc-c">Open in Google Drive →</span>
              </a>
            )}
            <figcaption><strong>{n.title}</strong><span>{n.what}</span></figcaption>
            {open === i && <div className="nb-big"><img src={n.file} alt={n.title} /><button className="btn ghost" onClick={() => setOpen(null)}>Close</button></div>}
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── lineage ───────────────────────── */
function Lineage() {
  return (
    <div className="page">
      <header className="mhead">
        <p className="eyebrow">Attribution</p>
        <h1 className="h1">Lineage &amp; attribution</h1>
        <p className="lede">What is Jonathan's, what he inherited, and what Claude added. Every tag on the site resolves here.</p>
      </header>
      <section className="sec">
        <h2 className="h3">The tags</h2>
        <dl className="tags-dl">
          {Object.keys(TAG).map(k => <div key={k}><dt><Tag who={k} /></dt><dd>{TAG[k].title}</dd></div>)}
        </dl>
      </section>
      <section className="sec">
        <h2 className="h3">Jonathan's original ideas on this site</h2>
        <ul className="plain">
          <li>People accumulate to distribute; accumulation ≠ good distribution; distribution → good accumulation.</li>
          <li>Applying Dalio's uncorrelated-streams principle to financial tools rather than asset classes, and to the moment of use rather than the years of growth: the Holy Grail of Distribution.</li>
          <li>“Using your money is where all the risk is.” The ↓↑ to ↓↓ shift; MPT and the safe withdrawal rate forced down the curve.</li>
          <li>The four reasons accumulation fails at distribution: risk, exchange rate, inaccessibility, bad model.</li>
          <li>The distribution risk universe in four families (economic, account, life, other) and the eight strong risks on the whiteboard.</li>
          <li>“Every different one −5%”: each kind of tool removes a slice of lifetime risk; 15–20 kinds reach zero.</li>
          <li>“8 and 4 is 12”: less money in, more money out; no single big number on the page.</li>
          <li>Plan backwards: distribution tells you where to accumulate. Ten ways to own the S&amp;P 500. The hammer and the wall.</li>
          <li>The Magic Circle: seven rings centre out, Income and Legacy as gold bookends, the Financial Health Score and its algorithm.</li>
          <li>Neo-Modern Portfolio Theory, Blind Retirement Theory, the house of cards, the three retirement goals, the dartboard, player versus game.</li>
          <li>Fix retirement: a problem with the game, not the player; a game that violates Natural Order Economics; an approach that builds a game people can play and win; reinventing retirement so that people don't really do it.</li>
          <li>Middle Class Moneyball: the middle class as the Oakland A's, winning in the aggregate, asset location over allocation, "every strength is a weakness", the types-of-money grid, and Lesson 03's explicit link from Dalio to 15–20 types of money to the Magic Circle (Mar–Aug 2024).</li>
          <li>Fernbridge, the Magic Circle app, and Otto as the philosophy made operational; the Core 4 in The Engine as concatenated, load-bearing pillars (July 2026), drawing on Jonathan Edwards.</li>
          <li>Dated record: the Moneyball podcast episodes of June 4, 12 and 20, 2024 (and the Toolbox ep. 4 segment of March 2024) carry the "win in the aggregate" idea on air; the 'Moneyball' page of July 26, 2024 already carries "Dalio: Holy Grail, reduce risk to zero (market + beyond)", asset location, product agnosticism, and pooled resources; the podcast prep notes of March 2024 carry "He calls it the Holy Grail, I call it the Magic Circle."</li>
        </ul>
      </section>
      <section className="sec">
        <h2 className="h3">Claude's additions, for Jonathan to keep or cut</h2>
        <ul className="plain">
          <li>The portfolio-math formula behind Dalio's curve and the slider that computes it.</li>
          <li>The exchange-rate calculator and the sequence-of-returns demonstration, built from Jonathan's examples with simplified flat rates and an illustrative return sequence.</li>
          <li>The draft tool-to-risk mapping (module 4) and which tools can field which situation on the diamond (module 6).</li>
          <li>The run-differential model in module 1: Bill James's formula is real; reading growth as runs scored and protection as runs allowed is Claude's mapping of Jonathan's 'sometimes players score runs, sometimes they save you from giving up runs.'</li>
          <li>The course order: Moneyball as the frame, the Holy Grail of Distribution as the math, following Jonathan's ten-lesson book map.</li>
          <li>The output index in the tool stack, an illustration of “8 and 4 is 12”.</li>
          <li>The “Claude's connection” paragraph on each module and the lineage notes on this page.</li>
        </ul>
      </section>
      <section className="sec">
        <h2 className="h3">Sources</h2>
        <ol className="plain src-list">{C.sources.map(s => <li key={s}>{s}</li>)}</ol>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
