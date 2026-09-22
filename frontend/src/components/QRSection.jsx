import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { ScanLine, BookOpen, MessageCircle, Link2, ImageDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y;
};

export const QRSection = ({ t }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const targetUrl = `${window.location.origin}/?to=tes`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const downloadPoster = async () => {
    const qrCanvas = qrRef.current?.querySelector("canvas");
    if (!qrCanvas) return;
    try {
      await document.fonts.ready;
      await document.fonts.load('600 68px "Cormorant Garamond"');
      await document.fonts.load('500 24px "JetBrains Mono"');
    } catch (e) {}

    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0C0A09";
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W / 2, 200, 0, W / 2, 200, 700);
    glow.addColorStop(0, "rgba(245, 158, 11, 0.16)");
    glow.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    ctx.textAlign = "center";
    ctx.font = '600 72px "Cormorant Garamond", serif';
    ctx.fillStyle = "#F5F5F4";
    ctx.fillText("Ruang", W / 2 - 20, 170);
    const half = ctx.measureText("Ruang").width / 2;
    ctx.fillStyle = "#F59E0B";
    ctx.fillText(".", W / 2 - 20 + half + 14, 170);

    ctx.font = '500 26px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
    ctx.fillText(t.qr.overline.toUpperCase(), W / 2, 240);

    ctx.font = 'italic 600 64px "Cormorant Garamond", serif';
    ctx.fillStyle = "#F5F5F4";
    wrapText(ctx, t.qr.title, W / 2, 350, W - 220, 74);

    const qrSize = 420;
    const cardX = (W - (qrSize + 64)) / 2;
    const cardY = 470;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cardX, cardY, qrSize + 64, qrSize + 64, 24);
    else ctx.rect(cardX, cardY, qrSize + 64, qrSize + 64);
    ctx.fill();
    ctx.drawImage(qrCanvas, cardX + 32, cardY + 32, qrSize, qrSize);

    ctx.font = '400 30px "Outfit", sans-serif';
    ctx.fillStyle = "#D6D3D1";
    wrapText(ctx, t.qr.desc, W / 2, cardY + qrSize + 130, W - 260, 44);

    ctx.font = '500 24px "JetBrains Mono", monospace';
    ctx.fillStyle = "#F59E0B";
    ctx.fillText(window.location.host, W / 2, H - 140);

    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillStyle = "#57534E";
    ctx.fillText("PROJECT RUANG · LIDM 2026", W / 2, H - 96);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "ruang-poster-qr.png";
    a.click();
  };

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
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              data-testid="qr-whatsapp-btn"
              href={`https://wa.me/?text=${encodeURIComponent(`${t.qr.shareText} ${targetUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#84A98C] text-stone-950 font-medium hover:bg-[#9bc0a2] hover:shadow-[0_0_36px_rgba(132,169,140,0.35)] hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-300"
            >
              <MessageCircle size={15} />
              {t.qr.shareWA}
            </a>
            <button
              data-testid="qr-poster-btn"
              onClick={downloadPoster}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-amber-500 text-stone-950 font-medium hover:bg-amber-400 hover:shadow-[0_0_36px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-300"
            >
              <ImageDown size={15} />
              {t.qr.downloadPoster}
            </button>
            <button
              data-testid="qr-copy-btn"
              onClick={copyLink}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-stone-700 text-stone-200 hover:border-amber-500/60 hover:text-amber-300 transition-[border-color,color] duration-300"
            >
              <Link2 size={15} />
              {copied ? t.qr.copied : t.qr.copyLink}
            </button>
          </div>
          <a
            data-testid="qr-module-btn"
            href="/modul"
            className="mt-6 inline-flex items-center gap-2.5 text-sm text-stone-400 hover:text-amber-300 transition-colors duration-300"
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
          <div ref={qrRef} className="relative bg-white p-6 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
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
