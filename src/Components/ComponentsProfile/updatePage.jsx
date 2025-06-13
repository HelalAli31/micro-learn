import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function UpdatePage({ onClose, onUserUpdated }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUsername = searchParams.get("username") || "";

  const [username] = useState(initialUsername);
  const [newusername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newemail, setNewEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveChanges = async () => {
    const trimmedNewUsername = newusername.trim();

    // ✅ Require old password for all changes
    if (!oldPassword.trim()) {
      setErrorMessage("To change anything, you must enter your current password.");
      return;
    }

    // Skip if new username is the same as current
    if (trimmedNewUsername && trimmedNewUsername === username) {
      console.log("ℹ️ Username not changed. Skipping update.");
      setErrorMessage("You entered the same username.");
      return;
    }

    console.log('--- Attempting to Save Changes from UpdatePage ---');
    console.log('Sending Curr Username:', username);
    console.log('Sending New Username:', newusername);
    console.log('Sending Email:', newemail);
    console.log('Sending Old Password:', oldPassword);
    console.log('Sending New Password:', newPassword);
    console.log('------------------------------------');

    try {
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          newusername,
          newemail,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Update Successful:', data.message);

        const finalUsername = trimmedNewUsername || username;

        // ✅ Refetch full user to avoid resetting quiz history/badges
        if (onUserUpdated) {
          try {
            const refetchRes = await fetch(`/api/profileData?username=${finalUsername}`);
            const fullUser = await refetchRes.json();

            if (refetchRes.ok) {
              onUserUpdated(fullUser); // ✅ send full user object to parent
            } else {
              console.error("⚠️ Failed to re-fetch updated user data.");
            }
          } catch (err) {
            console.error("⚠️ Error refetching updated user:", err);
          }
        }

        // ✅ Update URL if username changed
        if (trimmedNewUsername) {
          router.push(`/profile?username=${trimmedNewUsername}`);
        }

        onClose();
      } else {
        const errorMsg = data?.error || "Update failed. Please try again.";
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("🚨 Network error:", error);
      setErrorMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1000">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Profile Information</h2>

        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="usernameInput" className="block text-gray-800 text-sm font-bold mb-2">New Username:</label>
          <input
            type="text"
            id="usernameInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new username"
            value={newusername}
            onChange={(e) => {
              setNewUsername(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Old Password Input */}
        <div className="mb-4">
          <label htmlFor="oldPasswordInput" className="block text-gray-700 text-sm font-bold mb-2">Old Password:</label>
          <input
            type="password"
            id="oldPasswordInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* New Password Input */}
        <div className="mb-4">
          <label htmlFor="newPasswordInput" className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
          <input
            type="password"
            id="newPasswordInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="emailInput" className="block text-gray-700 text-sm font-bold mb-2">New Email:</label>
          <input
            type="email"
            id="emailInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Gmail address"
            value={newemail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setErrorMessage('');
            }}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePage;
