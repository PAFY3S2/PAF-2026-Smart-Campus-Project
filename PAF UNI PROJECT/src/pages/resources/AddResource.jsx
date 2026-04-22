import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import resourceService from '../../services/resourceService';
import ResourceForm from '../../components/resources/ResourceForm';
import Toast from '../../components/common/Toast';

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
  const [apiError, setApiError] = useState('');

  // Live validation hook
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
      
      // Auto-generate hours when type swaps magically
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
          newState.capacity = ''; // Wipe capacity constraints
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
      if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark everything touched to expose any hidden errors safely
    const allTouched = Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {});
    setTouched(allTouched);

    if (!isFormValid) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const payload = buildFormDataPayload(formData);

      const newResource = await resourceService.createResource(payload);
      navigate('/resources', { state: { message: 'Resource added successfully!', newResource } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to add resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/resources')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition border border-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Resource</h1>
      </div>

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
