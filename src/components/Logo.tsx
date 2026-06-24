import logoAsset from "@/assets/gilgit-fastride-logo.jpg.asset.json";

export function Logo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center overflow-hidden rounded-xl bg-foreground"
        style={{ height: size, width: size }}
      >
        <img
          src={logoAsset.url}
          alt="Gilgit FastRide logo"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-tight text-foreground">
          Gilgit <span className="text-foreground">FastRide</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Local Delivery
        </div>
      </div>
    </div>
  );
}
