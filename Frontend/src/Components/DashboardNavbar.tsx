import { CompanySwitcher } from "./CompanySwitcher";
import { useSidebar } from "./SidebarContext";

export function DashboardNavbar() {
  const { isOpen, toggle, triggerRef } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Hamburger trigger for <lg */}
        <button
          id="sidebar-trigger"
          ref={triggerRef as any}
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Toggle sidebar"
          aria-controls="mobile-sidebar"
          aria-expanded={isOpen}
          onClick={toggle}
        >
          <span className="sr-only">Toggle sidebar</span>
          {/* simple hamburger icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Company switcher */}
        <div className="flex-1">
          <CompanySwitcher />
        </div>

        {/* Right actions placeholder - you can add user menu, notifications, etc. */}
        <div className="flex items-center gap-2">
          {/* Add any right-side actions here */}
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
