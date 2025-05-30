export default function Footer() {

  return (
    <footer className="bg-[#1e3a8a] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center">
                <span className="text-[#1e3a8a] font-bold text-lg">TC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#fcd34d]">TUSKERS CRICKET CLUB</h3>
              </div>
            </div>
            <p className="text-[#bfdbfe] mb-4 leading-relaxed">
              Passionate cricket, extraordinary talent, and unwavering dedication. Join us on our journey to excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
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
              <li><a href="#" className="text-[#bfdbfe] hover:text-white transition-colors">Home</a></li>
              <li><a href="#matches" className="text-[#bfdbfe] hover:text-white transition-colors">Match Center</a></li>
              <li><a href="#squad" className="text-[#bfdbfe] hover:text-white transition-colors">Squad</a></li>
              <li><a href="#news" className="text-[#bfdbfe] hover:text-white transition-colors">Latest Updates</a></li>
              <li><a href="#starting11" className="text-[#bfdbfe] hover:text-white transition-colors">Starting 11</a></li>
              <li><a href="#fanzone" className="text-[#bfdbfe] hover:text-white transition-colors">Fan Zone</a></li>
            </ul>
          </div>

          {/* Fan Zone */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Fan Zone</h4>
            <ul className="space-y-3">
              <li><a href="#gallery" className="text-[#bfdbfe] hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#trivia" className="text-[#bfdbfe] hover:text-white transition-colors">Cricket Trivia</a></li>
              <li><a href="#forum" className="text-[#bfdbfe] hover:text-white transition-colors">Community Forum</a></li>
              <li><a href="#events" className="text-[#bfdbfe] hover:text-white transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Stay Updated</h4>
            <p className="text-[#bfdbfe] mb-4">Get the latest news and updates from TUSKERS CRICKET CLUB</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-3 py-2 bg-[#1d4ed8] text-white placeholder-[#bfdbfe] rounded-l-lg border border-[#2563eb] focus:outline-none focus:border-[#fcd34d]"
              />
              <button className="px-4 py-2 bg-[#f59e0b] text-[#1e3a8a] font-semibold rounded-r-lg hover:bg-[#fcd34d] transition-colors">
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
            <div className="flex space-x-6">
              <a href="#" className="text-[#bfdbfe] hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#bfdbfe] hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-[#bfdbfe] hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
