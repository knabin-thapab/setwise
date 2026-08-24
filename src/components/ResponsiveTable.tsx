import { ReactNode, useRef, useState, useEffect } from "react";

export interface ResponsiveTableProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function ResponsiveTable({
  title,
  subtitle,
  children,
  className = "",
}: ResponsiveTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  return (
    <div className={`my-6 sm:my-8 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h4 className="text-base sm:text-lg font-black text-[#102a2d]">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#52706b] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Mobile Swipe / Scroll Hint */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-2 px-0.5">
        <div className="table-mobile-indicator">
          <span>↔</span>
          <span>Swipe horizontally to view full table</span>
        </div>
        {canScrollRight && (
          <span className="text-[11px] font-bold text-[#11716d] animate-pulse">
            More columns →
          </span>
        )}
      </div>

      {/* Responsive Container with dynamic scroll edge shadows */}
      <div className="relative rounded-2xl border border-[#cbd6cf] bg-white shadow-xs overflow-hidden">
        {/* Left Scroll Indicator Shadow */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#102a2d]/10 to-transparent z-10 sm:hidden" />
        )}

        {/* Right Scroll Indicator Shadow */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#102a2d]/15 to-transparent z-10 sm:hidden" />
        )}

        <div
          ref={scrollRef}
          className="table-responsive-container overflow-x-auto w-full overscroll-x-contain touch-pan-x"
        >
          <div className="min-w-[500px] sm:min-w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

