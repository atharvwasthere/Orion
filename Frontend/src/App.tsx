import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router"; 
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <RouterProvider router={router} />
    </div>
  );
}
