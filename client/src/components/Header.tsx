import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize cricket scores widget
    const initCricketWidget = () => {
      const widgetContainer = document.getElementById('cricket-widget');
      if (widgetContainer) {
        // Create a custom cricket scores display
        widgetContainer.innerHTML = `
          <div class="cricket-scores-ticker">
            <div class="scroll-container">
              <div class="score-item">
                <span class="teams">IND vs AUS</span>
                <span class="score">287/6 (45.2)</span>
                <span class="status">Live</span>
              </div>
              <div class="score-item">
                <span class="teams">ENG vs NZ</span>
                <span class="score">178/4 (32.1)</span>
                <span class="status">Live</span>
              </div>
              <div class="score-item">
                <span class="teams">PAK vs SA</span>
                <span class="score">Match Ended</span>
                <span class="status">SA won by 7 wickets</span>
              </div>
            </div>
          </div>
        `;
        
        // Add CSS for the ticker
        const style = document.createElement('style');
        style.textContent = `
          .cricket-scores-ticker {
            overflow: hidden;
            width: 100%;
          }
          .scroll-container {
            display: flex;
            animation: scroll-left 60s linear infinite;
            white-space: nowrap;
          }
          .score-item {
            margin-right: 40px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            min-width: 200px;
          }
          .score-item .teams {
            font-weight: bold;
            color: #f59e0b;
          }
          .score-item .score {
            color: white;
          }
          .score-item .status {
            background: #dc2626;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: bold;
          }
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `;
        
        if (!document.querySelector('#cricket-ticker-styles')) {
          style.id = 'cricket-ticker-styles';
          document.head.appendChild(style);
        }
      }
    };

    // Initialize after component mounts
    const timer = setTimeout(initCricketWidget, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Live Cricket Scores Widget Bar */}
      <div className="bg-[#1e3a8a] text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Cricket Scores Widget Container */}
              <div id="cricket-widget" className="min-h-[30px] flex items-center"></div>
            </div>
            <div className="hidden md:flex items-center space-x-4 ml-4">
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
