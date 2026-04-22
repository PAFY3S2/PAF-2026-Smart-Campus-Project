export const db = {
  users: [
    { id: 1, name: 'Student Dan', role: 'USER', email: 'dan@example.com', avatar: 'https://images.unsplash.com/photo-1523240615152-44df0e1f7481?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Admin Alice', role: 'ADMIN', email: 'alice@example.com', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, name: 'Tech Bob', role: 'TECHNICIAN', email: 'bob@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
  ],
  resources: [
    { id: 1, name: 'Main Auditorium', type: 'ROOM', capacity: 300, location: 'Building A', status: 'ACTIVE' },
    { id: 2, name: 'Lab 402', type: 'LAB', capacity: 40, location: 'Building C', status: 'ACTIVE' },
    { id: 3, name: 'Projector XYZ', type: 'EQUIPMENT', capacity: null, location: 'IT Store', status: 'OUT_OF_SERVICE' },
    { id: 4, name: 'Meeting Room 1', type: 'ROOM', capacity: 10, location: 'Building B', status: 'ACTIVE' },
  ],
  bookings: [
    { id: 101, resourceId: 1, userId: 1, date: '2026-10-15', startTime: '10:00', endTime: '12:00', purpose: 'Student Club Meeting', attendees: 50, status: 'APPROVED' },
    { id: 102, resourceId: 4, userId: 1, date: '2026-10-16', startTime: '14:00', endTime: '15:00', purpose: 'Study Group', attendees: 5, status: 'PENDING' },
  ],
  tickets: [
    { id: 201, resourceId: 2, userId: 1, category: 'HARDWARE', description: 'PC #12 is not booting up.', priority: 'HIGH', status: 'IN_PROGRESS', technicianId: 3, images: [], comments: [{ id: 1, text: 'Looking into it now.', author: 'Tech Bob', timestamp: '2026-10-10T10:00:00Z' }] },
    { id: 202, resourceId: 1, userId: 1, category: 'FACILITIES', description: 'AC is leaking water.', priority: 'MEDIUM', status: 'OPEN', images: [], comments: [] },
  ],
  notifications: [
    { id: 301, userId: 1, type: 'BOOKING_UPDATE', message: 'Your booking for Main Auditorium was APPROVED.', read: false, createdAt: '2026-10-14T09:00:00Z' },
    { id: 302, userId: 1, type: 'TICKET_UPDATE', message: 'Tech Bob commented on your ticket for Lab 402.', read: true, createdAt: '2026-10-10T10:05:00Z' },
  ]
};
