const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    let resources = await Resource.find();
    
    // Seed initial resources if DB is empty
    if (resources.length === 0) {
      const initialResources = [
        { name: 'Main Auditorium', type: 'ROOM', capacity: 300, location: 'Building A', status: 'ACTIVE' },
        { name: 'Lab 402', type: 'LAB', capacity: 40, location: 'Building C', status: 'ACTIVE' },
        { name: 'Projector XYZ', type: 'EQUIPMENT', capacity: null, location: 'IT Store', status: 'OUT_OF_SERVICE' },
        { name: 'Meeting Room 1', type: 'ROOM', capacity: 10, location: 'Building B', status: 'ACTIVE' },
      ];
      await Resource.insertMany(initialResources);
      resources = await Resource.find();
    }
    
    // For the frontend simplicity, map _id to id
    const formattedResources = resources.map(r => ({
      id: r._id,
      name: r.name,
      type: r.type,
      capacity: r.capacity,
      location: r.location,
      status: r.status
    }));
    
    res.json(formattedResources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
