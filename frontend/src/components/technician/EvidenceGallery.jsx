import React, { useState } from 'react';
import { ImageIcon, Maximize2, X, AlertCircle } from 'lucide-react';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // If it's a dummy value like "url1" without extension, show a placeholder
  if (!url.includes('.') && url.length < 30) {
    return `https://placehold.co/600x400/142B5D/FFFFFF?text=${encodeURIComponent(url)}`;
  }
  
  // Prepend backend URL for relative paths
  return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
};

const ImageItem = ({ img, index, onImageClick }) => {
  const [hasError, setHasError] = useState(false);
  const resolvedImg = getImageUrl(img);

  if (!resolvedImg || hasError) {
    return (
      <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 transition-all">
        <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          {hasError ? 'Failed to Load' : 'Invalid Image'}
        </span>
      </div>
    );
  }

  return (
    <div 
      className="group relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-[#F5AB24] transition-all shadow-sm"
      onClick={() => onImageClick(resolvedImg)}
    >
      <img 
        src={resolvedImg} 
        alt={`Evidence ${index + 1}`} 
        onError={() => setHasError(true)}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
      />
      <div className="absolute inset-0 bg-[#142B5D]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
         <Maximize2 className="w-8 h-8 text-white drop-shadow-lg mb-2 transform scale-75 group-hover:scale-100 transition-transform duration-300" />
         <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">Preview</span>
      </div>
    </div>
  );
};

const EvidenceGallery = ({ images = [], isLoading }) => {
  const [selectedImg, setSelectedImg] = useState(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#F5AB24]/10 rounded-lg">
             <ImageIcon className="w-5 h-5 text-[#F5AB24]" />
          </div>
          <h3 className="text-xs font-black text-[#142B5D] dark:text-white uppercase tracking-[0.1em]">Evidence Gallery</h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          {images.length} {images.length === 1 ? 'Attachment' : 'Attachments'}
        </span>
      </div>

      {images.length === 0 ? (
        <div className="py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center text-slate-400">
           <ImageIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
           <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-2">No Visual Evidence Provided</p>
           <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">No attachments found for this request.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {images.map((img, i) => (
            <ImageItem key={i} img={img} index={i} onImageClick={setSelectedImg} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 lg:top-10 lg:right-10 p-3 lg:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <img 
            src={selectedImg} 
            alt="Evidence Full View" 
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300 border border-white/10 select-none" 
          />
        </div>
      )}
    </div>
  );
};

export default EvidenceGallery;
