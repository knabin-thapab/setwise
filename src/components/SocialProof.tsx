const badges = [
  { icon: "🔒", label: "Privacy-first", sublabel: "No data leaves your device", color: "teal" },
  { icon: "⚡", label: "60-sec estimate", sublabel: "Get your number fast", color: "amber" },
  { icon: "🎯", label: "2026 tax rates", sublabel: "Always up to date", color: "rose" },
];

export default function SocialProof() {
  return (
    <div className="flex flex-col items-center gap-5 sm:gap-7 py-8 sm:py-10 text-center">
      <div>
        <p className="eyebrow">BUILT FOR INDEPENDENT WORK</p>
        <h3 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-black tracking-[-0.04em] text-[#102a2d]">
          Accurate, private, and always free.
        </h3>
        <p className="text-xs sm:text-sm font-medium text-[#58706c] mt-1 max-w-md mx-auto">
          Calculations run locally in your browser. No account needed.
        </p>
      </div>
      <div className="trust-badges">
        {badges.map((b) => (
          <div className="trust-badge" key={b.label}>
            <div className={`badge-icon ${b.color}`}>{b.icon}</div>
            <div className="text-left">
              <div className="text-[12px] sm:text-[13px] font-extrabold">{b.label}</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#6a8e87] truncate">{b.sublabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

