// src/app/api/models/userSchema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
 searchHistory: [
  {
    value: { type: String, required: true },
    category: { type: String, default: 'Other' },
    timestamp: { type: String, required: true },
  }
],
  videoHistory: {
    type: Array,
    default: [],
  },
  quizHistory: {
    type: Array,
    default: [],
  },
  // ✨ UPDATED: Role field with 'user' and 'admin' as enum values
  role: {
    type: String,
    enum: ['user', 'admin'], // Changed 'manager' to 'admin'
    default: 'user', // Default remains 'user'
  },
});

// Prevent model overwrite in dev
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
