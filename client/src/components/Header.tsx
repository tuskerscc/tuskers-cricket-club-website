import { Link } from "wouter";
import { useState } from "react";
import logoPath from "@assets/Tuskers CC Logo.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 relative">
      {/* Logo positioned outside header rectangle */}
      <div className="absolute left-2 sm:left-4 top-2 z-20">
        <Link href="/" className="flex items-center space-x-3">
          <img
            src={logoPath}
            alt="TUSKERS CRICKET CLUB"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
          />
          <div>
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-[#fcd34d] leading-tight">
              <span className="block sm:hidden">TUSKERS CC</span>
              <span className="hidden sm:block">TUSKERS CRICKET CLUB</span>
            </h1>
          </div>
        </Link>
      </div>

      {/* Header Rectangle */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] py-2 sm:py-3 shadow-lg ml-44 sm:ml-60 md:ml-72 lg:ml-80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a
                href="#squad"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors text-sm lg:text-base"
              >
                Squad
              </a>
              <a
                href="#trivia"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors text-sm lg:text-base"
              >
                Trivia
              </a>
              <Link
                href="/news"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors text-sm lg:text-base"
              >
                News
              </Link>
              <Link
                href="/contact"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors text-sm lg:text-base"
              >
                Contact
              </Link>
              <Link
                href="/forum"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors text-sm lg:text-base"
              >
                Community Forum
              </Link>
              <a
                href="#fanzone"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors text-sm lg:text-base"
              >
                Fan Zone
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-[#fcd34d] hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-blue-700">
              <div className="flex flex-col space-y-3 pt-4">
                <a
                  href="#squad"
                  className="text-[#fcd34d] hover:text-white font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Squad
                </a>
                <a
                  href="#trivia"
                  className="text-[#fcd34d] hover:text-white font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trivia
                </a>
                <Link
                  href="/news"
                  className="text-[#fcd34d] hover:text-white font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  News
                </Link>
                <Link
                  href="/contact"
                  className="text-[#fcd34d] hover:text-white font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/forum"
                  className="text-[#fcd34d] hover:text-white font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Community Forum
                </Link>
                <a
                  href="#fanzone"
                  className="text-[#fcd34d] hover:text-white font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fan Zone
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}