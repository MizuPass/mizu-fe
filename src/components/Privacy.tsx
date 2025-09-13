export default function Privacy() {
  return (
    <section id="privacy" className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background Decorative Elements - Mobile Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-4 sm:top-10 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-pink-200 to-orange-300 rounded-2xl opacity-10 transform rotate-45"></div>
        <div className="absolute top-1/2 left-2 sm:left-10 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-gradient-to-br from-green-200 to-teal-300 rounded-xl opacity-10 transform -rotate-12"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-4 sm:mb-6">
            Privacy & <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Compliance</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            The perfect balance between user privacy and regulatory compliance. 
            MizuPass pioneered the first solution that satisfies both users and regulators.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
          {/* Left Side - Privacy Features */}
          <div className="space-y-6 sm:space-y-8">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl shadow-lg border border-blue-100">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  🔐
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">Zero-Knowledge Proofs</h3>
                  <p className="text-sm sm:text-base text-gray-600">Prove your identity without revealing personal data. Advanced cryptography ensures your privacy is mathematically guaranteed.</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl sm:rounded-3xl shadow-lg border border-purple-100">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  👤
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">Stealth Addresses</h3>
                  <p className="text-sm sm:text-base text-gray-600">Every payment goes to a unique, unlinkable address. Your transaction history remains completely private and untraceable.</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl sm:rounded-3xl shadow-lg border border-green-100">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  🏛️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">Selective Disclosure</h3>
                  <p className="text-sm sm:text-base text-gray-600">Share only the minimum required information with each party. Regulators get compliance data, not personal details.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Compliance Features */}
          <div className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Regulatory Compliance</h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1 sm:mt-0">
                  🇯🇵
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm sm:text-base">Japanese FSA Compliant</div>
                  <div className="text-xs sm:text-sm text-gray-600">Full compliance with Japanese financial regulations</div>
                </div>
              </div>

              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1 sm:mt-0">
                  📋
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm sm:text-base">Automated Reporting</div>
                  <div className="text-xs sm:text-sm text-gray-600">Real-time compliance monitoring and reporting</div>
                </div>
              </div>

              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1 sm:mt-0">
                  ✅
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm sm:text-base">Dual KYC System</div>
                  <div className="text-xs sm:text-sm text-gray-600">Mizuhiki ID + ZK Passport verification</div>
                </div>
              </div>

              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1 sm:mt-0">
                  🔍
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm sm:text-base">Audit Trail</div>
                  <div className="text-xs sm:text-sm text-gray-600">Comprehensive logs without user deanonymization</div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white text-center">
              <div className="font-bold text-sm sm:text-base">The Best of Both Worlds</div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">Privacy for users, transparency for regulators</div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center px-4 sm:px-0">
          <div className="max-w-2xl lg:max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200">
            <blockquote className="text-base sm:text-lg lg:text-xl italic text-gray-700 mb-3 sm:mb-4">
              "Public blockchains mean that transaction records will be made public, raising concerns about privacy, confidentiality and consumer protection"
            </blockquote>
            <cite className="text-sm sm:text-base text-gray-600 font-semibold">— Japan FSA</cite>
            <div className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-600 font-medium">
              MizuPass solves this exact problem with privacy-preserving technology.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}