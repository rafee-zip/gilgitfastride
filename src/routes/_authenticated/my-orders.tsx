import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/_authenticated/my-orders")({
  head: () => ({ meta: [{ title: "My Orders — Gilgit FastRide" }] }),
  component: MyOrders,
});

const STATUS_META: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
  pending: { label: "Pending", icon: Clock, cls: "bg-warning/15 text-warning" },
  accepted: { label: "Accepted", icon: CheckCircle2, cls: "bg-primary/15 text-primary" },
  in_progress: { label: "On the way", icon: Truck, cls: "bg-primary/15 text-primary" },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-success/15 text-success" },
  rejected: { label: "Rejected", icon: XCircle, cls: "bg-destructive/15 text-destructive" },
  cancelled: { label: "Cancelled", icon: XCircle, cls: "bg-muted text-muted-foreground" },
};

function MyOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">My Orders</h1>
        <p className="mt-2 text-muted-foreground">Track every delivery you've booked with Gilgit FastRide.</p>

        <div className="mt-8 space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
          {!isLoading && (!data || data.length === 0) && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
            </div>
          )}
          {data?.map((o) => {
            const meta = STATUS_META[o.status] ?? STATUS_META.pending;
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm font-semibold text-primary">{o.order_code}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()} • {o.service_type}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}>
                    <meta.icon className="h-3 w-3" /> {meta.label}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Row label="Pickup">{o.pickup_address}</Row>
                  <Row label="Drop-off">{o.delivery_address}</Row>
                  <Row label="Item">{o.item_description}</Row>
                  <Row label="Estimated">Rs. {o.estimated_price ?? "—"}</Row>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm text-foreground whitespace-pre-wrap">{children}</div>
    </div>
  );
}
