import { Sparkle } from "lucide-react";

export const Marquee = ({ items }) => (
  <div
    data-testid="editorial-marquee"
    className="relative py-10 sm:py-14 border-y border-amber-500/10 bg-ink overflow-hidden"
  >
    <div className="marquee-track flex w-max whitespace-nowrap">
      {[...items, ...items, ...items, ...items].map((q, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-10 px-10 font-serif italic text-2xl sm:text-4xl text-stone-500"
        >
          {q}
          <Sparkle size={16} className="text-amber-500/50 shrink-0" />
        </span>
      ))}
    </div>
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent pointer-events-none" aria-hidden="true" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink to-transparent pointer-events-none" aria-hidden="true" />
  </div>
);
