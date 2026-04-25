import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false, 
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary-hover hover:-translate-y-0.5",
    secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 shadow-sm hover:shadow-md hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5",
    outline: "border-2 border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-transparent",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
    danger: "bg-rose-500 text-white shadow-md hover:shadow-lg hover:bg-rose-600 hover:-translate-y-0.5",
  };
  
  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-2.5 px-6 text-sm",
    lg: "py-3.5 px-8 text-base",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const combinedClassName = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthClass} ${className}`.trim();
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClassName}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      <span className={`flex items-center justify-center ${isLoading ? "opacity-90" : ""}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;
