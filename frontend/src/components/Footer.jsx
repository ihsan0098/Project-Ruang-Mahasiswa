import { Youtube } from "lucide-react";

export const Footer = ({ t, onNavigate }) => {
  const links = [
    { id: "beranda", label: "Ruang." },
    { id: "manifesto", label: t.nav.manifesto },
    { id: "film", label: t.nav.film },
    { id: "tes", label: t.nav.test },
    { id: "tim", label: t.nav.team },
  ];

  return (
    <footer data-testid="lidm-footer" className="relative border-t border-amber-500/10 bg-surface/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-12">
          <div>
            <p className="font-serif text-5xl sm:text-6xl text-stone-100 tracking-tight">
              Ruang<span className="text-amber-400">.</span>
            </p>
            <p className="mt-4 max-w-md text-base font-light text-stone-300 leading-relaxed">
              {t.footer.tagline}
            </p>
            <a
              data-testid="footer-youtube-link"
              href="https://www.youtube.com/watch?v=bcGpVvJwYKw"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-500 hover:text-amber-400 transition-colors duration-300"
            >
              <Youtube size={15} />
              YouTube — Project Ruang
            </a>
          </div>

          <div className="md:justify-self-end">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-400/80 mb-5">
              {t.footer.explore}
            </p>
            <nav className="flex flex-col gap-3">
              {links.map((l) => (
                <button
                  key={l.id}
                  data-testid={`footer-link-${l.id}`}
                  onClick={() => onNavigate(l.id)}
                  className="text-left text-sm font-light text-stone-400 hover:text-amber-300 transition-colors duration-300"
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500">
              {t.footer.lidmLine}
            </p>
            <p className="mt-1.5 text-xs font-serif italic text-stone-500">{t.footer.theme}</p>
          </div>
          <p className="text-xs font-light text-stone-600">{t.footer.copy}</p>
        </div>
      </div>
    </footer>
  );
};
