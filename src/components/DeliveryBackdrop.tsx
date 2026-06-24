import {
  Bike,
  Package,
  Truck,
  MapPin,
  Box,
  Send,
  ShoppingBag,
  Pill,
  Utensils,
  FileText,
  Navigation,
  Clock,
} from "lucide-react";

const ICONS = [Bike, Package, Truck, MapPin, Box, Send, ShoppingBag, Pill, Utensils, FileText, Navigation, Clock];

// Deterministic-ish scatter so it doesn't reshuffle each render
const SCATTER: Array<{ top: string; left: string; size: number; rotate: number; iconIndex: number; delay: string }> = [
  { top: "6%", left: "4%", size: 44, rotate: -12, iconIndex: 0, delay: "0s" },
  { top: "12%", left: "82%", size: 52, rotate: 18, iconIndex: 1, delay: "0.4s" },
  { top: "22%", left: "38%", size: 36, rotate: -6, iconIndex: 2, delay: "0.8s" },
  { top: "30%", left: "68%", size: 40, rotate: 24, iconIndex: 3, delay: "0.2s" },
  { top: "44%", left: "8%", size: 48, rotate: -20, iconIndex: 4, delay: "0.6s" },
  { top: "52%", left: "90%", size: 38, rotate: 10, iconIndex: 5, delay: "1s" },
  { top: "60%", left: "30%", size: 46, rotate: -14, iconIndex: 6, delay: "0.3s" },
  { top: "68%", left: "55%", size: 34, rotate: 22, iconIndex: 7, delay: "0.9s" },
  { top: "76%", left: "12%", size: 50, rotate: -8, iconIndex: 8, delay: "0.5s" },
  { top: "82%", left: "78%", size: 42, rotate: 16, iconIndex: 9, delay: "0.1s" },
  { top: "90%", left: "44%", size: 38, rotate: -22, iconIndex: 10, delay: "0.7s" },
  { top: "18%", left: "58%", size: 32, rotate: 6, iconIndex: 11, delay: "1.1s" },
];

export function DeliveryBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {SCATTER.map((item, i) => {
        const Icon = ICONS[item.iconIndex % ICONS.length];
        return (
          <Icon
            key={i}
            className="absolute text-muted-foreground"
            style={{
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              transform: `rotate(${item.rotate}deg)`,
              animation: `float 6s ease-in-out ${item.delay} infinite`,
              opacity: 0.7,
              strokeWidth: 1.5,
            }}
          />
        );
      })}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
      `}</style>
    </div>
  );
}
