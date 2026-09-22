import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Heart, Send, MessagesSquare, Flag } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const formatTime = (iso, lang) => {
  try {
    return new Date(iso).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const ForumSection = ({ t, lang }) => {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const [hugged, setHugged] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ruang-forum-hugs")) || [];
    } catch {
      return [];
    }
  });
  const [reported, setReported] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ruang-forum-reports")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    axios
      .get(`${API}/forum-posts`)
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (message.trim().length < 5) {
      setNotice({ type: "error", text: t.forum.tooShort });
      return;
    }
    setSending(true);
    setNotice(null);
    try {
      await axios.post(`${API}/forum-posts`, {
        name: name.trim(),
        message: message.trim(),
        locale: lang,
      });
      setMessage("");
      setName("");
      setNotice({ type: "success", text: t.forum.pending });
    } catch {
      setNotice({ type: "error", text: t.forum.error });
    }
    setSending(false);
  };

  const hug = async (pid, index) => {
    if (hugged.includes(pid)) return;
    const next = [...hugged, pid];
    setHugged(next);
    localStorage.setItem("ruang-forum-hugs", JSON.stringify(next));
    setPosts((p) => p.map((x, i) => (i === index ? { ...x, hugs: (x.hugs || 0) + 1 } : x)));
    axios.post(`${API}/forum-posts/${pid}/hug`).catch(() => {});
  };

  const report = async (pid) => {
    if (reported.includes(pid)) return;
    const next = [...reported, pid];
    setReported(next);
    localStorage.setItem("ruang-forum-reports", JSON.stringify(next));
    axios.post(`${API}/forum-posts/${pid}/report`).catch(() => {});
  };

  return (
    <div data-testid="forum-section" className="relative py-24 sm:py-32 bg-surface/40 border-y border-amber-500/10 overflow-hidden">
      <div className="absolute -top-20 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#84A98C]/5 blur-[100px]" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5 flex items-center gap-3">
            <MessagesSquare size={14} />
            {t.forum.overline}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
            {t.forum.title}
          </h2>
          <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
            {t.forum.desc}
          </p>

          <div className="mt-9 rounded-2xl border border-amber-500/15 bg-ink/60 p-6 sm:p-7">
            <input
              data-testid="forum-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder={t.forum.namePlaceholder}
              className="w-full bg-transparent border-b border-stone-700/80 focus:border-amber-500/60 outline-none py-3 text-sm text-stone-200 placeholder:text-stone-600 transition-colors duration-300"
            />
            <textarea
              data-testid="forum-message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder={t.forum.messagePlaceholder}
              className="mt-4 w-full bg-transparent border-b border-stone-700/80 focus:border-amber-500/60 outline-none py-3 text-base font-light text-stone-200 placeholder:text-stone-600 resize-none transition-colors duration-300"
            />
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-[10px] font-mono text-stone-600">{message.length}/500</p>
              <button
                data-testid="forum-submit-btn"
                onClick={submit}
                disabled={sending}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-amber-500 text-stone-950 text-sm font-medium hover:bg-amber-400 hover:shadow-[0_0_28px_rgba(245,158,11,0.35)] disabled:opacity-60 transition-[background-color,box-shadow] duration-300"
              >
                <Send size={13} />
                {sending ? t.forum.sending : t.forum.submit}
              </button>
            </div>
            {notice && (
              <p
                data-testid="forum-notice"
                className={`mt-4 text-xs font-mono ${notice.type === "success" ? "text-[#84A98C]" : "text-red-400"}`}
              >
                {notice.text}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="max-h-[34rem] overflow-y-auto pr-2 space-y-4"
        >
          {posts.length === 0 && (
            <p data-testid="forum-empty" className="text-sm font-light italic text-stone-500 pt-8">
              {t.forum.empty}
            </p>
          )}
          {posts.map((p, i) => (
            <motion.article
              key={p.pid}
              data-testid={`forum-post-card-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-2xl border border-stone-800 bg-ink/60 p-6 hover:border-amber-500/30 transition-[border-color] duration-400"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-serif text-lg text-amber-200/90">{p.name}</p>
                <p className="text-[10px] font-mono text-stone-600 shrink-0">
                  {formatTime(p.timestamp, lang)}
                </p>
              </div>
              <p className="mt-3 text-sm sm:text-base font-light text-stone-300 leading-relaxed">
                {p.message}
              </p>
              <div className="mt-4 flex items-center gap-6">
                <button
                  data-testid={`forum-hug-btn-${i}`}
                  onClick={() => hug(p.pid, i)}
                  disabled={hugged.includes(p.pid)}
                  className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] transition-colors duration-300 ${
                    hugged.includes(p.pid)
                      ? "text-amber-400"
                      : "text-stone-500 hover:text-amber-400"
                  }`}
                >
                  <Heart size={13} className={hugged.includes(p.pid) ? "fill-amber-400" : ""} />
                  {t.forum.hug} · {p.hugs || 0}
                </button>
                <button
                  data-testid={`forum-report-btn-${i}`}
                  onClick={() => report(p.pid)}
                  disabled={reported.includes(p.pid)}
                  className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] transition-colors duration-300 ${
                    reported.includes(p.pid)
                      ? "text-red-400/70"
                      : "text-stone-600 hover:text-red-400"
                  }`}
                >
                  <Flag size={12} />
                  {reported.includes(p.pid) ? t.forum.reported : t.forum.report}
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
