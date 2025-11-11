import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/Components/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <DashboardLayout>
      <Outlet /> {/* children (nested pages) will render here */}
    </DashboardLayout>
  ),
});
