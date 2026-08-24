import { Link } from "react-router-dom";

interface RelatedTool {
  icon: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  /** Optional heading — defaults to "Related Tools" */
  heading?: string;
}

/**
 * Displays a grid of related calculator/tool links. Used at the bottom
 * of calculator pages to strengthen internal linking between tools.
 */
export default function RelatedTools({ tools, heading = "Related Tools" }: RelatedToolsProps) {
  return (
    <section className="mt-10 sm:mt-14">
      <p className="eyebrow">EXPLORE MORE</p>
      <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-[-0.04em] text-[#102a2d]">
        {heading}
      </h2>
      <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            to={tool.href}
            className="group flex items-start gap-3 rounded-2xl border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-5 transition-all hover:border-[#11716d]/40 hover:shadow-md hover:scale-[1.01]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf3ee] text-lg group-hover:scale-110 group-hover:bg-white shadow-xs transition-all">
              {tool.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-extrabold text-[#102a2d] group-hover:text-[#11716d] transition-colors">
                  {tool.title}
                </span>
                {tool.badge && (
                  <span className="shrink-0 text-[9px] font-bold rounded-md bg-[#dcebe4] px-1.5 py-0.5 text-[#11716d]">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#6a8e87] leading-relaxed">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Predefined tool sets for each calculator page ──

export const TOOL_SETS = {
  home: [
    { icon: "🗺️", title: "50-State Tax Directory", description: "State-by-state tax brackets and rates for freelancers", href: "/state-tax", badge: "50 States" },
    { icon: "⚖️", title: "1099 vs W-2 Comparison", description: "Compare take-home pay between freelance and salaried work", href: "/1099-vs-w2-calculator", badge: "Compare" },
    { icon: "🚗", title: "Mileage Deduction Calculator", description: "Calculate your 2026 IRS mileage write-off at $0.725/mi", href: "/mileage-calculator", badge: "$0.725/mi" },
  ],
  mileage: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates for freelancers", href: "/", badge: "2026" },
    { icon: "📊", title: "Profit Margin Calculator", description: "Find your real take-home pay after taxes and expenses", href: "/profit-margin-calculator", badge: "Pricing" },
    { icon: "🏢", title: "S-Corp Tax Estimator", description: "See if S-Corp election could lower your tax bill", href: "/s-corp-calculator", badge: "Form 2553" },
  ],
  w2vs1099: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates for freelancers", href: "/", badge: "2026" },
    { icon: "🗺️", title: "50-State Tax Directory", description: "State-by-state tax brackets and rates", href: "/state-tax", badge: "50 States" },
    { icon: "📊", title: "Profit Margin Calculator", description: "Know your real hourly rate after all taxes", href: "/profit-margin-calculator", badge: "Pricing" },
  ],
  retirement: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates for freelancers", href: "/", badge: "2026" },
    { icon: "🏢", title: "S-Corp Tax Estimator", description: "Combine S-Corp savings with retirement contributions", href: "/s-corp-calculator", badge: "Form 2553" },
    { icon: "📊", title: "Profit Margin Calculator", description: "Find your real take-home after retirement contributions", href: "/profit-margin-calculator", badge: "Pricing" },
  ],
  scorp: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates for freelancers", href: "/", badge: "2026" },
    { icon: "🛡️", title: "Retirement Calculator", description: "SEP-IRA vs Solo 401(k) contribution limits", href: "/retirement-calculator", badge: "Max Limits" },
    { icon: "⚖️", title: "1099 vs W-2 Comparison", description: "Compare freelance vs salaried tax treatment", href: "/1099-vs-w2-calculator", badge: "Compare" },
  ],
  profitMargin: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates for freelancers", href: "/", badge: "2026" },
    { icon: "📄", title: "Invoice Generator", description: "Create professional invoices with tax set-aside", href: "/invoice-generator", badge: "Free PDF" },
    { icon: "🚗", title: "Mileage Deduction Calculator", description: "Reduce taxable income with IRS mileage rate", href: "/mileage-calculator", badge: "$0.725/mi" },
  ],
  invoice: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates for freelancers", href: "/", badge: "2026" },
    { icon: "📊", title: "Profit Margin Calculator", description: "Know your real take-home pay and true hourly rate", href: "/profit-margin-calculator", badge: "Pricing" },
    { icon: "🚗", title: "Mileage Deduction Calculator", description: "Add mileage deductions to lower your tax bill", href: "/mileage-calculator", badge: "$0.725/mi" },
  ],
  stateTax: [
    { icon: "🧮", title: "1099 Tax Calculator", description: "Federal & state quarterly tax estimates", href: "/", badge: "2026" },
    { icon: "⚖️", title: "1099 vs W-2 Comparison", description: "Compare freelance vs salaried take-home pay", href: "/1099-vs-w2-calculator", badge: "Compare" },
    { icon: "🛡️", title: "Retirement Calculator", description: "SEP-IRA vs Solo 401(k) contribution limits", href: "/retirement-calculator", badge: "Max Limits" },
  ],
} as const;
