import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut, ShieldCheck, Package } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-3 z-40 w-full px-3 sm:px-4">
      <div className="glass-nav mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 sm:h-16 sm:px-4 sm:pl-6">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 ease-[var(--ease-out-soft)] hover:bg-foreground/5 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-foreground/5 shadow-[inset_0_0_0_1px_rgb(15_23_42_/_0.06)]" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin"><ShieldCheck className="mr-1 h-4 w-4" />Admin</Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link to="/my-orders"><Package className="mr-1 h-4 w-4" />My Orders</Link>
              </Button>
              <Button onClick={signOut} variant="ghost" size="sm">
                <LogOut className="mr-1 h-4 w-4" />Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/order">Place Order</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-full p-2 transition-colors hover:bg-foreground/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass-panel mx-auto mt-2 max-w-6xl rounded-3xl p-2 md:hidden animate-fade-in">
          <div className="space-y-1 px-2 py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                {n.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-foreground/5">Admin Dashboard</Link>
                )}
                <Link to="/my-orders" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-foreground/5">My Orders</Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-foreground/5">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-foreground/5">Sign in</Link>
            )}
            <Link to="/order" onClick={() => setOpen(false)} className="shine mt-2 block rounded-full bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-10px_rgb(15_23_42_/_0.35)]">
              Place Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
