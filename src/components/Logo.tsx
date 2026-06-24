import { Bike } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-soft">
        <Bike className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-tight text-foreground">
          Gilgit <span className="text-primary">FastRide</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Local Delivery
        </div>
      </div>
    </div>
  );
}
