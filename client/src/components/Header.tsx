import { Link } from 'wouter';

export default function Header() {
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
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
            <a href="#news" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              News
            </a>
            <a href="#fanzone" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
              Fan Zone
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button className="text-gray-700 hover:text-[#1e3a8a] focus:outline-none">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}