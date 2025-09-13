import { ArrowRight, Shield, Zap, Globe, Users, Ticket, Star, Heart } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <div className="tree-decoration tree-left"></div>
      <div className="tree-decoration tree-right"></div>
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div>
            {/* Hero Section */}
            <div className="text-center mb-16">
              {/* <Badge className="bg-[#87CEEB]/20 text-[#4682B4] border-[#87CEEB]/30 mb-6 px-6 py-2 text-lg font-medium rounded-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Privacy-First Ticketing Platform
              </Badge> */}
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 text-balance leading-tight font-sans">
                Find Your Next{" "}
                <span className="bg-gradient-to-r from-[#87CEEB] via-[#4682B4] to-[#98FB98] bg-clip-text text-transparent">
                  Event Experience
                </span>{" "}
                in Japan
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto text-pretty leading-relaxed font-sans">
                Experience seamless event ticketing with complete privacy protection, universal KYC verification, and
                transparent workflows powered by blockchain technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="gradient-button-strong flex items-center justify-center px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform duration-300 font-medium cursor-pointer font-sans">
                <Ticket className="w-6 h-6 mr-3" />
                Get Started
              </button>
              <button
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform duration-300 font-medium font-sans"
              >
                Learn More
                <ArrowRight className="w-6 h-6 ml-3" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="scalloped-card bg-gradient-to-br from-[#FFE4B5] to-[#F0E68C] p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
                  <Shield className="w-8 h-8 text-[#DAA520]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-sans">Privacy First</h3>
                <p className="text-gray-700 text-lg leading-relaxed font-sans">
                  Stealth addresses and ZK proofs ensure your transactions remain completely private
                </p>
              </div>

              <div className="scalloped-card bg-gradient-to-br from-[#FFB6C1] to-[#FFC0CB] p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
                  <Zap className="w-8 h-8 text-[#DC143C]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-sans">Lightning Fast</h3>
                <p className="text-gray-700 text-lg leading-relaxed font-sans">
                  Sub-30 second ticket purchases with automatic JETH to MJPY conversion
                </p>
              </div>

              <div className="scalloped-card bg-gradient-to-br from-[#87CEEB] to-[#B0E0E6] p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
                  <Globe className="w-8 h-8 text-[#4682B4]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-sans">Universal Access</h3>
                <p className="text-gray-700 text-lg leading-relaxed font-sans">
                  Dual KYC system supports both Japanese Mizuhiki ID and international users
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="scalloped-card bg-gradient-to-br from-[#98FB98] to-[#90EE90] p-8 shadow-lg">
                <div className="mb-6">
                  <span className="text-sm font-medium text-gray-600 bg-white/50 px-3 py-1 rounded-full font-sans">
                    Personalized Activity • Health Tracking • Progress Insights
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 font-sans">
                  Track vital event metrics such as attendance, engagement, and satisfaction levels
                </h2>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed font-sans">
                  You can adjust your event preferences to stay within budget limits, prevent overspending, and maximize
                  the effectiveness of each experience
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-800 font-sans">Event Satisfaction</div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-800 font-sans">Community Level</div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Ticket className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-800 font-sans">Ticket History</div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-800 font-sans">Loyalty Points</div>
                  </div>
                </div>
              </div>

              <div className="scalloped-card bg-gradient-to-br from-[#DDA0DD] to-[#DA70D6] p-8 flex items-center justify-center shadow-lg">
                <div className="bg-black rounded-3xl p-4 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 w-72">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium font-sans">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-6 h-3 border border-black rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 font-sans">Event Stats</h3>
                      <p className="text-sm text-gray-600 font-sans">
                        Track key indicators of your event participation and fitness progress
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700 font-sans">Event Attendance</span>
                        <span className="text-sm font-bold text-green-600 font-sans">95%</span>
                      </div>
                      <div className="h-32 bg-gray-50 rounded-xl p-4">
                        <div className="h-full flex items-end justify-between">
                          {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                            <div key={i} className="bg-green-400 rounded-t w-6" style={{ height: `${height}%` }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-8 text-lg font-sans">Trusted by leading event organizers</p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {[
                  "Tokyo Events",
                  "J-Pop Concerts",
                  "Anime Conventions",
                  "Tech Conferences",
                  "Art Exhibitions",
                  "Gaming Tournaments",
                ].map((partner) => (
                  <div key={partner} className="bg-gray-100 rounded-full px-6 py-3 shadow-sm">
                    <span className="text-gray-700 font-medium font-sans">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}