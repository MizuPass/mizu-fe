export default function Footer() {
  return (
    <footer className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16 bg-gradient-to-br from-gray-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Decorative Elements - Mobile Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-20 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl opacity-10 transform rotate-45"></div>
        <div className="absolute top-1/2 right-8 sm:right-1/3 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl transform -rotate-12">M</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MizuPass
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 max-w-sm sm:max-w-md leading-relaxed mb-4 sm:mb-6">
              The first compliant, privacy-preserving ticketing platform that bridges 
              the gap between regulatory requirements and user privacy.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-base sm:text-lg">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-base sm:text-lg">📱</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                <span className="text-base sm:text-lg">💬</span>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">How it Works</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Privacy Features</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Compliance</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Pricing</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">API Reference</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Hackathon Banner */}
        <div className="mb-8 sm:mb-10 lg:mb-12 p-4 sm:p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl border border-blue-500/30 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🏆 ETHTokyo 2025 Hackathon Project
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
              Built for Cypherpunks Anonymous & Counterculture Capital tracks
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">🥷 Privacy & Security</span>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">✊ Financial Innovation</span>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">🎫 Universal Ticketing</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2025 MizuPass. Built with privacy in mind.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Tech Stack Badge */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 rounded-2xl sm:rounded-full border border-white/10">
            <span className="text-gray-400 text-xs sm:text-sm">Built on</span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-medium text-blue-400">JSC Kaigan</span>
              <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></div>
              <span className="text-xs sm:text-sm font-medium text-purple-400">Uniswap v3</span>
              <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></div>
              <span className="text-xs sm:text-sm font-medium text-green-400">Mizuhiki ID</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}