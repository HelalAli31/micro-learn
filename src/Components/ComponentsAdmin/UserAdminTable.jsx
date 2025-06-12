// src/Components/ComponentsAdmin/UserAdminTable.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const UserAdminTable = ({ users }) => {
  const router = useRouter();

  const handleViewUser = (username) => {
    // This assumes your user detail page route is /admin/users/view?username=
    router.push(`/admin/users/view?username=${username}`);
  };

  const handleEditRole = (userId, currentRole) => {
    // TODO: Implement a modal or new page for editing role
    alert(
      `Implement edit role for user ID: ${userId}, current role: ${currentRole}`
    );
  };

  const handleDeleteUser = (userId, username) => {
    // TODO: Implement delete user logic (e.g., confirmation modal, API call)
    if (confirm(`Are you sure you want to delete user: ${username}?`)) {
      alert(`Implement delete user for user ID: ${userId}`);
    }
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
        No users found matching your criteria.
      </p>
    );
  }

  // Sort users by achievementCount in descending order
  // We use .slice() to create a shallow copy to avoid mutating the original 'users' prop
  const sortedUsers = users.slice().sort((a, b) => {
    // Ensure achievementCount is treated as a number, defaulting to 0 if undefined
    const achievementsA = a.achievementCount || 0;
    const achievementsB = b.achievementCount || 0;
    return achievementsB - achievementsA; // Descending order (highest first)
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Most Searched
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Achievements
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedUsers.map(
            (
              user // Use sortedUsers here
            ) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.mostSearched}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.achievementCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewUser(user.username)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3 transition-colors duration-150"
                    title="View full profile"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditRole(user._id, user.role)}
                    className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-600 mr-3 transition-colors duration-150"
                    title="Edit user role"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.username)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600 transition-colors duration-150"
                    title="Delete user"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdminTable;
