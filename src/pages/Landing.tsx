import { ArrowRight, Zap, Globe, Star, Heart, Eye, Lock, Sparkles, CheckCircle, TrendingUp, Award } from "lucide-react"
import { MizuConnectButton } from "../components/ConnectButton"

export default function Landing() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          {/* Hero Section */}
          <section id="hero" className="text-center mb-24">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full px-6 py-3 mb-8 shadow-sm">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold">ETH Tokyo 2025 Winner</span>
              <span className="mx-2 text-blue-400">•</span>
              <span className="text-blue-700 font-medium">$5,000 Prize Pool</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Privacy-First{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Universal Ticketing
              </span>
              {" "}Platform
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              The world's first compliant, privacy-preserving ticketing platform with seamless{" "}
              <span className="font-semibold text-blue-600">JETH-to-MJPY</span> payments via Uniswap v3 integration
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <MizuConnectButton />
              <button className="flex items-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                View Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">6.5ms</div>
                <div className="text-sm text-gray-600 font-medium">Proof Generation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">&lt;3%</div>
                <div className="text-sm text-gray-600 font-medium">Platform Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">30s</div>
                <div className="text-sm text-gray-600 font-medium">Ticket Purchase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">100%</div>
                <div className="text-sm text-gray-600 font-medium">Privacy Protected</div>
              </div>
            </div>

            {/* Architecture Preview */}
            <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <img
                src="/mizuPass.svg"
                alt="MizuPass Architecture"
                className="w-full h-auto max-h-96 object-contain opacity-90"
              />
            </div>
          </section>

          {/* Core Innovations */}
          <section id="innovations" className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Core Innovations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionary solutions that bridge regulatory compliance with user privacy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Universal KYC System */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Universal KYC System</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  First platform supporting both Japanese Mizuhiki ID and international ZK Passport verification
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-600">Japanese: My Number Card → Mizuhiki ID</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-600">International: Passport → ZK Proof</span>
                  </div>
                </div>
              </div>

              {/* Offline-First Architecture */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Offline-First Architecture</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Cryptographic verification works without internet dependency using WASM circuits
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-gray-600">6.5ms witness generation</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-gray-600">Mobile-optimized WASM binary</span>
                  </div>
                </div>
              </div>

              {/* Privacy-Preserving Payments */}
              <div className="group bg-gradient-to-br from-teal-50 to-cyan-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-teal-100">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Privacy-Preserving Payments</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Stealth addresses and ZK proofs ensure complete transaction privacy
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-gray-600">Unique stealth addresses</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-gray-600">Zero transaction correlation</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Performance */}
          <section id="performance" className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Technical Performance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Production-ready metrics that exceed industry standards
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-16">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Component</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Target</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actual</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { component: "ZK Circuit Witness Gen", target: "<10ms", actual: "6.5ms", status: "✅ Exceeded", color: "text-green-600" },
                      { component: "ZK Circuit Proof Gen", target: "<500ms", actual: "<300ms", status: "✅ Exceeded", color: "text-green-600" },
                      { component: "Backend API Response", target: "<200ms", actual: "<150ms", status: "✅ Exceeded", color: "text-green-600" },
                      { component: "Frontend Page Load", target: "<2s", actual: "<1.5s", status: "✅ Exceeded", color: "text-green-600" },
                      { component: "QR Code Size", target: "<1000 chars", actual: "~800 chars", status: "✅ Exceeded", color: "text-green-600" },
                      { component: "Offline Verification", target: "<100ms", actual: "<50ms", status: "✅ Exceeded", color: "text-green-600" }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{row.component}</td>
                        <td className="py-4 px-6 text-gray-600">{row.target}</td>
                        <td className="py-4 px-6 font-semibold text-blue-600">{row.actual}</td>
                        <td className={`py-4 px-6 font-medium ${row.color}`}>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Competitive Advantages */}
          <section id="advantages" className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Competitive Advantages
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionary advantages over traditional and crypto ticketing platforms
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* vs Traditional Platforms */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">vs Traditional Platforms</h3>
                <div className="space-y-4">
                  {[
                    { feature: "Total Fees", traditional: "15-30%", mizupass: "<3%", advantage: true },
                    { feature: "Privacy", traditional: "❌ None", mizupass: "✅ Full ZK Privacy", advantage: true },
                    { feature: "Resale Control", traditional: "❌ Limited", mizupass: "✅ Smart Contract Enforced", advantage: true },
                    { feature: "International UX", traditional: "❌ Poor", mizupass: "✅ Universal KYC", advantage: true },
                    { feature: "Offline Capable", traditional: "❌ No", mizupass: "✅ Yes", advantage: true }
                  ].map((row, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{row.feature}</span>
                      <div className="flex gap-4">
                        <span className="text-red-600">{row.traditional}</span>
                        <span className="font-semibold text-green-600">{row.mizupass}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* vs Crypto Ticketing */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">vs Crypto Ticketing</h3>
                <div className="space-y-4">
                  {[
                    { feature: "Regulatory Compliance", crypto: "❌ No", mizupass: "✅ Full JSC Compliance", advantage: true },
                    { feature: "Privacy Features", crypto: "❌ None", mizupass: "✅ Stealth + ZK Proofs", advantage: true },
                    { feature: "Payment Options", crypto: "❌ Limited", mizupass: "✅ Multi-asset via DEX", advantage: true },
                    { feature: "KYC System", crypto: "❌ Basic", mizupass: "✅ Dual Japanese/International", advantage: true },
                    { feature: "Offline Verification", crypto: "❌ No", mizupass: "✅ Full WASM Support", advantage: true }
                  ].map((row, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{row.feature}</span>
                      <div className="flex gap-4">
                        <span className="text-red-600">{row.crypto}</span>
                        <span className="font-semibold text-green-600">{row.mizupass}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Target Markets */}
          <section id="markets" className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Target Markets
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real-world applications across diverse event categories
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Tokyo 2025+ Events",
                  icon: <Star className="w-8 h-8" />,
                  items: ["Olympics Residual Events", "Cultural Festivals", "Corporate Conferences"],
                  gradient: "from-yellow-400 to-orange-500"
                },
                {
                  title: "Entertainment Industry",
                  icon: <Heart className="w-8 h-8" />,
                  items: ["J-Pop Concerts", "Anime Conventions", "Gaming Tournaments"],
                  gradient: "from-pink-400 to-red-500"
                },
                {
                  title: "Business & Professional",
                  icon: <TrendingUp className="w-8 h-8" />,
                  items: ["Fintech Conferences", "Art Exhibitions", "Educational Workshops"],
                  gradient: "from-blue-400 to-purple-500"
                }
              ].map((market, index) => (
                <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${market.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {market.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{market.title}</h3>
                  <ul className="space-y-2">
                    {market.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Revolutionize Event Ticketing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join the privacy-first, compliant ticketing platform that's making decentralized event access a reality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MizuConnectButton />
              <button className="flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Eye className="w-5 h-5 mr-2" />
                View Documentation
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}