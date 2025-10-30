import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/api";

export type OnlineStatus = "Online" | "Offline";

async function checkHealthOnce(): Promise<OnlineStatus> {
  try {
    const res = await fetch(`${BASE}health`, { method: "GET" });
    if (!res.ok) return "Offline";

    // Try to infer from response body when available; fall back to HTTP ok
    try {
      const data = await res.json().catch(() => null as any);
      const s = data?.status ?? data?.data?.status;
      if (typeof s === "string") {
        return s.toLowerCase() === "ok" ? "Online" : "Offline";
      }
    } catch {
      // ignore JSON parse errors
    }

    return "Online";
  } catch {
    return "Offline";
  }
}

/**
 * useSystemOnline
 * - Calls /health immediately on mount
 * - Checks again every 30 minutes
 * - Exposes status and convenience booleans
 */
export function useSystemOnline() {
  const [status, setStatus] = useState<OnlineStatus | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const s = await checkHealthOnce();
      if (mounted) setStatus(s);
    };

    // Immediate
    run();

    // Every 30 minutes
    timerRef.current = window.setInterval(run, 30 * 60 * 1000);

    return () => {
      mounted = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return {
    status, // null | "Online" | "Offline"
    online: status === "Online",
    offline: status === "Offline",
    checking: status === null,
    refresh: async () => setStatus(await checkHealthOnce()),
  } as const;
}