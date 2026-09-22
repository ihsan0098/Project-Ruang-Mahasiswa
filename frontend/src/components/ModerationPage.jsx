import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, ShieldCheck, Check, X, Flag, Inbox, KeyRound } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const KEY_STORE = "ruang-admin-key";

const statusOf = (p) => p.status || "approved";

export const ModerationPage = ({ t }) => {
  const [key, setKey] = useState(() => localStorage.getItem(KEY_STORE) || "");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  const load = useCallback(async (k) => {
    try {
      const r = await axios.get(`${API}/forum-admin/overview`, {
        headers: { "X-Admin-Key": k },
      });
      setPosts(r.data.posts || []);
      setMessages(r.data.messages || []);
      setAuthed(true);
      setError(false);
      localStorage.setItem(KEY_STORE, k);
    } catch {
      setAuthed(false);
      setError(true);
      localStorage.removeItem(KEY_STORE);
    }
  }, []);

  useEffect(() => {
    if (key) load(key);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (pid, action) => {
    try {
      await axios.post(
        `${API}/forum-admin/posts/${pid}/${action}`,
        {},
        { headers: { "X-Admin-Key": key } }
      );
      setPosts((p) =>
        p.map((x) =>
          x.pid === pid ? { ...x, status: action === "approve" ? "approved" : "rejected" } : x
        )
      );
    } catch {}
  };

  const pending = posts.filter((p) => statusOf(p) === "pending");
  const reported = posts.filter((p) => (p.reports || 0) > 0 && statusOf(p) !== "rejected");

  return (
    <div data-testid="moderation-page" className="min-h-screen bg-ink text-stone-100">
      <header className="border-b border-amber-500/10 bg-ink/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 h-16 flex items-center">
          <a
            data-testid="mod-back-link"
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-amber-400 transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            {t.mod.back}
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-14 sm:py-20">
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-4 flex items-center gap-3">
          <ShieldCheck size={14} />
          {t.mod.overline}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100">
          {t.mod.title}
        </h1>

        {!authed ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-12 max-w-md rounded-2xl border border-stone-800 bg-surface/60 p-8"
          >
            <div className="flex items-center gap-3 text-stone-300">
              <KeyRound size={16} className="text-amber-400" />
              <input
                data-testid="mod-key-input"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={t.mod.keyPh}
                className="flex-1 bg-transparent border-b border-stone-700/80 focus:border-amber-500/60 outline-none py-2 text-sm placeholder:text-stone-600 transition-colors duration-300"
              />
            </div>
            <button
              data-testid="mod-unlock-btn"
              onClick={() => load(key)}
              className="mt-6 px-7 py-3 rounded-full bg-amber-500 text-stone-950 text-sm font-medium hover:bg-amber-400 transition-colors duration-300"
            >
              {t.mod.unlock}
            </button>
            {error && (
              <p data-testid="mod-error" className="mt-4 text-xs font-mono text-red-400">
                {t.mod.wrongKey}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-12 space-y-14"
          >
            <section>
              <h2 className="font-serif text-2xl text-stone-100 mb-6">{t.mod.pendingTitle}</h2>
              {pending.length === 0 ? (
                <p data-testid="mod-pending-empty" className="text-sm font-light italic text-stone-500">
                  {t.mod.empty}
                </p>
              ) : (
                <div className="space-y-4">
                  {pending.map((p, i) => (
                    <article
                      key={p.pid}
                      data-testid={`mod-post-card-${i}`}
                      className="rounded-2xl border border-stone-800 bg-surface/60 p-6"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-serif text-lg text-amber-200/90">
                          {p.name || "Anonim"}
                        </p>
                        <p className="text-[10px] font-mono text-stone-600">
                          {new Date(p.timestamp).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-light text-stone-300 leading-relaxed">
                        {p.message}
                      </p>
                      <div className="mt-5 flex gap-3">
                        <button
                          data-testid={`mod-approve-${i}`}
                          onClick={() => act(p.pid, "approve")}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#84A98C]/15 border border-[#84A98C]/50 text-[#84A98C] text-xs font-mono uppercase tracking-[0.15em] hover:bg-[#84A98C]/25 transition-colors duration-300"
                        >
                          <Check size={13} />
                          {t.mod.approve}
                        </button>
                        <button
                          data-testid={`mod-reject-${i}`}
                          onClick={() => act(p.pid, "reject")}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-[0.15em] hover:bg-red-500/10 transition-colors duration-300"
                        >
                          <X size={13} />
                          {t.mod.reject}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-100 mb-6 flex items-center gap-3">
                <Flag size={18} className="text-red-400" />
                {t.mod.reportedTitle}
              </h2>
              {reported.length === 0 ? (
                <p data-testid="mod-reported-empty" className="text-sm font-light italic text-stone-500">
                  {t.mod.empty}
                </p>
              ) : (
                <div className="space-y-4">
                  {reported.map((p, i) => (
                    <article
                      key={p.pid}
                      data-testid={`mod-reported-card-${i}`}
                      className="rounded-2xl border border-red-500/25 bg-surface/60 p-6"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-serif text-lg text-amber-200/90">
                          {p.name || "Anonim"}
                        </p>
                        <p className="text-[10px] font-mono text-red-400">
                          {p.reports} {t.mod.reports}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-light text-stone-300 leading-relaxed">
                        {p.message}
                      </p>
                      {statusOf(p) === "pending" && (
                        <div className="mt-5 flex gap-3">
                          <button
                            onClick={() => act(p.pid, "approve")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#84A98C]/15 border border-[#84A98C]/50 text-[#84A98C] text-xs font-mono uppercase tracking-[0.15em] hover:bg-[#84A98C]/25 transition-colors duration-300"
                          >
                            <Check size={13} />
                            {t.mod.approve}
                          </button>
                          <button
                            onClick={() => act(p.pid, "reject")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-[0.15em] hover:bg-red-500/10 transition-colors duration-300"
                          >
                            <X size={13} />
                            {t.mod.reject}
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-100 mb-6 flex items-center gap-3">
                <Inbox size={18} className="text-amber-400" />
                {t.mod.messagesTitle}
              </h2>
              {messages.length === 0 ? (
                <p data-testid="mod-messages-empty" className="text-sm font-light italic text-stone-500">
                  {t.mod.emptyMsg}
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <article
                      key={m.cid}
                      data-testid={`mod-msg-card-${i}`}
                      className="rounded-2xl border border-stone-800 bg-surface/60 p-6"
                    >
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <p className="font-serif text-lg text-amber-200/90">{m.name}</p>
                        <p className="text-[10px] font-mono text-stone-500">{m.contact}</p>
                      </div>
                      <p className="mt-3 text-sm font-light text-stone-300 leading-relaxed">
                        {m.message}
                      </p>
                      <p className="mt-3 text-[10px] font-mono text-stone-600">
                        {new Date(m.timestamp).toLocaleString("id-ID")}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
};
