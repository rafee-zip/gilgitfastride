import { useEffect, useMemo, useState } from "react";
import { Star, Quote } from "lucide-react";

type Review = {
  name: string;
  area: string;
  text: string;
  rating: number;
};

const ALL_REVIEWS: Review[] = [
  { name: "Ahmed Karim", area: "Jutial", rating: 5, text: "Honestly the fastest delivery I've had in Gilgit. The rider called me, picked up my parcel from Jutial Bazaar and dropped it in Konodas within 30 minutes. Will definitely use again." },
  { name: "Fatima Zahra", area: "Konodas", rating: 5, text: "I ordered medicine for my mother late in the evening and they delivered it carefully and quickly. Very polite rider, MashaAllah. Highly recommended for families." },
  { name: "Bilal Hussain", area: "Danyore", rating: 5, text: "Sent important documents to my office in Chinar Bagh. Tracking was easy and the price was very fair. Felt like a proper professional service finally in our city." },
  { name: "Aisha Noor", area: "Sonikot", rating: 5, text: "Ordered food from a restaurant that doesn't usually deliver to my area. Came hot and packed properly. The rider even apologised for a small delay due to traffic. Loved it!" },
  { name: "Yousuf Ali", area: "Nagaral", rating: 5, text: "Bohat acha service hai. Booked from the website, no need to message on WhatsApp first. Easy form, clear pricing, and on-time pickup. JazakAllah team." },
  { name: "Maryam Iqbal", area: "Kashrote", rating: 5, text: "I do my weekly grocery through Gilgit FastRide now. They follow my list exactly and bring the receipt. Genuinely makes life easier as a working woman." },
  { name: "Hamza Sheikh", area: "Amphary", rating: 5, text: "Used them three times this week for my shop deliveries. Reliable boys, polite behaviour, and never lost a single item. Trustworthy team." },
  { name: "Zainab Riaz", area: "Majini Mohalla", rating: 5, text: "Affordable rates compared to asking random riders. The estimated price on the website matched exactly what I paid. No hidden charges, that's what I appreciate." },
  { name: "Usman Tariq", area: "Barmas", rating: 5, text: "Sent a birthday gift to my sister in Konodas. They handled it gently and even messaged me when it was delivered. Small things, but they really care." },
  { name: "Khadija Bano", area: "Nomal", rating: 5, text: "First time I tried, I was a bit unsure. But the order page was so simple and the rider arrived exactly on time. Now my whole family uses Gilgit FastRide." },
  { name: "Ibrahim Shah", area: "Sultanabad", rating: 5, text: "Best part is they accept the order online instantly. No waiting around for someone to reply. Service is genuinely fast as the name says." },
  { name: "Hafsa Malik", area: "Jutial", rating: 5, text: "Ordered pharmacy items at night when I really needed them. The rider was respectful and quick. May Allah bless this team for such a useful service." },
];

function pickThree(): Review[] {
  const shuffled = [...ALL_REVIEWS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

export function ReviewsCard() {
  const [pool] = useState<Review[]>(() => pickThree());
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % pool.length);
    }, 4500);
    return () => clearInterval(id);
  }, [pool.length]);

  const current = useMemo(() => pool[idx], [pool, idx]);

  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary to-primary-glow shadow-elevated" />
      <div className="absolute inset-4 rounded-[1.75rem] bg-background/95 p-6 backdrop-blur">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Quote className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
              Loved by Gilgit
            </span>
          </div>

          <div key={current.name + idx} className="mt-5 flex-1 animate-fade-in">
            <div className="flex items-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground line-clamp-6 sm:text-[15px]">
              &ldquo;{current.text}&rdquo;
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {current.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{current.name}</div>
              <div className="text-xs text-muted-foreground">{current.area}, Gilgit</div>
            </div>
            <div className="ml-auto flex gap-1">
              {pool.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-5 bg-primary" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
