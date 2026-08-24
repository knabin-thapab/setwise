import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveTable from "../components/ResponsiveTable";
import Breadcrumbs from "../components/Breadcrumbs";
import RelatedTools, { TOOL_SETS } from "../components/RelatedTools";
import { US_STATES } from "../lib/stateTax";
import { FilingStatus, calculate, formatMoney } from "../lib/tax";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";
import {
  RETIREMENT_CONSTANTS,
  calculateRetirementLimits,
} from "../lib/retirementConstants";

export default function RetirementCalculator() {
  usePageMeta({
    title: "Self-Employed Retirement Calculator (SEP-IRA vs. Solo 401k 2026) | Setwise",
    description: "Compare 2026 SEP-IRA and Solo 401(k) contribution limits for the self-employed and estimate how much a contribution could reduce this year's tax bill.",
    path: "/retirement-calculator",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Setwise Self-Employed Retirement Calculator",
      url: "https://tnabin.com.np/retirement-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Compare 2026 SEP-IRA vs Solo 401(k) contribution limits and calculate tax savings for freelancers and sole proprietors.",
    }),
    []
  );

  useStructuredData(schema);

  const [netProfitInput, setNetProfitInput] = useState("100000");
  const [isOver50, setIsOver50] = useState(false);
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");

  const netProfit = Number(netProfitInput) || 0;

  // Compute retirement limits
  const limits = useMemo(() => {
    return calculateRetirementLimits(netProfit, isOver50);
  }, [netProfit, isOver50]);

  // Tax baseline (without retirement deduction)
  const baselineTax = useMemo(() => {
    return calculate(netProfit, 0, status, stateCode);
  }, [netProfit, status, stateCode]);

  // Tax with SEP-IRA deduction
  const sepTax = useMemo(() => {
    const taxableProfit = Math.max(0, netProfit - limits.sepMax);
    return calculate(taxableProfit, 0, status, stateCode);
  }, [netProfit, limits.sepMax, status, stateCode]);

  // Tax with Solo 401(k) deduction
  const soloTax = useMemo(() => {
    const taxableProfit = Math.max(0, netProfit - limits.solo401kMax);
    return calculate(taxableProfit, 0, status, stateCode);
  }, [netProfit, limits.solo401kMax, status, stateCode]);

  // Tax Savings (Income tax reduction: Federal + State)
  // Note: SEP and traditional Solo 401k reduce income taxes, but do not reduce SE tax for sole props
  const sepTaxSavings = Math.max(0, baselineTax.total - sepTax.total);
  const soloTaxSavings = Math.max(0, baselineTax.total - soloTax.total);

  // Profit preset chips
  const profitPresets = [
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
          { label: "Retirement Calculator", href: "/retirement-calculator" },
        ]}
      />

      {/* ─── Hero Header ─── */}
      <div className="mb-6 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd6cf] bg-white px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold tracking-wider text-[#11716d] mb-2 shadow-xs">
          <span>🛡️</span> 2026 IRS RETIREMENT LIMITS
        </div>
        <h1 className="text-[22px] sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d] leading-tight">
          Self-Employed Retirement Calculator
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-[13px] sm:text-base leading-5 sm:leading-7 text-[#4b6563]">
          Compare your maximum 2026 contribution limit for a SEP-IRA vs. Solo 401(k),
          and estimate how much you can slash from this year's tax bill.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        {/* ─── LEFT: Form Inputs ─── */}
        <div className="rounded-2xl sm:rounded-[26px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-5">
          <div className="border-b border-[#e5ebe6] pb-3">
            <h2 className="text-base sm:text-xl font-extrabold tracking-[-0.03em] text-[#102a2d]">
              1. Your Self-Employment Profile
            </h2>
            <p className="text-[11px] sm:text-xs text-[#6a8e87] mt-0.5">
              Enter your net freelance profit to calculate IRS limits
            </p>
          </div>

          {/* Net Profit Input */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <label className="text-xs font-extrabold text-[#2a4d49]">
                Annual Net Business Profit
              </label>
              <span className="text-[10px] text-[#6a8e87] font-semibold hidden sm:inline">
                Schedule C / 1099 Profit
              </span>
            </div>
            <div className="input-wrap">
              <b>$</b>
              <input
                type="text"
                value={netProfitInput}
                onChange={(e) =>
                  setNetProfitInput(e.target.value.replace(/[^0-9]/g, ""))
                }
                inputMode="numeric"
                aria-label="Annual Net Business Profit"
              />
              <span className="input-tail">/ year</span>
            </div>

            {/* Quick Preset Chips */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-bold text-[#6a8e87] shrink-0 mr-1">
                Presets:
              </span>
              {profitPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setNetProfitInput(preset.value)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold transition active:scale-95 ${
                    netProfitInput === preset.value
                      ? "border-[#11716d] bg-[#11716d] text-white shadow-xs"
                      : "border-[#cbd6cf] bg-white text-[#3a5854] hover:border-[#11716d]"
                  }`}
                >
                  {preset.label}/yr
                </button>
              ))}
            </div>
          </div>

          {/* Age Selection (Catch-up) */}
          <div>
            <label className="text-xs font-extrabold text-[#2a4d49] block mb-1.5">
              Age Category ({RETIREMENT_CONSTANTS.taxYear})
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsOver50(false)}
                className={`p-3 rounded-xl border text-left transition ${
                  !isOver50
                    ? "border-[#11716d] bg-[#f0f7f4] ring-1 ring-[#11716d] shadow-xs"
                    : "border-[#cbd6cf] bg-white hover:border-[#11716d]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#102a2d]">Under 50</span>
                  {!isOver50 && <span className="text-[10px] text-[#11716d] font-black">✓</span>}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#6a8e87] mt-0.5">
                  Standard $24.5k limit
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsOver50(true)}
                className={`p-3 rounded-xl border text-left transition ${
                  isOver50
                    ? "border-[#11716d] bg-[#f0f7f4] ring-1 ring-[#11716d] shadow-xs"
                    : "border-[#cbd6cf] bg-white hover:border-[#11716d]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#102a2d]">Age 50+</span>
                  {isOver50 && <span className="text-[10px] text-[#11716d] font-black">✓</span>}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#11716d] font-extrabold mt-0.5">
                  +$8,000 Catch-Up
                </div>
              </button>
            </div>
          </div>

          {/* Tax Profile for Exact Savings */}
          <div className="pt-3 border-t border-[#e5ebe6] space-y-2.5">
            <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#6a8e87]">
              Tax Filing Details (For Savings Calculation)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                  Filing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FilingStatus)}
                  className="w-full rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[42px]"
                >
                  <option value="single">Single</option>
                  <option value="marriedJoint">Married Filing Jointly</option>
                  <option value="head">Head of Household</option>
                  <option value="marriedSeparate">Married Filing Separately</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                  State of Residence
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[42px]"
                >
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} {s.isNoTax ? "(0% State Tax)" : `(${s.code})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* IRS Circular Calculation Note */}
          <div className="rounded-xl border border-[#d6e5dc] bg-[#eef6f2] p-3 sm:p-3.5 text-xs text-[#3a5854] space-y-1.5">
            <p className="font-extrabold text-[#102a2d] flex items-center gap-1.5">
              <span>💡</span> IRS Circular Compensation Rule
            </p>
            <p className="text-[11px] leading-relaxed text-[#4b6563]">
              For unincorporated sole proprietors, self-employment tax is first calculated (
              <b>{formatMoney(limits.seTax)}</b>). The 50% SE tax deduction (
              <b>{formatMoney(limits.halfSeTax)}</b>) leaves an adjusted compensation base of{" "}
              <b>{formatMoney(limits.adjustedSEIncome)}</b> for plan contribution formulas.
            </p>
          </div>
        </div>

        {/* ─── RIGHT: Results & Side-by-Side Comparison ─── */}
        <div className="space-y-4 sm:space-y-6">
          {/* Winner Banner */}
          {limits.solo401kAdvantage > 0 ? (
            <div className="rounded-2xl sm:rounded-[26px] bg-gradient-to-br from-[#102a2d] via-[#143c3e] to-[#0d2224] p-4 sm:p-6 text-white shadow-xl border border-[#2a6262]/40 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="rounded-full bg-[#11716d] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#8cefe5] tracking-wider">
                  🏆 TOP RECOMMENDATION
                </span>
                <span className="text-[11px] font-bold text-[#8db5ae]">
                  {isOver50 ? "50+ Catch-Up Active" : "Standard Limit"}
                </span>
              </div>
              <h3 className="text-base sm:text-2xl font-black text-white leading-snug">
                Solo 401(k) lets you shelter{" "}
                <span className="text-[#6dd4c8]">
                  +{formatMoney(limits.solo401kAdvantage)} more
                </span>{" "}
                than a SEP-IRA.
              </h3>
              <p className="text-xs text-[#b8ded6] mt-1.5 leading-relaxed">
                As both employee and employer, you can contribute up to <b>$24,500</b> ({isOver50 ? "$32,500" : "$24,500"})
                elective deferral <em>plus</em> 20% employer profit sharing.
              </p>

              {/* Tax Savings Quick Metric */}
              <div className="mt-4 pt-3 border-t border-[#264b4f] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8db5ae]">Solo 401(k) Tax Slashed</p>
                  <p className="text-xl sm:text-2xl font-black text-[#6dd4c8]">~{formatMoney(soloTaxSavings)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#8db5ae]">SEP-IRA Tax Slashed</p>
                  <p className="text-base sm:text-lg font-bold text-[#c7ddda]">~{formatMoney(sepTaxSavings)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl sm:rounded-[26px] border border-[#cbd6cf] bg-gradient-to-br from-[#fbfcf8] to-[#f0f5f1] p-4 sm:p-6 text-[#102a2d] shadow-sm">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4f0] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#11716d] mb-2">
                <span>⚖️</span> Maximum IRS Limit Reached
              </div>
              <h3 className="text-base sm:text-lg font-black leading-snug">
                Both plans max out at the overall 2026 IRS ceiling of{" "}
                <span className="text-[#11716d]">
                  {formatMoney(
                    isOver50
                      ? RETIREMENT_CONSTANTS.solo401kOverallLimit50Plus
                      : RETIREMENT_CONSTANTS.solo401kOverallLimitUnder50
                  )}
                </span>
                .
              </h3>
              <p className="text-xs text-[#6a8e87] mt-1">
                At your profit level, a SEP-IRA provides identical maximum tax shelter with simpler paperwork and zero annual Form 5500-EZ requirements.
              </p>
            </div>
          )}

          {/* Visual Contribution Comparison Bar */}
          <div className="rounded-2xl sm:rounded-[24px] border border-[#cbd6cf] bg-white p-4 sm:p-5 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#102a2d]">
              2026 Maximum Contribution Comparison
            </h4>

            {/* Solo 401k Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-[#11716d] flex items-center gap-1">
                  <span>🚀</span> Solo 401(k) Max
                </span>
                <span className="text-[#102a2d] font-black">{formatMoney(limits.solo401kMax)}</span>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-[#eef2ea]">
                <div
                  style={{
                    width: `${Math.min(100, (limits.solo401kMax / (isOver50 ? 80000 : 72000)) * 100)}%`,
                  }}
                  className="h-full bg-[#11716d] transition-all duration-300 rounded-full"
                />
              </div>
            </div>

            {/* SEP-IRA Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-[#2a4d49] flex items-center gap-1">
                  <span>📄</span> SEP-IRA Max
                </span>
                <span className="text-[#102a2d] font-black">{formatMoney(limits.sepMax)}</span>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-[#eef2ea]">
                <div
                  style={{
                    width: `${Math.min(100, (limits.sepMax / (isOver50 ? 80000 : 72000)) * 100)}%`,
                  }}
                  className="h-full bg-[#29918b] transition-all duration-300 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Side-by-Side Cards (Mobile-friendly Stack / Desktop Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Solo 401(k) Card */}
            <div className="rounded-2xl border-2 border-[#11716d] bg-[#fbfcf8] p-4 sm:p-5 shadow-sm relative space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-[#11716d]">
                  Solo 401(k) Plan
                </p>
                <span className="rounded-full bg-[#11716d] px-2 py-0.5 text-[9px] font-black text-white">
                  TOP TAX SHIELD
                </span>
              </div>

              <div>
                <p className="text-[11px] text-[#6a8e87]">2026 Max Contribution</p>
                <div className="text-2xl sm:text-3xl font-black text-[#102a2d]">
                  {formatMoney(limits.solo401kMax)}
                </div>
              </div>

              <div className="rounded-xl bg-[#eef7f3] p-2.5 sm:p-3 text-xs space-y-1.5 border border-[#d2e8dc]">
                <div className="flex justify-between">
                  <span className="text-[#4b6563]">Employee Deferral:</span>
                  <span className="font-bold text-[#102a2d]">
                    {formatMoney(limits.solo401kElective)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b6563]">Employer Share (20%):</span>
                  <span className="font-bold text-[#102a2d]">
                    {formatMoney(limits.solo401kEmployer)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e5ebe6]">
                <p className="text-[10px] text-[#6a8e87] uppercase font-bold">
                  Est. 2026 Tax Slashed
                </p>
                <p className="text-xl sm:text-2xl font-black text-[#11716d]">
                  ~{formatMoney(soloTaxSavings)}
                </p>
                <p className="text-[10px] text-[#6a8e87]">
                  Federal & {stateCode} income tax saved
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5ebe6] text-[11px] text-[#4b6563] space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-[#102a2d]">
                  <span className="text-[#11716d]">✓</span> Roth Option & Loans ($50k)
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-[#6a8e87]">ℹ</span> Form 5500 if assets &gt; $250k
                </p>
              </div>
            </div>

            {/* SEP-IRA Card */}
            <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-[#3a5854]">
                  SEP-IRA Plan
                </p>
                <span className="text-[9px] font-bold text-[#6a8e87] rounded-md bg-[#eef2ea] px-2 py-0.5">
                  EASIEST SETUP
                </span>
              </div>

              <div>
                <p className="text-[11px] text-[#6a8e87]">2026 Max Contribution</p>
                <div className="text-2xl sm:text-3xl font-black text-[#102a2d]">
                  {formatMoney(limits.sepMax)}
                </div>
              </div>

              <div className="rounded-xl bg-[#f5f8f5] p-2.5 sm:p-3 text-xs space-y-1.5 border border-[#e2eae3]">
                <div className="flex justify-between">
                  <span className="text-[#4b6563]">Employer Share (20%):</span>
                  <span className="font-bold text-[#102a2d]">
                    {formatMoney(limits.sepMax)}
                  </span>
                </div>
                <div className="flex justify-between text-[#859f99]">
                  <span>Employee Deferral:</span>
                  <span>Not Available</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e5ebe6]">
                <p className="text-[10px] text-[#6a8e87] uppercase font-bold">
                  Est. 2026 Tax Slashed
                </p>
                <p className="text-xl sm:text-2xl font-black text-[#2a4d49]">
                  ~{formatMoney(sepTaxSavings)}
                </p>
                <p className="text-[10px] text-[#6a8e87]">
                  Federal & {stateCode} income tax saved
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5ebe6] text-[11px] text-[#4b6563] space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-[#102a2d]">
                  <span className="text-[#11716d]">✓</span> 10-Minute Setup, Zero Forms
                </p>
                <p className="flex items-center gap-1.5 text-[#859f99]">
                  <span>✕</span> No loans or standard Roth
                </p>
              </div>
            </div>
          </div>

          {/* Cross Links Box */}
          <div className="rounded-2xl border border-[#d6e5dc] bg-[#eef6f2] p-4 sm:p-5 space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#102a2d]">
              Ready to optimize your business structure further?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                to="/s-corp-calculator"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#cbd6cf] text-[#11716d] font-extrabold hover:border-[#11716d] transition shadow-2xs"
              >
                <span>Check S-Corp Tax Savings</span>
                <span>→</span>
              </Link>
              <Link
                to="/profit-margin-calculator"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#cbd6cf] text-[#11716d] font-extrabold hover:border-[#11716d] transition shadow-2xs"
              >
                <span>Profit Margin & Take-Home</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detailed Comparison Table & Explainer ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#d8e2dc] pt-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-[#102a2d]">
            SEP-IRA vs. Solo 401(k): 2026 Feature Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-[#4b6563] mt-1 max-w-2xl">
            Compare contribution mechanics, Roth availability, loan permissions, and IRS paperwork requirements.
          </p>
        </div>

        <ResponsiveTable>
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f0f5f1] border-b border-[#cbd6cf] text-[#102a2d] font-extrabold">
              <tr>
                <th className="p-3 sm:p-4">Feature</th>
                <th className="p-3 sm:p-4 text-[#11716d]">Solo 401(k)</th>
                <th className="p-3 sm:p-4 text-[#2a4d49]">SEP-IRA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8efe9] text-[#334e4a]">
              <tr>
                <td className="p-3 sm:p-4 font-bold text-[#102a2d]">
                  Max 2026 Contribution
                </td>
                <td className="p-3 sm:p-4 font-extrabold text-[#11716d]">
                  Up to $72,000 ($80,000 if 50+)
                </td>
                <td className="p-3 sm:p-4 font-bold">
                  Up to $72,000 (no catch-up)
                </td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-bold text-[#102a2d]">
                  Best For
                </td>
                <td className="p-3 sm:p-4">
                  Low-to-mid six figure incomes seeking max tax sheltering
                </td>
                <td className="p-3 sm:p-4">
                  Freelancers wanting 10-minute setup with zero paperwork
                </td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-bold text-[#102a2d]">
                  Roth Option
                </td>
                <td className="p-3 sm:p-4 font-bold text-[#11716d]">
                  Yes (Roth Solo 401k available)
                </td>
                <td className="p-3 sm:p-4">
                  Rare (SECURE 2.0 allows, few custodians support)
                </td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-bold text-[#102a2d]">
                  Loan Feature
                </td>
                <td className="p-3 sm:p-4 font-bold text-[#11716d]">
                  Borrow up to $50,000 or 50% of balance
                </td>
                <td className="p-3 sm:p-4 text-[#b94a48]">
                  No loans allowed by IRS
                </td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-bold text-[#102a2d]">
                  Setup Deadline
                </td>
                <td className="p-3 sm:p-4">
                  Must establish by Dec 31 of tax year
                </td>
                <td className="p-3 sm:p-4 font-bold text-[#11716d]">
                  Can open & fund up until tax filing deadline (with extension)
                </td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-bold text-[#102a2d]">
                  IRS Form 5500-EZ Filing
                </td>
                <td className="p-3 sm:p-4">
                  Required once plan assets exceed $250,000
                </td>
                <td className="p-3 sm:p-4 font-bold text-[#11716d]">
                  Never required
                </td>
              </tr>
            </tbody>
          </table>
        </ResponsiveTable>
      </section>

      <RelatedTools tools={TOOL_SETS.retirement} />
    </main>
  );
}
