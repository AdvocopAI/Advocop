import React, { useState } from 'react';
import { IntakeContext } from '../types';
import { FileText, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';

interface IntakeScreenProps {
  files: File[];
  onSubmit: (context: IntakeContext) => void;
  onBack: () => void;
}

const INTENTS = [
  { value: 'COMPREHENSION', label: 'KOMPREHENSJA', desc: 'Analiza neutralna', icon: '🧠' },
  { value: 'REACTION', label: 'REAKCJA', desc: 'Obrona i ryzyko', icon: '🛡️' },
  { value: 'INITIATIVE', label: 'INICJATYWA', desc: 'Atak i luki prawne', icon: '⚔️' },
] as const;

const OBJECTIVES = [
  { value: 'understand', label: 'Zrozumienie Sprawy', icon: '🔍' },
  { value: 'defend', label: 'Obrona lub reakcja', icon: '🛡️' },
  { value: 'assert', label: 'Dochodzenie swoich praw', icon: '⚔️' },
  { value: 'negotiate', label: 'Negocjacja warunków', icon: '🤝' },
  { value: 'delay', label: 'Zyskanie czasu', icon: '⏳' },
  { value: 'unknown', label: 'Nie wiem', icon: '❓' },
] as const;

const ROLES = [
  { value: 'recipient', label: 'Odbiorca' },
  { value: 'sender', label: 'Nadawca' },
] as const;

const ENTITIES = [
  { value: 'person', label: 'Osoba fizyczna' },
  { value: 'business', label: 'Firma' },
  { value: 'organization', label: 'Organizacja' },
] as const;

const PRIOR = [
  { value: 'none', label: 'Pierwszy kontakt' },
  { value: 'responded', label: 'Odpowiedziałem' },
  { value: 'paid_partial', label: 'Zapłaciłem częściowo' },
  { value: 'paid_full', label: 'Zapłaciłem w całości' },
  { value: 'consulted_lawyer', label: 'Konsultacja z prawnikiem' },
  { value: 'ignored', label: 'Zignorowałem' },
] as const;

const IntakeScreen: React.FC<IntakeScreenProps> = ({ files, onSubmit, onBack }) => {
  const [ctx, setCtx] = useState<IntakeContext>({
    intent: 'REACTION',
    role: 'recipient',
    objective: 'defend',
    entity_type: 'person',
    is_lawyer: false,
    received_date: '',
    deadline: '',
    deadline_passed: false,
    prior_actions: 'none',
    amount: 0,
    notes: '',
  });

  const [tacticalOpen, setTacticalOpen] = useState(false);

  const set = <K extends keyof IntakeContext>(k: K, v: IntakeContext[K]) =>
    setCtx(prev => ({ ...prev, [k]: v }));

  return (
    <div className="w-full max-w-3xl mx-auto pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header: confirmed files ── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          ADVO<span className="text-emerald-400">COP</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium italic text-sm">Dokumenty poprawnie załączone</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {files.map((f, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800/80 text-slate-400 text-xs rounded-full font-mono border border-slate-700/50">
              <FileText className="w-3 h-3 inline mr-1 opacity-40" />
              {f.name.length > 18 ? f.name.slice(0, 7) + '(…)' + f.name.slice(-4) : f.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── VECTORING: Intent ── */}
      <div className="mb-8">
        <p className="text-center text-slate-400 text-sm font-medium mb-4 tracking-wide uppercase">Wektor operacyjny (INTENT)</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {INTENTS.map(i => (
            <button
              key={i.value}
              onClick={() => set('intent', i.value)}
              className={`flex flex-col items-center p-4 rounded-xl border text-sm transition-all duration-300 w-full sm:w-1/3 ${
                ctx.intent === i.value
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <span className="text-2xl mb-2">{i.icon}</span>
              <span className="font-bold tracking-wider mb-1">{i.label}</span>
              <span className="text-xs opacity-70">{i.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── PRIMARY: Objective ── */}
      <div className="mb-8">
        <p className="text-center text-slate-400 text-sm font-medium mb-4 tracking-wide">Cel szczegółowy:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {OBJECTIVES.map(o => (
            <button
              key={o.value}
              onClick={() => set('objective', o.value)}
              className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                ctx.objective === o.value
                  ? o.value === 'unknown'
                    ? 'border-slate-500 bg-slate-700/50 text-slate-200 shadow-[0_0_10px_rgba(100,116,139,0.15)]'
                    : 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.08)]'
                  : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <span className="mr-1.5">{o.icon}</span>{o.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── REPRESENTATION: Party Info ── */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 mb-4 space-y-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center italic">
          Informacje dotyczące reprezentowanej strony:
        </p>

        {/* Role + Entity in one row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5">
            {ROLES.map(r => (
              <button
                key={r.value}
                onClick={() => set('role', r.value)}
                className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all duration-150 ${
                  ctx.role === r.value
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <span className="text-slate-700 font-mono text-sm px-1">—</span>

          <div className="flex gap-1.5">
            {ENTITIES.map(e => (
              <button
                key={e.value}
                onClick={() => set('entity_type', e.value)}
                className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all duration-150 ${
                  ctx.entity_type === e.value
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lawyer Toggle */}
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <div
            onClick={() => set('is_lawyer', !ctx.is_lawyer)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
              ctx.is_lawyer ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
              ctx.is_lawyer ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
          <span className={`text-sm font-semibold transition-colors ${ctx.is_lawyer ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
            jestem prawnikiem reprezentującym stronę
          </span>
        </label>
      </div>

      {/* ── PROGRESSIVE DISCLOSURE: Tactical Details ── */}
      <div className="mb-6">
        <button
          onClick={() => setTacticalOpen(o => !o)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors tracking-widest uppercase"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${tacticalOpen ? 'rotate-180' : ''}`} />
          Szczegóły taktyczne (Opcjonalnie)
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${tacticalOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${tacticalOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-slate-900/40 border border-slate-800/60 border-t-0 rounded-b-2xl px-5 pt-5 pb-6 space-y-5">

            {/* Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Data otrzymania</label>
                <input
                  type="date"
                  value={ctx.received_date}
                  onChange={e => set('received_date', e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white
                             focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Termin</label>
                <input
                  type="text"
                  value={ctx.deadline}
                  onChange={e => set('deadline', e.target.value)}
                  placeholder="np. 7 dni, 14 dni..."
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700
                             focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => set('deadline_passed', !ctx.deadline_passed)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 shrink-0 ${
                      ctx.deadline_passed
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-slate-600 group-hover:border-slate-400'
                    }`}
                  >
                    {ctx.deadline_passed && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Termin minął</span>
                </label>
              </div>
            </div>

            {/* Prior actions + Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Dotychczasowe działania</label>
                <select
                  value={ctx.prior_actions}
                  onChange={e => set('prior_actions', e.target.value as IntakeContext['prior_actions'])}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-white appearance-none
                             focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  {PRIOR.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Kwota w sprawie (PLN)</label>
                <input
                  type="number"
                  value={ctx.amount || ''}
                  onChange={e => set('amount', Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700
                             focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── TERTIARY: Notes + Submit ── */}
      <div className="relative mb-8">
        <div className="flex items-center bg-slate-900/60 border border-slate-800/60 rounded-2xl px-5 py-4 gap-3">
          <span className="text-slate-600 text-lg shrink-0">✏️</span>
          <input
            type="text"
            value={ctx.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Czy chcesz coś dodać? Opisz, a Advocop przygotuje strategię."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
          />
          <button
            onClick={() => onSubmit(ctx)}
            className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center
                       transition-all duration-200 shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.25)] shrink-0"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ── Back link ── */}
      <button
        onClick={onBack}
        className="block mx-auto text-xs text-slate-600 hover:text-slate-400 transition-colors"
      >
        ← Zmień dokumenty
      </button>
    </div>
  );
};

export default IntakeScreen;
