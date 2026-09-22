import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Languages, Check, Download, UserRound, Sprout, BookOpen } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const KEY = "ruang-module-progress-v1";

export const ModulePage = ({ t, lang, onToggleLang }) => {
  const [done, setDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(saved) && saved.length === 7 ? saved : Array(7).fill(false);
    } catch {
      return Array(7).fill(false);
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(done));
  }, [done]);

  const toggle = (i) => setDone((d) => d.map((v, idx) => (idx === i ? !v : v)));
  const finished = done.filter(Boolean).length;

  return (
    <div data-testid="module-page" className="min-h-screen bg-ink text-stone-100">
      <header className="print-hidden border-b border-amber-500/10 bg-ink/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a
            data-testid="module-back-link"
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-amber-400 transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            {t.dash.back}
          </a>
          <button
            data-testid="module-lang-toggle-btn"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-1.5 border border-stone-700 hover:border-amber-500/60 rounded-full text-xs font-mono text-stone-300 hover:text-amber-400 transition-colors duration-300"
          >
            <Languages size={13} />
            {lang === "id" ? "EN" : "ID"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-4 flex items-center gap-3">
            <BookOpen size={14} />
            {t.module.overline}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight max-w-2xl">
            {t.module.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg font-light text-stone-300 leading-relaxed">
            {t.module.desc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 min-w-[16rem]">
              <div className="flex-1 h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <motion.div
                  data-testid="module-progress-bar"
                  className="h-full bg-amber-500"
                  animate={{ width: `${(finished / 7) * 100}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
              <p data-testid="module-progress-label" className="text-xs font-mono text-stone-500 whitespace-nowrap">
                {t.module.progress(finished)}
              </p>
            </div>
            <button
              data-testid="module-download-btn"
              onClick={() => window.print()}
              className="print-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.35)] transition-[background-color,box-shadow] duration-300"
            >
              <Download size={14} />
              {t.module.download}
            </button>
          </div>
        </motion.div>

        <div className="mt-14 space-y-5">
          {t.module.days.map((day, i) => (
            <motion.article
              key={i}
              data-testid={`module-day-card-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: Math.min(i * 0.06, 0.3), ease: EASE }}
              className={`print-card rounded-2xl border p-7 sm:p-8 transition-[border-color,background-color] duration-500 ${
                done[i] ? "border-[#84A98C]/40 bg-[#84A98C]/5" : "border-stone-800 bg-surface/60"
              }`}
            >
              <div className="flex items-start gap-6">
                <span
                  aria-hidden="true"
                  className="font-serif text-5xl sm:text-6xl leading-none select-none text-transparent shrink-0"
                  style={{ WebkitTextStroke: `1px ${done[i] ? "rgba(132,169,140,0.6)" : "rgba(245,158,11,0.4)"}` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-100">{day.theme}</h2>
                  <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-stone-800/80 p-5">
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400/80 flex items-center gap-2">
                        <UserRound size={12} />
                        {t.module.forParent}
                      </p>
                      <p className="mt-3 text-sm sm:text-base font-light text-stone-300 leading-relaxed">
                        {day.parent}
                      </p>
                    </div>
                    <div className="rounded-xl border border-stone-800/80 p-5">
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#84A98C] flex items-center gap-2">
                        <Sprout size={12} />
                        {i === 6 ? t.module.together : t.module.forSon}
                      </p>
                      <p className="mt-3 text-sm sm:text-base font-light text-stone-300 leading-relaxed">
                        {day.son}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  data-testid={`module-day-toggle-${i}`}
                  onClick={() => toggle(i)}
                  className={`print-hidden shrink-0 w-11 h-11 rounded-full border flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-300 ${
                    done[i]
                      ? "bg-[#84A98C]/20 border-[#84A98C]/60 shadow-[0_0_20px_rgba(132,169,140,0.25)]"
                      : "border-stone-700 hover:border-amber-500/50"
                  }`}
                  aria-label={done[i] ? t.module.done : t.module.mark}
                >
                  <Check size={17} className={done[i] ? "text-[#84A98C]" : "text-stone-600"} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-12 text-xs font-light text-stone-500 leading-relaxed border-t border-stone-800 pt-6">
          {t.test.disclaimer}
        </p>
      </main>
    </div>
  );
};
