import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Bike, Heart, MapPin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Gilgit FastRide" },
      { name: "description", content: "Gilgit FastRide is a local delivery service operating in Gilgit, providing fast and reliable delivery solutions for individuals and businesses." },
      { property: "og:title", content: "About Gilgit FastRide" },
      { property: "og:description", content: "A local delivery service built for the people of Gilgit-Baltistan." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">About Gilgit FastRide</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Gilgit FastRide is a local delivery service operating in Gilgit, providing fast and reliable
          delivery solutions for individuals and businesses. Founded by Atta Ur Rehman, our goal is to
          make city-wide delivery affordable, predictable and respectful of your time.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Bike, title: "Local riders", desc: "We hire and train riders who know every gali of Gilgit." },
            { icon: Heart, title: "Honest pricing", desc: "Fixed rates by zone — no surprises after pickup." },
            { icon: MapPin, title: "Built for GB", desc: "Optimized for the streets, weather and pace of Gilgit-Baltistan." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <v.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
