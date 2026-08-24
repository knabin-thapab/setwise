import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import CookieConsent from "./CookieConsent";

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const handleDropdownEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setToolsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 220); // Smooth 220ms grace window
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 100% Rock-solid background scroll lock (prevents iOS/Android background scroll leak)
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.touchAction = "none";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileOpen]);

  // Close mobile nav on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Close mobile nav automatically on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavClick = (to: string) => {
    if (to === "/#calculator") {
      if (location.pathname === "/") {
        const el = document.getElementById("calculator");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else if (to === location.pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toolsLinks = [
    {
      title: "1099 Tax Calculator",
      desc: "Federal & state quarterly estimates",
      to: "/#calculator",
      icon: "🧮",
      badge: "2026",
    },
    {
      title: "Mileage Deduction Calculator",
      desc: "2026 IRS standard rate write-off",
      to: "/mileage-calculator",
      icon: "🚗",
      badge: "$0.725/mi",
    },
    {
      title: "1099 vs. W-2 Job Comparison",
      desc: "Side-by-side take-home & breakeven",
      to: "/1099-vs-w2-calculator",
      icon: "⚖️",
      badge: "Compare",
    },
    {
      title: "Retirement Calculator",
      desc: "SEP-IRA vs. Solo 401(k) limits",
      to: "/retirement-calculator",
      icon: "🛡️",
      badge: "Max Limits",
    },
    {
      title: "S-Corp Savings Estimator",
      desc: "Form 2553 tax savings & salary",
      to: "/s-corp-calculator",
      icon: "🏢",
      badge: "Form 2553",
    },
    {
      title: "50-State Tax Directory",
      desc: "State-by-state brackets & rates",
      to: "/state-tax",
      icon: "🗺️",
      badge: "50 States",
    },
    {
      title: "Invoice Generator",
      desc: "Client invoices + tax set-aside",
      to: "/invoice-generator",
      icon: "📄",
      badge: "Free PDF",
    },
    {
      title: "Profit Margin & Pricing",
      desc: "Real hourly wage & net income",
      to: "/profit-margin-calculator",
      icon: "📊",
      badge: "Pricing",
    },
  ];

  const resourceLinks = [
    { title: "Tax & Financial Guides & Blog", to: "/blog", icon: "📰" },
    { title: "How Estimated Taxes Work", to: "/how-estimated-taxes-work", icon: "📖" },
    { title: "Frequently Asked Questions", to: "/faq", icon: "❓" },
    { title: "About Setwise", to: "/about", icon: "ℹ️" },
    { title: "Privacy Policy", to: "/privacy-policy", icon: "🔒" },
    { title: "Terms of Service", to: "/terms-of-service", icon: "📜" },
  ];

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col bg-[#f1f5ee] text-[#102a2d] antialiased selection:bg-[#b9e2d6] w-full overflow-x-hidden">
      {/* ─── Ambient Khatra Background Mesh & Glowing Orbs ─── */}
      <div className="ambient-bg-container" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="ambient-orb ambient-orb-4" />
      </div>

      {/* Announcement Bar */}
      <div className="relative z-50">
        <AnnouncementBar />
      </div>

      {/* Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#c8d5cc]/40 bg-[#f1f5ee]/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            className="flex items-center gap-2 text-[21px] sm:text-[23px] font-black tracking-[-0.06em] text-[#102a2d] hover:opacity-90 transition-opacity"
            to="/"
            onClick={() => handleNavClick("/")}
            aria-label="Setwise home"
          >
            <img src="/logo.svg" alt="" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 object-contain drop-shadow-xs" />
            <span className="leading-none">Setwise<span className="text-[#11716d]">.</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 text-sm font-bold text-[#3f5757] md:flex lg:gap-6">
            {/* Tools Dropdown */}
            <div
              ref={dropdownRef}
              className="relative py-1"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setToolsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer select-none ${
                  toolsDropdownOpen || toolsLinks.some((t) => location.pathname === t.to)
                    ? "bg-[#e2ece4] text-[#11716d] font-black shadow-2xs"
                    : "text-[#3f5757] hover:bg-[#e7eee8] hover:text-[#11716d]"
                }`}
                aria-expanded={toolsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Calculators & Tools</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${
                    toolsDropdownOpen ? "rotate-180 text-[#11716d]" : "text-[#708c85]"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Mega Dropdown Menu with Seamless Invisible Hit Bridge */}
              {toolsDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[620px] z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  {/* Invisible Bridge Pseudo-Area to prevent hover loss */}
                  <div className="rounded-2xl border border-[#cbd6cf] bg-white/98 backdrop-blur-xl p-4 shadow-2xl">
                    <div className="grid grid-cols-2 gap-2">
                      {toolsLinks.map((tool) => {
                        const isActive = location.pathname === tool.to;
                        return (
                          <Link
                            key={tool.title}
                            to={tool.to}
                            onClick={() => {
                              setToolsDropdownOpen(false);
                              handleNavClick(tool.to);
                            }}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition text-left group border ${
                              isActive
                                ? "bg-[#eaf4ef] border-[#11716d]/30"
                                : "border-transparent hover:border-[#d2e0d7] hover:bg-[#f3f7f4]"
                            }`}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf3ee] text-base group-hover:scale-110 group-hover:bg-white shadow-2xs transition-all">
                              {tool.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[13px] font-extrabold text-[#102a2d] group-hover:text-[#11716d] transition-colors">
                                  {tool.title}
                                </span>
                                <span className="text-[9px] font-bold rounded-md bg-[#dcebe4] px-1.5 py-0.5 text-[#11716d] shrink-0">
                                  {tool.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6a8e87] truncate mt-0.5 leading-tight">
                                {tool.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Mega Menu Footer Strip */}
                    <div className="mt-3 pt-2.5 border-t border-[#edf2ee] flex items-center justify-between px-1 text-[11px] text-[#6a8e87]">
                      <span className="flex items-center gap-1 font-semibold text-[#11716d]">
                        <span>🔒</span>
                        <span>100% Private · No Login Required</span>
                      </span>
                      <span className="font-bold text-[#102a2d]">
                        2026 IRS Rules Applied
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/state-tax"
              onClick={() => handleNavClick("/state-tax")}
              className={`transition-colors ${
                location.pathname.startsWith("/state-tax")
                  ? "text-[#11716d] font-extrabold"
                  : "hover:text-[#11716d]"
              }`}
            >
              State Taxes
            </Link>

            <Link
              to="/blog"
              onClick={() => handleNavClick("/blog")}
              className={`transition-colors ${
                location.pathname.startsWith("/blog")
                  ? "text-[#11716d] font-extrabold"
                  : "hover:text-[#11716d]"
              }`}
            >
              Blog
            </Link>

            <Link
              to="/how-estimated-taxes-work"
              onClick={() => handleNavClick("/how-estimated-taxes-work")}
              className={`transition-colors ${
                location.pathname === "/how-estimated-taxes-work"
                  ? "text-[#11716d] font-extrabold"
                  : "hover:text-[#11716d]"
              }`}
            >
              Guide
            </Link>

            <Link
              to="/faq"
              onClick={() => handleNavClick("/faq")}
              className={`transition-colors ${
                location.pathname === "/faq"
                  ? "text-[#11716d] font-extrabold"
                  : "hover:text-[#11716d]"
              }`}
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              className="hidden rounded-full bg-[#11716d] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#11716d]/20 transition hover:bg-[#0e5f5c] hover:shadow-lg sm:inline-flex"
              to="/#calculator"
              onClick={() => handleNavClick("/#calculator")}
            >
              Calculate free
            </Link>

            {/* Real App-Like Mobile Hamburger / Toggle Button */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-[#cbd6cf] text-[#264549] shadow-xs transition hover:bg-[#e6ece4] active:scale-90 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M1 2h18M1 8h18M1 14h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── REAL NATIVE APP-LIKE MOBILE NAV DRAWER ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Blur Overlay with Touch Prevention */}
          <div
            className="mobile-nav-overlay fixed inset-0 bg-[#102a2d]/60 backdrop-blur-md transition-opacity"
            onClick={() => setMobileOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <aside
            className="mobile-nav-panel fixed top-0 right-0 bottom-0 w-[320px] max-w-[88vw] bg-[#f5f7f2] shadow-2xl flex flex-col z-50 overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#dce5df] bg-white/70 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="" className="h-6 w-6 shrink-0 object-contain" />
                <span className="text-[20px] font-black tracking-[-0.06em] text-[#102a2d] leading-none">
                  Setwise<span className="text-[#11716d]">.</span>
                </span>
                <span className="ml-1 rounded-full bg-[#dcf0ea] px-2 py-0.5 text-[10px] font-black text-[#11716d]">
                  2026
                </span>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8efe9] text-[#40605c] hover:bg-[#d8e4db] hover:text-[#102a2d] transition"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 -webkit-overflow-scrolling-touch overscroll-contain">
              {/* Tools Section */}
              <div>
                <p className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#6a8e87] mb-2">
                  Financial Calculators & Tools
                </p>
                <div className="space-y-1.5">
                  {toolsLinks.map((tool) => {
                    const isActive = location.pathname === tool.to || (tool.to === "/#calculator" && location.pathname === "/");
                    return (
                      <Link
                        key={tool.title}
                        to={tool.to}
                        onClick={() => {
                          setMobileOpen(false);
                          handleNavClick(tool.to);
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${isActive
                            ? "bg-white border-[#11716d]/40 shadow-xs text-[#11716d]"
                            : "bg-white/60 border-[#dce5df] text-[#264549] hover:bg-white hover:border-[#11716d]/30"
                          }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf3ee] text-base">
                          {tool.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[13px] font-extrabold truncate text-[#102a2d]">
                              {tool.title}
                            </span>
                            <span className="shrink-0 text-[9px] font-bold rounded-md bg-[#dcebe4] px-1.5 py-0.5 text-[#11716d]">
                              {tool.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6a8e87] truncate">
                            {tool.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Resources & Information Section */}
              <div>
                <p className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#6a8e87] mb-2">
                  Guides & Info
                </p>
                <div className="rounded-xl border border-[#dce5df] bg-white/70 divide-y divide-[#eef2ea] overflow-hidden">
                  {resourceLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        setMobileOpen(false);
                        handleNavClick(item.to);
                      }}
                      className="flex items-center justify-between px-3.5 py-2.5 text-[13px] font-bold text-[#2b4b47] hover:bg-[#f1f6f1] transition"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.title}</span>
                      </span>
                      <span className="text-xs text-[#95aba5]">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Fixed Bottom CTA */}
            <div className="p-4 border-t border-[#dce5df] bg-white/80 backdrop-blur-md shrink-0 space-y-2">
              <Link
                to="/#calculator"
                onClick={() => {
                  setMobileOpen(false);
                  handleNavClick("/#calculator");
                }}
                className="flex items-center justify-center gap-2 rounded-full bg-[#11716d] py-3.5 px-4 text-center font-extrabold text-white text-sm shadow-md shadow-[#11716d]/20 active:scale-98 transition"
              >
                <span>Calculate Your Tax Free</span>
                <span>→</span>
              </Link>
              <p className="text-center text-[10px] font-medium text-[#7a938e]">
                100% Private · No Email or Account Needed
              </p>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 w-full min-w-0 flex flex-col">
        {children}
      </div>

      {/* ─── Rich Footer ─── */}
      <footer className="rich-footer">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:py-14 lg:px-8">
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2 text-[22px] font-black tracking-[-0.06em] text-white">
                <img src="/logo.svg" alt="" className="h-6 w-6 shrink-0 object-contain brightness-110" />
                <span className="leading-none">Setwise<span className="text-[#6dd4c8]">.</span></span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#8db5ae]">
                Free quarterly tax estimates and financial tools for freelancers. No signup, no data collection, no BS.
              </p>
              <div className="footer-social mt-5">
                <a href="https://twitter.com/setwiseco" target="_blank" rel="noreferrer" aria-label="Twitter / X">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://github.com/setwise" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="mailto:hello@setwise.co" aria-label="Email">
                  <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product links */}
            <div>
              <p className="footer-heading">Tools & Calculators</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/#calculator" onClick={() => handleNavClick("/#calculator")}>1099 Quarterly Tax</Link>
                <Link to="/mileage-calculator" onClick={() => handleNavClick("/mileage-calculator")}>Mileage Deduction ($0.725/mi)</Link>
                <Link to="/1099-vs-w2-calculator" onClick={() => handleNavClick("/1099-vs-w2-calculator")}>1099 vs. W-2 Comparison</Link>
                <Link to="/retirement-calculator" onClick={() => handleNavClick("/retirement-calculator")}>SEP-IRA vs. Solo 401(k)</Link>
                <Link to="/s-corp-calculator" onClick={() => handleNavClick("/s-corp-calculator")}>S-Corp Tax Estimator</Link>
                <Link to="/profit-margin-calculator" onClick={() => handleNavClick("/profit-margin-calculator")}>Profit Margin & Pricing</Link>
                <Link to="/invoice-generator" onClick={() => handleNavClick("/invoice-generator")}>Invoice Generator</Link>
                <Link to="/state-tax" onClick={() => handleNavClick("/state-tax")}>50-State Tax Directory</Link>
              </div>
            </div>

            {/* Legal links */}
            <div>
              <p className="footer-heading">Guides & Legal</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/blog" onClick={() => handleNavClick("/blog")}>Tax & Financial Blog</Link>
                <Link to="/how-estimated-taxes-work" onClick={() => handleNavClick("/how-estimated-taxes-work")}>How Estimated Taxes Work</Link>
                <Link to="/faq" onClick={() => handleNavClick("/faq")}>Frequently Asked Questions</Link>
                <Link to="/privacy-policy" onClick={() => handleNavClick("/privacy-policy")}>Privacy Policy</Link>
                <Link to="/terms-of-service" onClick={() => handleNavClick("/terms-of-service")}>Terms of Service</Link>
                <Link to="/disclaimer" onClick={() => handleNavClick("/disclaimer")}>Disclaimer</Link>
                <Link to="/about" onClick={() => handleNavClick("/about")}>About & Contact</Link>
              </div>
            </div>

            {/* IRS Resources */}
            <div>
              <p className="footer-heading">IRS Resources</p>
              <div className="flex flex-col gap-2 text-sm">
                <a href="https://www.irs.gov/payments/direct-pay" target="_blank" rel="noreferrer">
                  IRS Direct Pay ↗
                </a>
                <a href="https://www.irs.gov/forms-pubs/about-form-1040-es" target="_blank" rel="noreferrer">
                  Form 1040-ES ↗
                </a>
                <a href="https://www.irs.gov/payments/eftps-the-electronic-federal-tax-payment-system" target="_blank" rel="noreferrer">
                  EFTPS Portal ↗
                </a>
                <a href="https://www.irs.gov/pub/irs-pdf/p560.pdf" target="_blank" rel="noreferrer">
                  IRS Pub 560 (Retirement) ↗
                </a>
                <a href="https://www.irs.gov/forms-pubs/about-form-2553" target="_blank" rel="noreferrer">
                  IRS Form 2553 (S-Corp) ↗
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom mt-10">
            <p>© {new Date().getFullYear()} Setwise · Federal & state estimates for independent work.</p>
            <p className="text-xs text-[#526967]">
              Not tax advice. Consult a licensed CPA for your specific situation.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        className={`back-to-top ${showTop ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
}

