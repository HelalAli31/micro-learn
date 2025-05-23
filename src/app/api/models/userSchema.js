import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // no duplicate usernames
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Prevent model overwrite in dev
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
