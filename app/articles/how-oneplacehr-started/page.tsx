import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Pecha Kucha at National University of Mongolia | Khurelbaatar",
  description:
    "I didn't get into McKinsey. But the game they made me play unlocked a question I couldn't let go: why does nobody else hire this way? That question became OnePlaceHR.",
  openGraph: {
    images: [{ url: "/photos/avatar.png" }],
  },
  twitter: { card: "summary_large_image" },
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
            Pecha Kucha at National University of Mongolia
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            I didn&apos;t get into McKinsey. But the game they made me play unlocked a question I
            couldn&apos;t let go: why does nobody else hire this way? That question became
            OnePlaceHR.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">2026</p>
            </div>
          </div>
        </div>

        {/* YouTube embed */}
        <div className="mb-10 rounded-xl overflow-hidden aspect-video bg-muted">
          <iframe
            src="https://www.youtube.com/embed/f5riF9FavnI"
            title="How OnePlaceHR Started — Speech at Labor Forum"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <hr className="border-border mb-12" />

        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">

          <p>
            I spent four years working at two companies before going independent. During COVID, I
            completed the implementation of a Palantir system for a client — one of the largest
            enterprise platforms in the world — and then started thinking seriously about what came
            next.
          </p>

          <p>
            I wanted to work at a global company. Google was on the list. I applied to many places
            and kept failing the first CV screening round. Then McKinsey contacted me.
          </p>

          <h2>The Game</h2>

          <p>
            McKinsey does not just review your CV. They send you a link. You click it, and a game
            appears — one hour, no right or wrong answers. Just a series of simulations and
            decision-making scenarios. You complete it, submit it, and wait.
          </p>

          <p>
            I made it to the final rounds. I met with senior leaders. I did not get the offer — I
            never expected to. McKinsey has always pulled heavily from Harvard and equivalent
            brands. But I left that process with a question I could not shake: <em>why doesn&apos;t
            every company hire this way?</em>
          </p>

          <p>
            So I started digging.
          </p>

          <h2>The Research Behind the Game</h2>

          <p>
            It turns out McKinsey&apos;s game is not arbitrary. It is backed by 85 years of
            research data on what actually predicts job performance. The findings are clear and
            largely ignored by most hiring processes:
          </p>

          {/* Data cards */}
          <div className="not-prose grid grid-cols-2 gap-3 my-8">
            <div className="rounded-xl border border-border bg-muted/20 px-5 py-4">
              <p className="text-3xl font-black text-foreground mb-1">13%</p>
              <p className="text-sm text-muted-foreground">Correlation between CV quality and actual job performance</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 px-5 py-4">
              <p className="text-3xl font-black text-orange-500 mb-1">60%+</p>
              <p className="text-sm text-muted-foreground">Correlation between cognitive ability and job performance</p>
            </div>
          </div>

          <p>
            Your CV — how it looks, how it is written, the institutions it lists — predicts only
            13% of how well you will actually perform at work. Cognitive ability: attention,
            working memory, problem-solving speed — predicts over 60%. McKinsey knew this. Most
            hiring managers did not.
          </p>

          <p>
            I found the professors who wrote the research behind McKinsey&apos;s assessment. I
            cold-emailed them. They wrote back. We spent three months doing our own research into
            how cognitive ability can be measured reliably, then built our own simulation-based
            assessment — no right or wrong answers, just behavioral and problem-solving patterns
            — and tested it across four or five rounds in Mongolia, achieving strong Cronbach&apos;s
            alpha (statistical reliability) each time.
          </p>

          <p>
            That became the foundation of OnePlaceHR.
          </p>

          <h2>What We Built</h2>

          <p>
            OnePlaceHR is an AI-powered recruitment platform for the Mongolian market. Instead of
            giving companies a pile of CVs, we give them a ranked shortlist of candidates who have
            already been pre-screened through AI interview simulations.
          </p>

          <p>
            The platform now operates in Mongolia, Kazakhstan, and Uzbekistan. In the past year,
            we have conducted thousands of AI interviews across those markets. Companies like Nomin
            Holdings use it to find candidates through social channels — someone clicks a link in
            Facebook, Instagram, or Telegram, enters the AI interview flow, and gets placed if they
            qualify. No HR person involved until the final stage.
          </p>

          <p>
            We are a team of three engineers. We are valued at $3 million.
          </p>

          <h2>How We Actually Work: Three Tools</h2>

          <p>
            I was asked to share how a small team builds and operates at this scale. The honest
            answer is three things.
          </p>

          <h3>1. Claude Code</h3>

          <p>
            Our three engineers have not used ChatGPT or any other AI coding tool for over a year.
            We use Claude Code exclusively. When I open my laptop, Claude Code is the first thing
            that loads. Two engineers, with Claude Code, can do the work of twenty. That is not
            an exaggeration — it is what we observe in our own output. If you are building a
            technology company today, learning Claude Code is not optional.
          </p>

          <h3>2. Personal AI Agents</h3>

          <p>
            I have two agents running inside Telegram that work for me every day. The first one
            monitors the Mongolian labor market — every morning it sends me a research brief on
            what is happening: which companies are hiring, what roles are in demand, any signals
            worth acting on.
          </p>

          <p>
            The second one drafts formal documents. When I need an official letter to a government
            body, a contract with a partner, or a response to a tax office — I describe what I
            need in Telegram, and it drafts it. I review, sign, send. Tasks that used to require
            an admin or a lawyer are handled in minutes.
          </p>

          <p>
            Since January 2026, the technology for personal agents has become genuinely reliable.
            OpenAI and Anthropic both pushed major updates in this direction. The entire tech
            industry moved fast. A startup in 2026 does not need separate staff for marketing
            research, content, or administrative correspondence. Agents handle it.
          </p>

          <h3>3. The Hypothesis Cycle</h3>

          <p>
            Every feature we ship — every change to the platform — goes through the same loop.
            We call it the hypothesis cycle. Facebook, Instagram, and the large tech companies
            have used this for years. Every time you notice a menu change or a new button in an
            app you use, there is a hypothesis test behind it.
          </p>

          <p>
            It works like this: someone on the team has an idea. We write it as a testable
            hypothesis — <em>&ldquo;if we add X, we expect Y to happen&rdquo;</em> — then we
            build the minimum version to test it, collect data, and make a decision based on
            what the data shows.
          </p>

          <p>
            A recent example from our own platform: we were only selling our simulation assessments
            to companies. Someone on the team asked — what if individual users could access the
            assessment themselves and see their own cognitive profile? Hypothesis formed. We
            launched a test. We tracked: 4,000 clicks on the campaign, 3,000 sign-ups, 2,500
            reached the payment page, 200 paid. The data told us the price point was too high for
            individual users. We did not celebrate or mourn — we used it to make the next decision.
          </p>

          <p>
            This is how startups survive. Not by building for months and hoping. By testing fast,
            reading data, and iterating. Every product decision at OnePlaceHR goes through this
            cycle.
          </p>

          <h2>For Students and Young Builders</h2>

          <p>
            I was asked what I would tell someone early in their career. Two things.
          </p>

          <p>
            First — work for someone else before you start something. Not for years and years, but
            enough to understand how organizations function, how to work with people, what
            accountability actually feels like. You learn things on the job that no classroom
            teaches.
          </p>

          <p>
            Second — when you are ready to build, remember that the bar has changed. A one-person
            company can now run like a team of twenty. The tools exist. McKinsey-level cognitive
            assessment, enterprise-grade AI interviews, personal agents that do your research and
            draft your correspondence — all of this is accessible today at a fraction of what it
            cost five years ago.
          </p>

          <p>
            The question is not whether you have enough resources. The question is whether you
            have a real problem to solve and the discipline to test your way to the answer.
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
