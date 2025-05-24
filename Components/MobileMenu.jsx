"use client"
import Link from "next/link"

export default function MobileMenu({ setIsMenuOpen }) {
  return (
    <div className="mobile-menu md:hidden">
      <nav className="flex flex-col gap-4 py-4">
        <Link href="#about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link href="#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
        <Link href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</Link>
        <Link href="/login" onClick={() => setIsMenuOpen(false)}>Profile</Link>
        <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="mobile-cta">
          Start Learning
        </Link>
      </nav>
    </div>
  )
}
