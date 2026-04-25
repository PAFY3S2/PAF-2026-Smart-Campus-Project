import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Bookings = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      try {
        await api.post('/bookings', { ...values, userId: user.id });
        setSuccess(true);
        resetForm();
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
      <h1 className="text-2xl font-bold text-slate-900">Create a Booking Request</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center">
            Booking request submitted successfully! It is now pending approval.
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Resource</label>
            <select
              name="resourceId"
              value={formik.values.resourceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.resourceId && formik.errors.resourceId ? 'border-rose-500' : 'border-slate-300'}`}
            >
              <option value="" label="Select a resource" />
              {resources.map(res => (
                <option value={res.id} key={res.id}>{res.name} ({res.type})</option>
              ))}
            </select>
            {formik.touched.resourceId && formik.errors.resourceId ? (
              <div className="text-xs text-rose-500">{formik.errors.resourceId}</div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.date && formik.errors.date ? 'border-rose-500' : 'border-slate-300'}`}
              />
              {formik.touched.date && formik.errors.date ? <div className="text-xs text-rose-500">{formik.errors.date}</div> : null}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Attendees Count</label>
              <input
                type="number"
                name="attendees"
                value={formik.values.attendees}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="1"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.attendees && formik.errors.attendees ? 'border-rose-500' : 'border-slate-300'}`}
              />
              {formik.touched.attendees && formik.errors.attendees ? <div className="text-xs text-rose-500">{formik.errors.attendees}</div> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.startTime && formik.errors.startTime ? 'border-rose-500' : 'border-slate-300'}`}
              />
              {formik.touched.startTime && formik.errors.startTime ? <div className="text-xs text-rose-500">{formik.errors.startTime}</div> : null}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.endTime && formik.errors.endTime ? 'border-rose-500' : 'border-slate-300'}`}
              />
              {formik.touched.endTime && formik.errors.endTime ? <div className="text-xs text-rose-500">{formik.errors.endTime}</div> : null}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Purpose</label>
            <textarea
              name="purpose"
              rows="3"
              value={formik.values.purpose}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${formik.touched.purpose && formik.errors.purpose ? 'border-rose-500' : 'border-slate-300'}`}
            ></textarea>
            {formik.touched.purpose && formik.errors.purpose ? <div className="text-xs text-rose-500">{formik.errors.purpose}</div> : null}
          </div>

          <Button
            type="submit"
            isLoading={loading}
            fullWidth
            size="lg"
          >
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Bookings;
