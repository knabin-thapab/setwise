import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { STATE_TAX_RULES, US_STATES } from "../lib/stateTax";
import { getStateContent } from "../lib/stateContent";
import { FilingStatus, TAX_YEAR, calculate, formatMoney } from "../lib/tax";
import { getNextDeadline } from "../lib/deadlines";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";
import Breadcrumbs from "../components/Breadcrumbs";
import RelatedTools, { TOOL_SETS } from "../components/RelatedTools";
import AdBanner from "../components/AdBanner";

export default function StateTaxPage() {
  const { stateSlug } = useParams<{ stateSlug?: string }>();
  const navigate = useNavigate();

  // Resolve state from slug or code. If a state is in our state list but
  // doesn't yet have verified bracket data in STATE_TAX_RULES, we must NOT
  // silently substitute another state's real numbers under this state's
  // name — that would show a wrong, specific-looking figure. Instead we
  // keep the real state name/code and fall back to the labeled national
  // average estimate (STATE_TAX_RULES.DEFAULT), same as calculateStateTax()
  // already does for state tax dollar amounts.
  const selectedState = useMemo(() => {
    if (!stateSlug) return STATE_TAX_RULES["CA"];
    const normalized = stateSlug.toLowerCase().replace(/[-_]/g, "");
    const match = US_STATES.find(
      (s) =>
        s.code.toLowerCase() === normalized ||
        s.name.toLowerCase().replace(/\s+/g, "") === normalized
    );
    if (!match) return STATE_TAX_RULES["CA"];
    if (STATE_TAX_RULES[match.code]) {
      return STATE_TAX_RULES[match.code];
    }
    // Verified bracket data not yet available for this state — use the
    // honest average-rate fallback, but keep this state's real name/code.
    return {
      ...STATE_TAX_RULES["DEFAULT"],
      code: match.code,
      name: match.name,
      notes: `Verified ${match.name}-specific tax brackets are not published on this site yet. Showing a national average estimate (~4.5%) instead — check ${match.name}'s Department of Revenue for exact figures.`,
    };
  }, [stateSlug]);

  const pagePath = stateSlug ? `/state-tax/${stateSlug}` : "/state-tax";

  usePageMeta({
    title: stateSlug
      ? `${selectedState.name} 1099 Tax Calculator (${TAX_YEAR}) | Setwise`
      : `50-State 1099 Tax Calculator (${TAX_YEAR}) | Setwise`,
    description: stateSlug
      ? selectedState.type === "none"
        ? `${selectedState.name} has no state income tax. Calculate your federal self-employment and quarterly estimated tax as a freelancer in ${selectedState.name} — free, no signup.`
        : `Estimate your ${TAX_YEAR} federal and ${selectedState.name} state quarterly taxes as a freelancer or 1099 contractor. ${selectedState.notes ?? ""} Free calculator, no signup required.`
      : `Calculate federal and state quarterly taxes for all 50 US states. Free 1099 tax calculator for freelancers — updated for ${TAX_YEAR}.`,
    path: pagePath,
  });

  const stateInfo = useMemo(() => {
    return getStateContent(
      selectedState.code,
      selectedState.name,
      selectedState.type === "none"
    );
  }, [selectedState]);

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${selectedState.name} 1099 Tax Calculator`,
      url: `https://tnabin.com.np${pagePath}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: `Free ${selectedState.name} quarterly estimated tax calculator for freelancers and 1099 contractors. Updated for ${TAX_YEAR}.`,
    }),
    [selectedState, pagePath]
  );

  useStructuredData(schema);

  const [income, setIncome] = useState("90000");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [hasW2, setHasW2] = useState(false);
  const [w2, setW2] = useState("0");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [results, setResults] = useState(() =>
    calculate(90000, 0, "single", selectedState.code)
  );

  const numbers = useMemo(
    () =>
      calculate(
        Number(income) || 0,
        hasW2 ? Number(w2) || 0 : 0,
        status,
        selectedState.code
      ),
    [income, w2, hasW2, status, selectedState]
  );

  const deadline = useMemo(() => getNextDeadline(), []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setResults(numbers);
  };

  const topStates = [
    { name: "California", slug: "california", code: "CA" },
    { name: "New York", slug: "new-york", code: "NY" },
    { name: "Texas (0%)", slug: "texas", code: "TX" },
    { name: "Florida (0%)", slug: "florida", code: "FL" },
    { name: "Washington (0%)", slug: "washington", code: "WA" },
    { name: "Illinois", slug: "illinois", code: "IL" },
    { name: "Pennsylvania", slug: "pennsylvania", code: "PA" },
    { name: "Georgia", slug: "georgia", code: "GA" },
    { name: "North Carolina", slug: "north-carolina", code: "NC" },
    { name: "Colorado", slug: "colorado", code: "CO" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1240px] min-w-0 px-4 py-8 sm:py-12 lg:px-8">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={
          stateSlug
            ? [
                { label: "Home", href: "/" },
                { label: "State Taxes", href: "/state-tax" },
                { label: `${selectedState.name} 1099 Tax`, href: `/state-tax/${stateSlug}` },
              ]
            : [
                { label: "Home", href: "/" },
                { label: "State Taxes", href: "/state-tax" },
              ]
        }
      />

      {/* State Switcher Bar with Infinite Smooth Marquee */}
      <div className="mb-6 sm:mb-8 border-b border-[#cbd7cf] pb-4 sm:pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="eyebrow">POPULAR STATES:</span>
          </div>
          {/* Quick Select Dropdown for all 50 states */}
          <div className="flex items-center gap-2">
            <label htmlFor="state-select" className="text-xs font-bold text-[#40605c] whitespace-nowrap">
              Jump to state:
            </label>
            <select
              id="state-select"
              value={selectedState.code}
              onChange={(e) => {
                const target = US_STATES.find((s) => s.code === e.target.value);
                if (target) {
                  navigate(`/state-tax/${target.name.toLowerCase().replace(/\s+/g, "-")}`);
                }
              }}
              className="rounded-lg border border-[#cbd6cf] bg-white px-2.5 py-1.5 text-xs font-bold text-[#102a2d] outline-none"
            >
              {US_STATES.map((s) => (
                <option value={s.code} key={s.code}>
                  {s.name} {s.isNoTax ? "(0% Tax)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Infinite Marquee Section with Fade Mask */}
        <div className="relative flex w-full overflow-hidden mask-edges group py-2">
          <div className="animate-marquee hover:cursor-grab active:cursor-grabbing">
            {[0, 1, 2, 3].map((arrIdx) => (
              <div key={arrIdx} className="flex gap-2.5 pr-2.5">
                {topStates.map((s, i) => {
                  const isActive = selectedState.code === s.code;
                  return (
                    <Link
                      key={`${arrIdx}-${s.code}-${i}`}
                      to={`/state-tax/${s.slug}`}
                      className={`
                        px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 shrink-0
                        ${isActive
                          ? "bg-[#11716d] text-white border-transparent shadow-sm"
                          : "bg-white/85 text-[#1b4b45] border border-[#bdece1] hover:bg-white hover:border-[#11716d]/50"
                        }
                      `}
                    >
                      {s.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        {/* Left Column: Context & State Details */}
        <div>
          <div className="mb-3 sm:mb-4 flex w-fit items-center gap-2 rounded-full border border-[#cbd6cf] bg-[#fbfcf9] px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.08em] text-[#40605c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#11716d]" />
            {TAX_YEAR} {selectedState.name.toUpperCase()} TAX GUIDE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d]">
            {selectedState.name} 1099 Tax Calculator
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-[#4b6563]">
            {stateInfo.summary}
          </p>

          <div className="mt-6 sm:mt-8 rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-black tracking-[-0.03em] text-[#102a2d]">
              {selectedState.name} Tax Rules Breakdown
            </h2>
            <div className="mt-4 space-y-3 text-xs sm:text-sm text-[#4b6563]">
              <div className="flex justify-between border-b border-[#e5ebe6] pb-2">
                <span className="font-semibold text-[#102a2d]">Tax System Type:</span>
                <span className="font-bold text-[#11716d] capitalize">
                  {selectedState.type === "none"
                    ? "0% No Income Tax"
                    : selectedState.type === "flat"
                      ? "Flat Tax Rate"
                      : "Progressive Brackets"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ebe6] pb-2">
                <span className="font-semibold text-[#102a2d]">State Rate Structure:</span>
                <span>{numbers.stateRateDesc}</span>
              </div>
              <div className="flex justify-between border-b border-[#e5ebe6] pb-2">
                <span className="font-semibold text-[#102a2d]">Data Verification:</span>
                <span>{selectedState.lastVerified} (2026 Tax Year)</span>
              </div>
              {selectedState.notes && (
                <p className="pt-2 text-xs leading-5 text-[#6a837e]">
                  <b>Note:</b> {selectedState.notes}
                </p>
              )}
            </div>
            <a
              href={selectedState.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#11716d] underline underline-offset-4"
            >
              Visit {selectedState.name} Department of Revenue Portal ↗
            </a>
          </div>

          <div className="mt-6 sm:mt-8 rounded-2xl bg-[#e4efe8] p-5 sm:p-6 text-xs sm:text-sm text-[#28574f]">
            <p className="font-bold">Next Quarterly Due Date: {deadline.label}</p>
            <p className="mt-1 leading-6">
              Individual estimated tax vouchers are typically filed quarterly. If you live in{" "}
              {selectedState.name}, track your net earnings each quarter to avoid penalties.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive State Calculator */}
        <div className="rounded-[22px] sm:rounded-[28px] border border-[#b7c7be] bg-[#fbfcf8] p-5 sm:p-8 shadow-xl">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-[-0.03em] text-[#102a2d]">
            Estimate {selectedState.name} Quarterly Payment
          </h2>
          <form onSubmit={submit} className="mt-5 sm:mt-6 grid gap-4 sm:grid-cols-2">
            <label className="input-label sm:col-span-2">
              Annual Freelance Profit <span>after expenses</span>
              <div className="input-wrap">
                <b>$</b>
                <input
                  value={income}
                  onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  aria-label="Annual freelance profit"
                />
                <span className="input-tail">/ year</span>
              </div>
            </label>

            <label className="input-label sm:col-span-2">
              Filing Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FilingStatus)}
              >
                <option value="single">Single</option>
                <option value="marriedJoint">Married filing jointly</option>
                <option value="marriedSeparate">Married filing separately</option>
                <option value="head">Head of household</option>
              </select>
            </label>

            <button className="calc-button sm:col-span-2 mt-2 w-full" type="submit">
              Recalculate {selectedState.name} Tax <span>→</span>
            </button>
          </form>

          {/* Result Highlight */}
          <div className="mt-6 sm:mt-8 rounded-2xl bg-[#174d4d] p-5 sm:p-6 text-white">
            <p className="eyebrow text-[#aed3c7]">ESTIMATED QUARTERLY PAYMENT</p>
            <div className="mt-2 text-3xl sm:text-4xl font-black tracking-[-0.06em]">
              {formatMoney(results.quarterly)}
              <span className="ml-2 text-xs sm:text-sm font-semibold text-[#aed3c7]">/ quarter</span>
            </div>
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 border-t border-[#296868] pt-4 text-xs">
              <div className="rounded bg-black/10 p-2 sm:bg-transparent sm:p-0">
                <p className="text-[#aed3c7] font-semibold text-[11px]">Self-Employment</p>
                <p className="text-base font-bold mt-0.5">{formatMoney(results.seTax)}</p>
              </div>
              <div className="rounded bg-black/10 p-2 sm:bg-transparent sm:p-0">
                <p className="text-[#aed3c7] font-semibold text-[11px]">Federal Income</p>
                <p className="text-base font-bold mt-0.5">{formatMoney(results.federal)}</p>
              </div>
              <div className="rounded bg-black/10 p-2 sm:bg-transparent sm:p-0">
                <p className="text-[#aed3c7] font-semibold text-[11px] truncate">{selectedState.name} Tax</p>
                <p className="text-base font-bold mt-0.5 truncate">
                  {results.isNoStateTax ? "0% (No Tax)" : formatMoney(results.stateTax)}
                </p>
              </div>
              <div className="rounded bg-black/10 p-2 sm:bg-transparent sm:p-0">
                <p className="text-[#aed3c7] font-semibold text-[11px]">Annual Total</p>
                <p className="text-base font-bold mt-0.5">{formatMoney(results.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── State-Specific Educational Guide Section ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#cbd7cf] pt-8 sm:pt-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <p className="eyebrow">STATE TAX GUIDE</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[#102a2d]">
              How Taxes Work for Freelancers in {selectedState.name}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-7 text-[#4b6563]">
              {stateInfo.systemDescription}
            </p>

            {stateInfo.localTaxNote && (
              <div className="mt-4 rounded-xl border border-[#d2e0d7] bg-[#f2f7f4] p-4 text-xs sm:text-sm text-[#2a4d49] leading-relaxed">
                <strong>Local & Municipal Tax Note:</strong> {stateInfo.localTaxNote}
              </div>
            )}

            <div className="mt-6 space-y-2.5">
              <h3 className="text-sm font-extrabold text-[#102a2d]">
                Key Filing Tips for {selectedState.name} Contractors:
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#4b6563]">
                {stateInfo.freelancerTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#11716d] font-black">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* State FAQ Accordion */}
          <div>
            <p className="eyebrow">{selectedState.name.toUpperCase()} FAQS</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[#102a2d]">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 faq-list">
              {stateInfo.faqs.map((faq, i) => (
                <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={faq.question}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="faq-trigger !py-3"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-xs sm:text-sm font-bold">{faq.question}</span>
                    <span className="faq-icon-wrap !h-6 !w-6" aria-hidden="true">
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-300"
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
                      <div className="faq-content text-xs sm:text-sm leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 50-State Tax Directory Grid ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#cbd7cf] pt-8 sm:pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <p className="eyebrow">50-STATE DIRECTORY</p>
            <h2 className="text-xl sm:text-2xl font-black tracking-[-0.04em] text-[#102a2d]">
              Calculate State Tax in Other States
            </h2>
          </div>
          <span className="text-xs text-[#6a8e87]">Updated for 2026 tax year</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {US_STATES.map((s) => {
            const slug = s.name.toLowerCase().replace(/\s+/g, "-");
            const isCurrent = s.code === selectedState.code;
            return (
              <Link
                key={s.code}
                to={`/state-tax/${slug}`}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? "bg-[#11716d] text-white border-[#11716d] font-black shadow-xs"
                    : "bg-[#fbfcf8] border-[#cbd6cf] text-[#2a4d49] hover:border-[#11716d] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold truncate">{s.name}</span>
                  {s.isNoTax && (
                    <span className={`text-[9px] font-bold px-1 rounded ${
                      isCurrent ? "bg-white/20 text-white" : "bg-[#dcf0ea] text-[#11716d]"
                    }`}>
                      0%
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Related Tools */}
      <RelatedTools tools={TOOL_SETS.stateTax} />

      <div className="mx-auto max-w-[1240px] px-4 py-4 sm:px-6 lg:px-8 mt-8">
        <AdBanner format="leaderboard" />
      </div>
    </main>
  );
}

