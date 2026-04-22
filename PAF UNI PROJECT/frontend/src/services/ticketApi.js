import api from './api';

export const ticketApi = {
  getTicket: (id) => api.get(`/tickets/${id}`),
  updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),
  getEvidence: (id) => api.get(`/tickets/${id}/evidence`),
  sendMessage: (id, content, senderType = 'technician') => 
    api.post(`/tickets/${id}/messages`, { content, senderType }),
  addNote: (id, content) => api.post(`/tickets/${id}/notes`, { content })
};

export default ticketApi;
