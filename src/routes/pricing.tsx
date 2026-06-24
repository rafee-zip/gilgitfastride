import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Gilgit FastRide" },
      { name: "description", content: "Clear, simple delivery charges within Gilgit city, outside city and for urgent deliveries." },
      { property: "og:title", content: "Pricing — Gilgit FastRide" },
      { property: "og:description", content: "Transparent delivery prices for Gilgit and surrounding areas." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const { data, isLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_settings").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Simple, fair pricing</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Set rates by zone. Pay the rider on delivery or transfer in advance.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-muted" />
              ))
            : (data ?? []).map((p) => (
                <div
                  key={p.key}
                  className={`relative overflow-hidden rounded-2xl border p-6 shadow-soft ${
                    p.key === "urgent"
                      ? "border-primary bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  {p.key === "urgent" && (
                    <Zap className="absolute right-4 top-4 h-5 w-5 opacity-80" />
                  )}
                  <div className="text-sm font-medium uppercase tracking-wider opacity-80">
                    {p.label}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">Rs. {Number(p.price).toFixed(0)}</span>
                    {p.key === "urgent" && <span className="text-sm opacity-80">extra</span>}
                  </div>
                  <p className={`mt-3 text-sm ${p.key === "urgent" ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                    {p.description}
                  </p>
                </div>
              ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Final price may vary for unusually heavy or oversized items. Confirmed at pickup.
        </p>
      </section>
    </SiteLayout>
  );
}
