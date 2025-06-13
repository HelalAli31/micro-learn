import dbConnect from "@/app/api/dbconnection";
import User from "@/app/api/models/userSchema";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, newusername, newemail, oldPassword, newPassword } = await req.json();

    console.log("--- Incoming Update Request ---");
    console.log("Current Username:", username);
    console.log("New Username:", newusername);
    console.log("New Email:", newemail);
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    console.log("--------------------------------");

    // ✅ Allow username or email for lookup
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.password !== oldPassword) {
      return new Response(JSON.stringify({ error: "Invalid old password." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updates = {};

    // ✅ Update username
    if (newusername && newusername !== user.username) {
      const existingUsername = await User.findOne({ username: newusername });
      if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
        return new Response(
          JSON.stringify({ error: "New username is already taken." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.username = newusername;
    }

    // ✅ Update email
    if (newemail && newemail !== user.email) {
      const existingEmail = await User.findOne({ email: newemail });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return new Response(
          JSON.stringify({ error: "New email address is already in use." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.email = newemail;
    }

    // ✅ Update password
    if (newPassword && newPassword !== user.password) {
      updates.password = newPassword;
    }

    // If nothing changed
    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ message: "No changes to update.", user: user.toObject() }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Apply changes
    Object.assign(user, updates);
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return new Response(
      JSON.stringify({ message: "Profile updated successfully!", user: userWithoutPassword }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Error in /api/update route:", err);
    if (err.code === 11000) {
      return new Response(
        JSON.stringify({ error: "A unique field (username or email) is already in use." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Server error during update." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
