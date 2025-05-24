'use client'
import { useState, useEffect } from "react"
import Navbar from '/Components/Navbar'
import MobileMenu from '/Components/MobileMenu'
import HeroSection from '/Components/HeroSection'
import SearchSection from '/Components/SearchSection'
import FeaturesSection from '/Components/FeaturesSection'
import HowItWorks from '/Components/HowItWorks'
import AboutSection from '/Components/AboutSection'
import Footer from '/Components/Footer'
import TestimonialsSection from '/Components/TestimonialsSection'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest(".mobile-menu") && !e.target.closest(".menu-button")) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMenuOpen])

  const toggleMenu = (e) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <main className="overflow-x-hidden">
      <header className="header">
        <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        {isMenuOpen && <MobileMenu setIsMenuOpen={setIsMenuOpen} />}
      </header>
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <HowItWorks />
      <AboutSection />
      <TestimonialsSection />  
      <Footer />

    </main>
  )
}
