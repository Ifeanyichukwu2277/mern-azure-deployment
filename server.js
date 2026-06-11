// Load environment variables from config/.env
require('dotenv').config({ path: './config/.env' });

// Import express, mongoose and path
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import the User model
const User = require('./models/User');

// Create the express app
const app = express();

// Middleware — allows express to read JSON from request body
app.use(express.json());

// Serve React frontend static files from the client folder
app.use(express.static(path.join(__dirname, 'client')));


// CONNECT TO MONGODB

mongoose.connect(process.env.MONGO_URI);

// Log success or error
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB successfully!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection error:', err);
});


// API ROUTES


// GET /users — Returns ALL users from the database
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// POST /users — Adds a NEW user to the database
app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// PUT /users/:id — Edits an EXISTING user by their ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

// DELETE /users/:id — Removes a user by their ID
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});


// SERVE REACT FOR ALL OTHER ROUTES
// This makes sure React handles its own routing
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// START THE SERVER

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});