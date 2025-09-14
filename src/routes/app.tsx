import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useMizuPassIdentity } from '../hooks/useMizuPassIdentity'

function AppPage() {
  const { address, isConnected } = useAccount()
  const { currentUser, registerUserRole, UserRole } = useMizuPassIdentity()
  
  // Debug logging
  console.log('MizuPass Debug:', {
    address,
    currentUser,
    isVerified: currentUser.isVerified,
    loading: currentUser.loading
  })
  
  return (
    <div className="min-h-screen w-full">
      {/* Desktop: Full background */}
      <div 
        className="hidden lg:flex lg:fixed lg:inset-0 lg:w-screen lg:h-screen lg:z-0"
        style={{
          backgroundImage: 'url("/frame-background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />


      <div 
        id='mobile-frame'
        className="flex sm:hidden w-full h-[200px]"
        style={{
          backgroundImage: 'url("/frame-mobile-fix.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div 
        id='mobile-frame'
        className="hidden sm:flex md:hidden w-full h-[200px]"
        style={{
          backgroundImage: 'url("/frame-ipad.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Ipad: Top frame only */}
      <div 
        id='ipad-frame'
        className="hidden md:flex lg:flex xl:hidden w-full h-[200px] md:h-[200px]"
        style={{
          backgroundImage: 'url("/frame-ipad.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen overflow-auto lg:h-screen lg:overflow-hidden py-8 lg:flex lg:items-center lg:justify-center lg:py-16">
        <div className="max-w-4xl mx-auto px-6 w-full">
          {/* Main Content Cards */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            
            {/* Welcome & Wallet Card */}
            <div className="flex-1 rounded-2xl p-4 shadow-lg border-2 border-pink-200 hover:shadow-xl transition-shadow text-center"
                 style={{ backgroundColor: 'var(--body3)' }}>
              <div className="mb-3">
                <img 
                  src="/mizuIcons/mizu-cute.svg" 
                  alt="Cute Mizu" 
                  className="w-16 h-16 mx-auto animate-bounce mb-2"
                />
                <h1 className="text-2xl font-bold mb-2 text-white">
                  Welcome to MizuPass! 🎉
                </h1>
                <p className="text-sm text-pink-100 mb-3">
                  Your cute privacy-first ticketing companion!
                </p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="flex items-center justify-center mb-2">
                  <img src="/mizuIcons/mizu-key.svg" alt="Wallet" className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium text-white">Connected Wallet</span>
                </div>
                <p className="font-mono text-xs break-all text-pink-100">
                  {address}
                </p>
              </div>
            </div>

            {/* Identity Status Card */}
            <div className="flex-1 rounded-2xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow" 
                 style={{ background: 'var(--secondary)' }}>
              <div className="flex items-center justify-center mb-3">
                <img src="/mizuIcons/mizu-attention.svg" alt="Identity" className="w-10 h-10 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Identity Status</h3>
              </div>
              
              {currentUser.loading ? (
                <div className="flex items-center justify-center py-3">
                  <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-10 h-10 animate-pulse" />
                  <p className="text-gray-900 ml-2 text-sm">Checking...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                    <span className="text-gray-900 font-medium text-sm">Registered</span>
                    <div className="flex items-center">
                      {currentUser.isRegistered ? (
                        <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-5 h-5" />
                      ) : (
                        <img src="/mizuIcons/mizu-sad.svg" alt="Not yet" className="w-5 h-5" />
                      )}
                      <span className={`ml-1 font-bold text-xs ${currentUser.isRegistered ? 'text-green-600' : 'text-orange-500'}`}>
                        {currentUser.isRegistered ? 'Yes!' : 'Not yet'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                    <span className="text-gray-900 font-medium text-sm">Verified</span>
                    <div className="flex items-center">
                      {currentUser.isVerified ? (
                        <img src="/mizuIcons/mizu-love.svg" alt="Verified" className="w-5 h-5" />
                      ) : (
                        <img src="/mizuIcons/mizu-mendokusai.svg" alt="Pending" className="w-5 h-5" />
                      )}
                      <span className={`ml-1 font-bold text-xs ${currentUser.isVerified ? 'text-green-600' : 'text-orange-500'}`}>
                        {currentUser.isVerified ? 'Verified!' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {currentUser.role !== undefined && (
                    <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                      <span className="text-gray-900 font-medium text-sm">Role</span>
                      <div className="flex items-center">
                        <img src="/mizuIcons/mizu-okey.svg" alt="Role" className="w-5 h-5" />
                        <span className="ml-1 font-bold text-xs" style={{ color: 'var(--primary)' }}>
                          {currentUser.role === UserRole.EVENT_CREATOR ? '🎪 Creator' : '🎫 User'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Registration Section */}
          {!currentUser.isRegistered && !currentUser.loading && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
              <div className="mb-4">
                <img src="/mizuIcons/mizu-speakloud.svg" alt="Register" className="w-16 h-16 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get You Registered! 🚀</h2>
                <p className="text-gray-700 text-sm">Choose your adventure with MizuPass:</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => registerUserRole(UserRole.REGULAR_USER)}
                  className="flex-1 group relative overflow-hidden rounded-xl p-4 text-white font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <div className="flex flex-col items-center">
                    <img src="/mizuIcons/mizu-cute.svg" alt="User" className="w-12 h-12 mb-2" />
                    <span>🎫 Ticket Enthusiast</span>
                    <span className="text-xs font-normal mt-1 opacity-90">
                      Buy tickets & attend events!
                    </span>
                  </div>
                </button>
                
                <button 
                  onClick={() => registerUserRole(UserRole.EVENT_CREATOR)}
                  className="flex-1 group relative overflow-hidden rounded-xl p-4 text-gray-900 font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ background: 'var(--secondary)' }}
                >
                  <div className="flex flex-col items-center">
                    <img src="/mizuIcons/mizu-www.svg" alt="Creator" className="w-12 h-12 mb-2" />
                    <span>🎪 Event Creator</span>
                    <span className="text-xs font-normal mt-1 opacity-80">
                      Create & manage events!
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentUser.isRegistered && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
              <img src="/mizuIcons/mizu-love.svg" alt="Welcome" className="w-20 h-20 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Welcome to the MizuPass family! You can now enjoy privacy-first ticketing.
              </p>
              <button 
                className="px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Start Exploring Events! 🎫
              </button>
            </div>
          )}

          {/* Cute Footer - Only on Mobile/iPad */}
          <div className="lg:hidden mt-12 mb-8">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <img src="/mizuIcons/mizu-love.svg" alt="Love" className="w-8 h-8" />
                <img src="/mizuIcons/mizu-cute.svg" alt="Cute" className="w-10 h-10" />
                <img src="/mizuIcons/mizu-okey.svg" alt="OK" className="w-8 h-8" />
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-100 mx-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Thanks for using MizuPass! 💫
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Your privacy-first ticketing adventure starts here!
                </p>
                
                <div className="flex justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <img src="/mizuIcons/mizu-success.svg" alt="Secure" className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Secure</span>
                  </div>
                  <div className="text-center">
                    <img src="/mizuIcons/mizu-key.svg" alt="Private" className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Private</span>
                  </div>
                  <div className="text-center">
                    <img src="/mizuIcons/mizu-speakloud.svg" alt="Fun" className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Fun</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-medium text-white" 
                       style={{ backgroundColor: 'var(--primary)' }}>
                    <img src="/mizuIcons/mizu-www.svg" alt="Mizu" className="w-4 h-4 mr-2" />
                    Made with 💖 by MizuPass Team
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <img src="/mizuIcons/mizu-tired.svg" alt="Rest" className="w-12 h-12 opacity-50" />
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Scroll up to continue your journey! ↑
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/app')({
  component: AppPage,
  beforeLoad: async () => {
    // This will be handled by the useWalletRedirect hook in the root layout
    // The hook will redirect users who aren't connected
  }
})