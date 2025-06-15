import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react"; // Retaining all lucide-react imports from your code
import UpdatePage from "./updatePage"; // Retaining this import from your code

const ProfileCard = ({ user, onUserUpdate }) => { // Retaining onUserUpdate prop from your code

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Retaining state from your code

  // Function to show the UpdatePage modal (from your code)
  const showEditWindow = () => {
    setIsUpdateModalOpen(true);
  };

  // Function to hide the UpdatePage modal (from your code)
  const hideEditWindow = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-start gap-6 bg-blue-100 dark:bg-blue-900 rounded-2xl p-6 shadow-md border border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100">
      {/* Avatar icon */}
      <div className="w-24 h-24 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
        <User className="w-10 h-10 text-purple-600 dark:text-purple-300" />
      </div>

      {/* User details */}
      <div className="flex-1 space-y-4 mt-1">
        {/* Username */}
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="font-medium">Username:</span>
          <span>{user.username}</span>
        </div>

        {/* email */}
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="font-medium">Email:</span>
          <span>{user.email}</span>
        </div>

        {/* Edit Profile Button (Taking your more functional version) */}
        <div className="flex items-center gap-2">
            <button
            id="editProfileButton" // Retaining id from your code
            onClick={showEditWindow} // Retaining onClick functionality from your code
            className="
              bg-purple-600 hover:bg-purple-700
              text-white
              font-semibold
              py-2 px-4
              rounded-md
              shadow-sm hover:shadow-md
              transition duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
            "
            >
              Edit Personal Information {/* Retaining your button text */}
            </button>

            {/* Render the UpdatePage component conditionally (from your code) */}
            {isUpdateModalOpen && (
              <UpdatePage onClose={hideEditWindow} onUserUpdated={onUserUpdate} />
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;