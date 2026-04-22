import React, { useState } from 'react';
import { ImageIcon, Maximize2, X } from 'lucide-react';

const EvidenceGallery = ({ images = [], isLoading }) => {
  const [selectedImg, setSelectedImg] = useState(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-3">
          <div className="text-[#0E4DA4]">
             <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">Evidence Gallery</h3>
        </div>
        <span className="text-[12px] font-medium text-slate-500">{images.length} Attachments</span>
      </div>

      {images.length === 0 ? (
        <div className="py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-300">
           <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
           <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-none">Visual Evidence Required</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div 
              key={i} 
              className="group relative aspect-square rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-[#0E4DA4] transition-all"
              onClick={() => setSelectedImg(img)}
            >
              <img src={img} alt={`Evidence ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#0E4DA4]/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <Maximize2 className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={selectedImg} alt="Evidence Full" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300" />
        </div>
      )}
    </div>
  );
};

export default EvidenceGallery;
