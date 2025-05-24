"use client"
import Image from "next/image"
import Link from "next/link"


export default function Navbar({ toggleMenu, isMenuOpen }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="logo-container">
        <Image src="/logo.png" alt="MicroLearn Logo" width={40} height={40} />
        <span className="logo-text">MicroLearn</span>
      </div>
      <button className="menu-button md:hidden text-white focus:outline-none" onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </button>
      <div className="hidden md:flex justify-between flex-1 ml-10">
        <nav className="nav-links">
          <Link href="#about">About</Link>
          <Link href="#features">Features</Link>
          <Link href="#testimonials">Testimonials</Link>
        </nav>
        <div className="auth-buttons">
          <Link href="/login" className="btn-outline">Profile</Link>
          <Link href="/signup" className="btn-primary">Start Learning</Link>
        </div>
      </div>
    </div>
  )
}