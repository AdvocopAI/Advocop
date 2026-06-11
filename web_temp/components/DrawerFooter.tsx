import React from 'react';
import { Lock } from 'lucide-react';

interface DrawerFooterProps {
  onUnlock: () => void;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({ onUnlock }) => {
  return (
    <div className="p-8 border-t border-white/5 bg-slate-900/80 backdrop-blur-2xl absolute bottom-0 w-full z-20">
       <button 
         onClick={onUnlock}
         className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] group"
       >
         <span>ODBLOKUJ PEŁNĄ TREŚĆ</span>
         <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
       </button>
       <p className="text-center text-[9px] text-slate-500 mt-4 uppercase tracking-[0.2em]">
         Szybka płatność • Bezpieczne szyfrowanie
       </p>
    </div>
  );
};