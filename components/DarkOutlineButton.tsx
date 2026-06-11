import React from 'react';

interface DarkOutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const DarkOutlineButton: React.FC<DarkOutlineButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`
        border border-emerald-500/50 
        rounded-md inline-flex items-center justify-center 
        py-2 px-6 
        text-center text-xs font-medium uppercase tracking-widest
        text-emerald-400 
        hover:bg-emerald-500/10 hover:border-emerald-400 
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default DarkOutlineButton;