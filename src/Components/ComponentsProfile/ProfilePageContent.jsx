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
  const [user, setUser] = useState(null); // State to hold the current user data

  // Function to fetch user data. This will be called on initial load and after successful updates.
  // This version incorporates the more robust error handling and return values from your first code.
  const fetchUser = async (identifier) => {
    try {
      const res = await fetch(`/api/profileData?username=${identifier}`);

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("❌ Failed to parse JSON from response:", jsonErr);
        data = {}; // Default to empty object if JSON parsing fails
      }

      if (res.ok) {
        console.log("✅ Profile data fetched:", data);
        setUser(data);
        return data; // Return data on success
      } else {
        console.error(`❌ Error fetching user (status ${res.status}):`, data);
        setUser(null); // Clear user on error
        return null; // Return null on error
      }
    } catch (err) {
      console.error("❌ Network or unknown error fetching user:", err);
      setUser(null); // Clear user on network/other error
      return null; // Return null on network/other error
    }
  };

  // Effect to fetch user data when the component mounts or username changes
  useEffect(() => {
    if (!username) {
      console.warn("❌ Username not found in URL. Cannot fetch profile.");
      return;
    }
    fetchUser(username); // Call the more robust fetchUser
  }, [username]); // Depend on username from URL to refetch if it changes

  // Callback function to be passed to ProfileCard.
  // This function will be called by ProfileCard when the user's data is updated successfully.
  // This is kept from your first code to allow updates from child components.
  const handleUserUpdate = (updatedUserData) => {
    // When ProfileCard notifies us of an update, update the user state here.
    // This will cause ProfilePageContent (and its children) to re-render with new data.
    setUser(updatedUserData);
    console.log("🔄 ProfilePageContent: User data updated by child component.");
  };

  if (!user) {
    // Retaining the more descriptive loading message from your first code
    return <div className="text-center py-20 text-xl text-gray-500 dark:text-gray-400">Loading profile...</div>;
  }

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-12 mt-5">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center">My Profile</h1>
        {/* Pass the current user object and the update callback to ProfileCard */}
        <ProfileCard user={user} onUserUpdate={handleUserUpdate} />
        <UserBadges user={user} />
        <h2 className="text-2xl font-bold text-center">Activity Overview</h2>
        <ActivityOverview user={user} />
        <UserInsight user={user} />
      </div>
    </section>
  );
}