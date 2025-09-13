export default function Hero() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Decorative Shapes - Mobile Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-4 sm:top-20 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-4 sm:top-40 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-2xl opacity-20 animate-bounce transform rotate-45"></div>
        <div className="absolute bottom-32 left-8 sm:bottom-40 sm:left-1/4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-300 to-teal-400 rounded-full opacity-20"></div>
        <div className="absolute top-48 right-8 sm:top-60 sm:right-1/3 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl opacity-20 transform rotate-12"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Main Headline */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight font-sans">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Privacy-First
            </span>
            <br />
            <span className="text-gray-800">Universal Ticketing</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 font-sans">
            The first compliant, privacy-preserving ticketing platform with seamless 
            <span className="font-semibold text-blue-600"> JETH-to-MJPY</span> payments 
            and universal KYC for Japanese and international users.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0">
          <div className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 font-sans">🥷 Zero-Knowledge Privacy</span>
          </div>
          <div className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 font-sans">⚡ Instant Payments</span>
          </div>
          <div className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 font-sans">🌍 Global Access</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-14 lg:mb-16 px-4 sm:px-0">
          <button className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center justify-center space-x-2 sm:space-x-3">
              <span className="text-sm sm:text-base font-sans">Get Your Ticket</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white text-sm sm:text-base font-sans">
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-0">
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mb-1 sm:mb-2 font-sans">Sub-3%</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium font-sans">Platform Fees</div>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-purple-600 mb-1 sm:mb-2 font-sans">&lt;30s</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium font-sans">Purchase Time</div>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-pink-600 mb-1 sm:mb-2 font-sans">100%</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium font-sans">Privacy Protected</div>
          </div>
        </div>
      </div>
    </section>
  )
}