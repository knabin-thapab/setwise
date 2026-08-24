import { useEffect, useRef } from "react";

/**
 * Injects a <script type="application/ld+json"> element into <head> with
 * the given structured data object. Removes it on unmount or when `data`
 * changes. Pass `null` to skip injection.
 */
export function useStructuredData(data: object | null) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Clean up any previous script
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    if (!data) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [data]);
}
