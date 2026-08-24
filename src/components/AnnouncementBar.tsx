import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getNextDeadline, daysUntil } from "../lib/deadlines";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() =>
    sessionStorage.getItem("setwise_announce_dismissed") === "1"
  );

  const deadline = useMemo(() => getNextDeadline(), []);
  const days = useMemo(() => daysUntil(deadline.date), [deadline]);

  if (dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem("setwise_announce_dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="announce-bar">
      <span>
        📅 Next tax deadline: <strong>{deadline.label}</strong> ({days}d away) —{" "}
        <Link to="/#calculator">Calculate payment →</Link>
      </span>
      <button className="dismiss-btn" onClick={dismiss} aria-label="Dismiss announcement">
        ✕
      </button>
    </div>
  );
}

