import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle, Instagram, Facebook } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { OWNER } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Gilgit FastRide" },
      { name: "description", content: "Call, WhatsApp or email Gilgit FastRide for delivery booking and support." },
      { property: "og:title", content: "Contact Gilgit FastRide" },
      { property: "og:description", content: "Get in touch with our team in Gilgit." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Contact us</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Need help with an order or want to discuss a business account? We're here.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <ContactCard icon={Phone} title="Phone" value={OWNER.phone} href={`tel:${OWNER.phone}`} accent="Call us 9am — 9pm" />
          <ContactCard icon={MessageCircle} title="WhatsApp" value={OWNER.phone} href={`https://wa.me/${OWNER.whatsapp}`} accent="Tap to chat" external />
          <ContactCard icon={Mail} title="Email" value={OWNER.email} href={`mailto:${OWNER.email}`} accent="We reply within a day" />
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Follow us</div>
            <div className="mt-4 flex gap-3">
              <a href={OWNER.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium hover:bg-accent">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a href={OWNER.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium hover:bg-accent">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactCard({ icon: Icon, title, value, href, accent, external }: {
  icon: typeof Phone; title: string; value: string; href: string; accent: string; external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{accent}</div>
    </a>
  );
}
