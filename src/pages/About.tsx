import SimplePage from "../components/SimplePage";
import { usePageMeta } from "../lib/usePageMeta";

export default function About() {
  usePageMeta({
    title: "About Setwise | Free Freelancer Tax Tools",
    description: "Setwise builds free, browser-based tax and money tools for US freelancers and independent contractors — no signup, no data collection.",
    path: "/about",
  });
  return (
    <SimplePage eyebrow="ABOUT" title="Why we built this">
      <p>
        Setwise started from a simple frustration: freelancers and gig workers need a fast, honest answer
        to "how much should I set aside for taxes this quarter?" — and most existing tools either bury
        that answer behind a signup wall, or live inside expensive accounting software built for people
        who already have a bookkeeper.
      </p>
      <p>
        We built a single, focused calculator that runs entirely in your browser, gives you a clear
        number in under a minute, and explains the math instead of hiding it.
      </p>

      <h2>The backstory</h2>
      <p>
        I'm Nabin — I started freelancing in 2023 and my first tax season was a wake-up call. I owed
        more than I expected, got hit with an underpayment penalty, and spent way too many hours
        trying to figure out how quarterly estimated taxes actually work. Every calculator I found
        was either behind a paywall, asked for my email before showing results, or gave me numbers
        without explaining how they got there.
      </p>
      <p>
        So I built the tool I wish I'd had. No accounts, no upsells, no data collection — just a clear
        estimate with the math shown in plain English. Setwise is the product of that frustration, and
        I'm committed to keeping it free and honest.
      </p>

      <h2>Who we are</h2>
      <p>
        Setwise is an independent project, not a bank, accounting firm, or law firm. We are not a
        licensed tax advisor or CPA. This tool provides estimates for informational purposes only —
        always confirm your specific situation with a licensed tax professional, especially if your
        income, deductions, or filing situation is complex.
      </p>

      <h2>How we make money</h2>
      <p>
        This tool is free to use, with no account required. We support the site through display
        advertising and occasional relevant partner links. We do not sell your data — we don't collect it
        in the first place, since every calculation happens locally in your browser.
      </p>

      <h2>Get in touch</h2>
      <p>
        Have feedback, found a bug, or want to collaborate? Reach out at{" "}
        <a href="mailto:hello@setwise.co">hello@setwise.co</a> — I read every message.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href="https://twitter.com/setwiseco"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#b8c5bd] px-4 py-2 text-sm font-bold text-[#264549] transition hover:border-[#0b6664] hover:text-[#0b6664]"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter / X
        </a>
        <a
          href="https://github.com/setwise"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#b8c5bd] px-4 py-2 text-sm font-bold text-[#264549] transition hover:border-[#0b6664] hover:text-[#0b6664]"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
      </div>
    </SimplePage>
  );
}
