import { Link } from 'wouter';
import { useState } from 'react';
import logoPath from '@assets/Tuskers CC Logo.png';

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
              src={logoPath} 
              alt="TUSKERS Cricket Club" 
              className="w-12 h-12 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">TUSKERS Cricket Club</h1>
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
            <Link href="/contact" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Contact
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
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
          <div className="py-6 px-4 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
            <div className="space-y-1">
              {/* Main Navigation Items */}
              <a 
                href="#squad" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-users text-[#1e3a8a] text-sm"></i>
                </div>
                <span>Squad</span>
                <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
              </a>
              
              <a 
                href="#matches" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-calendar text-green-600 text-sm"></i>
                </div>
                <span>Fixtures</span>
                <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
              </a>

              {/* Scoring Section */}
              <div className="my-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cricket Scoring</div>
                <div className="mt-2 space-y-1">
                  <Link 
                    href="/scoring/fan" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium ml-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-users text-purple-600 text-sm"></i>
                    </div>
                    <span>Fan Scoring</span>
                    <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
                  </Link>
                  <Link 
                    href="/scoring/tuskers" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium ml-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-shield-alt text-yellow-600 text-sm"></i>
                    </div>
                    <span>Official Scoring</span>
                    <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
                  </Link>
                </div>
              </div>

              {/* Other Sections */}
              <a 
                href="#trivia" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-question-circle text-orange-600 text-sm"></i>
                </div>
                <span>Cricket Trivia</span>
                <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
              </a>
              
              <Link 
                href="/news" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-newspaper text-red-600 text-sm"></i>
                </div>
                <span>News & Updates</span>
                <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
              </Link>

              <Link 
                href="/contact" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-envelope text-teal-600 text-sm"></i>
                </div>
                <span>Contact Us</span>
                <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
              </Link>
              
              <a 
                href="#fanzone" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-star text-amber-600 text-sm"></i>
                </div>
                <span>Fan Zone</span>
                <i className="fas fa-chevron-right ml-auto text-gray-400 text-xs"></i>
              </a>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-[#1e3a8a] font-bold text-lg">TUSKERS Cricket Club</div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}