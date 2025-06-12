'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import UserAdminTable from '../../../Components/ComponentsAdmin/UserAdminTable';
import MostSearchedPieChart from '../../../Components/ComponentsAdmin/MostSearchedPieChart';
import { getUserBadges } from '@/lib/badgeUtils';

// Helper function to find the most frequent string in an array
const getMostFrequentItem = (arr) => {
  if (!arr || arr.length === 0) return 'N/A';
  const counts = {};
  let maxCount = 0;
  let mostFrequent = '';

  for (const item of arr) {
    if (item && typeof item === 'string') {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        mostFrequent = item;
      }
    }
  }
  return mostFrequent || 'N/A';
};

const AdminUsersPage = () => {
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading from context
  const router = useRouter();

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [usernameFilter, setUsernameFilter] = useState('');
  const [minAchievementsFilter, setMinAchievementsFilter] = useState('');
  const [mostSearchedFilter, setMostSearchedFilter] = useState('');

  // Authentication check and data fetching
  useEffect(() => {
    if (authLoading) return; // Wait for authentication state to load

    // 1. Client-side authentication check
    if (!user || user.role !== 'admin') {
      router.push('/login'); // Redirect to login if not logged in or not an admin
      return;
    }

    // 2. Fetch users if authenticated as admin
    const fetchUsers = async () => {
      setLoading(true); // Set loading true when starting fetch
      try {
        const res = await fetch('/api/admin/users', {
          headers: {
            // Ensure user._id and user.role are available before sending
            'x-user-id': user._id || '', // Send empty string if _id is null/undefined
            'x-user-role': user.role || '', // Send empty string if role is null/undefined
          },
        });
        const data = await res.json();

        if (res.ok) {
          const processedUsers = data.users.map((userItem) => {
            const { badges } = getUserBadges(userItem.quizHistory);
            const achievementCount = badges.length;
            const mostSearched = getMostFrequentItem(userItem.searchHistory);

            return {
              ...userItem,
              mostSearched,
              achievementCount,
            };
          });
          setAllUsers(processedUsers);
          setError(null); // Clear any previous errors
        } else {
          setError(data.error || 'Failed to fetch users');
          if (res.status === 403 || res.status === 401) {
            // If the API explicitly denies access due to auth, redirect to login
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('❌ Error fetching users for admin:', err);
        setError('An unexpected error occurred while fetching users.');
      } finally {
        setLoading(false); // Set loading false after fetch attempt
      }
    };

    fetchUsers();
  }, [user, authLoading, router]); // Depend on user and authLoading state for re-fetch/redirect

  // Filtered users based on current filter states (memoized for performance)
  const filteredUsers = useMemo(() => {
    return allUsers.filter((userItem) => {
      // Renamed 'user' to 'userItem' for clarity within filter
      const matchesUsername = usernameFilter
        ? userItem.username.toLowerCase().includes(usernameFilter.toLowerCase())
        : true;

      const matchesAchievements = minAchievementsFilter
        ? userItem.achievementCount >= parseInt(minAchievementsFilter)
        : true;

      const matchesMostSearched = mostSearchedFilter
        ? userItem.mostSearched
            .toLowerCase()
            .includes(mostSearchedFilter.toLowerCase())
        : true;

      return matchesUsername && matchesAchievements && matchesMostSearched;
    });
  }, [allUsers, usernameFilter, minAchievementsFilter, mostSearchedFilter]);

  // Data for the pie chart (top 3 most searched items across ALL users)
  const pieChartData = useMemo(() => {
    const allSearches = allUsers
      .flatMap((userItem) => userItem.searchHistory || [])
      .filter((item) => item && typeof item === 'string');
    const searchCounts = {};
    for (const search of allSearches) {
      searchCounts[search] = (searchCounts[search] || 0) + 1;
    }

    const sortedSearches = Object.entries(searchCounts).sort(
      ([, countA], [, countB]) => countB - countA
    );
    const top3Searches = sortedSearches.slice(0, 3);

    return {
      labels: top3Searches.map(([term]) => term),
      data: top3Searches.map(([, count]) => count),
    };
  }, [allUsers]);

  // Display loading/access denied state while authentication is in progress or user is not admin
  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
        <div className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
          {authLoading
            ? 'Loading authentication...'
            : 'Access Denied: You must be an administrator.'}
        </div>
      </div>
    );
  }

  // Display page loading state while data is being fetched (after auth)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
        <div className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
          Loading user data...
        </div>
      </div>
    );
  }

  // Display error state if data fetching failed
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 p-4 rounded-lg">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  // Render the admin page content if authentication and data fetching are successful
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-700 dark:text-purple-400">
        Admin User Overview
      </h1>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-850 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="usernameFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Username
            </label>
            <input
              type="text"
              id="usernameFilter"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
              placeholder="e.g., JohnDoe"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="minAchievementsFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Min. Achievements
            </label>
            <input
              type="number"
              id="minAchievementsFilter"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
              placeholder="e.g., 1"
              value={minAchievementsFilter}
              onChange={(e) => setMinAchievementsFilter(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="mostSearchedFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Most Searched
            </label>
            <input
              type="text"
              id="mostSearchedFilter"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
              placeholder="e.g., JavaScript"
              value={mostSearchedFilter}
              onChange={(e) => setMostSearchedFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* User Table Section */}
      <div className="bg-white dark:bg-gray-850 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
          User Data
        </h2>
        <UserAdminTable users={filteredUsers} />
      </div>

      {/* Pie Chart Section */}
      <div className="bg-white dark:bg-gray-850 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700 dark:text-indigo-400">
          Top 3 Most Searched Terms
        </h2>
        {pieChartData.labels.length > 0 ? (
          <MostSearchedPieChart
            labels={pieChartData.labels}
            data={pieChartData.data}
          />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No search data available for charting.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
