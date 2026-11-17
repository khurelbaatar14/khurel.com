"use client";

import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { animate, AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Gift, ListChecks, Lock, PartyPopper, PenLine, Play, RotateCcw, Zap } from "lucide-react";
import DiilLogo from "@/components/founder/DiilLogo";
import Orbit, { Face } from "@/components/founder/Orbit";
import SearchLoop from "@/components/founder/SearchLoop";
import { founderTypes, phases, rewardFor, skills, type FounderType, type Phase } from "@/lib/founder";
import { modules, type Module } from "@/lib/founder-course";
import {
  MEETING_COST,
  NOTE_SPARKS,
  VIDEO_SPARKS,
  isDone,
  pathFor,
  rewards,
  stageEarned,
  stageGoal,
  stepSparks,
  totalEarned,
  type Step,
  type StepLog,
} from "@/lib/diil";
import { cn } from "@/lib/utils";

// Draft: progress lives in this browser only (localStorage): the role, the stage, the furthest
// stage unlocked, each step's video/task/reflection, and sparks spent on meetings.
type Saved = {
  role: FounderType["id"] | null;
  stage: Phase["id"] | null;
  /** Index of the furthest unlocked stage; -1 until a stage is picked. */
  reached: number;
  step: string | null;
  logs: Record<string, StepLog>;
  spent: number;
  met: FounderType["id"][];
};
const KEY = "diil-startups-v1";
const EMPTY = JSON.stringify({ role: null, stage: null, reached: -1, step: null, logs: {}, spent: 0, met: [] });
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
    const isRole = (id: unknown): id is FounderType["id"] => founderTypes.some((t) => t.id === id);
    return {
      role: isRole(v?.role) ? v.role : null,
      stage: phases.some((p) => p.id === v?.stage) ? v.stage : null,
      reached: Number.isInteger(v?.reached) ? Math.min(Math.max(v.reached, -1), phases.length - 1) : -1,
      step: typeof v?.step === "string" ? v.step : null,
      logs: v?.logs && typeof v.logs === "object" ? v.logs : {},
      spent: Number.isFinite(v?.spent) ? Math.max(0, v.spent) : 0,
      met: Array.isArray(v?.met) ? v.met.filter(isRole) : [],
    };
  } catch {
    return parse(EMPTY);
  }
}

// The sticker palette: black page, near-black cards, one bright colour per kind of thing.
const GREEN = "#37f59a"; // sparks and progress
const kinds = {
  video: { color: "#3d7bff", icon: Play },
  task: { color: "#ff8a3d", icon: ListChecks },
  note: { color: "#ff5fa8", icon: PenLine },
};
const stageColors = ["#3d7bff", "#ff8a3d", "#ff5fa8", GREEN];
const card = "rounded-3xl border border-[#222226] bg-[#121214]";
const ease = [0.22, 1, 0.36, 1] as const;
const noop = () => () => {};
// Founders in the order a team is usually introduced.
const team = ["hustler", "hacker", "hipster"].map((id) => founderTypes.find((t) => t.id === id)!);

export default function FounderPath() {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  // The server can't see saved progress, so it renders the first screen. On the first client render,
  // jump straight to what was saved: a new presence key skips the crossfade.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const mount = hydrated ? "live" : "ssr";
  const saved = useMemo(() => parse(raw), [raw]);
  const role = founderTypes.find((t) => t.id === saved.role);
  const [picking, setPicking] = useState(false);
  // The stage just unlocked, shown for a few seconds.
  const [unlocked, setUnlocked] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    const timer = setTimeout(() => setUnlocked(null), 4500);
    return () => clearTimeout(timer);
  }, [unlocked]);

  // Unlocks follow from the sparks themselves, so they can't fall behind (e.g. after content changes).
  const state = role ? { ...saved, reached: reachedWith(role, saved) } : saved;
  const earned = role ? totalEarned(role, saved.logs) : 0;
  const balance = Math.max(0, earned - saved.spent);
  const phase = phases.find((p) => p.id === saved.stage);
  const screen = !role ? "role" : !phase || picking ? "stage" : "path";

  function top() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pickRole(id: FounderType["id"]) {
    save({ ...saved, role: id });
    top();
  }

  function pickStage(i: number) {
    save({ ...state, stage: phases[i].id, reached: Math.max(state.reached, i), step: null });
    setPicking(false);
    top();
  }

  function award(step: Step, patch: StepLog) {
    if (!role) return;
    const logs = { ...saved.logs, [step.id]: { ...saved.logs[step.id], ...patch } };
    const reached = reachedWith(role, { ...saved, logs });
    if (reached > state.reached) setUnlocked(phases[reached].name);
    // Stay on this step so its "done" moment shows before moving on.
    save({ ...saved, logs, reached, step: step.id });
  }

  function meet(id: FounderType["id"]) {
    if (balance < MEETING_COST || saved.met.includes(id)) return;
    save({ ...saved, spent: saved.spent + MEETING_COST, met: [...saved.met, id] });
  }

  return (
    // overflow-clip, not -hidden: a hidden box can still be scrolled sideways (e.g. focusing an orbiting
    // founder near the edge), and it would stop the top bar from sticking.
    <div className="min-h-screen overflow-clip bg-black font-[family-name:var(--font-display)] text-white antialiased selection:bg-[#37f59a] selection:text-black">
      <TopBar balance={balance} />

      <AnimatePresence key={mount} mode="wait" initial={false}>
        {screen === "role" && <RoleScreen key="role" onPick={pickRole} />}
        {screen === "stage" && role && (
          <StageScreen
            key="stage"
            role={role}
            saved={state}
            onPick={pickStage}
            onBack={phase ? () => setPicking(false) : undefined}
            onRole={() => save({ ...saved, role: null })}
          />
        )}
        {screen === "path" && role && phase && (
          <Journey
            key="path"
            role={role}
            phase={phase}
            saved={state}
            earned={earned}
            balance={balance}
            onAward={award}
            onOpen={(id) => save({ ...saved, step: id })}
            onStage={pickStage}
            onChangeStage={() => {
              setPicking(true);
              top();
            }}
            onRole={() => save({ ...saved, role: null })}
            onMeet={meet}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unlocked && (
          <motion.button
            key={unlocked}
            onClick={() => setUnlocked(null)}
            role="status"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 22 } }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.2 } }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-4 rounded-3xl bg-white p-4 pr-5 text-left text-black shadow-2xl sm:bottom-6"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl" style={{ background: GREEN }}>
              <PartyPopper className="size-6" strokeWidth={2.25} />
            </span>
            <span>
              <span className="block text-sm font-bold text-black/50">Шинэ шат нээгдлээ</span>
              <span className="block text-xl font-black tracking-tight">{unlocked}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="border-t border-[#1a1a1e]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm font-medium text-[#6b6b75] sm:flex-row sm:px-6">
          <p>Туршилтын хувилбар · Явц чинь зөвхөн энэ төхөөрөмж дээр хадгалагдана.</p>
          <button
            onClick={() => {
              setPicking(false);
              save(parse(EMPTY));
            }}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <RotateCcw className="size-3.5" />
            Дахин эхлэх
          </button>
        </div>
      </footer>
    </div>
  );
}

/** The furthest open stage: the saved one, plus each next stage whose unlock line the one before has passed. */
function reachedWith(role: FounderType, saved: Saved) {
  let reached = saved.reached;
  while (reached >= 0 && reached < phases.length - 1 && stageEarned(role, phases[reached], saved.logs) >= stageGoal(role, phases[reached]).unlock) {
    reached++;
  }
  return reached;
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

function TopBar({ balance }: { balance: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1a1a1e] bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/founders" className="flex items-center gap-2.5">
          <DiilLogo className="h-[22px] w-auto text-white" />
          <span className="text-sm font-semibold text-[#9a9aa6]">for startups</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-black text-black" style={{ background: GREEN }}>
          <Zap className="size-4 fill-black" />
          <Counter value={balance} /> оч
        </span>
      </div>
    </header>
  );
}

/** The three onboarding steps: role, stage, then the path itself. */
function Progress({ at }: { at: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm font-bold">
      {["Үүрэг", "Шат", "Аялал"].map((label, i) => (
        <li key={label} className={cn("flex items-center gap-2", i <= at ? "text-white" : "text-[#55555f]")}>
          <span
            className={cn(
              "grid size-7 place-items-center rounded-full text-xs font-black",
              i < at ? "text-black" : i === at ? "bg-white text-black" : "bg-[#18181b] text-[#55555f]",
            )}
            style={i < at ? { background: GREEN } : undefined}
          >
            {i < at ? <Check className="size-4" strokeWidth={3} /> : i + 1}
          </span>
          {label}
          {i < 2 && <span className="mx-1 h-[2px] w-6 rounded-full bg-[#2a2a30]" />}
        </li>
      ))}
    </ol>
  );
}

const screenMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18 } },
};

function RoleScreen({ onPick }: { onPick: (id: FounderType["id"]) => void }) {
  return (
    <motion.section {...screenMotion} className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:pt-14">
      <Progress at={0} />
      <div className="mt-8 grid items-center gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <h1 className="text-[2.75rem] font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">Чи ямар үүсгэн байгуулагч вэ?</h1>
          <p className="mt-5 max-w-md text-lg font-medium leading-relaxed text-[#9a9aa6]">
            Нэгийг нь сонго. Чамд тохирсон замыг гаргаад өгье. Дараа нь сольж болно.
          </p>
          <div className="mt-8 grid gap-3">
            {team.map((t) => (
              <button
                key={t.id}
                onClick={() => onPick(t.id)}
                className={cn(card, "group flex items-center gap-4 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--c)]")}
                style={{ "--c": t.color } as React.CSSProperties}
              >
                <span
                  className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl text-black transition-transform duration-200 group-hover:-rotate-6"
                  style={{ background: t.color }}
                >
                  <Face type={t} size={56} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tight">{t.title}</span>
                    <span className="text-sm font-semibold text-[#6b6b75]">{t.name}</span>
                  </span>
                  <span className="mt-0.5 block text-[15px] font-medium text-[#c8c8d0]">{t.strength}</span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#1c1c20] transition-colors group-hover:bg-white group-hover:text-black">
                  <ArrowRight className="size-5" />
                </span>
              </button>
            ))}
          </div>
        </div>
        <Orbit onPick={onPick} />
      </div>
    </motion.section>
  );
}

function RoleChip({ role, onRole }: { role: FounderType; onRole: () => void }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl text-black" style={{ background: role.color }}>
        <Face type={role} size={36} />
      </span>
      <span className="font-black">{role.title}</span>
      <button onClick={onRole} className="text-sm font-semibold text-[#6b6b75] underline-offset-4 transition-colors hover:text-white hover:underline">
        солих
      </button>
    </span>
  );
}

function StageScreen({
  role,
  saved,
  onPick,
  onBack,
  onRole,
}: {
  role: FounderType;
  saved: Saved;
  onPick: (i: number) => void;
  onBack?: () => void;
  onRole: () => void;
}) {
  const first = saved.reached < 0;
  return (
    <motion.section {...screenMotion} className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:pt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Progress at={1} />
        <RoleChip role={role} onRole={onRole} />
      </div>
      <h1 className="mt-8 max-w-3xl text-[2.75rem] font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
        Стартап чинь одоо хаана явж байна?
      </h1>
      <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-[#9a9aa6]">
        {first ? "Үнэнээ сонго. Тэндээсээ эхэлнэ." : "Түгжээтэй шатууд оч цуглуулахаар нээгдэнэ."}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {phases.map((p, i) => {
          const locked = !first && i > saved.reached;
          const current = saved.stage === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPick(i)}
              disabled={locked}
              className={cn(
                card,
                "group flex min-h-40 flex-col justify-between gap-6 p-5 text-left transition duration-200 sm:p-6",
                locked ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5 hover:border-[var(--c)]",
                current && "border-[var(--c)]",
              )}
              style={{ "--c": stageColors[i] } as React.CSSProperties}
            >
              <span className="flex items-start justify-between">
                <span
                  className="grid size-12 place-items-center rounded-2xl text-xl font-black text-black transition-transform duration-200 group-hover:-rotate-6"
                  style={{ background: locked ? "#2a2a30" : stageColors[i] }}
                >
                  {locked ? <Lock className="size-5 text-[#9a9aa6]" /> : i + 1}
                </span>
                {current ? (
                  <span className="rounded-full px-2.5 py-1 text-xs font-black text-black" style={{ background: stageColors[i] }}>
                    Одоо энд
                  </span>
                ) : (
                  !locked && <ArrowRight className="size-5 text-[#55555f] transition-colors group-hover:text-white" />
                )}
              </span>
              <span>
                <span className="block text-2xl font-black tracking-tight sm:text-3xl">{p.name}</span>
                <span className="mt-1 block text-[15px] font-medium text-[#9a9aa6]">{p.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {onBack && (
        <button onClick={onBack} className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#9a9aa6] transition-colors hover:text-white">
          <ArrowLeft className="size-4" />
          Буцах
        </button>
      )}
    </motion.section>
  );
}

function Journey({
  role,
  phase,
  saved,
  earned,
  balance,
  onAward,
  onOpen,
  onStage,
  onChangeStage,
  onRole,
  onMeet,
}: {
  role: FounderType;
  phase: Phase;
  saved: Saved;
  earned: number;
  balance: number;
  onAward: (step: Step, patch: StepLog) => void;
  onOpen: (id: string) => void;
  onStage: (i: number) => void;
  onChangeStage: () => void;
  onRole: () => void;
  onMeet: (id: FounderType["id"]) => void;
}) {
  const steps = pathFor(role.id, phase);
  const at = phases.indexOf(phase);
  // The open step: the one picked, else the first unfinished one.
  const picked = steps.findIndex((s) => s.id === saved.step);
  const index = Math.max(0, picked >= 0 ? picked : steps.findIndex((s) => !isDone(saved.logs[s.id])));
  const current = steps[index] ?? steps[steps.length - 1];

  function open(i: number) {
    onOpen(steps[i].id);
    document.getElementById("step")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.section {...screenMotion} className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <RoleChip role={role} onRole={onRole} />
        <span className="text-[#2a2a30]">/</span>
        <button onClick={onChangeStage} className="inline-flex items-center gap-2 font-black transition-opacity hover:opacity-80">
          <span className="grid size-7 place-items-center rounded-lg text-sm text-black" style={{ background: stageColors[at] }}>
            {at + 1}
          </span>
          {phase.name}
          <span className="text-sm font-semibold text-[#6b6b75]">солих</span>
        </button>
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <StageBar role={role} phase={phase} saved={saved} />
          <Path steps={steps} logs={saved.logs} current={index} onOpen={open} />
          <div id="step" className="scroll-mt-24">
            <AnimatePresence mode="wait">
              <StepView
                key={current.id}
                step={current}
                index={index}
                count={steps.length}
                role={role}
                log={saved.logs[current.id]}
                onAward={(patch) => onAward(current, patch)}
                onNext={index < steps.length - 1 ? () => open(index + 1) : undefined}
              />
            </AnimatePresence>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Wallet balance={balance} earned={earned} spent={saved.spent} />
          <Meet balance={balance} met={saved.met} onMeet={onMeet} />
          <Stages saved={saved} at={at} onStage={onStage} />
        </aside>
      </div>
    </motion.section>
  );
}

/** Progress through this stage toward unlocking the next one. */
function StageBar({ role, phase, saved }: { role: FounderType; phase: Phase; saved: Saved }) {
  const at = phases.indexOf(phase);
  const next = phases[at + 1];
  const { total, unlock } = stageGoal(role, phase);
  const got = stageEarned(role, phase, saved.logs);
  const open = saved.reached > at;
  const share = next && !open ? Math.min(got / unlock, 1) : Math.min(got / total, 1);

  return (
    <div className={cn(card, "p-5")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-lg font-black tracking-tight">
          Түвшин {at + 1} <span className="font-bold text-[#6b6b75]">· {phase.name}</span>
        </p>
        <p className="text-sm font-bold text-[#9a9aa6]">
          {!next ? (
            <>
              {got} / {total} оч
            </>
          ) : open ? (
            <span style={{ color: GREEN }}>{next.name} нээгдсэн</span>
          ) : (
            <>
              {next.name} нээгдэхэд <span className="text-white">{unlock - got} оч</span> дутуу
            </>
          )}
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#222226]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: GREEN }}
          initial={false}
          animate={{ width: `${share * 100}%` }}
          transition={{ duration: 0.7, ease }}
        />
      </div>
    </div>
  );
}

/** The stage's steps as a row of numbered dots; finished ones turn green. */
function Path({ steps, logs, current, onOpen }: { steps: Step[]; logs: Record<string, StepLog>; current: number; onOpen: (i: number) => void }) {
  const row = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  // Keep the open step's dot in view (scrolls only the row).
  useEffect(() => {
    const el = row.current;
    const dot = el?.querySelector<HTMLElement>(`[data-step="${current}"]`);
    if (!el || !dot) return;
    el.scrollTo({ left: dot.offsetLeft - el.offsetLeft - el.clientWidth / 2 + dot.clientWidth / 2, behavior: loaded.current ? "smooth" : "instant" });
    loaded.current = true;
  }, [current]);

  return (
    <div ref={row} className="-mx-4 mt-5 flex items-center overflow-x-auto px-4 py-2 sm:mx-0 sm:px-1">
      {steps.map((s, i) => {
        const log = logs[s.id];
        const done = isDone(log);
        const on = i === current;
        return (
          <Fragment key={s.id}>
            <button
              data-step={i}
              onClick={() => onOpen(i)}
              aria-current={on ? "step" : undefined}
              aria-label={`Алхам ${i + 1}: ${s.title}`}
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full text-sm font-black transition duration-200",
                on && "scale-110 ring-4 ring-white/15",
                done ? "text-black" : on ? "bg-white text-black" : log ? "bg-[#2a2a30] text-white" : "bg-[#18181b] text-[#6b6b75] hover:text-white",
              )}
              style={done ? { background: GREEN } : undefined}
            >
              {done ? <Check className="size-5" strokeWidth={3} /> : i + 1}
            </button>
            {i < steps.length - 1 && (
              <span className="mx-1.5 h-[3px] w-5 shrink-0 rounded-full sm:w-7" style={{ background: done ? GREEN : "#222226" }} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function StepView({
  step,
  index,
  count,
  role,
  log,
  onAward,
  onNext,
}: {
  step: Step;
  index: number;
  count: number;
  role: FounderType;
  log: StepLog | undefined;
  onAward: (patch: StepLog) => void;
  onNext?: () => void;
}) {
  const m = modules.find((x) => x.id === step.video);
  const reward = rewardFor(step.task, role);
  const doubled = reward > step.task.reward;
  const [note, setNote] = useState(log?.note ?? "");

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      className="mt-6"
    >
      <p className="text-sm font-bold text-[#6b6b75]">
        Алхам {index + 1} / {count}
      </p>
      <h2 className="mt-2 text-[2rem] font-black leading-[1.02] tracking-[-0.035em] sm:text-5xl">
        {step.title}
        {step.task.boss && (
          <span className="ml-3 inline-block -translate-y-1.5 rounded-full bg-[#ffd23d] px-2.5 py-1 align-middle text-xs font-black tracking-normal text-black">
            Том зорилго
          </span>
        )}
      </h2>

      <div className="mt-6 space-y-3">
        <Block kind="video" title="Видео үз" points={VIDEO_SPARKS} done={Boolean(log?.video)}>
          {(done) => (
            <>
              {m && <VideoTile module={m} />}
              {step.video === "startup" && <SearchLoop />}
              {!done && <Earn label="Үзлээ" points={VIDEO_SPARKS} color={kinds.video.color} onEarn={() => onAward({ video: true })} />}
            </>
          )}
        </Block>

        <Block kind="task" title="Даалгавар хий" points={reward} done={Boolean(log?.task)} locked={!log?.video} lock="Эхлээд видеогоо үз">
          {(done) => (
            <>
              <div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#6b6b75]">
                  <span>{skills[step.task.skill]}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {step.task.time}
                  </span>
                  {doubled && (
                    <>
                      <span>·</span>
                      <span style={{ color: kinds.task.color }}>2× оч — чиний сул тал</span>
                    </>
                  )}
                </p>
                <p className="mt-1.5 text-xl font-black tracking-tight">{step.task.title}</p>
                <p className="mt-1.5 font-medium leading-relaxed text-[#c8c8d0]">{step.task.why}</p>
              </div>
              <ol className="space-y-2.5">
                {step.task.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-black text-black"
                      style={{ background: kinds.task.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-medium leading-relaxed text-[#e4e4e8]">{s}</span>
                  </li>
                ))}
              </ol>
              <p className="rounded-2xl bg-[#1a1a1e] px-4 py-3 text-sm font-medium leading-relaxed text-[#c8c8d0]">
                <span className="font-black text-white">Дууссаныг яаж мэдэх вэ? </span>
                {step.task.proof}
              </p>
              {!done && <Earn label="Хийлээ" points={reward} color={kinds.task.color} onEarn={() => onAward({ task: true })} />}
            </>
          )}
        </Block>

        <Block kind="note" title="Бодоод бич" points={NOTE_SPARKS} done={Boolean(log?.note)} locked={!log?.task} lock="Эхлээд даалгавраа хий">
          {(done) => (
            <>
              <p className="text-xl font-black leading-snug tracking-tight">{step.reflect}</p>
              {done ? (
                <p className="rounded-2xl border-l-4 bg-[#1a1a1e] px-4 py-3 font-medium leading-relaxed text-[#e4e4e8]" style={{ borderColor: kinds.note.color }}>
                  {log?.note}
                </p>
              ) : (
                <>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Үнэнээ, өөрийнхөөрөө бич…"
                    className="w-full resize-y rounded-2xl border border-[#2a2a30] bg-black px-4 py-3 font-medium leading-relaxed text-white outline-none transition-colors placeholder:text-[#55555f] focus:border-[#ff5fa8]"
                  />
                  <Earn
                    label="Хадгалах"
                    points={NOTE_SPARKS}
                    color={kinds.note.color}
                    disabled={note.trim().length < 10}
                    onEarn={() => onAward({ note: note.trim() })}
                  />
                </>
              )}
            </>
          )}
        </Block>
      </div>

      <AnimatePresence>
        {isDone(log) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }}
            className="mt-4 flex flex-wrap items-center gap-4 rounded-3xl p-5 text-black"
            style={{ background: GREEN }}
          >
            <PartyPopper className="size-8 shrink-0" strokeWidth={2.25} />
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-black tracking-tight">Алхам дууслаа!</p>
              <p className="font-semibold text-black/70">+{stepSparks(step, role)} оч цуглууллаа.</p>
            </div>
            {onNext ? (
              <button onClick={onNext} className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 font-black text-white transition-transform active:translate-y-0.5">
                Дараагийн алхам
                <ArrowRight className="size-5" />
              </button>
            ) : (
              <p className="font-black">Энэ шатны бүх алхам дууслаа.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/** One part of a step. Open while it's the thing to do; done or locked parts fold, and a done part can be reopened to look back. */
function Block({
  kind,
  title,
  points,
  done,
  locked,
  lock,
  children,
}: {
  kind: keyof typeof kinds;
  title: string;
  points: number;
  done: boolean;
  locked?: boolean;
  lock?: string;
  children: (done: boolean) => React.ReactNode;
}) {
  const [peek, setPeek] = useState(false);
  const { color, icon: Icon } = kinds[kind];
  const open = !locked && (!done || peek);

  return (
    <section className={cn(card, "overflow-hidden", open && !done && "border-[#2e2e34]")}>
      <button
        onClick={() => done && setPeek(!peek)}
        disabled={!done}
        className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
        aria-expanded={open}
      >
        <span
          className={cn("grid size-10 shrink-0 place-items-center rounded-2xl text-black", locked && "opacity-30")}
          style={{ background: done ? GREEN : color }}
        >
          {done ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-5" strokeWidth={2.5} />}
        </span>
        <span className={cn("flex-1 text-lg font-black tracking-tight", locked && "text-[#55555f]")}>{title}</span>
        {locked ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#55555f]">
            <Lock className="size-3.5" />
            <span className="hidden sm:inline">{lock}</span>
          </span>
        ) : (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-black"
            style={done ? { background: GREEN, color: "#000" } : { background: "#1f1f23", color: GREEN }}
          >
            +{points}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="space-y-5 px-4 pb-5 sm:px-5 sm:pb-6">{children(done)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** The lesson video; a placeholder until it's recorded and uploaded to Bunny. */
function VideoTile({ module: m }: { module: Module }) {
  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden rounded-2xl" style={{ background: kinds.video.color }}>
      <p className="absolute left-4 right-4 top-4 text-sm font-bold text-white/90">{m.title}</p>
      <span className="grid size-16 place-items-center rounded-full bg-white shadow-xl">
        <Play className="ml-1 size-7 fill-black text-black" />
      </span>
      <span className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-xs font-bold">~{m.minutes} мин</span>
      <span className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-2 py-1 text-xs font-bold">Видео удахгүй</span>
    </div>
  );
}

/** A button that pays sparks: the "+N оч" floats up, then the part is marked done. */
function Earn({
  label,
  points,
  color,
  disabled,
  onEarn,
}: {
  label: string;
  points: number;
  color: string;
  disabled?: boolean;
  onEarn: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={() => {
        setBusy(true);
        setTimeout(() => {
          onEarn();
          setBusy(false);
        }, 450);
      }}
      disabled={disabled || busy}
      className="relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[15px] font-black text-black transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: color }}
    >
      <Check className="size-5" strokeWidth={3} />
      {label} · +{points} оч
      {busy && (
        <motion.span
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -36 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-black"
          style={{ color: GREEN }}
        >
          +{points} оч
        </motion.span>
      )}
    </button>
  );
}

function Wallet({ balance, earned, spent }: { balance: number; earned: number; spent: number }) {
  return (
    <div className="rounded-3xl p-5 text-black" style={{ background: GREEN }}>
      <p className="flex items-center gap-1.5 text-sm font-bold">
        <Zap className="size-4 fill-black" />
        Чиний оч
      </p>
      <p className="mt-1 text-5xl font-black tracking-tighter">
        <Counter value={balance} />
      </p>
      <p className="mt-2 text-sm font-semibold text-black/60">
        Нийт {earned.toLocaleString("en-US")} цуглуулсан · {spent.toLocaleString("en-US")} зарцуулсан
      </p>
    </div>
  );
}

/** Spend sparks on a meeting with one of the DIIL co-founders. */
function Meet({ balance, met, onMeet }: { balance: number; met: FounderType["id"][]; onMeet: (id: FounderType["id"]) => void }) {
  // The founder whose "Уулзах" was tapped once: a second tap within a few seconds confirms.
  const [arming, setArming] = useState<FounderType["id"] | null>(null);
  useEffect(() => {
    if (!arming) return;
    const timer = setTimeout(() => setArming(null), 3500);
    return () => clearTimeout(timer);
  }, [arming]);

  return (
    <div className="rounded-3xl bg-[#ff5fa8] p-5 text-black">
      <p className="text-xl font-black leading-tight tracking-tight">Үүсгэн байгуулагчидтай уулз</p>
      <p className="mt-1 text-sm font-semibold text-black/65">Очоо уулзалтаар соль. Нэг уулзалт — {MEETING_COST} оч.</p>
      <ul className="mt-4 space-y-2">
        {team.map((t) => {
          const booked = met.includes(t.id);
          const short = MEETING_COST - balance;
          return (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-black/10 p-2.5">
              <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl text-black" style={{ background: t.color }}>
                <Face type={t} size={40} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black">{t.title}</span>
                <span className="block text-xs font-semibold text-black/60">DIIL-ийн үүсгэн байгуулагч</span>
              </span>
              {booked ? (
                <Link href="/contact" className="rounded-xl bg-black px-3 py-2 text-xs font-black text-white">
                  Цагаа товлох
                </Link>
              ) : short > 0 ? (
                <span className="text-right text-xs font-bold leading-tight text-black/60">
                  {short} оч
                  <br />
                  дутуу
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (arming === t.id) {
                      onMeet(t.id);
                      setArming(null);
                    } else {
                      setArming(t.id);
                    }
                  }}
                  className="rounded-xl bg-black px-3 py-2 text-xs font-black text-white transition-transform active:translate-y-0.5"
                >
                  {arming === t.id ? `${MEETING_COST} оч зарцуулах уу?` : "Уулзах"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** All four stages: open ones can be revisited, the rest unlock with sparks. */
function Stages({ saved, at, onStage }: { saved: Saved; at: number; onStage: (i: number) => void }) {
  return (
    <div className={cn(card, "p-5")}>
      <p className="text-lg font-black tracking-tight">Шатууд</p>
      <ul className="mt-3 space-y-1">
        {phases.map((p, i) => {
          const open = i <= saved.reached;
          const reward = rewards[p.id];
          return (
            <li key={p.id}>
              <button
                onClick={() => onStage(i)}
                disabled={!open || i === at}
                className={cn("flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors", open && i !== at && "hover:bg-[#1a1a1e]")}
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black"
                  style={open ? { background: stageColors[i], color: "#000" } : { background: "#1a1a1e", color: "#55555f" }}
                >
                  {open ? i + 1 : <Lock className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-bold", !open && "text-[#6b6b75]")}>{p.name}</span>
                  {reward && (
                    <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#9a9aa6]">
                      <Gift className="size-3.5" />
                      {reward}
                    </span>
                  )}
                </span>
                {i === at && (
                  <span className="text-xs font-black" style={{ color: GREEN }}>
                    Одоо
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
