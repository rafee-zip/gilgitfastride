import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Copy, MessageCircle, MapPin, Loader2, Zap, CreditCard } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { OWNER } from "@/components/Footer";
import { toast } from "sonner";
import { buildPaymentWhatsAppLink, DEFAULT_WHATSAPP_SETTINGS, PAYMENT_STATUS_META, type WhatsAppSettings } from "@/lib/payment";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Place an Order — Gilgit FastRide" },
      { name: "description", content: "Fill out the form to book a pickup and delivery anywhere in Gilgit." },
      { property: "og:title", content: "Place an Order — Gilgit FastRide" },
      { property: "og:description", content: "Book a rider in under a minute." },
    ],
  }),
  component: OrderPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2, "Name is required").max(80),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  pickup_address: z.string().trim().min(4, "Pickup address required").max(300),
  delivery_address: z.string().trim().min(4, "Delivery address required").max(300),
  item_description: z.string().trim().min(2, "Tell us what to deliver").max(500),
  item_value: z.string().optional(),
  delivery_instructions: z.string().max(500).optional().or(z.literal("")),
  preferred_time: z.string().max(80).optional().or(z.literal("")),
  service_type: z.string().trim().min(2, "Please choose or type a service").max(80),
  delivery_zone: z.enum(["within_city", "outside_city"]),
  urgent: z.boolean(),
});

const DEFAULT_SERVICES = [
  { value: "parcel", label: "Parcel" },
  { value: "food", label: "Food" },
  { value: "document", label: "Document" },
  { value: "medicine", label: "Medicine" },
  { value: "shopping", label: "Shopping pickup" },
] as const;

type FormState = {
  customer_name: string; phone: string; whatsapp: string;
  pickup_address: string; delivery_address: string;
  item_description: string; item_value: string;
  delivery_instructions: string; preferred_time: string;
  service_type: string;
  service_type_choice: string; // "parcel" | ... | "other"
  delivery_zone: "within_city" | "outside_city";
  urgent: boolean;
};

const INITIAL: FormState = {
  customer_name: "", phone: "", whatsapp: "",
  pickup_address: "", delivery_address: "",
  item_description: "", item_value: "",
  delivery_instructions: "", preferred_time: "",
  service_type: "parcel", service_type_choice: "parcel",
  delivery_zone: "within_city", urgent: false,
};


function OrderPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<null | {
    id: string;
    code: string;
    customer_name: string;
    phone: string;
    amount: number | null;
    detailsLink: string;
  }>(null);

  const { data: pricing } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Prefill from profile if logged in
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
      if (profile) {
        setForm((f) => ({
          ...f,
          customer_name: f.customer_name || profile.full_name || "",
          phone: f.phone || profile.phone || "",
          whatsapp: f.whatsapp || profile.whatsapp || "",
        }));
      }
    });
  }, []);

  const estimate = useMemo(() => {
    if (!pricing) return null;
    const base = pricing.find((p) => p.key === form.delivery_zone)?.price ?? 0;
    const urgent = form.urgent ? (pricing.find((p) => p.key === "urgent")?.price ?? 0) : 0;
    return Number(base) + Number(urgent);
  }, [pricing, form.delivery_zone, form.urgent]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const useGps = (field: "pickup_address" | "delivery_address") => {
    if (!navigator.geolocation) {
      toast.error("GPS not available on this device");
      return;
    }
    toast.loading("Getting your location…", { id: "gps" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss("gps");
        const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        const link = `https://www.openstreetmap.org/?mlat=${pos.coords.latitude}&mlon=${pos.coords.longitude}#map=18/${pos.coords.latitude}/${pos.coords.longitude}`;
        const prefix = field === "pickup_address" ? "Pickup at" : "Deliver to";
        update(field, `${form[field] ? form[field] + "\n" : ""}📍 ${prefix} GPS: ${coords}\n${link}`);
        toast.success("Location added");
      },
      () => { toast.dismiss("gps"); toast.error("Could not get location"); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    const payload = {
      user_id: userData.user?.id ?? null,
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || null,
      pickup_address: form.pickup_address.trim(),
      delivery_address: form.delivery_address.trim(),
      item_description: form.item_description.trim(),
      item_value: form.item_value ? Number(form.item_value) : null,
      delivery_instructions: form.delivery_instructions.trim() || null,
      preferred_time: form.preferred_time.trim() || null,
      service_type: form.service_type,
      delivery_zone: form.delivery_zone,
      urgent: form.urgent,
      estimated_price: estimate,
    };

    const { data, error } = await supabase.from("orders").insert(payload as never).select("order_code").single();
    setSubmitting(false);

    if (error) {
      toast.error("Could not submit order. Please try again.");
      console.error(error);
      return;
    }

    const code = data.order_code as string;
    const message =
      `🛵 *New Gilgit FastRide Order*\n` +
      `Order: *${code}*\n\n` +
      `👤 ${payload.customer_name}\n` +
      `📞 ${payload.phone}${payload.whatsapp ? ` (WhatsApp: ${payload.whatsapp})` : ""}\n\n` +
      `📦 Service: ${payload.service_type}\n` +
      `Zone: ${payload.delivery_zone.replace("_", " ")}${payload.urgent ? " • URGENT" : ""}\n` +
      (payload.item_value ? `Item value: Rs. ${payload.item_value}\n` : "") +
      `Estimated: Rs. ${estimate ?? "—"}\n\n` +
      `📍 *Pickup:* ${payload.pickup_address}\n` +
      `📍 *Drop-off:* ${payload.delivery_address}\n\n` +
      `🧾 Item: ${payload.item_description}\n` +
      (payload.delivery_instructions ? `📝 Notes: ${payload.delivery_instructions}\n` : "") +
      (payload.preferred_time ? `⏰ Preferred time: ${payload.preferred_time}\n` : "");

    const whatsappLink = `https://wa.me/${OWNER.whatsapp}?text=${encodeURIComponent(message)}`;
    setConfirmed({ code, whatsappLink });
    toast.success(`Order ${code} received!`);
  };

  if (confirmed) {
    return <OrderConfirmation code={confirmed.code} whatsappLink={confirmed.whatsappLink} onReset={() => { setConfirmed(null); setForm(INITIAL); }} />;
  }


  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Place your order</h1>
        <p className="mt-3 text-muted-foreground">Fill the details below — a rider will be assigned right after submission.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" required>
              <Input value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} placeholder="e.g. Ali Khan" required />
            </Field>
            <Field label="Phone number" required>
              <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="03XX XXXXXXX" required />
            </Field>
            <Field label="WhatsApp number" hint="If different from phone">
              <Input type="tel" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="03XX XXXXXXX" />
            </Field>
            <Field label="Service type" required hint="Pick one or choose Other to type your own">
              <Select
                value={form.service_type_choice}
                onValueChange={(v) => {
                  update("service_type_choice", v);
                  if (v !== "other") update("service_type", v);
                  else update("service_type", "");
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEFAULT_SERVICES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                  <SelectItem value="other">Other (type your own)</SelectItem>
                </SelectContent>
              </Select>
              {form.service_type_choice === "other" && (
                <Input
                  className="mt-2"
                  value={form.service_type}
                  onChange={(e) => update("service_type", e.target.value)}
                  placeholder="e.g. Laundry pickup, gas cylinder, gift"
                  maxLength={80}
                  required
                />
              )}
            </Field>

          </div>

          <AddressField
            label="Pickup address"
            value={form.pickup_address}
            onChange={(v) => update("pickup_address", v)}
            onGps={() => useGps("pickup_address")}
            placeholder="Street, area, landmark — e.g. NLI Market, Jutial"
          />
          <AddressField
            label="Delivery address"
            value={form.delivery_address}
            onChange={(v) => update("delivery_address", v)}
            onGps={() => useGps("delivery_address")}
            placeholder="Where should the rider drop it off?"
          />

          <Field label="Item description" required>
            <Textarea rows={3} value={form.item_description} onChange={(e) => update("item_description", e.target.value)} placeholder="What are we picking up? e.g. 1 medium box, food order from Pamir Inn" required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Item value (Rs.)" hint="Optional — for safer handling">
              <Input type="number" inputMode="numeric" min={0} value={form.item_value} onChange={(e) => update("item_value", e.target.value)} placeholder="e.g. 2500" />
            </Field>
            <Field label="Preferred delivery time" hint="Optional">
              <Input value={form.preferred_time} onChange={(e) => update("preferred_time", e.target.value)} placeholder="e.g. ASAP, or 5pm today" />
            </Field>
          </div>

          <Field label="Delivery instructions" hint="Optional">
            <Textarea rows={2} value={form.delivery_instructions} onChange={(e) => update("delivery_instructions", e.target.value)} placeholder="Gate code, who to ask for, etc." />
          </Field>

          <div className="grid gap-4 rounded-xl bg-secondary/60 p-4 sm:grid-cols-2">
            <Field label="Delivery zone">
              <Select value={form.delivery_zone} onValueChange={(v) => update("delivery_zone", v as FormState["delivery_zone"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="within_city">Within Gilgit city</SelectItem>
                  <SelectItem value="outside_city">Outside city</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between rounded-lg bg-background px-4 py-3 shadow-soft">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Zap className="h-4 w-4 text-warning" /> Urgent delivery
                </div>
                <div className="text-xs text-muted-foreground">Fastest possible — extra fee applies</div>
              </div>
              <Switch checked={form.urgent} onCheckedChange={(v) => update("urgent", v)} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
            <div className="text-sm">
              <div className="font-semibold text-foreground">Estimated price</div>
              <div className="text-xs text-muted-foreground">Final amount confirmed at pickup</div>
            </div>
            <div className="text-2xl font-extrabold text-primary">
              {estimate != null ? `Rs. ${estimate}` : "—"}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full text-base shadow-elevated">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : "Submit Order"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting you agree to be contacted by our rider on the number provided.
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-sm">
        {label} {required && <span className="text-destructive">*</span>}
        {hint && <span className="text-xs font-normal text-muted-foreground">({hint})</span>}
      </Label>
      {children}
    </div>
  );
}

function AddressField({ label, value, onChange, onGps, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; onGps: () => void; placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label} <span className="text-destructive">*</span></Label>
        <button type="button" onClick={onGps} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <MapPin className="h-3 w-3" /> Use my GPS
        </button>
      </div>
      <Textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required />
    </div>
  );
}

function OrderConfirmation({ code, whatsappLink, onReset }: { code: string; whatsappLink: string; onReset: () => void }) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(8);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (seconds <= 0) {
      navigate({ to: "/my-orders" });
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, paused, navigate]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="animate-scale-in rounded-3xl border border-border bg-card p-8 text-center shadow-elevated">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success animate-scale-in">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-foreground animate-fade-in">Order received!</h1>
          <p className="mt-2 text-muted-foreground animate-fade-in">We've notified our team. A rider will confirm shortly.</p>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-sm font-semibold text-primary animate-fade-in">
            {code}
            <button
              onClick={() => { navigator.clipboard.writeText(code); toast.success("Order ID copied"); }}
              className="text-primary/70 hover:text-primary"
              aria-label="Copy order ID"
            ><Copy className="h-4 w-4" /></button>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-12 hover-scale">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Send details on WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-12" onClick={() => { setPaused(true); onReset(); }}>
              Place another order
            </Button>
          </div>

          <div
            className="mt-8 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            Redirecting you to <span className="font-semibold text-foreground">My Orders</span> in {seconds}s…
            <button
              onClick={() => { setPaused(true); navigate({ to: "/my-orders" }); }}
              className="ml-2 font-semibold text-primary hover:underline"
            >Go now →</button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="ml-3 text-xs text-muted-foreground hover:text-foreground"
            >{paused ? "Resume" : "Pause"}</button>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${((8 - seconds) / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

