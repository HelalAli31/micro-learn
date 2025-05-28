'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams(); // Get search parameters
  const username = searchParams.get('username'); // Get the username from the URL

  useEffect(() => {
    // Simulate fetching user data (you can replace this with real auth logic)
    const mockUser = {
      name: username || 'Guest', // Use the username from the URL, or 'Guest' if not provided
      email: 'jane.doe@example.com', // You might want to fetch this based on the username
      joined: 'January 2024',
    };

    setTimeout(() => {
      setUser(mockUser);
    }, 500); // simulate a delay
  }, [username]); // Add username to dependency array to re-run effect if username changes

  if (!user) {
    return <div className="p-6 text-white">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
      <div className="bg-[#2c2c4a] p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome, {user.name}!
        </h1>
        <div className="space-y-4">
          <p>
            <strong>Username:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Member since:</strong> {user.joined}
          </p>
        </div>
      </div>
    </div>
  );
}
