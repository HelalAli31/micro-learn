// src/app/Components/ComponentsLayout/MobileMenu.js
"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../../app/context/AuthContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function MobileMenu({ setIsMenuOpen }) {
  const { isLoggedIn, logout, username, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-1/2 z-50 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-b-2xl shadow-2xl transition-transform duration-300 ease-out overflow-y-auto"
    >
      <nav className="flex flex-col gap-4 py-6 px-6">
        <ThemeToggle />

        <Link
          href="/#about"
          onClick={() => setIsMenuOpen(false)}
          className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          About
        </Link>

        <Link
          href="/#features"
          onClick={() => setIsMenuOpen(false)}
          className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Features
        </Link>

        <Link
          href="/#testimonials"
          onClick={() => setIsMenuOpen(false)}
          className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Testimonials
        </Link>

        {isLoggedIn ? (
          <>
            {user?.role === "admin" && (
              <Link
                href="/admin/users"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-cta text-left w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
              >
                Admin Panel
              </Link>
            )}

            <Link
              href={`/search?username=${username}`}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Start Learning
            </Link>

            <Link
              href={`/profile?username=${username}`}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="mobile-cta text-left w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-cta text-left w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
