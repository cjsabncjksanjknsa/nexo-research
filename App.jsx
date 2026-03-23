import { useState, useEffect, useRef } from "react";

// ─── FONTS & GLOBAL STYLES ───────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #08080E; }

    :root {
      --bg: #08080E;
      --surface: #0F0F1A;
      --surface2: #151525;
      --border: rgba(255,255,255,0.07);
      --text: #E4E4F0;
      --muted: rgba(255,255,255,0.4);
      --accent: #00D8A4;
      --accent2: #5B8DEF;
      --gold: #F0B429;
      --red: #F87171;
      --font-display: 'Syne', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    .app { font-family: var(--font-body); background: var(--bg); color: var(--text); min-height: 100vh; }

    /* Nav */
    .nav { display:flex; align-items:center; justify-content:space-between; padding: 16px 32px; border-bottom: 1px solid var(--border); background: rgba(8,8,14,0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; }
    .nav-logo { font-family: var(--font-display); font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .nav-logo span { color: var(--accent); }
    .nav-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
    .nav-tab { font-family: var(--font-body); padding: 7px 16px; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; background: transparent; color: var(--muted); }
    .nav-tab.active { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
    .nav-cta { background: var(--accent); color: #000; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-family: var(--font-body); letter-spacing: 0.02em; text-decoration: none; display: inline-block; }

    /* Cards */
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; }
    .card-inner { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; }

    /* Section */
    .section { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
    .section-title { font-family: var(--font-display); font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
    .section-title::before { content:''; width: 24px; height: 2px; background: var(--accent); border-radius: 2px; display: inline-block; }

    /* Grid */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

    /* Stat boxes */
    .stat-box { padding: 20px; border-radius: 12px; }
    .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 8px; }
    .stat-value { font-family: var(--font-display); font-size: 28px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }
    .stat-sub { font-size: 12px; color: var(--muted); margin-top: 6px; }

    /* Input */
    .input-wrap { position: relative; }
    .input-prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 16px; pointer-events: none; }
    .nexo-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 14px 13px 30px; color: var(--text); font-size: 20px; font-family: var(--font-display); font-weight: 700; outline: none; transition: border-color 0.2s; }
    .nexo-input:focus { border-color: var(--accent); }

    /* Range */
    input[type=range] { -webkit-appearance: none; width: 100%; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; outline: none; cursor: pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg); cursor: pointer; }

    /* Toggle */
    .toggle { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.2s; user-select: none; }
    .toggle:hover { background: rgba(255,255,255,0.05); }
    .toggle-track { width: 34px; height: 18px; border-radius: 9px; transition: background 0.2s; position: relative; flex-shrink: 0; }
    .toggle-thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff; position: absolute; top: 2px; transition: left 0.2s; }

    /* Pill buttons */
    .pill-group { display: flex; gap: 6px; flex-wrap: wrap; }
    .pill { padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: rgba(255,255,255,0.03); color: var(--muted); transition: all 0.18s; }
    .pill:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
    .pill.active { background: rgba(0,216,164,0.12); border-color: rgba(0,216,164,0.4); color: var(--accent); }
    .pill.asset-btc.active { background: rgba(247,147,26,0.12); border-color: rgba(247,147,26,0.4); color: #F7931A; }
    .pill.asset-eth.active { background: rgba(98,126,234,0.12); border-color: rgba(98,126,234,0.4); color: #627EEA; }
    .pill.asset-usdt.active { background: rgba(38,161,123,0.12); border-color: rgba(38,161,123,0.4); color: #26A17B; }

    /* Bar chart */
    .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .bar-label { width: 68px; font-size: 12px; font-weight: 600; }
    .bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
    .bar-val { width: 64px; text-align: right; font-size: 12px; font-weight: 700; font-family: var(--font-display); }

    /* Tier cards */
    .tier-card { padding: 18px; border-radius: 12px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
    .tier-card:hover { transform: translateY(-2px); }

    /* Feature row */
    .feature-row { display: flex; gap: 10px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.6); }

    /* Comparison table */
    .comp-table { width: 100%; border-collapse: collapse; }
    .comp-table th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); padding: 10px 14px; border-bottom: 1px solid var(--border); }
    .comp-table td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .comp-table tr:last-child td { border-bottom: none; }
    .comp-table tr:hover td { background: rgba(255,255,255,0.02); }
    .comp-table .active-row td { background: rgba(0,216,164,0.04); }
    .comp-table .nexo-col { font-weight: 700; color: var(--accent); }
    .check { color: var(--accent); }
    .cross { color: var(--red); }

    /* Flash crash context */
    .alert-box { border-radius: 12px; padding: 16px 18px; }

    /* Callout */
    .callout { border-left: 3px solid var(--accent); padding: 14px 16px; background: rgba(0,216,164,0.06); border-radius: 0 10px 10px 0; }
    .callout-gold { border-left-color: var(--gold); background: rgba(240,180,41,0.06); }

    /* CTA Strip */
    .cta-strip { background: linear-gradient(135deg, rgba(0,216,164,0.12), rgba(91,141,239,0.12)); border: 1px solid rgba(0,216,164,0.2); border-radius: 16px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }

    /* Disclaimer */
    .disclaimer { font-size: 10.5px; color: rgba(255,255,255,0.25); line-height: 1.7; margin-top: 16px; }

    /* Responsive */
    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
      .nav-tabs { display: none; }
      .two-col { flex-direction: column !important; }
      .section { padding: 24px 16px; }
    }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
// Source of truth: nexo.com/en-us (official US site, fetched March 2026) + Nexo Creator Brief (March 2026)
// Flexible max rates per asset confirmed from nexo.com/en-us/earn-crypto:
//   BTC up to 6%, ETH up to 7%, USDT up to 10.5%
// Tier flex rates are estimated per-tier gradations toward those confirmed maximums.
// Fixed-term bonus confirmed as additional % on top of flexible rate.
const ASSETS = {
  BTC:  { label: "Bitcoin",  symbol: "BTC",  color: "#F7931A", ltv: 0.50, flexApy: [3.0,4.0,5.0,6.0],  fixedBonus:[0.5,0.75,1.0] },
  ETH:  { label: "Ethereum", symbol: "ETH",  color: "#627EEA", ltv: 0.50, flexApy: [4.0,5.0,6.0,7.0],  fixedBonus:[0.5,0.75,1.0] },
  USDT: { label: "Tether",   symbol: "USDT", color: "#26A17B", ltv: 0.90, flexApy: [7.0,8.5,9.5,10.5], fixedBonus:[0.5,1.0,2.0]  },
};

// Wealth Club tiers — source: nexo.com/en-us/wealth-club (official US page, March 2026)
// Credit rates shown as the "starting from / as low as" rates per official page.
// Classic: from 12.9% | Premier: from 2.9% | Elite: as low as 1.9% | Signature: as low as 0.9%
// Cashback: Classic 0.25% (vol up to $25k) | Premier 0.50% (up to $100k) | Elite 0.70% (up to $100k) | Signature 0.70% (all swaps)
// Max yield per tier per official page: Classic 10.75% | Premier 12% | Elite 13.5% | Signature 16%
const TIERS = [
  { id:0, name:"Classic",   color:"#9CA3AF", creditApr:12.9, portfolioMin:"$5,000",    nexoAlt:"50,000 NEXO",    cashback:0.25, maxYield:10.75, withdrawals:"Available" },
  { id:1, name:"Premier",   color:"#60A5FA", creditApr:2.9,  portfolioMin:"$100,000",  nexoAlt:"500,000 NEXO",   cashback:0.50, maxYield:12.0,  withdrawals:"Enhanced"  },
  { id:2, name:"Elite",     color:"#A78BFA", creditApr:1.9,  portfolioMin:"$1,000,000",nexoAlt:"1,000,000 NEXO", cashback:0.70, maxYield:13.5,  withdrawals:"Priority"  },
  { id:3, name:"Signature", color:"#F0B429", creditApr:0.9,  portfolioMin:"Token only",nexoAlt:"2,000,000 NEXO", cashback:0.70, maxYield:16.0,  withdrawals:"Unlimited" },
];

const TERMS = [
  { id:"flex",  label:"Flexible",  months:null, bIdx:null },
  { id:"1mo",   label:"1-Month",   months:1,    bIdx:0    },
  { id:"3mo",   label:"3-Month",   months:3,    bIdx:1    },
  { id:"12mo",  label:"12-Month",  months:12,   bIdx:2    },
];

const fmt  = (n,d=2) => n.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtU = (n)     => "$" + fmt(n);
const fmtK = (n)     => n >= 1000000 ? "$" + fmt(n/1000000,2)+"M" : n >= 1000 ? "$" + fmt(n/1000,1)+"k" : fmtU(n);

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function NexoCompanion() {
  const [tab, setTab]         = useState("overview");
  const [asset, setAsset]     = useState("BTC");
  const [tier, setTier]       = useState(0);
  const [term, setTerm]       = useState("flex");
  const [amount, setAmount]   = useState(25000);
  const [rawAmt, setRawAmt]   = useState("25,000");
  const [nexoBonus, setNexo]  = useState(false);
  const [months, setMonths]   = useState(12);
  const [creditTab, setCreditTab] = useState("borrow");

  const A   = ASSETS[asset];
  const T   = TIERS[tier];
  const Tm  = TERMS.find(t => t.id === term);

  const baseRate   = A.flexApy[tier] / 100;
  const termBonus  = Tm.bIdx !== null ? A.fixedBonus[Tm.bIdx] / 100 : 0;
  const nexoRate   = nexoBonus ? 0.02 : 0;
  const totalApy   = baseRate + termBonus + nexoRate;

  const days       = Math.round((months / 12) * 365);
  const finalVal   = amount * Math.pow(1 + totalApy / 365, days);
  const earned     = finalVal - amount;
  const daily      = amount * (totalApy / 365);

  const maxBorrow  = amount * A.ltv;
  const annualInt  = maxBorrow * (T.creditApr / 100);

  const handleAmt = (e) => {
    const raw = e.target.value.replace(/,/g,"");
    setRawAmt(e.target.value);
    if (!isNaN(+raw) && +raw >= 0) setAmount(+raw);
  };
  const blurAmt = () => setRawAmt(fmt(amount,0));

  // ─── SUB-VIEWS ───────────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div className="section">
      {/* Hero narrative */}
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"var(--font-display)",fontSize:28,fontWeight:800,letterSpacing:"-0.5px",lineHeight:1.2,marginBottom:16,maxWidth:700}}>
          Smart money doesn't sit on the sidelines during a reset.
        </div>
        <div style={{fontSize:15,color:"rgba(255,255,255,0.55)",lineHeight:1.8,maxWidth:660}}>
          We're in a healthy market consolidation — not a breakdown. Infrastructure, regulation, and institutional integration are strengthening beneath the surface. While price appreciation pauses, there's a better play than going idle.
        </div>
      </div>

      {/* Credibility stats */}
      <div className="section-title">Nexo by the numbers</div>
      <div className="grid-4" style={{marginBottom:24}}>
        {[
          {val:"#2",     sub:"Largest crypto lender globally",   note:"Galaxy Research Q3 2025", color:"var(--accent)"},
          {val:"$2.04B", sub:"In open loans (Q3 2025)",          note:"Third-party verified",    color:"var(--accent2)"},
          {val:"$1.3B+", sub:"Paid in interest to clients",      note:"Since 2018",              color:"var(--gold)"},
          {val:"$8B+",   sub:"Assets under management",          note:"Global client base",      color:"#A78BFA"},
        ].map((s,i)=>(
          <div key={i} className="card stat-box" style={{padding:20}}>
            <div className="stat-label">{s.sub}</div>
            <div className="stat-value" style={{color:s.color,fontSize:26}}>{s.val}</div>
            <div className="stat-sub">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Why now */}
      <div className="section-title">Why now — the regulatory unlock</div>
      <div className="grid-2" style={{marginBottom:24}}>
        <div className="callout">
          <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,marginBottom:8}}>US Regulatory Clarity is Here</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.8}}>
            The stablecoin framework is advancing. The GENIUS Act is in the pipeline. The current administration has taken a materially more crypto-friendly stance. Galaxy Research notes the "regulatory discount" on crypto is actively narrowing — and Nexo's US return is perfectly timed with that shift.
          </div>
        </div>
        <div className="callout callout-gold">
          <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,marginBottom:8}}>Operating Since 2018 — Through Every Cycle</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.8}}>
            While Celsius, Voyager, and others collapsed in the 2022 bear market, Nexo remained fully solvent with zero exposure to third-party collapses. It has operated through multiple major market drawdowns without client losses. That's a track record most platforms can't claim.
          </div>
        </div>
      </div>

      {/* Competitor comparison table */}
      <div className="section-title">How Nexo compares — platform vs. competition</div>
      <div className="card" style={{padding:24,marginBottom:24,overflowX:"auto"}}>
        <table className="comp-table" style={{minWidth:580}}>
          <thead>
            <tr>
              <th>Feature</th>
              <th style={{color:"rgba(255,255,255,0.25)"}}>Tier 3 Platforms</th>
              <th style={{color:"rgba(255,255,255,0.25)"}}>Tier 2 Platforms</th>
              <th style={{color:"var(--accent)"}}>Nexo ✦</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Fully collateralized lending",      "✗","Partial","✓"],
              ["US regulated custody (Bakkt)",       "✗","✗","✓"],
              ["24/7 automated risk engine",         "✗","Partial","✓"],
              ["Market-neutral yield strategies",    "✗","✗","✓"],
              ["Smart order routing (multi-venue)",  "✗","Partial","✓"],
              ["No credit check / instant access",   "✗","✓","✓"],
              ["Daily compounding interest",         "✗","✓","✓"],
              ["Wealth tier loyalty program",        "✗","✗","✓"],
              ["Galaxy Research top lender rank",    "✗","✗","✓"],
            ].map(([feat,t3,t2,nexo],i)=>(
              <tr key={i}>
                <td style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>{feat}</td>
                <td style={{textAlign:"center",color:"var(--red)",fontSize:13}}>{t3 === "✗" ? "✗" : <span style={{color:"rgba(255,255,255,0.4)"}}>{t3}</span>}</td>
                <td style={{textAlign:"center",fontSize:13,color: t2==="✓"?"var(--accent)":t2==="✗"?"var(--red)":"rgba(255,255,255,0.4)"}}>{t2}</td>
                <td className="nexo-col" style={{textAlign:"center",fontSize:14}}>{nexo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Global presence */}
      <div className="section-title">Brand & Global Reach</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
        {[
          {text:"Official partner — Audi Revolut F1 Team (4-year deal)"},
          {text:"Multi-year crypto partner — Australian Open"},
          {text:"Title partner — Nexo Dallas Open (ATP 500)"},
          {text:"Official partner — DP World Tour (golf)"},
          {text:"Acquired Buenbit (Argentina) — 1M+ users, $2B+ processed"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:10,fontSize:13,color:"rgba(255,255,255,0.65)"}}>
            {item.text}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-strip">
        <div>
          <div style={{fontFamily:"var(--font-display)",fontWeight:800,fontSize:20,letterSpacing:"-0.3px",marginBottom:6}}>
            Ready to put your crypto to work?
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>
            US clients: sign up via the link below · Follow @NexoUS for market insights & product updates
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <a href="https://nexo.com/en-us/welcome" target="_blank" rel="noreferrer" className="nav-cta" style={{padding:"12px 24px",fontSize:14}}>
            Get Started at Nexo →
          </a>
          <div style={{padding:"12px 20px",border:"1px solid var(--border)",borderRadius:8,fontSize:13,color:"rgba(255,255,255,0.6)",cursor:"pointer"}}>
            @NexoUS ↗
          </div>
        </div>
      </div>
    </div>
  );

  const YieldTab = () => {
    const maxApy = ASSETS[asset].flexApy[3] + (Tm.bIdx !== null ? ASSETS[asset].fixedBonus[Tm.bIdx] : 0) + 2;
    return (
      <div className="section">
        <div style={{fontFamily:"var(--font-display)",fontSize:28,fontWeight:800,letterSpacing:"-0.5px",marginBottom:6}}>
          Yield Calculator
        </div>
        <div style={{fontSize:14,color:"var(--muted)",marginBottom:32}}>
          Your crypto working for you — earning daily, compounding automatically.
        </div>

        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {/* LEFT: Controls */}
          <div style={{flex:"0 0 320px",display:"flex",flexDirection:"column",gap:16}}>

            {/* Asset */}
            <div className="card" style={{padding:20}}>
              <div className="section-title" style={{marginBottom:14}}>Asset</div>
              <div style={{display:"flex",gap:8}}>
                {Object.entries(ASSETS).map(([k,a])=>(
                  <button key={k} onClick={()=>setAsset(k)}
                    style={{flex:1,padding:"14px 8px",borderRadius:10,border:`2px solid ${asset===k?a.color:"rgba(255,255,255,0.08)"}`,
                    background: asset===k?`${a.color}18`:"rgba(255,255,255,0.03)",cursor:"pointer",transition:"all 0.2s"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{k==="BTC"?"₿":k==="ETH"?"Ξ":"₮"}</div>
                    <div style={{fontSize:12,fontWeight:700,color:asset===k?a.color:"rgba(255,255,255,0.5)"}}>{k}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="card" style={{padding:20}}>
              <div className="section-title" style={{marginBottom:14}}>Portfolio Value (USD)</div>
              <div className="input-wrap">
                <div className="input-prefix">$</div>
                <input className="nexo-input" type="text" value={rawAmt} onChange={handleAmt} onBlur={blurAmt} />
              </div>
              <div style={{marginTop:14}}>
                <input type="range" min={5000} max={10000000} step={10000} value={Math.min(amount,10000000)}
                  onChange={e=>{ const v=+e.target.value; setAmount(v); setRawAmt(fmt(v,0)); }} />
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginTop:4}}>
                  <span>$5k</span><span>$10M</span>
                </div>
              </div>
            </div>

            {/* Tier */}
            <div className="card" style={{padding:20}}>
              <div className="section-title" style={{marginBottom:14}}>Wealth Club Tier</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {TIERS.map((t,i)=>(
                  <div key={t.id} onClick={()=>setTier(i)}
                    style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${tier===i?t.color:"rgba(255,255,255,0.07)"}`,
                    background:tier===i?`${t.color}12`:"rgba(255,255,255,0.02)",cursor:"pointer",transition:"all 0.18s",
                    display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:tier===i?t.color:"rgba(255,255,255,0.6)"}}>{t.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{t.portfolioMin} min · {t.nexoAlt}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:tier===i?t.color:"rgba(255,255,255,0.3)",fontFamily:"var(--font-display)"}}>
                      {A.flexApy[i]}% APY
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Term */}
            <div className="card" style={{padding:20}}>
              <div className="section-title" style={{marginBottom:14}}>Savings Term</div>
              <div className="pill-group">
                {TERMS.map(t=>(
                  <button key={t.id} className={`pill ${term===t.id?"active":""}`} onClick={()=>setTerm(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Projection period */}
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <div className="section-title" style={{margin:0}}>Projection</div>
                <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:15,color:"var(--accent)"}}>
                  {months} {months===1?"month":"months"}
                </div>
              </div>
              <input type="range" min={1} max={60} value={months} onChange={e=>setMonths(+e.target.value)} />
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginTop:4}}>
                <span>1mo</span><span>5yr</span>
              </div>
            </div>

            {/* NEXO bonus */}
            <div className="toggle" onClick={()=>setNexo(!nexoBonus)}>
              <div className="toggle-track" style={{background:nexoBonus?"var(--accent)":"rgba(255,255,255,0.12)"}}>
                <div className="toggle-thumb" style={{left:nexoBonus?16:2}} />
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:nexoBonus?"var(--accent)":"rgba(255,255,255,0.7)"}}>Earn interest in NEXO tokens</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>+2% annual bonus on top of base rate</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:16,minWidth:0}}>

            {/* Total APY hero */}
            <div className="card" style={{padding:28,background:"linear-gradient(135deg,rgba(0,216,164,0.08),rgba(91,141,239,0.06))",border:"1px solid rgba(0,216,164,0.15)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
                <div>
                  <div className="section-title" style={{margin:"0 0 8px"}}>Total APY</div>
                  <div style={{fontFamily:"var(--font-display)",fontSize:64,fontWeight:800,letterSpacing:"-2px",color:"var(--accent)",lineHeight:1}}>
                    {(totalApy*100).toFixed(2)}%
                  </div>
                  <div style={{marginTop:12,display:"flex",gap:12,flexWrap:"wrap"}}>
                    <div style={{fontSize:12,color:"var(--muted)"}}>
                      Base: <span style={{color:"var(--text)",fontWeight:600}}>{(baseRate*100).toFixed(1)}%</span>
                    </div>
                    {termBonus>0 && <div style={{fontSize:12,color:"var(--muted)"}}>
                      Term bonus: <span style={{color:"var(--accent)",fontWeight:600}}>+{(termBonus*100).toFixed(2)}%</span>
                    </div>}
                    {nexoBonus && <div style={{fontSize:12,color:"var(--muted)"}}>
                      NEXO bonus: <span style={{color:"var(--accent)",fontWeight:600}}>+2.00%</span>
                    </div>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="stat-label">Interest paid daily</div>
                  <div style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,color:"var(--text)"}}>{fmtU(daily)}</div>
                  <div className="stat-sub">per day on {fmtK(amount)}</div>
                </div>
              </div>
            </div>

            {/* Key results */}
            <div className="grid-3">
              {[
                {label:"Yield Earned",      val:fmtU(earned),   sub:`over ${months} month${months!==1?"s":""}`, color:"var(--accent)"},
                {label:"Final Value",       val:fmtK(finalVal), sub:"Principal + interest",                    color:"var(--text)"},
                {label:"Annual Equivalent", val:fmtU(amount*totalApy), sub:"at current APY",                  color:"var(--accent2)"},
              ].map((s,i)=>(
                <div key={i} className="card stat-box">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{color:s.color,fontSize:22}}>{s.val}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Daily/monthly */}
            <div className="grid-2">
              <div className="card" style={{padding:20}}>
                <div className="stat-label" style={{marginBottom:12}}>Monthly breakdown</div>
                {[{label:"Daily",val:daily},{label:"Weekly",val:daily*7},{label:"Monthly",val:daily*30.44},{label:"Annually",val:amount*totalApy}]
                  .map(({label,val})=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <span style={{fontSize:13,color:"var(--muted)"}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:700,fontFamily:"var(--font-display)",color:"var(--text)"}}>{fmtU(val)}</span>
                  </div>
                ))}
              </div>

              <div className="card" style={{padding:20}}>
                <div className="stat-label" style={{marginBottom:12}}>Flexible savings description</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.8}}>
                  <strong style={{color:"var(--text)"}}>Flexible:</strong> Daily payouts, no lock-ups, withdraw anytime. Your assets are always yours.<br/><br/>
                  <strong style={{color:"var(--text)"}}>Fixed-term:</strong> Lock for 1, 3 or 12 months for a higher rate. Best for conviction holders who don't need liquidity short term.<br/><br/>
                  Interest compounds daily — each payout adds to your balance and earns the next day.
                </div>
              </div>
            </div>

            {/* Tier comparison bars */}
            <div className="card" style={{padding:20}}>
              <div className="section-title" style={{marginBottom:16}}>APY by Wealth Tier — {asset} · {Tm.label}{nexoBonus?" + NEXO bonus":""}</div>
              {TIERS.map((t,i)=>{
                const rate = A.flexApy[i] + (Tm.bIdx!==null?A.fixedBonus[Tm.bIdx]:0) + (nexoBonus?2:0);
                return (
                  <div key={t.id} className="bar-row">
                    <div className="bar-label" style={{color:i===tier?t.color:"var(--muted)",fontWeight:i===tier?700:400}}>{t.name}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{width:`${(rate/maxApy)*100}%`,background:i===tier?t.color:"rgba(255,255,255,0.12)"}} />
                    </div>
                    <div className="bar-val" style={{color:i===tier?t.color:"var(--muted)"}}>{rate.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>

            <div className="disclaimer">
              ⚠ Rates sourced from Nexo.com & verified third-party sources (March 2026). Projections assume constant rates and prices with principal remaining in account. For illustrative purposes only — not financial advice. Minimum $5,000 portfolio balance required to participate in Nexo's earn program. Daily compounding illustrated; actual payouts depend on account activity.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreditTab = () => (
    <div className="section">
      <div style={{fontFamily:"var(--font-display)",fontSize:28,fontWeight:800,letterSpacing:"-0.5px",marginBottom:6}}>
        Credit Line Calculator
      </div>
      <div style={{fontSize:14,color:"var(--muted)",marginBottom:32}}>
        Borrow against your crypto without selling it. No taxable event. No credit check.
      </div>

      {/* Elon callout */}
      <div className="callout callout-gold" style={{marginBottom:24}}>
        <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,marginBottom:6}}>
          How the ultra-wealthy actually borrow
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.8}}>
          Elon Musk, Jeff Bezos, and other billionaires famously avoid selling their appreciated assets by borrowing against them instead. Selling triggers capital gains tax. Borrowing doesn't — you preserve your upside, access liquidity when you need it, and pay interest on a much smaller sum than your tax bill would be. Nexo brings this exact same strategy to crypto holders. Borrow against your BTC or ETH at Signature tier rates — as low as 0.9% APR — and keep your full market exposure.
        </div>
      </div>

      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        {/* LEFT */}
        <div style={{flex:"0 0 320px",display:"flex",flexDirection:"column",gap:16}}>
          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{marginBottom:14}}>Asset (Collateral)</div>
            <div style={{display:"flex",gap:8}}>
              {Object.entries(ASSETS).map(([k,a])=>(
                <button key={k} onClick={()=>setAsset(k)}
                  style={{flex:1,padding:"14px 8px",borderRadius:10,border:`2px solid ${asset===k?a.color:"rgba(255,255,255,0.08)"}`,
                  background:asset===k?`${a.color}18`:"rgba(255,255,255,0.03)",cursor:"pointer"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{k==="BTC"?"₿":k==="ETH"?"Ξ":"₮"}</div>
                  <div style={{fontSize:12,fontWeight:700,color:asset===k?a.color:"rgba(255,255,255,0.5)"}}>{k}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{marginBottom:14}}>Collateral Value (USD)</div>
            <div className="input-wrap">
              <div className="input-prefix">$</div>
              <input className="nexo-input" type="text" value={rawAmt} onChange={handleAmt} onBlur={blurAmt} />
            </div>
            <div style={{marginTop:14}}>
              <input type="range" min={5000} max={10000000} step={10000} value={Math.min(amount,10000000)}
                onChange={e=>{ const v=+e.target.value; setAmount(v); setRawAmt(fmt(v,0)); }} />
            </div>
          </div>

          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{marginBottom:14}}>Wealth Club Tier</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {TIERS.map((t,i)=>(
                <div key={t.id} onClick={()=>setTier(i)}
                  style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${tier===i?t.color:"rgba(255,255,255,0.07)"}`,
                  background:tier===i?`${t.color}12`:"rgba(255,255,255,0.02)",cursor:"pointer",transition:"all 0.18s",
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:tier===i?t.color:"rgba(255,255,255,0.6)"}}>{t.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{t.nexoAlt}</div>
                  </div>
                  <div style={{fontSize:14,fontWeight:800,color:tier===i?t.color:"rgba(255,255,255,0.3)",fontFamily:"var(--font-display)"}}>
                    {i===0 ? t.creditApr+"%" : "from "+t.creditApr+"%"} APR
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key facts */}
          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{marginBottom:14}}>How it works</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {text:"No credit check — instant access based on collateral"},
                {text:"No taxable event — no need to sell your "+asset},
                {text:"Keep full upside exposure on your holdings"},
                {text:"Repay partially or fully, anytime, no schedule"},
                {text:"24/7 automated risk engine — Bakkt custody (US regulated)"},
              ].map((f,i)=>(
                <div key={i} className="feature-row">
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:16,minWidth:0}}>
          {/* Hero result */}
          <div className="card" style={{padding:28,background:"linear-gradient(135deg,rgba(91,141,239,0.08),rgba(167,139,250,0.06))",border:"1px solid rgba(91,141,239,0.15)"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:16,alignItems:"center"}}>
              <div>
                <div className="section-title" style={{margin:"0 0 6px"}}>Max you can borrow</div>
                <div style={{fontFamily:"var(--font-display)",fontSize:56,fontWeight:800,letterSpacing:"-2px",color:"var(--accent2)",lineHeight:1}}>
                  {fmtU(maxBorrow)}
                </div>
                <div style={{marginTop:8,fontSize:13,color:"var(--muted)"}}>
                  Loan-to-Value: <strong style={{color:"var(--text)"}}>{(A.ltv*100).toFixed(0)}%</strong> on {asset} collateral · Credit rate from <strong style={{color:T.color}}>{T.creditApr}% APR</strong> ({T.name} tier)
                </div>
              </div>
              <div style={{textAlign:"center",padding:"16px 20px",background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:12}}>
                <div className="stat-label" style={{marginBottom:4}}>Collateral kept</div>
                <div style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,color:"var(--text)"}}>{fmtU(amount)}</div>
                <div className="stat-sub">yours, unaffected</div>
              </div>
            </div>
          </div>

          {/* Interest costs */}
          <div className="grid-3">
            {[
              {label:"Daily Interest",   val:fmtU((maxBorrow*(T.creditApr/100))/365), color:"var(--red)"},
              {label:"Monthly Interest", val:fmtU(maxBorrow*(T.creditApr/100)/12),    color:"var(--red)"},
              {label:"Annual Interest",  val:fmtU(annualInt),                          color:"var(--red)"},
            ].map((s,i)=>(
              <div key={i} className="card stat-box">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{color:s.color,fontSize:20}}>{s.val}</div>
                <div className="stat-sub">on max borrow at {T.creditApr}% APR</div>
              </div>
            ))}
          </div>

          {/* Tier comparison bars */}
          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{marginBottom:16}}>Annual interest cost by tier — on {fmtU(maxBorrow)} borrowed</div>
            {TIERS.map((t,i)=>{
              const cost = maxBorrow*(t.creditApr/100);
              const maxCost = maxBorrow*(TIERS[0].creditApr/100);
              return (
                <div key={t.id} className="bar-row">
                  <div className="bar-label" style={{color:i===tier?t.color:"var(--muted)",fontWeight:i===tier?700:400}}>{t.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width:`${(cost/maxCost)*100}%`,background:i===tier?t.color:"rgba(255,255,255,0.12)"}} />
                  </div>
                  <div className="bar-val" style={{color:i===tier?t.color:"var(--muted)",width:80}}>{fmtU(cost)}/yr</div>
                </div>
              );
            })}
            <div style={{marginTop:16,padding:"12px 14px",background:"rgba(0,216,164,0.06)",border:"1px solid rgba(0,216,164,0.15)",borderRadius:10,fontSize:12,color:"rgba(255,255,255,0.6)"}}>
              Signature tier saves <strong style={{color:"var(--accent)"}}>{fmtU(maxBorrow*((TIERS[0].creditApr-TIERS[3].creditApr)/100))}</strong>/yr vs Classic at standard rates. With the Low-Cost Credit Line (LTV &lt;20%), Signature drops to just 0.9% APR.
            </div>
          </div>

          {/* Tax efficiency */}
          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{marginBottom:12}}>The tax efficiency argument — hypothetical example</div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:1,padding:"14px",background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.12)",borderRadius:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--red)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Selling {asset}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.8}}>
                  Sell {fmtU(amount)} of {asset}<br/>
                  Capital gains tax (est. ~20-37%): <strong style={{color:"var(--red)"}}>up to {fmtU(amount*0.3)} in tax</strong><br/>
                  Lose future upside<br/>
                  No position remaining
                </div>
              </div>
              <div style={{flex:1,padding:"14px",background:"rgba(0,216,164,0.06)",border:"1px solid rgba(0,216,164,0.15)",borderRadius:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Nexo Credit Line</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.8}}>
                  Borrow {fmtU(maxBorrow)} against {asset}<br/>
                  Annual interest: <strong style={{color:"var(--accent)"}}>{fmtU(annualInt)} ({T.creditApr}% APR)</strong><br/>
                  Keep full market upside<br/>
                  No taxable event — no CGT triggered
                </div>
              </div>
            </div>
            <div style={{marginTop:12,fontSize:11,color:"var(--muted)"}}>
              Note: Tax rates vary by jurisdiction. Consult a qualified tax advisor for your specific situation.
            </div>
          </div>

          <div className="disclaimer">
            ⚠ Credit rates shown are the starting/minimum rates per tier as listed on nexo.com/en-us/wealth-club (March 2026): Classic 12.9%, Premier from 2.9%, Elite as low as 1.9%, Signature as low as 0.9%. LTV ratios: BTC/ETH = 50% max, USDT = 90% max. Rates subject to change. Repaying within 45 days of last withdrawal triggers a 15.9% rate for that period. US assets custodied via Bakkt. Not financial advice.
          </div>
        </div>
      </div>
    </div>
  );

  const WealthTab = () => (
    <div className="section">
      <div style={{fontFamily:"var(--font-display)",fontSize:28,fontWeight:800,letterSpacing:"-0.5px",marginBottom:6}}>
        Wealth Club & NEXO Token
      </div>
      <div style={{fontSize:14,color:"var(--muted)",marginBottom:32}}>
        The loyalty layer that makes every Nexo product work harder for you.
      </div>

      <div className="callout" style={{marginBottom:28}}>
        <div style={{fontFamily:"var(--font-display)",fontWeight:700,marginBottom:6}}>The NEXO Token isn't a speculation play — it's an optimizer.</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.8}}>
          If you're already going to be using Nexo's products, holding NEXO Tokens in your portfolio means higher earn rates, lower borrow rates, cashback on swaps, and free withdrawals. The more you use the platform, the more the token compounds your returns across every product.
        </div>
      </div>

      {/* Tier cards */}
      <div className="section-title">US Wealth Club Tiers</div>
      <div className="grid-4" style={{marginBottom:28}}>
        {TIERS.map((t,i)=>(
          <div key={t.id} className="card" style={{padding:20,border:`1px solid ${t.color}30`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"var(--font-display)",fontWeight:800,fontSize:16,color:t.color}}>{t.name}</div>
              <div style={{width:10,height:10,borderRadius:"50%",background:t.color}} />
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>Portfolio path</div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:12}}>{t.portfolioMin}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>Token path</div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:16}}>{t.nexoAlt}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"Max yield",   val:"up to "+t.maxYield+"%",              accent:true},
                {label:"Credit from", val:t.creditApr+"%",                      accent:true},
                {label:"BTC earn",    val:"up to "+ASSETS.BTC.flexApy[i]+"%",   accent:false},
                {label:"ETH earn",    val:"up to "+ASSETS.ETH.flexApy[i]+"%",   accent:false},
                {label:"USDT earn",   val:"up to "+ASSETS.USDT.flexApy[i]+"%",  accent:false},
                {label:"Cashback",    val:"up to "+t.cashback+"%",              accent:false},
                {label:"Withdrawals", val:t.withdrawals,                        accent:false},
              ].map(({label,val,accent})=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:"var(--muted)"}}>{label}</span>
                  <span style={{fontWeight:700,color:accent?t.color:"var(--text)",fontFamily:"var(--font-display)"}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Full comparison table */}
      <div className="section-title">Full benefit comparison</div>
      <div className="card" style={{padding:24,overflowX:"auto"}}>
        <table className="comp-table" style={{minWidth:620}}>
          <thead>
            <tr>
              <th style={{width:160}}>Benefit</th>
              {TIERS.map(t=>(
                <th key={t.id} style={{color:t.color,textAlign:"center"}}>{t.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {label:"Min portfolio",     vals:TIERS.map(t=>t.portfolioMin)},
              {label:"OR NEXO tokens",    vals:TIERS.map(t=>t.nexoAlt)},
              {label:"Max yield",         vals:TIERS.map(t=>t.maxYield+"%"),    highlight:true},
              {label:"Credit from",       vals:TIERS.map(t=>t.creditApr+"%"),   highlight:true},
              {label:"BTC flexible",      vals:TIERS.map((_,i)=>"up to "+ASSETS.BTC.flexApy[i]+"%")},
              {label:"ETH flexible",      vals:TIERS.map((_,i)=>"up to "+ASSETS.ETH.flexApy[i]+"%")},
              {label:"USDT flexible",     vals:TIERS.map((_,i)=>"up to "+ASSETS.USDT.flexApy[i]+"%")},
              {label:"Exchange cashback", vals:["up to 0.25%","up to 0.50%","up to 0.70%","up to 0.70%"]},
              {label:"Withdrawals",       vals:TIERS.map(t=>t.withdrawals)},
            ].map(({label,vals,highlight})=>(
              <tr key={label}>
                <td style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{label}</td>
                {vals.map((v,i)=>(
                  <td key={i} style={{textAlign:"center",fontWeight:highlight?800:600,fontFamily:"var(--font-display)",fontSize:13,color:highlight?TIERS[i].color:"var(--text)"}}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:24}} className="cta-strip">
        <div>
          <div style={{fontFamily:"var(--font-display)",fontWeight:800,fontSize:18,letterSpacing:"-0.3px",marginBottom:4}}>
            Start with Classic. Upgrade as you grow.
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>
            US clients sign up at nexo.com/en-us/welcome · Follow @NexoUS for rate updates & education
          </div>
        </div>
        <a href="https://nexo.com/en-us/welcome" target="_blank" rel="noreferrer" className="nav-cta" style={{padding:"12px 24px",fontSize:14,whiteSpace:"nowrap"}}>
          Open Your Account →
        </a>
      </div>
    </div>
  );

  return (
    <>
      <GlobalStyles />
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">Nexo Research <span>by Kyledoops</span></div>
          <div className="nav-tabs">
            {[
              {id:"overview", label:"Overview"},
              {id:"yield",    label:"Yield"},
              {id:"credit",   label:"Credit Line"},
              {id:"wealth",   label:"Wealth Club"},
            ].map(t=>(
              <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <a href="https://nexo.com/en-us/welcome" target="_blank" rel="noreferrer" className="nav-cta">
            Get Started ↗
          </a>
        </nav>

        {/* Mobile tab strip */}
        <div style={{display:"flex",gap:4,padding:"12px 16px",background:"var(--surface)",borderBottom:"1px solid var(--border)",overflowX:"auto"}}>
          {[
            {id:"overview",label:"Overview"},
            {id:"yield",   label:"Yield"},
            {id:"credit",  label:"Credit"},
            {id:"wealth",  label:"Wealth Club"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${tab===t.id?"rgba(0,216,164,0.4)":"var(--border)"}`,
              background:tab===t.id?"rgba(0,216,164,0.1)":"transparent",
              color:tab===t.id?"var(--accent)":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==="overview" && <OverviewTab />}
        {tab==="yield"    && <YieldTab />}
        {tab==="credit"   && <CreditTab />}
        {tab==="wealth"   && <WealthTab />}
      </div>
    </>
  );
}
