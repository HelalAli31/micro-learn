// microlearn/Components/ComponentsLayout/Navbar.js
'use client';
import Image from 'next/image';
import Link from 'next/link';
// CORRECTED IMPORT PATH
import { useAuth } from '../../src/app/context/AuthContext'; // Fix the path
import { useRouter } from 'next/navigation';

export default function Navbar({ toggleMenu, isMenuOpen }) {
  // Get authentication state and functions from the AuthContext
  const { isLoggedIn, logout, username } = useAuth();
  const router = useRouter();

  // Handle user logout
  const handleLogout = () => {
    logout(); // Call the logout function from context
    router.push('/'); // Redirect to the home page after logging out
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Logo and site title, linked to the home page */}
      <Link href="/" className="logo-link">
        <div className="logo-container flex items-center">
          <Image src="/logo.png" alt="MicroLearn Logo" width={40} height={40} />
          <span className="logo-text ml-2 font-bold text-xl text-white">
            MicroLearn
          </span>
        </div>
      </Link>

      {/* Mobile menu toggle button (visible on small screens) */}
      <button
        className="menu-button md:hidden text-white focus:outline-none"
        onClick={toggleMenu}
      >
        {isMenuOpen ? '✖' : '☰'} {/* Toggle icon based on menu state */}
      </button>

      {/* Desktop navigation links and authentication buttons (hidden on small screens) */}
      <div className="hidden md:flex justify-between flex-1 ml-10">
        <nav className="nav-links flex space-x-6">
          <Link
            href="/#about"
            className="text-white hover:text-gray-300 transition-colors"
          >
            About
          </Link>
          <Link
            href="/#features"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Testimonials
          </Link>
        </nav>
        <div className="auth-buttons flex space-x-4">
          {isLoggedIn ? (
            // If the user is logged in, show these links
            <>
              <Link
                href={`/search?username=${username}`}
                className="btn-outline px-4 py-2 border rounded-md text-white hover:bg-white hover:text-[#202774] transition-colors"
              >
                Search
              </Link>
              <Link
                href={`/profile?username=${username}`} // Link to profile, passing username
                className="btn-outline px-4 py-2 border rounded-md text-white hover:bg-white hover:text-[#202774] transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout} // Logout button
                className="btn-primary px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // If the user is NOT logged in, show these links
            <>
              <Link
                href="/login" // Link to the login page
                className="btn-outline px-4 py-2 border rounded-md text-white hover:bg-white hover:text-[#202774] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup" // Link to the signup page
                className="btn-primary px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
