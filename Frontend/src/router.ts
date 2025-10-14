import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create the router instance from the generated route tree
export const router = createRouter({ routeTree });

// (optional, but recommended in development)
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}