import { Link } from "react-router-dom";
import { useStructuredData } from "../lib/useStructuredData";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Renders visible breadcrumb navigation and injects BreadcrumbList
 * structured data as JSON-LD. The last item is shown as plain text
 * (current page), all others are links.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `https://tnabin.com.np${item.href}`,
    })),
  };

  useStructuredData(structuredData);

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 sm:mb-6 text-xs sm:text-sm text-[#6a8e87]"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-[#b0c4be] mx-0.5" aria-hidden="true">
                  →
                </span>
              )}
              {isLast ? (
                <span className="font-semibold text-[#40605c] truncate max-w-[200px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-[#11716d] hover:underline underline-offset-2 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
