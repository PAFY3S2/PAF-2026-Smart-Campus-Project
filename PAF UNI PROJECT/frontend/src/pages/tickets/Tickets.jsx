import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader title="Incident Management" subtitle="Institutional Support Ticket System" />

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-800 p-8 md:p-12 overflow-hidden relative transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#142B5D] opacity-5 dark:opacity-10 -translate-y-16 translate-x-16 rotate-45"></div>
        {success && (
          <div className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-400 rounded flex items-center shadow-sm">
            <div className="font-black text-xs uppercase tracking-widest text-[#142B5D] dark:text-emerald-400">Incident logged successfully. Technical unit notified.</div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Affected Resource</label>
              <select
                name="resourceId"
                value={formik.values.resourceId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-4 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white focus:border-[#142B5D] dark:focus:border-[#F5AB24]"
              >
                <option value="" label="Resource / Location Selection" />
                {resources.map(res => (
                  <option value={res.id} key={res.id}>{res.name}</option>
                ))}
              </select>
              {formik.touched.resourceId && formik.errors.resourceId && <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.resourceId}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Issue Category</label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-4 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white focus:border-[#142B5D] dark:focus:border-[#F5AB24]"
              >
                <option value="" label="Category Classification" />
                <option value="HARDWARE">Institutional Hardware / IT</option>
                <option value="SOFTWARE">Faculty Software / Network</option>
                <option value="FACILITIES">Campus Facilities / Maintenance</option>
                <option value="OTHER">Other Institutional Issues</option>
              </select>
              {formik.touched.category && formik.errors.category && <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.category}</div>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Severity Priority Level</label>
            <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-800">
              {['LOW', 'MEDIUM', 'HIGH'].map(pLevel => (
                <label key={pLevel} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="priority"
                    value={pLevel}
                    checked={formik.values.priority === pLevel}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-[#142B5D] dark:text-[#F5AB24] focus:ring-[#142B5D] dark:focus:ring-[#F5AB24] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <span className={`text-[10px] font-black uppercase tracking-[0.1em] transition-colors ${pLevel === 'HIGH' ? 'text-rose-600 dark:text-rose-400' : pLevel === 'MEDIUM' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {pLevel} Priority
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Detailed Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Provide a comprehensive breakdown of the incident for the technical unit..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.description && formik.errors.description ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
            ></textarea>
            {formik.touched.description && formik.errors.description && <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.description}</div>}
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Evidence Capture (Max 3)</label>
            <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group cursor-pointer relative overflow-hidden">
              <UploadCloud className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3 group-hover:text-[#F5AB24] transition-colors" />
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deploy Image Attachments</p>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {images.length > 0 && (
              <div className="flex gap-4 mt-6">
                {images.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt={`Preview ${i}`} className="w-24 h-24 object-cover rounded-xl border-4 border-white shadow-lg" />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                       <span className="text-white font-black text-[10px] uppercase">Review</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#142B5D] text-white font-black py-5 rounded-xl shadow-xl shadow-blue-900/10 hover:bg-[#0D1E40] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center uppercase tracking-[0.2em] text-xs"
          >
            {loading ? 'Transmitting Incident Data...' : 'Submit Institutional Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tickets;
