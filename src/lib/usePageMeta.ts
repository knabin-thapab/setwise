import { useEffect } from "react";

const SITE_URL = "https://tnabin.com.np";
const SITE_NAME = "Setwise";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface PageMetaOptions {
  title: string;
  description: string;
  /** The path for this route, e.g. "/state-tax/california". Used to build canonical URL and og:url. */
  path: string;
  /** Open Graph type — defaults to "website". Use "article" for blog posts. */
  ogType?: string;
}

/**
 * Sets document.title, meta description, canonical URL, Open Graph tags,
 * and Twitter Card tags for the current page.
 *
 * Previously this hook only managed title and description. The canonical
 * <link> in index.html was hardcoded to "https://tnabin.com.np/" which
 * caused every route to tell search engines it was a duplicate of the
 * homepage. This version dynamically sets the correct canonical per route.
 */
export function usePageMeta({ title, description, path, ogType = "website" }: PageMetaOptions) {
  useEffect(() => {
    // Canonical URL: trailing slash only for root
    const canonicalUrl = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    // ── Title ──
    document.title = title;

    // ── Meta Description ──
    setMeta("name", "description", description);

    // ── Canonical ──
    setLink("canonical", canonicalUrl);

    // ── Open Graph ──
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:image", DEFAULT_OG_IMAGE);

    // ── Twitter Card ──
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", DEFAULT_OG_IMAGE);
  }, [title, description, path, ogType]);
}

// ── Helpers ──

function setMeta(attr: "name" | "property", key: string, value: string) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.href = href;
}
