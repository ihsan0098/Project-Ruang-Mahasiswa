import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { ScanLine, BookOpen } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const QRSection = ({ t }) => {
  const targetUrl = `${window.location.origin}/?to=tes`;

  return (
    <div data-testid="qr-section" className="relative py-24 sm:py-32 bg-surface/40 border-y border-amber-500/10 overflow-hidden">
      <div className="absolute -bottom-24 left-1/4 w-[26rem] h-[26rem] rounded-full bg-amber-500/5 blur-[110px]" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5 flex items-center gap-3">
            <ScanLine size={14} />
            {t.qr.overline}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
            {t.qr.title}
          </h2>
          <p className="mt-6 max-w-xl text-base sm:text-lg font-light text-stone-300 leading-relaxed">
            {t.qr.desc}
          </p>
          <p className="mt-6 text-xs font-mono uppercase tracking-[0.2em] text-stone-500">
            {t.qr.hint}
          </p>
          <a
            data-testid="qr-module-btn"
            href="/modul"
            className="mt-8 inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 hover:shadow-[0_0_36px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-300"
          >
            <BookOpen size={15} />
            {t.qrModuleCta}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 1.5 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="relative justify-self-center"
        >
          <div className="absolute -inset-4 border border-amber-500/25 rounded-2xl rotate-[-2deg]" aria-hidden="true" />
          <div className="absolute -inset-12 bg-amber-500/10 blur-3xl rounded-full" aria-hidden="true" />
          <div className="relative bg-white p-6 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            <QRCodeCanvas
              data-testid="qr-code-canvas"
              value={targetUrl}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#0C0A09"
              level="M"
            />
          </div>
          <p className="mt-5 text-center font-serif text-xl text-amber-300 tracking-wide">
            Ruang<span className="text-stone-100">.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
