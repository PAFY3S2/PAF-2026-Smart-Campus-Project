import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCcw, X } from 'lucide-react';
import resourceApi from '../../../services/resourceApi';
import ResourceForm from '../../../components/resources/ResourceForm';
import { resolveImage } from '../../../utils/imageUtils';
import { toast } from 'sonner';

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'ROOM',
    location: '',
    capacity: '',
    status: 'ACTIVE',
    availabilityStartTime: '',
    availabilityEndTime: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteImageFlag, setDeleteImageFlag] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResource = async () => {
    setIsLoading(true);
    try {
      const { data } = await resourceApi.getResourceById(id);
      setFormData({
        name: data.name || '',
        type: data.type || 'ROOM',
        location: data.location || '',
        capacity: data.capacity || '',
        status: data.status || 'ACTIVE',
        availabilityStartTime: data.availabilityStartTime || '08:00',
        availabilityEndTime: data.availabilityEndTime || '18:00',
        image: null
      });
      if (data.imageUrl) {
        setImagePreview(resolveImage(data.imageUrl));
      }
    } catch (err) {
      toast.error('Strategic fail: Unable to retrieve unit coordinates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

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
      setDeleteImageFlag(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    setDeleteImageFlag(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {});
    setTouched(allTouched);

    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          if (formData.image) payload.append('image', formData.image);
        } else if (key === 'capacity') {
          if (formData.type !== 'EQUIPMENT' && formData.capacity) {
            payload.append('capacity', Number(formData.capacity));
          }
        } else {
          payload.append(key, formData[key] === null ? '' : formData[key]);
        }
      });

      console.log('[DEBUG] EditResource: Form Data Image before save:', formData.image);
      if (formData.image) {
        try {
          const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(formData.image);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
          console.log('[DEBUG] EditResource: Successfully converted image to base64. Length:', base64Image.length);
          payload.append('imageUrl', base64Image);
        } catch (error) {
          console.error('[DEBUG] EditResource: Image conversion error:', error);
        }
      } else {
        console.log('[DEBUG] EditResource: No image selected to convert.');
      }

      if (deleteImageFlag) {
        payload.append('removeImage', 'true');
      }

      await resourceApi.updateResource(id, payload);
      toast.success('Asset parameters updated in the institutional grid');
      navigate('/resources');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Strategic failure: API rejected parameter updates');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-[#F5AB24] border-t-[#142B5D] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Accessing Unit Coordinates...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-black text-[#142B5D] dark:text-white uppercase tracking-tighter">Edit Operational Unit</h1>
          <p className="text-[10px] font-black text-[#F5AB24] uppercase tracking-[0.2em]">Parameter Calibration</p>
        </div>
      </div>

      <ResourceForm
        formData={formData}
        errors={errors}
        touched={touched}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        isFormValid={isFormValid}
        isEditMode={true}
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

export default EditResource;
