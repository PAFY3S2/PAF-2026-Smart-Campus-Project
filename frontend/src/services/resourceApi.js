import api from './api';

const resourceApi = {
  getAllResources: (params) => api.get('/resources', { params }),
  getResourceById: (id) => api.get(`/resources/${id}`),
  
  createResource: (formData) => {
    return api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateResource: (id, formData) => {
    return api.put(`/resources/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteResource: (id) => api.delete(`/resources/${id}`),
  
  updateResourceStatus: (id, status) => api.patch(`/resources/${id}/status`, { status }),
};

export default resourceApi;
