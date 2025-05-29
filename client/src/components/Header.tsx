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