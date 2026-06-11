import React, { useState, useEffect, useRef } from 'react';

export const VectorHud: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<{top: number, left: number, width: number, height: number} | null>(null);
  const rafRef = useRef<number | null>(null);

  // Helper to safely get class string (handles SVGs)
  const getSafeClassName = (el: HTMLElement | Element): string => {
    if (!el) return '';
    const cls = el.className;
    // SVG className is an object (SVGAnimatedString)
    if (typeof cls === 'object' && cls !== null && 'baseVal' in cls) {
      return String((cls as any).baseVal);
    }
    // Standard HTML element
    if (typeof cls === 'string') {
      return cls;
    }
    return '';
  };

  // Toggle HUD with Ctrl + .
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        setIsActive(prev => !prev);
        setHoveredEl(null);
        setBox(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Update Box Position
  const updateBox = (target: HTMLElement) => {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    
    // Safety check for invisible elements or zero-size
    if (rect.width === 0 || rect.height === 0) return;

    setBox({
      top: rect.top, // Use fixed positioning relative to viewport for the overlay
      left: rect.left,
      width: rect.width,
      height: rect.height
    });
  };

  // Track Mouse & Scroll
  useEffect(() => {
    if (!isActive) {
      setBox(null);
      setHoveredEl(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      // Ignore the HUD itself
      if (target.closest('#vector-hud-layer')) return;
      
      setHoveredEl(target);
      
      // Use RAF for smooth updates
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateBox(target));
    };

    const handleScroll = () => {
      if (hoveredEl) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => updateBox(hoveredEl));
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!isActive || !hoveredEl) return;
      e.preventDefault();
      e.stopPropagation();

      // GENERATE PROMPT
      const tagName = hoveredEl.tagName.toLowerCase();
      const text = hoveredEl.innerText?.substring(0, 50).replace(/\n/g, ' ') || "";
      const classes = getSafeClassName(hoveredEl);
      
      const prompt = `>frame Target: <${tagName} class="${classes}"> containing "${text}" -> [INSTRUCTION HERE]`;
      
      navigator.clipboard.writeText(prompt).then(() => {
        alert("VECTOR LOCKED: Prompt copied to clipboard!\nPaste it in Gemini CLI.");
      });
      
      setIsActive(false); // Deactivate after capture
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true); 
    window.addEventListener('scroll', handleScroll, true); // Capture scroll too

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('scroll', handleScroll, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, hoveredEl]);

  if (!isActive) return null;

  return (
    <div id="vector-hud-layer" className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Mode Indicator */}
      <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-mono text-xs font-bold shadow-neon animate-pulse pointer-events-auto">
        VECTOR MODE ACTIVE (Ctrl+.)
      </div>

      {/* The Vector Box - Using FIXED position to match getBoundingClientRect */}
      {box && (
        <div 
          className="fixed border-2 border-red-500 bg-red-500/10 transition-all duration-75 ease-out pointer-events-none"
          style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
          }}
        >
          <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-2 py-0.5 font-mono truncate max-w-[200px]">
            {hoveredEl?.tagName.toLowerCase()} {getSafeClassName(hoveredEl!).split(' ')[0]}...
          </div>
        </div>
      )}
    </div>
  );
};