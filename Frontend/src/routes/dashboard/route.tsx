import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DashboardSidebar } from "@/Components/DashboardSidebar";
import { CompanySwitcher } from "@/Components/CompanySwitcher";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="pl-64">
        {/* Header with Company Switcher */}
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-muted-foreground">Active Company:</h2>
              <CompanySwitcher />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto p-8">
          <Outlet /> {/* children (nested pages) will render here */}
        </div>
      </main>
    </div>
  ),
});
