import { useMemo, useState } from "react";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";
import Breadcrumbs from "../components/Breadcrumbs";

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
    "W-2 wages can use up some of the Social Security wage base and increase your total taxable income. Add your expected wages for a more useful estimate. You may also be able to increase W-2 withholding instead of sending separate estimated payments.",
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
    "Does this include state income tax?",
    "Yes! Setwise includes built-in state income tax calculations for all 50 US states and Washington D.C., including the 9 states with 0% income tax, flat-rate states, and progressive bracket schedules.",
  ],
  [
    "Where do I make an estimated tax payment?",
    "The IRS offers Direct Pay and the Electronic Federal Tax Payment System (EFTPS) for individual estimated tax payments. For state payments, visit your state's Department of Revenue website. Keep payment confirmations for your records.",
  ],
  [
    "What happens if I miss a quarterly deadline?",
    "The IRS can charge an underpayment penalty calculated roughly like interest on the amount that was late, from the due date until you pay it. Paying late is still better than not paying at all — send the payment as soon as you can rather than waiting for the next quarter.",
  ],
  [
    "Is this calculator updated for the 2026 tax year?",
    "Yes. All standard deductions, Social Security wage base caps ($184,500 for 2026), federal tax brackets, and state tax rules are updated for the 2026 tax year.",
  ],
];

export default function Faq() {
  usePageMeta({
    title: "Frequently Asked Questions — 1099 Taxes | Setwise",
    description: "Answers to common questions about quarterly estimated taxes, self-employment tax, state taxes, the safe-harbor rule, and W-2 side income for US freelancers.",
    path: "/faq",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    }),
    []
  );

  useStructuredData(schema);

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />

      <p className="eyebrow">COMMON QUESTIONS</p>
      <h1 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#102a2d]">
        Frequently asked questions
      </h1>
      <p className="mt-3 sm:mt-5 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-[#4b6563]">
        Everything freelancers usually ask before their first quarterly payment.
      </p>
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
                  <p>{a}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

