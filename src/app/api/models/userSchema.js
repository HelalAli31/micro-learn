import mongoose from "mongoose";

// Define the Mongoose Schema for a Todo document
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String, // 'text' must be a string
      required: [true, "Text is required"], // It's a mandatory field, and if missing, show this error message
      trim: true, // Remove whitespace from both ends of the string
      maxlength: [100, "Text cannot be more than 100 characters"], // Max length for 'text'
    },
    password: {
      type: String, // 'text' must be a string
      required: [true, "Text is required"], // It's a mandatory field, and if missing, show this error message
      trim: true, // Remove whitespace from both ends of the string
      maxlength: [100, "Text cannot be more than 100 characters"], // Max length for 'text'
    },
  },
  {
    timestamps: true, // This is a Mongoose option that automatically adds:
    // 'createdAt': a timestamp of when the document was created
    // 'updatedAt': a timestamp of when the document was last updated
  }
);

// Export the Mongoose Model.
// The check mongoose.models.Todo || mongoose.model('Todo', TodoSchema) is crucial for Next.js
// It prevents Mongoose from trying to recompile the model every time during hot-reloads
// in development, which would cause an error.
export default mongoose.models.UserSchema ||
  mongoose.model("Users", UserSchema);
