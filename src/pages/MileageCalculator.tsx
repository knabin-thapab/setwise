import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResponsiveTable from "../components/ResponsiveTable";
import { US_STATES } from "../lib/stateTax";
import { FilingStatus, calculate, formatMoney } from "../lib/tax";
import {
  MILEAGE_CONSTANTS,
  IRS_YEAR_RATES,
  TaxYear,
  TripLogItem,
  COMMON_PURPOSE_OPTIONS,
  calculateMileageDeduction,
  compareMileageMethods,
  ActualExpensesInput,
} from "../lib/mileageConstants";

const STORAGE_KEY = "setwise_mileage_trips_v2";

export default function MileageCalculator() {
  useEffect(() => {
    document.title =
      "2026 IRS Mileage Deduction & Tax Savings Calculator ($0.725/mi) | Setwise";
    let __metaDesc = document.querySelector('meta[name="description"]');
    if (!__metaDesc) {
      __metaDesc = document.createElement("meta");
      __metaDesc.setAttribute("name", "description");
      document.head.appendChild(__metaDesc);
    }
    __metaDesc.setAttribute("content", "Calculate your 2026 IRS business mileage deduction at $0.725/mile. Free calculator plus an audit-proof trip log for freelancers and gig drivers.");
  }, []);

  // Main Mode: Standard Calculator vs Actual vs Audit Log
  const [activeTab, setActiveTab] = useState<"standard" | "comparison" | "log">("standard");

  // Tax Year Selection (2026 current, 2025, 2024 prior year filing)
  const [selectedYear, setSelectedYear] = useState<TaxYear>(2026);
  const currentRates = IRS_YEAR_RATES[selectedYear];

  // Standard Mileage Inputs
  const [period, setPeriod] = useState<"annual" | "quarterly" | "monthly">("annual");
  const [businessMilesInput, setBusinessMilesInput] = useState("14000");
  const [medicalMilesInput, setMedicalMilesInput] = useState("0");
  const [charityMilesInput, setCharityMilesInput] = useState("0");

  // Tax Profile for Real Dollar Savings
  const [grossIncome, setGrossIncome] = useState("85000");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");

  // Actual Expenses Inputs for Method Comparison
  const [actualExpenses, setActualExpenses] = useState<ActualExpensesInput>({
    gasAndFuel: 2800,
    insurance: 1600,
    repairsAndMaintenance: 1100,
    tiresAndOil: 450,
    leaseOrDepreciation: 3600,
    registrationAndTaxes: 350,
    carWashesAndTolls: 300,
    totalMilesDriven: 18000,
    businessMilesDriven: 14000,
  });

  // Trip Log State (persisted to localStorage)
  const [trips, setTrips] = useState<TripLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      // Default initial starter items to show how contemporaneous logging works
      return [
        {
          id: "trip_init_1",
          date: new Date().toISOString().split("T")[0],
          startLocation: "Home Office (104 Elm St)",
          destination: "Client Headquarters (450 Market St)",
          purpose: "Quarterly marketing strategy review with client",
          category: "client_meeting",
          miles: 24.6,
          odometerStart: 42150,
          odometerEnd: 42175,
          vehicleName: "Primary Vehicle",
        },
        {
          id: "trip_init_2",
          date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
          startLocation: "Client Site",
          destination: "Best Buy / Office Supply",
          purpose: "Purchased replacement monitor & client presentation supplies",
          category: "supply_run",
          miles: 11.2,
          odometerStart: 42110,
          odometerEnd: 42121,
          vehicleName: "Primary Vehicle",
        },
      ];
    } catch {
      return [];
    }
  });

  // Trip form inputs
  const [tripDate, setTripDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [tripCategory, setTripCategory] = useState<TripLogItem["category"]>("client_meeting");
  const [tripPurpose, setTripPurpose] = useState("");
  const [tripStartLoc, setTripStartLoc] = useState("");
  const [tripDestLoc, setTripDestLoc] = useState("");
  const [tripMiles, setTripMiles] = useState("");

  // Save trips to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
      // Ignore quota errors
    }
  }, [trips]);

  // Multipliers for standard deduction display
  const periodMultiplier = period === "monthly" ? 12 : period === "quarterly" ? 4 : 1;
  const rawBusinessMiles = Number(businessMilesInput) || 0;
  const rawMedicalMiles = Number(medicalMilesInput) || 0;
  const rawCharityMiles = Number(charityMilesInput) || 0;

  const annualBusinessMiles = rawBusinessMiles * periodMultiplier;
  const annualMedicalMiles = rawMedicalMiles * periodMultiplier;
  const annualCharityMiles = rawCharityMiles * periodMultiplier;

  // Deduction math
  const standardResults = useMemo(() => {
    return calculateMileageDeduction(
      annualBusinessMiles,
      annualMedicalMiles,
      annualCharityMiles,
      selectedYear
    );
  }, [annualBusinessMiles, annualMedicalMiles, annualCharityMiles, selectedYear]);

  const periodDeduction = standardResults.totalDeduction / periodMultiplier;
  const periodBusinessDeduction = standardResults.businessDeduction / periodMultiplier;

  // Tax savings math: Calculate tax with and without business deduction
  const cleanGross = Number(grossIncome) || 0;
  const taxWithoutDeduction = useMemo(() => {
    return calculate(cleanGross, 0, status, stateCode);
  }, [cleanGross, status, stateCode]);

  const taxWithDeduction = useMemo(() => {
    const netAfterDeduction = Math.max(0, cleanGross - standardResults.businessDeduction);
    return calculate(netAfterDeduction, 0, status, stateCode);
  }, [cleanGross, standardResults.businessDeduction, status, stateCode]);

  const annualTaxSavings = Math.max(0, taxWithoutDeduction.total - taxWithDeduction.total);
  const periodTaxSavings = annualTaxSavings / periodMultiplier;

  // SE Tax specific savings (Business mileage slashes 15.3% SECA directly)
  const seTaxSavings = Math.max(0, taxWithoutDeduction.seTax - taxWithDeduction.seTax);
  const incomeTaxSavings = Math.max(
    0,
    taxWithoutDeduction.federal +
      taxWithoutDeduction.stateTax -
      (taxWithDeduction.federal + taxWithDeduction.stateTax)
  );

  // Comparison Math (Standard vs Actual)
  const comparisonResults = useMemo(() => {
    return compareMileageMethods(actualExpenses, selectedYear);
  }, [actualExpenses, selectedYear]);

  // Trip Log Totals
  const loggedMilesTotal = trips.reduce((acc, t) => acc + t.miles, 0);
  const loggedDeductionTotal = loggedMilesTotal * currentRates.business;

  // Handlers
  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMiles = parseFloat(tripMiles);
    if (!parsedMiles || parsedMiles <= 0) return;

    const newTrip: TripLogItem = {
      id: "trip_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      date: tripDate,
      category: tripCategory,
      purpose: tripPurpose.trim() || "Qualified Business Trip",
      startLocation: tripStartLoc.trim() || "Office / Starting point",
      destination: tripDestLoc.trim() || "Destination site",
      miles: parsedMiles,
      vehicleName: "Work Vehicle",
    };

    setTrips((prev) => [newTrip, ...prev]);
    setTripPurpose("");
    setTripStartLoc("");
    setTripDestLoc("");
    setTripMiles("");
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearTrips = () => {
    if (window.confirm("Are you sure you want to clear your saved trip log?")) {
      setTrips([]);
    }
  };

  const handleApplyLoggedMiles = () => {
    if (loggedMilesTotal > 0) {
      setPeriod("annual");
      setBusinessMilesInput(Math.round(loggedMilesTotal).toString());
      setActiveTab("standard");
    }
  };

  const handleExportCsv = () => {
    if (trips.length === 0) return;
    const header = "Date,Category,Origin,Destination,Business Purpose,Miles Driven,2026 Deduction ($0.725/mi)\n";
    const rows = trips
      .map((t) => {
        const rate =
          t.category === "medical"
            ? currentRates.medicalMoving
            : t.category === "charity"
            ? currentRates.charity
            : currentRates.business;
        return `"${t.date}","${t.category}","${(t.startLocation || "").replace(/"/g, '""')}","${(
          t.destination || ""
        ).replace(/"/g, '""')}","${t.purpose.replace(/"/g, '""')}",${t.miles},${(t.miles * rate).toFixed(2)}`;
      })
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURI(header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `setwise_irs_mileage_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const presetMiles = [
    { label: "3k mi (Part-Time)", value: "3000" },
    { label: "14k mi (Avg Freelancer)", value: "14000" },
    { label: "25k mi (Rideshare / Gig)", value: "25000" },
    { label: "40k mi (Road Warrior)", value: "40000" },
  ];

  return (
    <main className="mx-auto max-w-[1240px] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 w-full overflow-x-hidden min-w-0">
      {/* ─── Hero Header ─── */}
      <div className="mb-6 sm:mb-8 text-center max-w-full">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#cbd6cf] bg-white px-3 py-1 text-[10px] sm:text-[11px] font-extrabold tracking-wider text-[#11716d] mb-3 shadow-xs max-w-full text-center">
          <span>🚗</span> OFFICIAL {selectedYear} IRS STANDARD RATE: ${(currentRates.business).toFixed(3)} / MILE
        </div>
        <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d] leading-tight">
          IRS Mileage Deduction & Tax Savings Calculator
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base leading-5 sm:leading-7 text-[#4b6563]">
          Calculate your official Schedule C mileage write-off, compare the standard rate vs. actual vehicle expenses,
          and track audit-compliant trip logs.
        </p>

        {/* Tax Year Switcher Pills */}
        <div className="mt-3.5 inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-1 shadow-xs max-w-full">
          {(Object.keys(IRS_YEAR_RATES) as unknown as TaxYear[]).map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold transition whitespace-nowrap ${
                selectedYear === yr
                  ? "bg-[#11716d] text-white shadow-xs"
                  : "text-[#526967] hover:text-[#102a2d]"
              }`}
            >
              Tax Year {yr} (${IRS_YEAR_RATES[yr].business}/mi)
            </button>
          ))}
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="mb-6 flex border-b border-[#d8e2dc] overflow-x-auto scrollbar-none gap-1 sm:gap-2 max-w-full pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("standard")}
          className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition shrink-0 ${
            activeTab === "standard"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>📊</span> Standard Mileage & Tax
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comparison")}
          className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition shrink-0 ${
            activeTab === "comparison"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>⚖️</span> Standard vs. Actual
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("log")}
          className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition shrink-0 ${
            activeTab === "log"
              ? "border-[#11716d] text-[#11716d]"
              : "border-transparent text-[#526967] hover:text-[#102a2d]"
          }`}
        >
          <span>📋</span> Trip Log ({trips.length})
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: STANDARD MILEAGE & TAX SAVINGS CALCULATOR
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "standard" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10 min-w-0 max-w-full">
          {/* LEFT: Inputs Card */}
          <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
            <div className="rounded-2xl sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-3.5 sm:p-7 shadow-sm space-y-4 sm:space-y-5 min-w-0 max-w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5ebe6] pb-3 sm:pb-4">
                <div className="min-w-0">
                  <h2 className="text-[15px] sm:text-xl font-extrabold tracking-[-0.03em] text-[#102a2d]">
                    1. Miles Driven
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#6a8e87]">
                    Standard rate for {selectedYear}: <b>${currentRates.business}/mi</b>
                  </p>
                </div>

                {/* Period Selector */}
                <div className="flex rounded-xl border border-[#cbd6cf] bg-[#eef2ea] p-1 text-[11px] sm:text-xs font-extrabold shrink-0">
                  {(["annual", "quarterly", "monthly"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`rounded-lg px-2 sm:px-2.5 py-1 capitalize transition ${
                        period === p
                          ? "bg-[#11716d] text-white shadow-xs"
                          : "text-[#526967] hover:text-[#102a2d]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Miles Input */}
              <div className="min-w-0 max-w-full">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <label className="text-[11px] sm:text-xs font-extrabold text-[#2a4d49]">
                    Qualified Business Miles ({period})
                  </label>
                  <span className="text-[10px] text-[#6a8e87] font-semibold hidden sm:inline">
                    ${currentRates.business}/mi write-off
                  </span>
                </div>
                <div className="input-wrap">
                  <span className="text-sm font-black text-[#6a8e87]">📍</span>
                  <input
                    type="text"
                    value={businessMilesInput}
                    onChange={(e) => setBusinessMilesInput(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    placeholder="e.g. 14000"
                    aria-label="Business Miles Driven"
                  />
                  <span className="input-tail text-[11px] sm:text-xs">miles / {period}</span>
                </div>

                {/* Quick Presets */}
                <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  <span className="text-[10px] font-bold text-[#6a8e87] shrink-0 mr-0.5">Presets:</span>
                  {presetMiles.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        if (period === "monthly") {
                          setBusinessMilesInput(Math.round(Number(preset.value) / 12).toString());
                        } else if (period === "quarterly") {
                          setBusinessMilesInput(Math.round(Number(preset.value) / 4).toString());
                        } else {
                          setBusinessMilesInput(preset.value);
                        }
                      }}
                      className="shrink-0 rounded-full border border-[#cbd6cf] bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#3a5854] hover:border-[#11716d] active:scale-95 transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

                {/* Other IRS Mileage Categories */}
                <div className="pt-3 border-t border-[#e5ebe6] space-y-2.5">
                  <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#6a8e87]">
                    Additional IRS Categories (Optional)
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-extrabold text-[#2a4d49] block mb-1 truncate">
                        Medical (${currentRates.medicalMoving}/mi)
                      </label>
                      <div className="input-wrap text-xs">
                        <b>🏥</b>
                        <input
                          type="text"
                          value={medicalMilesInput}
                          onChange={(e) => setMedicalMilesInput(e.target.value.replace(/[^0-9]/g, ""))}
                          inputMode="numeric"
                          placeholder="0"
                          aria-label="Medical Miles"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] sm:text-[11px] font-extrabold text-[#2a4d49] block mb-1 truncate">
                        Charity (${currentRates.charity}/mi)
                      </label>
                      <div className="input-wrap text-xs">
                        <b>🤝</b>
                        <input
                          type="text"
                          value={charityMilesInput}
                          onChange={(e) => setCharityMilesInput(e.target.value.replace(/[^0-9]/g, ""))}
                          inputMode="numeric"
                          placeholder="0"
                          aria-label="Charity Miles"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Savings Simulator Controls */}
                <div className="pt-3 border-t border-[#e5ebe6] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#6a8e87]">
                      Estimate Real Tax Cash Saved
                    </p>
                    <span className="text-[10px] text-[#11716d] font-bold hidden sm:inline">Self-Employment + Income Taxes</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                        Annual Net Profit
                      </label>
                      <div className="input-wrap text-xs">
                        <b>$</b>
                        <input
                          type="text"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(e.target.value.replace(/[^0-9]/g, ""))}
                          inputMode="numeric"
                          aria-label="Annual Net Profit"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <label className="text-[10px] sm:text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                          Filing Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as FilingStatus)}
                          className="w-full rounded-xl border border-[#cbd6cf] bg-white px-2 sm:px-2.5 py-2 text-[11px] sm:text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[42px]"
                        >
                          <option value="single">Single</option>
                          <option value="marriedJoint">Married Joint</option>
                          <option value="head">Head of Household</option>
                          <option value="marriedSeparate">Married Separate</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] sm:text-[11px] font-extrabold text-[#2a4d49] block mb-1">
                          State of Residence
                        </label>
                        <select
                          value={stateCode}
                          onChange={(e) => setStateCode(e.target.value)}
                          className="w-full rounded-xl border border-[#cbd6cf] bg-white px-2 sm:px-2.5 py-2 text-[11px] sm:text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[42px]"
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
                </div>
              </div>
            </div>

            {/* RIGHT: Results Hero & Breakdown */}
            <div className="space-y-4 sm:space-y-6">
              {/* Primary Hero Result Card */}
              <div className="rounded-2xl sm:rounded-[24px] border border-[#11716d]/30 bg-gradient-to-br from-[#102a2d] to-[#15383c] p-4 sm:p-7 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-[#11716d]/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#11716d]/40 border border-[#6dd4c8]/30 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-extrabold text-[#8cefe5] w-fit">
                    <span>✓</span> TAX YEAR {selectedYear} DEDUCTION
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-[#8cefe5]">
                    {annualBusinessMiles.toLocaleString()} mi × ${currentRates.business}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8db5ae]">
                  Total Tax Write-Off ({period})
                </p>
                <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white my-1 sm:my-2 break-words">
                  {formatMoney(periodDeduction)}
                </div>

                <p className="text-[11px] sm:text-sm text-[#c1ded8] leading-relaxed">
                  Directly reduces your Schedule C taxable profit by{" "}
                  <strong className="text-white">{formatMoney(standardResults.totalDeduction)}/yr</strong>.
                </p>

                {/* Tax Savings Breakdown - 2 Column on Mobile & Desktop */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-[#264b4f] grid grid-cols-2 gap-2.5 sm:gap-4">
                  <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 sm:bg-transparent">
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#8db5ae] uppercase truncate">
                      Est. Saved ({period})
                    </p>
                    <p className="text-lg sm:text-3xl font-black text-[#6dd4c8] mt-0.5">
                      ~{formatMoney(periodTaxSavings)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-[#8db5ae] mt-0.5 truncate">
                      SE + Fed + {stateCode}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 sm:bg-transparent">
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#8db5ae] uppercase truncate">
                      Annual Tax Saved
                    </p>
                    <p className="text-lg sm:text-3xl font-black text-white mt-0.5">
                      ~{formatMoney(annualTaxSavings)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-[#8db5ae] mt-0.5 truncate">
                      Real cash kept
                    </p>
                  </div>
                </div>
              </div>

              {/* Micro Breakdown Metrics - 3 Columns on Mobile & Desktop */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl sm:rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-2.5 sm:p-4 shadow-xs text-center sm:text-left">
                  <p className="text-[9px] sm:text-[11px] font-extrabold text-[#6a8e87] uppercase truncate">Per-Mile Cash</p>
                  <p className="text-sm sm:text-2xl font-black text-[#102a2d] mt-0.5 sm:mt-1">
                    ${annualBusinessMiles > 0 ? (annualTaxSavings / annualBusinessMiles).toFixed(2) : "0.00"}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#6a8e87] mt-0.5 hidden sm:block">
                    Tax cash saved per logged mile
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-2.5 sm:p-4 shadow-xs text-center sm:text-left">
                  <p className="text-[9px] sm:text-[11px] font-extrabold text-[#6a8e87] uppercase truncate">SE Tax Relief</p>
                  <p className="text-sm sm:text-2xl font-black text-[#11716d] mt-0.5 sm:mt-1 truncate">
                    -{formatMoney(seTaxSavings)}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#6a8e87] mt-0.5 hidden sm:block">
                    15.3% SECA Medicare & SS cut
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-2.5 sm:p-4 shadow-xs text-center sm:text-left">
                  <p className="text-[9px] sm:text-[11px] font-extrabold text-[#6a8e87] uppercase truncate">Quarterly Cut</p>
                  <p className="text-sm sm:text-2xl font-black text-[#11716d] mt-0.5 sm:mt-1 truncate">
                    -{formatMoney(annualTaxSavings / 4)}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#6a8e87] mt-0.5 hidden sm:block">
                    Lower 1040-ES voucher each Q
                  </p>
                </div>
              </div>

            {/* Quick Action Navigation Card */}
            <div className="rounded-2xl border border-[#d6e5dc] bg-[#eef6f2] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#102a2d]">
                  Ready to calculate your quarterly 1040-ES payment?
                </h3>
                <p className="text-xs text-[#4b6563] mt-0.5">
                  Plug your adjusted net profit into our quarterly tax safe-harbor engine.
                </p>
              </div>
              <Link
                to="/#calculator"
                className="w-full sm:w-auto text-center shrink-0 rounded-full bg-[#11716d] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#0e5f5c] transition shadow-xs"
              >
                Estimate Quarterly Taxes →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: STANDARD RATE VS. ACTUAL EXPENSE COMPARISON
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm">
            <div className="border-b border-[#e5ebe6] pb-4 mb-5">
              <h2 className="text-lg sm:text-2xl font-black text-[#102a2d]">
                Standard Mileage Rate vs. Actual Vehicle Expense Comparison
              </h2>
              <p className="text-xs sm:text-sm text-[#4b6563] mt-1">
                The IRS allows you to claim either the Standard Mileage Rate (${currentRates.business}/mi) OR your actual
                vehicle operating costs multiplied by your business use percentage. See which method produces a bigger write-off.
              </p>
            </div>

            {/* Winner Banner */}
            <div
              className={`rounded-2xl p-4 sm:p-5 mb-6 border ${
                comparisonResults.winner === "standard"
                  ? "bg-[#eaf5ef] border-[#a1d9b8] text-[#0f5436]"
                  : comparisonResults.winner === "actual"
                  ? "bg-[#f4effc] border-[#cfb8f2] text-[#4a1c87]"
                  : "bg-[#f8f9fa] border-[#d8e2dc] text-[#102a2d]"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70">
                    RECOMMENDED IRS METHOD
                  </span>
                  <h3 className="text-base sm:text-xl font-black mt-1">
                    {comparisonResults.winner === "standard"
                      ? `Standard Mileage Method wins by ${formatMoney(comparisonResults.difference)}!`
                      : comparisonResults.winner === "actual"
                      ? `Actual Expense Method wins by ${formatMoney(comparisonResults.difference)}!`
                      : "Both methods provide identical tax write-offs."}
                  </h3>
                  <p className="text-xs mt-1">
                    Standard Rate write-off: <b>{formatMoney(comparisonResults.standardDeduction)}</b> vs. Actual Expense
                    write-off: <b>{formatMoney(comparisonResults.actualDeduction)}</b> (
                    {comparisonResults.businessPercentage.toFixed(1)}% business use).
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black">
                    +{formatMoney(comparisonResults.difference)}
                  </span>
                  <p className="text-[10px] uppercase font-bold">Extra Tax Write-Off</p>
                </div>
              </div>
            </div>

            {/* Input Grid for Actual Expenses */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11716d]">
                  1. Annual Odometer & Mileage Allocation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#2a4d49] block mb-1">
                      Total Annual Miles (All Driving)
                    </label>
                    <div className="input-wrap text-xs">
                      <b>🚗</b>
                      <input
                        type="number"
                        value={actualExpenses.totalMilesDriven}
                        onChange={(e) =>
                          setActualExpenses({
                            ...actualExpenses,
                            totalMilesDriven: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2a4d49] block mb-1">
                      Business Miles Driven
                    </label>
                    <div className="input-wrap text-xs">
                      <b>📍</b>
                      <input
                        type="number"
                        value={actualExpenses.businessMilesDriven}
                        onChange={(e) =>
                          setActualExpenses({
                            ...actualExpenses,
                            businessMilesDriven: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#cbd6cf] text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6a8e87] font-medium">Business Use Percentage:</span>
                    <span className="font-black text-[#11716d] text-sm">
                      {comparisonResults.businessPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#eef2ea] rounded-full h-2 mt-2">
                    <div
                      className="bg-[#11716d] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${comparisonResults.businessPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11716d]">
                  2. Annual Vehicle Operating Costs ($)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5">Gas & Fuel / EV Charge</label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="number"
                        value={actualExpenses.gasAndFuel}
                        onChange={(e) =>
                          setActualExpenses({ ...actualExpenses, gasAndFuel: Number(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5">Auto Insurance</label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="number"
                        value={actualExpenses.insurance}
                        onChange={(e) =>
                          setActualExpenses({ ...actualExpenses, insurance: Number(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5">Repairs & Maintenance</label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="number"
                        value={actualExpenses.repairsAndMaintenance}
                        onChange={(e) =>
                          setActualExpenses({
                            ...actualExpenses,
                            repairsAndMaintenance: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5">Tires, Oil & Fluids</label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="number"
                        value={actualExpenses.tiresAndOil}
                        onChange={(e) =>
                          setActualExpenses({ ...actualExpenses, tiresAndOil: Number(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5">
                      Depreciation or Lease Payments
                    </label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="number"
                        value={actualExpenses.leaseOrDepreciation}
                        onChange={(e) =>
                          setActualExpenses({
                            ...actualExpenses,
                            leaseOrDepreciation: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#2a4d49] block mb-0.5">
                      Registration & Taxes
                    </label>
                    <div className="input-wrap text-xs">
                      <b>$</b>
                      <input
                        type="number"
                        value={actualExpenses.registrationAndTaxes}
                        onChange={(e) =>
                          setActualExpenses({
                            ...actualExpenses,
                            registrationAndTaxes: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: CONTEMPORANEOUS AUDIT TRIP LOGGER & GENERATOR
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === "log" && (
        <div className="space-y-6">
          <div className="rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ebe6] pb-4">
              <div>
                <h2 className="text-base sm:text-xl font-extrabold text-[#102a2d] flex items-center gap-2">
                  <span>📋</span> Contemporaneous IRS Mileage Log
                </h2>
                <p className="text-xs text-[#6a8e87] mt-0.5">
                  Saved privately in your browser · Complies with IRC § 274(d) recordkeeping rules
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyLoggedMiles}
                  disabled={trips.length === 0}
                  className="rounded-xl border border-[#cbd6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#11716d] hover:bg-[#eef4f0] transition disabled:opacity-50"
                >
                  Apply Total ({loggedMilesTotal.toFixed(1)} mi)
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={trips.length === 0}
                  className="rounded-xl bg-[#11716d] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0e5f5c] transition disabled:opacity-50 shadow-xs"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={handlePrintReport}
                  disabled={trips.length === 0}
                  className="rounded-xl border border-[#cbd6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#3a5854] hover:bg-[#f0f4f2] transition disabled:opacity-50"
                >
                  🖨️ Print
                </button>
                {trips.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearTrips}
                    className="text-xs font-bold text-[#b94a48] hover:underline px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Add New Trip Form */}
            <form onSubmit={handleAddTrip} className="space-y-3 bg-[#f4f7f4] p-4 rounded-2xl border border-[#d6e5dc]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#11716d]">
                + Log New Business Trip
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2a4d49] block mb-1">Date</label>
                  <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[40px]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#2a4d49] block mb-1">Trip Category</label>
                  <select
                    value={tripCategory}
                    onChange={(e) => setTripCategory(e.target.value as TripLogItem["category"])}
                    className="w-full rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[40px]"
                  >
                    {COMMON_PURPOSE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#2a4d49] block mb-1">Miles Driven</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 18.5"
                    value={tripMiles}
                    onChange={(e) => setTripMiles(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-bold text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[40px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Starting Location / Origin (e.g. Home Office)"
                  value={tripStartLoc}
                  onChange={(e) => setTripStartLoc(e.target.value)}
                  className="rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-medium text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[40px]"
                />
                <input
                  type="text"
                  placeholder="Destination (e.g. Client Office / 500 Broadway)"
                  value={tripDestLoc}
                  onChange={(e) => setTripDestLoc(e.target.value)}
                  className="rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-medium text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[40px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Specific Business Purpose (e.g. Discuss Q3 deliverables with Sarah)"
                  value={tripPurpose}
                  onChange={(e) => setTripPurpose(e.target.value)}
                  className="flex-1 rounded-xl border border-[#cbd6cf] bg-white px-3 py-2 text-xs font-medium text-[#102a2d] focus:border-[#11716d] focus:outline-none min-h-[40px]"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 rounded-xl bg-[#11716d] px-6 py-2.5 text-xs font-extrabold text-white hover:bg-[#0e5f5c] transition active:scale-98 shadow-xs"
                >
                  Save Trip
                </button>
              </div>
            </form>

            {/* Trip List Table */}
            {trips.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-[#eef4f0] p-3 rounded-xl border border-[#d6e5dc]">
                  <span className="font-extrabold text-[#102a2d]">
                    {trips.length} {trips.length === 1 ? "Trip" : "Trips"} Logged
                  </span>
                  <span className="text-[#11716d] font-black text-sm">
                    {loggedMilesTotal.toFixed(1)} Miles = {formatMoney(loggedDeductionTotal)} Tax Write-Off
                  </span>
                </div>

                <ResponsiveTable>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f0f4f1] text-[#486360] font-extrabold border-b border-[#e5ebe6]">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Origin → Destination</th>
                        <th className="p-2.5">Business Purpose</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Miles</th>
                        <th className="p-2.5 text-right">Deduction</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5ebe6] bg-white">
                      {trips.map((t) => {
                        const rate =
                          t.category === "medical"
                            ? currentRates.medicalMoving
                            : t.category === "charity"
                            ? currentRates.charity
                            : currentRates.business;
                        return (
                          <tr key={t.id} className="hover:bg-[#fbfcf8]">
                            <td className="p-2.5 font-mono text-[11px] whitespace-nowrap text-[#6a8e87]">
                              {t.date}
                            </td>
                            <td className="p-2.5 max-w-[200px] truncate text-[#2a4d49]">
                              {t.startLocation || "Office"} → {t.destination || "Site"}
                            </td>
                            <td className="p-2.5 font-semibold text-[#102a2d] max-w-[240px] truncate">
                              {t.purpose}
                            </td>
                            <td className="p-2.5 text-[11px] text-[#6a8e87]">
                              {COMMON_PURPOSE_OPTIONS.find((c) => c.id === t.category)?.label || t.category}
                            </td>
                            <td className="p-2.5 text-right font-black text-[#102a2d] whitespace-nowrap">
                              {t.miles} mi
                            </td>
                            <td className="p-2.5 text-right font-bold text-[#11716d] whitespace-nowrap">
                              {formatMoney(t.miles * rate)}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteTrip(t.id)}
                                className="text-[#b94a48] hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50"
                                title="Delete record"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ResponsiveTable>
              </div>
            ) : (
              <p className="text-center text-xs text-[#7d9b95] py-6">
                No trips logged yet. Add your business drives above to generate an audit-proof mileage record.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─── Informational & Editorial Guide (AdSense-Compliant Authority) ─── */}
      <section className="mt-12 sm:mt-16 border-t border-[#d8e2dc] pt-10 space-y-12">
        <div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-[#102a2d]">
            IRS Mileage Deduction Guide: Rules, Compliance & Audit Defense
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4b6563] max-w-3xl leading-relaxed">
            The IRS standard mileage rate allows self-employed individuals, 1099 contractors, gig workers, and business owners
            to deduct vehicle costs from their taxable income without tracking every individual gas receipt.
          </p>
        </div>

        {/* 4 Pillars of Audit-Proofing */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2efe8] text-base">
              📅
            </div>
            <h3 className="text-sm font-extrabold text-[#102a2d]">1. Contemporaneous Log</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              Records must be made at or near the time of travel. Reconstructing a log from memory at the end of the year is
              the #1 reason deductions are disallowed in an audit.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2efe8] text-base">
              🎯
            </div>
            <h3 className="text-sm font-extrabold text-[#102a2d]">2. Business Purpose</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              Every trip must record a concrete commercial purpose (e.g., "Met with client Sarah to review contract draft",
              not simply "Business").
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2efe8] text-base">
              📍
            </div>
            <h3 className="text-sm font-extrabold text-[#102a2d]">3. Origin & Destination</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              Note starting location and destination address/city. Odometer readings at the start and end of the year establish
              total vehicle utilization.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2efe8] text-base">
              🛡️
            </div>
            <h3 className="text-sm font-extrabold text-[#102a2d]">4. First-Year Rule</h3>
            <p className="text-xs text-[#4b6563] leading-relaxed">
              For owned vehicles, you must choose the Standard Mileage rate in the <em>first year</em> the car is placed in
              service to retain the option of switching between methods in later years.
            </p>
          </div>
        </div>

        {/* Home Office Loophole vs Commuting Diagram */}
        <div className="rounded-2xl border border-[#cbd6cf] bg-white p-6 sm:p-8 space-y-4">
          <h3 className="text-lg sm:text-xl font-black text-[#102a2d]">
            The Commuting Rule vs. The Home Office Exception
          </h3>
          <p className="text-xs sm:text-sm text-[#4b6563] leading-relaxed">
            Under <b>IRS Publication 463</b>, your daily drive between your home and your principal place of business is a
            non-deductible personal commute. However, if your home qualifies as your <b>principal place of business</b> under
            IRC § 280A (the Home Office Deduction), trips originating from your home office directly to client meetings,
            supply vendors, or job sites become <b>100% deductible business mileage</b>.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#fdf2f2] p-4 rounded-xl border border-[#f5c6cb] text-xs">
              <h4 className="font-extrabold text-[#b94a48] mb-1">❌ Without Home Office:</h4>
              <p className="text-[#5c2423]">
                Home → Client Site = Non-deductible Commute.<br />
                Client Site → Second Client = Deductible Business Trip.<br />
                Second Client → Home = Non-deductible Commute.
              </p>
            </div>

            <div className="bg-[#eef6f2] p-4 rounded-xl border border-[#c4e3d3] text-xs">
              <h4 className="font-extrabold text-[#11716d] mb-1">✅ With Qualified Home Office:</h4>
              <p className="text-[#102a2d]">
                Home Office → Client Site = <b>100% Deductible</b>.<br />
                Client Site → Second Client = <b>100% Deductible</b>.<br />
                Second Client → Home Office = <b>100% Deductible</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Gig Drivers Playbook */}
        <div className="rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-6 space-y-3">
          <h3 className="text-base sm:text-lg font-black text-[#102a2d]">
            Gig Drivers Playbook: Uber, Lyft, DoorDash, and Instacart
          </h3>
          <p className="text-xs sm:text-sm text-[#4b6563] leading-relaxed">
            Gig apps often only report <em>"on-trip miles"</em> (miles driven while a passenger is in the car or an order is in
            your trunk) on their annual 1099 summary. However, tax law permits you to deduct all <b>"online awaiting request"</b> miles
            (deadhead miles driven between drops while waiting for the next dispatch), as long as your app was actively turned on.
          </p>
        </div>

        {/* Comprehensive FAQs */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-black text-[#102a2d]">
            Frequently Asked Questions (IRS Mileage Deduction)
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#cbd6cf] bg-white p-4 text-xs space-y-1.5">
              <h4 className="font-extrabold text-[#102a2d]">Can W-2 employees deduct mileage?</h4>
              <p className="text-[#526967] leading-relaxed">
                No. Following the Tax Cuts and Jobs Act (TCJA), unreimbursed employee business expenses are suspended for
                W-2 workers through 2025/2026. Only 1099 independent contractors, statutory employees, armed forces reservists,
                and business owners can claim the federal deduction.
              </p>
            </div>

            <div className="rounded-xl border border-[#cbd6cf] bg-white p-4 text-xs space-y-1.5">
              <h4 className="font-extrabold text-[#102a2d]">Can I write off parking fees and tolls separately?</h4>
              <p className="text-[#526967] leading-relaxed">
                Yes! Even if you use the standard mileage rate, business-related parking fees and bridge/highway tolls are
                separately deductible on Schedule C in addition to the standard per-mile rate.
              </p>
            </div>

            <div className="rounded-xl border border-[#cbd6cf] bg-white p-4 text-xs space-y-1.5">
              <h4 className="font-extrabold text-[#102a2d]">Can I claim mileage on an electric vehicle (EV)?</h4>
              <p className="text-[#526967] leading-relaxed">
                Yes. The IRS standard mileage rate applies equally to gasoline, diesel, hybrid, and all-electric vehicles (EVs).
                Because EV charging costs are typically lower than gasoline, EV owners often enjoy a huge financial surplus with
                the standard mileage rate.
              </p>
            </div>

            <div className="rounded-xl border border-[#cbd6cf] bg-white p-4 text-xs space-y-1.5">
              <h4 className="font-extrabold text-[#102a2d]">How long should I keep my mileage records?</h4>
              <p className="text-[#526967] leading-relaxed">
                Keep mileage logs, repair receipts, and annual vehicle inspection records for at least <b>3 years</b> from the date
                you filed your tax return (or 6 years if gross income was underreported by 25% or more).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
