"use client";

import { createContext, Fragment, useContext, useLayoutEffect, useRef } from "react";
import type { Copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

// The landing's texts come from lib/copy.ts (saved in the database, editable at /founders/edit).
// <Text> shows one of them; in edit mode it becomes editable in place.

const GREEN = "#37f59a";

type Value = { copy: Copy; edit: boolean; set: (key: string, value: string) => void };
const CopyContext = createContext<Value>({ copy: {}, edit: false, set: () => {} });

export const CopyProvider = CopyContext.Provider;

/** The text for a key, with the *stars* taken out — for places that can't show highlights. */
export function usePlain() {
  const { copy } = useContext(CopyContext);
  return (key: string, fallback = "") => (copy[key] ?? fallback).replace(/\*/g, "");
}

export const useEditing = () => useContext(CopyContext).edit;

/** Words wrapped in *stars* are highlighted: in green, or as a green marker. */
export function Rich({ text, mark = "color" }: { text: string; mark?: "color" | "marker" }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) => {
    if (!(part.length > 2 && part.startsWith("*") && part.endsWith("*"))) return <Fragment key={i}>{part}</Fragment>;
    const word = part.slice(1, -1);
    return mark === "marker" ? (
      <mark key={i} className="whitespace-nowrap rounded-md px-1 font-black text-black" style={{ background: GREEN }}>
        {word}
      </mark>
    ) : (
      <span key={i} style={{ color: GREEN }}>
        {word}
      </span>
    );
  });
}

type Tag = "span" | "p" | "h1" | "h2";

export function Text({ k, as: Tag = "span", mark, className }: { k: string; as?: Tag; mark?: "color" | "marker"; className?: string }) {
  const { copy, edit, set } = useContext(CopyContext);
  const value = copy[k] ?? "";
  if (!edit) {
    return (
      <Tag className={className}>
        <Rich text={value} mark={mark} />
      </Tag>
    );
  }
  return <Editable k={k} Tag={Tag} value={value} set={set} className={className} />;
}

/**
 * The text as typed, stars and all. The DOM owns what's typed: React sets it once and is told about
 * each change, so the caret doesn't jump while editing.
 */
function Editable({ k, Tag, value, set, className }: { k: string; Tag: Tag; value: string; set: Value["set"]; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const initial = useRef(value);
  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = initial.current;
  }, []);

  return (
    <Tag
      ref={ref as never}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      data-copy={k}
      onInput={(e) => set(k, (e.currentTarget.textContent ?? "").replace(/\s+/g, " ").trim())}
      onKeyDown={(e) => {
        // One line per text: Enter finishes editing instead of adding a line break.
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={cn(
        className,
        "cursor-text rounded-lg outline-1 outline-offset-4 outline-dashed outline-white/30 transition-[outline-color] hover:outline-white/60 focus:outline-2 focus:outline-solid focus:outline-[#37f59a]",
      )}
    />
  );
}
