import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DashboardSidebar } from "@/Components/DashboardSidebar";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="pl-64">
        <div className="container mx-auto p-8">
          <Outlet /> {/* children (nested pages) will render here */}
        </div>
      </main>
    </div>
  ),
});
