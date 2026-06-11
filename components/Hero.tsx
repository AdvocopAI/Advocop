import React, { useRef, useState } from 'react';
import { Upload, AlertTriangle, Clock, Brain, Shield } from 'lucide-react';

interface HeroProps {
  onFileSelect: (files: File[]) => void;
}

const Hero: React.FC<HeroProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentPulsed, setConsentPulsed] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!consentGiven) { triggerConsentPulse(); return; }
    if (e.dataTransfer.files?.length > 0) onFileSelect(Array.from(e.dataTransfer.files));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length > 0) {
      onFileSelect(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!consentGiven) { triggerConsentPulse(); return; }
    fileInputRef.current?.click();
  };

  const triggerConsentPulse = () => {
    setConsentPulsed(true);
    setTimeout(() => setConsentPulsed(false), 900);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-10 pb-20">

      {/* ── HEADER ── */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          ADVO<span className="text-emerald-400">COP</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Prześlij dokumenty, a AI wygeneruje bardzo precyzyjną ścieżkę działania.
        </p>
      </div>

      {/* ── BETA ALERT BAR (horizontal, full-width, teal glassmorphism) ── */}
      <div className="mb-6 rounded-xl border border-teal-500/25 bg-teal-950/20 backdrop-blur-sm overflow-hidden shadow-[0_0_30px_rgba(20,184,166,0.06)]">
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

        <div className="flex items-start gap-4 px-5 py-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-teal-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest font-mono">
                Wersja Beta — Wymagana Anonimizacja
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Advocop Beta jest zintegrowany z zewnętrznym silnikiem chmurowym (infrastruktura Google Cloud). Aby zachować pełną zgodność z zasadami tajemnicy zawodowej, do testów prosimy używać wyłącznie zanonimizowanych dokumentów,{' '}
              <span className="text-teal-300/90 font-semibold">
                pozbawionych rzeczywistych danych osobowych (RODO).
              </span>
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/15 to-transparent" />
      </div>

      {/* ── UPLOAD ZONE ── */}
      <div
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-10 md:p-16
          transition-all duration-300 ease-in-out
          ${!consentGiven ? 'opacity-55 cursor-not-allowed' : ''}
          ${isDragging && consentGiven
            ? 'border-emerald-400 bg-emerald-900/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={`
            p-6 rounded-full bg-slate-800 transition-colors duration-300
            ${isDragging && consentGiven ? 'text-emerald-400 shadow-neon' : 'text-slate-400 group-hover:text-emerald-400'}
          `}>
            <Upload className="w-12 h-12" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Przeciągnij dokumenty tutaj</h3>
            <p className="text-slate-400">
              lub kliknij, aby wybrać pliki (PDF, JPG, PNG) — Wiele plików dozwolone!
            </p>
            {!consentGiven && (
              <p className="text-teal-300 text-xs mt-3 font-mono tracking-wider">
                ↓ Potwierdź oświadczenie poniżej, aby odblokować
              </p>
            )}
          </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-lg m-2 pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-lg m-2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500/50 rounded-bl-lg m-2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500/50 rounded-br-lg m-2 pointer-events-none" />
      </div>

      {/* ── CONSENT CHECKBOX ── */}
      <div className={`mt-4 transition-all duration-300 ${consentPulsed ? 'scale-[1.01]' : ''}`}>
        <label
          className={`flex items-start gap-3 cursor-pointer group px-5 py-4 rounded-xl border transition-all duration-300 ${
            consentGiven
              ? 'border-emerald-500/40 bg-emerald-950/15'
              : consentPulsed
              ? 'border-amber-500 bg-amber-950/25 shadow-[0_0_24px_rgba(245,158,11,0.18)]'
              : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
          }`}
        >
          {/* Checkbox */}
          <div
            onClick={() => setConsentGiven(v => !v)}
            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              consentGiven
                ? 'bg-emerald-500 border-emerald-500'
                : consentPulsed
                ? 'border-amber-500 bg-amber-500/15'
                : 'border-slate-600 group-hover:border-slate-400'
            }`}
          >
            {consentGiven && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <span className={`text-xs leading-relaxed transition-colors ${
            consentGiven ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'
          }`}>
            Potwierdzam, że przesyłane dokumenty testowe nie zawierają rzeczywistych danych osobowych ani informacji objętych tajemnicą zawodową.
          </span>
        </label>
      </div>

      {/* ── TRUST BADGES (restored to full 3-column symmetry) ── */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center p-4 bg-slate-900/30 rounded-lg border border-slate-800 h-full">
          <Shield className="w-8 h-8 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white text-sm uppercase tracking-wide">Bezpieczeństwo Danych</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Brak trwałego zapisu na naszych serwerach. Pliki są procesowane w efemerycznej sesji i usuwane z naszej infrastruktury natychmiast po wygenerowaniu odpowiedzi.
          </p>
        </div>

        <div className="flex flex-col items-center p-4 bg-slate-900/30 rounded-lg border border-slate-800 h-full">
          <Brain className="w-8 h-8 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white text-sm uppercase tracking-wide">Silnik Prawny AI</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Model trenowany na tysiącach polskich pism sądowych i administracyjnych. Architektura projektowana w oparciu o wytyczne bezpieczeństwa i minimalizacji danych.
          </p>
        </div>

        <div className="flex flex-col items-center p-4 bg-slate-900/30 rounded-lg border border-slate-800 h-full">
          <Clock className="w-8 h-8 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white text-sm uppercase tracking-wide">Dostępność 24/7</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            System operacyjny dostępny 24/7. Natychmiastowa reakcja na wezwania, gotowy do działania w każdej chwili.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;