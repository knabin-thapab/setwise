import { useEffect, useRef } from "react";

interface AdBannerProps {
  /**
   * Google AdSense Ad Slot ID (optional for dev/placeholder, required in production once approved)
   */
  slot?: string;
  /**
   * Ad layout format
   */
  format?: "auto" | "rectangle" | "horizontal" | "leaderboard";
  /**
   * Google AdSense Client / Publisher ID (defaults to value or environment placeholder)
   */
  client?: string;
  /**
   * Custom wrapper styling
   */
  className?: string;
  /**
   * Whether to display in full width responsive layout
   */
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdBanner({
  slot,
  format = "horizontal",
  client = "ca-pub-3896962422851508",
  className = "",
  responsive = true,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Only attempt to push ad if real slot and client are configured and in browser
    if (slot && client && !isPushed.current) {
      try {
        if (typeof window !== "undefined") {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          isPushed.current = true;
        }
      } catch (err) {
        console.warn("AdSense push error or ad blocker detected:", err);
      }
    }
  }, [slot, client]);

  const isConfigured = slot && client && client !== "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <div className={`ad-wrapper my-6 flex flex-col items-center justify-center ${className}`}>
      {/* Compliant Ad Label */}
      <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8aa39e]">
        Advertisement
      </span>

      {isConfigured ? (
        <ins
          ref={adRef}
          className="adsbygoogle block overflow-hidden rounded-xl bg-white/40 shadow-xs"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      ) : (
        /* Clean fallback / preview banner prior to AdSense verification approval */
        <div
          className={`ad-slot ${format === "rectangle" ? "rectangle" : "leaderboard"} transition-all duration-300 hover:border-[#11716d]/30`}
        >
          <div className="flex flex-col items-center justify-center gap-1 p-4 text-center">
            <span className="font-mono text-xs font-semibold text-[#6f8b85]">
              Google AdSense Space {format === "rectangle" ? "(300×250 / Auto)" : "(728×90 / Responsive)"}
            </span>
            <span className="text-[11px] text-[#93aba5]">
              Ads will serve here automatically once AdSense approval is verified
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
