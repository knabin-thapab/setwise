import SimplePage from "../components/SimplePage";
import { usePageMeta } from "../lib/usePageMeta";

export default function Terms() {
  usePageMeta(
    "Terms of Service | Setwise",
    "The terms governing use of Setwise's free tax and money calculators for freelancers, including our no-warranty and not-tax-advice disclaimers."
  );
  return (
    <SimplePage eyebrow="LEGAL" title="Terms of Service">
      <p>Last updated: August 2026</p>
      <h2>Use of this site</h2>
      <p>
        This website and its calculator are provided free of charge for personal, informational use. By
        using this site, you agree to use it only for lawful purposes and to not misuse, scrape, or
        disrupt the service.
      </p>
      <h2>No professional advice</h2>
      <p>
        Nothing on this site constitutes tax, legal, financial, or accounting advice. The calculator
        provides estimates only, based on simplified assumptions about federal tax law. Your actual tax
        liability may differ. Always consult a licensed CPA or tax professional for guidance specific to
        your situation.
      </p>
      <h2>No warranty</h2>
      <p>
        This site and its tools are provided "as is," without warranties of any kind, express or implied,
        including but not limited to accuracy, completeness, or fitness for a particular purpose. We make
        reasonable efforts to keep tax figures current but cannot guarantee the calculator reflects the
        most recent IRS guidance at every moment.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        We are not liable for any losses, penalties, or damages resulting from reliance on estimates
        provided by this tool. Use of this calculator is at your own discretion and risk.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes constitutes
        acceptance of the updated terms.
      </p>
    </SimplePage>
  );
}
