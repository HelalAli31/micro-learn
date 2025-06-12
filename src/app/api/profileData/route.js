// /app/api/profileData/route.js
import dbConnect from "@/app/api/dbconnection";
import User from "@/app/api/models/userSchema";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get("username"); // Renamed for clarity, as it could be username OR email

  if (!identifier) {
    return new Response(JSON.stringify({ error: "Missing identifier (username or email)" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    // Use $or to search by either username or email
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // It's generally a good practice to filter out sensitive information
    // like the password before sending the user object to the client.
    const userWithoutPassword = user.toObject(); // Convert Mongoose document to plain JS object
    delete userWithoutPassword.password; // Remove the password field

    return new Response(JSON.stringify(userWithoutPassword), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error("❌ Error in /api/profileData:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}