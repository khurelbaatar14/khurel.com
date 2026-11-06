"use client";

import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// The founder: a young man in flat shapes who improves with each level (lib/founder-course.ts
// `levels`). He starts in a grey tee with messy hair, looking down; then gets an idea, a hoodie in
// the role's colour and a laptop, a headset, a jacket and a tidy haircut, and finally raises a fist.
// Pieces that arrive with a new level pop in.

const SKIN = "#e8b48c";
const SKIN_SHADE = "#d39a70";
const HAIR = "#1d1916";
const INK = "#1b1b20";
const DENIM = "#2d3756";
const TEE = "#5c6374";
const JACKET = "#1f2434";
const DEVICE = "#262a35";
const GOLD = "#fcd34d";

const pop = {
  initial: { opacity: 0, scale: 0.4 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 16 } },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.2 } },
} as const;
const morph = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

const hair = {
  messy:
    "M35 43 C33 32 37 25 42 23 L41 18.5 L46 21.8 L48 17 L52 21.3 L56.5 17.8 L57 22.6 C63 24 67 31 65 43 C63 37 61 34 58 33 L56 36 L53 32 L50 35.5 L47 31.5 L44 35 L41 32.5 C38 35 36 39 35 43 Z",
  neat: "M35 43 C33.5 31 38 23 45.5 21 C49 18 55.5 18.3 59 21.5 C64.5 24 66.5 31 65 42 C64 36.5 61.5 33 57.5 32 C52 31 46 32.5 41.5 35.5 C38.5 37.5 36.2 40 35 43 Z",
};
// Brows and mouths share one command shape per feature so they morph between moods.
const brows = {
  unsure: ["M41.8 38 Q44.5 37.4 47 36.6", "M53 36.6 Q55.5 37.4 58.2 38"],
  calm: ["M41.5 37.6 Q44.3 36.6 47 37.2", "M53 37.2 Q55.7 36.6 58.5 37.6"],
  sure: ["M41.5 36.4 Q44.5 36.2 47.2 37.6", "M52.8 37.6 Q55.5 36.2 58.5 36.4"],
};
const mouths = {
  flat: "M46.5 48.8 Q50 48.2 53.5 48.8",
  smile: "M45.8 47.6 Q50 51.4 54.2 47.6",
  grin: "M44.8 47 Q50 54 55.2 47",
};

const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;

export default function Character({ level, color, className }: { level: number; color: string; className?: string }) {
  const still = useReducedMotion();
  const aura = useId();

  const idea = level === 1;
  const hoodie = level >= 2;
  const laptop = level >= 2;
  const headset = level === 3;
  const jacket = level >= 4;
  const champion = level >= 5;

  const sleeve = jacket ? JACKET : hoodie ? color : TEE;
  const loop = (duration: number, extra?: object) =>
    still ? undefined : { duration, repeat: Infinity, ease: "easeInOut" as const, ...extra };

  return (
    <svg
      viewBox="0 -8 100 168"
      className={cn("block h-full w-auto overflow-visible", className)}
      style={{ aspectRatio: "100 / 168" }}
      role="img"
      aria-label="Үүсгэн байгуулагчийн дүр"
    >
      <defs>
        <radialGradient id={aura}>
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>

      <AnimatePresence initial={false}>
        {champion && (
          <motion.g key="aura" {...pop}>
            <ellipse cx={50} cy={84} rx={50} ry={74} fill={`url(#${aura})`} />
            {[
              [12, 24, 4],
              [90, 70, 3.2],
              [10, 104, 2.6],
              [84, 120, 2.2],
            ].map(([x, y, r], i) => (
              <motion.path
                key={i}
                d={star(x, y, r)}
                fill={GOLD}
                animate={still ? undefined : { opacity: [0.2, 1, 0.2], scale: [0.7, 1.1, 0.7] }}
                transition={loop(2.4, { delay: i * 0.5 })}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      <ellipse cx={50} cy={155} rx={24} ry={3.5} fill="#000" opacity={0.4} />

      {/* Legs and shoes stay put; everything above breathes. */}
      <rect x={36.5} y={98} width={27} height={14} rx={5} fill={DENIM} />
      <rect x={37.5} y={100} width={11.5} height={48} rx={4} fill={DENIM} />
      <rect x={51} y={100} width={11.5} height={48} rx={4} fill={DENIM} />
      {[32.5, 50.5].map((x) => (
        <g key={x}>
          <rect x={x} y={145.5} width={17} height={8} rx={4} fill="#eceef2" />
          <rect x={x + 1} y={151.5} width={15} height={2} rx={1} fill="#b5bac5" />
          <AnimatePresence initial={false}>
            {level >= 3 && <motion.rect key="stripe" {...pop} x={x + 4.5} y={147.6} width={8} height={1.8} rx={0.9} fill={color} />}
          </AnimatePresence>
        </g>
      ))}

      <motion.g animate={still ? undefined : { y: [0, -0.8, 0] }} transition={loop(3.2)}>
        <AnimatePresence initial={false}>
          {hoodie && (
            <motion.g key="hood" {...pop}>
              <path d="M37 67 C37 57.5 43.5 54 50 54 C56.5 54 63 57.5 63 67 Z" fill={color} />
              <path d="M37 67 C37 57.5 43.5 54 50 54 C56.5 54 63 57.5 63 67 Z" fill="#000" opacity={0.22} />
            </motion.g>
          )}
        </AnimatePresence>

        <rect x={45.5} y={52} width={9} height={14} rx={2} fill={SKIN_SHADE} />

        {/* Body: tee, then hoodie, with a jacket over it later. */}
        <motion.path
          d="M33 72 C33 66.5 37 64 42 64 H58 C63 64 67 66.5 67 72 V102 C67 105 65 107 62 107 H38 C35 107 33 105 33 102 Z"
          initial={false}
          animate={{ fill: hoodie ? color : TEE }}
          transition={morph}
        />
        <path d="M44.5 64 Q50 70.5 55.5 64 Z" fill={SKIN_SHADE} />
        <AnimatePresence initial={false}>
          {hoodie && (
            <motion.g key="hoodie" {...pop}>
              <path d="M42.5 64.6 Q50 73 57.5 64.6" fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={2.4} />
              <path d="M47 67 L46.4 77 M53 67 L53.6 77" stroke="#fff" strokeOpacity={0.85} strokeWidth={1.1} strokeLinecap="round" />
            </motion.g>
          )}
          {hoodie && !jacket && <motion.path key="pocket" {...pop} d="M40.5 91 H59.5 L61.5 101 H38.5 Z" fill="#000" fillOpacity={0.14} />}
          {jacket && (
            <motion.g key="jacket" {...pop}>
              <path d="M33 72 C33 66.5 37 64 42 64 H44.8 L47 107 H38 C35 107 33 105 33 102 Z" fill={JACKET} />
              <path d="M67 72 C67 66.5 63 64 58 64 H55.2 L53 107 H62 C65 107 67 105 67 102 Z" fill={JACKET} />
              <path d="M44.8 64 L47 107 M55.2 64 L53 107" stroke="#fff" strokeOpacity={0.14} strokeWidth={0.8} />
            </motion.g>
          )}
          {champion && <motion.path key="pin" {...pop} d={star(40.5, 76, 2.6)} fill={GOLD} />}
        </AnimatePresence>

        {/* Laptop tucked under the left arm. */}
        <AnimatePresence initial={false}>
          {laptop && (
            <motion.g key="laptop" {...pop}>
              <rect x={12.5} y={77} width={15} height={21} rx={2} fill="#cfd3dc" transform="rotate(-6 20 87.5)" />
              <circle cx={18} cy={87} r={1.9} fill={color} />
            </motion.g>
          )}
        </AnimatePresence>

        <Arm side="left" rotate={level === 0 ? 0 : 6} sleeve={sleeve} long={hoodie} />
        <Arm side="right" rotate={champion ? -150 : level === 0 ? 0 : -6} sleeve={sleeve} long={hoodie} />

        {/* Head: looks down at first, up from the first idea on. */}
        <motion.g initial={false} animate={{ y: level === 0 ? 1.6 : 0 }} transition={morph}>
          <circle cx={35} cy={42} r={3.2} fill={SKIN} />
          <circle cx={65} cy={42} r={3.2} fill={SKIN} />
          <ellipse cx={50} cy={40} rx={15} ry={16.5} fill={SKIN} />
          <AnimatePresence initial={false}>
            <motion.path
              key={jacket ? "neat" : "messy"}
              d={jacket ? hair.neat : hair.messy}
              fill={HAIR}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>

          <motion.g
            style={{ originX: 0.5, originY: 0.5 }}
            animate={still ? undefined : { scaleY: [1, 1, 0.1, 1] }}
            transition={loop(4.5, { times: [0, 0.93, 0.96, 1], ease: "linear" })}
          >
            <motion.ellipse initial={false} animate={{ cy: level === 0 ? 43.4 : 42 }} transition={morph} cx={44.5} rx={1.7} ry={2.1} fill={INK} />
            <motion.ellipse initial={false} animate={{ cy: level === 0 ? 43.4 : 42 }} transition={morph} cx={55.5} rx={1.7} ry={2.1} fill={INK} />
          </motion.g>
          {(level === 0 ? brows.unsure : jacket ? brows.sure : brows.calm).map((d, i) => (
            <motion.path key={i} initial={false} animate={{ d }} transition={morph} fill="none" stroke={HAIR} strokeWidth={1.5} strokeLinecap="round" />
          ))}
          <motion.path
            initial={false}
            animate={{ d: level === 0 ? mouths.flat : champion ? mouths.grin : mouths.smile }}
            transition={morph}
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <AnimatePresence initial={false}>
            {level >= 1 && (
              <motion.g key="cheeks" {...pop}>
                <circle cx={41} cy={46.4} r={2} fill="#f08a7a" opacity={0.35} />
                <circle cx={59} cy={46.4} r={2} fill="#f08a7a" opacity={0.35} />
              </motion.g>
            )}
            {headset && (
              <motion.g key="headset" {...pop}>
                <path d="M35.5 41 C35.5 21.5 64.5 21.5 64.5 41" fill="none" stroke={DEVICE} strokeWidth={2.6} />
                <rect x={32} y={37} width={6} height={10} rx={2.6} fill={DEVICE} />
                <rect x={62} y={37} width={6} height={10} rx={2.6} fill={DEVICE} />
                <path d="M35 46 Q36.5 51.5 43.5 51" fill="none" stroke={DEVICE} strokeWidth={1.4} strokeLinecap="round" />
                <circle cx={44.2} cy={50.9} r={1.5} fill={color} />
              </motion.g>
            )}
          </AnimatePresence>
        </motion.g>

        {/* The first idea, glowing above his head. */}
        <AnimatePresence initial={false}>
          {idea && (
            <motion.g key="idea" {...pop}>
              <motion.circle
                cx={50}
                cy={4}
                r={9}
                fill={GOLD}
                animate={still ? undefined : { opacity: [0.15, 0.35, 0.15] }}
                transition={loop(2)}
                opacity={0.25}
              />
              <circle cx={50} cy={3} r={5} fill={GOLD} />
              <rect x={47.6} y={7.2} width={4.8} height={3.6} rx={1} fill="#9ca3af" />
              <path d="M48.3 3.6 L50 1.4 L51.7 3.6" fill="none" stroke="#b45309" strokeWidth={0.8} strokeLinecap="round" />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.g>
    </svg>
  );
}

/** One arm hanging from the shoulder: short tee sleeve and bare forearm, or a full sleeve. */
function Arm({ side, rotate, sleeve, long }: { side: "left" | "right"; rotate: number; sleeve: string; long: boolean }) {
  const x = side === "left" ? 25.5 : 65;
  return (
    <motion.g initial={false} animate={{ rotate }} transition={{ type: "spring", stiffness: 120, damping: 14 }} style={{ originX: 0.5, originY: 0.06 }}>
      <rect x={x} y={66} width={9.5} height={34} rx={4.75} fill={SKIN} />
      <motion.rect x={x - 0.75} y={65.5} width={11} rx={4.5} initial={false} animate={{ height: long ? 33.5 : 15, fill: sleeve }} transition={morph} />
      <circle cx={x + 4.75} cy={101} r={4.7} fill={SKIN} />
    </motion.g>
  );
}
