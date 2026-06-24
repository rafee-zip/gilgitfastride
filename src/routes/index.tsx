import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, MapPin, Package, FileText, Pill, Utensils, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ReviewsCard } from "@/components/ReviewsCard";
import { DeliveryBackdrop } from "@/components/DeliveryBackdrop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gilgit FastRide — Fast, Reliable & Affordable Delivery" },
      { name: "description", content: "Book a rider in seconds. Food, parcels, documents, medicine and shopping delivery across Gilgit-Baltistan." },
      { property: "og:title", content: "Gilgit FastRide — Local Delivery in Gilgit-Baltistan" },
      { property: "og:description", content: "Book a rider in seconds for food, parcels, documents, medicine and shopping." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/40 via-background to-background" />
        <div className="absolute -top-24 right-0 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:grid lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Now serving across Gilgit city
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Fast, reliable &{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                affordable delivery
              </span>{" "}
              in Gilgit.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Place your order online — no need to message on WhatsApp first. We pick up food, parcels, documents, medicine and shopping, then deliver it right to the door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 shadow-elevated">
                <Link to="/order">Place Order <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              {[
                { icon: Clock, label: "30-60 min" },
                { icon: ShieldCheck, label: "Safe & insured" },
                { icon: MapPin, label: "City-wide" },
              ].map((b) => (
                <div key={b.label} className="rounded-xl border border-border bg-card p-3 text-center shadow-soft">
                  <b.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-1 text-xs font-medium text-foreground">{b.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary to-primary-glow shadow-elevated" />
              <div className="absolute inset-4 rounded-[1.75rem] bg-background/95 p-6 backdrop-blur">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Bike className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">Live</span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <Step icon={MapPin} title="Pickup" subtitle="Jutial Bazaar, Gilgit" />
                    <div className="ml-5 h-6 w-px bg-border" />
                    <Step icon={MapPin} title="Drop-off" subtitle="Konodas, Gilgit" />
                  </div>
                  <div className="mt-auto rounded-xl bg-secondary p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Estimated</span>
                      <span className="font-semibold text-foreground">Rs. 250</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>ETA</span>
                      <span className="font-semibold text-foreground">35 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Everything we deliver</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Five services, one trusted rider network.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Utensils, label: "Food" },
            { icon: FileText, label: "Documents" },
            { icon: Package, label: "Parcels" },
            { icon: Pill, label: "Medicine" },
            { icon: ShoppingBag, label: "Shopping" },
          ].map((s) => (
            <div key={s.label} className="group rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{s.label} Delivery</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-primary-foreground shadow-elevated sm:p-14">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Ready to send something?</h2>
            <p className="mt-3 text-primary-foreground/85">Fill in the order form — it takes under a minute. We'll confirm and pick up shortly.</p>
            <Button asChild size="lg" variant="secondary" className="mt-6 h-12 bg-background text-foreground hover:bg-background/90">
              <Link to="/order">Start your order <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Step({ icon: Icon, title, subtitle }: { icon: typeof MapPin; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-sm font-semibold text-foreground">{subtitle}</div>
      </div>
    </div>
  );
}
