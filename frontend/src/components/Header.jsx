import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export const Header = ({ t, lang, onToggleLang, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "tes", label: t.nav.test },
    { id: "manifesto", label: t.nav.manifesto },
    { id: "film", label: t.nav.film },
    { id: "tim", label: t.nav.team },
  ];

  return (
    <motion.header
      data-testid="nav-header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled
          ? "bg-ink/80 backdrop-blur-md border-b border-amber-500/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => onNavigate("beranda")}
          className="font-serif text-2xl sm:text-3xl text-stone-100 tracking-tight"
        >
          Ruang<span className="text-amber-400">.</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => onNavigate(l.id)}
              className="text-[11px] uppercase tracking-[0.25em] font-mono text-stone-400 hover:text-amber-400 transition-colors duration-300"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="lang-toggle-btn"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-1.5 border border-stone-700 hover:border-amber-500/60 rounded-full text-xs font-mono text-stone-300 hover:text-amber-400 transition-colors duration-300"
          >
            <Languages size={13} />
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            data-testid="nav-cta-btn"
            onClick={() => onNavigate("tes")}
            className="hidden sm:inline-flex px-5 py-2 rounded-full bg-amber-500 text-stone-950 text-sm font-medium hover:bg-amber-400 hover:shadow-[0_0_28px_rgba(245,158,11,0.35)] transition-[background-color,box-shadow] duration-300"
          >
            {t.nav.cta}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
