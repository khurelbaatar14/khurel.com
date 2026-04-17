import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Mongolia's Startup Policy Is Years Behind. Here's the Data. | Khurelbaatar",
  description:
    "Kazakhstan built a functioning startup ecosystem with clear tax policy and measurable targets. Mongolia has neither. The gap is widening.",
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
            Mongolia&apos;s Startup Policy Is Years Behind. Here&apos;s the Data.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Kazakhstan built a functioning startup ecosystem with clear tax policy and measurable targets.
            Mongolia has neither. The gap is widening.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">Jun 12, 2025</p>
            </div>
          </div>
        </div>

        {/* YouTube embed */}
        <div className="mb-10 rounded-xl overflow-hidden aspect-video bg-muted">
          <iframe
            src="https://www.youtube.com/embed/NQTmEsr7VaU"
            title="Mongolia Startup Ecosystem"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Astana photos */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/astana1.jpeg"
              alt="Astana Hub, Kazakhstan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/astana2.jpeg"
              alt="Astana Hub, Kazakhstan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <hr className="border-border mb-12" />

        {/* Article body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">

          <p>
            I recently read a news article about a working group formed to implement Mongolia&apos;s
            IT Industry Support Law. The group is tasked with studying international best practices
            and drafting regulations — a process they plan to stretch across the entire autumn
            parliamentary session.
          </p>

          <p>I want to save them some time.</p>

          <p>
            Kazakhstan — our neighbor to the west — has already done it. The data is public.
            The model is documented. There is no reason to spend months on research trips.
          </p>

          <h2>The Astana Hub Story</h2>

          <p>
            I spent four months working out of Astana. What was immediately visible was the
            structure: the Ministry of Digital Development co-located with the IT hub, universities
            feeding engineers directly into the pipeline, all of it operating under one roof.
          </p>

          <p>
            Astana Hub started in 2016 — a proposal to the Prime Minister. By 2017, the first
            hackathons were running. The notable part isn&apos;t the speed. It&apos;s that they set
            concrete, measurable targets and tied people to them.
          </p>

          <p>Their KPIs for 2026:</p>

          <ul>
            <li>
              <strong>$500 million</strong> in foreign investment attracted from the tech sector
            </li>
            <li>
              <strong>$1 billion</strong> (3 trillion MNT) in domestic startup investment
            </li>
          </ul>

          <p>
            These aren&apos;t vague aspirations. They&apos;re numbers someone is accountable for.
          </p>

          <h2>The Model That Actually Works</h2>

          <p>
            Here is the mechanism that makes Astana Hub function: every startup affiliated with the
            hub is <strong>exempt from all taxes</strong>. In return, they share a small percentage
            of revenue with the hub. That revenue funds the next training programs, the next cohort
            of investments, the next cycle of growth.
          </p>

          <p>
            Think about what this means for a founder. Instead of burning through your first funding
            round on social insurance contributions and tax filings before you&apos;ve even found
            product-market fit, you put every dollar into building. And when you do generate
            revenue, you contribute a fraction back to the ecosystem that supported you.
          </p>

          <p>The revenue loop is built into the structure from day one.</p>

          <h2>Mongolia&apos;s Digital Strategy: Goals Without Teeth</h2>

          <p>Compare that to Mongolia&apos;s six strategic goals in the digital development plan:</p>

          <ol>
            <li>Expand telecom infrastructure and 5G readiness</li>
            <li>Advance e-governance</li>
            <li>Improve digital literacy</li>
            <li>Develop national digital content</li>
            <li>Increase electronics manufacturing</li>
            <li>Improve competitiveness in ICT services</li>
          </ol>

          <p>
            These read like aspirations written by a committee that has never spoken to a founder.
            Goal five — electronics manufacturing — is fantasy for a country at our stage. The rest,
            while directionally correct, have no concrete targets, no accountability, and no
            implementation path.
          </p>

          <p>
            Meanwhile, the Ministry of Finance still hasn&apos;t approved the startup tax
            regulations. Entrepreneurs who managed to raise investment watch it disappear into tax
            obligations before they can build anything. I have seen this pattern repeat too many
            times: a startup raises its first funding, gets excited, then collapses under compliance
            costs before reaching the market.
          </p>

          <h2>The Cost of Delay</h2>

          <p>
            Kazakhstan started in 2016. Mongolia is years behind. Being late means the competitive
            gap compounds — every year without a clear tax framework is another year founders leave
            or never start.
          </p>

          <p>
            There is no original research required here. Kazakhstan&apos;s IT Park representatives
            have already visited Mongolia. The policy documents are available. The question is
            whether anyone in government will act on them.
          </p>

          <p>
            Mongolia is a small market. That is actually an advantage — you can test an idea quickly
            and take it global. Israel does exactly this: build domestically, validate fast, scale
            internationally. We have the same geography of necessity. The young people are ready.
            Mongolia&apos;s generation born in the peak years — the 18-year-olds today — are hungry
            to build. What they need is an environment where taking that risk doesn&apos;t mean
            immediate financial ruin.
          </p>

          <h2>What Needs to Happen</h2>

          <p>
            The tech industry in Mongolia needs to speak with one voice to the incoming Prime
            Minister. Not in separate meetings — together. The ask is specific:
          </p>

          <ul>
            <li>
              <strong>Approve the startup tax regulation</strong> currently stalled at the Ministry
              of Finance
            </li>
            <li>
              <strong>Create real tax exemptions</strong> for early-stage startups — not the token
              reduction currently proposed, but something that actually changes the math for a
              founder
            </li>
            <li>
              <strong>Set measurable targets</strong> for the sector: foreign investment attracted,
              startups funded, jobs created
            </li>
          </ul>

          <p>
            We are not as far behind as it feels. The window is open. The question is whether
            we&apos;ll use it.
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
