import { useEffect } from "react";

/**
 * Sets document.title and the <meta name="description"> tag for the current
 * page. Without this, every route inherits the single static description
 * from index.html — which looks like thin/duplicate/templated content to
 * search engines and to an AdSense reviewer, even when the underlying page
 * content is genuinely unique (as with the 51 state tax pages).
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    const previous = tag.getAttribute("content");
    tag.setAttribute("content", description);

    // Restore the default on unmount so navigating to a page that doesn't
    // call this hook doesn't keep a stale description around.
    return () => {
      if (previous) tag!.setAttribute("content", previous);
    };
  }, [title, description]);
}
