import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, Loader2, CheckCircle2, XCircle, Truck, Clock, Pencil, Save, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { OWNER } from "@/components/Footer";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Gilgit FastRide" }] }),
  component: Admin,
});

type OrderRow = {
  id: string; order_code: string; user_id: string | null;
  customer_name: string; phone: string; whatsapp: string | null;
  pickup_address: string; delivery_address: string;
  item_description: string; item_value: number | null;
  delivery_instructions: string | null; preferred_time: string | null;
  service_type: string; delivery_zone: string; urgent: boolean;
  estimated_price: number | null;
  status: "pending" | "accepted" | "in_progress" | "completed" | "rejected" | "cancelled";
  admin_notes: string | null; created_at: string; updated_at: string;
};

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { navigate({ to: "/auth" }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });

  // Realtime
  useEffect(() => {
    if (!isAdmin) return;
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-orders"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isAdmin, qc]);

  const updateStatus = async (id: string, status: OrderRow["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Order ${status}`); qc.invalidateQueries({ queryKey: ["admin-orders"] }); }
  };

  if (isAdmin === null) {
    return <SiteLayout><div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></SiteLayout>;
  }
  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-20 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account isn't authorized to view the admin dashboard. Only Gilgit FastRide owners and managers can sign in here.
          </p>
        </section>
      </SiteLayout>
    );
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todaysOrders = (orders ?? []).filter((o) => new Date(o.created_at) >= today);
  const stats = {
    total: orders?.length ?? 0,
    today: todaysOrders.length,
    pending: orders?.filter((o) => o.status === "pending").length ?? 0,
    completed: orders?.filter((o) => o.status === "completed").length ?? 0,
  };

  const tabs = [
    { key: "pending", label: "Pending", data: orders?.filter((o) => o.status === "pending") ?? [] },
    { key: "active", label: "Active", data: orders?.filter((o) => o.status === "accepted" || o.status === "in_progress") ?? [] },
    { key: "completed", label: "Completed", data: orders?.filter((o) => o.status === "completed") ?? [] },
    { key: "all", label: "All", data: orders ?? [] },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Live order management for Gilgit FastRide.</p>
          </div>
          <PricingEditor />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Today's orders" value={stats.today} accent="text-primary" />
          <Stat label="Pending" value={stats.pending} accent="text-warning" />
          <Stat label="Completed" value={stats.completed} accent="text-success" />
          <Stat label="All time" value={stats.total} accent="text-foreground" />
        </div>

        <Tabs defaultValue="pending" className="mt-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label} <span className="ml-1.5 rounded-full bg-secondary px-1.5 text-xs">{t.data.length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.key} value={t.key} className="mt-4 space-y-3">
              {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
              {!isLoading && t.data.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No orders here.</div>
              )}
              {t.data.map((o) => <OrderCard key={o.id} order={o} onUpdate={updateStatus} />)}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-extrabold ${accent}`}>{value}</div>
    </div>
  );
}

function OrderCard({ order, onUpdate }: { order: OrderRow; onUpdate: (id: string, s: OrderRow["status"]) => void }) {
  const [open, setOpen] = useState(false);
  const status = order.status;
  const statusBadge: Record<string, string> = {
    pending: "bg-warning/15 text-warning",
    accepted: "bg-primary/15 text-primary",
    in_progress: "bg-primary/15 text-primary",
    completed: "bg-success/15 text-success",
    rejected: "bg-destructive/15 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
  };
  const StatusIcon = status === "completed" ? CheckCircle2 :
    status === "rejected" || status === "cancelled" ? XCircle :
    status === "in_progress" || status === "accepted" ? Truck : Clock;

  const whatsappMsg = `Hi ${order.customer_name}, this is Gilgit FastRide regarding order ${order.order_code}.`;
  const whatsappLink = order.whatsapp ? `https://wa.me/${order.whatsapp.replace(/^0/, "92").replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMsg)}` : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">{order.order_code}</span>
            {order.urgent && <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase text-warning">Urgent</span>}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleString()} • {order.service_type} • {order.delivery_zone.replace("_", " ")}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[status]}`}>
          <StatusIcon className="h-3 w-3" /> {status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div><span className="text-xs uppercase tracking-wider text-muted-foreground">Customer</span><div className="font-medium text-foreground">{order.customer_name}</div><div className="text-muted-foreground">{order.phone}</div></div>
        <div><span className="text-xs uppercase tracking-wider text-muted-foreground">Estimated</span><div className="font-semibold text-foreground">Rs. {order.estimated_price ?? "—"}</div></div>
        <div className="sm:col-span-2"><span className="text-xs uppercase tracking-wider text-muted-foreground">Item</span><div className="text-foreground">{order.item_description}</div></div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>View details</Button>
        <a href={`tel:${order.phone}`}><Button size="sm" variant="ghost"><Phone className="mr-1 h-3 w-3" />Call</Button></a>
        {whatsappLink && <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="ghost"><MessageCircle className="mr-1 h-3 w-3" />WhatsApp</Button></a>}
        <div className="ml-auto flex flex-wrap gap-2">
          {status === "pending" && <>
            <Button size="sm" onClick={() => onUpdate(order.id, "accepted")}>Accept</Button>
            <Button size="sm" variant="destructive" onClick={() => onUpdate(order.id, "rejected")}>Reject</Button>
          </>}
          {status === "accepted" && <Button size="sm" onClick={() => onUpdate(order.id, "in_progress")}>Mark on the way</Button>}
          {(status === "accepted" || status === "in_progress") && (
            <Button size="sm" variant="secondary" onClick={() => onUpdate(order.id, "completed")}>Complete</Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono">{order.order_code}</DialogTitle>
            <DialogDescription>{new Date(order.created_at).toLocaleString()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <Detail label="Customer">{order.customer_name} • {order.phone}{order.whatsapp ? ` • WA ${order.whatsapp}` : ""}</Detail>
            <Detail label="Service">{order.service_type} • {order.delivery_zone.replace("_", " ")}{order.urgent ? " • URGENT" : ""}</Detail>
            <Detail label="Pickup">{order.pickup_address}</Detail>
            <Detail label="Drop-off">{order.delivery_address}</Detail>
            <Detail label="Item">{order.item_description}</Detail>
            {order.item_value && <Detail label="Item value">Rs. {order.item_value}</Detail>}
            {order.delivery_instructions && <Detail label="Notes">{order.delivery_instructions}</Detail>}
            {order.preferred_time && <Detail label="Preferred time">{order.preferred_time}</Detail>}
            <Detail label="Estimated">Rs. {order.estimated_price ?? "—"}</Detail>
          </div>
        </DialogContent>
      </Dialog>
      <noscript>{OWNER.email}</noscript>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 whitespace-pre-wrap text-foreground">{children}</div>
    </div>
  );
}

function PricingEditor() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_settings").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) setValues(Object.fromEntries(data.map((p) => [p.key, String(p.price)])));
  }, [data]);

  const save = async () => {
    for (const k of Object.keys(values)) {
      const { error } = await supabase.from("pricing_settings").update({ price: Number(values[k]) }).eq("key", k);
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Prices updated");
    qc.invalidateQueries({ queryKey: ["pricing"] });
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="mr-1 h-3 w-3" /> Edit prices
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update delivery prices</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {data?.map((p) => (
              <div key={p.key}>
                <Label>{p.label}</Label>
                <Input type="number" value={values[p.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <Button onClick={save} className="mt-2"><Save className="mr-1 h-4 w-4" />Save</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
