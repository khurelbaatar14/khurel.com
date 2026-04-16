"use client";

import { useState, useRef } from "react";

type PressCard = {
  id: string;
  label: string;
  name: string;
  subtitle?: string;
  url: string;
  dark: boolean;
  accentBg: string; // actual bg color class (not hover:) — applied via state
  span?: string;
};

const cards: PressCard[] = [
  {
    id: "thetech",
    label: "THE-TECH.KZ",
    name: "THE\nTECH",
    url: "https://the-tech.kz/kak-hrtech-startap-iz-mongolii-sokrashhaet-tekuchest-kadrov-na-70-s-pomoshhyu-gejmifikaczii/",
    dark: false,
    accentBg: "bg-zinc-900",
    span: "col-span-2 md:col-span-1",
  },
  {
    id: "cnbc",
    label: "CNBC MONGOLIA",
    name: "CNBC",
    subtitle: "MONGOLIA",
    url: "https://cnbc.mn/news/h181u3",
    dark: true,
    accentBg: "bg-red-700",
    span: "col-span-2 md:col-span-1",
  },
  {
    id: "parliament",
    label: "PARLIAMENT",
    name: "Парламент\nуулзалт",
    subtitle: "Meeting with MPs",
    url: "https://www.facebook.com/reel/1598689798054332/?s=single_unit",
    dark: true,
    accentBg: "bg-violet-700",
  },
  {
    id: "ministry",
    label: "MINISTRY",
    name: "Цахим хөгжил,\nХарилцаа холбооны яам",
    url: "https://www.facebook.com/watch/?v=1030499651868975",
    dark: false,
    accentBg: "bg-blue-600",
  },
  {
    id: "itpark",
    label: "IT PARK UZBEKISTAN",
    name: "IT PARK\nUZBEK",
    url: "https://www.youtube.com/watch?v=Vwe-E48X_IQ",
    dark: false,
    accentBg: "bg-green-600",
  },
  {
    id: "unnutech",
    label: "UNNUTECH",
    name: "#3 Serious\nGames",
    subtitle: "with Khurelbaatar",
    url: "https://www.youtube.com/watch?v=gF_mtyOC__Y",
    dark: true,
    accentBg: "bg-orange-600",
  },
  {
    id: "tengertv",
    label: "TENGER TV",
    name: "TENGER\nTV",
    subtitle: "Interview",
    url: "https://www.facebook.com/reel/28431001789848237",
    dark: true,
    accentBg: "bg-sky-600",
  },
];

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

async function fetchThumbnail(url: string): Promise<string | null> {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`
    );
    const data = await res.json();
    return (
      data.data?.screenshot?.url ||
      data.data?.image?.url ||
      null
    );
  } catch {
    return null;
  }
}

function PressCardItem({ card }: { card: PressCard }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const fetched = useRef(false);

  const handleMouseEnter = () => {
    setHovered(true);
    if (!fetched.current) {
      fetched.current = true;
      fetchThumbnail(card.url).then(setThumbnail);
    }
  };

  const showThumb = hovered && !!thumbnail;

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      className={[
        "group relative flex flex-col justify-between rounded-2xl p-5 min-h-[160px] cursor-pointer select-none overflow-hidden transition-all duration-300",
        card.span ?? "",
        // base bg
        hovered
          ? card.accentBg
          : card.dark
          ? "bg-zinc-900"
          : "bg-zinc-100",
      ].join(" ")}
    >
      {/* Thumbnail layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
          opacity: showThumb ? 1 : 0,
        }}
      />
      {/* Scrim over thumbnail */}
      <div
        className="absolute inset-0 bg-black/55 transition-opacity duration-500"
        style={{ opacity: showThumb ? 1 : 0 }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        {/* Label chip */}
        <span
          className={[
            "self-start text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full border transition-colors duration-300",
            hovered || card.dark
              ? "border-white/25 text-white/60"
              : "border-black/15 text-black/40",
          ].join(" ")}
        >
          {card.label}
        </span>

        {/* Name */}
        <div>
          <p
            className={[
              "text-2xl font-black leading-tight whitespace-pre-line tracking-tight transition-colors duration-300",
              hovered || card.dark ? "text-white" : "text-zinc-900",
            ].join(" ")}
          >
            {card.name}
          </p>
          {card.subtitle && (
            <p
              className={[
                "text-xs mt-1 transition-colors duration-300",
                hovered || card.dark ? "text-white/60" : "text-zinc-500",
              ].join(" ")}
            >
              {card.subtitle}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

export default function MediaPress() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 px-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Press & Podcasts</h2>
        <p className="text-muted-foreground text-lg">Where I&apos;ve been featured</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((card) => (
          <PressCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
