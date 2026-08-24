import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import RelatedTools, { TOOL_SETS } from "../components/RelatedTools";
import { US_STATES, calculateStateTax } from "../lib/stateTax";
import { FilingStatus, TAX, calculate, formatMoney, incomeTax } from "../lib/tax";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";

export default function W2Vs1099Comparison() {
  usePageMeta({
    title: "1099 vs. W-2 Salary & Take-Home Pay Comparison Calculator | Setwise",
    description: "Compare real take-home pay between a 1099 freelance rate and a W-2 salary offer, and find the breakeven contractor rate that matches a given salary.",
    path: "/1099-vs-w2-calculator",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Setwise 1099 vs W-2 Comparison Calculator",
      url: "https://tnabin.com.np/1099-vs-w2-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Compare real after-tax take-home pay between 1099 freelance contracts and W-2 employment, including benefits and breakeven rates.",
    }),
    []
  );

  useStructuredData(schema);

  // 1099 input mode
  const [contractMode, setContractMode] = useState<"annual" | "hourly">("annual");
  const [contract1099Annual, setContract1099Annual] = useState("120000");
  const [contract1099Hourly, setContract1099Hourly] = useState("65");
  const [contractHoursPerYear, setContractHoursPerYear] = useState("1920"); // 40 hrs * 48 weeks

  // W-2 input
  const [w2Salary, setW2Salary] = useState("95000");

  // Shared settings
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");

  // Optional W-2 benefits
  const [showBenefits, setShowBenefits] = useState(false);
  const [healthInsuranceAnnual, setHealthInsuranceAnnual] = useState("6000");
  const [match401kPct, setMatch401kPct] = useState("4");
  const [otherPerksAnnual, setOtherPerksAnnual] = useState("2000");

  // 1099 business expenses
  const [contractExpenses, setContractExpenses] = useState("5000");

  // Compute 1099 Gross
  const gross1099 =
    contractMode === "annual"
      ? Number(contract1099Annual) || 0
      : (Number(contract1099Hourly) || 0) * (Number(contractHoursPerYear) || 1);

  const cleanExpenses1099 = Number(contractExpenses) || 0;
  const net1099Profit = Math.max(0, gross1099 - cleanExpenses1099);

  // Compute 1099 side via shared tax calculation
  const tax1099 = useMemo(() => {
    return calculate(net1099Profit, 0, status, stateCode);
  }, [net1099Profit, status, stateCode]);

  const netTakeHome1099 = Math.max(0, gross1099 - cleanExpenses1099 - tax1099.total);
  const effectiveRate1099 =
    gross1099 > 0 ? ((tax1099.total + cleanExpenses1099) / gross1099) * 100 : 0;

  // Compute W-2 side
  const grossW2 = Number(w2Salary) || 0;
  const w2Results = useMemo(() => {
    // Employee FICA: 6.2% SS up to wage base + 1.45% Medicare
    const ssTaxable = Math.min(grossW2, TAX.socialSecurityWageBase);
    const ssTax = ssTaxable * 0.062;
    const medicareTax = grossW2 * 0.0145;
    const ficaTax = ssTax + medicareTax;

    // Federal income tax with standard deduction (no 1/2 SE tax deduction for W-2)
    const taxableIncome = Math.max(0, grossW2 - TAX.standardDeduction[status]);
    const federalTax = incomeTax(taxableIncome, status);

    // State tax
    const { stateTax } = calculateStateTax(taxableIncome, stateCode, status);

    const totalTax = ficaTax + federalTax + stateTax;
    const netCash = Math.max(0, grossW2 - totalTax);

    return {
      ficaTax,
      ssTax,
      medicareTax,
      federalTax,
      stateTax,
      totalTax,
      netCash,
      taxableIncome,
    };
  }, [grossW2, status, stateCode]);

  const effectiveRateW2 = grossW2 > 0 ? (w2Results.totalTax / grossW2) * 100 : 0;

  // Benefits calculations
  const parsedHealth = showBenefits ? Number(healthInsuranceAnnual) || 0 : 0;
  const parsed401kMatch = showBenefits
    ? (grossW2 * (Number(match401kPct) || 0)) / 100
    : 0;
  const parsedOtherPerks = showBenefits ? Number(otherPerksAnnual) || 0 : 0;
  const totalBenefitsValue = parsedHealth + parsed401kMatch + parsedOtherPerks;
  const totalW2Compensation = w2Results.netCash + totalBenefitsValue;

  // Numerical Breakeven Solver:
  // Find the 1099 gross billing that produces equal net take-home cash to W-2 netCash
  const breakeven1099Cash = useMemo(() => {
    const targetNetCash = w2Results.netCash;
    if (targetNetCash <= 0) return 0;

    let low = targetNetCash;
    let high = targetNetCash * 3;
    let bestGross = high;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const profit = Math.max(0, mid - cleanExpenses1099);
      const tax = calculate(profit, 0, status, stateCode);
      const net = mid - cleanExpenses1099 - tax.total;

      if (Math.abs(net - targetNetCash) < 1) {
        bestGross = mid;
        break;
      }
      if (net < targetNetCash) {
        low = mid;
      } else {
        high = mid;
        bestGross = mid;
      }
    }
    return bestGross;
  }, [w2Results.netCash, cleanExpenses1099, status, stateCode]);

  // Breakeven matching total W-2 comp (cash + benefits)
  const breakeven1099TotalComp = useMemo(() => {
    const targetNet = w2Results.netCash + totalBenefitsValue;
    if (targetNet <= 0) return 0;

    let low = targetNet;
    let high = targetNet * 3.5;
    let bestGross = high;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const profit = Math.max(0, mid - cleanExpenses1099);
      const tax = calculate(profit, 0, status, stateCode);
      const net = mid - cleanExpenses1099 - tax.total;

      if (Math.abs(net - targetNet) < 1) {
        bestGross = mid;
        break;
      }
      if (net < targetNet) {
        low = mid;
      } else {
        high = mid;
        bestGross = mid;
      }
    }
    return bestGross;
  }, [w2Results.netCash, totalBenefitsValue, cleanExpenses1099, status, stateCode]);

  const assumedHours = Number(contractHoursPerYear) || 1920;
  const breakevenHourlyCash = breakeven1099Cash / assumedHours;
  const breakevenHourlyTotal = breakeven1099TotalComp / assumedHours;

  const cashDifference = netTakeHome1099 - w2Results.netCash;
  const is1099Ahead = cashDifference >= 0;

  return (
    <main className="mx-auto w-full max-w-[1240px] px-3.5 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/#calculator" },
          { label: "1099 vs. W-2 Comparison", href: "/1099-vs-w2-calculator" },
        ]}
      />

      {/* ─── Hero Header ─── */}
      <div className="mb-6 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd6cf] bg-white px-3 py-1 text-[11px] font-extrabold tracking-wider text-[#11716d] mb-2 shadow-xs">
          <span>⚖️</span> CONTRACTOR VS. EMPLOYEE COMPARISON
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d]">
          1099 vs. W-2 Job Offer Calculator
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base leading-5 sm:leading-7 text-[#4b6563]">
          Compare real after-tax take-home pay between an independent contractor rate
          and a W-2 salary. See the exact 1099 rate needed to break even.
        </p>
      </div>

      {/* ─── Headline Breakeven Banner ─── */}
      <div className="mb-8 rounded-[24px] border border-[#11716d]/40 bg-gradient-to-r from-[#102a2d] via-[#13373b] to-[#102a2d] p-6 sm:p-8 text-white shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#11716d]/50 border border-[#6dd4c8]/30 px-3.5 py-1 text-xs font-black tracking-wide text-[#8cefe5]">
            🎯 BREAKEVEN RATE TO MATCH {formatMoney(grossW2)} W-2 SALARY
          </span>

          <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            {formatMoney(breakeven1099Cash)}
            <span className="text-base sm:text-2xl font-bold text-[#8cefe5] ml-2">
              / year (${breakevenHourlyCash.toFixed(2)}/hr)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#b8ded6] max-w-xl mx-auto leading-relaxed">
            Because 1099 contractors pay both halves of FICA (15.3% self-employment tax),
            you need a <strong className="text-white">
              {grossW2 > 0 ? (((breakeven1099Cash - grossW2) / grossW2) * 100).toFixed(1) : "0"}%
            </strong> higher gross rate just to match the W-2 cash take-home.
          </p>

          {showBenefits && totalBenefitsValue > 0 && (
            <div className="mt-4 pt-3 border-t border-[#264b4f] text-xs text-[#8cefe5]">
              To also replace <strong className="text-white">{formatMoney(totalBenefitsValue)}/yr</strong> in W-2 benefits (healthcare & 401k), charge at least{" "}
              <strong className="text-white underline">{formatMoney(breakeven1099TotalComp)}/yr</strong> (${breakevenHourlyTotal.toFixed(2)}/hr).
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        {/* ─── LEFT COLUMN: 1099 Contract Side ─── */}
        <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e5ebe6] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e2efe8] text-sm font-black text-[#11716d]">
                💼
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#102a2d]">
                  1099 Independent Contractor
                </h2>
                <p className="text-[11px] text-[#6a8e87]">
                  Sole proprietor / 1099-NEC / Freelance
                </p>
              </div>
            </div>

            {/* Hourly vs Annual Toggle */}
            <div className="flex rounded-xl border border-[#cbd6cf] bg-[#eef2ea] p-1 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setContractMode("annual")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  contractMode === "annual"
                    ? "bg-[#11716d] text-white shadow-sm"
                    : "text-[#526967]"
                }`}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => setContractMode("hourly")}
                className={`rounded-lg px-2.5 py-1 transition ${
                  contractMode === "hourly"
                    ? "bg-[#11716d] text-white shadow-sm"
                    : "text-[#526967]"
                }`}
              >
                Hourly
              </button>
            </div>
          </div>

          {/* 1099 Inputs */}
          <div className="space-y-3">
            {contractMode === "annual" ? (
              <div>
                <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                  Annual 1099 Gross Contract Value
                </label>
                <div className="input-wrap">
                  <b>$</b>
                  <input
                    type="text"
                    value={contract1099Annual}
                    onChange={(e) =>
                      setContract1099Annual(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    aria-label="Annual 1099 Gross"
                  />
                  <span className="input-tail">/ year</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                    Hourly Bill Rate
                  </label>
                  <div className="input-wrap">
                    <b>$</b>
                    <input
                      type="text"
                      value={contract1099Hourly}
                      onChange={(e) =>
                        setContract1099Hourly(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      inputMode="decimal"
                      aria-label="Hourly 1099 Rate"
                    />
                    <span className="input-tail">/ hr</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                    Billable Hours / Year
                  </label>
                  <div className="input-wrap">
                    <span className="text-xs text-[#6a8e87] pl-2 font-bold">⏱</span>
                    <input
                      type="text"
                      value={contractHoursPerYear}
                      onChange={(e) =>
                        setContractHoursPerYear(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      inputMode="numeric"
                      aria-label="Billable Hours Per Year"
                    />
                    <span className="input-tail">hrs</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-[#2a4d49]">
                  Annual Business Expenses & Deductions
                </label>
                <span className="text-[10px] text-[#6a8e87]">
                  Software, equipment, mileage
                </span>
              </div>
              <div className="input-wrap">
                <b>$</b>
                <input
                  type="text"
                  value={contractExpenses}
                  onChange={(e) =>
                    setContractExpenses(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  inputMode="numeric"
                  aria-label="Annual 1099 Business Expenses"
                />
                <span className="input-tail">/ year</span>
              </div>
            </div>
          </div>

          {/* 1099 Breakdown Card */}
          <div className="rounded-2xl border border-[#d6e5dc] bg-[#f2f8f4] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#102a2d] uppercase tracking-wider">
                1099 Take-Home Cash
              </span>
              <span className="text-xs font-extrabold text-[#11716d]">
                {formatMoney(netTakeHome1099 / 12)} / mo
              </span>
            </div>

            <div className="text-3xl font-black text-[#102a2d]">
              {formatMoney(netTakeHome1099)}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#d8e8de] text-xs text-[#3a5854]">
              <div className="flex justify-between">
                <span>Gross Billings</span>
                <span className="font-extrabold text-[#102a2d]">
                  {formatMoney(gross1099)}
                </span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- Business Expenses</span>
                <span>-{formatMoney(cleanExpenses1099)}</span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- Self-Employment Tax (15.3%)</span>
                <span>-{formatMoney(tax1099.seTax)}</span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- Federal Income Tax</span>
                <span>-{formatMoney(tax1099.federal)}</span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- {tax1099.stateName} Income Tax</span>
                <span>-{formatMoney(tax1099.stateTax)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#d8e8de] font-extrabold text-[#102a2d]">
                <span>Total Tax Bill</span>
                <span>{formatMoney(tax1099.total)} ({effectiveRate1099.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: W-2 Employee Side ─── */}
        <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e5ebe6] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e2eff7] text-sm font-black text-[#0284c7]">
                🏢
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#102a2d]">
                  W-2 Full-Time Employee
                </h2>
                <p className="text-[11px] text-[#6a8e87]">
                  Traditional salaried employment
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBenefits((prev) => !prev)}
              className="text-xs font-bold text-[#11716d] hover:underline"
            >
              {showBenefits ? "Hide Benefits" : "+ Add Benefits"}
            </button>
          </div>

          {/* W-2 Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-extrabold text-[#2a4d49] block mb-1">
                W-2 Annual Base Salary
              </label>
              <div className="input-wrap">
                <b>$</b>
                <input
                  type="text"
                  value={w2Salary}
                  onChange={(e) =>
                    setW2Salary(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  inputMode="numeric"
                  aria-label="W-2 Annual Base Salary"
                />
                <span className="input-tail">/ year</span>
              </div>
            </div>

            {/* Optional Benefits Fields */}
            {showBenefits && (
              <div className="rounded-xl border border-[#d8e6ef] bg-[#f3f8fc] p-3 space-y-2.5 text-xs">
                <p className="font-extrabold text-[#1f4e69] text-[11px] uppercase tracking-wider">
                  Employer-Paid Benefits (Annual Value)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#35617a] block mb-0.5">
                      Health Insurance
                    </label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="text"
                        value={healthInsuranceAnnual}
                        onChange={(e) =>
                          setHealthInsuranceAnnual(
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#35617a] block mb-0.5">
                      401(k) Match %
                    </label>
                    <div className="input-wrap text-xs">
                      <input
                        type="text"
                        value={match401kPct}
                        onChange={(e) =>
                          setMatch401kPct(e.target.value.replace(/[^0-9.]/g, ""))
                        }
                        inputMode="decimal"
                      />
                      <span className="input-tail">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#35617a] block mb-0.5">
                      PTO & Other Perks
                    </label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="text"
                        value={otherPerksAnnual}
                        onChange={(e) =>
                          setOtherPerksAnnual(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* W-2 Breakdown Card */}
          <div className="rounded-2xl border border-[#cfe2ee] bg-[#f0f6fa] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#102a2d] uppercase tracking-wider">
                W-2 Take-Home Cash
              </span>
              <span className="text-xs font-extrabold text-[#0284c7]">
                {formatMoney(w2Results.netCash / 12)} / mo
              </span>
            </div>

            <div className="text-3xl font-black text-[#102a2d]">
              {formatMoney(w2Results.netCash)}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#d5e5ef] text-xs text-[#355a6d]">
              <div className="flex justify-between">
                <span>Gross Salary</span>
                <span className="font-extrabold text-[#102a2d]">
                  {formatMoney(grossW2)}
                </span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- Employee FICA (7.65%)</span>
                <span>-{formatMoney(w2Results.ficaTax)}</span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- Federal Income Tax</span>
                <span>-{formatMoney(w2Results.federalTax)}</span>
              </div>
              <div className="flex justify-between text-[#b94a48]">
                <span>- State Income Tax</span>
                <span>-{formatMoney(w2Results.stateTax)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#d5e5ef] font-extrabold text-[#102a2d]">
                <span>Total Tax Bill</span>
                <span>{formatMoney(w2Results.totalTax)} ({effectiveRateW2.toFixed(1)}%)</span>
              </div>

              {showBenefits && totalBenefitsValue > 0 && (
                <div className="flex justify-between pt-1 text-[#0284c7] font-bold border-t border-[#d5e5ef]">
                  <span>+ Non-Cash Benefits Value</span>
                  <span>+{formatMoney(totalBenefitsValue)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Shared Profile Settings Bar ─── */}
      <div className="mt-6 rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#102a2d]">Tax Settings:</span>
          <span className="text-xs text-[#6a8e87]">
            Applies to both 1099 and W-2 for fair comparison
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-[#2a4d49]">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FilingStatus)}
              className="rounded-lg border border-[#cbd6cf] bg-white px-2.5 py-1 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none"
            >
              <option value="single">Single</option>
              <option value="marriedJoint">Married Joint</option>
              <option value="head">Head of Household</option>
              <option value="marriedSeparate">Married Separate</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-[#2a4d49]">State:</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="rounded-lg border border-[#cbd6cf] bg-white px-2.5 py-1 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none"
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Side-by-Side Summary & Verdict Card ─── */}
      <div className="mt-8 rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#102a2d] mb-4">
          Direct Side-by-Side Cash Verdict
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#d6e5dc] bg-white p-4">
            <p className="text-xs font-bold text-[#6a8e87] uppercase">
              1099 Net Take-Home
            </p>
            <p className="text-2xl font-black text-[#102a2d] mt-1">
              {formatMoney(netTakeHome1099)}
            </p>
            <p className="text-xs text-[#6a8e87] mt-0.5">
              ${(netTakeHome1099 / assumedHours).toFixed(2)}/hr net
            </p>
          </div>

          <div className="rounded-2xl border border-[#cfe2ee] bg-white p-4">
            <p className="text-xs font-bold text-[#6a8e87] uppercase">
              W-2 Net Take-Home
            </p>
            <p className="text-2xl font-black text-[#102a2d] mt-1">
              {formatMoney(w2Results.netCash)}
            </p>
            <p className="text-xs text-[#6a8e87] mt-0.5">
              ${(w2Results.netCash / assumedHours).toFixed(2)}/hr net
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              is1099Ahead
                ? "border-[#a3d9c9] bg-[#eef8f4]"
                : "border-[#f5c6cb] bg-[#fdf2f2]"
            }`}
          >
            <p className="text-xs font-extrabold uppercase tracking-wider">
              {is1099Ahead ? "🎉 1099 Wins Cash" : "⚠️ W-2 Wins Cash"}
            </p>
            <p
              className={`text-2xl font-black mt-1 ${
                is1099Ahead ? "text-[#11716d]" : "text-[#b94a48]"
              }`}
            >
              {is1099Ahead ? "+" : "-"}
              {formatMoney(Math.abs(cashDifference))}
            </p>
            <p className="text-xs text-[#526967] mt-0.5">
              {is1099Ahead
                ? "More take-home cash in your pocket with 1099"
                : "1099 rate is too low to beat this W-2 salary"}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Educational Guide Section ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#d8e2dc] pt-10">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#102a2d] mb-6">
          Key Factors When Choosing 1099 vs. W-2
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#102a2d] flex items-center gap-2">
              <span>🧾</span> The Self-Employment Tax Penalty
            </h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              W-2 employees have half their Social Security and Medicare taxes (7.65%) paid by their employer.
              1099 contractors pay the entire 15.3% self-employment tax. This alone requires roughly an 8–10% rate bump.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#102a2d] flex items-center gap-2">
              <span>🏥</span> Health Insurance & Unpaid Time Off
            </h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              1099 contractors receive no paid holidays, sick leave, or subsidized health coverage.
              Factor in 3–4 weeks of unpaid downtime and $400–$800/month for an ACA health insurance plan.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#102a2d] flex items-center gap-2">
              <span>💻</span> Contractor Tax Deductions
            </h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              Unlike W-2 workers, 1099 contractors can write off eligible business expenses on Schedule C:
              mileage ($0.725/mi), home office, laptop, software subscriptions, and professional gear.
            </p>
          </div>
        </div>

        {/* Cross Link */}
        <div className="mt-8 rounded-2xl border border-[#d6e5dc] bg-[#eef6f2] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-[#102a2d]">
              Deciding to go with the 1099 contract?
            </h4>
            <p className="text-xs text-[#4b6563] mt-0.5">
              Calculate your exact 2026 quarterly 1040-ES payment schedule so you avoid IRS underpayment penalties.
            </p>
          </div>
          <Link
            to="/#calculator"
            className="shrink-0 rounded-full bg-[#11716d] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0e5f5c] transition shadow-xs"
          >
            Calculate Quarterly Estimated Tax →
          </Link>
        </div>
      </section>

      <RelatedTools tools={TOOL_SETS.w2vs1099} />
    </main>
  );
}
