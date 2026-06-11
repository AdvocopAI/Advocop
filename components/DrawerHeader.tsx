import React from 'react';
import { Printer, Download, X } from 'lucide-react';
import { OperationalStep } from '../types';

interface DrawerHeaderProps {
  selectedStep: OperationalStep;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ selectedStep, onClose, onPrint, onDownload }) => {
  return (
    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-emerald-500 tracking-[0.3em] uppercase">
          {selectedStep.type}
        </span>
        <h3 className="text-white font-bold text-sm opacity-50 truncate max-w-[300px]">
          {selectedStep.title}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onPrint} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors" title="Drukuj">
          <Printer className="w-5 h-5" />
        </button>
        <button onClick={onDownload} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors" title="Pobierz TXT">
          <Download className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-2"></div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-red-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};