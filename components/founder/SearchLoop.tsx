"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// The one idea the course starts from: a startup is a constant search for a repeatable and scalable
// business model, and testing guesses is the road to it. The loop steps through on its own;
// tapping a step stops it there.

const steps = [
  { name: "Таамаглал", text: "Хамтрагчидтайгаа юуг шалгахаа тохир.", color: "#3d7bff" },
  { name: "Бүтээх", text: "Шалгахад хүрэлцэх хамгийн жижиг юмыг хэдхэн хоногт хий.", color: "#ff8a3d" },
  { name: "Турших", text: "Жинхэнэ хүмүүс дээр туршиж үз. Найзууд дээр биш.", color: "#ffd23d" },
  { name: "Ойлголт", text: "Юу сурснаа бич: тоо, хүмүүсийн хэлсэн үг.", color: "#ff5fa8" },
  { name: "Шийдвэр", text: "Энэ замаараа үргэлжлүүлэх үү, эргэх үү? Тэгээд дахиад эхнээс нь.", color: "#37f59a" },
];

const C = 150;
const R = 100;
const STEP = 360 / steps.length;
const point = (deg: number, r = R) => ({
  x: C + r * Math.cos(((deg - 90) * Math.PI) / 180),
  y: C + r * Math.sin(((deg - 90) * Math.PI) / 180),
});

export default function SearchLoop() {
  const still = useReducedMotion();
  // Turns of the loop so far, in steps; always counts up so the dot only moves forward.
  const [turn, setTurn] = useState(0);
  const [held, setHeld] = useState(false);
  const active = turn % steps.length;
  const lap = Math.floor(turn / steps.length) + 1;

  const angle = useMotionValue(0);
  const dotX = useTransform(angle, (a) => point(a).x);
  const dotY = useTransform(angle, (a) => point(a).y);

  useEffect(() => {
    const controls = animate(angle, turn * STEP, { duration: still ? 0 : 0.8, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [turn, angle, still]);

  useEffect(() => {
    if (held || still) return;
    const timer = setInterval(() => setTurn((t) => t + 1), 2600);
    return () => clearInterval(timer);
  }, [held, still]);

  function pick(i: number) {
    setHeld(true);
    setTurn((t) => t + ((i - (t % steps.length) + steps.length) % steps.length));
  }

  return (
    <div className="rounded-3xl border border-[#222226] bg-[#0b0b0d] p-5 sm:p-7">
      <p className="text-xl font-black leading-tight tracking-tight sm:text-2xl">
        Стартап = ижил аргаар дахин дахин зарж болдог, хурдан томордог загварыг{" "}
        <span className="text-[#37f59a]">байнга хайх</span>.
      </p>
      <p className="mt-2 text-sm text-[#9a9aa6]">Хайх арга нь энэ тойрог. Олтлоо эргэнэ.</p>

      <div className="relative mx-auto mt-6 max-w-[19rem]">
        <svg viewBox="0 0 300 300" className="w-full overflow-visible" aria-hidden>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#222226" strokeWidth={14} />
          <motion.circle cx={dotX} cy={dotY} r={9} fill={steps[active].color} />
        </svg>

        {steps.map((s, i) => {
          const p = point(i * STEP, R);
          const on = i === active;
          return (
            <button
              key={s.name}
              onClick={() => pick(i)}
              aria-pressed={on}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-transform duration-200 sm:text-sm",
                on ? "scale-110 text-black" : "bg-[#18181b] text-[#c8c8d0] ring-1 ring-[#2a2a30] hover:text-white",
              )}
              style={{ left: `${(p.x / 300) * 100}%`, top: `${(p.y / 300) * 100}%`, background: on ? s.color : undefined }}
            >
              {s.name}
            </button>
          );
        })}

        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-black tracking-tight">Хайлт</p>
            <p className="text-xs font-semibold tabular-nums text-[#9a9aa6]">{lap}-р тойрог</p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-5 min-h-[2.75rem] max-w-sm text-center text-sm font-medium leading-relaxed text-[#d8d8de]">
        {steps[active].text}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 border-t border-[#222226] pt-5 text-xs font-bold sm:text-sm">
        <span className="whitespace-nowrap rounded-full bg-[#18181b] px-3 py-1.5 text-[#c8c8d0]">Загвар олдлоо</span>
        <ArrowRight className="size-3.5 shrink-0 text-[#55555f]" />
        <span className="whitespace-nowrap rounded-full bg-[#18181b] px-3 py-1.5 text-[#c8c8d0]">Томруул</span>
        <ArrowRight className="size-3.5 shrink-0 text-[#55555f]" />
        <span className="whitespace-nowrap rounded-full bg-[#37f59a] px-3 py-1.5 text-black">Хөрөнгө оруулалт</span>
      </div>
    </div>
  );
}
