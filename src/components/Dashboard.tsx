import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useEffect, useState, useRef } from 'react'
import { formatEther } from 'viem'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { mockEvents } from '../constants/mockEvents'

// Mock data for dashboard stats
const mockDashboardStats = {
  totalEvents: 3,
  activeEvents: 2,
  totalRevenue: '¥45,800',
  totalTicketsSold: 127,
  monthlyRevenue: '¥28,400',
  avgRating: 4.8
}

// Mock organizer events - use all events + duplicates to demonstrate scrolling
const organizerEvents = [...mockEvents, ...mockEvents.slice(0, 2)] // More events for scrolling demo

interface DashboardProps {
  onBackToOnboarding?: () => void
}

export function Dashboard({ onBackToOnboarding }: DashboardProps = {}) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance, isError, isLoading } = useBalance({
    address,
    query: {
      enabled: !!address
    }
  })
  const [showBalance, setShowBalance] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Debug balance data
  useEffect(() => {
    if (showBalance) {
      console.log('Dashboard Balance Debug:', {
        address,
        balance,
        isLoading,
        isError,
        balanceValue: balance?.value?.toString(),
        balanceSymbol: balance?.symbol
      })
    }
  }, [showBalance, balance, isLoading, isError, address])

  // Scroll functions for events slider
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Scroll by approximately one card width
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Scroll by approximately one card width
        behavior: 'smooth'
      })
    }
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Check scroll buttons on component mount and scroll
  const handleScroll = () => {
    checkScrollButtons()
  }

  useEffect(() => {
    // Initialize scroll button states
    checkScrollButtons()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 w-full">
      {/* Header with Back Button */}
      {onBackToOnboarding && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBackToOnboarding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            <img src="/mizuIcons/mizu-attention.svg" alt="Back" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Back to Onboarding</span>
          </button>
        </div>
      )}

      {/* Main Content Cards */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        
        {/* Welcome & Wallet Card - Left Side */}
        <div className="flex-1 rounded-2xl p-4 shadow-lg border-2 border-pink-200 hover:shadow-xl transition-shadow text-center"
             style={{ backgroundColor: 'var(--body3)' }}>
          <div className="mb-3">
            <img 
              src="/mizuIcons/mizu-www.svg" 
              alt="Dashboard" 
              className="w-16 h-16 mx-auto animate-bounce mb-2"
            />
            <h1 className="text-2xl font-bold mb-2 text-white">
              Welcome to Dashboard! 🎪
            </h1>
            <p className="text-sm text-pink-100 mb-3">
              Manage your events and track your success!
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

        {/* Event Status Card - Right Side */}
        <div className="flex-1 rounded-2xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow" 
             style={{ background: 'var(--secondary)' }}>
          <div className="flex items-center justify-center mb-3">
            <img src="/mizuIcons/mizu-success.svg" alt="Stats" className="w-10 h-10 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Event Statistics</h3>
          </div>
          
          <div className="space-y-2">
            {/* Total Events */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Total Events</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-www.svg" alt="Events" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm" style={{ color: 'var(--primary)' }}>
                  {mockDashboardStats.totalEvents}
                </span>
              </div>
            </div>

            {/* Active Events */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Active Events</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-success.svg" alt="Active" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm text-green-600">
                  {mockDashboardStats.activeEvents}
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Total Revenue</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-love.svg" alt="Revenue" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm" style={{ color: 'var(--primary)' }}>
                  {mockDashboardStats.totalRevenue}
                </span>
              </div>
            </div>

            {/* Tickets Sold */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Tickets Sold</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-okey.svg" alt="Tickets" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm text-blue-600">
                  {mockDashboardStats.totalTicketsSold}
                </span>
              </div>
            </div>

            {/* Average Rating */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Avg Rating</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-cute.svg" alt="Rating" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm text-yellow-600">
                  {mockDashboardStats.avgRating} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Events List Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Active Events 🎯</h2>
            <p className="text-gray-700 text-sm">
              Manage and monitor your live events
            </p>
          </div>
          <button 
            className="px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'var(--body1)' }}
          >
            Create New Event! ✨
          </button>
        </div>
        
        {/* Events Horizontal Scroll */}
        <div className="flex h-fit overflow-hidden mt-6">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 h-fit scrollbar-hide"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {organizerEvents.map((event, index) => (
              <div key={`${event.id}-${index}`} className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-4 text-left hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <img src={event.mizuIcon} alt={event.category} className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
                    <span className="text-xs text-gray-600">{event.category}</span>
                  </div>
                </div>
                
                <div className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  {event.price}
                </div>
                
                <div className="text-xs text-gray-600 mb-3">
                  {event.participants}/{event.maxParticipants} participants
                </div>
                
                <div className="bg-gray-200 rounded-full h-1.5 mb-3">
                  <div 
                    className="rounded-full h-1.5 transition-all duration-300"
                    style={{ 
                      width: `${(event.participants / event.maxParticipants) * 100}%`,
                      backgroundColor: 'var(--primary)'
                    }}
                  ></div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg text-white transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Edit Event
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200">
                    View Stats
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Events Placeholder */}
            <div className="flex-shrink-0 w-72 bg-gray-100/80 backdrop-blur-sm rounded-xl p-4 h-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
              <img src="/mizuIcons/mizu-love.svg" alt="More Events" className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-bold text-gray-700 mb-1">Create More Events!</h3>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Build your event portfolio and grow your audience.
              </p>
              <button 
                className="px-3 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 text-xs"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Arrow Navigation - Bottom Right */}
        <div className="flex justify-end mt-4">
          <div className="flex gap-2">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cute Footer - Only on Mobile/iPad */}
      <div className="lg:hidden mt-12 mb-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <img src="/mizuIcons/mizu-www.svg" alt="Manage" className="w-8 h-8" />
            <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-10 h-10" />
            <img src="/mizuIcons/mizu-speakloud.svg" alt="Events" className="w-8 h-8" />
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-100 mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Event Management Hub! 🎪
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Your centralized dashboard for managing all your events!
            </p>
            
            <div className="flex justify-center space-x-6 mb-4">
              <div className="text-center">
                <img src="/mizuIcons/mizu-success.svg" alt="Manage" className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Manage</span>
              </div>
              <div className="text-center">
                <img src="/mizuIcons/mizu-love.svg" alt="Revenue" className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="text-center">
                <img src="/mizuIcons/mizu-www.svg" alt="Create" className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Create</span>
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
            Scroll up to continue managing! ↑
          </p>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}