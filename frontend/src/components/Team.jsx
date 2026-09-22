import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

const initials = (name) =>
  name
    .replace(/,.*$/, "")
    .split(" ")
    .filter((w) => w.length > 1 && !/^(Dr\.?|S\.|M\.)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const MemberCard = ({ member, index }) => (
  <motion.div
    data-testid={`team-member-card-${index}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
    className="group relative rounded-2xl border border-stone-800 bg-surface/60 p-8 hover:border-amber-500/40 hover:-translate-y-1 transition-[border-color,transform] duration-400"
  >
    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
    <div className="w-14 h-14 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center font-serif text-xl text-amber-300">
      {initials(member.name)}
    </div>
    <h3 className="mt-6 font-serif text-2xl text-stone-100">{member.name}</h3>
    <p className="mt-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400/80">
      {member.role}
    </p>
    <p className="mt-4 text-sm font-light text-stone-400 leading-relaxed">{member.focus}</p>
    <p className="mt-4 text-[10px] font-mono tracking-[0.2em] text-stone-600">NIM {member.nim}</p>
  </motion.div>
);

export const Team = ({ t }) => (
  <div data-testid="team-section" className="relative py-28 sm:py-36">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-16 sm:mb-20 max-w-2xl"
      >
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400/80 mb-5">
          {t.team.overline}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
          {t.team.title}
        </h2>
        <p className="mt-5 text-base sm:text-lg font-light text-stone-300 leading-relaxed">
          {t.team.desc}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {t.team.members.map((m, i) => (
          <MemberCard key={m.nim} member={m} index={i} />
        ))}
      </div>

      <motion.div
        data-testid="team-advisor-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        className="mt-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-surface/60 to-surface/60 p-8 flex flex-col sm:flex-row sm:items-center gap-6"
      >
        <div className="w-14 h-14 rounded-full border border-amber-500/40 bg-amber-500/15 flex items-center justify-center shrink-0">
          <GraduationCap size={22} className="text-amber-300" />
        </div>
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400/80">
            {t.team.advisorLabel}
          </p>
          <h3 className="mt-1.5 font-serif text-2xl text-stone-100">{t.team.advisor.name}</h3>
          <p className="mt-1 text-sm font-light text-stone-400">{t.team.advisor.focus}</p>
        </div>
      </motion.div>
    </div>
  </div>
);
