import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "We Became an IT Park Uzbekistan Resident. Here's Why That Indicts Mongolia. | Khurelbaatar",
  description:
    "OnePlaceHR Technologies is now a resident of IT Park Uzbekistan — zero tax until 2040. The business logic for routing investment there instead of Mongolia writes itself.",
};

export default function Article() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-12 space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Startup Ecosystem
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            We Became an IT Park Uzbekistan Resident. Here&apos;s Why That Indicts Mongolia.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            OnePlaceHR Technologies is now registered as an IT Park Uzbekistan resident — zero tax
            on all income until 2040. The business logic for routing investment there instead of
            Mongolia writes itself.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">Nov 6, 2025</p>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/itparkuz1.png"
              alt="IT Park Uzbekistan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/itparkuz2.png"
              alt="IT Park Uzbekistan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Resident badge */}
        <div className="mb-10 rounded-xl border border-border bg-muted/30 px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-black">UZ</span>
          </div>
          <div>
            <p className="text-sm font-semibold">&quot;ONEPLACEHR TECHNOLOGIES&quot;</p>
            <p className="text-xs text-muted-foreground">IT Park Uzbekistan — Resident status: <strong className="text-foreground">Resident</strong></p>
          </div>
        </div>

        <hr className="border-border mb-12" />

        {/* Article body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">

          <p>
            We managed to become a resident of IT Park Uzbekistan. It took effort — but we got
            there.
          </p>

          <p>
            As a resident, OnePlaceHR Technologies pays zero tax on income generated through the
            park until 2040. Not a reduced rate. Zero. And on top of that, the park actively
            supports companies expanding internationally — covering expenses for foreign business
            trips, inviting partners to Uzbekistan, participation in global conferences.
          </p>

          <p>
            I wish Mongolia had figured this out.
          </p>

          <h2>What IT Park Actually Does</h2>

          <p>
            Uzbekistan understood something most governments haven&apos;t: taxing a startup before
            it generates meaningful revenue doesn&apos;t produce tax income — it produces a dead
            startup. So they flipped the logic. Instead of extracting from early-stage companies,
            they invest in helping them reach foreign markets and bring currency back in.
          </p>

          {/* Financial support grid */}
          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-8">
            {[
              { label: "Exhibitions & conferences", amount: "Up to $5,000", note: "tickets, booth expenses" },
              { label: "Expert consulting services", amount: "Up to $10,000", note: "services only" },
              { label: "Invited partners in Uzbekistan", amount: "Up to $20,000", note: "hotel and flights" },
              { label: "Foreign business trips", amount: "Up to $5,000", note: "hotel and flights" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-muted/20 px-5 py-4">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-base font-bold">{item.amount}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>

          <p>
            This is not charity. It is infrastructure policy with a coherent theory behind it:
            help companies export, they bring dollars home, the economy grows. The math works at
            the country level even when it looks like a giveaway at the company level.
          </p>

          <h2>The Mongolia Calculation</h2>

          <p>
            Meanwhile, here is what running a company in Mongolia actually looks like for someone
            who is watching the numbers:
          </p>

          <p>
            I hire an engineer. I pay their salary. On top of that salary, I pay Social Security
            contributions. Before that engineer has shipped a single feature that generates revenue,
            I am already in the red on their headcount. That is before office costs, before tooling,
            before anything.
          </p>

          <p>
            The only reason we kept our Mongolian entity active was mortgage eligibility — our
            engineers need local payroll records to qualify for home loans. That is the entire
            business case for operating in Mongolia. Not policy, not incentives, not ecosystem
            support. Mortgages.
          </p>

          <p>
            Our former Prime Minister&apos;s answer to founders raising this issue was, essentially:
            maybe just don&apos;t. Do nothing, and things will be fine. That is the level of policy
            thinking applied to the sector.
          </p>

          <h2>The Decision That Follows</h2>

          <p>
            When you run the numbers as a founder, the decision is not complicated. Investment
            attracted to the Uzbekistan entity stays in an environment with zero tax friction and
            active government support for international expansion. Investment into the Mongolian
            entity goes into a system that taxes payroll before you have revenue and offers no
            corresponding support.
          </p>

          <p>
            I am not making a political statement. I am doing arithmetic.
          </p>

          <p>
            The countries that have implemented this simple logic — tax outputs, not inputs; support
            expansion, not compliance — are developing faster. Uzbekistan&apos;s President signed
            Decree PP-59 in February 2026: $2 billion in venture capital targets, 500 startups at
            $1M scale, 25 at $100M, 20,000 jobs. It is ecosystem architecture backed by
            policy that makes the math work for founders.
          </p>

          <p>
            Mongolia has the people. It has the need. What it is missing is the policy will to make
            the arithmetic point in the right direction.
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
