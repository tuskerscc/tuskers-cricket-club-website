import { Link } from "wouter";
import { useState } from "react";
import logoPath from "@assets/Tuskers CC Logo.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Logo Section */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] py-4">
        <div className="container-responsive">
          <Link href="/" className="flex items-center justify-center space-x-3">
            <img
              src={logoPath}
              alt="TUSKERS CRICKET CLUB"
              className="h-16 sm:h-20 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#fcd34d] leading-tight">
                <span className="block sm:hidden">TUSKERS CC</span>
                <span className="hidden sm:block">TUSKERS CRICKET CLUB</span>
              </h1>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] shadow-lg">
        <div className="container-responsive py-3 sm:py-4">
          <div className="flex items-center justify-center">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a
                href="#squad"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors"
              >
                Squad
              </a>

              <a
                href="#trivia"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors"
              >
                Trivia
              </a>
              <Link
                href="/news"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors"
              >
                News
              </Link>
              <Link
                href="/contact"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/forum"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors"
              >
                Community Forum
              </Link>
              <a
                href="#fanzone"
                className="text-[#fcd34d] hover:text-white font-medium transition-colors"
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
      </nav>
    </header>
  );
}