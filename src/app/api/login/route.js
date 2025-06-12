import dbConnect from "@/app/api/dbconnection";
import User from "@/app/api/models/userSchema";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    console.log("!! Incoming login:", username);
    console.log("🔐 Incoming Password:", password);

    const existingUser = await User.findOne({ username });
    console.log("👤 Found user:", existingUser);

    if (!existingUser || existingUser.password !== password) {
      console.log("❌ Invalid credentials");
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

    console.log("✅ Login success");
    return new Response(
      JSON.stringify({ message: "Login successful", user: existingUser }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error in /api/login route:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
