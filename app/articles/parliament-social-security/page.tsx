import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "I Asked Parliament to Do One Thing | Khurelbaatar",
  description:
    "Mongolia's Social Security contribution is a hidden payroll tax that kills startups before they reach revenue. I asked Parliament to fix just this one thing.",
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
            I Asked Parliament to Do One Thing
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Mongolia&apos;s Social Security contribution is a hidden payroll tax that drains startups
            before they ever reach revenue. I asked Parliament to fix just this — nothing else.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">April 2026</p>
            </div>
          </div>
        </div>

        {/* YouTube embed */}
        <div className="mb-10 rounded-xl overflow-hidden aspect-video bg-muted">
          <iframe
            src="https://www.youtube.com/embed/BcPkXLYu_e0"
            title="Parliament Meeting on Social Security"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <hr className="border-border mb-12" />

        {/* Article body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">

          <p>
            We recently closed an investment round. The question that followed immediately: how do
            we bring those dollars back into Mongolia?
          </p>

          <p>
            Our investor put it plainly: why would we route capital into a jurisdiction where the
            effective burden on your payroll exceeds 50%? The honest answer is that we keep our
            legal entity in Mongolia because our engineers need local mortgage eligibility. That is
            the only reason. Not because it is operationally smart — it is not.
          </p>

          <p>
            I said this to Parliament members directly. And then I made one specific ask.
          </p>

          <h2>One Clause. This Year.</h2>

          <p>
            Mongolia already has an IT Industry Support Law on the books. It contains provisions
            that, if implemented, would meaningfully change the math for early-stage tech companies.
            I am not asking for new legislation. I am asking for one clause from the existing law
            to be enforced this year:
          </p>

          <p>
            <strong>The Social Security contribution reimbursement for tech startups.</strong>
          </p>

          <p>
            Right now, every company in Mongolia pays a combined ~46.5% in Social Security
            contributions on top of gross salaries — split between employer and employee. Income
            tax? Fine, charge it on revenue. VAT? Fine, charge it on sales. Both of those are tied
            to economic output. But Social Security is charged the moment you hire someone,
            regardless of whether the company has generated a single tögrög.
          </p>

          <h2>Why This Breaks Startups Specifically</h2>

          <p>
            Tech startups do not generate revenue on day one. A typical software product requires
            months of development before it is ready to sell. During that entire period, the
            company is burning cash — and a significant portion of that burn is mandatory payroll
            contributions that produce nothing for the business.
          </p>

          <p>
            The result is predictable: founders who raise their first round get excited, start
            hiring engineers, and then watch their runway collapse under compliance costs before
            they reach the market. They cannot compete with banks and large corporations on
            salaries. They cannot absorb the overhead. So they shut down.
          </p>

          <p>
            This is not a story about one company. It is the default failure mode for early-stage
            startups in Mongolia.
          </p>

          <h2>What Reimbursement Would Do</h2>

          <p>
            If startups could reclaim Social Security contributions during the pre-revenue phase —
            or receive an exemption tied to the IT Industry Support Law — it would not eliminate
            risk. But it would give founders a real runway. It would make the difference between
            reaching the market and shutting down before you get there.
          </p>

          <p>
            The law already exists. The clause is already written. This is an implementation
            problem, not a policy design problem.
          </p>

          <h2>The Ask</h2>

          <p>
            I am not asking Parliament to overhaul the tax system. I am not asking for permanent
            exemptions or complex new frameworks. I am asking for one thing to be actioned in the
            current session:
          </p>

          <p>
            <strong>Implement the Social Security reimbursement clause from the IT Industry
            Support Law.</strong>
          </p>

          <p>
            That is it. One clause. This year. It will not fix everything — but it will stop
            killing companies that have not had a chance to prove themselves yet.
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
