import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, X, Volume2, Loader2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LEAF_POSITIONS = [
  { left: "12%", top: "18%" },
  { left: "34%", top: "4%" },
  { left: "55%", top: "22%" },
  { left: "26%", top: "48%" },
  { left: "68%", top: "52%" },
];

export const DialogTree = ({ t, lang }) => {
  const [open, setOpen] = useState(null);
  const [audioState, setAudioState] = useState("idle");
  const audioRef = useRef(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioState("idle");
  };

  useEffect(() => {
    stopAudio();
  }, [open]);

  useEffect(() => () => stopAudio(), []);

  const playNarration = () => {
    if (audioState === "playing") {
      stopAudio();
      return;
    }
    if (open === null) return;
    setAudioState("loading");
    const audio = new Audio(`${API}/leaf-narration/${lang}/${open}.mp3`);
    audioRef.current = audio;
    audio.addEventListener("playing", () => setAudioState("playing"));
    audio.addEventListener("ended", () => setAudioState("idle"));
    audio.addEventListener("error", () => setAudioState("idle"));
    audio.play().catch(() => setAudioState("idle"));
  };

  return (
    <div data-testid="dialog-tree-section" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-2xl mb-6"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5">
            {t.tree.overline}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
            {t.tree.title}
          </h2>
          <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
            {t.tree.prompt}
          </p>
        </motion.div>

        <div className="relative h-[380px] sm:h-[420px] mt-8">
          <div className="absolute left-1/2 bottom-0 w-px h-40 bg-gradient-to-t from-amber-500/40 to-transparent" aria-hidden="true" />
          {t.tree.leaves.map((_, i) => (
            <motion.button
              key={i}
              data-testid={`tree-leaf-btn-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: EASE }}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-300 ${
                open === i
                  ? "bg-amber-500/25 border-amber-400/70 shadow-[0_0_36px_rgba(245,158,11,0.35)]"
                  : "bg-[#84A98C]/10 border-[#84A98C]/30 hover:border-amber-400/50 hover:bg-amber-500/10"
              }`}
              style={{ left: LEAF_POSITIONS[i].left, top: LEAF_POSITIONS[i].top }}
            >
              <Leaf size={22} className={open === i ? "text-amber-300" : "text-[#84A98C]"} />
            </motion.button>
          ))}

          <div className="absolute right-0 bottom-0 left-0 sm:left-auto sm:w-[26rem]">
            <AnimatePresence mode="wait">
              {open === null ? (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-light italic text-stone-500 text-center sm:text-right"
                >
                  {t.tree.hint}
                </motion.p>
              ) : (
                <motion.div
                  key={open}
                  data-testid="tree-message-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="rounded-2xl border border-amber-500/25 bg-surface/90 backdrop-blur-sm p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400/70">
                      {t.tree.leafLabel} {open + 1}
                    </p>
                    <button
                      data-testid="tree-close-btn"
                      onClick={() => setOpen(null)}
                      className="text-stone-500 hover:text-amber-400 transition-colors duration-300"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <p className="mt-3 font-serif italic text-xl sm:text-2xl text-stone-100 leading-relaxed">
                    {t.tree.leaves[open]}
                  </p>
                  <button
                    data-testid="tree-narration-btn"
                    onClick={playNarration}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-500 hover:text-amber-400 transition-colors duration-300"
                  >
                    {audioState === "loading" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Volume2 size={14} className={audioState === "playing" ? "text-amber-400 animate-pulse" : ""} />
                    )}
                    {audioState === "loading"
                      ? t.treeVoice.loading
                      : audioState === "playing"
                        ? t.treeVoice.playing
                        : t.treeVoice.listen}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
