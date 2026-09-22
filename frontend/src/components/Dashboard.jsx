import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { RefreshCcw, ArrowLeft, Languages, Users, UserRound, Sprout } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const DIMS = ["warmth", "hostility", "indifference", "rejection"];
const LEVELS = ["warm", "fading", "silent"];
const LEVEL_COLORS = { warm: "#84A98C", fading: "#F59E0B", silent: "#EF4444" };

export const Dashboard = ({ t, lang, onToggleLang }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API}/reflection-stats`)
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = stats
    ? DIMS.map((d) => ({
        name: t.test.dimensions[d],
        [t.dash.parent]: stats.parentAverages[d],
        [t.dash.son]: stats.sonAverages[d],
      }))
    : [];

  const maxLevel = stats ? Math.max(1, ...LEVELS.map((l) => stats.levels[l] || 0)) : 1;

  return (
    <div data-testid="validation-dashboard" className="min-h-screen bg-ink text-stone-100">
      <header className="border-b border-amber-500/10 bg-ink/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a
            data-testid="dash-back-link"
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-amber-400 transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            {t.dash.back}
          </a>
          <button
            data-testid="dash-lang-toggle-btn"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-1.5 border border-stone-700 hover:border-amber-500/60 rounded-full text-xs font-mono text-stone-300 hover:text-amber-400 transition-colors duration-300"
          >
            <Languages size={13} />
            {lang === "id" ? "EN" : "ID"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-4">
            {t.dash.overline}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
            {t.dash.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg font-light text-stone-300 leading-relaxed">
            {t.dash.desc}
          </p>
        </motion.div>

        {!stats && !loading && (
          <p data-testid="dash-empty-state" className="mt-16 text-stone-500 font-light">
            {t.dash.empty}
          </p>
        )}

        {stats && stats.count === 0 && (
          <p data-testid="dash-empty-state" className="mt-16 text-stone-500 font-light">
            {t.dash.empty}
          </p>
        )}

        {stats && stats.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="mt-12 space-y-8"
          >
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: Users, label: t.dash.total, value: stats.count, testid: "dash-total-card" },
                { icon: UserRound, label: t.dash.parent, value: stats.modes.parent, testid: "dash-parent-card" },
                { icon: Sprout, label: t.dash.son, value: stats.modes.son, testid: "dash-son-card" },
              ].map((c) => (
                <div
                  key={c.testid}
                  data-testid={c.testid}
                  className="rounded-2xl border border-stone-800 bg-surface/60 p-7"
                >
                  <c.icon size={18} className="text-amber-400/80" />
                  <p className="mt-4 font-serif text-5xl font-semibold text-stone-100">{c.value}</p>
                  <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>

            <div data-testid="dash-levels-card" className="rounded-2xl border border-stone-800 bg-surface/60 p-8">
              <h2 className="font-serif text-2xl text-stone-100 mb-8">{t.dash.levelsTitle}</h2>
              <div className="space-y-6">
                {LEVELS.map((level, i) => {
                  const n = stats.levels[level] || 0;
                  return (
                    <div key={level} data-testid={`dash-level-row-${level}`}>
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-sm text-stone-200">{t.dash.levelNames[level]}</p>
                        <p className="text-xs font-mono text-stone-500">{n}</p>
                      </div>
                      <div className="h-2 rounded-full bg-stone-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: LEVEL_COLORS[level] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(n / maxLevel) * 100}%` }}
                          transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: EASE }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div data-testid="dash-dims-card" className="rounded-2xl border border-stone-800 bg-surface/60 p-8">
              <h2 className="font-serif text-2xl text-stone-100 mb-2">{t.dash.dimsTitle}</h2>
              <p className="text-xs font-mono uppercase tracking-[0.15em] text-stone-500 mb-8">
                {t.dash.dimsNote}
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 40 }}>
                    <CartesianGrid stroke="#292524" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#A8A29E", fontSize: 11 }}
                      angle={-14}
                      textAnchor="end"
                      interval={0}
                      stroke="#44403C"
                    />
                    <YAxis domain={[0, 4]} tick={{ fill: "#78716C", fontSize: 11 }} stroke="#44403C" />
                    <Tooltip
                      contentStyle={{
                        background: "#161412",
                        border: "1px solid rgba(245,158,11,0.25)",
                        borderRadius: 12,
                        color: "#F5F5F4",
                      }}
                      labelStyle={{ color: "#F59E0B" }}
                      cursor={{ fill: "rgba(245,158,11,0.06)" }}
                    />
                    <Bar dataKey={t.dash.parent} fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={42} />
                    <Bar dataKey={t.dash.son} fill="#84A98C" radius={[4, 4, 0, 0]} maxBarSize={42} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button
              data-testid="dash-refresh-btn"
              onClick={load}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-700 text-stone-300 hover:border-amber-500/60 hover:text-amber-300 transition-[border-color,color] duration-300 text-sm"
            >
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
              {t.dash.refresh}
            </button>
          </motion.div>
        )}

        {loading && !stats && (
          <p className="mt-16 text-stone-500 font-mono text-xs uppercase tracking-[0.2em]">…</p>
        )}
      </main>
    </div>
  );
};
