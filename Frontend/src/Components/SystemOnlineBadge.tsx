import { useSystemOnline } from "@/hooks/useSystemOnline";

export function SystemOnlineBadge() {
  const { online, checking, refresh } = useSystemOnline();

  const label = checking ? "Checking..." : online ? "Online" : "Offline";
  const colorClass = checking
    ? "bg-zinc-500/20 text-zinc-400"
    : online
    ? "bg-green-500/20 text-green-400"
    : "bg-red-500/20 text-red-400";

  return (
    <button
      type="button"
      onClick={refresh}
      title="Click to re-check now"
      className={`text-sm px-3 py-1 rounded-full transition-colors ${colorClass}`}
    >
      System {label}
    </button>
  );
}