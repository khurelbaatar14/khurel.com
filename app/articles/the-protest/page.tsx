import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "The Morning I Felt Power Belong to the People | Khurelbaatar",
  description:
    "After ex-PM Oyun-Erdene stepped down, I stood in Sukhbaatar Square until midnight. This is what I saw — and what it made me believe.",
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
          <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600">
            Politics
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            The Morning I Felt Power Belong to the People
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            After ex-PM Oyun-Erdene stepped down, I stood in Sukhbaatar Square until midnight.
            This is what I saw — and what it made me believe.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">May 2024</p>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="rounded-xl overflow-hidden aspect-[4/5] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/protest1.png"
              alt="Youth gathered at Sukhbaatar Square"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden aspect-[4/5] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/protest2.png"
              alt="Protesters at Sukhbaatar Square"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <hr className="border-border mb-12" />

        {/* Article body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">

          <p>
            I have been going to protests since 1995. I know what a Mongolian protest looks like.
            This one was different.
          </p>

          <p>
            There was singing. An actual program with music. People sat and listened to speakers —
            genuinely listened, not out of obligation. Nobody was bored. Nobody was performing anger
            for a camera.
          </p>

          <p>
            Then the counter-protesters arrived — the paid ones, the organized disruption. I braced
            myself. What happened next was something I had never seen at a Mongolian protest. The
            crowd did not react. No hostility, no chanting them down. Some of the young organizers
            walked over and started actual conversations with them: &quot;We understand you. This
            isn&apos;t your fault.&quot;
          </p>

          <p>
            I sat among the counter-protesters for a while, watching. I could not believe what I
            was seeing. Times have changed. This generation is different.
          </p>

          <h2>What the Night Meant</h2>

          <p>
            My partner and I left our son with his grandmother — multiple times throughout the
            week. We would take an hour from the market, drop him off, go stand in the square, stay
            until the crowd dispersed, and get home around midnight.
          </p>

          <p>
            We did not regret a single hour of it.
          </p>

          <p>
            That morning after — when Oyun-Erdene stepped down — I felt something I had not felt
            before: that power actually belongs to us. Not as an abstract civic principle. As a
            lived, physical fact. A crowd of ordinary people — most of them young, many of them
            first-timers — had made something happen.
          </p>

          <p>
            I am proud of the young people who organized it. Genuinely proud. Not the nostalgic
            kind of pride that older generations perform when the youth do something impressive.
            Real pride, because they did it better than we did.
          </p>

          <h2>Why People Stay Silent</h2>

          <p>
            I have been thinking about why this kind of moment is rare. Why most people — especially
            working-age people with jobs and kids and mortgages — do not show up.
          </p>

          <p>
            I think it is one of two things. Either they do not actually know what percentage of
            their income disappears into taxes and social contributions before they see it. Or they
            do know — and they have made peace with it. Accepted that this is just how life works.
            Chosen silence.
          </p>

          <p>
            Both explanations are troubling. But the first one is fixable. If every young working
            person in Mongolia understood exactly what was being taken from them — income tax,
            social security, health contributions stacked on top of each other — I think the
            square would fill up on its own.
          </p>

          <p>
            Because the alternative is staying quiet while a small group of connected people and
            their children extract from the system indefinitely. That group is not going anywhere.
            It is already reorganizing. New committees, new boards, new positions. The next
            generation of beneficiaries is already being slotted into place.
          </p>

          <p>
            I cannot live that way. I am not built for it. I want to build a real business in
            Mongolia, live well, and feel that the taxes I pay are building something — not feeding
            someone&apos;s kid&apos;s lifestyle while mine does without.
          </p>

          <h2>What I Want for My Son</h2>

          <p>
            I hope my son grows up in a different Mongolia. Not a perfect one. Not a utopia. Just
            one where the math is fair — where if you work hard, build something, hire people, and
            pay your taxes, you are not penalized for it. Where a government official&apos;s child
            cannot live in luxury that their parent&apos;s salary cannot explain without consequence.
          </p>

          <p>
            That night in the square felt like a beginning. Not the beginning of the end of some
            problem — those are never clean. But the beginning of a generation that knows how to
            demand things. Calmly. Clearly. Without hating the people on the other side.
          </p>

          <p>
            That is a generation worth believing in.
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
