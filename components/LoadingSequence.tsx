import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Binary, Cpu } from 'lucide-react';

const steps = [
  { text: "Nawiązywanie bezpiecznego połączenia...", icon: Lock },
  { text: "Szyfrowanie danych E2E...", icon: ShieldCheck },
  { text: "Skanowanie struktury dokumentu...", icon: Binary },
  { text: "Analiza prawna w toku...", icon: Cpu },
];

const LoadingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200); // 1.2s per step
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative bg-slate-900 border border-emerald-500/50 p-6 rounded-2xl shadow-neon">
          <StepIcon className="w-16 h-16 text-emerald-400 animate-pulse-fast" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 font-mono tracking-wider">
        {steps[currentStep].text}
      </h2>
      
      <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite] w-full origin-left scale-x-0"></div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-2 w-full max-w-sm opacity-50">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-colors duration-500 ${idx <= currentStep ? 'bg-emerald-500' : 'bg-slate-800'}`}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(0); margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSequence;