import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PhoneCall, Globe, Send, LifeBuoy } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const hotlineHref = (number) => {
  if (number.includes(".")) return `https://${number}`;
  return `tel:${number.replace(/[^0-9]/g, "")}`;
};

export const ContactSection = ({ t, lang }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);

  const submit = async () => {
    if (name.trim().length < 2 || message.trim().length < 10) {
      setNotice({ type: "error", text: t.contact.tooShort });
      return;
    }
    setSending(true);
    setNotice(null);
    try {
      await axios.post(`${API}/contact-messages`, {
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
        locale: lang,
      });
      setName("");
      setContact("");
      setMessage("");
      setNotice({ type: "success", text: t.contact.success });
    } catch {
      setNotice({ type: "error", text: t.contact.error });
    }
    setSending(false);
  };

  return (
    <div data-testid="contact-section" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[26rem] h-[26rem] rounded-full bg-amber-500/5 blur-[110px]" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5 flex items-center gap-3">
            <LifeBuoy size={14} />
            {t.contact.overline}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
            {t.contact.title}
          </h2>
          <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed max-w-xl">
            {t.contact.desc}
          </p>

          <p className="mt-10 text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 mb-4">
            {t.contact.hotlineTitle}
          </p>
          <div className="space-y-4">
            {t.contact.hotlines.map((h, i) => (
              <motion.a
                key={h.name}
                data-testid={`hotline-card-${i}`}
                href={hotlineHref(h.number)}
                target={h.number.includes(".") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="group flex items-center gap-5 rounded-2xl border border-stone-800 bg-surface/60 p-5 hover:border-amber-500/40 transition-[border-color] duration-400"
              >
                <span className="w-11 h-11 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center shrink-0">
                  {h.number.includes(".") ? (
                    <Globe size={17} className="text-amber-300" />
                  ) : (
                    <PhoneCall size={17} className="text-amber-300" />
                  )}
                </span>
                <span>
                  <span className="block font-serif text-xl text-stone-100 group-hover:text-amber-200 transition-colors duration-300">
                    {h.name}
                  </span>
                  <span className="block text-xs font-mono text-amber-400/80 mt-0.5">{h.number}</span>
                  <span className="block text-xs font-light text-stone-500 mt-1">{h.desc}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="lg:pt-24"
        >
          <div className="rounded-3xl border border-amber-500/15 bg-surface/80 backdrop-blur-sm p-8 sm:p-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-100">{t.contact.formTitle}</h3>
            <input
              data-testid="contact-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder={t.contact.namePh}
              className="mt-7 w-full bg-transparent border-b border-stone-700/80 focus:border-amber-500/60 outline-none py-3 text-sm text-stone-200 placeholder:text-stone-600 transition-colors duration-300"
            />
            <input
              data-testid="contact-contact-input"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              maxLength={80}
              placeholder={t.contact.contactPh}
              className="mt-4 w-full bg-transparent border-b border-stone-700/80 focus:border-amber-500/60 outline-none py-3 text-sm text-stone-200 placeholder:text-stone-600 transition-colors duration-300"
            />
            <textarea
              data-testid="contact-message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={5}
              placeholder={t.contact.messagePh}
              className="mt-4 w-full bg-transparent border-b border-stone-700/80 focus:border-amber-500/60 outline-none py-3 text-base font-light text-stone-200 placeholder:text-stone-600 resize-none transition-colors duration-300"
            />
            <div className="mt-6 flex justify-end">
              <button
                data-testid="contact-submit-btn"
                onClick={submit}
                disabled={sending}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-stone-950 text-sm font-medium hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.35)] disabled:opacity-60 transition-[background-color,box-shadow] duration-300"
              >
                <Send size={13} />
                {sending ? t.contact.sending : t.contact.submit}
              </button>
            </div>
            {notice && (
              <p
                data-testid="contact-notice"
                className={`mt-4 text-xs font-mono ${notice.type === "success" ? "text-[#84A98C]" : "text-red-400"}`}
              >
                {notice.text}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
