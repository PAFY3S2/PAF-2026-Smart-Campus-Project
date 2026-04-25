import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, Loader2 } from 'lucide-react';

const Tickets = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get('/resources').then(res => setResources(res.data));
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...imageUrls].slice(0, 3));
    }
  };

  const formik = useFormik({
    initialValues: {
      resourceId: '',
      category: '',
      priority: 'LOW',
      description: ''
    },
    validationSchema: Yup.object({
      resourceId: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      priority: Yup.string().required('Required'),
      description: Yup.string().required('Required').min(10, 'Must be at least 10 characters')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await api.post('/tickets', { ...values, userId: user.id, images });
        setSuccess(true);
        resetForm();
        setImages([]);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Create an Incident Ticket</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
            Ticket submitted successfully! A technician will review it shortly.
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Resource / Location</label>
              <select
                name="resourceId"
                value={formik.values.resourceId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="" label="Select a resource" />
                {resources.map(res => (
                  <option value={res.id} key={res.id}>{res.name}</option>
                ))}
              </select>
              {formik.touched.resourceId && formik.errors.resourceId && <div className="text-xs text-rose-500">{formik.errors.resourceId}</div>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="" label="Select category" />
                <option value="HARDWARE">Hardware / IT</option>
                <option value="SOFTWARE">Software / Network</option>
                <option value="FACILITIES">Facilities / Cleaning</option>
                <option value="OTHER">Other</option>
              </select>
              {formik.touched.category && formik.errors.category && <div className="text-xs text-rose-500">{formik.errors.category}</div>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Priority Level</label>
            <div className="flex gap-4">
              {['LOW', 'MEDIUM', 'HIGH'].map(pLevel => (
                <label key={pLevel} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={pLevel}
                    checked={formik.values.priority === pLevel}
                    onChange={formik.handleChange}
                    className="text-primary focus:ring-primary"
                  />
                  <span className={`text-sm font-medium ${pLevel === 'HIGH' ? 'text-rose-600' : pLevel === 'MEDIUM' ? 'text-amber-600' : 'text-slate-600'}`}>
                    {pLevel}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Provide details about the issue..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.description && formik.errors.description ? 'border-rose-500' : 'border-slate-300'}`}
            ></textarea>
            {formik.touched.description && formik.errors.description && <div className="text-xs text-rose-500">{formik.errors.description}</div>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Upload Images (Max 3)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 mb-2">Click to upload or drag and drop</p>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
              />
            </div>
            {images.length > 0 && (
              <div className="flex gap-4 mt-4">
                {images.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i}`} className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Ticket...</> : 'Submit Incident Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tickets;
