// Import mongoose
const mongoose = require('mongoose');

// Define the User Schema
// This is the blueprint for every user document in the database
const userSchema = new mongoose.Schema({
  // name is required — every user must have a name
  name: {
    type: String,
    required: true,
  },

  // email must be unique — no two users can share the same email
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // age is optional
  age: {
    type: Number,
  },

  // createdAt is automatically set to the current date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the User model so we can use it in server.js
module.exports = mongoose.model('User', userSchema);