import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/shared/PageHeader';

const Bookings = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/resources').then(res => setResources(res.data.filter(r => r.status === 'ACTIVE')));
  }, []);

  const formik = useFormik({
    initialValues: {
      resourceId: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: 1
    },
    validationSchema: Yup.object({
      resourceId: Yup.string().required('Required'),
      date: Yup.string().required('Required'),
      startTime: Yup.string().required('Required'),
      endTime: Yup.string().required('Required'),
      purpose: Yup.string().required('Required').min(5, 'Too Short!'),
      attendees: Yup.number().required('Required').min(1, 'At least 1 attendee')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setError(null);
      try {
        await api.post('/bookings', { ...values, userId: user.id });
        setSuccess(true);
        resetForm();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader title="Facility Reservation" subtitle="Institutional Resource Management" />

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-800 p-8 md:p-12 overflow-hidden relative transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5AB24] opacity-5 dark:opacity-10 -translate-y-16 translate-x-16 rotate-45"></div>
        {success && (
          <div className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-400 rounded flex items-center shadow-sm">
            <div className="font-black text-xs uppercase tracking-widest text-[#142B5D] dark:text-emerald-400">Request submitted successfully for institutional review</div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-900/30 border-l-4 border-rose-500 text-rose-800 dark:text-rose-400 rounded flex items-center shadow-sm">
            <div className="font-black text-xs uppercase tracking-widest text-[#142B5D] dark:text-rose-400">{error}</div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Target Resource</label>
            <select
              name="resourceId"
              value={formik.values.resourceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.resourceId && formik.errors.resourceId ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
            >
              <option value="" label="Institutional Resource Selection" />
              {resources.map(res => (
                <option value={res.id} key={res.id}>{res.name} — {res.type}</option>
              ))}
            </select>
            {formik.touched.resourceId && formik.errors.resourceId ? (
              <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.resourceId}</div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Reservation Date</label>
              <input
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.date && formik.errors.date ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
              />
              {formik.touched.date && formik.errors.date ? <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.date}</div> : null}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Attendee Capacity</label>
              <input
                type="number"
                name="attendees"
                value={formik.values.attendees}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="1"
                className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.attendees && formik.errors.attendees ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
              />
              {formik.touched.attendees && formik.errors.attendees ? <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.attendees}</div> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Session Start</label>
              <input
                type="time"
                name="startTime"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.startTime && formik.errors.startTime ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
              />
              {formik.touched.startTime && formik.errors.startTime ? <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.startTime}</div> : null}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Session End</label>
              <input
                type="time"
                name="endTime"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.endTime && formik.errors.endTime ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
              />
              {formik.touched.endTime && formik.errors.endTime ? <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.endTime}</div> : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-[#142B5D] dark:text-slate-400 uppercase tracking-widest px-1">Institutional Purpose</label>
            <textarea
              name="purpose"
              rows="3"
              placeholder="Detail the academic or administrative requirement for this booking..."
              value={formik.values.purpose}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-4 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-all outline-none text-sm font-bold text-[#142B5D] dark:text-white ${formik.touched.purpose && formik.errors.purpose ? 'border-rose-300' : 'border-slate-100 dark:border-slate-800 focus:border-[#142B5D] dark:focus:border-[#F5AB24]'}`}
            ></textarea>
            {formik.touched.purpose && formik.errors.purpose ? <div className="text-[10px] font-black text-rose-500 uppercase px-2 italic">{formik.errors.purpose}</div> : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#142B5D] text-white font-black py-5 rounded-xl shadow-xl shadow-blue-900/10 hover:bg-[#0D1E40] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center uppercase tracking-[0.2em] text-xs"
          >
            {loading ? 'Processing Transaction...' : 'Confirm Institutional Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bookings;
