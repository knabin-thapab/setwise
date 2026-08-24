import SimplePage from "../components/SimplePage";
import { usePageMeta } from "../lib/usePageMeta";

export default function Disclaimer() {
  usePageMeta(
    "Disclaimer | Setwise",
    "Setwise's calculators provide estimates for informational purposes only and are not tax, legal, or financial advice. Read the full disclaimer before relying on any figure."
  );
  return (
    <SimplePage eyebrow="LEGAL" title="Disclaimer">
      <p>
        This website, including all tax calculators, state tax breakdown guides, invoice generators, and profit margin
        tools, provides estimates for <strong>informational and educational purposes only</strong> and does not
        constitute legal, tax, financial, or accounting advice.
      </p>

      <h2>Not a substitute for professional tax counsel</h2>
      <p>
        Setwise is an independent informational resource. We are not a certified public accounting firm, enrolled
        agent, or law firm. Tax regulations are intricate and differ widely based on individual circumstances, local
        jurisdictions, deductions, credits, and evolving legislation. Always consult a licensed CPA or qualified tax
        advisor regarding your specific tax filing obligations.
      </p>

      <h2>Accuracy and updates of tax figures</h2>
      <p>
        Federal tax brackets, standard deduction amounts, self-employment tax rates (Social Security & Medicare),
        and state tax schedules are based on published IRS and state Department of Revenue figures for the 2026 tax
        year. While we make diligent efforts to maintain up-to-date and accurate calculations, tax laws are subject
        to retroactive amendments and periodic rule revisions. We cannot guarantee absolute accuracy at all times.
      </p>

      <h2>Scope of calculations</h2>
      <p>
        Our tools provide estimated calculations based on standard freelance and 1099 contractor scenarios. They do
        not incorporate complex nuances such as itemized Schedule A deductions, alternative minimum tax (AMT),
        foreign income exclusions, passive loss limitations, or municipal city-level taxes unless explicitly noted.
      </p>

      <h2>User responsibility</h2>
      <p>
        You are solely responsible for your own tax filings, timely quarterly estimated payments, and tax compliance.
        Use of this tool does not provide safe-harbor protection from IRS or state penalties or interest in the event
        of underpayment.
      </p>
    </SimplePage>
  );
}
