import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";

type Tab = {
  href: string;
  label: string;
};

const TABS: Tab[] = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/faqs", label: "FAQ" },
  { href: "/dashboard/conversations", label: "Chats" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Settings" },
];

function isActive(href: string, currentPath: string) {
  if (!currentPath) return false;
  // Consider it active if the current path starts with the tab route
  return currentPath === href || currentPath.startsWith(href + "/");
}

/**
 * Bottom tab bar for small phones. Hidden above 640px (sm) and on lg+.
 * Respects safe area and provides visible focus rings + aria-current.
 */
export function MobileTabs() {
  const { location } = useRouterState();
  const currentPath = location.pathname;

  return (
    <nav
      aria-label="Bottom"
      className="sm:hidden fixed bottom-0 inset-x-0 h-14 border-t bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 z-40 px-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" } as React.CSSProperties}
    >
      <ul className="flex w-full items-stretch justify-between gap-1">
        {TABS.map((tab) => {
          const active = isActive(tab.href, currentPath);
          return (
            <li key={tab.href} className="min-w-0 flex-1">
              <Link
                to={tab.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group flex h-11 w-full items-center justify-center rounded-md text-xs font-medium",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
                  active
                    ? "text-primary dark:text-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <span className="leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileTabs;
