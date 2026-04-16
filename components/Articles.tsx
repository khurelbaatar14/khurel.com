"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Features, FeatureItem } from "@/components/ui/features-2";
import { ArrowRight, ChevronDown, TrendingUp, Users, Globe, Baby, HeartHandshake, BookOpen, Vote, Building2, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
  number: string;
  badge: string;
  title: string;
  excerpt: string;
  accent: string;
  badgeClass: string;
  articles: FeatureItem[];
};

const categories: Category[] = [
  {
    number: "01",
    badge: "Ecosystem",
    title: "Startup Ecosystem in Mongolia",
    excerpt:
      "Mongolia's startup scene is quietly transforming. From fintech to agritech, a new generation of founders is building for a market the world is only just beginning to notice.",
    accent: "from-orange-500 to-red-500",
    badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    articles: [
      {
        icon: TrendingUp,
        title: "What Mongolia Can Learn from Kazakhstan's Startup Playbook",
        description: "Kazakhstan built a world-class startup ecosystem in under a decade. Mongolia has the same opportunity — if we stop studying and start copying what works.",
        url: "/articles/mongolia-startup-ecosystem",
      },
      {
        icon: Globe,
        title: "Building for a landlocked market",
        description: "The unique challenges and unexpected advantages of starting up in a country sandwiched between two giants.",
        url: "#",
      },
      {
        icon: Users,
        title: "The founders I'm watching",
        description: "Profiles of the next generation of Mongolian entrepreneurs solving real problems.",
        url: "#",
      },
    ],
  },
  {
    number: "02",
    badge: "Parenting",
    title: "My Son's Development",
    excerpt:
      "Notes from the front lines of fatherhood — watching a little human learn language, form opinions, and discover the world one curious question at a time.",
    accent: "from-blue-500 to-indigo-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    articles: [
      {
        icon: Baby,
        title: "Language milestones I didn't expect",
        description: "The surprising moments when he started making sense of the world through words.",
        url: "#",
      },
      {
        icon: HeartHandshake,
        title: "What fatherhood taught me about patience",
        description: "Building a company is hard. Being a present father while doing it is harder.",
        url: "#",
      },
      {
        icon: BookOpen,
        title: "Books I'm reading with him",
        description: "A running list of the stories we share and why I think reading together matters.",
        url: "#",
      },
    ],
  },
  {
    number: "03",
    badge: "Politics",
    title: "My Political Views",
    excerpt:
      "How should a small, landlocked country navigate the tension between democracy and development? My honest, evolving thoughts on governance, reform, and civic responsibility.",
    accent: "from-emerald-500 to-teal-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    articles: [
      {
        icon: Vote,
        title: "Democracy in a resource-rich state",
        description: "When a country's wealth comes from the ground, what does real democratic accountability look like?",
        url: "#",
      },
      {
        icon: Building2,
        title: "What good governance actually looks like",
        description: "Moving past slogans and looking at the institutions, incentives, and people that make reform stick.",
        url: "#",
      },
      {
        icon: Megaphone,
        title: "Why civic engagement still matters",
        description: "A case for showing up, speaking up, and staying engaged even when the system is frustrating.",
        url: "#",
      },
    ],
  },
];

export default function Articles() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 px-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">My Interests</h2>
        <p className="text-muted-foreground text-lg">Things I think about and write about</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {categories.map((cat) => {
          const isOpen = open === cat.number;
          const hasArticles = cat.articles.length > 0;
          return (
            <div key={cat.number} className="rounded-2xl border border-border/60 overflow-hidden">
              {/* Category header — clickable only if articles exist */}
              <button
                onClick={() => hasArticles && setOpen(isOpen ? null : cat.number)}
                disabled={!hasArticles}
                className="w-full text-left flex items-stretch group disabled:cursor-default"
              >
                {/* Gradient number stripe */}
                <div className={`bg-gradient-to-br ${cat.accent} w-16 shrink-0 flex items-center justify-center`}>
                  <span className="text-2xl font-black text-white/30 leading-none select-none">
                    {cat.number}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1 flex items-center justify-between px-6 py-5 gap-4 hover:bg-muted/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`${cat.badgeClass} border-0 font-medium text-xs`}>
                        {cat.badge}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground hidden md:block">{cat.excerpt}</p>
                  </div>
                  {hasArticles && (
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </div>
              </button>

              {/* Expandable articles */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-border/50"
                  >
                    <div className="px-6 py-6 bg-muted/20">
                      <Features items={cat.articles} />
                      <div className="mt-4 flex justify-end">
                        <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline group">
                          See all articles
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
