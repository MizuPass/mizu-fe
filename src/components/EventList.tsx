import { MapPin, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useActiveEvents, transformEventForComponent } from '../hooks/useEventsApi'
import { formatEventPrice, formatEventDateTime } from '../services/eventsApi'
import type { Event } from '../constants/mockEvents'

interface EventListProps {
  onEventClick: (event: Event) => void
  onBackToOnboarding: () => void
}

export function EventList({ onEventClick, onBackToOnboarding }: EventListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Fetch active events from API
  const { data: apiEvents, isLoading, isError, error } = useActiveEvents()
  
  // Transform API data to component format with status calculation
  const events = apiEvents ? apiEvents.map(event => {
    const transformedEvent = transformEventForComponent(event)
    // Calculate status based on API data
    const soldOut = Number(event.ticketsSold) >= Number(event.maxTickets)
    const eventDate = new Date(Number(event.eventDate) * 1000)
    const isUpcoming = eventDate > new Date()
    
    const status = soldOut ? 'sold-out' : (isUpcoming ? 'available' : 'upcoming') as 'sold-out' | 'available' | 'upcoming'
    
    return {
      ...transformedEvent,
      status,
      participants: Number(event.ticketsSold),
      eventImage: event.eventImageUrl || '/mizuPass.svg',
      mizuIcon: '/mizuIcons/mizu-www.svg', // Default icon
      price: formatEventPrice(event.ticketPrice),
      date: formatEventDateTime(event.eventDate),
      bgColor: 'white', // Default background color
    }
  }) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'sold-out': return 'bg-red-500'
      case 'upcoming': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available'
      case 'sold-out': return 'Sold Out'
      case 'upcoming': return 'Upcoming'
      default: return 'Unknown'
    }
  }

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
  }, [events.length])

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 w-full h-full flex flex-col justify-center">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-16 h-16 mx-auto mb-3 animate-spin" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-6 w-full h-full flex flex-col justify-center">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <img src="/mizuIcons/mizu-attention.svg" alt="Error" className="w-16 h-16 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Failed to load events</p>
            <p className="text-gray-500 text-sm">{error?.message || 'Please try again later'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 w-full h-full flex flex-col justify-center">
      {/* Header - Desktop */}
      <div className="hidden lg:flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToOnboarding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            <img src="/mizuIcons/mizu-attention.svg" alt="Back" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <img src="/mizuIcons/mizu-www.svg" alt="Events" className="w-7 h-7" />
              Available Events
            </h1>
            <p className="text-gray-600 text-sm">Discover amazing events with privacy-first ticketing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <img src="/mizuIcons/mizu-success.svg" alt="Live" className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">{events.length} Events Live</span>
        </div>
      </div>

      {/* Header - Mobile */}
      <div className="lg:hidden mb-6 flex-shrink-0 space-y-4">
        {/* Top Row - Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToOnboarding}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            <img src="/mizuIcons/mizu-attention.svg" alt="Back" className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Back</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg">
            <img src="/mizuIcons/mizu-success.svg" alt="Live" className="w-3 h-3 animate-pulse" />
            <span className="text-xs font-medium text-gray-700">{events.length} Live</span>
          </div>
        </div>
        
        {/* Bottom Row - Title */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-1">
            <img src="/mizuIcons/mizu-www.svg" alt="Events" className="w-6 h-6" />
            Available Events
          </h1>
          <p className="text-gray-600 text-xs">Discover amazing events with privacy-first ticketing</p>
        </div>
      </div>

      {/* Events Horizontal Scroll */}
      <div className="flex h-fit overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 h-fit scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="flex-shrink-0 w-72 bg-white h-fit rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden border-2 border-gray-100"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(event.status)} shadow-lg`}>
                  {getStatusText(event.status)}
                </span>
              </div>

              {/* Event Image */}
              <div className="mb-3 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={event.eventImage}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/mizuPass.svg' // Fallback image
                  }}
                />
              </div>

              {/* Event Header */}
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={event.mizuIcon} 
                  alt={event.category} 
                  className="w-6 h-6 animate-bounce" 
                />
                <div className="flex-1">
                  <h3 className="text-base font-bold leading-tight text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {event.price}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-700 mb-3 leading-relaxed line-clamp-2">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="text-xs">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="text-xs">{event.date}</span>
                </div>
                <div className="flex items-center" style={{ color: 'var(--primary)' }}>
                  <Users className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="text-xs font-medium">{event.participants}/{event.maxParticipants} joined</span>
                </div>
              </div>

              {/* Participation Progress */}
              <div className="mb-3">
                <div className="bg-gray-200 rounded-full h-1.5 mb-1">
                  <div 
                    className="rounded-full h-1.5 transition-all duration-300"
                    style={{ 
                      width: `${(event.participants / event.maxParticipants) * 100}%`,
                      backgroundColor: 'var(--primary)'
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((event.participants / event.maxParticipants) * 100)}% full
                </p>
              </div>

              {/* Action Button */}
              <button 
                className={`w-full font-bold py-2 rounded-lg transition-all duration-200 text-sm ${
                  event.status === 'sold-out'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'text-white hover:scale-105 shadow-lg'
                }`}
                style={{
                  backgroundColor: event.status === 'sold-out' ? undefined : 'var(--primary)'
                }}
                disabled={event.status === 'sold-out'}
              >
                {event.status === 'sold-out' ? 'Sold Out' : 
                 event.status === 'upcoming' ? 'Get Notified' : 
                 'View Details'}
              </button>
            </div>
          ))}

          {/* Add More Events Placeholder */}
          <div className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm rounded-2xl p-4 h-full shadow-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <img src="/mizuIcons/mizu-love.svg" alt="More Events" className="w-8 h-8 mx-auto mb-2 opacity-60" />
            <h3 className="text-sm font-bold text-gray-700 mb-1">More Events Coming!</h3>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              New exciting events are being added regularly. Stay tuned!
            </p>
            <button 
              className="px-3 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 text-xs"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Notify Me
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

