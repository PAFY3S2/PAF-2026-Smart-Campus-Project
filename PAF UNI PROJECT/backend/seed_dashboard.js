const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Ticket = require('./models/Ticket');

dotenv.config();

const seedDashboardData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for comprehensive dashboard seeding...');

    // Find Technician
    const tech = await User.findOne({ email: 'technician@SLIIT.com' });
    if (!tech) {
      console.error('Technician not found! Please ensure technician@SLIIT.com exists.');
      process.exit(1);
    }

    // Find a student user to be the creator
    const student = await User.findOne({ role: 'USER' });
    if (!student) {
      console.error('No student user found to create tickets.');
      process.exit(1);
    }

    // --- SEED RESOURCES ---
    console.log('Seeding additional resources...');
    const additionalResources = [
      { name: 'Smart Classroom 301', type: 'ROOM', capacity: 60, location: 'Building D', status: 'ACTIVE' },
      { name: 'IoT Research Lab', type: 'LAB', capacity: 25, location: 'Building E', status: 'ACTIVE' },
      { name: 'Server Room Alpha', type: 'ROOM', capacity: 5, location: 'Building A', status: 'MAINTENANCE' },
      { name: 'Digital Library Terminal 01-10', type: 'EQUIPMENT', capacity: null, location: 'Main Library', status: 'ACTIVE' },
      { name: 'Conference Room C', type: 'ROOM', capacity: 20, location: 'Building C', status: 'ACTIVE' },
      { name: 'Advanced Robotics Lab', type: 'LAB', capacity: 15, location: 'Building F', status: 'ACTIVE' },
      { name: 'Sports Complex Main Office', type: 'ROOM', capacity: 8, location: 'Sports Center', status: 'ACTIVE' },
      { name: 'Multimedia Studio', type: 'LAB', capacity: 12, location: 'Building B', status: 'OUT_OF_SERVICE' },
      { name: 'Cisco Networking Lab', type: 'LAB', capacity: 30, location: 'Building E', status: 'ACTIVE' },
      { name: 'Exam Hall 02', type: 'ROOM', capacity: 200, location: 'Building D', status: 'ACTIVE' }
    ];

    await Resource.insertMany(additionalResources);
    const resources = await Resource.find({});
    console.log(`Total Resources: ${resources.length}`);

    // --- SEED TICKETS ---
    console.log('Cleaning up old tickets for this technician to ensure fresh state...');
    await Ticket.deleteMany({ technicianId: tech._id });

    const dummyTickets = [
      // HIGH PRIORITY TICKETS
      {
        resourceId: resources.find(r => r.name === 'Server Room Alpha')._id,
        userId: student._id,
        category: 'HARDWARE',
        description: 'Critical server failure. Main database is unreachable. Overheating detected in Rack 2.',
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        technicianId: tech._id,
        building: 'Building A',
        room: 'Server Room Alpha',
        workLog: [
          { action: 'Emergency Response', note: 'Shutdown redundant systems. Checking cooling units.', user: tech.name }
        ]
      },
      {
        resourceId: resources.find(r => r.name === 'Main Auditorium')._id,
        userId: student._id,
        category: 'HARDWARE',
        description: 'The projector is flickering and occasionally loses signal.',
        priority: 'HIGH',
        status: 'OPEN',
        technicianId: tech._id,
        building: 'Building A',
        room: 'Auditorium'
      },
      {
        resourceId: resources.find(r => r.name === 'Exam Hall 02')._id,
        userId: student._id,
        category: 'SOFTWARE',
        description: 'Online exam portal not loading on 50% of the terminals. Exam scheduled for tomorrow.',
        priority: 'URGENT',
        status: 'OPEN',
        technicianId: tech._id,
        building: 'Building D',
        room: 'Exam Hall 02'
      },
      // LOCATION: Building E
      {
        resourceId: resources.find(r => r.name === 'IoT Research Lab')._id,
        userId: student._id,
        category: 'HARDWARE',
        description: 'Smart gateway sensor not acknowledging data packets. Devices disconnected.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        technicianId: tech._id,
        building: 'Building E',
        lab: 'IoT Lab',
        workLog: [
          { action: 'Investigation', note: 'Reset gateway. Checking firmware version compatibility.', user: tech.name }
        ]
      },
      {
        resourceId: resources.find(r => r.name === 'Cisco Networking Lab')._id,
        userId: student._id,
        category: 'SOFTWARE',
        description: 'Packet Tracer licenses expired on Lab PCs #15 to #30.',
        priority: 'MEDIUM',
        status: 'OPEN',
        technicianId: tech._id,
        building: 'Building E',
        lab: 'Cisco Lab'
      },
      // LOCATION: Building B
      {
        resourceId: resources.find(r => r.name === 'Multimedia Studio')._id,
        userId: student._id,
        category: 'FACILITIES',
        description: 'Power socket short-circuited in the recording booth. Urgent repair needed.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        technicianId: tech._id,
        building: 'Building B',
        room: 'Studio A'
      },
      // MY TICKETS - VARIOUS STATUSES
      {
        resourceId: resources.find(r => r.name === 'Smart Classroom 301')._id,
        userId: student._id,
        category: 'SOFTWARE',
        description: 'Intermittent Wi-Fi connectivity in the front row seats.',
        priority: 'LOW',
        status: 'RESOLVED',
        technicianId: tech._id,
        building: 'Building D',
        room: '301',
        resolutionNotes: 'Repositioned the access point. Signal strength now exceeds -60dBm in all areas.',
        workLog: [
          { action: 'Testing', note: 'Ran heat map analysis. Identified dead zones.', user: tech.name },
          { action: 'Resolution', note: 'Relocated AP and verified connectivity.', user: tech.name }
        ]
      },
      {
        resourceId: resources.find(r => r.name === 'Conference Room C')._id,
        userId: student._id,
        category: 'HARDWARE',
        description: 'Microphone system picking up static noise during video calls.',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        technicianId: tech._id,
        building: 'Building C',
        room: 'Room C',
        resolutionNotes: 'Replaced faulty XLR cable. Tested and working.',
        comments: [
          { text: 'Thanks for the quick fix! Meeting went smoothly.', author: student.name }
        ]
      },
      {
        resourceId: resources.find(r => r.name === 'Digital Library Terminal 01-10')._id,
        userId: student._id,
        category: 'HARDWARE',
        description: 'Keyboard on Terminal 04 is missing the Spacebar key.',
        priority: 'LOW',
        status: 'OPEN',
        technicianId: tech._id,
        building: 'Main Library',
        room: 'Ground Floor'
      },
      {
        resourceId: resources.find(r => r.name === 'Advanced Robotics Lab')._id,
        userId: student._id,
        category: 'SOFTWARE',
        description: 'ROS2 Humble environment setup needed for the new Cobot arm.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        technicianId: tech._id,
        building: 'Building F',
        lab: 'Robotics Lab',
        workLog: [
          { action: 'Installation', note: 'Installed Ubuntu 22.04 and ROS2 Humble.', user: tech.name }
        ],
        comments: [
          { text: 'Waiting for the robot controllers to arrive before final testing.', author: tech.name }
        ]
      },
      {
        resourceId: resources.find(r => r.name === 'Sports Complex Main Office')._id,
        userId: student._id,
        category: 'FACILITIES',
        description: 'Light bulbs flickering in the office area.',
        priority: 'LOW',
        status: 'OPEN',
        technicianId: tech._id,
        building: 'Sports Center',
        room: 'Admin Office'
      }
    ];

    console.log('Creating 11 expanded tickets...');
    await Ticket.create(dummyTickets);

    console.log('Expanded Dashboard Data Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding expanded dashboard data:', err);
    process.exit(1);
  }
};

seedDashboardData();
