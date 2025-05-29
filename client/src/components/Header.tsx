import { Link } from 'wouter';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="/attached_assets/Tuskers CC Logo.png" 
              alt="Tuskers CC" 
              className="w-12 h-12 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">TUSKERS CC</h1>
              <p className="text-sm text-gray-600">Cricket Club</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#squad" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Squad
            </a>
            <a href="#matches" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Fixtures
            </a>
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors flex items-center">
                Scoring <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/scoring/fan" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a] transition-colors rounded-t-lg">
                  <i className="fas fa-users mr-2"></i>Fan Scoring
                </Link>
                <Link href="/scoring/tuskers" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a] transition-colors rounded-b-lg">
                  <i className="fas fa-shield-alt mr-2"></i>Official Scoring
                </Link>
              </div>
            </div>
            <a href="#trivia" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Trivia
            </a>
            <Link href="/news" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              News
            </Link>
            <Link href="/forum" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Forum
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Community
            </Link>
            <a href="#fanzone" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Fan Zone
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-[#1e3a8a] focus:outline-none"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="pt-4 pb-2 space-y-2">
            <a 
              href="#squad" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-users mr-2"></i>Squad
            </a>
            <a 
              href="#matches" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-calendar mr-2"></i>Fixtures
            </a>
            <div className="px-4 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">Scoring</div>
              <div className="ml-4 space-y-1">
                <Link 
                  href="/scoring/fan" 
                  className="block px-3 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-users mr-2"></i>Fan Scoring
                </Link>
                <Link 
                  href="/scoring/tuskers" 
                  className="block px-3 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-shield-alt mr-2"></i>Official Scoring
                </Link>
              </div>
            </div>
            <a 
              href="#trivia" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-question-circle mr-2"></i>Trivia
            </a>
            <Link 
              href="/news" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-newspaper mr-2"></i>News
            </Link>
            <Link 
              href="/forum" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-comments mr-2"></i>Forum
            </Link>
            <Link 
              href="/community" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-users mr-2"></i>Community
            </Link>
            <a 
              href="#fanzone" 
              className="block px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-star mr-2"></i>Fan Zone
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}