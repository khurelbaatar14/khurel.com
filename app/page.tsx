import { Component as HeroGrid } from "@/components/ui/the-infinite-grid";
import WhatIDo from "@/components/WhatIDo";
import Articles from "@/components/Articles";
import MediaPress from "@/components/MediaPress";
import Connect from "@/components/Connect";

export default function Home() {
  return (
    <main>
      <section id="hero">
        <HeroGrid />
      </section>

      <section id="what-i-do" className="py-24 px-6">
        <WhatIDo />
      </section>

      <section id="articles" className="py-24 bg-muted/30">
        <Articles />
      </section>

      <section id="press" className="py-24 px-6">
        <MediaPress />
      </section>

      <section id="connect" className="py-24 bg-muted/30 px-6">
        <Connect />
      </section>
    </main>
  );
}
