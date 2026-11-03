import { cn } from "@/lib/utils";

// Building blocks available in every article .mdx file (registered in mdx-components.tsx).
// Each one opts out of `prose` styling and owns its spacing.

const block = "not-prose my-8 first:mt-0";

export function YouTube({ id, title }: { id: string; title: string }) {
  return (
    <div className={cn(block, "rounded-xl overflow-hidden aspect-video bg-muted")}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

// Tailwind only ships classes it can see written out in full.
const aspects = {
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  video: "aspect-video",
};

export function Photo({
  src,
  alt,
  aspect,
  top,
  dark,
}: {
  src: string;
  alt: string;
  /** Crop to a fixed ratio; omit to show the whole image. */
  aspect?: keyof typeof aspects;
  /** Anchor the crop to the top of the image (keeps faces in frame). */
  top?: boolean;
  /** Dark backdrop, for slides and screenshots. */
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        block,
        "rounded-xl overflow-hidden",
        dark ? "bg-zinc-900" : "bg-muted",
        aspect && aspects[aspect],
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("w-full", aspect && "h-full object-cover", top && "object-top")}
      />
    </div>
  );
}

export function PhotoGrid({ children }: { children: React.ReactNode }) {
  return <div className={cn(block, "grid grid-cols-2 gap-3 *:my-0")}>{children}</div>;
}

export function CardGrid({
  children,
  stack,
}: {
  children: React.ReactNode;
  /** One column on phones, two from `sm` up. */
  stack?: boolean;
}) {
  return (
    <div className={cn(block, "grid gap-3", stack ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2")}>
      {children}
    </div>
  );
}

const card = "rounded-xl border border-border bg-muted/20 px-5 py-4";

/** Big number with a caption underneath. */
export function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className={card}>
      <p className={cn("text-3xl font-black mb-1", highlight ? "text-orange-500" : "text-foreground")}>
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Small label, bold amount, small note. */
export function Benefit({ label, amount, note }: { label: string; amount: string; note?: string }) {
  return (
    <div className={card}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-bold">{amount}</p>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
