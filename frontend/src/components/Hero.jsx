import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Play, ArrowDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const Hero = ({ t, onNavigate }) => {
  const sectionRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  const blob1X = useTransform(sx, (v) => v * 50);
  const blob1Y = useTransform(sy, (v) => v * 50);
  const blob2X = useTransform(sx, (v) => v * -30);
  const blob2Y = useTransform(sy, (v) => v * -30);
  const imgX = useTransform(sx, (v) => v * 14);
  const imgY = useTransform(sy, (v) => v * 14);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${(i * 71 + 5) % 100}%`,
        top: `${(i * 37 + 8) % 90}%`,
        size: 2 + (i % 3),
        duration: 8 + (i % 5) * 2.5,
        delay: (i % 6) * 0.9,
      })),
    []
  );

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      data-testid="hero-section"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        style={{ x: blob1X, y: blob1Y }}
        className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-amber-500/10 blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: blob2X, y: blob2Y }}
        className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#84A98C]/10 blur-[110px]"
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-amber-400/40"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -36, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        style={{ y: parallaxY, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-8"
          >
            {t.hero.overline}
          </motion.p>

          <h1
            data-testid="hero-title"
            className="font-serif font-semibold tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-stone-100"
          >
            {t.hero.lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1 -mb-1">
                <motion.span
                  className={`block ${i === t.hero.lines.length - 1 ? "italic text-amber-400" : ""}`}
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.35 + i * 0.16, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
            className="mt-8 max-w-xl text-base sm:text-lg font-light text-stone-300 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="hero-cta-btn"
              onClick={() => onNavigate("tes")}
              className="px-8 py-4 rounded-full bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-300"
            >
              {t.hero.ctaPrimary}
            </button>
            <button
              data-testid="hero-film-btn"
              onClick={() => onNavigate("film")}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-stone-700 text-stone-200 hover:border-amber-500/60 hover:text-amber-300 transition-[border-color,color] duration-300"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-800 group-hover:bg-amber-500/20 transition-colors duration-300">
                <Play size={11} className="ml-0.5 fill-current" />
              </span>
              {t.hero.ctaSecondary}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
          className="hidden lg:block relative"
        >
          <motion.div style={{ x: imgX, y: imgY }} className="relative">
            <div className="absolute -inset-4 border border-amber-500/20 rounded-2xl rotate-[-2deg]" aria-hidden="true" />
            <div className="absolute -inset-10 bg-amber-500/10 blur-3xl rounded-full" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1752760023113-a92ac2aab10f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwxfHxmYXRoZXIlMjBzb24lMjBlbW90aW9uYWwlMjBtZW50YWwlMjBoZWFsdGglMjBzdXBwb3J0JTIwd2FybXRoJTIwaW5kb25lc2lhbiUyMGZhbWlseXxlbnwwfHx8fDE3OTAwNzg2Mzh8MA&ixlib=rb-4.1.0&q=85"
              alt={t.hero.imageAlt}
              className="relative w-full aspect-[4/5] object-cover rounded-xl border border-amber-500/25 shadow-[0_30px_80px_rgba(0,0,0,0.6)] sepia-[0.25] contrast-[1.05] brightness-[0.9]"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-ink/70 via-transparent to-amber-500/5" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        data-testid="hero-scroll-hint"
        onClick={() => onNavigate("manifesto")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-500 hover:text-amber-400 transition-colors duration-300"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono">{t.hero.scroll}</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.button>
    </div>
  );
};
