import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Loading...", fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full blur-md bg-primary/30 animate-pulse"></div>
        {/* Main Spinner */}
        <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
      </div>
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
        {message}
      </h3>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
