import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would make an API call
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

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
                <h3 className="text-xl font-bold text-[#fcd34d]">TUSKERS CC</h3>
                <p className="text-sm text-[#bfdbfe]">Cricket Club</p>
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

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-[#fcd34d]"></i>
                <span className="text-[#bfdbfe]">Tuskers Cricket Ground, Stadium Road</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-[#fcd34d]"></i>
                <span className="text-[#bfdbfe]">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-[#fcd34d]"></i>
                <span className="text-[#bfdbfe]">info@tuskerscc.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-[#fcd34d] mb-4">Stay Updated</h4>
            <p className="text-[#bfdbfe] mb-4">Subscribe to our newsletter for latest news and match updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e40af] border border-[#1d4ed8] rounded-lg text-white placeholder-[#93c5fd] focus:outline-none focus:border-[#fcd34d]"
                required
              />
              <button 
                type="submit"
                className="w-full bg-[#f59e0b] text-[#1e3a8a] py-3 rounded-lg font-semibold hover:bg-[#fbbf24] transition-colors"
              >
                {subscribed ? (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Subscribed!
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
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
