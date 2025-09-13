export default function Features() {
  const features = [
    {
      icon: "🎫",
      title: "Universal Ticketing",
      description: "Seamless access for Japanese (Mizuhiki ID) and international users (ZK Passport) with smart resale controls.",
      gradient: "from-blue-400 to-cyan-400",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: "🔐",
      title: "Privacy by Default",
      description: "Stealth addresses and ZK proofs ensure complete transaction privacy while maintaining regulatory compliance.",
      gradient: "from-purple-400 to-pink-400",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: "⚡",
      title: "Instant JETH Payments",
      description: "Direct JETH payments with automatic MJPY conversion via Uniswap v3 integration. No manual exchanges needed.",
      gradient: "from-green-400 to-emerald-400",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: "🛡️",
      title: "Regulatory Compliant",
      description: "Full Japanese FSA compliance with selective disclosure KYC. Privacy that doesn't compromise legal requirements.",
      gradient: "from-orange-400 to-red-400",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      icon: "🌍",
      title: "Global Access",
      description: "Break down geographic barriers with universal KYC verification supporting both domestic and international users.",
      gradient: "from-indigo-400 to-blue-400",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: "🎭",
      title: "Fan Community",
      description: "SBT-based loyalty tiers, exclusive events, early access, and governance participation in event DAOs.",
      gradient: "from-pink-400 to-rose-400",
      bgGradient: "from-pink-50 to-rose-50"
    }
  ]

  return (
    <section id="features" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-4 sm:mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MizuPass?</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
            The first ticketing platform that combines cutting-edge privacy technology 
            with seamless user experience and regulatory compliance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${feature.bgGradient} rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/50 min-h-[200px] sm:min-h-[220px] flex flex-col`}
            >
              {/* Decorative Shape - Hidden on very small screens */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl transform rotate-12 group-hover:rotate-45 transition-transform duration-500 hidden xs:block"></div>
              
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Arrow - Hidden on mobile */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 px-4 sm:px-0">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 px-6 sm:px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-full shadow-lg border border-white/50">
            <span className="text-sm sm:text-base text-gray-700 font-medium text-center">Ready to experience the future of ticketing?</span>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}