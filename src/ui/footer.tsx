import Lw from "../assets/images/lw.svg";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
      </div>
      
      <div className="relative z-10">
        {/* Main footer content */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Information */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img 
                  src={Lw} 
                  alt="LinksFam" 
                  className="h-8 w-auto mb-4 filter brightness-0 invert"
                />
                <h3 className="text-xl font-bold text-white mb-2">LinksFam</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Connecting influencers with brands for authentic collaborations. 
                  Build your creator economy and monetize your social media presence.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                <div className="text-gray-300 text-sm space-y-1">
                  <p className="font-medium">Indslav Joog Pvt Ltd.</p>
                  <p>D73 Oakwood Estate, DLF Phase 2</p>
                  <p>Gurgaon, Haryana, 122002</p>
                  <div className="flex flex-col sm:flex-row sm:gap-4 mt-3">
                    <a 
                      href="tel:+919971090262" 
                      className="text-primary hover:text-primary-hover transition-colors duration-200"
                    >
                      +91-9971090262
                    </a>
                    <a 
                      href="mailto:info@linksfam.com" 
                      className="text-primary hover:text-primary-hover transition-colors duration-200"
                    >
                      info@linksfam.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <nav className="space-y-3">
                <a 
                  href="/terms/" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </a>
                <a 
                  href="/privacy/" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/cookies-policy/" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Cookies Policy
                </a>
                <a 
                  href="/refund-policy/" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Refund Policy
                </a>
                <a 
                  href="/contact/" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Social Media & Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Connect With Us</h4>
              
              {/* Social Media Links */}
              <div className="flex space-x-4 mb-6">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>

              {/* Newsletter signup */}
              <div>
                <p className="text-gray-300 text-sm mb-3">Stay updated with our latest news</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-md border border-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                  <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors duration-200 text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Copyright &copy; {new Date().getFullYear()} LinksFam. All Rights Reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Made with ❤️ in India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      <div id="floating-button" className="fixed bottom-6 right-6 z-50">
        <button className="group relative px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <span className="relative z-10 font-semibold">Get Started For Free</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
