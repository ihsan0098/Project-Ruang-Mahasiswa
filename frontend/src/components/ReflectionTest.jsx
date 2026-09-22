import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowLeft, RotateCcw, Sparkle, Users, Download, UserRound, Sprout } from "lucide-react";
import { downloadResultCard } from "@/utils/shareCard";

const EASE = [0.16, 1, 0.3, 1];
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const DIM_ORDER = ["warmth", "hostility", "indifference", "rejection"];

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

export const ReflectionTest = ({ t, lang, onNavigate }) => {
  const [mode, setMode] = useState("parent");
  const [stage, setStage] = useState("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(12).fill(null));
  const [result, setResult] = useState(null);
  const [count, setCount] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const advancing = useRef(false);

  useEffect(() => {
    axios
      .get(`${API}/reflection-stats`)
      .then((r) => setCount(r.data.count))
      .catch(() => {});
  }, []);

  const questions = mode === "son" ? t.test.sonQuestions : t.test.questions;
  const levelCopy = mode === "son" ? t.test.sonLevels : t.test.levels;

  const finish = (ans) => {
    const groups = { warmth: [], hostility: [], indifference: [], rejection: [] };
    questions.forEach((q, i) => groups[q.dimension].push(ans[i]));
    const scores = {
      warmth: avg(groups.warmth),
      hostility: avg(groups.hostility),
      indifference: avg(groups.indifference),
      rejection: avg(groups.rejection),
    };
    const connection =
      scores.warmth + (5 - scores.hostility) + (5 - scores.indifference) + (5 - scores.rejection);
    const level = connection >= 13 ? "warm" : connection >= 10 ? "fading" : "silent";
    setResult({ ...scores, level });
    setStage("result");
    axios
      .post(`${API}/reflection-results`, { ...scores, level, locale: lang, mode })
      .catch(() => {});
  };

  const answer = (value) => {
    if (advancing.current) return;
    advancing.current = true;
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    if (index < 11) {
      setTimeout(() => {
        advancing.current = false;
        setIndex(index + 1);
      }, 300);
    } else {
      setTimeout(() => {
        advancing.current = false;
        finish(next);
      }, 350);
    }
  };

  const reset = () => {
    setAnswers(Array(12).fill(null));
    setIndex(0);
    setResult(null);
    advancing.current = false;
    setStage("intro");
  };

  const onDownload = async () => {
    if (!result || downloading) return;
    setDownloading(true);
    try {
      await downloadResultCard({ t, mode, level: result.level, scores: result });
    } catch (e) {}
    setDownloading(false);
  };

  const levelStyles = {
    warm: "text-[#84A98C]",
    fading: "text-amber-400",
    silent: "text-red-400",
  };

  return (
    <div data-testid="reflection-test-section" className="relative py-28 sm:py-36">
      <div className="absolute top-20 right-0 w-[26rem] h-[26rem] rounded-full bg-amber-500/5 blur-[100px]" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="text-left"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5">
                {t.test.overline}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
                {t.test.title}
              </h2>

              <div className="mt-8 inline-flex rounded-full border border-stone-700/80 p-1 bg-surface/60">
                {[
                  { id: "parent", icon: UserRound, testid: "mode-parent-btn" },
                  { id: "son", icon: Sprout, testid: "mode-son-btn" },
                ].map((m) => (
                  <button
                    key={m.id}
                    data-testid={m.testid}
                    onClick={() => setMode(m.id)}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-[background-color,color,box-shadow] duration-300 ${
                      mode === m.id
                        ? "bg-amber-500 text-stone-950 shadow-[0_0_24px_rgba(245,158,11,0.3)]"
                        : "text-stone-400 hover:text-amber-300"
                    }`}
                  >
                    <m.icon size={15} />
                    {t.test.modes[m.id]}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-6 text-base sm:text-lg font-light text-stone-300 leading-relaxed max-w-2xl"
                >
                  {mode === "son" ? t.test.descSon : t.test.desc}
                </motion.p>
              </AnimatePresence>

              {count !== null && count > 0 && (
                <p className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-stone-500">
                  <Users size={13} className="text-amber-500/70" />
                  {t.test.countText(count)}
                </p>
              )}
              <div className="mt-10">
                <button
                  data-testid="start-reflection-btn"
                  onClick={() => setStage("quiz")}
                  className="px-10 py-4 rounded-full bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-300"
                >
                  {t.test.start}
                </button>
              </div>
            </motion.div>
          )}

          {stage === "quiz" && (
            <motion.div
              key="quiz"
              data-testid="reflection-test-wizard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-3xl border border-amber-500/15 bg-surface/80 backdrop-blur-sm p-8 sm:p-12"
            >
              <div className="flex items-center justify-between mb-4 gap-4">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500">
                  {t.test.questionOf(index + 1)}
                </p>
                <p className="text-xs font-mono text-amber-400/70 shrink-0">
                  {t.test.modes[mode]} · {Math.round((index / 12) * 100)}%
                </p>
              </div>
              <div className="h-1 rounded-full bg-stone-800 overflow-hidden mb-10">
                <motion.div
                  className="h-full bg-amber-500"
                  animate={{ width: `${(index / 12) * 100}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${index}`}
                  initial={{ opacity: 0, x: 44 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -44 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="font-serif text-2xl sm:text-3xl text-stone-100 leading-snug min-h-[7rem]">
                    {questions[index].text}
                  </p>
                  <div className="mt-8 grid gap-3">
                    {t.test.scale.map((label, vi) => (
                      <button
                        key={label}
                        data-testid={`reflection-option-btn-${vi + 1}`}
                        onClick={() => answer(vi + 1)}
                        className={`w-full text-left px-6 py-4 rounded-xl border text-base transition-[background-color,border-color,color,transform] duration-200 ${
                          answers[index] === vi + 1
                            ? "border-amber-500 bg-amber-500/10 text-amber-300"
                            : "border-stone-700/70 text-stone-300 hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-200 hover:translate-x-1"
                        }`}
                      >
                        <span className="font-mono text-xs text-stone-500 mr-4">{vi + 1}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex justify-start">
                <button
                  data-testid="reflection-back-btn"
                  onClick={() => index > 0 && setIndex(index - 1)}
                  disabled={index === 0}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-500 hover:text-amber-400 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors duration-300"
                >
                  <ArrowLeft size={13} />
                  {t.test.back}
                </button>
              </div>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div
              key="result"
              data-testid="reflection-result-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="rounded-3xl border border-amber-500/15 bg-surface/80 backdrop-blur-sm p-8 sm:p-12"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-4">
                {t.test.resultOverline} · {t.test.modes[mode]}
              </p>
              <h3 className={`font-serif text-4xl sm:text-5xl font-semibold tracking-tight ${levelStyles[result.level]}`}>
                {levelCopy[result.level].title}
              </h3>
              <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
                {levelCopy[result.level].desc}
              </p>

              <div className="mt-10 space-y-6">
                {DIM_ORDER.map((dim, di) => {
                  const value = result[dim];
                  const isHigh = value >= 2.5;
                  const positive = dim === "warmth";
                  const barColor = positive ? "bg-amber-500" : "bg-red-400/80";
                  return (
                    <div key={dim} data-testid={`dimension-row-${dim}`}>
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-sm font-medium text-stone-200">{t.test.dimensions[dim]}</p>
                        <p className="text-xs font-mono text-stone-500">{value.toFixed(1)} / 4</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / 4) * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 + di * 0.15, ease: EASE }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-light text-stone-400">
                        {t.test.insights[dim][isHigh ? "high" : "low"]}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <p className="text-xs uppercase tracking-[0.25em] font-mono text-amber-400/80 mb-4">
                  {t.test.adviceTitle}
                </p>
                <ul className="space-y-3">
                  {levelCopy[result.level].advice.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm sm:text-base font-light text-stone-200">
                      <Sparkle size={14} className="mt-1 text-amber-500 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 text-xs font-light text-stone-500 leading-relaxed border-t border-stone-800 pt-6">
                {mode === "son" ? t.test.disclaimerSon : t.test.disclaimer}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  data-testid="download-card-btn"
                  onClick={onDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.35)] disabled:opacity-60 transition-[background-color,box-shadow] duration-300"
                >
                  <Download size={14} className={downloading ? "animate-bounce" : ""} />
                  {downloading ? t.test.sharing : t.test.share}
                </button>
                <button
                  data-testid="retake-test-btn"
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-stone-700 text-stone-200 hover:border-amber-500/60 hover:text-amber-300 transition-[border-color,color] duration-300"
                >
                  <RotateCcw size={14} />
                  {t.test.retake}
                </button>
                <button
                  data-testid="result-watch-film-btn"
                  onClick={() => onNavigate("film")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-stone-700 text-stone-200 hover:border-amber-500/60 hover:text-amber-300 transition-[border-color,color] duration-300"
                >
                  {t.test.watchFilm}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
