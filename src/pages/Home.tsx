import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FilingStatus, TAX_YEAR, calculate, formatMoney } from "../lib/tax";
import { US_STATES } from "../lib/stateTax";
import { daysUntil, getNextDeadline } from "../lib/deadlines";
import { usePageMeta } from "../lib/usePageMeta";
import SocialProof from "../components/SocialProof";
import Testimonials from "../components/Testimonials";
import NewsletterSignup from "../components/NewsletterSignup";
import AdBanner from "../components/AdBanner";

const faqs: [string, string][] = [
  [
    "Do I have to pay quarterly taxes as a freelancer?",
    "Usually, yes. If you expect to owe at least $1,000 in federal tax after subtracting withholding and credits, the IRS generally expects estimated payments during the year. This calculator is a starting point; your prior-year tax and W-2 withholding can change what you need to send.",
  ],
  [
    "What counts as net freelance income?",
    "Use the profit from your self-employed work: income after ordinary and necessary business expenses. Think software, supplies, mileage, contractor costs, and a qualifying home office. Do not enter your gross client payments unless you had no business expenses at all.",
  ],
  [
    "Why is self-employment tax separate?",
    "Employees split Social Security and Medicare taxes with an employer. When you work for yourself, you cover both portions. The self-employment tax is calculated separately from regular federal income tax, and you may deduct half of it when estimating adjusted gross income.",
  ],
  [
    "What if I also have a W-2 job?",
    "W-2 wages can use up some of the Social Security wage base and increase your total taxable income. Add your expected wages here for a more useful estimate. You may also be able to increase W-2 withholding instead of sending separate estimated payments.",
  ],
  [
    "Are the four payments always equal?",
    "This tool divides your estimated annual federal and state tax into four simple installments. Your income may be uneven, and IRS due dates do not cover identical calendar periods. If your earnings fluctuate sharply, the annualized income installment method can be more accurate.",
  ],
  [
    "What is the safe-harbor rule?",
    "A common penalty-protection approach is paying 100% of last year's total tax, or 110% for some higher-income taxpayers, through timely payments. It is a rule with conditions, so check IRS Form 1040-ES or a tax professional before relying on it.",
  ],
  [
    "How does state income tax work for freelancers?",
    "Most states require estimated quarterly payments alongside your federal 1040-ES if you owe state tax. Nine states (AK, FL, NV, NH, SD, TN, TX, WA, WY) have no general state income tax on freelance earnings. For all other states, we calculate flat or progressive bracket estimates.",
  ],
  [
    "Where do I make an estimated tax payment?",
    "The IRS offers Direct Pay and the Electronic Federal Tax Payment System for individual estimated tax payments. Keep the confirmation for your records and select the correct tax year and payment type. Visit IRS.gov for federal and your state Department of Revenue for state payments.",
  ],
];

function DeadlineCard() {
  const deadline = useMemo(() => getNextDeadline(), []);
  const days = useMemo(() => daysUntil(deadline.date), [deadline]);
  return (
    <div className="deadline-card w-full sm:w-auto">
      <span className="deadline-dot" />
      <div className="min-w-0 flex-1">
        <p className="eyebrow">NEXT ESTIMATED PAYMENT</p>
        <p className="deadline-copy truncate">
          {deadline.label} <span>· {days}d away</span>
        </p>
      </div>
      <span className="calendar-mark">{deadline.quarter}</span>
    </div>
  );
}

const CONFETTI_COLORS = ["#11716d", "#e26e4b", "#f9e4b3", "#b9e2d6", "#855f23", "#8b5a6b"];

function spawnConfetti(container: HTMLElement) {
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${-10 + Math.random() * 20}%`;
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.animationDuration = `${0.9 + Math.random() * 0.6}s`;
    piece.style.width = `${6 + Math.random() * 6}px`;
    piece.style.height = `${6 + Math.random() * 6}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? "999px" : "2px";
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 1800);
  }
}

const freelanceTools = [
  {
    icon: "🗺️",
    iconBg: "#dcf0ea",
    title: "50-State Tax Directory",
    desc: "Calculate state income tax for all 50 states alongside your federal quarterly number.",
    link: "/state-tax",
    badge: "50 STATES",
    cta: "Explore state taxes →",
  },
  {
    icon: "📄",
    iconBg: "#fde2dc",
    title: "Freelance Invoice Generator",
    desc: "Create professional client invoices with built-in quarterly tax set-aside calculations. Free PDF export.",
    link: "/invoice-generator",
    badge: "NEW TOOL",
    cta: "Create an invoice →",
  },
  {
    icon: "📊",
    iconBg: "#fce9cd",
    title: "Profit Margin & Take-Home",
    desc: "Know your real take-home pay and true hourly wage after expenses, SE tax, and income taxes.",
    link: "/profit-margin-calculator",
    badge: "NEW TOOL",
    cta: "Calculate margin →",
  },
];

export default function Home() {
  usePageMeta({
    title: "Free 1099 Quarterly Tax Calculator (2026) | Setwise",
    description: "Free 1099 quarterly tax calculator for freelancers. Estimate federal and state tax in seconds — no signup required. Updated for the 2026 tax year.",
    path: "/",
  });

  const [income, setIncome] = useState("85000");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");
  const [hasW2, setHasW2] = useState(true);
  const [w2, setW2] = useState("42000");
  const [results, setResults] = useState(() => calculate(85000, 42000, "single", "CA"));
  const [calculated, setCalculated] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const confettiRef = useRef<HTMLDivElement>(null);
  const hasConfettied = useRef(false);

  const numbers = useMemo(
    () => calculate(Number(income) || 0, hasW2 ? Number(w2) || 0 : 0, status, stateCode),
    [income, w2, hasW2, status, stateCode]
  );

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setResults(numbers);
      setCalculated(true);
      // Confetti on first calculate
      if (!hasConfettied.current && confettiRef.current) {
        spawnConfetti(confettiRef.current);
        hasConfettied.current = true;
      }
      setTimeout(
        () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        30
      );
    },
    [numbers]
  );

  return (
    <main className="overflow-hidden">
      {/* ─── Hero + Calculator ─── */}
      <section
        id="top"
        className="relative mx-auto grid max-w-[1240px] gap-8 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:px-8 lg:pb-24 lg:pt-14"
      >
        {/* Ambient Glow Lights */}
        <div 
          className="pointer-events-none absolute -top-16 -right-12 -z-0 h-[320px] w-[320px] sm:h-[480px] sm:w-[480px] rounded-full bg-[#11716d]/[0.09] blur-[80px] sm:blur-[100px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute top-1/3 -left-20 -z-0 h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] rounded-full bg-[#f9e4b3]/[0.45] blur-[80px] sm:blur-[110px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 flex flex-col justify-center pb-2">
          <div className="mb-5 sm:mb-7 flex w-fit items-center gap-2 rounded-full border border-[#cbd6cf] bg-[#fbfcf9] px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.08em] text-[#40605c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e26e4b]" />
            {TAX_YEAR} FEDERAL & STATE ESTIMATES
          </div>
          <h1 className="max-w-[550px] text-[clamp(2.4rem,7.2vw,5.4rem)] font-black leading-[0.93] sm:leading-[0.89] tracking-[-0.07em] text-[#102a2d]">
            Know your tax.
            <br />
            <em className="font-serif font-normal tracking-[-0.08em] text-[#11716d]">Keep your calm.</em>
          </h1>
          <p className="mt-5 sm:mt-7 max-w-[470px] text-base sm:text-lg leading-7 sm:leading-8 text-[#4b6563]">
            A free 1099 quarterly tax calculator for freelancers. Federal + all 50 states, computed in 60 seconds.
          </p>
          <div className="mt-7 sm:mt-9">
            <DeadlineCard />
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-medium text-[#617673]">
            No signup. No saved data. Just an estimate you can act on.
          </p>
        </div>

        <div
          id="calculator"
          className="relative rounded-[24px] sm:rounded-[30px] border border-[#b7c7be] bg-[#fbfcf8] p-4 sm:p-8 shadow-[0_12px_24px_rgba(17,113,109,0.06)]"
        >
          <div className="mb-5 sm:mb-7 flex items-start justify-between gap-3 border-b border-[#d9e0d8] pb-5 sm:pb-6">
            <div>
              <p className="eyebrow">YOUR QUICK ESTIMATE</p>
              <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-extrabold tracking-[-0.04em]">
                Start with your annual numbers
              </h2>
            </div>
            <span className="rounded-full bg-[#dcebe4] px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-extrabold text-[#226057] whitespace-nowrap">
              ~ 60s
            </span>
          </div>
          <form onSubmit={submit} className="grid gap-4 sm:gap-5 sm:grid-cols-2">
            <label className="input-label sm:col-span-2">
              Expected annual net freelance income <span>after expenses</span>
              <div className="input-wrap">
                <b>$</b>
                <input
                  value={income}
                  onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  aria-label="Expected annual net freelance income"
                />
                <span className="input-tail">/ year</span>
              </div>
            </label>
            <label className="input-label">
              Filing status
              <select value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)}>
                <option value="single">Single</option>
                <option value="marriedJoint">Married filing jointly</option>
                <option value="marriedSeparate">Married filing separately</option>
                <option value="head">Head of household</option>
              </select>
            </label>
            <label className="input-label">
              State of residence
              <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                {US_STATES.map((s) => (
                  <option value={s.code} key={s.code}>
                    {s.name} {s.isNoTax ? "(0% Tax)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <div className="input-label sm:col-span-2">
              Do you also have W-2 job income?
              <div className="toggle-box">
                <button type="button" onClick={() => setHasW2(true)} className={hasW2 ? "selected" : ""}>
                  Yes
                </button>
                <button type="button" onClick={() => setHasW2(false)} className={!hasW2 ? "selected" : ""}>
                  No
                </button>
              </div>
            </div>
            {hasW2 && (
              <label className="input-label sm:col-span-2">
                Expected W-2 wages <span>optional, helps bracket precision</span>
                <div className="input-wrap">
                  <b>$</b>
                  <input
                    value={w2}
                    onChange={(e) => setW2(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    aria-label="Expected W-2 wages"
                  />
                  <span className="input-tail">/ year</span>
                </div>
              </label>
            )}
            <div className="sm:col-span-2 mt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <p className="max-w-[360px] text-xs leading-5 text-[#687b78]">
                Federal + {results.stateName} tax rules applied automatically.
              </p>
              <button className="calc-button w-full sm:w-auto" type="submit">
                Calculate my quarterly tax <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="border-y border-[#c8d5cc] bg-[#eef2ea]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <SocialProof />
        </div>
      </section>



      {/* ─── Results ─── */}
      <section id="results" className="relative border-y border-[#bed0c6] bg-[#174d4d] text-[#f5f7ef]">
        <div
          ref={confettiRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-[1240px] gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8 lg:px-8 lg:py-16">
          <div>
            <p className="eyebrow text-[#aed3c7]">
              {calculated ? `YOUR ${TAX_YEAR} COMBINED ESTIMATE` : "SEE THE BIG NUMBER FIRST"}
            </p>
            <h2 className="mt-2.5 sm:mt-3 max-w-[440px] text-[clamp(2.2rem,5.5vw,4.2rem)] font-black leading-[0.96] tracking-[-0.07em]">
              What to set aside, <em className="font-serif font-normal">without guesswork.</em>
            </h2>
            <p className="mt-4 max-w-[410px] text-sm sm:text-base leading-6 sm:leading-7 text-[#c7ddda]">
              Your combined federal + {results.stateName} estimated tax, split into four quarterly payments.
            </p>
          </div>
          <div className="rounded-[20px] sm:rounded-[24px] bg-[#f2f4ec] p-5 sm:p-8 text-[#102a2d]">
            <p className="eyebrow text-[#497067]">ESTIMATED PAYMENT DUE THIS QUARTER (FED + STATE)</p>
            <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline justify-between gap-2 sm:gap-4">
              <strong className="text-[clamp(2.8rem,7.5vw,5.5rem)] font-black leading-none tracking-[-0.08em] text-[#102a2d]">
                {formatMoney(results.quarterly)}
              </strong>
              <span className="rounded-full bg-[#dcebe4] px-2.5 py-1 text-xs font-extrabold text-[#24675f]">
                every 3 months
              </span>
            </div>
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 border-t border-[#cbd7cf] pt-4 sm:pt-5 sm:grid-cols-4">
              <Metric label="SE tax" fullLabel="Self-employment" value={results.seTax} />
              <Metric label="Federal tax" fullLabel="Federal income" value={results.federal} />
              <div className="rounded-lg bg-white/60 p-2.5 sm:bg-transparent sm:p-0 sm:border-r sm:border-[#cbd7cf] sm:pr-4">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.06em] text-[#65817a] truncate">
                  {results.stateName} Tax
                </p>
                {results.isNoStateTax ? (
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#dcebe4] px-2 py-0.5 text-[11px] font-extrabold text-[#226057]">
                    0% No Tax
                  </div>
                ) : (
                  <p className="mt-1 text-lg sm:text-xl font-extrabold tracking-[-0.04em] truncate">
                    {formatMoney(results.stateTax)}
                  </p>
                )}
              </div>
              <Metric label="Est. Total" fullLabel="Annual Total" value={results.total} last />
            </div>
            <div className="mt-5 sm:mt-6 rounded-xl border border-[#b6d1c3] bg-[#e4efe8] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-5 text-[#28574f]">
              <b>Safe-harbor rule:</b> Paying at least 100% (or 110% for high earners) of last year's total tax liability generally protects you from penalties.
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ad Slot: Leaderboard ─── */}
      <div className="mx-auto max-w-[1240px] px-4 py-2 sm:px-6 lg:px-8">
        <AdBanner format="leaderboard" />
      </div>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className="eyebrow">CLEAR, NOT CLEVER</p>
            <h2 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1] tracking-[-0.06em]">
              The math in plain English.
            </h2>
            <p className="mt-4 sm:mt-6 max-w-md text-base sm:text-lg leading-7 sm:leading-8 text-[#4d6563]">
              Freelancers pay two kinds of federal tax. We show both so you know what your money is doing.
            </p>
            <Link
              to="/how-estimated-taxes-work"
              className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0b6664] underline underline-offset-4"
            >
              Read the full breakdown <span>→</span>
            </Link>
          </div>
          <div className="divide-y divide-[#c8d5cc] border-y border-[#c8d5cc]">
            {[
              [
                "01",
                "Start with profit",
                "Enter freelance income after ordinary business expenses — not your gross client invoices.",
              ],
              [
                "02",
                "Add self-employment tax",
                "We estimate Social Security and Medicare taxes on 92.35% of your net self-employment earnings.",
              ],
              [
                "03",
                "Estimate income tax",
                "We use your filing status, W-2 wages, a standard deduction, and progressive federal brackets.",
              ],
              [
                "04",
                "Split it into four",
                "Your annual estimate becomes a simple quarterly amount you can plan around.",
              ],
            ].map(([n, t, d]) => (
              <div className="grid grid-cols-[38px_1fr] sm:grid-cols-[52px_1fr] gap-3 sm:gap-4 py-4 sm:py-5" key={n}>
                <span className="pt-0.5 font-mono text-xs font-bold text-[#0d706a]">{n}</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-[-0.025em]">{t}</h3>
                  <p className="mt-1 text-sm sm:text-base leading-6 text-[#58706c]">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <Testimonials />

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-12 sm:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em]">
            You've got questions.
            <br />
            <em className="font-serif font-normal">Fair.</em>
          </h2>
          <div className="mt-8 sm:mt-10 faq-list">
            {faqs.map(([q, a], i) => (
              <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="faq-trigger"
                  aria-expanded={openFaq === i}
                >
                  <span>{q}</span>
                  <span className="faq-icon-wrap" aria-hidden="true">
                    <svg
                      className="h-4 w-4 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div className="faq-collapse">
                  <div className="faq-collapse-inner">
                    <div className="faq-content">
                      <p>
                        {a}{" "}
                        <a
                          className="font-bold text-[#0b6664] underline underline-offset-4 hover:text-[#084846] transition-colors"
                          href="https://www.irs.gov/payments/estimated-taxes"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Learn more at IRS.gov.
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/faq"
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0b6664] underline underline-offset-4"
          >
            See the full FAQ page <span>→</span>
          </Link>
        </div>
      </section>

      {/* ─── Ad Slot: Between sections ─── */}
      <div className="mx-auto max-w-[1240px] px-4 pb-4 sm:px-6 lg:px-8">
        <AdBanner format="leaderboard" />
      </div>

      {/* ─── Resources + Privacy Aside ─── */}
      <section id="resources" className="mx-auto grid max-w-[1240px] gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-8">
        <article className="rounded-[22px] sm:rounded-[26px] bg-[#f9e4b3] p-6 sm:p-10">
          <p className="eyebrow text-[#855f23]">MAKE IT EASIER NEXT TIME</p>
          <h2 className="mt-2.5 sm:mt-3 max-w-xl text-2xl sm:text-4xl font-black leading-[1.05] sm:leading-[1] tracking-[-0.05em]">
            Quarterly tax isn't a surprise if you build a small rhythm around it.
          </h2>
          <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-[#66532f]">
            Each time you get paid, move a portion into a separate savings account. Review your profit
            monthly. Then return here before each deadline to refresh the estimate.
          </p>
          <a
            href="#calculator"
            className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#143e3f] px-5 py-3 text-sm font-bold text-white w-full sm:w-auto"
          >
            Run a fresh estimate <span>→</span>
          </a>
        </article>
        <aside className="rounded-[22px] sm:rounded-[26px] border border-[#bdd0c3] bg-[#fbfcf8] p-6 sm:p-8">
          <p className="eyebrow">A QUICK NOTE</p>
          <h3 className="mt-2.5 sm:mt-3 text-xl sm:text-2xl font-extrabold tracking-[-0.04em]">
            The calculator stays on your device.
          </h3>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-[#58706c]">
            We don't ask for an email, save your income, or send your figures to a server. It is just a
            quick estimate, right where you are.
          </p>
          <div className="mt-5 sm:mt-6 border-t border-[#d5ded7] pt-4 sm:pt-5 text-xs sm:text-sm text-[#607572]">
            <b className="text-[#24484a]">Not tax advice.</b> This tool provides estimates for
            informational purposes only. Consult a licensed CPA or tax professional.
          </div>
        </aside>
      </section>

      {/* ─── Freelancer Toolkit Section ─── */}
      <section className="mx-auto max-w-[1240px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <p className="eyebrow text-center">FREELANCER TOOLKIT</p>
        <h2 className="mt-2.5 sm:mt-3 text-center text-3xl sm:text-4xl font-black tracking-[-0.05em]">
          More tools for your business.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm sm:text-[15px] leading-6 sm:leading-7 text-[#58706c]">
          Free, focused utilities designed specifically for 1099 contractors and freelancers.
        </p>
        <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {freelanceTools.map((item) => (
            <Link
              to={item.link}
              className="coming-soon-card group block transition hover:scale-[1.02] hover:border-[#11716d]"
              key={item.title}
            >
              <span className="cs-badge !bg-[#dcebe4] !text-[#11716d] font-bold">
                {item.badge}
              </span>
              <div className="cs-icon" style={{ background: item.iconBg }}>
                {item.icon}
              </div>
              <h3 className="group-hover:text-[#11716d] transition-colors">{item.title}</h3>
              <p>{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#11716d]">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Newsletter CTA ─── */}
      <section className="bg-[#174d4d] py-12 sm:py-16 text-center">
        <div className="mx-auto max-w-[600px] px-4 sm:px-6">
          <p className="eyebrow text-[#aed3c7]">NEVER MISS A DEADLINE</p>
          <h2 className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.05em] text-white">
            Get a reminder before each quarterly payment.
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-[15px] leading-6 sm:leading-7 text-[#a8cec7]">
            Get notified before each IRS quarterly deadline. No spam, no upsells — just a timely reminder.
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <NewsletterSignup dark />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  fullLabel,
  value,
  last,
}: {
  label: string;
  fullLabel?: string;
  value: number;
  last?: boolean;
}) {
  return (
    <div
      className={`rounded-lg bg-white/60 p-2.5 sm:bg-transparent sm:p-0 ${
        last
          ? "sm:border-l sm:border-[#cbd7cf] sm:pl-5"
          : "sm:border-r sm:border-[#cbd7cf] sm:pr-5"
      }`}
    >
      <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.06em] text-[#65817a] truncate">
        <span className="sm:hidden">{label}</span>
        <span className="hidden sm:inline">{fullLabel || label}</span>
      </p>
      <p className="mt-1 text-lg sm:text-xl font-extrabold tracking-[-0.04em] truncate">
        {formatMoney(value)}
      </p>
    </div>
  );
}
