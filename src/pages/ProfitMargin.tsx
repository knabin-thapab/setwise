import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveTable from "../components/ResponsiveTable";
import Breadcrumbs from "../components/Breadcrumbs";
import RelatedTools, { TOOL_SETS } from "../components/RelatedTools";
import { US_STATES } from "../lib/stateTax";
import { FilingStatus, calculate, formatMoney } from "../lib/tax";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";

export default function ProfitMargin() {
  usePageMeta({
    title: "Freelance Profit Margin, Markup & Client Pricing Calculator (2026) | Setwise",
    description: "Find your real freelance take-home pay after taxes and expenses, your true hourly rate, and the client rate you need to charge to hit your income goal.",
    path: "/profit-margin-calculator",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Setwise Freelance Profit Margin & Pricing Calculator",
      url: "https://tnabin.com.np/profit-margin-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Calculate freelance take-home pay after taxes and business overhead, convert markup to margin, and generate client rate cards.",
    }),
    []
  );

  useStructuredData(schema);

  // Main Mode: Real Take-Home vs Target Take-Home vs Markup Converter vs Rate Card
  const [activeTab, setActiveTab] = useState<"takehome" | "reverse" | "markup" | "ratecard">("takehome");

  // ══════════════════════════════════════════════════════════════
  // MODE 1: TAKE-HOME & PROFIT MARGIN STATE
  // ══════════════════════════════════════════════════════════════
  const [period, setPeriod] = useState<"annual" | "monthly">("annual");
  const [grossRevenue, setGrossRevenue] = useState("120000");
  const [expenses, setExpenses] = useState("18000");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");
  const [totalWorkHoursPerWeek, setTotalWorkHoursPerWeek] = useState("40");
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState("28");
  const [weeksWorkedPerYear, setWeeksWorkedPerYear] = useState("48"); // 4 weeks PTO

  // Normalize to annual for math
  const multiplier = period === "monthly" ? 12 : 1;
  const annualGross = (Number(grossRevenue) || 0) * multiplier;
  const annualExpenses = (Number(expenses) || 0) * multiplier;
  const annualProfit = Math.max(0, annualGross - annualExpenses);

  // Compute tax on net freelance profit
  const taxResults = useMemo(() => {
    return calculate(annualProfit, 0, status, stateCode);
  }, [annualProfit, status, stateCode]);

  // Real Net Take-Home
  const totalTax = taxResults.total;
  const netTakeHome = Math.max(0, annualProfit - totalTax);

  // Percentages for the breakdown bar
  const gross = annualGross || 1;
  const expensePct = Math.min(100, Math.max(0, (annualExpenses / gross) * 100));
  const seTaxPct = Math.min(100, Math.max(0, (taxResults.seTax / gross) * 100));
  const incomeTaxPct = Math.min(
    100,
    Math.max(0, ((taxResults.federal + taxResults.stateTax) / gross) * 100)
  );
  const takeHomePct = Math.max(0, 100 - expensePct - seTaxPct - incomeTaxPct);

  // Hourly Analysis
  const annualBillableHours =
    (Number(billableHoursPerWeek) || 1) * (Number(weeksWorkedPerYear) || 1);
  const annualTotalHours =
    (Number(totalWorkHoursPerWeek) || 1) * (Number(weeksWorkedPerYear) || 1);

  const nominalHourlyRate = annualGross / (annualBillableHours || 1);
  const trueHourlyRateBillable = netTakeHome / (annualBillableHours || 1);
  const trueHourlyRateAllHours = netTakeHome / (annualTotalHours || 1);

  // ══════════════════════════════════════════════════════════════
  // MODE 2: REVERSE TARGET TAKE-HOME STATE
  // ══════════════════════════════════════════════════════════════
  const [targetNetTakeHome, setTargetNetTakeHome] = useState("80000");
  const [targetExpenses, setTargetExpenses] = useState("15000");
  const [targetBillableHoursWeek, setTargetBillableHoursWeek] = useState("25");
  const [targetWeeksPerYear, setTargetWeeksPerYear] = useState("48");

  // Approximate gross needed to net target after taxes & expenses:
  // Using an iterative search to find gross revenue where net take-home equals targetNetTakeHome
  const targetMath = useMemo(() => {
    const desiredNet = Number(targetNetTakeHome) || 0;
    const exp = Number(targetExpenses) || 0;

    let low = desiredNet + exp;
    let high = (desiredNet + exp) * 2.5 + 50000;
    let requiredGross = low;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const profit = Math.max(0, mid - exp);
      const testTax = calculate(profit, 0, status, stateCode);
      const testNet = profit - testTax.total;

      if (Math.abs(testNet - desiredNet) < 1) {
        requiredGross = mid;
        break;
      }
      if (testNet < desiredNet) {
        low = mid;
      } else {
        high = mid;
      }
      requiredGross = mid;
    }

    const billableHrs =
      (Number(targetBillableHoursWeek) || 1) * (Number(targetWeeksPerYear) || 1);
    const requiredHourly = requiredGross / (billableHrs || 1);
    const dayRate = requiredHourly * 8;
    const weeklyRetainer = requiredHourly * (Number(targetBillableHoursWeek) || 1);
    const monthlyRetainer = requiredGross / 12;

    const finalProfit = Math.max(0, requiredGross - exp);
    const finalTax = calculate(finalProfit, 0, status, stateCode);

    return {
      requiredGross,
      requiredHourly,
      dayRate,
      weeklyRetainer,
      monthlyRetainer,
      totalTaxes: finalTax.total,
      billableHoursTotal: billableHrs,
    };
  }, [targetNetTakeHome, targetExpenses, targetBillableHoursWeek, targetWeeksPerYear, status, stateCode]);

  // ══════════════════════════════════════════════════════════════
  // MODE 3: MARKUP VS MARGIN CALCULATOR STATE
  // ══════════════════════════════════════════════════════════════
  const [projectCost, setProjectCost] = useState("2000");
  const [markupPercent, setMarkupPercent] = useState("50");

  const costNum = Number(projectCost) || 0;
  const markupNum = Number(markupPercent) || 0;
  const calculatedSellingPrice = costNum * (1 + markupNum / 100);
  const calculatedGrossProfit = calculatedSellingPrice - costNum;
  const calculatedGrossMarginPct =
    calculatedSellingPrice > 0 ? (calculatedGrossProfit / calculatedSellingPrice) * 100 : 0;

  // Rate card copy indicator
  const [copiedRateCard, setCopiedRateCard] = useState(false);

  const handleCopyRateCard = () => {
    const cardText = `
SETWISE FREELANCE PRICING & RATE CARD (2026)
---------------------------------------------
Hourly Rate: $${Math.round(nominalHourlyRate)} / hr
Half-Day (4 hrs): $${Math.round(nominalHourlyRate * 4)}
Full-Day Sprint (8 hrs): $${Math.round(nominalHourlyRate * 8)}
Weekly Dedicated Retainer: $${Math.round(nominalHourlyRate * (Number(billableHoursPerWeek) || 20))}
Monthly Advisory Retainer: $${Math.round(annualGross / 12)}
---------------------------------------------
Generated via Setwise.io
    `.trim();

    navigator.clipboard.writeText(cardText).then(() => {
      setCopiedRateCard(true);
      setTimeout(() => setCopiedRateCard(false), 2500);
    });
  };

  const revenuePresets = [
    { label: "$60k", value: "60000" },
    { label: "$100k", value: "100000" },
    { label: "$150k", value: "150000" },
    { label: "$250k", value: "250000" },
  ];

  return (
    <main className="mx-auto max-w-[1240px] px-3.5 py-6 sm:px-6 sm:py-10 lg:px-8 w-full overflow-x-hidden min-w-0">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/#calculator" },
          { label: "Profit Margin & Pricing", href: "/profit-margin-calculator" },
        ]}
      />

      {/* ─── Hero Header ─── */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd6cf] bg-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#11716d] mb-3 shadow-xs">
          <span>⚡</span> FREELANCE TAKE-HOME & PRICING SUITE (2026)
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d]">
          Freelance Profit Margin & Client Pricing Calculator
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base leading-5 sm:leading-7 text-[#4b6563]">
          Know your real take-home wage after business expenses and taxes, calculate target rates to hit your income goals,
          and master markup vs. margin formulas.
        </p>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="mb-6 flex border-b border-[#d8e2dc] overflow-x-auto scrollbar-none gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("takehome")}
          className={`flex items-center gap-2 border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
            activeTab === "takehome"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>💰</span> Take-Home & Net Margin
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reverse")}
          className={`flex items-center gap-2 border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
            activeTab === "reverse"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>🎯</span> Target Take-Home Rate Builder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("markup")}
          className={`flex items-center gap-2 border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
            activeTab === "markup"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>📐</span> Markup vs. Margin Converter
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ratecard")}
          className={`flex items-center gap-2 border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
            activeTab === "ratecard"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>📜</span> Client Rate Card
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: TAKE-HOME & NET PROFIT MARGIN
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "takehome" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {/* Form Inputs */}
          <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5ebe6] pb-3 sm:pb-4">
              <h2 className="text-base sm:text-xl font-extrabold tracking-[-0.03em] text-[#102a2d]">
                1. Revenue & Expenses
              </h2>
              {/* Period Toggle */}
              <div className="flex rounded-xl border border-[#cbd6cf] bg-[#eef2ea] p-1 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => setPeriod("annual")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    period === "annual" ? "bg-[#11716d] text-white shadow-xs" : "text-[#526967]"
                  }`}
                >
                  Annual
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("monthly")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    period === "monthly" ? "bg-[#11716d] text-white shadow-xs" : "text-[#526967]"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Gross Revenue Input */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <label className="text-xs font-extrabold text-[#2a4d49]">
                  Gross Invoiced Revenue ({period})
                </label>
                <span className="text-[10px] text-[#6a8e87] font-semibold hidden sm:inline">Pre-tax client billings</span>
              </div>
              <div className="input-wrap">
                <b>$</b>
                <input
                  type="text"
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  aria-label="Gross Freelance Revenue"
                />
                <span className="input-tail">/ {period}</span>
              </div>

              {/* Quick Preset Chips */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold text-[#6a8e87] shrink-0 mr-1">Quick:</span>
                {revenuePresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      if (period === "monthly") {
                        setGrossRevenue(Math.round(Number(preset.value) / 12).toString());
                      } else {
                        setGrossRevenue(preset.value);
                      }
                    }}
                    className="shrink-0 rounded-full border border-[#cbd6cf] bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#3a5854] hover:border-[#11716d] active:scale-95"
                  >
                    {preset.label}/yr
                  </button>
                ))}
              </div>
            </div>

            {/* Expenses Input */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <label className="text-xs font-extrabold text-[#2a4d49]">
                  Total Business Overhead & Expenses ({period})
                </label>
                <span className="text-[10px] text-[#6a8e87] font-semibold hidden sm:inline">SaaS, equipment, subcontractors</span>
              </div>
              <div className="input-wrap">
                <b>$</b>
                <input
                  type="text"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  aria-label="Total Business Expenses"
                />
                <span className="input-tail">/ {period}</span>
              </div>
            </div>

            {/* Filing Status & State */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">Filing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FilingStatus)}
                  className="w-full rounded-xl border border-[#b9c9c0] p-2.5 text-xs font-bold outline-none focus:border-[#11716d] bg-white min-h-[42px]"
                >
                  <option value="single">Single</option>
                  <option value="marriedJoint">Married filing jointly</option>
                  <option value="marriedSeparate">Married filing separately</option>
                  <option value="head">Head of household</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">State of Residence</label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full rounded-xl border border-[#b9c9c0] p-2.5 text-xs font-bold outline-none focus:border-[#11716d] bg-white min-h-[42px]"
                >
                  {US_STATES.map((s) => (
                    <option value={s.code} key={s.code}>
                      {s.name} {s.isNoTax ? "(0% State Tax)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Billable Hours Breakdown */}
            <div className="pt-3 border-t border-[#e5ebe6] space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#11716d]">
                2. Working Hours & Non-Billable Time
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5 truncate">
                    Billable Hrs
                  </label>
                  <div className="input-wrap text-xs">
                    <b>⏱</b>
                    <input
                      type="number"
                      value={billableHoursPerWeek}
                      onChange={(e) => setBillableHoursPerWeek(e.target.value)}
                      aria-label="Billable Hours Per Week"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5 truncate">
                    Total Hrs
                  </label>
                  <div className="input-wrap text-xs">
                    <b>⌛</b>
                    <input
                      type="number"
                      value={totalWorkHoursPerWeek}
                      onChange={(e) => setTotalWorkHoursPerWeek(e.target.value)}
                      aria-label="Total Work Hours Per Week"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5 truncate">
                    Weeks/Yr
                  </label>
                  <div className="input-wrap text-xs">
                    <b>🏖️</b>
                    <input
                      type="number"
                      value={weeksWorkedPerYear}
                      onChange={(e) => setWeeksWorkedPerYear(e.target.value)}
                      aria-label="Weeks Worked Per Year"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Breakdown & True Hourly Wage */}
          <div className="space-y-4 sm:space-y-6">
            {/* Master Take-Home & Net Margin Hero Card */}
            <div className="rounded-2xl sm:rounded-[26px] bg-gradient-to-br from-[#102a2d] via-[#143c3e] to-[#0d2224] p-4 sm:p-7 text-white shadow-xl border border-[#2a6262]/40 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#11716d]/40 border border-[#6dd4c8]/30 px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8cefe5]">
                  <span>🛡️</span> {period === "monthly" ? "MONTHLY" : "ANNUAL"} REAL TAKE-HOME
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-black border ${
                    takeHomePct >= 65
                      ? "bg-[#11716d]/60 text-[#a3f0e6] border-[#6dd4c8]/40"
                      : takeHomePct >= 45
                      ? "bg-[#29918b]/40 text-[#c7ddda] border-[#29918b]/50"
                      : "bg-[#b5792a]/40 text-[#fde3b8] border-[#b5792a]/50"
                  }`}
                >
                  {takeHomePct.toFixed(1)}% Net Margin
                </span>
              </div>

              {/* Main Cash In Pocket Display */}
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-[#aed3c7] uppercase tracking-wide">
                  Clean Cash In Pocket (After Taxes & Expenses)
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em] text-[#6dd4c8]">
                    {formatMoney(period === "monthly" ? netTakeHome / 12 : netTakeHome)}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#aed3c7]">
                    / {period} ({formatMoney(period === "monthly" ? netTakeHome : netTakeHome / 12)}/{period === "monthly" ? "yr" : "mo"})
                  </span>
                </div>
              </div>

              {/* Hourly Rate Comparison Pill */}
              <div className="mt-3.5 sm:mt-4 rounded-xl bg-black/30 border border-white/10 p-3 text-xs leading-relaxed text-[#c7ddda] space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
                  <span className="text-[#aed3c7]">Real Take-Home Wage:</span>
                  <span className="font-black text-[#6dd4c8] text-sm sm:text-base">
                    ${trueHourlyRateBillable.toFixed(2)} / billable hr
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#8db5ae] pt-1 border-t border-white/10">
                  <span>Client Quote Rate: <b>${nominalHourlyRate.toFixed(2)}/hr</b></span>
                  <span>All Hours (incl. admin): <b>${trueHourlyRateAllHours.toFixed(2)}/hr</b></span>
                </div>
              </div>

              {/* 4-Card Mobile Responsive Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-3 border-t border-[#2a6262]/60">
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-[#aed3c7] uppercase">Net Margin</p>
                  <p className="text-sm sm:text-base lg:text-lg font-black text-white mt-0.5">
                    {takeHomePct.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-[#aed3c7] uppercase">Monthly Net</p>
                  <p className="text-sm sm:text-base lg:text-lg font-black text-[#6dd4c8] mt-0.5 truncate">
                    {formatMoney(netTakeHome / 12)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-[#aed3c7] uppercase">Quarterly Tax</p>
                  <p className="text-sm sm:text-base lg:text-lg font-black text-white mt-0.5 truncate">
                    {formatMoney(taxResults.quarterly)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-[#aed3c7] uppercase">Total Tax (SE+Inc)</p>
                  <p className="text-sm sm:text-base lg:text-lg font-black text-[#fde3b8] mt-0.5 truncate">
                    {formatMoney(totalTax)}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Stacked Bar Breakdown */}
            <div className="rounded-2xl sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-[-0.02em] text-[#102a2d]">
                  Where Every $100 of Invoiced Revenue Goes
                </h3>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#6a8e87]">
                  {formatMoney(annualGross)} Total
                </span>
              </div>

              {/* Stacked Bar */}
              <div className="mt-2 flex h-7 sm:h-8 w-full overflow-hidden rounded-xl border border-[#cbd6cf] bg-[#eef2ea]">
                <div
                  style={{ width: `${takeHomePct}%` }}
                  className="bg-[#11716d] transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white"
                  title={`Take-Home: ${takeHomePct.toFixed(1)}%`}
                >
                  {takeHomePct > 15 ? `${takeHomePct.toFixed(0)}%` : ""}
                </div>
                <div
                  style={{ width: `${incomeTaxPct}%` }}
                  className="bg-[#29918b] transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white"
                  title={`Income Tax: ${incomeTaxPct.toFixed(1)}%`}
                >
                  {incomeTaxPct > 12 ? `${incomeTaxPct.toFixed(0)}%` : ""}
                </div>
                <div
                  style={{ width: `${seTaxPct}%` }}
                  className="bg-[#b5792a] transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white"
                  title={`Self-Employment Tax: ${seTaxPct.toFixed(1)}%`}
                >
                  {seTaxPct > 12 ? `${seTaxPct.toFixed(0)}%` : ""}
                </div>
                <div
                  style={{ width: `${expensePct}%` }}
                  className="bg-[#c75a3c] transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white"
                  title={`Expenses: ${expensePct.toFixed(1)}%`}
                >
                  {expensePct > 12 ? `${expensePct.toFixed(0)}%` : ""}
                </div>
              </div>

              {/* Legend Cards (2x2) */}
              <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-2.5 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-white border border-[#dce5df] p-2 sm:p-2.5 shadow-2xs">
                  <span className="h-3 w-3 rounded-full bg-[#11716d] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-[#102a2d] text-[10px] sm:text-xs truncate">Take-Home Cash</p>
                    <p className="text-[#11716d] font-black text-[10px] sm:text-[11px] truncate">
                      {takeHomePct.toFixed(1)}% ({formatMoney(netTakeHome)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white border border-[#dce5df] p-2 sm:p-2.5 shadow-2xs">
                  <span className="h-3 w-3 rounded-full bg-[#29918b] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-[#102a2d] text-[10px] sm:text-xs truncate">Income Tax (Fed+State)</p>
                    <p className="text-[#334e4a] font-bold text-[10px] sm:text-[11px] truncate">
                      {incomeTaxPct.toFixed(1)}% ({formatMoney(taxResults.federal + taxResults.stateTax)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white border border-[#dce5df] p-2 sm:p-2.5 shadow-2xs">
                  <span className="h-3 w-3 rounded-full bg-[#b5792a] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-[#102a2d] text-[10px] sm:text-xs truncate">SE Tax (15.3% FICA)</p>
                    <p className="text-[#334e4a] font-bold text-[10px] sm:text-[11px] truncate">
                      {seTaxPct.toFixed(1)}% ({formatMoney(taxResults.seTax)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white border border-[#dce5df] p-2 sm:p-2.5 shadow-2xs">
                  <span className="h-3 w-3 rounded-full bg-[#c75a3c] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-[#102a2d] text-[10px] sm:text-xs truncate">Overhead & Tools</p>
                    <p className="text-[#334e4a] font-bold text-[10px] sm:text-[11px] truncate">
                      {expensePct.toFixed(1)}% ({formatMoney(annualExpenses)})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: REVERSE TARGET TAKE-HOME PRICING ENGINE
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "reverse" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-5">
            <div className="border-b border-[#e5ebe6] pb-3">
              <h2 className="text-base sm:text-xl font-extrabold text-[#102a2d]">
                Target Take-Home Goal
              </h2>
              <p className="text-xs text-[#6a8e87]">
                How much clean personal cash do you want in your bank account?
              </p>
            </div>

            {/* Target Net Cash */}
            <div>
              <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                Target Annual Take-Home (Net Cash in Pocket)
              </label>
              <div className="input-wrap">
                <b>$</b>
                <input
                  type="text"
                  value={targetNetTakeHome}
                  onChange={(e) => setTargetNetTakeHome(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                />
                <span className="input-tail">/ year</span>
              </div>
              <p className="text-[11px] text-[#6a8e87] mt-1">
                Equal to ~<b>${Math.round((Number(targetNetTakeHome) || 0) / 12).toLocaleString()}/month</b> clean income.
              </p>
            </div>

            {/* Target Expenses */}
            <div>
              <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                Estimated Annual Business Expenses
              </label>
              <div className="input-wrap">
                <b>$</b>
                <input
                  type="text"
                  value={targetExpenses}
                  onChange={(e) => setTargetExpenses(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                />
                <span className="input-tail">/ year</span>
              </div>
            </div>

            {/* Billable Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e5ebe6]">
              <div>
                <label className="text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                  Target Billable Hrs/Wk
                </label>
                <div className="input-wrap text-xs">
                  <b>⏱</b>
                  <input
                    type="number"
                    value={targetBillableHoursWeek}
                    onChange={(e) => setTargetBillableHoursWeek(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                  Working Weeks/Year
                </label>
                <div className="input-wrap text-xs">
                  <b>🏖️</b>
                  <input
                    type="number"
                    value={targetWeeksPerYear}
                    onChange={(e) => setTargetWeeksPerYear(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Required Rates to hit Goal */}
          <div className="space-y-4">
            <div className="rounded-[22px] sm:rounded-[24px] bg-[#102a2d] p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6dd4c8]">
                YOUR REQUIRED CLIENT BILLING RATE
              </span>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#6dd4c8] break-words">
                  ${Math.round(targetMath.requiredHourly)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#c7ddda]">/ billable hour</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#c7ddda]">
                To take home <b>${(Number(targetNetTakeHome) || 0).toLocaleString()}</b> clean cash after paying{" "}
                <b>{formatMoney(targetMath.totalTaxes)}</b> in taxes and <b>{formatMoney(Number(targetExpenses) || 0)}</b> in
                expenses, you must generate a gross revenue of <b>{formatMoney(targetMath.requiredGross)}/yr</b>.
              </p>

              {/* Pricing Breakdown Grid - 3 Column on Mobile & Desktop */}
              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3 border-t border-[#264b4f] pt-4 sm:pt-5">
                <div className="rounded-xl bg-white/10 p-2 sm:p-3 text-center sm:text-left">
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#aed3c7] uppercase truncate">Day Rate (8h)</p>
                  <p className="text-sm sm:text-xl font-black text-white mt-0.5 truncate">
                    ${Math.round(targetMath.dayRate).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-2 sm:p-3 text-center sm:text-left">
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#aed3c7] uppercase truncate">Weekly</p>
                  <p className="text-sm sm:text-xl font-black text-white mt-0.5 truncate">
                    ${Math.round(targetMath.weeklyRetainer).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-2 sm:p-3 text-center sm:text-left">
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#aed3c7] uppercase truncate">Monthly</p>
                  <p className="text-sm sm:text-xl font-black text-white mt-0.5 truncate">
                    ${Math.round(targetMath.monthlyRetainer).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: MARKUP VS. MARGIN CONVERTER
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "markup" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input card */}
            <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm space-y-4">
              <h2 className="text-base sm:text-xl font-extrabold text-[#102a2d]">
                Markup vs. Gross Margin Converter
              </h2>
              <p className="text-xs text-[#4b6563]">
                Many freelancers confuse <b>Markup %</b> with <b>Profit Margin %</b> and end up underpricing projects.
              </p>

              <div>
                <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                  Direct Project / Product Cost (COGS)
                </label>
                <div className="input-wrap">
                  <b>$</b>
                  <input
                    type="number"
                    value={projectCost}
                    onChange={(e) => setProjectCost(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                  Desired Markup Percentage (%)
                </label>
                <div className="input-wrap">
                  <b>%</b>
                  <input
                    type="number"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(e.target.value)}
                  />
                </div>
              </div>

              {/* Instant Output Pill */}
              <div className="bg-[#eef4f0] p-4 rounded-xl border border-[#d6e5dc] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#526967]">Final Selling Price to Client:</span>
                  <span className="text-base sm:text-lg font-black text-[#11716d]">{formatMoney(calculatedSellingPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#526967]">Gross Dollar Profit:</span>
                  <span className="font-bold text-[#102a2d]">{formatMoney(calculatedGrossProfit)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#d6e5dc] pt-2">
                  <span className="text-[#526967] font-extrabold">Real Gross Profit Margin:</span>
                  <span className="text-sm sm:text-base font-black text-[#11716d]">{calculatedGrossMarginPct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Comparison Cheat Sheet */}
            <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-white p-4 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-black text-[#102a2d]">
                Markup vs. Margin Reference Table
              </h3>
              <p className="text-xs text-[#526967]">
                Notice how markup is always a higher percentage than the resulting profit margin:
              </p>

              <ResponsiveTable>
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f0f4f1] text-[#486360] font-extrabold">
                    <tr>
                      <th className="p-2.5">Markup %</th>
                      <th className="p-2.5">Multiplier</th>
                      <th className="p-2.5">Gross Margin %</th>
                      <th className="p-2.5">Example ($100 Cost)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5ebe6]">
                    <tr>
                      <td className="p-2.5 font-bold text-[#102a2d]">15% Markup</td>
                      <td className="p-2.5 font-mono">1.15×</td>
                      <td className="p-2.5 text-[#11716d] font-extrabold">13.0% Margin</td>
                      <td className="p-2.5">Sells for $115</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#102a2d]">25% Markup</td>
                      <td className="p-2.5 font-mono">1.25×</td>
                      <td className="p-2.5 text-[#11716d] font-extrabold">20.0% Margin</td>
                      <td className="p-2.5">Sells for $125</td>
                    </tr>
                    <tr className="bg-[#eef6f2]">
                      <td className="p-2.5 font-bold text-[#11716d]">50% Markup</td>
                      <td className="p-2.5 font-mono">1.50×</td>
                      <td className="p-2.5 text-[#11716d] font-black">33.3% Margin</td>
                      <td className="p-2.5 font-semibold">Sells for $150</td>
                    </tr>
                    <tr className="bg-[#e2f1ec]">
                      <td className="p-2.5 font-bold text-[#11716d]">100% Markup</td>
                      <td className="p-2.5 font-mono">2.00×</td>
                      <td className="p-2.5 text-[#11716d] font-black">50.0% Margin</td>
                      <td className="p-2.5 font-semibold">Sells for $200</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#102a2d]">300% Markup</td>
                      <td className="p-2.5 font-mono">4.00×</td>
                      <td className="p-2.5 text-[#11716d] font-extrabold">75.0% Margin</td>
                      <td className="p-2.5">Sells for $400</td>
                    </tr>
                  </tbody>
                </table>
              </ResponsiveTable>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: CLIENT PROPOSAL RATE CARD GENERATOR
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "ratecard" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-white p-4 sm:p-8 shadow-md text-[#102a2d] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ebe6] pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#11716d]">
                  STANDARDIZED RATE SHEET
                </span>
                <h2 className="text-lg sm:text-2xl font-black mt-0.5">Client Pricing & Rate Card</h2>
              </div>
              <button
                type="button"
                onClick={handleCopyRateCard}
                className="w-full sm:w-auto rounded-xl bg-[#11716d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0e5f5c] transition shadow-xs text-center"
              >
                {copiedRateCard ? "✓ Copied to Clipboard!" : "📋 Copy Rate Card"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#cbd6cf] bg-[#fbfcf8] p-4">
                <p className="text-[10px] font-bold uppercase text-[#6a8e87]">Hourly Consulting Rate</p>
                <p className="text-xl sm:text-2xl font-black text-[#102a2d] mt-1 break-words">${Math.round(nominalHourlyRate)} / hr</p>
                <p className="text-[11px] text-[#6a8e87] mt-1">Ideal for ad-hoc consultation & discovery calls</p>
              </div>

              <div className="rounded-xl border border-[#cbd6cf] bg-[#fbfcf8] p-4">
                <p className="text-[10px] font-bold uppercase text-[#6a8e87]">Full-Day Intensive (8h)</p>
                <p className="text-xl sm:text-2xl font-black text-[#11716d] mt-1 break-words">
                  ${Math.round(nominalHourlyRate * 8).toLocaleString()}
                </p>
                <p className="text-[11px] text-[#6a8e87] mt-1">Dedicated full-day focus on project deliverables</p>
              </div>

              <div className="rounded-xl border border-[#cbd6cf] bg-[#fbfcf8] p-4">
                <p className="text-[10px] font-bold uppercase text-[#6a8e87]">Weekly Sprint Retainer</p>
                <p className="text-xl sm:text-2xl font-black text-[#102a2d] mt-1 break-words">
                  ${Math.round(nominalHourlyRate * (Number(billableHoursPerWeek) || 20)).toLocaleString()}
                </p>
                <p className="text-[11px] text-[#6a8e87] mt-1">
                  Guaranteed {billableHoursPerWeek} hrs/week reserved client capacity
                </p>
              </div>

              <div className="rounded-xl border border-[#cbd6cf] bg-[#fbfcf8] p-4">
                <p className="text-[10px] font-bold uppercase text-[#6a8e87]">Monthly Advisory Retainer</p>
                <p className="text-xl sm:text-2xl font-black text-[#11716d] mt-1 break-words">
                  ${Math.round(annualGross / 12).toLocaleString()} / mo
                </p>
                <p className="text-[11px] text-[#6a8e87] mt-1">Predictable priority support & strategic execution</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Informational & Editorial Guide (AdSense-Compliant Authority) ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#d8e2dc] pt-10 space-y-10">
        <div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-[#102a2d]">
            The Freelancer Pricing Masterclass: Formulas, Margins & Traps
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4b6563] max-w-3xl leading-relaxed">
            Transitioning from full-time employment to freelancing or agency consulting requires a fundamental mindset shift
            in how you price your time.
          </p>
        </div>

        {/* 3 Core Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <h3 className="text-sm font-extrabold text-[#102a2d]">1. The 50% Rule</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              If you earned $50/hr at a W-2 job, you cannot charge clients $50/hr as a 1099 contractor. You must charge at least
              <b>$75 - $100/hr</b> to cover the employer half of FICA taxes (7.65%), health insurance, retirement match, and
              unbillable time.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <h3 className="text-sm font-extrabold text-[#102a2d]">2. The 65% Billable Ceiling</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              No solo operator bills 40 hours per week every single week. On average, <b>30% to 40%</b> of your working hours are
              spent on non-billable administrative tasks (proposals, emails, accounting, marketing, invoicing).
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <h3 className="text-sm font-extrabold text-[#102a2d]">3. Margin vs. Markup Clarity</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              Markup is what you add to your cost; margin is what percentage of the selling price you get to keep. Always quote
              with gross margins of <b>50% to 70%</b> in professional services.
            </p>
          </div>
        </div>

        {/* Industry Benchmarks */}
        <div className="rounded-2xl border border-[#cbd6cf] bg-white p-6 space-y-3">
          <h3 className="text-base sm:text-lg font-black text-[#102a2d]">
            Average Freelance Billable Rates & Net Margins by Discipline
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 bg-[#fbfcf8] rounded-xl border border-[#e5ebe6]">
              <p className="font-extrabold text-[#102a2d]">Software Engineers & Devs</p>
              <p className="text-[#11716d] font-black text-sm mt-1">$90 - $185 / hr</p>
              <p className="text-[#6a8e87] text-[11px] mt-0.5">Avg Net Margin: 65% - 75%</p>
            </div>
            <div className="p-3 bg-[#fbfcf8] rounded-xl border border-[#e5ebe6]">
              <p className="font-extrabold text-[#102a2d]">UI/UX & Product Designers</p>
              <p className="text-[#11716d] font-black text-sm mt-1">$75 - $150 / hr</p>
              <p className="text-[#6a8e87] text-[11px] mt-0.5">Avg Net Margin: 60% - 70%</p>
            </div>
            <div className="p-3 bg-[#fbfcf8] rounded-xl border border-[#e5ebe6]">
              <p className="font-extrabold text-[#102a2d]">Copywriters & Marketers</p>
              <p className="text-[#11716d] font-black text-sm mt-1">$65 - $130 / hr</p>
              <p className="text-[#6a8e87] text-[11px] mt-0.5">Avg Net Margin: 68% - 78%</p>
            </div>
            <div className="p-3 bg-[#fbfcf8] rounded-xl border border-[#e5ebe6]">
              <p className="font-extrabold text-[#102a2d]">Management Consultants</p>
              <p className="text-[#11716d] font-black text-sm mt-1">$125 - $300 / hr</p>
              <p className="text-[#6a8e87] text-[11px] mt-0.5">Avg Net Margin: 70% - 82%</p>
            </div>
          </div>
        </div>

        {/* Cross-Link Tools Navigation */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <Link
            to="/mileage-calculator"
            className="rounded-2xl border border-[#cbd6cf] bg-white p-4 transition hover:border-[#11716d] hover:shadow-md block"
          >
            <span className="text-xs sm:text-sm font-extrabold text-[#11716d]">Mileage Deduction ($0.725/mi) →</span>
            <p className="mt-1 text-[11px] text-[#526967]">Log business driving and cut your Schedule C taxable profit.</p>
          </Link>
          <Link
            to="/invoice-generator"
            className="rounded-2xl border border-[#cbd6cf] bg-white p-4 transition hover:border-[#11716d] hover:shadow-md block"
          >
            <span className="text-xs sm:text-sm font-extrabold text-[#11716d]">Free PDF Invoice Generator →</span>
            <p className="mt-1 text-[11px] text-[#526967]">Create professional client invoices with auto line-item math.</p>
          </Link>
          <Link
            to="/#calculator"
            className="rounded-2xl border border-[#cbd6cf] bg-white p-4 transition hover:border-[#11716d] hover:shadow-md block"
          >
            <span className="text-xs sm:text-sm font-extrabold text-[#11716d]">Quarterly Tax Calculator →</span>
            <p className="mt-1 text-[11px] text-[#526967]">Calculate your exact 1040-ES vouchers and avoid IRS penalties.</p>
          </Link>
        </div>
      </section>

      <RelatedTools tools={TOOL_SETS.profitMargin} />
    </main>
  );
}
