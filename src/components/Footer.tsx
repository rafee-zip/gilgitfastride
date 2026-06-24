import { Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle, Instagram, Facebook } from "lucide-react";
import { Logo } from "./Logo";

export const OWNER = {
  phone: "03496881538",
  whatsapp: "923496881538",
  email: "attahamdard97@gmail.com",
  instagram: "https://www.instagram.com/gilgitfastride?igsh=Z3o4ZjJvdjZ6NXpv",
  facebook: "https://www.facebook.com/share/1KVLq8awvU/",
};

export function Footer() {
  return (
    <footer className="mt-24 px-3 pb-6 sm:px-4">
      <div className="glass-panel mx-auto max-w-6xl rounded-3xl">
        <div className="grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Fast, reliable & affordable delivery across Gilgit-Baltistan. Food, parcels, documents, medicine and more.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="transition-colors hover:text-foreground">Our Services</Link></li>
              <li><Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link></li>
              <li><Link to="/order" className="transition-colors hover:text-foreground">Place an Order</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-foreground">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /><a href={`tel:${OWNER.phone}`} className="transition-colors hover:text-foreground">{OWNER.phone}</a></li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /><a href={`https://wa.me/${OWNER.whatsapp}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">WhatsApp Chat</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><a href={`mailto:${OWNER.email}`} className="transition-colors hover:text-foreground">{OWNER.email}</a></li>
            </ul>
            <div className="mt-4 flex gap-2.5">
              <a href={OWNER.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={OWNER.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/60 px-6 py-5 text-center text-xs text-muted-foreground sm:px-10">
          © {new Date().getFullYear()} Gilgit FastRide. Operated by Atta Ur Rehman.
        </div>
      </div>
    </footer>
  );
}
