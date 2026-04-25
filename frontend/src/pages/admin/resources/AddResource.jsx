import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import resourceApi from '../../../services/resourceApi';
import ResourceForm from '../../../components/resources/ResourceForm';
import { toast } from 'sonner';

const AddResource = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'ROOM',
    location: '',
    capacity: '',
    status: 'ACTIVE',
    availabilityStartTime: '08:00',
    availabilityEndTime: '18:00',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const newErrors = {};
    if (!formData.name || !formData.name.trim()) newErrors.name = 'Operational name is mandatory';
    if (!formData.location || !formData.location.trim()) newErrors.location = 'Geographic sector required';
    if (!formData.availabilityStartTime) newErrors.availabilityStartTime = 'Access start time required';
    if (!formData.availabilityEndTime) newErrors.availabilityEndTime = 'Access terminal time required';
    
    if (formData.type !== 'EQUIPMENT') {
        if (!formData.capacity) {
            newErrors.capacity = 'Unit capacity required';
        } else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
            newErrors.capacity = 'Capacity must be a positive integer';
        }
    }
    
    if (formData.availabilityStartTime && formData.availabilityEndTime) {
        if (formData.availabilityStartTime >= formData.availabilityEndTime) {
            newErrors.availabilityEndTime = 'Terminal time must exceed start time';
        }
    }
    
    setErrors(newErrors);
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const buildFormDataPayload = (data) => {
    const payload = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        if (data.image) payload.append('image', data.image);
      } else if (key === 'capacity') {
        if (data.type !== 'EQUIPMENT' && data.capacity) {
          payload.append('capacity', Number(data.capacity));
        }
      } else {
        payload.append(key, data[key] === null ? '' : data[key]);
      }
    });
    return payload;
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'type') {
        if (value === 'ROOM') {
          newState.availabilityStartTime = '08:00';
          newState.availabilityEndTime = '20:00';
        } else if (value === 'LAB') {
          newState.availabilityStartTime = '09:00';
          newState.availabilityEndTime = '17:00';
        } else if (value === 'EQUIPMENT') {
          newState.availabilityStartTime = '08:00';
          newState.availabilityEndTime = '16:00';
          newState.capacity = '';
        }
      }
      return newState;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Strategic Asset too large: 5MB limit exceeded');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid format: PNG, JPG, or WEBP only');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {});
    setTouched(allTouched);

    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const payload = buildFormDataPayload(formData);
      await resourceApi.createResource(payload);
      toast.success('Asset integrated into institutional network');
      navigate('/resources');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Strategic failure: API rejected asset integration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/resources')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md text-[#142B5D] dark:text-[#F5AB24] transition-all active:scale-95 border border-slate-100 dark:border-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">Provision New Unit</h1>
          <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Strategic Asset Integration</p>
        </div>
      </div>

      <ResourceForm
        formData={formData}
        errors={errors}
        touched={touched}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        isFormValid={isFormValid}
        isEditMode={false}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleImageChange={handleImageChange}
        removeImage={removeImage}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/resources')}
      />
    </div>
  );
};

export default AddResource;
