import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS, BlogPost } from "../lib/blogData";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] = useState(false);

  useEffect(() => {
    document.title = "Freelancer Tax & Finance Guides & Blog | Setwise";
    let __metaDesc = document.querySelector('meta[name="description"]');
    if (!__metaDesc) {
      __metaDesc = document.createElement("meta");
      __metaDesc.setAttribute("name", "description");
      document.head.appendChild(__metaDesc);
    }
    __metaDesc.setAttribute("content", "Free guides on 1099 quarterly taxes, self-employment tax, mileage deductions, retirement plans, and S-Corp savings for US freelancers and independent contractors.");
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: BLOG_POSTS.length };
    BLOG_POSTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const checkCategoryScroll = () => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setCanScrollCategoriesRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkCategoryScroll();
    window.addEventListener("resize", checkCategoryScroll);
    return () => window.removeEventListener("resize", checkCategoryScroll);
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCat =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchSearch =
        !search.trim() ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.summary.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <main className="mx-auto max-w-[1100px] px-3.5 py-6 sm:px-6 sm:py-12 lg:px-8 w-full overflow-x-hidden">
      {/* ─── Header ─── */}
      <div className="border-b border-[#cbd6cf]/70 pb-5 sm:pb-6 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow text-[11px] sm:text-xs">KNOWLEDGE BASE & GUIDES</span>
          <span className="rounded-full bg-[#11716d]/10 px-2.5 py-0.5 text-[11px] font-extrabold text-[#11716d]">
            2026 Tax Rules
          </span>
          <span className="rounded-full bg-[#eef4f0] px-2 py-0.5 text-[10px] font-bold text-[#557872] hidden sm:inline">
            5 In-Depth Guides
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em] text-[#102a2d] leading-tight">
          Freelancer Tax & Finance Guides
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#4b6563] max-w-2xl leading-relaxed">
          Clear, zero-jargon guides and data tables to help independent contractors, solopreneurs, and 1099 workers save thousands on taxes.
        </p>

        {/* Quick Guide Fast-Links (Mobile Optimized) */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2 text-xs">
          <Link
            to="/how-estimated-taxes-work"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#bce0d6] bg-[#eef7f4] px-3 py-1.5 font-bold text-[#11716d] hover:bg-[#dff1ec] transition active:scale-95"
          >
            <span>📖</span>
            <span>How Estimated Taxes Work</span>
            <span>→</span>
          </Link>
          <Link
            to="/state-tax"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbd6cf] bg-white px-3 py-1.5 font-bold text-[#355550] hover:bg-[#f1f6f2] transition active:scale-95"
          >
            <span>🗺️</span>
            <span>50-State Tax Guide</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* ─── Search & Category Filters ─── */}
      <div className="mb-6 sm:mb-8 space-y-3.5">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides by keyword, topic, or tag..."
            className="w-full rounded-2xl border border-[#cbd6cf] bg-white px-4 py-3 pl-11 pr-10 text-sm text-[#102a2d] placeholder-[#8a9f9c] shadow-2xs focus:border-[#11716d] focus:outline-hidden focus:ring-2 focus:ring-[#11716d]/20 transition"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#8a9f9c]">
            🔍
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#e8efe9] text-xs text-[#52716b] hover:bg-[#d6e3d9] hover:text-[#102a2d] active:scale-90 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mobile Swipeable Category Pills Bar */}
        <div className="relative -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <div
            ref={categoryScrollRef}
            onScroll={checkCategoryScroll}
            className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all select-none active:scale-95 ${
                    isSelected
                      ? "bg-[#102a2d] text-white shadow-xs"
                      : "bg-white border border-[#cbd6cf] text-[#40605c] hover:bg-[#eaf3ee] hover:border-[#11716d]/40"
                  }`}
                >
                  <span>{cat === "All" ? "All Topics" : cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#edf3ef] text-[#638780]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Indicator Gradient on Mobile */}
          {canScrollCategoriesRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-1.5 w-8 bg-gradient-to-l from-[#f1f5ee] to-transparent sm:hidden" />
          )}
        </div>

        {/* Active Filter Status & Reset */}
        {(selectedCategory !== "All" || search) && (
          <div className="flex items-center justify-between text-xs text-[#52716c] pt-1">
            <span>
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "guide" : "guides"}
              {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              {search && ` matching "${search}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearch("");
              }}
              className="font-bold text-[#11716d] hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ─── Posts Grid ─── */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cbd6cf] bg-white/80 p-8 sm:p-12 text-center shadow-xs">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="text-base sm:text-lg font-bold text-[#102a2d]">No articles found</h3>
          <p className="text-xs sm:text-sm text-[#5a7672] mt-1 max-w-sm mx-auto">
            We couldn't find any guides matching "{search}". Try searching for terms like "1099", "quarterly", "mileage", or "S-Corp".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="mt-4 inline-flex items-center rounded-xl bg-[#11716d] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0e5f5c] transition"
          >
            View all guides
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {filteredPosts.map((post: BlogPost, index) => {
            const isFeatured = index === 0 && selectedCategory === "All" && !search;
            return (
              <article
                key={post.slug}
                className={`group flex flex-col justify-between rounded-2xl border border-[#cbd6cf] bg-white p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-[#11716d]/50 transition-all ${
                  isFeatured ? "md:col-span-2 bg-gradient-to-br from-white via-white to-[#edf7f4] border-[#b4d6cd]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#eaf3ee] px-2.5 py-1 text-[11px] sm:text-xs font-extrabold text-[#11716d]">
                      <span>{post.coverIcon}</span>
                      <span>{post.category}</span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#708d87] shrink-0">
                      ⏱️ {post.readTimeMin} min read
                    </span>
                  </div>

                  <h2 className={`font-black tracking-[-0.03em] text-[#102a2d] group-hover:text-[#11716d] transition-colors ${
                    isFeatured ? "text-lg sm:text-2xl" : "text-base sm:text-xl"
                  }`}>
                    <Link to={`/blog/${post.slug}`} className="focus:outline-hidden focus:underline">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#4b6563] line-clamp-3 sm:line-clamp-none">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#f1f6f2] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#5a7b74]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#edf2ee] flex items-center justify-between text-xs">
                  <span className="text-[11px] sm:text-xs text-[#708d87]">
                    📅 {post.date}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#11716d] group-hover:underline active:scale-95 transition"
                  >
                    <span>Read full guide</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ─── Bottom Tools Banner ─── */}
      <section className="mt-10 sm:mt-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#102a2d] to-[#114b48] p-5 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="w-full md:max-w-xl text-center md:text-left">
            <span className="inline-block rounded-full bg-[#1da09a]/30 px-3 py-1 text-xs font-bold text-[#72f5ea]">
              ⚡ Setwise Calculator Suite
            </span>
            <h3 className="mt-2 text-lg sm:text-2xl font-black leading-tight">
              Calculate your 2026 quarterly tax & savings instantly
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#a2cbca]">
              100% free, private, and updated for 2026 IRS rules. No signups required.
            </p>
          </div>
          <Link
            to="/#calculator"
            className="w-full sm:w-auto text-center shrink-0 rounded-full bg-[#6dd4c8] px-6 py-3.5 text-sm font-black text-[#0c2a2b] shadow-lg hover:bg-[#8bf0e5] transition active:scale-95"
          >
            Launch 1099 Calculator →
          </Link>
        </div>
      </section>
    </main>
  );
}

