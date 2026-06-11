import React, { useState } from 'react';
import { CheckCircle, Search, Target, Calendar, FileWarning, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import DarkOutlineButton from './DarkOutlineButton';

interface StrategicStackProps {
  summary: string;
  escalationIndex?: number;
  escalationQuote?: string;
}

const getZone = (idx: number) => {
  if (idx < 34) return { label: 'Spokojnie', color: 'text-emerald-400', bg: 'bg-emerald-400' };
  if (idx < 67) return { label: 'Stanowczo', color: 'text-amber-400',   bg: 'bg-amber-400'   };
  return             { label: 'Spór',       color: 'text-rose-400',    bg: 'bg-rose-400'    };
};

export const StrategicStack: React.FC<StrategicStackProps> = ({ summary, escalationIndex, escalationQuote }) => {
  const [quoteExpanded, setQuoteExpanded] = useState(false);
  const [errorsExpanded, setErrorsExpanded] = useState(false);

  if (!summary) return null;

  // --- Extraction ---
  const cleanText = summary
    .replace(/^OK\.|^Rozumiem\.|^Analizuję.*?(\.|\\n)/gi, '')
    .replace(/wydobywam z nich żądane informacje/gi, '')
    .replace(/Obraz \d+/gi, '')
    .replace(/\*\*/g, '')
    .trim();

  const extract = (key: string) => {
    const m = cleanText.match(new RegExp(`${key}:\\s*(.*?)(?=\\n|$)`, 'i'));
    return m ? m[1].trim() : null;
  };
  const sanitize = (v: string | null, fb: string) => {
    if (!v) return fb;
    return ['nieczytelny','niewyraźny','brak danych'].some(t => v.toLowerCase().includes(t)) ? fb : v;
  };

  const nadawca       = sanitize(extract('NADAWCA'), 'Nie zidentyfikowano');
  const adresat       = sanitize(extract('ADRESAT'), '—');
  const typ           = extract('TYP PISMA');
  const datyRaw       = extract('DATY') || extract('DATA');
  const reprezentacja = extract('REPREZENTACJA') || extract('PEŁNOMOCNIK');
  const bledy         = extract('BŁĘDY FORMALNE') || extract('BŁĘDY');

  // Format dates to have line breaks instead of one line
  const datyFormatted = datyRaw ? datyRaw.replace(/(\.)\s+([A-Z])/g, '$1\n$2') : '—';

  const isGenericError = !bledy || bledy.length < 20;
  const displayErrors  = isGenericError
    ? 'Nie wykryto krytycznych błędów formalnych. Sprawdź dokumenty operacyjne poniżej.'
    : bledy!;

  const eIdx = escalationIndex ?? 50;
  const zone = getZone(eIdx);
  const QLIMIT = 90;
  
  const quoteShort = escalationQuote && escalationQuote.length > QLIMIT
    ? escalationQuote.slice(0, QLIMIT) + '…'
    : escalationQuote;

  const errLimit = 120;
  const errShort = !isGenericError && displayErrors.length > errLimit
    ? displayErrors.slice(0, errLimit) + '…'
    : displayErrors;

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Badge */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 tracking-wider">ANALIZA ZAKOŃCZONA SUKCESEM</span>
        </div>
      </div>

      {/* Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">

          {/* ── ROW 1: Title bar ── */}
          <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-slate-800/60">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
              <Search className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Raport Operacyjny</h3>
              <p className="text-[10px] text-slate-600 font-mono">STATUS: POTWIERDZONY • P.P.: 98.5%</p>
            </div>
          </div>

          {/* ── ROW 2: Escalation bar (Enterprise Apple logic) ── */}
          {escalationIndex !== undefined && (
            <div className="px-6 py-5 border-b border-slate-800/40 space-y-3 bg-slate-900/20">
              
              {/* Bar container - ultra clean */}
              <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-out rounded-full"
                  style={{ 
                    width: `${eIdx}%`,
                    background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #f43f5e 100%)`,
                    backgroundSize: '300% 100%',
                    backgroundPosition: `${(eIdx / 100) * 100}% 0`
                  }} 
                />
                {/* Minimal needle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-1000"
                  style={{ left: `calc(${eIdx}% - 2px)` }} 
                />
              </div>

              {/* Labels - clear separation */}
              <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest uppercase text-slate-600">
                <span className={eIdx < 34 ? 'text-emerald-400' : ''}>Spokojnie</span>
                <span className={eIdx >= 34 && eIdx < 67 ? 'text-amber-400' : ''}>Stanowczo</span>
                <span className={eIdx >= 67 ? 'text-rose-400' : ''}>Spór</span>
              </div>

              {/* Quote - Enterprise Unfold */}
              {escalationQuote && (
                <div className="mt-4 flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${zone.bg} flex-shrink-0 shadow-[0_0_8px_currentColor]`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${zone.color}`}>{zone.label}</span>
                       <span className="text-slate-600 text-[10px] font-mono">{eIdx}/100</span>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      "{quoteExpanded ? escalationQuote : quoteShort}"
                    </p>
                  </div>
                  {escalationQuote.length > QLIMIT && (
                    <button 
                      onClick={() => setQuoteExpanded(!quoteExpanded)}
                      className="flex items-center justify-center p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0 border border-slate-700/50"
                      title={quoteExpanded ? 'Zwiń' : 'Rozwiń'}
                    >
                      {quoteExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ROW 3: Key metadata chips ── */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-4 gap-6 border-b border-slate-800/40">

            {/* Nadawca */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Nadawca</span>
              </div>
              <p className="text-xs text-white font-medium leading-relaxed">{nadawca}</p>
            </div>

            {/* Adresat */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Adresat</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{adresat}</p>
            </div>

            {/* Typ pisma */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <FileWarning className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Typ pisma</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{typ || '—'}</p>
            </div>

            {/* Daty */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Daty</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{datyFormatted}</p>
            </div>
          </div>

          {/* ── ROW 4: Representacja + Błędy ── */}
          <div className="px-6 py-5 bg-slate-900/30">

            {reprezentacja && (
              <div className="mb-5 flex items-center gap-2.5 py-2.5 px-4 bg-teal-950/20 border border-teal-500/20 rounded-lg inline-flex">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">Reprezentacja:</span>
                <span className="text-xs text-teal-100 font-medium tracking-wide">{reprezentacja}</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                   Wykryte błędy / Możliwości obrony
                 </span>
              </div>
              
              {isGenericError ? (
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-xs">{displayErrors}</span>
                  <DarkOutlineButton onClick={() => document.getElementById('operational-library')?.scrollIntoView({ behavior: 'smooth' })}>
                    Przejdź ↓
                  </DarkOutlineButton>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <p className="text-sm text-slate-300 leading-relaxed flex-1">
                    {errorsExpanded ? displayErrors : errShort}
                  </p>
                  {displayErrors.length > errLimit && (
                    <button 
                      onClick={() => setErrorsExpanded(!errorsExpanded)}
                      className="flex items-center justify-center p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0 border border-slate-700/50 mt-1"
                      title={errorsExpanded ? 'Zwiń' : 'Rozwiń'}
                    >
                      {errorsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};