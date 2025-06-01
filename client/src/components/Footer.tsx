import logoPath from "@assets/image_1748758628764.png";

export default function Footer() {

  return (
    <footer className="bg-[#1e3a8a] text-white py-8 sm:py-12 lg:py-16">
      <div className="container-responsive">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={logoPath}
                alt="TUSKERS CRICKET CLUB"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-[#fcd34d]">TUSKERS CRICKET CLUB</h3>
              </div>
            </div>
            <p className="text-[#bfdbfe] mb-4 leading-relaxed">
              Passionate cricket, extraordinary talent, and unwavering dedication. Join us on our journey to excellence.
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/profile.php?id=61576572946310" target="_blank" rel="noopener noreferrer" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-[#bfdbfe] hover:text-white transition-colors">Home</a></li>
              <li><a href="#squad" className="text-[#bfdbfe] hover:text-white transition-colors">Squad</a></li>
              <li><a href="#trivia" className="text-[#bfdbfe] hover:text-white transition-colors">Trivia</a></li>
              <li><a href="/news" className="text-[#bfdbfe] hover:text-white transition-colors">News</a></li>
              <li><a href="/contact" className="text-[#bfdbfe] hover:text-white transition-colors">Contact</a></li>
              <li><a href="#fanzone" className="text-[#bfdbfe] hover:text-white transition-colors">Fan Zone</a></li>
            </ul>
          </div>

          {/* Fan Zone */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Fan Zone</h4>
            <ul className="space-y-3">
              <li><a href="/gallery" className="text-[#bfdbfe] hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#trivia" className="text-[#bfdbfe] hover:text-white transition-colors">Cricket Trivia</a></li>
              <li><a href="/forum" className="text-[#bfdbfe] hover:text-white transition-colors">Community Forum</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Stay Updated</h4>
            <p className="text-[#bfdbfe] mb-4">Get the latest news and updates from TUSKERS CRICKET CLUB</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-3 py-2 bg-[#1d4ed8] text-white placeholder-[#bfdbfe] rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-[#2563eb] focus:outline-none focus:border-[#fcd34d] min-w-0"
              />
              <button className="px-4 py-2 bg-[#f59e0b] text-[#1e3a8a] font-semibold rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-[#fcd34d] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1d4ed8] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#bfdbfe] mb-4 md:mb-0">
              © 2024 Tuskers Cricket Club. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
