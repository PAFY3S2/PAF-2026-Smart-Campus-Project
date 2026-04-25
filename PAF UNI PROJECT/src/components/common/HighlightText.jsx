import React from 'react';

const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }

  // Escape highlight string for regex
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-yellow-100/80 text-slate-900 dark:bg-yellow-900/40 dark:text-yellow-100 rounded-[2px] px-[1px] font-semibold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default HighlightText;
