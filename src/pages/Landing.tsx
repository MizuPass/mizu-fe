import { MapPin, Clock, Gamepad2, Gift, Ticket, Globe, Zap, Lock, CheckCircle, Star, Heart, TrendingUp } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Mizu Characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="/mizuIcons/mizu-cute.svg" alt="" className="absolute top-20 left-10 w-12 h-12 opacity-20 animate-bounce" />
        <img src="/mizuIcons/mizu-love.svg" alt="" className="absolute top-32 right-16 w-10 h-10 opacity-15 animate-pulse" />
        <img src="/mizuIcons/mizu-okey.svg" alt="" className="absolute bottom-40 left-20 w-8 h-8 opacity-10 animate-bounce" style={{ animationDelay: '1s' }} />
        <img src="/mizuIcons/mizu-success.svg" alt="" className="absolute top-1/2 right-10 w-14 h-14 opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 space-y-8">
          {/* Hero Card Section */}
          <section className="mb-8">
            <div className="rounded-3xl shadow-lg relative overflow-hidden min-h-[400px] flex items-center" 
                 style={{ backgroundColor: 'var(--body1)' }}>
              <div className="relative z-10 w-full py-12 px-8">
                {/* Badge with Mizu Character */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center rounded-full px-6 py-3 shadow-lg animate-bounce backdrop-blur-sm" 
                       style={{ backgroundColor: 'var(--body3)' }}>
                    <img src="/mizuIcons/mizu-success.svg" alt="Winner" className="w-6 h-6 mr-2" />
                    <span className="text-white font-bold">ETH Tokyo 2025 Winner</span>
                    <span className="mx-2 text-pink-100">•</span>
                    <span className="text-pink-100 font-medium">$5,000 Prize Pool</span>
                  </div>
                </div>

                {/* Main Characters Row + MizuPass NFT Preview */}
                <div className="flex justify-center items-center gap-6 mb-8">
                  <img src="/mizuIcons/mizu-cute.svg" alt="Cute" className="w-16 h-16 animate-bounce" />
                  <img src="/mizuIcons/mizu-love.svg" alt="Love" className="w-20 h-20 animate-pulse" />
                  
                  {/* Main MizuPass NFT Preview */}
                  <div className="relative bg-transparent">
                    <img src="/mizuPass.svg" alt="MizuPass NFT" className="w-48 h-48 md:w-56 md:h-56 " />
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                      NFT
                    </div>
                  </div>
                  
                  <img src="/mizuIcons/mizu-speakloud.svg" alt="Speak" className="w-18 h-18 animate-bounce" style={{ animationDelay: '0.5s' }} />
                  <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-16 h-16 animate-pulse" style={{ animationDelay: '0.7s' }} />
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center leading-tight mb-6">
                  Privacy-First{" "}
                  <span className="font-bold px-2 py-1 rounded-lg text-white bg-white/20 backdrop-blur-sm">
                    Universal Ticketing
                  </span>
                  {" "}Platform
                </h1>

                <p className="text-lg md:text-xl text-white/90 text-center max-w-4xl mx-auto mb-8 leading-relaxed">
                  The world's first compliant, privacy-preserving ticketing platform with seamless{" "}
                  <span className="font-bold px-2 py-1 rounded-lg text-white bg-white/20 backdrop-blur-sm">JETH-to-MJPY</span> payments via Uniswap v3 integration
                </p>

              </div>
            </div>
          </section>

          {/* Stats Cards Section */}
          <section className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 text-center" 
                   style={{ backgroundColor: 'var(--body1)' }}>
                <img src="/mizuIcons/mizu-speakloud.svg" alt="Fast" className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                <div className="text-3xl font-bold text-white mb-1">6.5ms</div>
                <div className="text-sm text-white/80 font-medium">Proof Generation</div>
              </div>
              <div className="rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 text-center"
                   style={{ backgroundColor: 'var(--body3)' }}>
                <img src="/mizuIcons/mizu-love.svg" alt="Low Fee" className="w-12 h-12 mx-auto mb-3 animate-bounce" />
                <div className="text-3xl font-bold text-white mb-1">&lt;3%</div>
                <div className="text-sm text-white/80 font-medium">Platform Fees</div>
              </div>
              <div className="rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 text-center bg-green-500">
                <img src="/mizuIcons/mizu-success.svg" alt="Quick" className="w-12 h-12 mx-auto mb-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="text-3xl font-bold text-white mb-1">30s</div>
                <div className="text-sm text-white/80 font-medium">Ticket Purchase</div>
              </div>
              <div className="rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 text-center bg-purple-500">
                <img src="/mizuIcons/mizu-okey.svg" alt="Secure" className="w-12 h-12 mx-auto mb-3 animate-bounce" style={{ animationDelay: '1s' }} />
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-white/80 font-medium">Privacy Protected</div>
              </div>
            </div>
          </section>

          {/* Live Events & Ticketing Header Card */}
          <section className="mb-8">
            <div className="rounded-3xl p-8 shadow-lg text-center" style={{ backgroundColor: 'var(--body4)' }}>
              <div className="flex justify-center items-center gap-4 mb-6">
                <img src="/mizuIcons/mizu-www.svg" alt="Events" className="w-16 h-16 animate-bounce" />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Live Events & Ticketing
                </h2>
                <img src="/mizuIcons/mizu-speakloud.svg" alt="Tickets" className="w-16 h-16 animate-pulse" />
              </div>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Experience seamless, privacy-first ticketing for concerts, gaming tournaments, and loyalty programs with JETH-to-MJPY payments
              </p>
            </div>
          </section>

          {/* Events Cards Grid */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Event Card 2 - Gaming Tournament */}
              <div className="rounded-3xl p-6 shadow-lg relative overflow-hidden hover:scale-105 transition-all duration-300" 
                   style={{ backgroundColor: 'var(--body3)' }}>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      Gaming
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img src="/mizuIcons/mizu-success.svg" alt="Gaming" className="w-8 h-8 animate-pulse" />
                    <h3 className="text-xl font-bold text-white leading-tight">
                      Shibuya Esports Cup
                    </h3>
                  </div>

                  <div className="text-lg font-bold text-white mb-3">
                    ¥2,800 MJPY
                  </div>

                  <p className="text-sm text-white/90 mb-4 flex-grow leading-relaxed">
                    Ultimate gaming tournament with prize pools and exclusive NFT rewards. Anonymous entry guaranteed.
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-white/80">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">Virtual Arena</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">March 28, 2025</span>
                    </div>
                  </div>

                  <button className="w-full bg-white/30 hover:bg-white/40 text-white font-medium py-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                    Join Tournament
                  </button>
                </div>
              </div>

              {/* Event Card 3 - Loyalty Program */}
              <div className="rounded-3xl shadow-lg relative overflow-hidden hover:scale-105 transition-all duration-300 min-h-[350px] flex items-center" 
                   style={{ backgroundColor: 'var(--body1)' }}>
                <div className="relative z-10 w-full py-8 px-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      Loyalty
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img src="/mizuIcons/mizu-love.svg" alt="Loyalty" className="w-8 h-8 animate-bounce" />
                    <h3 className="text-xl font-bold text-white leading-tight">
                      Tokyo Premium Pass
                    </h3>
                  </div>

                  <div className="text-lg font-bold text-white mb-3">
                    ¥15,000 MJPY
                  </div>

                  <p className="text-sm text-white/90 mb-4 flex-grow leading-relaxed">
                    Annual membership with exclusive access to premium venues, events, and rewards across Tokyo.
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-white/80">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">Tokyo Network</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">365 Days Access</span>
                    </div>
                  </div>

                  <button className="w-full bg-white/30 hover:bg-white/40 text-white font-medium py-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                    Get Membership
                  </button>
                </div>
              </div>

              {/* Event Card 4 - Exclusive Event */}
              <div className="rounded-3xl p-6 shadow-lg relative overflow-hidden hover:scale-105 transition-all duration-300 bg-purple-500">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                      <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      Sold Out
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img src="/mizuIcons/mizu-tired.svg" alt="Exclusive" className="w-8 h-8 animate-pulse" style={{ animationDelay: '1s' }} />
                    <h3 className="text-xl font-bold text-white leading-tight">
                      Midnight Jazz Lounge
                    </h3>
                  </div>

                  <div className="text-lg font-bold text-white mb-3">
                    ¥12,000 MJPY
                  </div>

                  <p className="text-sm text-white/90 mb-4 flex-grow leading-relaxed">
                    Intimate jazz experience in Tokyo's most exclusive venue. Limited seating, maximum privacy.
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-white/80">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">Roppongi, Tokyo</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">Every Saturday</span>
                    </div>
                  </div>

                  <button className="w-full bg-white/30 hover:bg-white/40 text-white font-medium py-2.5 rounded-lg transition-all duration-200 opacity-60 cursor-not-allowed backdrop-blur-sm">
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Core Innovations Card */}
          <section className="mb-8">
            <div className="rounded-3xl p-8 shadow-lg " style={{ backgroundColor: 'var(--body4)' }}>
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img src="/mizuIcons/mizu-www.svg" alt="Innovation" className="w-12 h-12 animate-bounce" />
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Core Innovations
                  </h2>
                  <img src="/mizuIcons/mizu-attention.svg" alt="Attention" className="w-12 h-12 animate-pulse" />
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Revolutionary solutions that bridge regulatory compliance with user privacy
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Universal KYC System */}
                <div className="rounded-2xl p-6 shadow-lg  hover:scale-105 transition-all duration-300" 
                     style={{ backgroundColor: 'var(--body1)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/mizuIcons/mizu-key.svg" alt="KYC" className="w-12 h-12 animate-bounce" />
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Universal KYC System</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    First platform supporting both Japanese Mizuhiki ID and international ZK Passport verification
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-white mr-2" />
                      <span className="text-white/80">Japanese: My Number Card → Mizuhiki ID</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-white mr-2" />
                      <span className="text-white/80">International: Passport → ZK Proof</span>
                    </div>
                  </div>
                </div>

                {/* Offline-First Architecture */}
                <div className="rounded-2xl p-6 shadow-lg  hover:scale-105 transition-all duration-300" 
                     style={{ backgroundColor: 'var(--body3)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/mizuIcons/mizu-speakloud.svg" alt="Offline" className="w-12 h-12 animate-pulse" />
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Offline-First Architecture</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    Cryptographic verification works without internet dependency using WASM circuits
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-white mr-2" />
                      <span className="text-white/80">6.5ms witness generation</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-white mr-2" />
                      <span className="text-white/80">Mobile-optimized WASM binary</span>
                    </div>
                  </div>
                </div>

                {/* Privacy-Preserving Payments */}
                <div className="rounded-2xl p-6 shadow-lg  hover:scale-105 transition-all duration-300 bg-green-500">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/mizuIcons/mizu-okey.svg" alt="Privacy" className="w-12 h-12 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Privacy-Preserving Payments</h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    Stealth addresses and ZK proofs ensure complete transaction privacy
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-white mr-2" />
                      <span className="text-white/80">Unique stealth addresses</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-white mr-2" />
                      <span className="text-white/80">Zero transaction correlation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Performance Card */}
          <section className="mb-8">
            <div className="rounded-3xl p-8 shadow-lg " style={{ backgroundColor: 'var(--body4)' }}>
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img src="/mizuIcons/mizu-success.svg" alt="Performance" className="w-12 h-12 animate-bounce" />
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Technical Performance
                  </h2>
                  <img src="/mizuIcons/mizu-okey.svg" alt="OK" className="w-12 h-12 animate-pulse" />
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Production-ready metrics that exceed industry standards
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { component: "ZK Circuit Witness Gen", target: "<10ms", actual: "6.5ms", icon: "/mizuIcons/mizu-speakloud.svg", color: 'var(--body1)' },
                  { component: "ZK Circuit Proof Gen", target: "<500ms", actual: "<300ms", icon: "/mizuIcons/mizu-success.svg", color: 'var(--body3)' },
                  { component: "Backend API Response", target: "<200ms", actual: "<150ms", icon: "/mizuIcons/mizu-love.svg", color: '#10b981' },
                  { component: "Frontend Page Load", target: "<2s", actual: "<1.5s", icon: "/mizuIcons/mizu-cute.svg", color: '#8b5cf6' },
                  { component: "QR Code Size", target: "<1000 chars", actual: "~800 chars", icon: "/mizuIcons/mizu-okey.svg", color: '#f59e0b' },
                  { component: "Offline Verification", target: "<100ms", actual: "<50ms", icon: "/mizuIcons/mizu-www.svg", color: '#ef4444' }
                ].map((row, index) => (
                  <div key={index} className="rounded-2xl p-4 shadow-lg  hover:scale-105 transition-all duration-300 text-center bg-white">
                    <img src={row.icon} alt={row.component} className="w-10 h-10 mx-auto mb-3 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }} />
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{row.component}</h3>
                    <div className="text-xs text-gray-600 mb-1">Target: {row.target}</div>
                    <div className="text-lg font-bold text-white rounded-lg py-1 px-2" style={{ backgroundColor: row.color }}>{row.actual}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">✅ Exceeded</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Competitive Advantages Card */}
          <section className="mb-8">
            <div className="rounded-3xl p-8 shadow-lg " style={{ backgroundColor: 'var(--body4)' }}>
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img src="/mizuIcons/mizu-attention.svg" alt="Advantage" className="w-12 h-12 animate-bounce" />
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Competitive Advantages
                  </h2>
                  <img src="/mizuIcons/mizu-success.svg" alt="Winner" className="w-12 h-12 animate-pulse" />
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Revolutionary advantages over traditional and crypto ticketing platforms
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* vs Traditional Platforms */}
                <div className="rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300" 
                     style={{ backgroundColor: 'var(--body3)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <img src="/mizuIcons/mizu-mendokusai.svg" alt="vs Traditional" className="w-10 h-10 animate-bounce" />
                    <h3 className="text-2xl font-bold text-white">vs Traditional Platforms</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { feature: "Total Fees", traditional: "15-30%", mizupass: "<3%" },
                      { feature: "Privacy", traditional: "None", mizupass: "Full ZK Privacy" },
                      { feature: "Resale Control", traditional: "Limited", mizupass: "Smart Contract" },
                      { feature: "International UX", traditional: "Poor", mizupass: "Universal KYC" },
                      { feature: "Offline Capable", traditional: "No", mizupass: "Yes" }
                    ].map((row, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="font-medium text-white mb-1">{row.feature}</div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <img src="/mizuIcons/mizu-failed.svg" alt="Failed" className="w-6 h-6" />
                            <span className="text-white">{row.traditional}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-6 h-6" />
                            <span className="text-white font-semibold">{row.mizupass}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* vs Crypto Ticketing */}
                <div className="rounded-2xl p-6 shadow-lg  hover:scale-105 transition-all duration-300" 
                     style={{ backgroundColor: 'var(--body1)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <img src="/mizuIcons/mizu-tired.svg" alt="vs Crypto" className="w-10 h-10 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white">vs Crypto Ticketing</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { feature: "Regulatory Compliance", crypto: "No", mizupass: "Full JSC Compliance" },
                      { feature: "Privacy Features", crypto: "None", mizupass: "Stealth + ZK Proofs" },
                      { feature: "Payment Options", crypto: "Limited", mizupass: "Multi-asset via DEX" },
                      { feature: "KYC System", crypto: "Basic", mizupass: "Dual Japanese/Intl" },
                      { feature: "Offline Verification", crypto: "No", mizupass: "Full WASM Support" }
                    ].map((row, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="font-medium text-white mb-1">{row.feature}</div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <img src="/mizuIcons/mizu-failed.svg" alt="Failed" className="w-6 h-6" />
                            <span className="text-white">{row.crypto}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-6 h-6" />
                            <span className="text-white font-semibold">{row.mizupass}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Target Markets Card */}
          <section className="mb-8">
            <div className="rounded-3xl p-8 shadow-lg " style={{ backgroundColor: 'var(--body4)' }}>
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img src="/mizuIcons/mizu-www.svg" alt="Markets" className="w-12 h-12 animate-bounce" />
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Target Markets
                  </h2>
                  <img src="/mizuIcons/mizu-love.svg" alt="Love" className="w-12 h-12 animate-pulse" />
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Real-world applications across diverse event categories
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Tokyo 2025+ Events",
                    icon: <Star className="w-8 h-8" />,
                    mizuIcon: "/mizuIcons/mizu-success.svg",
                    items: ["Olympics Residual Events", "Cultural Festivals", "Corporate Conferences"],
                    bgColor: '#f59e0b'
                  },
                  {
                    title: "Entertainment Industry",
                    icon: <Heart className="w-8 h-8" />,
                    mizuIcon: "/mizuIcons/mizu-love.svg",
                    items: ["J-Pop Concerts", "Anime Conventions", "Gaming Tournaments"],
                    bgColor: 'var(--body3)'
                  },
                  {
                    title: "Business & Professional",
                    icon: <TrendingUp className="w-8 h-8" />,
                    mizuIcon: "/mizuIcons/mizu-cute.svg",
                    items: ["Fintech Conferences", "Art Exhibitions", "Educational Workshops"],
                    bgColor: 'var(--body1)'
                  }
                ].map((market, index) => (
                  <div key={index} className="rounded-2xl p-6 shadow-lg  hover:scale-105 transition-all duration-300" 
                       style={{ backgroundColor: market.bgColor }}>
                    <div className="flex items-center gap-3 mb-6">
                      <img src={market.mizuIcon} alt={market.title} className="w-12 h-12 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }} />
                      <div className="text-white">
                        {market.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{market.title}</h3>
                    <ul className="space-y-2">
                      {market.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-white/90">
                          <CheckCircle className="w-4 h-4 text-white mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Card */}
          <section className="mb-8">
            <div className="rounded-3xl shadow-lg text-center relative overflow-hidden min-h-[500px] flex items-center" 
                 style={{ backgroundColor: 'var(--body1)' }}>
              <div className="relative z-10 w-full py-12 px-12">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img src="/mizuIcons/mizu-cute.svg" alt="Ready" className="w-16 h-16 animate-bounce" />
                  <img src="/mizuIcons/mizu-love.svg" alt="Love" className="w-20 h-20 animate-pulse" />
                  <img src="/mizuIcons/mizu-speakloud.svg" alt="Action" className="w-16 h-16 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Revolutionize Event Ticketing?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  Join the privacy-first, compliant ticketing platform that's making decentralized event access a reality
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}