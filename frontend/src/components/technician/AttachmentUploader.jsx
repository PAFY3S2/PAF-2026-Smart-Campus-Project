import React, { useState } from 'react';
import { CloudUpload, X, Eye } from 'lucide-react';

const AttachmentUploader = ({ maxFiles = 3 }) => {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxFiles) {
      alert(`Max ${maxFiles} images allowed.`);
      return;
    }

    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attachments ({images.length}/{maxFiles})</h4>
        {images.length < maxFiles && (
          <label className="cursor-pointer flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#142B5D] dark:text-[#F5AB24] hover:opacity-75 transition">
            <CloudUpload className="w-4 h-4" />
            <span>Upload Image</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
          </label>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-[#F5AB24]">
            <img src={img} alt="Attachment" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
              <button 
                onClick={() => setPreviewImage(img)}
                className="p-2 bg-white rounded-full text-slate-800 hover:scale-110 transition"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => removeImage(i)}
                className="p-2 bg-rose-500 rounded-full text-white hover:scale-110 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-3 py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest">
            No visual evidence
          </div>
        )}
      </div>

      {previewImage && (
        <div 
          className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-8 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-2xl" />
            <button className="absolute -top-12 right-0 text-white hover:text-[#F5AB24] transition">
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
