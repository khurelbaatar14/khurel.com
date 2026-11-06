"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { animate, AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Flag,
  Info,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import Character from "@/components/founder/Character";
import Orbit, { roleIcons } from "@/components/founder/Orbit";
import { focus, founderTypes, phases, rewardFor, skills, type FounderType, type Phase, type Quest } from "@/lib/founder";
import { allTasks, levelFor, levels, modules, type Module } from "@/lib/founder-course";
import { cn } from "@/lib/utils";

// Draft: the founder's role, phase, open module and finished tasks live in this browser only
// (localStorage).
type Saved = { role: FounderType["id"] | null; phase: Phase["id"]; module: string; done: string[] };
const KEY = "founder-path-v1";
const EMPTY = JSON.stringify({ role: null, phase: "idea", module: modules[0].id, done: [] });
let memory = EMPTY;
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function save(next: Saved) {
  memory = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, memory);
  } catch {
    // Private mode or blocked storage: progress lasts until the tab closes.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function parse(raw: string): Saved {
  try {
    const v = JSON.parse(raw);
    return {
      role: founderTypes.some((t) => t.id === v?.role) ? v.role : null,
      phase: phases.some((p) => p.id === v?.phase) ? v.phase : "idea",
      module: modules.some((m) => m.id === v?.module) ? v.module : modules[0].id,
      done: Array.isArray(v?.done) ? v.done.filter((id: unknown) => typeof id === "string") : [],
    };
  } catch {
    return parse(EMPTY);
  }
}

const display = "font-[family-name:var(--font-display)]";
const ease = [0.22, 1, 0.36, 1] as const;
const num = (i: number) => String(i + 1).padStart(2, "0");
const noop = () => () => {};

export default function FounderPath() {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  // The server can't see the saved role, so it renders the orbit. On the first client render,
  // jump straight to whatever was saved: new group and presence keys skip the morph and crossfade.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const mount = hydrated ? "live" : "ssr";
  const saved = useMemo(() => parse(raw), [raw]);
  const done = useMemo(() => new Set(saved.done), [saved.done]);
  const role = founderTypes.find((t) => t.id === saved.role);
  const sparks = allTasks.reduce((sum, q) => sum + (done.has(q.id) ? rewardFor(q, role) : 0), 0);
  const count = allTasks.filter((q) => done.has(q.id)).length;
  // The level just reached by finishing a task, shown for a few seconds.
  const [levelUp, setLevelUp] = useState<number | null>(null);

  useEffect(() => {
    if (levelUp === null) return;
    const timer = setTimeout(() => setLevelUp(null), 4500);
    return () => clearTimeout(timer);
  }, [levelUp]);

  function pick(id: FounderType["id"]) {
    save({ ...saved, role: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    // overflow-clip, not -hidden: a hidden box can still be scrolled sideways (e.g. focusing an orbiting
    // founder near the edge), and it would stop the top bar from sticking.
    <div className="relative isolate min-h-screen overflow-clip bg-[#08080c] text-white">
      <Backdrop />
      <TopBar sparks={sparks} />

      <LayoutGroup id={mount}>
        <AnimatePresence key={mount} mode="popLayout" initial={false}>
          {role ? (
            <Plan
              key="plan"
              role={role}
              saved={saved}
              done={done}
              count={count}
              onLevelUp={setLevelUp}
              onBack={() => save({ ...saved, role: null })}
            />
          ) : (
            <Choose key="choose" onPick={pick} />
          )}
        </AnimatePresence>
      </LayoutGroup>

      <AnimatePresence>
        {role && levelUp !== null && (
          <LevelUp key={levelUp} level={levelUp} color={role.color} onClose={() => setLevelUp(null)} />
        )}
      </AnimatePresence>

      <footer className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/5 px-4 py-8 text-sm text-white/35 sm:flex-row sm:px-6">
        <p>Ноорог · Явц зөвхөн энэ төхөөрөмж дээр хадгалагдана.</p>
        <button
          onClick={() => {
            setLevelUp(null);
            save(parse(EMPTY));
          }}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <RotateCcw className="size-3.5" />
          Дахин эхлэх
        </button>
      </footer>
    </div>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute -top-48 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-orange-500/[0.12] blur-[150px]" />
      <div className="absolute top-[36rem] -left-48 h-[30rem] w-[30rem] rounded-full bg-violet-600/[0.12] blur-[150px]" />
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => {
        from.current = v;
        setShown(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{shown.toLocaleString("en-US")}</span>;
}

function TopBar({ sparks }: { sparks: number }) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#08080c]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm text-white/50 transition-colors hover:text-white">
          khurel.com <span className="text-white/25">/</span> <span className="text-white">founder</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm font-medium text-amber-200">
          <Sparkles className="size-3.5" />
          <Counter value={sparks} /> оч
        </span>
      </div>
    </div>
  );
}

/** A toast for a new level: the character starts at the old level and changes in front of you. */
function LevelUp({ level, color, onClose }: { level: number; color: string; onClose: () => void }) {
  const [shown, setShown] = useState(level - 1);
  useEffect(() => {
    const timer = setTimeout(() => setShown(level), 450);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <motion.button
      onClick={onClose}
      role="status"
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-4 rounded-2xl border border-white/15 bg-[#12121b]/90 p-3 pr-5 text-left backdrop-blur-xl sm:bottom-6"
      style={{ boxShadow: `0 24px 70px -24px ${color}` }}
    >
      <span className="h-28 shrink-0">
        <Character level={shown} color={color} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color }}>
          Шинэ түвшин · {level + 1}/{levels.length}
        </span>
        <span className={cn(display, "mt-1 block text-xl font-semibold tracking-tight")}>{levels[level].name}</span>
        <span className="mt-1 block text-sm leading-snug text-white/60">{levels[level].change}</span>
      </span>
    </motion.button>
  );
}

/** The character next to how far he is from the next level. */
function Growth({ role, count, className }: { role: FounderType; count: number; className?: string }) {
  const level = levelFor(count);
  const current = levels[level];
  const next = levels[level + 1];
  const progress = next ? (count - current.at) / (next.at - current.at) : 1;

  return (
    <div className={cn("flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 pr-4", className)}>
      <span className="h-24 shrink-0">
        <Character level={level} color={role.color} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/40">
          Түвшин {level + 1}/{levels.length}
        </p>
        <p className={cn(display, "mt-0.5 font-semibold leading-tight")}>{current.name}</p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: role.color }}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6, ease }}
          />
        </div>
        <p className="mt-1.5 text-xs leading-snug text-white/45">
          {next ? `Дараагийн түвшин хүртэл ${next.at - count} даалгавар` : "Бүх түвшинг давлаа"}
        </p>
      </div>
    </div>
  );
}

function Choose({ onPick }: { onPick: (id: FounderType["id"]) => void }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20"
    >
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
        <span className="size-1.5 rounded-full bg-orange-400" />
        Founder Path
      </p>
      <h1 className={cn(display, "mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl")}>
        Та ямар{" "}
        <span className="bg-gradient-to-r from-orange-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
          үүсгэн байгуулагч
        </span>{" "}
        вэ?
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/55">
        Стартап бол цөм. Түүнийг тойрон гурван төрлийн үүсгэн байгуулагч эргэдэг. Өөрийгөө сонго — стартапдаа яг одоо юу
        хийхээ мэдэх болно.
      </p>

      <div className="mt-6 sm:mt-2">
        <Orbit onPick={onPick} />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-2">
        {founderTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t.id)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            <span className="font-medium text-white">{t.name}</span> · {t.title}
          </button>
        ))}
      </div>
    </motion.section>
  );
}

function Plan({
  role,
  saved,
  done,
  count,
  onLevelUp,
  onBack,
}: {
  role: FounderType;
  saved: Saved;
  done: Set<string>;
  count: number;
  onLevelUp: (level: number) => void;
  onBack: () => void;
}) {
  const phase = phases.find((p) => p.id === saved.phase) ?? phases[0];
  const Icon = roleIcons[role.id];

  function open(id: string) {
    save({ ...saved, module: id });
    document.getElementById("course")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14"
    >
      <div className="flex flex-wrap items-center gap-5">
        <motion.span
          layoutId={`role-${role.id}`}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="grid size-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md"
          style={{ boxShadow: `0 0 50px -12px ${role.color}, inset 0 1px 0 rgba(255,255,255,.12)` }}
        >
          <Icon className="size-8" style={{ color: role.color }} />
        </motion.span>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5, ease }}>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Таны үүрэг</p>
          <h2 className={cn(display, "text-2xl font-semibold tracking-tight sm:text-3xl")}>
            {role.name} <span className="text-white/40">· {role.title}</span>
          </h2>
          <p className="mt-1 text-sm text-white/50">{role.strength}</p>
        </motion.div>
        <button
          onClick={onBack}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Үүргээ солих
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease }}
      >
        <Now role={role} phase={phase} saved={saved} done={done} level={levelFor(count)} onOpen={open} />
        <Course role={role} phase={phase} saved={saved} done={done} count={count} onOpen={open} onLevelUp={onLevelUp} />
      </motion.div>
    </motion.section>
  );
}

// Each phase is a step higher than the last; the steps rest on the card's divider like a floor.
const stepHeights = ["h-20 sm:h-28", "h-28 sm:h-36", "h-36 sm:h-44", "h-44 sm:h-52"];

/** The startup phases as a staircase. The founder stands on the current step and climbs to the one picked. */
function Ladder({ role, at, level, onPick }: { role: FounderType; at: number; level: number; onPick: (id: Phase["id"]) => void }) {
  return (
    <div className="mt-4 grid grid-cols-4 items-end gap-1.5 sm:gap-3">
      {phases.map((p, i) => {
        const active = i === at;
        const passed = i < at;
        return (
          <button key={p.id} onClick={() => onPick(p.id)} aria-pressed={active} className="group flex flex-col outline-none">
            <span className="flex h-24 items-end justify-center sm:h-40">
              {active && (
                <motion.span layoutId="climber" transition={{ type: "spring", stiffness: 200, damping: 22 }} className="h-full">
                  <Character level={level} color={role.color} />
                </motion.span>
              )}
            </span>
            <span
              className={cn(
                "flex flex-col gap-1 rounded-t-xl border border-b-0 p-2.5 text-left transition-colors sm:p-4",
                stepHeights[i],
                active
                  ? "text-white"
                  : passed
                    ? "border-white/15 bg-white/[0.06] text-white/80 group-hover:bg-white/[0.09]"
                    : "border-white/[0.08] bg-white/[0.02] text-white/45 group-hover:bg-white/[0.05] group-hover:text-white/70",
              )}
              style={
                active
                  ? { borderColor: `${role.color}80`, background: `linear-gradient(180deg, ${role.color}38, ${role.color}0a)` }
                  : undefined
              }
            >
              <span className="flex items-center gap-1 font-mono text-[10px] sm:text-xs" style={active ? { color: role.color } : undefined}>
                {passed ? <Check className="size-3.5" strokeWidth={3} /> : num(i)}
              </span>
              <span className="text-xs font-semibold leading-tight sm:text-sm">{p.name}</span>
              <span className="hidden text-xs leading-snug text-white/40 md:block">{p.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Where the startup is now, what this role should focus on, and which modules to start with. */
function Now({
  role,
  phase,
  saved,
  done,
  level,
  onOpen,
}: {
  role: FounderType;
  phase: Phase;
  saved: Saved;
  done: Set<string>;
  level: number;
  onOpen: (id: string) => void;
}) {
  const { now, risk } = focus[phase.id][role.id];
  const picks = phase.modules.map((id) => modules.findIndex((m) => m.id === id));

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-6 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-white/50">Таны стартап одоо аль шатанд байна?</p>
          <p className="text-xs text-white/30">Шатаа сонго</p>
        </div>
        <Ladder
          role={role}
          at={phases.findIndex((p) => p.id === phase.id)}
          level={level}
          onPick={(id) => save({ ...saved, phase: id })}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
          className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr]"
        >
          <div className="absolute -left-24 -top-24 size-72 rounded-full blur-3xl" style={{ background: `${role.color}1f` }} />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: role.color }}>
              <Target className="size-4" />
              Одоо таны гол ажил
            </p>
            <p className={cn(display, "mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-[1.75rem]")}>{now}</p>
            <p className="mt-5 flex items-start gap-2 text-sm text-white/55">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
              <span>
                <span className="font-medium text-white/80">Анхаар: </span>
                {risk}
              </span>
            </p>
          </div>
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Эхлээд үзэх</p>
            <ul className="mt-3 space-y-2">
              {picks.map((i) => {
                const m = modules[i];
                const complete = m.tasks.every((q) => done.has(q.id));
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => onOpen(m.id)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-left text-sm transition-colors hover:border-white/20"
                    >
                      <span className="font-mono text-xs text-white/35">{num(i)}</span>
                      <span className="flex-1 text-white/85">{m.title}</span>
                      {complete ? (
                        <Check className="size-4" style={{ color: role.color }} />
                      ) : (
                        <ArrowRight className="size-4 text-white/30 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Course({
  role,
  phase,
  saved,
  done,
  count,
  onOpen,
  onLevelUp,
}: {
  role: FounderType;
  phase: Phase;
  saved: Saved;
  done: Set<string>;
  count: number;
  onOpen: (id: string) => void;
  onLevelUp: (level: number) => void;
}) {
  const index = Math.max(0, modules.findIndex((m) => m.id === saved.module));
  const current = modules[index];
  const finished = modules.filter((m) => m.tasks.every((q) => done.has(q.id))).length;

  // Keep the open module's chip centred in the phone row (scrolls only the row, never the page).
  // Jumps there on load, glides on later changes.
  const chips = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  useEffect(() => {
    const row = chips.current;
    const chip = row?.children[index] as HTMLElement | undefined;
    if (!row || !chip) return;
    const left = chip.offsetLeft - row.offsetLeft - (row.clientWidth - chip.clientWidth) / 2;
    row.scrollTo({ left, behavior: loaded.current ? "smooth" : "instant" });
    loaded.current = true;
  }, [index]);

  return (
    <div id="course" className="mt-16 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Сургалт</p>
          <h3 className={cn(display, "mt-1 text-2xl font-semibold tracking-tight")}>{modules.length} модуль</h3>
        </div>
        <p className="text-sm text-white/50">
          <span className="font-semibold text-white">{finished}</span>/{modules.length} дууссан
        </p>
      </div>

      {/* Phones: the character, then a swipeable row of modules above the lesson. */}
      <Growth role={role} count={count} className="mt-5 lg:hidden" />
      <div ref={chips} className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {modules.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onOpen(m.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm",
              i === index ? "border-white bg-white font-medium text-black" : "border-white/10 text-white/60",
            )}
          >
            {num(i)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <AnimatePresence mode="wait">
          <ModuleView
            key={current.id}
            module={current}
            index={index}
            role={role}
            saved={saved}
            done={done}
            onOpen={onOpen}
            onLevelUp={onLevelUp}
          />
        </AnimatePresence>

        <div className="sticky top-20 hidden space-y-3 lg:block">
          <Growth role={role} count={count} />
          <nav className="max-h-[calc(100vh-15rem)] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-2">
            {modules.map((m, i) => {
              const count = m.tasks.filter((q) => done.has(q.id)).length;
              const complete = count === m.tasks.length;
              const suggested = phase.modules.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => onOpen(m.id)}
                  aria-current={i === index ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    i === index ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full font-mono text-[10px]",
                      complete ? "text-black" : "bg-white/[0.06] text-white/50",
                    )}
                    style={complete ? { background: role.color } : undefined}
                  >
                    {complete ? <Check className="size-3.5" strokeWidth={3} /> : num(i)}
                  </span>
                  <span className="flex-1 leading-snug">{m.title}</span>
                  {suggested && !complete && <span className="size-1.5 shrink-0 rounded-full" style={{ background: role.color }} />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

function ModuleView({
  module: m,
  index,
  role,
  saved,
  done,
  onOpen,
  onLevelUp,
}: {
  module: Module;
  index: number;
  role: FounderType;
  saved: Saved;
  done: Set<string>;
  onOpen: (id: string) => void;
  onLevelUp: (level: number) => void;
}) {
  const Icon = roleIcons[role.id];
  const prev = modules[index - 1];
  const next = modules[index + 1];
  const [open, setOpen] = useState<string | null>(m.tasks.find((q) => !done.has(q.id))?.id ?? null);

  const complete = (q: Quest) => {
    const count = allTasks.filter((t) => done.has(t.id)).length;
    save({ ...saved, done: [...saved.done, q.id] });
    if (levelFor(count + 1) > levelFor(count)) onLevelUp(levelFor(count + 1));
    setOpen(m.tasks.find((t) => t.id !== q.id && !done.has(t.id))?.id ?? null);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      className="min-w-0 space-y-8"
    >
      <header>
        <p className="font-mono text-xs text-white/40">
          Модуль {num(index)} / {modules.length}
        </p>
        <h4 className={cn(display, "mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl")}>{m.title}</h4>
        <p className="mt-2 text-lg text-white/55">{m.promise}</p>
      </header>

      {/* The lesson video; a placeholder until it's recorded and uploaded to Bunny. */}
      <div className="relative grid aspect-video place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_30%_20%,rgba(251,146,60,.18),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(167,139,250,.16),transparent_55%),#0d0d14]">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur">
            <Play className="ml-1 size-6 fill-white/80 text-white/80" />
          </span>
          <p className="text-sm text-white/50">
            Видео бэлтгэгдэж байна · ~{m.minutes} мин
          </p>
        </div>
      </div>

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Гол санаа</p>
        <ol className="mt-4 space-y-3">
          {m.points.map((point, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 font-mono text-xs text-white/30">{num(i)}</span>
              <span className="leading-relaxed text-white/80">{point}</span>
            </li>
          ))}
        </ol>
        {m.note && (
          <p className="mt-5 flex gap-2 text-xs leading-relaxed text-white/40">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            {m.note}
          </p>
        )}
      </section>

      <div className="flex gap-4 rounded-2xl border p-5" style={{ borderColor: `${role.color}40`, background: `${role.color}0d` }}>
        <Icon className="mt-0.5 size-5 shrink-0" style={{ color: role.color }} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: role.color }}>
            {role.name}-д зориулсан
          </p>
          <p className="mt-1.5 leading-relaxed text-white/85">{m.tips[role.id]}</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            <Lightbulb className="size-3.5" />
            Даалгавар
          </p>
          <p className="text-xs text-white/40">
            {m.tasks.filter((q) => done.has(q.id)).length}/{m.tasks.length}
          </p>
        </div>
        <ul className="mt-4 space-y-3">
          {m.tasks.map((q) => (
            <Task
              key={q.id}
              task={q}
              role={role}
              done={done.has(q.id)}
              open={open === q.id}
              onToggle={() => setOpen(open === q.id ? null : q.id)}
              onComplete={() => complete(q)}
              onUndo={() => save({ ...saved, done: saved.done.filter((id) => id !== q.id) })}
            />
          ))}
        </ul>
      </section>

      <nav className="flex items-center justify-between gap-4 border-t border-white/5 pt-6">
        {prev ? (
          <button onClick={() => onOpen(prev.id)} className="group min-w-0 text-left">
            <span className="flex items-center gap-1 text-xs text-white/40">
              <ArrowLeft className="size-3.5" /> Өмнөх
            </span>
            <span className="mt-1 block truncate text-sm font-medium text-white/80 group-hover:text-white">{prev.title}</span>
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button
            onClick={() => onOpen(next.id)}
            className="group flex min-w-0 items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
          >
            <span className="truncate">Дараагийнх: {next.title}</span>
            <ArrowRight className="size-4 shrink-0" />
          </button>
        )}
      </nav>
    </motion.article>
  );
}

function Task({
  task,
  role,
  done,
  open,
  onToggle,
  onComplete,
  onUndo,
}: {
  task: Quest;
  role: FounderType;
  done: boolean;
  open: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onUndo: () => void;
}) {
  const reward = rewardFor(task, role);
  const doubled = reward > task.reward;
  // Show the tick and "+N оч" for a moment before the task collapses.
  const [ticking, setTicking] = useState(false);
  const checked = done || ticking;

  function tick() {
    setTicking(true);
    setTimeout(() => {
      onComplete();
      setTicking(false);
    }, 450);
  }

  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors",
        done ? "border-white/5" : open ? "border-white/20 bg-white/[0.05]" : "border-white/10 hover:border-white/20",
      )}
    >
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <button
          onClick={done ? onUndo : tick}
          disabled={ticking}
          aria-label={done ? "Буцааж нээх" : "Дууссан гэж тэмдэглэх"}
          className={cn(
            "relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-300",
            checked ? "scale-110 border-transparent" : "border-white/25 hover:border-white/60",
          )}
          style={checked ? { background: role.color } : undefined}
        >
          {checked && <Check className="size-3.5 text-black" strokeWidth={3} />}
          {ticking && (
            <motion.span
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -26 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-amber-200"
            >
              +{reward} оч
            </motion.span>
          )}
        </button>

        <button onClick={onToggle} disabled={done} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-white/40">
            {task.boss && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-white/80">
                <Flag className="size-3" />
                Зорилго
              </span>
            )}
            <span>{skills[task.skill]}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {task.time}
            </span>
            {doubled && !done && <span style={{ color: role.color }}>2× оч · таны сорилт</span>}
          </span>
          <span className={cn("mt-1.5 block font-semibold", done && "text-white/40 line-through decoration-white/20")}>
            {task.title}
          </span>
          {!done && <span className="mt-1 block text-sm leading-relaxed text-white/55">{task.why}</span>}
        </button>

        <span className={cn("shrink-0 text-sm font-semibold tabular-nums", done ? "text-white/30" : "text-amber-200")}>
          +{reward}
        </span>
        {!done && <ChevronDown className={cn("mt-0.5 size-4 shrink-0 text-white/30 transition-transform", open && "rotate-180")} />}
      </div>

      <AnimatePresence initial={false}>
        {open && !done && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-white/5 px-4 pb-5 pt-4 sm:pl-[3.75rem] sm:pr-5">
              <ol className="space-y-2.5 text-sm text-white/80">
                {task.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-semibold text-white/70">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/60">
                <span className="font-medium text-white/85">Дууссаныг яаж мэдэх вэ: </span>
                {task.proof}
              </p>
              <button
                onClick={tick}
                disabled={ticking}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                <Check className="size-4" />
                Дууссан · +{reward} оч
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
