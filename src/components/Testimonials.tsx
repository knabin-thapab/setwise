const points = [
  {
    title: "Built for the actual questions freelancers ask",
    body: "Not just a number — a breakdown of self-employment tax vs. income tax, state tax, and what the safe-harbor rule means for you.",
  },
  {
    title: "Nothing leaves your browser",
    body: "No account, no email required to use the calculators. Your income figures are never sent to a server.",
  },
  {
    title: "Free, and staying free",
    body: "Supported by ads, not by charging freelancers for a number they need for free.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#e6ece4] py-12 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">WHY FREELANCERS USE THIS</p>
        <h2 className="mt-2.5 sm:mt-3 text-center text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em]">
          Built to be trusted, not just used.
        </h2>
        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <div className="testimonial-card" key={p.title}>
              <p className="trust-point-title">{p.title}</p>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-[#526967]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

