import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getNextDeadline } from "../lib/deadlines";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";
import Breadcrumbs from "../components/Breadcrumbs";

export default function HowItWorks() {
  usePageMeta({
    title: "How Estimated Taxes Work for Freelancers (2026 Complete Guide) | Setwise",
    description: "A complete 2026 guide to how IRS quarterly estimated taxes work for freelancers: self-employment tax, income tax, safe-harbor rules, deadlines, and penalties explained.",
    path: "/how-estimated-taxes-work",
    ogType: "article",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How Estimated Taxes Work for Freelancers (2026 Complete Guide)",
      description:
        "A complete 2026 guide to how IRS quarterly estimated taxes work for freelancers: self-employment tax, income tax, safe-harbor rules, deadlines, and penalties explained.",
      author: {
        "@type": "Organization",
        name: "Setwise",
        url: "https://tnabin.com.np",
      },
      publisher: {
        "@type": "Organization",
        name: "Setwise",
        url: "https://tnabin.com.np",
        logo: {
          "@type": "ImageObject",
          url: "https://tnabin.com.np/logo.svg",
        },
      },
      datePublished: "2026-01-15",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://tnabin.com.np/how-estimated-taxes-work",
      },
    }),
    []
  );

  useStructuredData(schema);

  const [activeSection, setActiveSection] = useState<string>("pillars");
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    bank: true,
    expenses: true,
  });

  const nextDeadline = getNextDeadline();

  // Update active section on scroll
  useEffect(() => {
    const sectionIds = [
      "pillars",
      "calendar",
      "safe-harbor",
      "deductions",
      "w2-plus-1099",
      "how-to-pay",
      "penalties",
      "checklist",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "How Estimated Taxes Work for Freelancers (2026 Guide)",
          text: "Clear, zero-jargon guide to 1099 quarterly estimated taxes.",
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard unavailable
      }
    }
  };

  const navPills = [
    { id: "pillars", label: "🏛️ 3 Tax Pillars" },
    { id: "calendar", label: "🗓️ 2026 Deadlines" },
    { id: "safe-harbor", label: "🛡️ Safe Harbor" },
    { id: "deductions", label: "💡 Top Write-offs" },
    { id: "w2-plus-1099", label: "⚖️ W-2 + Freelance" },
    { id: "how-to-pay", label: "💳 How to Pay IRS" },
    { id: "penalties", label: "⚠️ Late Penalties" },
    { id: "checklist", label: "📋 2026 Checklist" },
  ];

  const quarters = [
    {
      quarter: "Q1 2026",
      period: "Jan 1 – Mar 31",
      due: "April 15, 2026",
      isNext: nextDeadline.quarter === "Q1",
      badge: "Spring Payment",
      tip: "Covers standard 3 full calendar months.",
    },
    {
      quarter: "Q2 2026",
      period: "Apr 1 – May 31",
      due: "June 15, 2026",
      isNext: nextDeadline.quarter === "Q2",
      badge: "Summer Payment",
      tip: "⚠️ Only covers 2 months (April & May).",
    },
    {
      quarter: "Q3 2026",
      period: "Jun 1 – Aug 31",
      due: "September 15, 2026",
      isNext: nextDeadline.quarter === "Q3",
      badge: "Fall Payment",
      tip: "Covers 3 summer months (June, July, August).",
    },
    {
      quarter: "Q4 2026",
      period: "Sep 1 – Dec 31",
      due: "January 15, 2027",
      isNext: nextDeadline.quarter === "Q4",
      badge: "Winter Payment",
      tip: "Covers 4 months; due in mid-January of next year.",
    },
  ];

  const deductions = [
    {
      icon: "🏠",
      title: "Home Office",
      desc: "Simplified $5/sq ft (up to $1,500) or actual percentage of rent, utilities, and insurance.",
    },
    {
      icon: "💻",
      title: "Software & Tech",
      desc: "Subscriptions to Adobe, Figma, GitHub, Notion, web hosting, domain names, and cloud tools.",
    },
    {
      icon: "🚗",
      title: "Business Mileage",
      desc: "IRS 2026 standard rate of $0.725 per mile driven for client visits and business errands.",
    },
    {
      icon: "📱",
      title: "Phone & Internet",
      desc: "The dedicated business percentage of your monthly mobile plan and home internet bills.",
    },
    {
      icon: "🛠️",
      title: "Gear & Equipment",
      desc: "Laptops, monitors, microphones, cameras, desks, and ergonomic chairs via Section 179.",
    },
    {
      icon: "👥",
      title: "Contractors & Subs",
      desc: "Payments to subcontractors, virtual assistants, accountants, designers, or legal counsel.",
    },
    {
      icon: "🏥",
      title: "Health Insurance",
      desc: "100% deduction for self-employed medical, dental, and qualifying vision insurance premiums.",
    },
    {
      icon: "📚",
      title: "Training & Books",
      desc: "Courses, conferences, books, webinars, and certifications that maintain or improve business skills.",
    },
  ];

  const checklistItems = [
    {
      id: "bank",
      title: "Dedicated Tax & Business Bank Account",
      desc: "Separate business revenue immediately from personal funds so you never spend tax cash.",
    },
    {
      id: "expenses",
      title: "Monthly Expense & Mileage Tracking",
      desc: "Log receipts and business miles continuously to maximize deductions on Schedule C.",
    },
    {
      id: "setaside",
      title: "Set Aside 25% – 30% per Client Invoice",
      desc: "Deposit 25-30% of every payment into a high-yield savings account earning 4-5% APY.",
    },
    {
      id: "calculate",
      title: "Run Quarterly 1099 Calculator",
      desc: "Calculate exact federal, state, and self-employment tax installments each quarter.",
    },
    {
      id: "submit",
      title: "Submit Payment on IRS Direct Pay",
      desc: "Select 'Estimated Tax (1040-ES)' for the current tax year and save the confirmation receipt.",
    },
  ];

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <main className="mx-auto max-w-[920px] px-3.5 py-6 sm:px-6 sm:py-12 lg:px-8 w-full overflow-x-hidden">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "How Estimated Taxes Work", href: "/how-estimated-taxes-work" },
        ]}
      />

      {/* ─── Guide Header ─── */}
      <div className="border-b border-[#cbd6cf]/70 pb-6 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[11px] sm:text-xs">THE COMPLETE 2026 TAX GUIDE</span>
            <span className="rounded-full bg-[#11716d]/10 px-2.5 py-0.5 text-[11px] font-extrabold text-[#11716d]">
              IRS Form 1040-ES
            </span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#20403c] shadow-2xs hover:border-[#11716d] hover:bg-[#eaf4ef] active:scale-95 transition"
          >
            <span>🔗</span>
            <span>{copied ? "Link Copied!" : "Share Guide"}</span>
          </button>
        </div>

        <h1 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-black leading-tight sm:leading-[1.08] tracking-[-0.05em] text-[#102a2d]">
          How estimated taxes actually work for freelancers
        </h1>
        <p className="mt-3 text-sm sm:text-lg leading-relaxed text-[#4b6563]">
          If you're new to 1099 work, the phrase "quarterly estimated taxes" can feel like a trap nobody warned you about. This interactive guide breaks down the math, payment deadlines, and safe harbor rules in plain English.
        </p>

        {/* ─── Infinite Smooth Auto-Scrolling Marquee Navigation Ticker ─── */}
        <div className="mt-6 border-t border-[#cbd6cf]/50 pt-3">
          <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
            <span className="eyebrow text-[10px] text-[#557871]">
              QUICK JUMP TOPICS:
            </span>

          </div>

          <div className="relative flex w-full overflow-hidden mask-edges group py-1.5">
            <div className="animate-marquee hover:cursor-grab active:cursor-grabbing">
              {/* Render 4 loops for seamless infinite scrolling */}
              {[0, 1, 2, 3].map((arrIdx) => (
                <div key={arrIdx} className="flex gap-2.5 pr-2.5">
                  {navPills.map((pill, i) => {
                    const isActive = activeSection === pill.id;
                    return (
                      <a
                        key={`${arrIdx}-${pill.id}-${i}`}
                        href={`#${pill.id}`}
                        onClick={() => setActiveSection(pill.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 shrink-0 ${isActive
                            ? "bg-[#11716d] text-white border-transparent shadow-sm"
                            : "bg-white/85 text-[#1b4b45] border border-[#bdece1] hover:bg-white hover:border-[#11716d]/50 hover:text-[#11716d]"
                          }`}
                      >
                        {pill.label}
                      </a>
                    );
                  })}
                  {/* Clean styled helper tool links in the marquee */}
                  <Link
                    key={`${arrIdx}-statetax`}
                    to="/state-tax"
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 shrink-0 bg-white/85 text-[#11716d] border border-[#bdece1] hover:bg-[#eaf4ef]"
                  >
                    🗺️ 50-State Guide →
                  </Link>
                  <Link
                    key={`${arrIdx}-calc`}
                    to="/#calculator"
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 shrink-0 bg-white/85 text-[#11716d] border border-[#bdece1] hover:bg-[#eaf4ef]"
                  >
                    🧮 1099 Calculator →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: W-2 vs 1099 Comparison ─── */}
      <section className="mb-10 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-black text-[#102a2d] tracking-tight">
          Why freelancers pay differently than W-2 employees
        </h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#3a5854]">
          The United States tax code operates on a "pay-as-you-earn" structure. If taxes aren't paid throughout the year, the IRS charges interest-like underpayment penalties.
        </p>

        <div className="mt-4 grid gap-3.5 sm:gap-4 sm:grid-cols-2">
          {/* W-2 Card */}
          <div className="group rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e2ece5] text-sm group-hover:scale-110 transition-transform">
                🏢
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                W-2 Employee (Withheld at Source)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#52706b] leading-relaxed">
              Your employer automatically subtracts federal tax, state tax, and half of Social Security/Medicare (7.65%) from every paycheck before the money hits your bank account.
            </p>
          </div>

          {/* 1099 Card */}
          <div className="group rounded-2xl border border-[#11716d]/40 bg-gradient-to-br from-white to-[#edf7f3] p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#11716d] text-sm text-white group-hover:scale-110 transition-transform">
                💼
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#11716d]">
                1099 Freelancer (Pay-As-You-Go)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#264e4a] leading-relaxed">
              Clients pay 100% of the invoice gross with zero tax withheld. You are both employer and employee, responsible for calculating and submitting quarterly payments directly to the IRS.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: The 3 Tax Pillars ─── */}
      <section id="pillars" className="scroll-mt-24 mb-10 sm:mb-14 space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#11716d]">
            Understanding the Formula
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#102a2d] tracking-tight mt-0.5">
            The 3 taxes hiding inside "Estimated Tax"
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[#3a5854]">
            "Quarterly tax" is not a separate unique tax rate; it is simply an installment combining three distinct obligations:
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-6 shadow-xs hover:border-[#11716d]/40 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#11716d] text-xs font-black text-white">
                  1
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                  Self-Employment (SE) Tax · 15.3%
                </h3>
              </div>
              <span className="rounded-md bg-[#eaf3ee] px-2 py-0.5 text-[11px] font-extrabold text-[#11716d]">
                FICA / Payroll
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#4b6563]">
              Covers <strong>Social Security (12.4%)</strong> up to the annual IRS wage base ($176,100 in 2025 / $181,800 in 2026) and <strong>Medicare (2.9%)</strong> with no ceiling. This is calculated on <strong>92.35%</strong> of your net freelance profit.
            </p>
            <div className="mt-3 rounded-xl bg-[#f5f9f6] p-3 text-xs text-[#28504a]">
              💡 <strong>Tax Break:</strong> You can deduct 50% of your self-employment tax as an above-the-line deduction, reducing your federal taxable income.
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-6 shadow-xs hover:border-[#11716d]/40 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#11716d] text-xs font-black text-white">
                  2
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                  Federal Progressive Income Tax · 10% to 37%
                </h3>
              </div>
              <span className="rounded-md bg-[#f1f6f2] px-2 py-0.5 text-[11px] font-bold text-[#557871]">
                Progressive Brackets
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#4b6563]">
              Applied to your taxable profit after subtracting the 2026 Standard Deduction ($15,000 for Single / $30,000 for Married Filing Jointly), your 50% SE deduction, and qualifying 20% Section 199A QBI deductions.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-6 shadow-xs hover:border-[#11716d]/40 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#11716d] text-xs font-black text-white">
                  3
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                  State Income Tax · 0% to 13.3%
                </h3>
              </div>
              <Link
                to="/state-tax"
                className="text-[11px] font-bold text-[#11716d] hover:underline"
              >
                View 50 States →
              </Link>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#4b6563]">
              Depends entirely on where you reside. 9 states charge 0% on freelance income (AK, FL, NV, NH, SD, TN, TX, WA, WY), others charge flat rates (e.g. PA 3.07%, IL 4.95%), and states like CA and NY use progressive brackets up to 10-13%.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: 2026 Quarterly Schedule ─── */}
      <section id="calendar" className="scroll-mt-24 mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#11716d]">
              IRS Form 1040-ES
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#102a2d] tracking-tight">
              2026 Quarterly Estimated Tax Deadlines
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#4b6563] mb-4 leading-relaxed">
          Despite being called "quarterly", IRS quarters are uneven. Q2 is only two months long, while Q4 covers four months and is due in the following year.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {quarters.map((q) => (
            <div
              key={q.quarter}
              className={`rounded-2xl border p-4 sm:p-5 shadow-2xs transition-all hover:scale-[1.01] ${q.isNext
                  ? "border-[#11716d] bg-gradient-to-br from-white to-[#edf7f3] ring-2 ring-[#11716d]/30"
                  : "border-[#cbd6cf] bg-white"
                }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-black text-[#102a2d]">
                  {q.quarter}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${q.isNext
                      ? "bg-[#11716d] text-white animate-pulse"
                      : "bg-[#eaf3ee] text-[#11716d]"
                    }`}
                >
                  {q.isNext ? "⚡ Next Due Date" : q.badge}
                </span>
              </div>

              <div className="text-xs space-y-1 text-[#4b6563]">
                <div className="flex justify-between border-b border-[#edf2ee] pb-1">
                  <span>Income Period:</span>
                  <span className="font-semibold text-[#102a2d]">{q.period}</span>
                </div>
                <div className="flex justify-between border-b border-[#edf2ee] py-1">
                  <span>Payment Deadline:</span>
                  <span className="font-black text-[#11716d]">{q.due}</span>
                </div>
              </div>

              <p className="mt-2.5 text-[11px] text-[#557871] leading-tight">
                {q.tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4: Safe Harbor Rules ─── */}
      <section id="safe-harbor" className="scroll-mt-24 mb-10 sm:mb-14">
        <div className="rounded-2xl sm:rounded-3xl border border-[#b8ded4] bg-gradient-to-br from-[#f2faf7] to-[#e4f4ef] p-5 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-black text-[#0f5c59] mb-2">
            <span>🛡️</span>
            <span>The Safe Harbor Rule: Zero IRS Penalty Protection</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-[#102a2d] tracking-tight">
            How to never owe a penalty, even if income spikes
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#27504a] leading-relaxed">
            The IRS provides a guaranteed "Safe Harbor" protection. As long as you pay timely estimated payments equal to one of the following thresholds, you will owe <strong>$0 in underpayment penalties</strong>:
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#c1e4db] bg-white p-4 shadow-2xs hover:border-[#11716d]/50 transition">
              <p className="text-xs font-black text-[#11716d]">Standard Rule (AGI ≤ $150k)</p>
              <h4 className="text-sm font-extrabold text-[#102a2d] mt-1">100% of Prior Year's Tax</h4>
              <p className="text-xs text-[#52716c] mt-1 leading-relaxed">
                Pay 100% of your total federal tax shown on last year's Form 1040 (divided by 4 quarters).
              </p>
            </div>

            <div className="rounded-xl border border-[#c1e4db] bg-white p-4 shadow-2xs hover:border-[#11716d]/50 transition">
              <p className="text-xs font-black text-[#11716d]">High-Earner Rule (AGI &gt; $150k)</p>
              <h4 className="text-sm font-extrabold text-[#102a2d] mt-1">110% of Prior Year's Tax</h4>
              <p className="text-xs text-[#52716c] mt-1 leading-relaxed">
                If your prior year AGI exceeded $150,000 ($75,000 if married filing separately), pay 110% of prior year tax.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: Top Freelancer Write-Offs ─── */}
      <section id="deductions" className="scroll-mt-24 mb-10 sm:mb-14">
        <h2 className="text-xl sm:text-2xl font-black text-[#102a2d] tracking-tight">
          What counts as income: Maximize your write-offs
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#4b6563] leading-relaxed mb-4">
          Never calculate estimated taxes on gross revenue. Taxes are strictly assessed on <strong>NET profit</strong> (Gross client revenue minus ordinary and necessary business expenses).
        </p>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {deductions.map((d) => (
            <div
              key={d.title}
              className="rounded-xl border border-[#cbd6cf] bg-white p-3.5 sm:p-4 shadow-2xs hover:border-[#11716d]/50 hover:shadow-xs transition"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{d.icon}</span>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#102a2d]">
                  {d.title}
                </h4>
              </div>
              <p className="text-xs text-[#52706b] leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 6: W-2 + Freelance Dual Income ─── */}
      <section id="w2-plus-1099" className="scroll-mt-24 mb-10 sm:mb-14">
        <div className="rounded-2xl border border-[#cbd6cf] bg-white p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <h3 className="text-base sm:text-lg font-black text-[#102a2d]">
              What if you have a full-time W-2 job and freelance on the side?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#4b6563] leading-relaxed">
            If you have both W-2 wages and 1099 income, two important rules apply:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#2d4d48] pl-2">
            <li className="flex items-start gap-2">
              <span className="text-[#11716d] font-bold">1.</span>
              <span><strong>Shared Social Security Cap:</strong> Your W-2 wages count toward the annual Social Security wage base ceiling ($181,800). If your W-2 salary reaches the cap, you pay 0% Social Security tax on freelance earnings!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#11716d] font-bold">2.</span>
              <span><strong>The W-4 Withholding Trick:</strong> Instead of filing 4 quarterly checks, you can simply adjust Form W-4 with your employer to increase paycheck withholding to cover your freelance tax liability.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── SECTION 7: How to Pay the IRS ─── */}
      <section id="how-to-pay" className="scroll-mt-24 mb-10 sm:mb-14 space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#11716d]">
            Official Payment Methods
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#102a2d] tracking-tight mt-0.5">
            How to make quarterly payments to the IRS
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[#3a5854]">
            Paying the IRS is fast, free, and does not require mailing paper checks or paying accounting software fees.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3">
          {/* Method 1: IRS Direct Pay */}
          <div className="rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#11716d] transition flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-md bg-[#eaf3ee] px-2 py-0.5 text-[10px] font-extrabold text-[#11716d] mb-2">
                ⭐ Recommended (100% Free)
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                1. IRS Direct Pay
              </h4>
              <p className="mt-1.5 text-xs text-[#52706b] leading-relaxed">
                Pay directly from your checking or savings account with no fees. Select reason <strong>"Estimated Tax"</strong> and apply payment to <strong>"1040-ES"</strong>.
              </p>
            </div>
            <a
              href="https://www.irs.gov/payments/direct-pay"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#11716d] hover:underline"
            >
              <span>Visit IRS Direct Pay</span>
              <span>↗</span>
            </a>
          </div>

          {/* Method 2: EFTPS */}
          <div className="rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#11716d] transition flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-md bg-[#f0f4f1] px-2 py-0.5 text-[10px] font-bold text-[#557871] mb-2">
                For High Frequency
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                2. EFTPS System
              </h4>
              <p className="mt-1.5 text-xs text-[#52706b] leading-relaxed">
                The Electronic Federal Tax Payment System lets you schedule payments up to 365 days in advance and view complete payment history.
              </p>
            </div>
            <a
              href="https://www.irs.gov/payments/eftps-the-electronic-federal-tax-payment-system"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#11716d] hover:underline"
            >
              <span>Visit EFTPS Portal</span>
              <span>↗</span>
            </a>
          </div>

          {/* Method 3: Debit / Credit Card */}
          <div className="rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#11716d] transition flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-md bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#92400e] mb-2">
                1.87% – 1.98% Fee
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#102a2d]">
                3. Card Payment
              </h4>
              <p className="mt-1.5 text-xs text-[#52706b] leading-relaxed">
                Pay via authorized third-party processors (PayUSAtax, ACI, etc.) to earn credit card points or sign-up bonuses.
              </p>
            </div>
            <a
              href="https://www.irs.gov/payments/pay-your-taxes-by-debit-or-credit-card"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#11716d] hover:underline"
            >
              <span>View Card Processors</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: Late Penalties & Fees ─── */}
      <section id="penalties" className="scroll-mt-24 mb-10 sm:mb-14">
        <div className="rounded-2xl border border-[#fecaca] bg-gradient-to-br from-white to-[#fff5f5] p-5 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-black text-[#991b1b] mb-2">
            <span>⚠️</span>
            <span>IRS Section 6654 Underpayment Penalty Rules</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-[#102a2d] tracking-tight">
            What happens if you miss a quarterly deadline?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4b6563] leading-relaxed">
            The IRS does not issue criminal fines for missing quarterly estimates. Instead, under IRC Section 6654, it charges <strong>interest on the unpaid amount</strong> from the quarterly due date until the day it is paid.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#fca5a5]/40 bg-white p-3.5 shadow-2xs">
              <h4 className="text-xs font-black text-[#991b1b]">Current IRS Interest Rate</h4>
              <p className="text-xs text-[#52706b] mt-1 leading-relaxed">
                Currently approx <strong>7% – 8% per annum</strong> (compounded daily). For example, being $1,000 late by 60 days costs roughly ~$12 in interest.
              </p>
            </div>

            <div className="rounded-xl border border-[#bbf7d0] bg-white p-3.5 shadow-2xs">
              <h4 className="text-xs font-black text-[#166534]">💡 The Golden Rule: Pay As Soon As Possible</h4>
              <p className="text-xs text-[#52706b] mt-1 leading-relaxed">
                If you miss a deadline, <strong>send the payment immediately</strong> rather than waiting for the next quarter. Interest stops accumulating the moment the IRS receives your funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: Interactive Freelancer Tax Checklist ─── */}
      <section id="checklist" className="scroll-mt-24 mb-10 sm:mb-14">
        <div className="rounded-2xl sm:rounded-3xl border border-[#cbd6cf] bg-white p-5 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#11716d]">
                Interactive Roadmap
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-[#102a2d] tracking-tight">
                2026 Quarterly Tax Checklist
              </h2>
            </div>
            <span className="rounded-full bg-[#eaf3ee] px-3 py-1 text-xs font-extrabold text-[#11716d]">
              {completedCount} of {checklistItems.length} Completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#edf2ee] h-2 rounded-full mb-5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#11716d] to-[#6dd4c8] h-full transition-all duration-300"
              style={{
                width: `${(completedCount / checklistItems.length) * 100}%`,
              }}
            />
          </div>

          <div className="space-y-2.5">
            {checklistItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer select-none ${isChecked
                      ? "bg-[#f2faf7] border-[#11716d]/30 text-[#102a2d]"
                      : "bg-[#fafcfb] border-[#cbd6cf] text-[#4b6563] hover:bg-white hover:border-[#11716d]/40"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-1 h-4 w-4 rounded text-[#11716d] focus:ring-[#11716d] cursor-pointer accent-[#11716d]"
                  />
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-extrabold ${isChecked ? "text-[#11716d] line-through" : "text-[#102a2d]"
                        }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#52706b] mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Bottom Tool CTA Card ─── */}
      <section className="mt-8 rounded-3xl bg-gradient-to-r from-[#102a2d] to-[#114b48] p-5 sm:p-8 text-white shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-[#1da09a]/30 px-3 py-1 text-xs font-bold text-[#72f5ea]">
            ⚡ 2026 Interactive Calculator
          </span>
          <h3 className="mt-2 text-lg sm:text-2xl font-black leading-tight">
            Ready to calculate your exact quarterly payments?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#a2cbca]">
            Takes under 30 seconds. Covers all 50 states with verified 2026 IRS tax brackets.
          </p>
        </div>
        <Link
          to="/#calculator"
          className="w-full sm:w-auto text-center shrink-0 rounded-full bg-[#6dd4c8] px-6 py-3.5 text-sm font-black text-[#0c2a2b] shadow-lg hover:bg-[#8bf0e5] active:scale-95 transition"
        >
          Calculate Estimated Tax →
        </Link>
      </section>
    </main>
  );
}
