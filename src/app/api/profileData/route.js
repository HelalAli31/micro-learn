// /app/api/profileData/route.js
import dbConnect from "@/app/api/dbconnection";
import User from "@/app/api/models/userSchema";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "Missing username" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error("❌ Error in /api/profileData:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
