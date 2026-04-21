import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCcw } from 'lucide-react';
import resourceService from '../../services/resourceService';
import ResourceForm from '../../components/resources/ResourceForm';
import Toast from '../../components/common/Toast';

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
  const [apiError, setApiError] = useState('');

  const fetchResource = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const resource = await resourceService.getResourceById(id);
      setFormData({
        name: resource.name || '',
        type: resource.type || 'ROOM',
        location: resource.location || '',
        capacity: resource.capacity || '',
        status: resource.status || 'ACTIVE',
        availabilityStartTime: resource.availabilityStartTime || '08:00',
        availabilityEndTime: resource.availabilityEndTime || '18:00',
        image: null
      });
      if (resource.imageUrl) {
        setImagePreview(resource.imageUrl);
      }
    } catch (err) {
      setApiError('Failed to load resource details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  React.useEffect(() => {
    const newErrors = {};
    if (!formData.name || !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location || !formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.availabilityStartTime) newErrors.availabilityStartTime = 'Start time required';
    if (!formData.availabilityEndTime) newErrors.availabilityEndTime = 'End time required';
    
    if (formData.type !== 'EQUIPMENT') {
        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
            newErrors.capacity = 'Capacity must be positive';
        }
    }
    
    if (formData.availabilityStartTime && formData.availabilityEndTime) {
        if (formData.availabilityStartTime >= formData.availabilityEndTime) {
            newErrors.availabilityEndTime = 'End time must be after start time';
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
        setErrors(prev => ({ ...prev, image: 'File size exceeds 5MB limit' }));
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Only JPG, PNG, or WEBP formats are allowed' }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setDeleteImageFlag(false);
      if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
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
    setApiError('');

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

      if (deleteImageFlag) {
        payload.append('removeImage', 'true');
      }

      await resourceService.updateResource(id, payload);
      navigate('/resources', { state: { message: 'Resource updated successfully!' } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/resources')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition border border-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Resource</h1>
      </div>

      {apiError && !formData.name ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Failed to Load Resource</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">{apiError}</p>
          <button 
            onClick={fetchResource}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg transition shadow-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : (
        <>
          <Toast 
            message={apiError} 
            type="error" 
            onClose={() => setApiError('')} 
          />

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
        </>
      )}
    </div>
  );
};

export default EditResource;
