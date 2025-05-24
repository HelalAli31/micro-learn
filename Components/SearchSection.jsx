// ✅ SearchSection.jsx
import Link from "next/link"

export default function SearchSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#b8c6d9] to-[#a5b4d0] text-black text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Try Our Search Feature Now</h2>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8">
          No account needed! Experience how quick and easy it is to find short, focused video lessons.
        </p>
        <Link href="/search" className="bg-indigo-700 text-white px-6 md:px-8 py-3 rounded-md hover:bg-indigo-800 transition-colors">
          Search Any Topic
        </Link>
      </div>
    </section>
  )
}