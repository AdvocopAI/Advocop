import React, { useState, useEffect } from 'react';
import { AnalysisResponse, OperationalStep } from '../types';
import { Map, FileText, Shield, Activity, ChevronRight } from 'lucide-react';
import { DrawerHeader } from './DrawerHeader';
import { DrawerContent } from './DrawerContent';
import { DrawerFooter } from './DrawerFooter';

interface OperationalLibraryProps {
  data: AnalysisResponse;
}

const OperationalLibrary: React.FC<OperationalLibraryProps> = ({ data }) => {
  const [selectedStep, setSelectedStep] = useState<OperationalStep | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (selectedStep) {
      console.log("OMNI-LOG: Opening Step:", selectedStep.title);
    }
  }, [selectedStep]);

  const steps = data.operational_steps.sort((a, b) => a.order_id - b.order_id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'INSTRUCTION': return <Map className="w-5 h-5 text-blue-400" />;
      case 'DOCUMENT': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'ANALYSIS': return <Activity className="w-5 h-5 text-purple-400" />;
      default: return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  const handlePrint = () => { 
    if (isUnlocked) window.print(); 
    else alert("Zablokowane."); 
  };
  
  const handleDownload = () => {
    if (!isUnlocked) {
      alert("Zablokowane.");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([selectedStep?.content || ""], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedStep?.title || "dokument"}.txt`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleUnlock = () => {
    if (confirm("Odblokować pełną teczkę operacyjną za 39 PLN?")) {
      setIsUnlocked(true);
    }
  };

  return (
    <div id="operational-library" className="w-full max-w-5xl mx-auto pb-24 relative">
      
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
          BIBLIOTECZKA <span className="text-emerald-400">OPERACYJNA</span>
        </h2>
        <p className="text-slate-400 text-lg">Twój strategiczny plan działania przygotowany przez Rój AI.</p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div 
            key={step.order_id}
            onClick={() => setSelectedStep(step)}
            className={`
              group relative flex items-center justify-between p-6 
              bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/50 
              rounded-2xl cursor-pointer transition-all duration-500 hover:bg-slate-900/80
              ${selectedStep?.order_id === step.order_id ? 'border-emerald-500 bg-slate-900 shadow-neon-sm' : ''}
            `}
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-500`}>
                {getIcon(step.type)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{step.type}</span>
                   <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-neon-sm"></div>
                   <span className="text-[10px] font-bold text-emerald-400 tracking-widest">GOTOWE</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold text-emerald-500">
                  <span>OTWÓRZ</span>
                  <ChevronRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full md:w-[650px] bg-slate-950 border-l border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50
        transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col
        ${selectedStep ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {selectedStep && (
          <>
            <DrawerHeader 
              selectedStep={selectedStep} 
              onClose={() => setSelectedStep(null)}
              onPrint={handlePrint}
              onDownload={handleDownload}
            />

            <DrawerContent 
              selectedStep={selectedStep} 
              isUnlocked={isUnlocked} 
            />

            {!isUnlocked && (
              <DrawerFooter onUnlock={handleUnlock} />
            )}
          </>
        )}
      </div>

      {/* Backdrop */}
      {selectedStep && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-500"
          onClick={() => setSelectedStep(null)}
        />
      )}

    </div>
  );
};

export default OperationalLibrary;