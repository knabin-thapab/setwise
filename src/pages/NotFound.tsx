import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound() {
  usePageMeta({
    title: "Page Not Found | Setwise",
    description: "The page you are looking for does not exist.",
    path: "/404",
  });

  // Add noindex for 404 pages
  // (usePageMeta doesn't handle robots, so we do it manually)
  // We don't actually need this since 404 URLs won't be in the sitemap,
  // but it's a safety net.

  return (
    <main className="mx-auto w-full max-w-[700px] px-4 py-16 sm:py-24 text-center">
      <p className="text-6xl sm:text-8xl font-black tracking-[-0.08em] text-[#cbd6cf]">
        404
      </p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[#102a2d]">
        Page not found
      </h1>
      <p className="mt-3 text-base sm:text-lg leading-7 text-[#4b6563]">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-[#11716d] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#11716d]/20 transition hover:bg-[#0e5f5c]"
        >
          Go to homepage
        </Link>
        <Link
          to="/blog"
          className="text-sm font-bold text-[#11716d] underline underline-offset-4 hover:text-[#0e5f5c]"
        >
          Browse tax guides →
        </Link>
      </div>
    </main>
  );
}
