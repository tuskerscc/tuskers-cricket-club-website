import { useState } from 'react';
import { Link } from 'wouter';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Live Scores Bar */}
      <div className="bg-[#1e3a8a] text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span className="text-[#f59e0b] font-semibold">LIVE SCORES:</span>
              <div className="hidden md:flex items-center space-x-4">
                <span>IND vs AUS: 245/6 (45.2)</span>
                <span>•</span>
                <span>ENG vs NZ: 178/4 (32.1)</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <i className="fab fa-facebook text-lg hover:text-[#f59e0b] cursor-pointer transition-colors"></i>
              <i className="fab fa-twitter text-lg hover:text-[#f59e0b] cursor-pointer transition-colors"></i>
              <i className="fab fa-instagram text-lg hover:text-[#f59e0b] cursor-pointer transition-colors"></i>
              <i className="fab fa-youtube text-lg hover:text-[#f59e0b] cursor-pointer transition-colors"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
              <span className="text-[#f59e0b] font-bold text-lg">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">TUSKERS CC</h1>
              <p className="text-sm text-gray-600">Cricket Club</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] transition-colors">
              Home
            </Link>
            <a href="#matches" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Match Center
            </a>
            <a href="#squad" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Squad
            </a>
            <a href="#news" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Latest Updates
            </a>
            <a href="#starting11" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Starting 11
            </a>
            <a href="#fanzone" className="text-gray-700 hover:text-[#1e3a8a] transition-colors">
              Fan Zone
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-[#1e3a8a] hover:text-[#f59e0b]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-[#1e3a8a] font-semibold">Home</Link>
              <a href="#matches" className="text-gray-700">Match Center</a>
              <a href="#squad" className="text-gray-700">Squad</a>
              <a href="#news" className="text-gray-700">Latest Updates</a>
              <a href="#starting11" className="text-gray-700">Starting 11</a>
              <a href="#fanzone" className="text-gray-700">Fan Zone</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
