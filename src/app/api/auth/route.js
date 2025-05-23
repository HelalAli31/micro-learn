import { NextResponse } from "next/server";
import dbConnect from "@/app/api/dbconnection";
import UserSchema from "@/models/UserSchema";

// --- PATCH (Update Specific UserSchema by ID) ---
export async function PATCH(request, { params }) {
  // This runs for PATCH requests to /api/UserSchemas/SOME_ID
  await dbConnect();

  try {
    const id = params.id; // Get the ID from the URL (e.g., '123' from /api/UserSchemas/123)
    const body = await request.json(); // Get data from the request body (e.g., { completed: true })
    const { text, completed } = body;

    // Ensure at least one field is provided for update
    if (text === undefined && completed === undefined) {
      return NextResponse.json(
        { message: "No fields to update provided" },
        { status: 400 }
      );
    }

    const updateFields = {}; // Build an object with fields to update
    if (text !== undefined) updateFields.text = text;
    if (completed !== undefined) updateFields.completed = completed;

    // Find the UserSchema by ID and update it.
    // findByIdAndUpdate(id, update, options)
    const updatedUserSchema = await UserSchema.findByIdAndUpdate(
      id, // The ID of the UserSchema to update
      { $set: updateFields }, // Mongoose operator to update specific fields
      { new: true, runValidators: true } // Options: 'new: true' returns the updated document, 'runValidators: true' applies schema validation on update
    );

    if (!updatedUserSchema) {
      return NextResponse.json(
        { message: "UserSchema not found" },
        { status: 404 }
      ); // 404 Not Found
    }

    return NextResponse.json(updatedUserSchema, { status: 200 }); // 200 OK
  } catch (error) {
    if (error.name === "CastError") {
      // Mongoose error if the ID format is invalid
      return NextResponse.json(
        { message: "Invalid UserSchema ID format" },
        { status: 400 }
      );
    }
    if (error.name === "ValidationError") {
      // Mongoose schema validation error during update
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error updating UserSchema", error: error.message },
      { status: 500 }
    );
  }
}

// --- DELETE (Delete Specific UserSchema by ID) ---
export async function DELETE(request, { params }) {
  // This runs for DELETE requests to /api/UserSchemas/SOME_ID
  await dbConnect();

  try {
    const id = params.id; // Get the ID from the URL

    const deletedUserSchema = await UserSchema.findByIdAndDelete(id); // Use Mongoose Model to find and delete by ID

    if (!deletedUserSchema) {
      return NextResponse.json(
        { message: "UserSchema not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "UserSchema deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid UserSchema ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error deleting UserSchema", error: error.message },
      { status: 500 }
    );
  }
}
