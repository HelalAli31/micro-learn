"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Needed to access query params
import ProfileCard from "./ProfileCard";
import ActivityOverview from "./ActivityOverview";
import UserBadges from "./UserBadges";
import UserInsight from "./UserInsight";

export default function ProfilePageContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // ✅ GET the ?username=...
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!username) {
      console.warn("❌ Username not found in URL.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/profileData?username=${username}`);
        const data = await res.json();
        console.log("✅ Profile data:", data);
        if (res.ok) setUser(data);
        else console.error("❌ Error fetching user:", data);
      } catch (err) {
        console.error("❌ Network or JSON error:", err);
      }
    };

    fetchUser();
  }, [username]);

  if (!user)
    return <div className="text-center py-20 text-xl">Loading profile...</div>;

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center">My Profile</h1>
        <ProfileCard user={user} />
        <UserBadges user={user} />
        <h2 className="text-2xl font-bold text-center">Activity Overview</h2>
        <ActivityOverview user={user} />
        <UserInsight user={user} />
      </div>
    </section>
  );
}
