import React, { Suspense } from "react";
import "../index.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
