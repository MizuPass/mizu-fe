import { ArrowRight, Shield, Zap, Globe, Users, Ticket, Star, Heart } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <div className="tree-decoration tree-left"></div>
      <div className="tree-decoration tree-right"></div>
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div>
            {/* Hero Section */}
            <div className=" flex flex-col-reverse md:flex-row gap-6 text-center md:text-left mb-16 px-2">
              <div className="flex flex-col justify-between gap-6">
                <h1 className="text-xl xs:text-3xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-7xl font-bold text-gray-900 text-balance leading-tight font-sans">
                Privacy First, {" "}
                <span >
                  Universal Ticketing Platform
                </span>
              </h1>
              <p className="  md:flex md:text-md md:text-lg lg:text-xl text-gray-600  text-pretty leading-relaxed ">
                Experience seamless event ticketing with complete privacy protection, universal KYC verification, and
                transparent workflows powered by blockchain technology.
              </p>
              </div>

              <div className=" items-center">
                <img 
                  src="/mizuPass.svg" 
                  alt="MizuPass Logo" 
                  className="w-full object-contain"
                />
              </div>
            </div>

            <div className="text-center md:text-left mb-16">
              <div className="text-purple-500 text-lg font-medium mb-4">Your Event Advantage</div>
              <h1 className="text-xl xs:text-3xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-7xl  text-gray-900 mb-8 font-bold ">
                A Smarter Approach
                <br />
                to Event Ticketing
              </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Left Card - Brown Frame */}
              <div className="relative">
                <div
                  className="w-full h-80 bg-contain bg-center bg-no-repeat relative flex flex-col justify-center items-center p-8"
                  style={{ backgroundImage: "url(/brown-card.svg)" }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-xs">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">👋</span>
                      </div>
                      <span className="text-sm text-gray-600">Hello, Event-goer</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Privacy First</h3>
                    <p className="text-sm text-gray-600">
                      Stealth addresses and ZK proofs ensure your transactions remain completely private
                    </p>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Privacy-First Insights</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Receive personalized, data-driven insights that help you understand your progress and guide your
                    event journey.
                  </p>
                </div>
              </div>

              {/* Middle Card - Pink Frame */}
              <div className="relative">
                <div
                  className="w-full h-80 bg-contain bg-center bg-no-repeat relative flex flex-col justify-center items-center p-8"
                  style={{ backgroundImage: "url(/red-card.svg)" }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-xs">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Events</div>
                        <div className="text-lg font-bold">15 total</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Time</div>
                        <div className="text-lg font-bold">2h 30m</div>
                      </div>
                    </div>
                    <div className="h-20 bg-green-50 rounded-lg p-3 relative">
                      <svg className="w-full h-full" viewBox="0 0 200 60">
                        <polyline
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          points="10,40 30,30 50,35 70,25 90,30 110,20 130,25 150,15 170,20 190,10"
                        />
                        <circle cx="190" cy="10" r="3" fill="#10B981" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">All-in-One Tracking</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    From ticket purchases to event stats like attendance and satisfaction, manage every aspect of your
                    events in one place.
                  </p>
                </div>
              </div>

              {/* Right Card - Blue Frame */}
              <div className="relative">
                <div
                  className="w-full h-80 bg-contain bg-center bg-no-repeat relative flex flex-col justify-center items-center p-8"
                  style={{ backgroundImage: "url(/blue-card.svg)" }}
                >
                  <div className="space-y-3 max-w-xs">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-red-500 text-sm">🏃</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Japanese (Mizuhiki ID)</div>
                        <div className="text-xs text-gray-500">today at 12:00 pm</div>
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-green-500 text-sm">🎫</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">international users (ZK Passport)</div>
                        <div className="text-xs text-gray-500">today at Shibuya street</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Universal Access</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Dual KYC system supports both Japanese Mizuhiki ID and international users
                  </p>
                </div>
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