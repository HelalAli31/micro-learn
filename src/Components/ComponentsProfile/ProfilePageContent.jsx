"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProfileCard from "./ProfileCard";
import ActivityOverview from "./ActivityOverview";
import UserBadges from "./UserBadges";
import UserInsight from "./UserInsight";

export default function ProfilePageContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [user, setUser] = useState(null);

  const fetchUser = async (identifier) => {
    try {
      const res = await fetch(`/api/profileData?username=${identifier}`);
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    if (username) fetchUser(username);
  }, [username]);

  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-xl text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Welcome back, {user.username}!</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 transition-all duration-300">
          <ProfileCard user={user} onUserUpdate={handleUserUpdate} />
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Achievements</h2>
          <UserBadges user={user} />
        </div>

        {/* Activity Overview */}
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Activity Overview</h2>
          <ActivityOverview user={user} />
        </div>

        {/* Insights */}
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Learning Insights</h2>
          <UserInsight user={user} />
        </div>
      </div>
    </section>
  );
}
