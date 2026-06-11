import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Shield } from 'lucide-react';
import { OperationalStep } from '../types';
import KeyholeText from './KeyholeText';
import { COMMON_LEGAL_KEYWORDS } from '../constants';
import { cleanupContent, processContentWithCitations } from '../utils/LexLinker';

interface DrawerContentProps {
  selectedStep: OperationalStep;
  isUnlocked: boolean;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ selectedStep, isUnlocked }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
       <div className="px-10 py-12">
          {isUnlocked ? (
            <div className="font-sans text-slate-300">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-8 pb-6 border-b border-white/10" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-emerald-400 mt-12 mb-4 uppercase tracking-widest" {...props} />,
                  p: ({node, ...props}) => <p className="mb-6 leading-relaxed text-[16px] font-light" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2 pl-2 border-l border-emerald-500/20" {...props} />,
                  a: ({node, ...props}) => (
                    <a 
                      {...props} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#FFCC80' }}
                      className="font-bold hover:text-amber-200 transition-colors underline decoration-amber-500/20"
                    />
                  ),
                  // TABLE MAGIC (OMNI-CPO)
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto rounded-lg border border-slate-800 my-8 shadow-lg">
                      <table className="w-full text-left border-collapse bg-slate-900/50 text-sm" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => (
                    <thead className="bg-slate-950 text-emerald-400 font-bold uppercase tracking-wider text-[10px]" {...props} />
                  ),
                  tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-800/50" {...props} />,
                  tr: ({node, ...props}) => (
                    <tr className="hover:bg-slate-800/30 transition-colors" {...props} />
                  ),
                  th: ({node, ...props}) => (
                    <th className="p-4 border-b border-slate-800 whitespace-nowrap" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="p-4 text-slate-300 vertical-top" {...props} />
                  )
                }}
              >
                {processContentWithCitations(cleanupContent(selectedStep.content || "", selectedStep.type))}
              </ReactMarkdown>

              {/* Disclaimer */}
              <div className="mt-24 p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-slate-400 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                 <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                       WYGENEROWANO PRZEZ AI • NOTA PRAWNA
                    </span>
                 </div>
                 <p className="text-xs leading-relaxed opacity-80 font-light">
                    Niniejszy dokument został sporządzony automatycznie przez system sztucznej inteligencji (Advocop Swarm) zgodnie z wymogami <strong>EU AI Act</strong>. 
                    Materiał stanowi wyłącznie wzór do adaptacji i <u>nie zastępuje porady prawnej</u> świadczonej przez adwokata lub radcę prawnego. 
                    Użytkownik ponosi pełną odpowiedzialność za weryfikację danych i skutki prawne wykorzystania pisma (Art. 13 Prawa o Adwokaturze a contrario).
                 </p>
              </div>
              <div className="h-20"></div>
            </div>
          ) : (
            <div className="relative">
              <KeyholeText 
                text={selectedStep.content || "Brak treści dokumentu."} 
                keywords={COMMON_LEGAL_KEYWORDS} 
              />
              <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none"></div>
            </div>
          )}
       </div>
    </div>
  );
};