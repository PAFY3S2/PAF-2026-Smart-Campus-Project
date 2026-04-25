import React from 'react';
import { Upload, X, Save } from 'lucide-react';
import Button from '../common/Button';

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
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Resource Image
          </label>
          {imagePreview ? (
            <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    PNG, JPG or WEBP (MAX. 5MB)
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
            <p className="text-xs text-rose-500 mt-2">{errors.image}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Resource Name *
              </label>
              <span className="text-xs text-slate-400 font-medium">
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
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:outline-none transition ${
                touched.name && errors.name
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary'
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-xs text-rose-500 mt-1 animate-pulse">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="type"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition"
            >
              <option value="ROOM">Room</option>
              <option value="LAB">Lab</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="location"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Location *
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Building A"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:outline-none transition ${
                touched.location && errors.location
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary'
              }`}
            />
            {touched.location && errors.location && (
              <p className="text-xs text-rose-500 mt-1 animate-pulse">
                {errors.location}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="capacity"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Capacity {formData.type !== 'EQUIPMENT' && '*'}
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
              className={`w-full px-4 py-2 border rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:outline-none transition ${
                formData.type === 'EQUIPMENT'
                  ? 'bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                  : 'bg-white dark:bg-slate-800'
              } ${
                touched.capacity && errors.capacity
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary'
              }`}
            />
            {touched.capacity && errors.capacity && (
              <p className="text-xs text-rose-500 mt-1 animate-pulse">
                {errors.capacity}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition"
            >
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="availabilityStartTime"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
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
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:outline-none transition ${
                touched.availabilityStartTime && errors.availabilityStartTime
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary'
              }`}
            />
            {touched.availabilityStartTime && errors.availabilityStartTime && (
              <p className="text-xs text-rose-500 mt-1 animate-pulse">
                {errors.availabilityStartTime}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="availabilityEndTime"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
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
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:outline-none transition ${
                touched.availabilityEndTime && errors.availabilityEndTime
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary'
              }`}
            />
            {touched.availabilityEndTime && errors.availabilityEndTime && (
              <p className="text-xs text-rose-500 mt-1 animate-pulse">
                {errors.availabilityEndTime}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end items-center border-t border-slate-100 dark:border-slate-800 mt-6 pt-6">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mr-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid}
            isLoading={isSubmitting}
          >
            {!isSubmitting && <Save className="w-4 h-4 mr-2" />}
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Resource' : 'Save Resource'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
