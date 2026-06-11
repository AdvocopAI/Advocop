import React, { useState } from 'react';
import { AppView, AnalysisResponse, IntakeContext } from './types';
import { uploadDocument } from './services/api';
import Hero from './components/Hero';
import IntakeScreen from './components/IntakeScreen';
import LoadingSequence from './components/LoadingSequence';
import OperationalLibrary from './components/OperationalLibrary';
import { VectorHud } from './components/VectorHud';
import { StrategicStack } from './components/StrategicStack';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('upload');
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Step 1: User selects files → transition to intake screen
  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files);
    setView('intake');
  };

  // Step 2: User completes intake → trigger analysis with context
  const handleIntakeSubmit = async (context: IntakeContext) => {
    setView('analyzing');

    try {
      // Start request with context
      const dataPromise = uploadDocument(uploadedFiles, context);

      // Ensure loader shows for at least 4 seconds for UX effect
      const delayPromise = new Promise(resolve => setTimeout(resolve, 4000));

      const [data] = await Promise.all([dataPromise, delayPromise]);

      setAnalysisData(data);
      setView('results');
    } catch (error) {
      console.error("Critical Failure", error);
      alert(`Błąd analizy: ${error instanceof Error ? error.message : String(error)}`);
      setView('intake'); // Go back to intake, not upload — files are still loaded
    }
  };

  // Back to upload from intake
  const handleBackToUpload = () => {
    setUploadedFiles([]);
    setView('upload');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <VectorHud />
      
      {/* Top Bar */}
      <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-widest text-white text-lg">ADVO<span className="text-emerald-500">COP🤖</span></span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">SYSTEM STATUS: ONLINE</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-neon animate-pulse"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 pb-12 flex flex-col items-center min-h-screen">
        
        {view === 'upload' && (
          <Hero onFileSelect={handleFileSelect} />
        )}

        {view === 'intake' && (
          <IntakeScreen
            files={uploadedFiles}
            onSubmit={handleIntakeSubmit}
            onBack={handleBackToUpload}
          />
        )}

        {view === 'analyzing' && (
          <div className="w-full max-w-2xl">
            <LoadingSequence />
          </div>
        )}

        {view === 'results' && analysisData && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <StrategicStack 
              summary={analysisData.analysis_summary} 
              escalationIndex={analysisData.escalation_index}
              escalationQuote={analysisData.escalation_quote}
            />
            <OperationalLibrary data={analysisData} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 text-center">
        <p className="text-slate-500 font-bold tracking-widest text-sm mb-2">© 2026 ADVOCOP SYSTEM</p>
        <p className="text-[10px] text-slate-600 max-w-2xl mx-auto leading-relaxed uppercase">
          System oparty na sztucznej inteligencji (AI Act Compliant). Generowane treści mają charakter wyłącznie informacyjny i symulacyjny.<br/>
          Nie stanowią porady prawnej ani wykładni prawa w rozumieniu ustawy o radcach prawnych.
        </p>
      </footer>
    </div>
  );
};

export default App;