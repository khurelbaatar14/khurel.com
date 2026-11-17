"use client";

import { useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { Code2, Megaphone, Palette } from "lucide-react";
import { founderTypes, type FounderType } from "@/lib/founder";
import { cn } from "@/lib/utils";

// The hero: the startup is the core and the three founder roles glide around it on one orbit.
// The orbit is a tilted ellipse, so a founder passing in front grows and sits over the core while
// the ones behind shrink and fade. Hovering a founder pauses the orbit.

export const roleIcons: Record<FounderType["id"], typeof Code2> = {
  hacker: Code2,
  hipster: Palette,
  hustler: Megaphone,
};

/** The founder's portrait filling its tile, or the role icon (in the text colour) until there is one. */
export function Face({ type, size, className }: { type: FounderType; size: number; className?: string }) {
  const Icon = roleIcons[type.id];
  if (type.avatar) {
    return <Image src={type.avatar} alt={type.title} fill sizes={`${size}px`} className="object-cover" />;
  }
  return <Icon className={cn("size-[46%]", className)} strokeWidth={2.25} />;
}

// Radii as % of the stage's width and height.
const RX = 40;
const RY = 30;
const SPEED = (2 * Math.PI) / 50000; // one lap in 50 s

export default function Orbit({ onPick }: { onPick: (id: FounderType["id"]) => void }) {
  // Start with the last founder (the CEO) at the front.
  const t = useMotionValue(Math.PI / 2 - (4 * Math.PI) / 3);
  const [paused, setPaused] = useState(false);
  const still = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (!paused && !still) t.set(t.get() + delta * SPEED);
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl select-none sm:aspect-[5/4]">
      {/* Stretched to the stage, so the ring matches the percentage radii at any aspect. */}
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <ellipse cx="80" cy="50" rx={RX * 1.6} ry={RY} fill="none" stroke="#2a2a30" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="absolute left-1/2 top-1/2 z-20 grid aspect-square w-[26%] min-w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-center text-black">
        <div>
          <p className="text-[clamp(1rem,2.6vw,1.6rem)] font-black tracking-tight">Startup</p>
          <p className="text-[clamp(0.6rem,1.2vw,0.75rem)] font-semibold text-black/50">чиний стартап</p>
        </div>
      </div>

      {founderTypes.map((type, i) => (
        <Founder key={type.id} type={type} offset={(i * 2 * Math.PI) / 3} t={t} onPick={onPick} onHover={setPaused} />
      ))}
    </div>
  );
}

function Founder({
  type,
  offset,
  t,
  onPick,
  onHover,
}: {
  type: FounderType;
  offset: number;
  t: MotionValue<number>;
  onPick: (id: FounderType["id"]) => void;
  onHover: (on: boolean) => void;
}) {
  const left = useTransform(t, (v) => `${50 + RX * Math.cos(v + offset)}%`);
  const top = useTransform(t, (v) => `${50 + RY * Math.sin(v + offset)}%`);
  // -1 at the back of the orbit, 1 at the front.
  const depth = useTransform(t, (v) => Math.sin(v + offset));
  const scale = useTransform(depth, (d) => 0.72 + 0.28 * ((d + 1) / 2));
  const opacity = useTransform(depth, (d) => 0.5 + 0.5 * ((d + 1) / 2));
  const zIndex = useTransform(depth, (d) => (d > 0 ? 30 : 10));

  return (
    <motion.button
      style={{ left, top, scale, opacity, zIndex }}
      onClick={() => onPick(type.id)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={`${type.title} — ${type.name}`}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none"
    >
      <span
        className={cn(
          "relative grid place-items-center overflow-hidden rounded-[22px] text-black transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white",
          type.avatar ? "size-20 sm:size-24" : "size-16 sm:size-20",
        )}
        style={{ background: type.color }}
      >
        <Face type={type} size={96} />
      </span>
      <span className="mt-2 whitespace-nowrap text-sm font-black">{type.title}</span>
    </motion.button>
  );
}
