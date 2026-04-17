import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "I Presented This Slide to the Prime Minister | Khurelbaatar",
  description:
    "Last weekend I stood in front of Mongolia's Prime Minister and made the case for startup tax relief. Here's what I said — and what he promised.",
};

export default function Article() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="mb-12 space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Startup Ecosystem
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            I Presented This Slide to the Prime Minister
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Last weekend I stood in front of Mongolia&apos;s Prime Minister and made the case for
            startup tax relief. Here&apos;s what I said — and what he promised.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">Aug 26, 2025</p>
            </div>
          </div>
        </div>

        {/* Photo grid */}
        <div className="flex flex-col gap-3 mb-10">
          {/* Slide — full width */}
          <div className="rounded-xl overflow-hidden bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/pm-slide.png"
              alt="Tax comparison: Astana Hub 0%, IT Park 7.5%, Mongolia 59%"
              className="w-full"
            />
          </div>
          {/* Two event photos side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden aspect-[3/4] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/pm-speaking.png"
                alt="Khurelbaatar speaking on stage"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[3/4] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/pm-audience.png"
                alt="Audience at the event with the Prime Minister"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        <hr className="border-border mb-12" />

        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">

          <p>
            Last weekend, I had the chance to present a single slide to the Prime Minister of
            Mongolia. It showed one thing: how far behind we are.
          </p>

          <p>
            Kazakhstan&apos;s Astana Hub — <strong>0% total tax burden</strong> for startups.
            Uzbekistan&apos;s IT Park — <strong>7.5%</strong>. Mongolia —{" "}
            <strong>59%</strong>.
          </p>

          <p>
            That number includes corporate income tax, VAT, social insurance contributions, customs,
            and personal income tax. Fifty-nine percent. Before a young founder has found a single
            paying customer, more than half of every tugrug they earn or raise is spoken for.
          </p>

          <h2>What I Said</h2>

          <p>
            I want to be clear about what I was asking for. I was not there to complain. I was not
            asking for grants or government money. The founders I speak for are not waiting for
            handouts — they are already working, already paying their taxes, already building with
            whatever is left after the government takes its share.
          </p>

          <p>
            The ask is simple: <strong>give early-stage startups room to breathe</strong>. Stop
            taxing companies that haven&apos;t yet proven themselves. Let them build for a period —
            a few years — without the full weight of the tax system bearing down on them. Then, when
            they grow, when they generate real revenue, when they expand — take your share. The
            state will get far more from a thriving company than from a startup that collapses under
            compliance costs before it reaches the market.
          </p>

          <h2>The Example That Stopped the Room</h2>

          <p>
            In 2017, Kazakhstan introduced serious startup support through Astana Hub. One outcome
            of that support: <strong>30 engineers came together and founded a startup</strong>.
            Today, that company&apos;s market valuation is equal to Mongolia&apos;s largest publicly
            listed company.
          </p>

          <p>
            Thirty people. Started from scratch. Eight years of the right policy environment. That
            is what is possible.
          </p>

          <p>
            We have the same raw material. Mongolia has hungry, talented young people who want to
            build companies — not just find jobs. The legal framework for a Virtual Zone already
            exists on paper. The opportunity is not theoretical. What is missing is the willingness
            to implement what has already been written into law.
          </p>

          <h2>What the Prime Minister Said</h2>

          <p>
            He listened. He promised to <strong>accelerate the Virtual Zone</strong> initiative and
            to support young founders. Those were his words.
          </p>

          <p>
            I have heard promises before. So has every founder in this country. What matters now
            is whether those words translate into regulation — into specific, enforceable tax
            relief for early-stage companies — or whether they remain on a stage somewhere,
            applauded and forgotten.
          </p>

          <p>
            I will keep watching. And I will keep showing up with slides.
          </p>

        </article>

        <hr className="border-border mt-12 mb-8" />

        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    </main>
  );
}
