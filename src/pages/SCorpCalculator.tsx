import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import RelatedTools, { TOOL_SETS } from "../components/RelatedTools";
import { US_STATES, calculateStateTax } from "../lib/stateTax";
import { FilingStatus, TAX, calculate, formatMoney, incomeTax } from "../lib/tax";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";

export default function SCorpCalculator() {
  usePageMeta({
    title: "2026 S-Corp Tax Savings & Reasonable Salary Calculator | Setwise",
    description: "Estimate whether electing S-Corp tax treatment could lower your self-employment tax bill, based on your net profit and a reasonable-salary figure you provide.",
    path: "/s-corp-calculator",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Setwise S-Corp Tax Savings Calculator",
      url: "https://tnabin.com.np/s-corp-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Estimate Form 2553 S-Corp tax savings, compare self-employment tax reduction against overhead costs, and find reasonable salary splits.",
    }),
    []
  );

  useStructuredData(schema);

  const [netProfitInput, setNetProfitInput] = useState("140000");
  const [salaryInput, setSalaryInput] = useState("70000");
  const [adminCostsInput, setAdminCostsInput] = useState("2000"); // Payroll + Form 1120S CPA fee
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");

  const netProfit = Number(netProfitInput) || 0;
  const rawSalary = Number(salaryInput) || 0;
  // Salary cannot exceed net profit in calculation
  const salary = Math.min(netProfit, Math.max(0, rawSalary));
  const distribution = Math.max(0, netProfit - salary);
  const adminCosts = Number(adminCostsInput) || 0;

  // 1. Sole Proprietorship / LLC Baseline
  const soleProp = useMemo(() => {
    const tax = calculate(netProfit, 0, status, stateCode);
    const takeHome = Math.max(0, netProfit - tax.total);
    return {
      ...tax,
      takeHome,
    };
  }, [netProfit, status, stateCode]);

  // 2. S-Corporation Calculation
  const sCorp = useMemo(() => {
    if (netProfit <= 0) {
      return {
        ficaTax: 0,
        salary,
        distribution: 0,
        fedIncomeTax: 0,
        stateTax: 0,
        stateFranchiseFee: 0,
        adminCosts: 0,
        totalTaxAndAdmin: 0,
        netTakeHome: 0,
        ficaSavings: 0,
      };
    }

    // FICA on Reasonable Salary (both employer 7.65% + employee 7.65% = 15.3%)
    // Employer half of FICA is a deductible business expense for the S-Corp
    const ssTaxable = Math.min(salary, TAX.socialSecurityWageBase);
    const ssTax = ssTaxable * 0.124; // 6.2% emp + 6.2% empr
    const medicareTax = salary * 0.029; // 1.45% emp + 1.45% empr
    const totalFica = ssTax + medicareTax;

    // S-Corp employer payroll tax deduction: 7.65%
    const employerFica = ssTaxable * 0.062 + salary * 0.0145;

    // Taxable pass-through profit after employer FICA and admin costs
    const sCorpProfitAfterExpenses = Math.max(0, distribution - employerFica - adminCosts);

    // Personal AGI: W-2 salary + K-1 profit distribution
    // (Note: S-Corp owners also take standard deduction)
    const personalAgi = salary + sCorpProfitAfterExpenses;
    const personalTaxable = Math.max(0, personalAgi - TAX.standardDeduction[status]);
    const fedIncomeTax = incomeTax(personalTaxable, status);

    // State tax
    const { stateTax } = calculateStateTax(personalTaxable, stateCode, status);

    // California has an $800 minimum annual franchise tax or 1.5% net income tax on S-Corps
    let stateFranchiseFee = 0;
    if (stateCode === "CA") {
      stateFranchiseFee = Math.max(800, sCorpProfitAfterExpenses * 0.015);
    }

    const totalTaxAndAdmin = totalFica + fedIncomeTax + stateTax + adminCosts + stateFranchiseFee;
    const netTakeHome = Math.max(0, netProfit - totalTaxAndAdmin);
    const ficaSavings = Math.max(0, soleProp.seTax - totalFica);

    return {
      ficaTax: totalFica,
      salary,
      distribution,
      fedIncomeTax,
      stateTax,
      stateFranchiseFee,
      adminCosts,
      totalTaxAndAdmin,
      netTakeHome,
      ficaSavings,
    };
  }, [netProfit, salary, distribution, adminCosts, status, stateCode, soleProp.seTax]);

  // Net Savings or Loss
  const netSavings = sCorp.netTakeHome - soleProp.takeHome;
  const isWorthwhile = netSavings > 1500; // Recommend only if real net savings > $1.5k/yr
  const isLoss = netSavings <= 0;

  // Preset salary ratios
  const handleSalaryRatio = (pct: number) => {
    setSalaryInput(Math.round((netProfit * pct) / 100).toString());
  };

  const profitPresets = [
    { label: "$80k", value: "80000", sal: "45000" },
    { label: "$120k", value: "120000", sal: "60000" },
    { label: "$160k", value: "160000", sal: "75000" },
    { label: "$220k", value: "220000", sal: "95000" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1240px] px-3.5 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/#calculator" },
          { label: "S-Corp Calculator", href: "/s-corp-calculator" },
        ]}
      />

      {/* ─── Hero Header ─── */}
      <div className="mb-6 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd6cf] bg-white px-3 py-1 text-[11px] font-extrabold tracking-wider text-[#11716d] mb-2 shadow-xs">
          <span>🏢</span> FORM 2553 TAX ELECTION ESTIMATOR
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d]">
          S-Corp Election Savings Estimator
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base leading-5 sm:leading-7 text-[#4b6563]">
          Find out if converting your freelance business or LLC to an S-Corporation
          will save you money after accounting for reasonable salary and CPA costs.
        </p>
      </div>

      {/* ─── Prominent Caution Disclaimer ─── */}
      <div className="mb-8 rounded-2xl border border-[#e8c374] bg-[#fffaf0] p-4 sm:p-5 text-xs text-[#6e4e0b] shadow-xs">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div className="space-y-1">
            <p className="font-extrabold text-[#102a2d]">
              Critical Disclaimer on IRS "Reasonable Compensation"
            </p>
            <p className="leading-relaxed">
              S-Corp tax savings rely on paying yourself a legitimate market-rate "reasonable salary" via payroll. 
              The IRS actively audits S-Corps that set salaries artificially low to evade Medicare and Social Security taxes. 
              Always consult a licensed CPA before filing <strong>IRS Form 2553</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        {/* ─── LEFT: Form Inputs ─── */}
        <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-[#e5ebe6] pb-3">
            <h2 className="text-base sm:text-xl font-extrabold tracking-[-0.03em] text-[#102a2d]">
              1. Revenue & Salary Benchmarks
            </h2>
            <p className="text-xs text-[#6a8e87]">
              Compare Sole Proprietor vs. S-Corp structure
            </p>
          </div>

          {/* Net Profit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-extrabold text-[#2a4d49]">
                Annual Net Business Profit
              </label>
              <span className="text-[10px] text-[#6a8e87]">
                Revenue minus general expenses
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

            {/* Presets */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-bold text-[#6a8e87] shrink-0 mr-1">
                Presets:
              </span>
              {profitPresets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    setNetProfitInput(p.value);
                    setSalaryInput(p.sal);
                  }}
                  className="shrink-0 rounded-full border border-[#cbd6cf] bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#3a5854] hover:border-[#11716d] active:scale-95 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reasonable Salary Input */}
          <div className="pt-2 border-t border-[#e5ebe6]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-extrabold text-[#2a4d49]">
                Estimated "Reasonable Salary" (W-2)
              </label>
              <span className="text-[10px] text-[#11716d] font-bold">
                {netProfit > 0 ? ((salary / netProfit) * 100).toFixed(0) : "0"}% of profit
              </span>
            </div>
            <div className="input-wrap">
              <b>$</b>
              <input
                type="text"
                value={salaryInput}
                onChange={(e) =>
                  setSalaryInput(e.target.value.replace(/[^0-9]/g, ""))
                }
                inputMode="numeric"
                aria-label="Estimated Reasonable Salary"
              />
              <span className="input-tail">/ year</span>
            </div>

            {/* Salary guideline chips */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-[10px] font-bold text-[#6a8e87]">
                Quick Ratio:
              </span>
              {[40, 50, 60, 70].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => handleSalaryRatio(ratio)}
                  className="rounded-lg border border-[#cbd6cf] bg-white px-2 py-0.5 text-[11px] font-bold text-[#2a4d49] hover:bg-[#eef5f1]"
                >
                  {ratio}%
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#6a8e87] mt-1.5 leading-tight">
              Remaining{" "}
              <strong className="text-[#102a2d]">
                {formatMoney(distribution)}
              </strong>{" "}
              is distributed as profit free of 15.3% self-employment tax.
            </p>
          </div>

          {/* S-Corp Admin & Accounting Costs */}
          <div className="pt-2 border-t border-[#e5ebe6]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-extrabold text-[#2a4d49]">
                Estimated S-Corp Admin & CPA Costs
              </label>
              <span className="text-[10px] text-[#6a8e87]">
                Gusto/Payroll + 1120-S Tax Return
              </span>
            </div>
            <div className="input-wrap">
              <b>$</b>
              <input
                type="text"
                value={adminCostsInput}
                onChange={(e) =>
                  setAdminCostsInput(e.target.value.replace(/[^0-9]/g, ""))
                }
                inputMode="numeric"
                aria-label="S-Corp Annual Admin and CPA Costs"
              />
              <span className="input-tail">/ year</span>
            </div>
          </div>

          {/* Tax Profile */}
          <div className="pt-2 border-t border-[#e5ebe6] grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                Filing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FilingStatus)}
                className="w-full rounded-xl border border-[#cbd6cf] bg-white px-2.5 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none"
              >
                <option value="single">Single</option>
                <option value="marriedJoint">Married Joint</option>
                <option value="head">Head of Household</option>
                <option value="marriedSeparate">Married Separate</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                State
              </label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full rounded-xl border border-[#cbd6cf] bg-white px-2.5 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none"
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

        {/* ─── RIGHT: Results & Side-by-Side Comparison ─── */}
        <div className="space-y-6">
          {/* Main Savings Verdict Hero */}
          <div
            className={`rounded-[22px] sm:rounded-[24px] border p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ${
              isWorthwhile
                ? "bg-gradient-to-br from-[#102a2d] to-[#144246] border-[#11716d]/50"
                : isLoss
                ? "bg-gradient-to-br from-[#3b1919] to-[#2d1414] border-[#d9534f]/50"
                : "bg-gradient-to-br from-[#2a3031] to-[#1c2425] border-[#cbd6cf]/40"
            }`}
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                isWorthwhile
                  ? "bg-[#11716d] text-[#8cefe5] border border-[#6dd4c8]/30"
                  : isLoss
                  ? "bg-[#8b2626] text-[#ffcaca]"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {isWorthwhile
                ? "✓ S-CORP ELECTION RECOMMENDED"
                : isLoss
                ? "✕ S-CORP COSTS MORE (NOT RECOMMENDED)"
                : "⚠️ MARGINAL SAVINGS (CONSIDER COMPLEXITY)"}
            </span>

            <p className="text-xs font-bold uppercase tracking-wider text-[#8db5ae] mt-4">
              Net Estimated Annual Tax Savings
            </p>

            <div
              className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight my-2 ${
                isWorthwhile ? "text-[#6dd4c8]" : isLoss ? "text-[#ff9999]" : "text-white"
              }`}
            >
              {isLoss ? "-" : "+"}
              {formatMoney(Math.abs(netSavings))}
              <span className="text-lg sm:text-2xl font-bold text-white/70 ml-2">
                / year
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#b8ded6] leading-relaxed">
              {isWorthwhile
                ? `You avoid self-employment tax on ${formatMoney(distribution)} of distributions, saving ${formatMoney(sCorp.ficaSavings)} in FICA tax minus ${formatMoney(adminCosts)} in administrative costs.`
                : isLoss
                ? `At this profit or salary level, the extra ~$${adminCosts} in CPA and payroll fees exceeds your payroll tax savings.`
                : "The tax savings are modest and may not justify the added bookkeeping and corporate compliance overhead."}
            </p>
          </div>

          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sole Prop */}
            <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 shadow-xs space-y-3">
              <p className="text-xs font-extrabold uppercase text-[#6a8e87]">
                Sole Proprietor / Single LLC
              </p>
              <div className="text-2xl font-black text-[#102a2d]">
                {formatMoney(soleProp.takeHome)}
                <span className="text-xs font-normal text-[#6a8e87] block">
                  Net take-home pay
                </span>
              </div>

              <div className="space-y-1 text-xs pt-2 border-t border-[#e5ebe6] text-[#3a5854]">
                <div className="flex justify-between">
                  <span>SE Tax (15.3% full profit):</span>
                  <span className="font-bold text-[#b94a48]">
                    {formatMoney(soleProp.seTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Income Tax:</span>
                  <span>{formatMoney(soleProp.federal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Income Tax:</span>
                  <span>{formatMoney(soleProp.stateTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin / CPA Costs:</span>
                  <span>$0 (Schedule C)</span>
                </div>
              </div>
            </div>

            {/* S-Corp */}
            <div className="rounded-2xl border-2 border-[#11716d] bg-[#fbfcf8] p-5 shadow-xs space-y-3">
              <p className="text-xs font-black uppercase text-[#11716d]">
                S-Corporation (Form 2553)
              </p>
              <div className="text-2xl font-black text-[#11716d]">
                {formatMoney(sCorp.netTakeHome)}
                <span className="text-xs font-normal text-[#6a8e87] block">
                  Net take-home pay
                </span>
              </div>

              <div className="space-y-1 text-xs pt-2 border-t border-[#e5ebe6] text-[#3a5854]">
                <div className="flex justify-between">
                  <span>Payroll FICA (Salary only):</span>
                  <span className="font-bold text-[#11716d]">
                    {formatMoney(sCorp.ficaTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Income Tax:</span>
                  <span>{formatMoney(sCorp.fedIncomeTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Tax + Franchise:</span>
                  <span>{formatMoney(sCorp.stateTax + sCorp.stateFranchiseFee)}</span>
                </div>
                <div className="flex justify-between text-[#b94a48]">
                  <span>Admin & CPA Filing:</span>
                  <span>{formatMoney(sCorp.adminCosts)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross Links */}
          <div className="rounded-2xl border border-[#d6e5dc] bg-[#eef6f2] p-5 space-y-3">
            <h4 className="text-sm font-extrabold text-[#102a2d]">
              Pair S-Corp with a Solo 401(k) for Maximum Tax Defense
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                to="/retirement-calculator"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#cbd6cf] text-[#11716d] font-extrabold hover:border-[#11716d] transition"
              >
                <span>Retirement Calculator</span>
                <span>→</span>
              </Link>
              <Link
                to="/#calculator"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#cbd6cf] text-[#11716d] font-extrabold hover:border-[#11716d] transition"
              >
                <span>Quarterly Tax Estimates</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Educational & CPA Guide Section ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#d8e2dc] pt-10">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#102a2d] mb-6">
          When Does Electing S-Corp Treatment Make Sense?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#102a2d] flex items-center gap-2">
              <span>📈</span> The $60k–$80k Profit Rule of Thumb
            </h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              If your net freelance profit is below $60,000, the ~$2,000/year cost of running payroll (Gusto) 
              and filing a separate corporate Form 1120-S tax return will consume most or all of your self-employment tax savings.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#102a2d] flex items-center gap-2">
              <span>📊</span> Determining Reasonable Salary
            </h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              The IRS requires you to pay yourself what an independent employer would pay a comparable employee for the same duties. 
              CPAs commonly benchmark this using salary databases (e.g. RCReports, BLS, Glassdoor) considering your hours, specialty, and revenue generation.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#102a2d] flex items-center gap-2">
              <span>📅</span> Form 2553 Election Deadlines
            </h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              To be treated as an S-Corp for the current tax year, you must submit IRS Form 2553 no later than 
              <strong> 2 months and 15 days</strong> after the beginning of the tax year (typically March 15 for calendar-year filers), or request late-filing relief under Rev. Proc. 2013-30.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools tools={TOOL_SETS.scorp} />
    </main>
  );
}
