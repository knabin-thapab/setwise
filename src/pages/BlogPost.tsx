import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BLOG_POSTS } from "../lib/blogData";
import { usePageMeta } from "../lib/usePageMeta";
import ResponsiveTable from "../components/ResponsiveTable";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [tableViews, setTableViews] = useState<Record<number, "card" | "table">>({});

  usePageMeta(
    post ? `${post.title} | Setwise` : "Post not found | Setwise",
    post ? post.summary : "This blog post could not be found."
  );

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: post?.title || "Setwise Tax Guide",
      text: post?.summary || "Check out this free freelancer tax guide",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error, fallback to clipboard
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard unavailable
      }
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-[800px] px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-[#102a2d]">Article Not Found</h1>
        <p className="mt-2 text-sm text-[#4b6563]">
          The blog post you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center rounded-xl bg-[#11716d] px-5 py-2.5 text-sm font-bold text-white shadow-xs"
        >
          ← Back to All Guides
        </Link>
      </main>
    );
  }

  // Find next and previous posts
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost =
    currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  return (
    <>
      {/* ─── Fixed Top Reading Progress Bar ─── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#cbd6cf]/30 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#11716d] via-[#14b8a6] to-[#6dd4c8] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="mx-auto max-w-[860px] px-3.5 py-6 sm:px-6 sm:py-12 lg:px-8 w-full overflow-x-hidden">
        {/* ─── Top Navigation & Action Bar ─── */}
        <div className="border-b border-[#cbd6cf]/60 pb-3.5 mb-6 flex items-center justify-between gap-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#11716d] hover:underline"
          >
            <span>←</span>
            <span>Back to all guides</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#20403c] shadow-2xs hover:border-[#11716d] hover:bg-[#eaf4ef] active:scale-95 transition"
            >
              <span>🔗</span>
              <span>{copied ? "Link Copied!" : "Share Guide"}</span>
            </button>
          </div>
        </div>

        {/* ─── Article Header ─── */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf3ee] px-2.5 py-1 text-xs font-black text-[#11716d]">
              <span>{post.coverIcon}</span>
              <span>{post.category}</span>
            </span>
            <span className="text-xs text-[#708d87] font-semibold">
              📅 {post.date}
            </span>
            <span className="text-xs text-[#708d87] font-semibold">
              · ⏱️ {post.readTimeMin} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight sm:leading-[1.15] tracking-[-0.04em] text-[#102a2d]">
            {post.title}
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed text-[#4b6563]">
            {post.summary}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#63807b] pt-2 border-t border-[#edf2ee]">
            <span className="font-semibold">✍️ By {post.author}</span>
            <span className="font-medium">Verified for 2026 Tax Year</span>
          </div>
        </header>

        {/* ─── Mobile Table of Contents Accordion ─── */}
        <div className="mb-6 sm:mb-8 rounded-2xl border border-[#cbd6cf] bg-white p-3.5 sm:p-4 shadow-2xs">
          <button
            type="button"
            onClick={() => setTocOpen((prev) => !prev)}
            className="flex w-full items-center justify-between text-left font-extrabold text-[#102a2d] text-xs sm:text-sm"
            aria-expanded={tocOpen}
          >
            <span className="flex items-center gap-2">
              <span>📑</span>
              <span>Table of Contents ({post.sections.length} sections)</span>
            </span>
            <span className="text-xs text-[#11716d] font-bold">
              {tocOpen ? "Hide ▲" : "Show ▼"}
            </span>
          </button>

          {tocOpen && (
            <div className="mt-3 pt-3 border-t border-[#edf2ee] space-y-1.5">
              {post.sections.map((section, idx) => (
                <a
                  key={idx}
                  href={`#section-${idx}`}
                  onClick={() => setTocOpen(false)}
                  className="flex items-center gap-2 py-1 px-2 rounded-lg text-xs font-semibold text-[#40605c] hover:bg-[#eaf3ee] hover:text-[#11716d] transition"
                >
                  <span className="text-[#11716d] font-bold">{idx + 1}.</span>
                  <span className="truncate">{section.heading}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ─── Key Takeaways Callout Box ─── */}
        <div className="mb-8 sm:mb-10 rounded-2xl border border-[#b8ded4] bg-gradient-to-br from-[#f0f9f6] to-[#e4f4ef] p-4 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-black text-[#0f5c59] mb-3">
            <span>💡</span>
            <span>Key Takeaways for Freelancers</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#244b46]">
            {post.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#11716d] text-[10px] font-black text-white mt-0.5">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Article Body Sections ─── */}
        <div className="space-y-8 sm:space-y-10 text-[#203b39]">
          {post.sections.map((section, sIndex) => {
            const currentMode = tableViews[sIndex] || "card";
            return (
              <section
                key={sIndex}
                id={`section-${sIndex}`}
                className="scroll-mt-16 space-y-3.5 sm:space-y-4"
              >
                <h2 className="text-lg sm:text-2xl font-black text-[#102a2d] tracking-tight leading-snug">
                  {section.heading}
                </h2>

                {section.content.map((pText, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-sm sm:text-base leading-relaxed text-[#3a5854]"
                  >
                    {pText}
                  </p>
                ))}

                {/* Tip Callout */}
                {section.tip && (
                  <div className="my-3.5 sm:my-4 rounded-xl border-l-4 border-[#11716d] bg-white p-3.5 sm:p-4 text-xs sm:text-sm text-[#264c48] shadow-2xs">
                    <p className="font-semibold leading-relaxed">
                      📌 {section.tip}
                    </p>
                  </div>
                )}

                {/* ─── Mobile-Friendly Data Table with View Switcher ─── */}
                {section.table && (
                  <div className="my-5 sm:my-8">
                    {/* Header + View Switcher */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm sm:text-lg font-black text-[#102a2d]">
                          {section.table.title}
                        </h4>
                        {section.table.subtitle && (
                          <p className="text-[11px] sm:text-xs text-[#52706b] mt-0.5">
                            {section.table.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Mobile View Mode Switcher */}
                      <div className="flex sm:hidden items-center self-start rounded-lg bg-[#e8efe9] p-0.5 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() =>
                            setTableViews((prev) => ({ ...prev, [sIndex]: "card" }))
                          }
                          className={`rounded-md px-2.5 py-1 transition ${
                            currentMode === "card"
                              ? "bg-white text-[#11716d] shadow-2xs"
                              : "text-[#557871]"
                          }`}
                        >
                          📱 Cards View
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTableViews((prev) => ({ ...prev, [sIndex]: "table" }))
                          }
                          className={`rounded-md px-2.5 py-1 transition ${
                            currentMode === "table"
                              ? "bg-white text-[#11716d] shadow-2xs"
                              : "text-[#557871]"
                          }`}
                        >
                          📊 Table View
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: Mobile Vertical Cards View (Ideal for phone screens) */}
                    <div
                      className={`${
                        currentMode === "card" ? "block sm:hidden" : "hidden"
                      } space-y-3`}
                    >
                      {section.table.rows.map((row, rIdx) => {
                        const firstCol = section.table!.columns[0];
                        const titleCell = row[firstCol.key];
                        return (
                          <div
                            key={rIdx}
                            className="rounded-xl border border-[#cbd6cf] bg-white p-3.5 shadow-2xs space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-[#edf2ee] pb-2">
                              <span className="text-xs font-black text-[#102a2d]">
                                {titleCell?.text || `Item ${rIdx + 1}`}
                              </span>
                              {titleCell?.badge && (
                                <span className="rounded bg-[#dcebe4] px-1.5 py-0.5 text-[10px] font-bold text-[#11716d]">
                                  {titleCell.badge}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-1.5 pt-0.5 text-xs">
                              {section.table!.columns.slice(1).map((col) => {
                                const cell = row[col.key];
                                if (!cell) return null;
                                return (
                                  <div
                                    key={col.key}
                                    className="flex items-start justify-between gap-3 py-1 border-b border-[#f3f7f4] last:border-0"
                                  >
                                    <span className="text-[11px] font-bold text-[#62857e]">
                                      {col.header}:
                                    </span>
                                    <div className="text-right">
                                      <span
                                        className={`${
                                          cell.bold
                                            ? "font-extrabold text-[#102a2d]"
                                            : "font-semibold text-[#284945]"
                                        } ${col.highlight ? "text-[#11716d]" : ""}`}
                                      >
                                        {cell.text}
                                      </span>
                                      {cell.badge && (
                                        <span className="ml-1.5 rounded bg-[#dcebe4] px-1.5 py-0.5 text-[10px] font-bold text-[#11716d]">
                                          {cell.badge}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mode 2: Standard Horizontal Table View */}
                    <div
                      className={
                        currentMode === "table" ? "block" : "hidden sm:block"
                      }
                    >
                      <ResponsiveTable>
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                          <thead className="bg-[#f0f5f1] border-b border-[#cbd6cf] text-[#102a2d] font-extrabold">
                            <tr>
                              {section.table.columns.map((col) => (
                                <th
                                  key={col.key}
                                  className={`p-3 sm:p-4 ${
                                    col.align === "center"
                                      ? "text-center"
                                      : col.align === "right"
                                      ? "text-right"
                                      : "text-left"
                                  } ${col.highlight ? "text-[#11716d]" : ""}`}
                                >
                                  {col.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e8efe9] text-[#2d4945]">
                            {section.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={
                                  rIdx % 2 === 1
                                    ? "bg-[#fafcfb]"
                                    : "bg-white hover:bg-[#f3f8f5] transition-colors"
                                }
                              >
                                {section.table!.columns.map((col) => {
                                  const cell = row[col.key];
                                  if (!cell)
                                    return (
                                      <td key={col.key} className="p-3 sm:p-4">
                                        -
                                      </td>
                                    );
                                  return (
                                    <td
                                      key={col.key}
                                      className={`p-3 sm:p-4 ${
                                        col.align === "center"
                                          ? "text-center"
                                          : col.align === "right"
                                          ? "text-right"
                                          : "text-left"
                                      } ${
                                        cell.bold
                                          ? "font-bold text-[#102a2d]"
                                          : ""
                                      } ${
                                        col.highlight
                                          ? "text-[#11716d] font-semibold"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span>{cell.text}</span>
                                        {cell.badge && (
                                          <span className="rounded bg-[#dcebe4] px-1.5 py-0.5 text-[10px] font-bold text-[#11716d]">
                                            {cell.badge}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </ResponsiveTable>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* ─── Share and Save Bar ─── */}
        <div className="mt-10 rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="text-center sm:text-left">
            <p className="font-extrabold text-[#102a2d]">
              Found this guide helpful?
            </p>
            <p className="text-[#557871] mt-0.5">
              Share it with other 1099 contractors and solopreneurs.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={copyUrl}
              className="inline-flex items-center gap-1 rounded-full border border-[#cbd6cf] bg-[#f7faf8] px-3.5 py-2 font-bold text-[#102a2d] hover:bg-[#edf4ef] active:scale-95 transition"
            >
              <span>📋</span>
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#cbd6cf] bg-[#f7faf8] px-3.5 py-2 font-bold text-[#102a2d] hover:bg-[#edf4ef] active:scale-95 transition"
            >
              <span>𝕏</span>
              <span>Post</span>
            </a>
          </div>
        </div>

        {/* ─── Contextual Calculator Tool CTA ─── */}
        <div className="mt-8 rounded-2xl border border-[#cbd6cf] bg-gradient-to-br from-white to-[#edf7f3] p-5 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="text-xs font-bold text-[#11716d]">
              Recommended Free Tool:
            </span>
            <h3 className="text-base sm:text-xl font-black text-[#102a2d] mt-1">
              {post.relatedTool.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#52706b] mt-0.5">
              Get instant calculations tailored to your freelance income and state.
            </p>
          </div>
          <Link
            to={post.relatedTool.path}
            className="w-full sm:w-auto text-center shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#11716d] px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#0e5f5c] active:scale-95 transition"
          >
            <span>{post.relatedTool.icon}</span>
            <span>Launch Tool</span>
            <span>→</span>
          </Link>
        </div>

        {/* ─── Previous / Next Navigation ─── */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-[#cbd6cf]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="flex flex-col p-3.5 sm:p-4 rounded-xl border border-[#cbd6cf] bg-white hover:border-[#11716d] active:scale-98 transition shadow-2xs group"
            >
              <span className="text-[11px] font-bold text-[#71918a]">
                ← Previous Guide
              </span>
              <span className="text-xs sm:text-sm font-black text-[#102a2d] group-hover:text-[#11716d] transition-colors mt-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="flex flex-col p-3.5 sm:p-4 rounded-xl border border-[#cbd6cf] bg-white hover:border-[#11716d] active:scale-98 transition shadow-2xs group text-left sm:text-right sm:ml-auto w-full"
            >
              <span className="text-[11px] font-bold text-[#71918a]">
                Next Guide →
              </span>
              <span className="text-xs sm:text-sm font-black text-[#102a2d] group-hover:text-[#11716d] transition-colors mt-1">
                {nextPost.title}
              </span>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

