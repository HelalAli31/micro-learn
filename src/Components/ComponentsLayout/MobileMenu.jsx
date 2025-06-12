// src/app/Components/ComponentsLayout/MobileMenu.js
'use client';
import Link from 'next/link';
import { useAuth } from '../../app/context/AuthContext';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function MobileMenu({ setIsMenuOpen }) {
  // Destructure 'user' along with isLoggedIn, logout, username
  const { isLoggedIn, logout, username, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <div className="mobile-menu md:hidden">
      <nav className="flex flex-col gap-4 py-4">
        <ThemeToggle />
        <Link href="/#about" onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        <Link href="/#features" onClick={() => setIsMenuOpen(false)}>
          Features
        </Link>
        <Link href="/#testimonials" onClick={() => setIsMenuOpen(false)}>
          Testimonials
        </Link>
        {isLoggedIn ? (
          <>
            {/* Admin Panel Button - Only visible to admins */}
            {user && user.role === 'admin' && (
              <Link
                href="/admin/users"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-cta text-left w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <Link href="/search" onClick={() => setIsMenuOpen(false)}>
              Start Learning
            </Link>
            <Link
              href={`/profile?username=${username}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="mobile-cta text-left w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-cta"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
