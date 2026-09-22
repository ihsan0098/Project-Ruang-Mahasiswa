import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const VideoSection = ({ t }) => (
  <div data-testid="video-section" className="relative py-28 sm:py-36 bg-surface/40 border-y border-amber-500/10">
    <div className="absolute top-0 left-1/3 w-[28rem] h-[28rem] rounded-full bg-amber-500/5 blur-[110px]" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5 flex items-center gap-3">
          <Clapperboard size={14} />
          {t.film.overline}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
          {t.film.title}
        </h2>
        <p className="mt-6 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
          {t.film.synopsis}
        </p>
        <blockquote className="mt-8 pl-5 border-l-2 border-amber-500/50 font-serif italic text-lg sm:text-xl text-amber-200/80 leading-relaxed">
          {t.film.logline}
        </blockquote>
        <div className="mt-8 flex flex-wrap gap-3">
          {t.film.chips.map((chip) => (
            <span
              key={chip}
              className="px-4 py-1.5 rounded-full border border-stone-700/80 text-[11px] font-mono uppercase tracking-[0.15em] text-stone-400"
            >
              {chip}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.1, ease: EASE }}
        className="relative"
      >
        <div className="absolute -inset-8 bg-amber-500/10 blur-3xl rounded-full" aria-hidden="true" />
        <div className="absolute -top-4 -left-4 w-10 h-10 border-t border-l border-amber-500/50" aria-hidden="true" />
        <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b border-r border-amber-500/50" aria-hidden="true" />
        <div
          data-testid="youtube-iframe-container"
          className="relative rounded-2xl overflow-hidden border border-amber-500/25 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        >
          <div className="aspect-video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/bcGpVvJwYKw?rel=0"
              title="Project Ruang — Film Sinematik LIDM 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
        <p className="mt-5 text-center text-xs font-mono uppercase tracking-[0.2em] text-stone-500">
          {t.film.note}
        </p>
      </motion.div>
    </div>
  </div>
);
