import React from 'react';

interface KeyholeTextProps {
  text: string;
  keywords: string[];
}

const KeyholeText: React.FC<KeyholeTextProps> = ({ text, keywords }) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Replace special characters that might break regex
  const escapedKeywords = keywords.map(kw => kw.replace(/[.*+?^${}()|[\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

  text.replace(regex, (match, p1, offset) => {
    // Add the blurred part before the keyword
    if (offset > lastIndex) {
      parts.push(
        <span key={`blurred-${lastIndex}`} className="blur-[2px] opacity-70">
          {text.substring(lastIndex, offset)}
        </span>
      );
    }
    // Add the highlighted keyword
    parts.push(
      <span key={`highlight-${offset}`} className="font-bold text-emerald-300 bg-emerald-700/30 px-1 rounded-sm shadow-text-neon-sm">
        {p1}
      </span>
    );
    lastIndex = offset + match.length;
    return match; // Return the match to keep replace working
  });

  // Add any remaining blurred part after the last keyword
  if (lastIndex < text.length) {
    parts.push(
      <span key={`blurred-${lastIndex}`} className="blur-[2px] opacity-70">
        {text.substring(lastIndex)}
      </span>
    );
  }

  return (
    <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap relative">
      {parts}
    </p>
  );
};

export default KeyholeText;