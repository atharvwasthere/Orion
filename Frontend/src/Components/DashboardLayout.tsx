import React from "react";
import { SidebarProvider } from "./SidebarContext";
import { DesktopNav, MobileDrawer } from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import MobileTabs from "./ui/MobileTabs";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

/**
 * Responsive dashboard shell:
 * - Desktop (≥1024px): fixed left sidebar 240px
 * - Tablet (<1024px): slide-in drawer opened by hamburger
 * - Phone (≤640px): drawer + bottom tab bar
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop sidebar - fixed, hidden on <lg */}
        <DesktopNav />

        {/* Main content area - offset by sidebar on desktop */}
        <div className="lg:pl-60">
          {/* Top navbar with hamburger trigger */}
          <DashboardNavbar />

          {/* Page content - add bottom padding on small screens for tabs */}
          <main className="px-4 py-6 sm:pb-6 pb-20">
            {children}
          </main>
        </div>

        {/* Mobile drawer */}
        <MobileDrawer />

        {/* Bottom tabs for small screens */}
        <MobileTabs />
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
