import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  onClick,
  ...props 
}) => {
  const baseStyles = "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300";
  
  const hoverStyles = hoverable || onClick 
    ? "cursor-pointer hover:shadow-xl hover:border-primary/40 hover:-translate-y-1" 
    : "";
    
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 border-b border-slate-100 dark:border-slate-800 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

export default Card;
