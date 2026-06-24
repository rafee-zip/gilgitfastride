import { createFileRoute } from "@tanstack/react-router";
import { Utensils, FileText, Package, Pill, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Gilgit FastRide" },
      { name: "description", content: "Food, document, parcel, medicine and shopping pickup delivery in Gilgit." },
      { property: "og:title", content: "Our Services — Gilgit FastRide" },
      { property: "og:description", content: "Five delivery services, one trusted rider network." },
    ],
  }),
  component: Services,
});

const SERVICES = [
  { icon: Utensils, title: "Food Delivery", desc: "Hot meals from your favorite restaurants and bakeries — picked up and delivered safely." },
  { icon: FileText, title: "Document Delivery", desc: "Urgent papers, files and contracts between offices, schools and homes across the city." },
  { icon: Package, title: "Parcel Delivery", desc: "Small to medium parcels handled with care, door-to-door in Gilgit and nearby areas." },
  { icon: Pill, title: "Medicine Delivery", desc: "Order from any pharmacy. We pick up your prescription and bring it fast." },
  { icon: ShoppingBag, title: "Shopping Pickup", desc: "Send your shopping list — our rider buys it from the bazaar and delivers it." },
];

function Services() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Our Services</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Gilgit FastRide handles all kinds of local delivery needs for individuals and businesses.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
