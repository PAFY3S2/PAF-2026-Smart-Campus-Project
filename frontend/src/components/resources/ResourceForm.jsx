import React from 'react';
import { Upload, X, Save, Loader2 } from 'lucide-react';

const ResourceForm = ({
  formData,
  errors,
  touched,
  imagePreview,
  isSubmitting,
  isFormValid,
  isEditMode,
  handleChange,
  handleBlur,
  handleImageChange,
  removeImage,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-all">
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest">
            Resource Visual Asset
          </label>
          {imagePreview ? (
            <div className="relative w-full max-w-md h-56 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#F5AB24] transition-all duration-300 group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#142B5D] dark:text-[#F5AB24]" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                    Upload Resource Image
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-bold">
                    PNG, JPG OR WEBP (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
          {errors.image && (
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-2">{errors.image}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label
                htmlFor="name"
                className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
              >
                Resource Name *
              </label>
              <span className="text-[10px] text-slate-400 font-bold">
                {formData.name?.length || 0}/50
              </span>
            </div>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              maxLength={50}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Main Auditorium"
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                touched.name && errors.name
                  ? 'border-rose-500'
                  : 'border-slate-100 dark:border-slate-800 focus:border-[#F5AB24]'
              } font-medium text-sm`}
            />
            {touched.name && errors.name && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="type"
              className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
            >
              System Category *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#F5AB24] transition-all font-medium text-sm"
            >
              <option value="ROOM">Room / Hall</option>
              <option value="LAB">Research Lab</option>
              <option value="EQUIPMENT">Digital Equipment</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
            >
              Institutional Location *
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Building A - Floor 2"
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                touched.location && errors.location
                  ? 'border-rose-500'
                  : 'border-slate-100 dark:border-slate-800 focus:border-[#F5AB24]'
              } font-medium text-sm`}
            />
            {touched.location && errors.location && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                {errors.location}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="capacity"
              className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
            >
              Unit Capacity {formData.type !== 'EQUIPMENT' && '*'}
            </label>
            <input
              id="capacity"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 50"
              disabled={formData.type === 'EQUIPMENT'}
              className={`w-full px-4 py-3 border-2 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                formData.type === 'EQUIPMENT'
                  ? 'bg-slate-50 dark:bg-slate-900 cursor-not-allowed border-slate-100 dark:border-slate-800 text-slate-400'
                  : 'bg-white dark:bg-slate-800'
              } ${
                touched.capacity && errors.capacity
                  ? 'border-rose-500'
                  : 'border-slate-100 dark:border-slate-800 focus:border-[#F5AB24]'
              } font-medium text-sm`}
            />
            {touched.capacity && errors.capacity && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                {errors.capacity}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
            >
              Operational Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#F5AB24] transition-all font-medium text-sm"
            >
              <option value="ACTIVE">System Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
              <option value="MAINTENANCE">Maintenance Mode</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="availabilityStartTime"
                className="text-[10px] font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
              >
                Available From *
              </label>
              <input
                id="availabilityStartTime"
                type="time"
                name="availabilityStartTime"
                value={formData.availabilityStartTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                  touched.availabilityStartTime && errors.availabilityStartTime
                    ? 'border-rose-500'
                    : 'border-slate-100 dark:border-slate-800 focus:border-[#F5AB24]'
                } font-medium text-sm`}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="availabilityEndTime"
                className="text-[10px] font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest"
              >
                Available Until *
              </label>
              <input
                id="availabilityEndTime"
                type="time"
                name="availabilityEndTime"
                value={formData.availabilityEndTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                  touched.availabilityEndTime && errors.availabilityEndTime
                    ? 'border-rose-500'
                    : 'border-slate-100 dark:border-slate-800 focus:border-[#F5AB24]'
                } font-medium text-sm`}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end items-center border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="mr-4 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#142B5D] hover:bg-[#0D1E40] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-lg shadow-[#142B5D]/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Syncing...' : isEditMode ? 'Update Unit' : 'Commit Resource'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
