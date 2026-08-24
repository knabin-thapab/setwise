import { FormEvent, useState } from "react";

export default function NewsletterSignup({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    // In production, POST to Mailchimp/ConvertKit/Loops API here
    localStorage.setItem("setwise_newsletter_email", email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="newsletter-success justify-center text-center">
        <span className="check-circle shrink-0">✓</span>
        <span>You are in! We will remind you before each deadline.</span>
      </div>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address for deadline reminders"
        required
        style={dark ? { background: "#243f40", borderColor: "#3a5654", color: "#d6f0eb" } : undefined}
      />
      <button type="submit">Remind me</button>
    </form>
  );
}

