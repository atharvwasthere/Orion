import { useEffect } from "react";

/**
 * Locks body scroll while `locked` is true.
 * Adds/removes overflow-hidden on <html> and <body>.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const body = document.body;
    if (locked) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }
    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    };
  }, [locked]);
}
