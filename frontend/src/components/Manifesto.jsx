import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const Chapter = ({ chapter, index, flip }) => (
  <motion.article
    data-testid={`manifesto-chapter-${index + 1}`}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-120px" }}
    transition={{ duration: 1, ease: EASE }}
    className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${flip ? "" : ""}`}
  >
    <div className={flip ? "lg:order-2" : ""}>
      <div className="flex items-start gap-6">
        <span
          aria-hidden="true"
          className="font-serif text-7xl sm:text-8xl leading-none select-none text-transparent shrink-0"
          style={{ WebkitTextStroke: "1px rgba(245, 158, 11, 0.4)" }}
        >
          {chapter.num}
        </span>
        <div className="pt-3">
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-stone-100">
            {chapter.title}
          </h3>
          <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed max-w-xl">
            {chapter.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-10">
            {chapter.stats.map((s) => (
              <div key={s.value}>
                <p
                  className={`font-serif text-5xl sm:text-6xl font-semibold ${
                    s.value === "70%" ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-xs font-mono uppercase tracking-[0.15em] text-stone-500 max-w-[12rem] leading-relaxed">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className={`${flip ? "lg:order-1" : ""} ${chapter.image ? "" : "hidden lg:block"}`}>
      {chapter.image ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          className={`relative ${flip ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"}`}
        >
          <div className="absolute -inset-3 border border-amber-500/15 rounded-2xl rotate-[1deg]" aria-hidden="true" />
          <div className="absolute -inset-12 bg-amber-500/5 blur-3xl rounded-full" aria-hidden="true" />
          <img
            src={chapter.image}
            alt={chapter.title}
            loading="lazy"
            className="relative w-full aspect-[4/3] object-cover rounded-xl border border-amber-500/20 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sepia-[0.3] contrast-[1.05] brightness-[0.85]"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden="true" />
        </motion.div>
      ) : (
        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full bg-red-500/10 blur-[90px]" aria-hidden="true" />
          <p
            aria-hidden="true"
            className="font-serif italic text-[9rem] leading-none select-none text-transparent"
            style={{ WebkitTextStroke: "1px rgba(239, 68, 68, 0.35)" }}
          >
            {chapter.stats[0].value}
          </p>
        </div>
      )}
    </div>
  </motion.article>
);

export const Manifesto = ({ t }) => (
  <div data-testid="manifesto-section" className="relative py-28 sm:py-36">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-20 sm:mb-28"
      >
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5">
          {t.manifesto.overline}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 max-w-2xl leading-tight">
          {t.manifesto.title}
        </h2>
      </motion.div>

      <div className="space-y-28 sm:space-y-36">
        {t.manifesto.chapters.map((c, i) => (
          <Chapter key={c.num} chapter={c} index={i} flip={i % 2 === 1} />
        ))}
      </div>
    </div>
  </div>
);
