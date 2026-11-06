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
import { Code2, Megaphone, Palette } from "lucide-react";
import { founderTypes, type FounderType } from "@/lib/founder";

// The hero: the startup is the core and the three founder roles glide around it on one orbit.
// The orbit is a tilted ellipse, so a founder passing in front grows and sits over the core while
// the ones behind shrink and fade. Hovering a founder pauses the orbit.

export const roleIcons: Record<FounderType["id"], typeof Code2> = {
  hacker: Code2,
  hipster: Palette,
  hustler: Megaphone,
};

// Radii as % of the stage's width and height (16:10, or square on phones).
const RX = 40;
const RY = 30;
const SPEED = (2 * Math.PI) / 48000; // one lap in 48 s
const display = "font-[family-name:var(--font-display)]";

export default function Orbit({ onPick }: { onPick: (id: FounderType["id"]) => void }) {
  // Start with the first founder at the front.
  const t = useMotionValue(Math.PI / 2);
  const [paused, setPaused] = useState(false);
  const still = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (!paused && !still) t.set(t.get() + delta * SPEED);
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-3xl select-none sm:aspect-[16/10]">
      {/* Stretched to the stage, so the ring matches the percentage radii at any aspect. */}
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="ring" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.04" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="50" rx={RX * 1.6} ry={RY} fill="none" stroke="#fb923c" strokeOpacity="0.08" strokeWidth="6" vectorEffect="non-scaling-stroke" />
        <ellipse cx="80" cy="50" rx={RX * 1.6} ry={RY} fill="none" stroke="url(#ring)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <Core />

      {founderTypes.map((type, i) => (
        <Founder key={type.id} type={type} offset={(i * 2 * Math.PI) / 3} t={t} onPick={onPick} onHover={setPaused} />
      ))}
    </div>
  );
}

function Core() {
  return (
    <div className="absolute left-1/2 top-1/2 z-20 grid aspect-square w-[22%] min-w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
      <div className="absolute inset-[-35%] rounded-full bg-orange-500/20 blur-3xl" />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, #fb923c, #f472b6, #a78bfa, #34d399, #fb923c)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,.18),transparent_45%),radial-gradient(circle_at_50%_70%,#1c1424,#0b0b10)]" />
      <div className="relative text-center">
        <p className={`${display} text-[clamp(0.95rem,2.6vw,1.6rem)] font-semibold tracking-tight`}>Startup</p>
        <p className="text-[clamp(0.6rem,1.4vw,0.75rem)] text-white/50">таны стартап</p>
      </div>
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
  const opacity = useTransform(depth, (d) => 0.45 + 0.55 * ((d + 1) / 2));
  const zIndex = useTransform(depth, (d) => (d > 0 ? 30 : 10));
  const Icon = roleIcons[type.id];

  return (
    <motion.button
      style={{ left, top, scale, opacity, zIndex }}
      onClick={() => onPick(type.id)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={`${type.name} — ${type.title}`}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none"
    >
      <motion.span
        layoutId={`role-${type.id}`}
        className="grid size-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 sm:size-20"
        style={{ boxShadow: `0 0 50px -12px ${type.color}, inset 0 1px 0 rgba(255,255,255,.12)` }}
      >
        <Icon className="size-7 sm:size-8" style={{ color: type.color }} />
      </motion.span>
      <span className={`${display} mt-2.5 text-sm font-semibold sm:text-base`}>{type.name}</span>
      <span className="text-xs text-white/50">{type.title}</span>
    </motion.button>
  );
}
