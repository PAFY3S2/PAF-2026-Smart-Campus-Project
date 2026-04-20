const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');
const Ticket = require('./models/Ticket');
const Notification = require('./models/Notification');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Resource.deleteMany();
    await Booking.deleteMany();
    await Ticket.deleteMany();
    await Notification.deleteMany();

    // Create Users
    console.log('Creating users...');
    const userData = [
      { name: 'Student Dan', email: 'dan@example.com', password: 'password123', role: 'USER', avatar: 'https://ui-avatars.com/api/?name=Student+Dan&bg=indigo&color=fff' },
      { name: 'System Admin', email: 'admin@SLIIT.com', password: 'Admin@SLIIT', role: 'ADMIN', avatar: 'https://ui-avatars.com/api/?name=Admin&bg=rose&color=fff' },
      { name: 'Tech Bob', email: 'bob@example.com', password: 'password123', role: 'TECHNICIAN', avatar: 'https://ui-avatars.com/api/?name=Tech+Bob&bg=emerald&color=fff' },
    ];
    
    const users = [];
    for (const data of userData) {
      try {
        const user = new User(data);
        await user.save();
        users.push(user);
        console.log(`User ${data.email} created.`);
      } catch (userErr) {
        console.error(`Failed to create user ${data.email}:`, userErr.message);
        throw userErr;
      }
    }
    console.log('All users created.');

    // Create Resources
    console.log('Creating resources...');
    const resources = await Resource.create([
      { name: 'Main Auditorium', type: 'ROOM', capacity: 300, location: 'Building A', status: 'ACTIVE' },
      { name: 'Lab 402', type: 'LAB', capacity: 40, location: 'Building C', status: 'ACTIVE' },
      { name: 'Projector XYZ', type: 'EQUIPMENT', capacity: null, location: 'IT Store', status: 'OUT_OF_SERVICE' },
      { name: 'Meeting Room 1', type: 'ROOM', capacity: 10, location: 'Building B', status: 'ACTIVE' },
    ]);
    console.log('Resources created.');

    // Create Bookings
    console.log('Creating bookings...');
    await Booking.create([
      { resourceId: resources[0]._id, userId: users[0]._id, date: '2026-10-15', startTime: '10:00', endTime: '12:00', purpose: 'Student Club Meeting', attendees: 50, status: 'APPROVED' },
      { resourceId: resources[3]._id, userId: users[0]._id, date: '2026-10-16', startTime: '14:00', endTime: '15:00', purpose: 'Study Group', attendees: 5, status: 'PENDING' },
    ]);
    console.log('Bookings created.');

    // Create Tickets
    console.log('Creating tickets...');
    await Ticket.create([
      { resourceId: resources[1]._id, userId: users[0]._id, category: 'HARDWARE', description: 'PC #12 is not booting up.', priority: 'HIGH', status: 'IN_PROGRESS', technicianId: users[2]._id, comments: [{ text: 'Looking into it now.', author: 'Tech Bob' }] },
      { resourceId: resources[0]._id, userId: users[0]._id, category: 'FACILITIES', description: 'AC is leaking water.', priority: 'MEDIUM', status: 'OPEN' },
    ]);
    console.log('Tickets created.');

    // Create Notifications
    console.log('Creating notifications...');
    await Notification.create([
      { userId: users[0]._id, type: 'BOOKING_UPDATE', message: 'Your booking for Main Auditorium was APPROVED.', read: false },
      { userId: users[0]._id, type: 'TICKET_UPDATE', message: 'Tech Bob commented on your ticket for Lab 402.', read: true },
    ]);
    console.log('Notifications created.');

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error('Error during seeding:');
    console.error(err);
    process.exit(1);
  }
};

seedData();
