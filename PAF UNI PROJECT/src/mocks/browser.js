import MockAdapter from 'axios-mock-adapter';
import api from '../services/api';
import { db } from './db';

const mock = new MockAdapter(api, { delayResponse: 800 }); // Simulate 800ms latency

// ### AUTH ###
mock.onPost('/api/auth/login').reply((config) => {
  const { role } = JSON.parse(config.data);
  const user = db.users.find(u => u.role === role);
  if (user) {
    return [200, { user, token: `mock-jwt-token-${role}` }];
  }
  return [401, { message: 'Invalid credentials' }];
});

mock.onGet('/api/auth/me').reply((config) => {
  const token = config.headers.Authorization;
  if (!token) return [401, { message: 'Unauthorized' }];
  
  const role = token.split('-').pop(); // 'USER' or 'ADMIN'
  const user = db.users.find(u => u.role === role);
  return user ? [200, user] : [401, { message: 'User not found' }];
});

// ### RESOURCES ###
mock.onGet('/api/resources').reply(200, db.resources);

mock.onGet(/\/api\/resources\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const resource = db.resources.find(r => r.id === id);
  return resource ? [200, resource] : [404, { message: 'Not found' }];
});

mock.onPost('/api/resources').reply((config) => {
  let data;
  let imageUrl = null;

  if (config.data instanceof FormData) {
    const formData = config.data;
    data = {};
    for (let [key, value] of formData.entries()) {
      if (key !== 'image') data[key] = value;
    }
    // Simulate image upload returning a fake placeholder if an image is sent
    if (formData.has('image') && formData.get('image') instanceof File) {
      imageUrl = `https://placehold.co/600x400/f8fafc/64748b?text=${encodeURIComponent(data.name || 'Resource')}`;
    }
  } else {
    data = JSON.parse(config.data);
  }

  const newResource = { ...data, id: Date.now(), imageUrl };
  db.resources.push(newResource);
  return [201, newResource];
});

mock.onPut(/\/api\/resources\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const idx = db.resources.findIndex(r => r.id === id);
  if (idx === -1) return [404, { message: 'Not found' }];

  let data;
  let newImageUrl = null;

  if (config.data instanceof FormData) {
    const formData = config.data;
    data = {};
    for (let [key, value] of formData.entries()) {
      if (key !== 'image') data[key] = value;
    }
    if (formData.has('image') && formData.get('image') instanceof File) {
      newImageUrl = `https://placehold.co/600x400/f8fafc/64748b?text=${encodeURIComponent(data.name || 'Resource')}`;
    }
  } else {
    data = JSON.parse(config.data);
  }

  db.resources[idx] = { 
    ...db.resources[idx], 
    ...data,
    imageUrl: newImageUrl || db.resources[idx].imageUrl 
  };
  return [200, db.resources[idx]];
});

mock.onDelete(/\/api\/resources\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const idx = db.resources.findIndex(r => r.id === id);
  if (idx > -1) {
    db.resources.splice(idx, 1);
    return [200, { message: 'Deleted' }];
  }
  return [404, { message: 'Not found' }];
});

mock.onPatch(/\/api\/resources\/\d+\/status/).reply((config) => {
  const parts = config.url.split('/');
  const id = parseInt(parts[parts.length - 2]);
  const data = JSON.parse(config.data);
  const idx = db.resources.findIndex(r => r.id === id);
  if (idx > -1) {
    db.resources[idx].status = data.status;
    return [200, db.resources[idx]];
  }
  return [404, { message: 'Not found' }];
});

// ### BOOKINGS ###
mock.onGet('/api/bookings').reply((config) => {
  const { headers } = config;
  // If user role is standard, filter by their ID (mock behavior)
  const role = headers.Authorization?.split('-').pop();
  if (role === 'USER') {
    return [200, db.bookings.filter(b => b.userId === 1)];
  }
  return [200, db.bookings]; // Admin/tech sees all
});

mock.onPost('/api/bookings').reply((config) => {
  const data = JSON.parse(config.data);
  const newBooking = { ...data, id: Date.now(), status: 'PENDING' };
  db.bookings.push(newBooking);
  return [201, newBooking];
});

mock.onPut(/\/api\/bookings\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const data = JSON.parse(config.data);
  const idx = db.bookings.findIndex(b => b.id === id);
  if (idx > -1) {
    db.bookings[idx] = { ...db.bookings[idx], ...data };
    return [200, db.bookings[idx]];
  }
  return [404, { message: 'Not found' }];
});

// ### TICKETS ###
mock.onGet('/api/tickets').reply((config) => {
  const role = config.headers.Authorization?.split('-').pop();
  if (role === 'USER') {
    return [200, db.tickets.filter(t => t.userId === 1)];
  }
  return [200, db.tickets];
});

mock.onPost('/api/tickets').reply((config) => {
  const data = JSON.parse(config.data);
  const newTicket = { ...data, id: Date.now(), status: 'OPEN', comments: [] };
  db.tickets.push(newTicket);
  return [201, newTicket];
});

mock.onPut(/\/api\/tickets\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const data = JSON.parse(config.data);
  const idx = db.tickets.findIndex(t => t.id === id);
  if (idx > -1) {
    db.tickets[idx] = { ...db.tickets[idx], ...data };
    return [200, db.tickets[idx]];
  }
  return [404, { message: 'Not found' }];
});

// ### NOTIFICATIONS ###
mock.onGet('/api/notifications').reply(200, db.notifications);
mock.onPut(/\/api\/notifications\/\d+\/read/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const idx = db.notifications.findIndex(n => n.id === id);
  if (idx > -1) {
    db.notifications[idx].read = true;
    return [200, db.notifications[idx]];
  }
  return [404];
});

export default mock;
