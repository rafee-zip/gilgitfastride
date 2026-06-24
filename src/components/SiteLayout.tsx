import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main key={pathname} className="flex-1 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}
