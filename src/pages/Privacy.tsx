import SimplePage from "../components/SimplePage";
import { usePageMeta } from "../lib/usePageMeta";

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy | Setwise",
    description: "How Setwise handles your data: what we collect, what we don't, and how our browser-based tax calculators keep your numbers off our servers.",
    path: "/privacy-policy",
  });
  return (
    <SimplePage eyebrow="LEGAL & COMPLIANCE" title="Privacy Policy">
      <p className="text-xs font-semibold text-[#5c7a74]">Last updated: August 2026</p>

      <p>
        At <strong>Setwise</strong> (accessible from <a href="https://setwise.co">setwise.co</a> and{" "}
        <a href="https://tnabin.com.np">tnabin.com.np</a>), the privacy of our visitors is one of our top
        priorities. This Privacy Policy document outlines the types of information that is collected and
        recorded by Setwise and how we use it.
      </p>

      <h2>1. Zero Financial Data Collection (Client-Side Calculations)</h2>
      <p>
        All financial calculations — including your estimated freelance income, W-2 earnings, filing status,
        state selections, deductions, and tax computations — are performed entirely <strong>client-side in your
        web browser using JavaScript</strong>.
      </p>
      <p>
        We do not transmit, log, store, or sell any numbers, monetary figures, or financial parameters you enter
        into any calculator or generator on this website. Your financial data never leaves your device.
      </p>

      <h2>2. Google AdSense & Advertising Cookies</h2>
      <p>
        Setwise uses <strong>Google AdSense</strong> to display advertisements. Google is a third-party vendor on
        our site. Google uses cookies, including the DoubleClick DART cookie and advertising cookies, to serve ads
        to visitors based upon their visit to this website and other sites on the Internet.
      </p>
      <ul className="my-3 ml-6 list-disc space-y-2 text-[#43605c]">
        <li>
          Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our
          website or other websites.
        </li>
        <li>
          Google's use of advertising cookies enables it and its partners to serve ads to our users based on their
          visit to our sites and/or other sites on the Internet.
        </li>
        <li>
          Users may opt out of personalized advertising by visiting{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>.
        </li>
        <li>
          Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by
          visiting{" "}
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info/choices
          </a>{" "}
          or the{" "}
          <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
            Network Advertising Initiative Opt-Out Page
          </a>.
        </li>
      </ul>

      <h2>3. Web Analytics & Log Files</h2>
      <p>
        Like standard web applications, we may collect anonymous aggregate telemetry (such as page views, browser
        type, referring/exit pages, operating system, date/time stamps, and approximate general geographic region)
        through Google Analytics or privacy-conscious server logs. These logs are strictly aggregated and anonymized;
        they are not linked to any personally identifiable information or financial inputs.
      </p>

      <h2>4. Cookie Consent & Management</h2>
      <p>
        We use essential cookies to remember user preferences (such as dismissing notification banners or cookie
        notices) and non-essential cookies for advertising and analytics. You can adjust cookie preferences at any
        time using the cookie settings banner on our website or directly through your web browser settings.
      </p>

      <h2>5. CCPA & CPRA Privacy Rights (Do Not Sell My Personal Information)</h2>
      <p>Under the California Consumer Privacy Act (CCPA), California consumers have the right to:</p>
      <ul className="my-3 ml-6 list-disc space-y-2 text-[#43605c]">
        <li>Request that a business disclose the categories and specific pieces of personal data collected.</li>
        <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
        <li>
          Request that a business that sells a consumer's personal data, not sell the consumer's personal data.
          (Note: Setwise does not sell personal data).
        </li>
      </ul>

      <h2>6. GDPR Data Protection Rights</h2>
      <p>
        We want to ensure you are fully aware of all of your data protection rights. Every user is entitled to the
        right of access, rectification, erasure, restriction of processing, objection to processing, and data
        portability under applicable regulations.
      </p>

      <h2>7. Third-Party Links & External Services</h2>
      <p>
        Our website contains links to official government and tax authority portals (such as IRS.gov and state
        Departments of Revenue) and external financial guides. If you click on a third-party link, you will be
        directed to that site. Note that these external sites are not operated by us, and we encourage you to
        review their respective privacy policies.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        Setwise does not knowingly collect any Personal Identifiable Information from children under the age of 13.
        If you believe that your child provided this kind of information on our website, please contact us
        immediately and we will do our best efforts to promptly remove such information.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions, suggestions, or concerns regarding our Privacy Policy or data practices, please
        contact us:
      </p>
      <ul className="my-3 ml-6 list-disc space-y-1 text-[#43605c]">
        <li>
          Email: <a href="mailto:hello@setwise.co">hello@setwise.co</a>
        </li>
        <li>
          Website Contact: <a href="/about">About & Contact Page</a>
        </li>
      </ul>
    </SimplePage>
  );
}
