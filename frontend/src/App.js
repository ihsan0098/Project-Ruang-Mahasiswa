import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { content } from "@/i18n";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { VideoSection } from "@/components/VideoSection";
import { ReflectionTest } from "@/components/ReflectionTest";
import { QRSection } from "@/components/QRSection";
import { DialogTree } from "@/components/DialogTree";
import { Marquee } from "@/components/Marquee";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";

const Landing = ({ t, lang, onToggleLang, scrollTo }) => {
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) {
      const timer = setTimeout(() => scrollTo(to), 1400);
      return () => clearTimeout(timer);
    }
  }, [scrollTo]);

  return (
    <div className="bg-ink text-stone-100 min-h-screen overflow-x-clip">
      <Header t={t} lang={lang} onToggleLang={onToggleLang} onNavigate={scrollTo} />
      <main>
        <section id="beranda">
          <Hero t={t} onNavigate={scrollTo} />
        </section>
        <section id="manifesto">
          <Manifesto t={t} />
        </section>
        <section id="film">
          <VideoSection t={t} />
        </section>
        <section id="tes">
          <ReflectionTest t={t} lang={lang} onNavigate={scrollTo} />
        </section>
        <QRSection t={t} />
        <DialogTree t={t} />
        <Marquee items={t.marquee} />
        <section id="tim">
          <Team t={t} />
        </section>
      </main>
      <Footer t={t} onNavigate={scrollTo} />
    </div>
  );
};

function App() {
  const [lang, setLang] = useState("id");
  const t = content[lang];
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollTo = useCallback((id) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { offset: -64, duration: 1.5 });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const toggleLang = useCallback(() => setLang((l) => (l === "id" ? "en" : "id")), []);

  return (
    <BrowserRouter>
      <div className="grain-overlay" aria-hidden="true" />
      <Routes>
        <Route
          path="/"
          element={<Landing t={t} lang={lang} onToggleLang={toggleLang} scrollTo={scrollTo} />}
        />
        <Route
          path="/validasi"
          element={<Dashboard t={t} lang={lang} onToggleLang={toggleLang} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
