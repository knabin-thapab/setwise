import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("setwise_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("setwise_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("setwise_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-bar" role="banner" aria-label="Cookie consent">
      <p className="text-xs sm:text-sm text-center sm:text-left flex-1">
        We use cookies for analytics & privacy-first experiences.
        <Link to="/privacy-policy" className="ml-1.5 font-bold">Privacy Policy</Link>
      </p>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        <button className="accept-btn flex-1 sm:flex-initial" onClick={accept}>Accept</button>
        <button className="decline-btn flex-1 sm:flex-initial" onClick={decline}>Decline</button>
      </div>
    </div>
  );
}

