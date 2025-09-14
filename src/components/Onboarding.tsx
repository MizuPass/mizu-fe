import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useMizuPassIdentity } from '../hooks/useMizuPassIdentity'
import { useZKPassportVerification } from '../hooks/useZKPassportVerification'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import QRCode from 'react-qr-code'
import { Spinner, LoadingState } from './ui/Spinner'
import { useENSSubdomain } from '../hooks/useENSSubdomain'

interface OnboardingProps {
  onStartExploring: () => void
  onGoToDashboard: () => void
}

export function Onboarding({ onStartExploring, onGoToDashboard }: OnboardingProps) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance, isError, isLoading } = useBalance({
    address,
    query: {
      enabled: !!address
    }
  })
  const { currentUser, registerUserRole, UserRole } = useMizuPassIdentity()
  const zkPassport = useZKPassportVerification()
  const ensSubdomain = useENSSubdomain()
  const [showBalance, setShowBalance] = useState(false)
  const [showZKModal, setShowZKModal] = useState(false)
  const [showMizuhikiModal, setShowMizuhikiModal] = useState(false)
  const [showENSSuccessModal, setShowENSSuccessModal] = useState(false)
  const [ensSubdomainInput, setEnsSubdomainInput] = useState('')

  // Debug balance data
  useEffect(() => {
    if (showBalance) {
      console.log('Balance Debug:', {
        address,
        balance,
        isLoading,
        isError,
        balanceValue: balance?.value?.toString(),
        balanceSymbol: balance?.symbol
      })
    }
  }, [showBalance, balance, isLoading, isError, address])

  // Show ENS success modal when claiming succeeds (briefly, then hide)
  useEffect(() => {
    if (ensSubdomain.claimSuccess && !ensSubdomain.hasClaimedENS) {
      setShowENSSuccessModal(true)

      // Auto-hide the modal after 3 seconds to show the seamless update
      const timer = setTimeout(() => {
        setShowENSSuccessModal(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [ensSubdomain.claimSuccess, ensSubdomain.hasClaimedENS])

  // Check if user has claimed ENS when they become verified
  useEffect(() => {
    const checkStoredENSStatus = async () => {
      if (currentUser.isVerified && ensSubdomain.claimedDomain && !ensSubdomain.isCheckingENS) {
        // If user has a stored claimed domain, verify it's still valid
        const subdomainName = ensSubdomain.claimedDomain.replace('.mizupass.eth', '')
        console.log(`Verifying stored ENS domain: ${subdomainName}`)

        try {
          const result = await ensSubdomain.checkENSSubdomain(subdomainName)
          if (result && result.exists && result.resolvedAddress?.toLowerCase() === address?.toLowerCase()) {
            console.log('Stored ENS domain is valid and belongs to current address')
          } else {
            console.log('Stored ENS domain mismatch or no longer exists')
            // Clear invalid stored data
            localStorage.removeItem('mizupass_ens_domain')
            localStorage.removeItem('mizupass_ens_claimed')
          }
        } catch (error) {
          console.error('Failed to verify stored ENS domain:', error)
        }
      }
    }

    // Only run if user is verified and has a stored claimed domain
    if (currentUser.isVerified && !currentUser.loading && ensSubdomain.claimedDomain) {
      checkStoredENSStatus()
    }
  }, [currentUser.isVerified, currentUser.loading, address, ensSubdomain.claimedDomain])
  
  return (
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-key.svg" alt="Wallet" className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium text-white">Connected Wallet</span>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-xs px-2 py-1 bg-red-400/60 hover:bg-red-400/80 text-white rounded-lg transition-colors duration-200"
                title="Disconnect Wallet"
              >
                Logout
              </button>
            </div>
            <p className="font-mono text-xs break-all text-pink-100 mb-2">
              {address}
            </p>

            {/* Balance Section */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
              >
                {showBalance ? 'Hide Balance' : 'Show Balance'}
              </button>
              {showBalance && (
                <div className="text-xs text-pink-100">
                  {isLoading ? (
                    <span className="opacity-75">Loading...</span>
                  ) : isError ? (
                    <span className="text-pink-200 opacity-75">Error fetching balance</span>
                  ) : balance && balance.value > 0n ? (
                    <span className="font-semibold">
                      {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                    </span>
                  ) : balance && balance.value === 0n ? (
                    <span className="opacity-75">0.0000 {balance.symbol}</span>
                  ) : (
                    <span className="opacity-75">No balance data</span>
                  )}
                </div>
              )}
            </div>
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
              
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium text-sm">Verified</span>
                  <div className="flex items-center">
                    {currentUser.isVerified ? (
                      <img src="/mizuIcons/mizu-love.svg" alt="Verified" className="w-5 h-5" />
                    ) : (
                      <img src="/mizuIcons/mizu-mendokusai.svg" alt="Pending" className="w-5 h-5" />
                    )}
                    <span className={`ml-1 font-bold text-xs ${currentUser.isVerified ? 'text-green-600' : 'text-red-500'}`}>
                      {currentUser.isVerified ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                </div>

                {/* Verification Methods Breakdown */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ZK Passport:</span>
                    <div className="flex items-center">
                      {currentUser.isZKVerified ? (
                        <>
                          <img src="/mizuIcons/mizu-success.svg" alt="Verified" className="w-3 h-3" />
                          <span className="ml-1 text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <img src="/mizuIcons/mizu-sad.svg" alt="Not verified" className="w-3 h-3" />
                          <span className="ml-1 text-gray-500">Not verified</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mizuhiki SBT:</span>
                    <div className="flex items-center">
                      {currentUser.isSBTVerified ? (
                        <>
                          <img src="/mizuIcons/mizu-success.svg" alt="Verified" className="w-3 h-3" />
                          <span className="ml-1 text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <img src="/mizuIcons/mizu-sad.svg" alt="Not verified" className="w-3 h-3" />
                          <span className="ml-1 text-gray-500">Not verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Action Buttons - Show only if not verified */}
                {!currentUser.isVerified && (
                  <div className="mt-3 pt-2 border-t border-white/30">
                    <p className="text-xs text-gray-600 mb-2 text-center">Choose your verification method:</p>
                    <div className="space-y-2">
                      {/* ZK Passport Verification Button */}
                      <button
                        onClick={() => {
                          setShowZKModal(true)
                          zkPassport.createVerificationRequest()
                        }}
                        className="w-full flex items-center justify-center px-3 py-2 text-white font-bold rounded-lg transition-all duration-200 text-xs hover:scale-105"
                        style={{ backgroundColor: 'var(--body1)' }}
                      >
                        <img src="/zkpassport-logo.png" alt="ZK Passport" className="w-6 h-4 mr-2 object-contain" />
                        Verify with ZK Passport (International)
                      </button>

                      {/* Mizuhiki ID Verification Button */}
                      <button
                        onClick={() => setShowMizuhikiModal(true)}
                        className="w-full flex items-center justify-center px-3 py-2 text-white font-bold rounded-lg transition-all duration-200 text-xs hover:scale-105"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <img src="/logo-mizuhiki-id.png" alt="Mizuhiki ID" className="w-4 h-4 mr-2" />
                        Verify with Mizuhiki ID (Japanese)
                      </button>
                    </div>
                  </div>
                )}

                {/* ENS Subdomain Claiming - Show only if verified */}
                {currentUser.isVerified && (
                  <div className="mt-3 pt-2 border-t border-white/30">
                    <div className="flex items-center justify-center mb-2">
                      <img src="/mizuIcons/mizu-love.svg" alt="ENS" className="w-4 h-4 mr-1" />
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        {ensSubdomain.hasClaimedENS ? 'Your ENS Domain' : 'Claim Your Free ENS Subdomain!'}
                      </p>
                    </div>



                    {ensSubdomain.hasClaimedENS || ensSubdomain.claimSuccess ? (
                      <div className="space-y-2">
                        <div className="p-3 bg-green-100/50 border border-green-200/50 rounded-lg text-center">
                          <div className="flex items-center justify-center mb-2">
                            <img src="/mizuIcons/mizu-love.svg" alt="Success" className="w-5 h-5 mr-1" />
                            <span className="text-sm font-bold text-green-700">
                              {ensSubdomain.claimSuccess && !ensSubdomain.hasClaimedENS ? 'Successfully Claimed!' : 'ENS Domain Owned!'}
                            </span>
                          </div>
                          <div className="mb-2">
                            <a
                              href={`https://sepolia.app.ens.domains/${ensSubdomain.claimedDomain || ensSubdomain.claimSuccess?.domain || `${ensSubdomainInput}.mizupass.eth`}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1 bg-white/80 rounded-full border border-green-200 hover:bg-white hover:border-green-300 transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src="https://app.ens.domains/favicon.ico"
                                  alt="ENS"
                                  className="w-4 h-4"
                                />
                                <span className="text-xs font-bold text-green-800">
                                  {ensSubdomain.claimedDomain || ensSubdomain.claimSuccess?.domain || `${ensSubdomainInput}.mizupass.eth`}
                                </span>
                                <svg
                                  className="w-3 h-3 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </div>
                            </a>
                          </div>
                          <p className="text-xs text-green-600">
                            🎉 {ensSubdomain.claimSuccess && !ensSubdomain.hasClaimedENS ?
                                'Congratulations! Your decentralized identity is ready!' :
                                'You already have your decentralized identity!'}
                          </p>
                          {ensSubdomain.claimSuccess?.transactionHash && (
                            <div className="mt-2">
                              <a
                                href={`https://etherscan.io/tx/${ensSubdomain.claimSuccess.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-center gap-1"
                              >
                                <img src="/mizuIcons/mizu-success.svg" alt="TX" className="w-3 h-3" />
                                View Transaction
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 overflow-hidden rounded-lg border border-white/40">
                          <input
                            type="text"
                            value={ensSubdomainInput}
                            onChange={(e) => setEnsSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                            placeholder="yourname"
                            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white/80 focus:outline-none focus:bg-white text-gray-800 placeholder-gray-500 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                            maxLength={20}
                          />
                          <span className="px-3 py-2 text-xs sm:text-sm bg-white/60 text-gray-700 font-medium text-center sm:text-left rounded-b-lg sm:rounded-b-none sm:rounded-r-lg border-t sm:border-t-0 sm:border-l border-white/40">
                            .mizupass.eth
                          </span>
                        </div>

                        <button
                          onClick={async () => {
                            if (ensSubdomainInput.trim() && address && !ensSubdomain.hasClaimedENS) {
                              // First check if subdomain already exists
                              const checkResult = await ensSubdomain.checkENSSubdomain(ensSubdomainInput)

                              if (checkResult && checkResult.exists) {
                                // Show error that subdomain is taken
                                return
                              }

                              // Proceed with claiming
                              await ensSubdomain.claimSubdomain(ensSubdomainInput, address)
                            }
                          }}
                          disabled={!ensSubdomainInput.trim() || ensSubdomain.isClaimingENS || ensSubdomain.isCheckingENS || ensSubdomain.hasClaimedENS}
                          className="w-full flex items-center justify-center px-3 py-2 text-white font-bold rounded-lg transition-all duration-200 text-xs hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          {ensSubdomain.isCheckingENS ? (
                            <>
                              <Spinner size="sm" className="mr-2 text-white" />
                              Checking availability...
                            </>
                          ) : ensSubdomain.isClaimingENS ? (
                            <>
                              <Spinner size="sm" className="mr-2 text-white" />
                              Claiming ENS...
                            </>
                          ) : (
                            <>
                              <img src="/mizuIcons/mizu-success.svg" alt="Claim" className="w-4 h-4 mr-2" />
                              Claim Free ENS Subdomain
                            </>
                          )}
                        </button>

                        {ensSubdomain.claimError && (
                          <div className="p-2 bg-red-100/50 border border-red-200/50 rounded-lg text-xs text-red-700 text-center">
                            <img src="/mizuIcons/mizu-sad.svg" alt="Error" className="w-4 h-4 mx-auto mb-1" />
                            {ensSubdomain.claimError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center mb-6">
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center mb-6">
          <img src="/mizuIcons/mizu-love.svg" alt="Welcome" className="w-20 h-20 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h2>
          <p className="text-gray-700 mb-4 text-sm">
            Welcome to the MizuPass family! You can now enjoy privacy-first ticketing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={onStartExploring}
              className="px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Start Exploring Events! 🎫
            </button>
            
            {/* Dashboard Button - Only for Event Creators */}
            {currentUser.role === UserRole.EVENT_CREATOR && (
              <button 
                onClick={onGoToDashboard}
                className="px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: 'var(--body1)' }}
              >
                Manage your event! 🎪
              </button>
            )}
          </div>
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

      {/* ZK Passport Verification Modal */}
      {showZKModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* QR Code Section with Background - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="relative">
                {/* Background Image */}
                <img
                  src="/zk-pass-qr.png"
                  alt="ZK Passport Verification"
                  className="w-full max-w-sm mx-auto object-contain"
                />

                {/* Overlay QR Code in the white space below ZKPassport logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mt-10 sm:mt-14 md:mt-18">
                    {zkPassport.queryUrl ? (
                      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
                        <QRCode
                          value={zkPassport.queryUrl}
                          size={256}
                          style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                        <div className="text-gray-600 text-center">
                          <Spinner size="sm" className="mx-auto mb-1" />
                          <p className="text-xs">Generating...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Message with Loading States */}
              {zkPassport.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  {zkPassport.isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <p className="text-sm text-blue-800">
                        {zkPassport.message}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800 text-center">
                      {zkPassport.message}
                    </p>
                  )}
                </div>
              )}

              {/* Specific Loading States */}
              {zkPassport.loadingStates.generatingProofs && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <LoadingState
                    message="Generating zero-knowledge proofs..."
                    spinnerSize="sm"
                  />
                </div>
              )}

              {zkPassport.loadingStates.backendVerifying && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <LoadingState
                    message="Verifying with MizuPass backend..."
                    spinnerSize="sm"
                  />
                </div>
              )}

              {zkPassport.loadingStates.contractPending && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <LoadingState
                    message="Please confirm in your wallet..."
                    spinnerSize="sm"
                  />
                </div>
              )}

              {zkPassport.loadingStates.contractConfirming && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                  <LoadingState
                    message="Confirming blockchain transaction..."
                    spinnerSize="sm"
                  />
                </div>
              )}

              {/* Combined Status Display */}
              {zkPassport.hasError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <img src="/mizuIcons/mizu-sad.svg" alt="Error" className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-red-800 font-medium">
                      {zkPassport.verified ? 'Verification Complete - Blockchain Error' : 'Blockchain Error'}
                    </p>
                    {zkPassport.verified && (
                      <p className="text-sm text-green-600 mb-2">
                        ✅ ZK Passport verification successful{zkPassport.firstName && `, welcome ${zkPassport.firstName}!`}
                      </p>
                    )}
                    <p className="text-sm text-red-600 mt-1">
                      ❌ {zkPassport.message || 'An error occurred during blockchain registration'}
                    </p>
                    {zkPassport.errorMessage && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-500 cursor-pointer hover:text-red-700">
                          Technical Details
                        </summary>
                        <p className="text-xs text-red-500 mt-1 font-mono break-all">
                          {zkPassport.errorMessage}
                        </p>
                      </details>
                    )}
                  </div>
                </div>
              ) : zkPassport.verified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <img src="/mizuIcons/mizu-love.svg" alt="Success" className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">Verification Successful!</p>
                    {zkPassport.firstName && (
                      <p className="text-sm text-green-600 mt-1">Welcome, {zkPassport.firstName}!</p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowZKModal(false)
                  zkPassport.resetVerification()
                }}
                disabled={zkPassport.isLoading && !!zkPassport.queryUrl} // Only disable if verification has started
                className={`w-full px-6 py-3 mt-4 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                  zkPassport.isLoading && !!zkPassport.queryUrl
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {zkPassport.isLoading && !!zkPassport.queryUrl ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Close'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mizuhiki ID Verification Modal */}
      {showMizuhikiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center">
              <img
                src="/mizuhiki-id-qr.png"
                alt="Mizuhiki ID QR Code"
                className="w-full max-w-md mx-auto object-contain mb-4"
              />

              <button
                onClick={() => setShowMizuhikiModal(false)}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors font-medium"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENS Success Modal */}
      {showENSSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden">
            <div className="relative">
              {/* Background Image */}
              <img
                src="/ens-image-success.png"
                alt="ENS Success"
                className="w-full object-contain"
              />

              {/* Domain Name inside the white card at bottom */}
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                <p className="font-bold text-lg text-center" style={{ color: '#53C3F1' }}>
                  {ensSubdomain.claimSuccess?.domain || `${ensSubdomainInput}.mizupass.eth`}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-4">
              <button
                onClick={() => {
                  setShowENSSuccessModal(false)
                  ensSubdomain.resetClaim()
                }}
                className="w-full px-6 py-3 text-white rounded-lg transition-colors font-medium hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}