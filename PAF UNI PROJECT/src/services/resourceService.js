import api from './api';

const resourceService = {
  /**
   * Get all resources
   * @returns {Promise<Array>} Array of resources
   */
  getAllResources: async () => {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error('Error in getAllResources:', error);
      throw error;
    }
  },

  /**
   * Get resource by ID
   * @param {number|string} id Resource ID
   * @returns {Promise<Object>} Resource object
   */
  getResourceById: async (id) => {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getResourceById for id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new resource
   * @param {Object} data Resource data payload
   * @returns {Promise<Object>} Created resource
   */
  createResource: async (data) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api.post('/resources', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error in createResource:', error);
      throw error;
    }
  },

  /**
   * Update an existing resource
   * @param {number|string} id Resource ID
   * @param {Object} data Resource data payload
   * @returns {Promise<Object>} Updated resource
   */
  updateResource: async (id, data) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api.put(`/resources/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data;
    } catch (error) {
      console.error(`Error in updateResource for id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a resource
   * @param {number|string} id Resource ID
   * @returns {Promise<Object>} Success indicator
   */
  deleteResource: async (id) => {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in deleteResource for id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update specifically the status of a resource
   * @param {number|string} id Resource ID
   * @param {string} status The new ACTIVE/OUT_OF_SERVICE mapping
   * @returns {Promise<Object>} Updated resource
   */
  updateResourceStatus: async (id, status) => {
    try {
      const response = await api.patch(`/resources/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error patching resource status for id ${id}`, error);
      throw error;
    }
  }
};

export default resourceService;
