import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, BookOpen } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const ProSection = ({ t }) => (
  <div data-testid="pro-section" className="relative py-24 sm:py-32 bg-surface/40 border-y border-amber-500/10 overflow-hidden">
    <div className="absolute -top-24 right-1/4 w-[26rem] h-[26rem] rounded-full bg-[#84A98C]/5 blur-[110px]" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5 flex items-center gap-3">
          <ShieldCheck size={14} />
          {t.pro.overline}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
          {t.pro.title}
        </h2>
        <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
          {t.pro.desc}
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <a
            data-testid="pro-dashboard-link"
            href="/validasi"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-amber-500 text-stone-950 text-sm font-medium hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.35)] transition-[background-color,box-shadow] duration-300"
          >
            <BarChart3 size={15} />
            {t.pro.ctaDash}
          </a>
          <a
            data-testid="pro-module-link"
            href="/modul"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-stone-700 text-stone-200 text-sm hover:border-amber-500/60 hover:text-amber-300 transition-[border-color,color] duration-300"
          >
            <BookOpen size={15} />
            {t.pro.ctaModule}
          </a>
        </div>
      </motion.div>

      <div className="space-y-0">
        {t.pro.steps.map((s, i) => (
          <motion.div
            key={s.num}
            data-testid={`pro-step-${i}`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className="flex items-start gap-6 py-7 border-b border-stone-800/80 last:border-b-0 group"
          >
            <span
              aria-hidden="true"
              className="font-serif text-4xl sm:text-5xl leading-none select-none text-transparent shrink-0"
              style={{ WebkitTextStroke: "1px rgba(245, 158, 11, 0.4)" }}
            >
              {s.num}
            </span>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-100 group-hover:text-amber-200 transition-colors duration-300">
                {s.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base font-light text-stone-400 leading-relaxed max-w-xl">
                {s.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
