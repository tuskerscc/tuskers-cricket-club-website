import logoPath from "@assets/Tuskers CC Logo.png";

export default function Footer() {

  return (
    <footer className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-8 sm:py-12 lg:py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Club Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={logoPath}
                alt="TUSKERS CRICKET CLUB"
                className="h-12 sm:h-14 w-auto object-contain"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#fcd34d]">TUSKERS CRICKET CLUB</h3>
              </div>
            </div>
            <p className="text-[#bfdbfe] mb-6 leading-relaxed">
              Passionate cricket, extraordinary talent, and unwavering dedication. Join us on our journey to excellence.
            </p>
            <div className="flex space-x-6">
              <a href="https://web.facebook.com/profile.php?id=61576572946310" target="_blank" rel="noopener noreferrer" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a href="mailto:info@tuskerscc.com" className="text-[#bfdbfe] hover:text-[#fcd34d] transition-colors">
                <i className="fas fa-envelope text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">HOME</a></li>
              <li><a href="#squad" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">SQUAD</a></li>
              <li><a href="#trivia" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">TRIVIA</a></li>
              <li><a href="/news" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">NEWS</a></li>
              <li><a href="/contact" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">CONTACT</a></li>
              <li><a href="#fanzone" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">FAN ZONE</a></li>
            </ul>
          </div>

          {/* Fan Zone */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">FAN ZONE</h4>
            <ul className="space-y-3">
              <li><a href="/gallery" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">GALLERY</a></li>
              <li><a href="#trivia" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">CRICKET TRIVIA</a></li>
              <li><a href="/forum" className="text-[#bfdbfe] hover:text-white transition-colors uppercase">COMMUNITY FORUM</a></li>
            </ul>
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
