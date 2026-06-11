// UTILITY: LexLege Linker & Content Cleanup

export const processContentWithCitations = (text: string) => {
  if (!text) return "";

  // OMNI-CTO BULLETPROOF REGEX v4 (FIXED)
  // Corrected lazy quantifier: {1,100}?
  const citationRegex = /(?:Art\.|art\.)\s*(\d+)([\s\S]{1,100}?)(k\.p\.w\.|k\.p\.k\.|k\.c\.|k\.k\.|p\.r\.d\.|k\.r\.o\.|k\.p\.a\.)(?!\w)/gi;

  const codeMap: Record<string, string> = {
    'kpw': 'kodeks-postepowania-w-sprawach-o-wykroczenia',
    'kpk': 'kpk',
    'kc': 'kodeks-cywilny',
    'kk': 'kodeks-karny',
    'prd': 'prawo-ruchu-drogowego',
    'kro': 'kodeks-rodzinny-i-opiekunczy',
    'kpa': 'kpa'
  };

  return text.replace(citationRegex, (match, articleNum, middleBit, codeRaw) => {
    const normalizedCode = codeRaw.replace(/\./g, '').toLowerCase();
    const slug = codeMap[normalizedCode];
    if (slug) {
      return `[${match}](https://lexlege.pl/${slug}/art-${articleNum}/)`;
    }
    return match;
  });
};

export const cleanupContent = (text: string, type: string) => {
  let cleaned = text;

  // 1. ISOLATION: Remove ANY subsequent document sections
  // Matches "--- DOKUMENT" or "--- DOCUMENT" or "DOKUMENT [Number]"
  const parts = cleaned.split(/---+\s*(?:DOKUMENT|DOCUMENT|CZĘŚĆ|KROK)\s*\d+/i);
  cleaned = parts[0].trim();

  // 2. COMPLIANCE PURGE: Kill all variants of disclaimers
  const disclaimers = [
    /---[\s\n]*NOTA PRAWNA[\s\S]*?---/gi,
    /NOTA PRAWNA[\s\S]*$/gi,
    /Disclaimer[\s\S]*$/gi,
    /Weryfikacja Prawna[\s\S]*$/gi,
    /Zastrzeżenie Prawne[\s\S]*$/gi
  ];
  
  disclaimers.forEach(regex => {
    cleaned = cleaned.replace(regex, '');
  });
  
  // 3. FORMATTING FIX: Space between summary and recommendation
  cleaned = cleaned.replace(/(wystarczające i utrzymać mandat w mocy\.)\s*(REKOMENDACJA:)/gi, '$1\n\n$2');
  
  // 4. HEADER FORMATTING: Bold and Stack (No Gap)
  cleaned = cleaned.replace(/\*\*Do:\*\*/gi, 'Do:').replace(/Do:/gi, '**Do:**');
  cleaned = cleaned.replace(/\*\*Sygnatura sprawy:\*\*/gi, 'Sygnatura sprawy:').replace(/Sygnatura sprawy:/gi, '**Sygnatura sprawy:**');
  cleaned = cleaned.replace(/([^\n])\s*(\*\*Sygnatura sprawy:)/gi, '$1  \n$2');

  // 5. SEMANTIC POLISH (User Facing)
  cleaned = cleaned.replace(/Status:\s*PILNE/gi, '**Status sprawy:** Pilny (Wymagana reakcja)');
  cleaned = cleaned.replace(/Analiza ryzyka i scenariusze/gi, 'Analiza Ryzyka Procesowego');
  cleaned = cleaned.replace(/ARGUMENTY ZA/gi, 'Argumenty przemawiające za obroną');
  cleaned = cleaned.replace(/ARGUMENTY PRZECIW/gi, 'Ryzyka i koszty');

  return cleaned.trim();
};