import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const Stroke = ({ d, delay = 0, accent = false }) => (
  <motion.path
    d={d}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={accent ? "text-amber-400" : "text-stone-300"}
    initial={{ pathLength: 0, opacity: 0 }}
    whileInView={{ pathLength: 1, opacity: accent ? 0.95 : 0.8 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 1.3, delay, ease: EASE }}
  />
);

const CircleStroke = ({ cx, cy, r, delay = 0, accent = false }) => (
  <motion.circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={accent ? "text-amber-400" : "text-stone-300"}
    initial={{ pathLength: 0, opacity: 0 }}
    whileInView={{ pathLength: 1, opacity: accent ? 0.95 : 0.8 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 1.1, delay, ease: EASE }}
  />
);

const SketchBars = () => (
  <svg viewBox="0 0 400 320" className="w-full h-auto" role="img" aria-label="Terbelenggu Ekspektasi">
    <Stroke d="M 48 284 H 352" delay={0} />
    {[80, 128, 176, 224, 272, 320].map((x, i) => (
      <Stroke key={x} d={`M ${x} 36 V 284`} delay={0.15 + i * 0.12} />
    ))}
    <CircleStroke cx={200} cy={196} r={17} delay={0.9} accent />
    <Stroke d="M 200 213 C 184 232, 178 254, 188 284" delay={1.1} accent />
    <Stroke d="M 188 284 C 212 274, 228 276, 236 284" delay={1.3} accent />
    <Stroke d="M 196 236 C 206 250, 214 258, 222 262" delay={1.45} />
  </svg>
);

const SketchLock = () => (
  <svg viewBox="0 0 400 320" className="w-full h-auto" role="img" aria-label="Suara yang Terkunci">
    <Stroke d="M 110 168 Q 200 138 290 168" delay={0} />
    <Stroke d="M 110 168 Q 200 212 290 168" delay={0.3} />
    <motion.rect
      x={172}
      y={150}
      width={56}
      height={50}
      rx={9}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-amber-400"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.95 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
    />
    <Stroke d="M 186 150 V 126 A 14 14 0 0 1 214 126 V 150" delay={0.9} accent />
    <CircleStroke cx={200} cy={170} r={6} delay={1.15} accent />
    <Stroke d="M 200 176 V 184" delay={1.3} accent />
    <Stroke d="M 92 156 Q 76 168 92 182" delay={1.0} />
    <Stroke d="M 308 156 Q 324 168 308 182" delay={1.0} />
    <Stroke d="M 60 158 L 78 178" delay={1.35} />
    <Stroke d="M 78 158 L 60 178" delay={1.45} />
  </svg>
);

const SketchDoor = () => (
  <svg viewBox="0 0 400 320" className="w-full h-auto" role="img" aria-label="Titik Balik">
    <motion.path
      d="M 262 84 L 400 176 L 400 268 L 262 262 Z"
      fill="rgba(245, 158, 11, 0.14)"
      stroke="none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.6, delay: 1.2, ease: EASE }}
    />
    <Stroke d="M 48 284 H 368" delay={0} />
    <Stroke d="M 130 56 V 284" delay={0.15} />
    <Stroke d="M 130 56 H 262" delay={0.35} />
    <Stroke d="M 262 56 V 284" delay={0.55} />
    <Stroke d="M 262 56 L 306 78 V 302 L 262 284" delay={0.75} accent />
    <Stroke d="M 262 110 L 380 210" delay={1.35} accent />
    <Stroke d="M 262 200 L 390 240" delay={1.5} accent />
    <CircleStroke cx={286} cy={168} r={9} delay={1.0} />
    <Stroke d="M 286 177 V 232" delay={1.15} />
    <Stroke d="M 286 232 L 278 258" delay={1.3} />
    <Stroke d="M 286 232 L 294 258" delay={1.4} />
  </svg>
);

const SKETCHES = [SketchBars, SketchLock, SketchDoor];

export const Gallery = ({ t }) => (
  <div data-testid="gallery-section" className="relative py-24 sm:py-32 overflow-hidden">
    <div className="absolute top-10 left-0 w-[24rem] h-[24rem] rounded-full bg-amber-500/5 blur-[100px]" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-2xl mb-14 sm:mb-20"
      >
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5">
          {t.gallery.overline}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
          {t.gallery.title}
        </h2>
        <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
          {t.gallery.desc}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {t.gallery.items.map((item, i) => {
          const Sketch = SKETCHES[i];
          return (
            <motion.figure
              key={item.title}
              data-testid={`gallery-sketch-${i + 1}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: EASE }}
              className={`group rounded-2xl border border-stone-800 bg-surface/60 p-7 hover:border-amber-500/40 transition-[border-color] duration-500 ${
                i === 1 ? "md:translate-y-8" : ""
              }`}
            >
              <div
                className="rounded-xl border border-stone-800/70 p-4"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(245,158,11,0.045) 0px, rgba(245,158,11,0.045) 1px, transparent 1px, transparent 26px)",
                }}
              >
                <Sketch />
              </div>
              <figcaption className="mt-6">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400/70">
                  [ {item.tag} ]
                </p>
                <h3 className="mt-2.5 font-serif text-2xl text-stone-100">{item.title}</h3>
                <p className="mt-2.5 text-sm font-light text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </div>
  </div>
);
