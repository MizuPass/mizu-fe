import { MapPin, Clock, Users, Star } from 'lucide-react'
import type { Event } from '../constants/mockEvents'
import { useState } from 'react'
import { TicketPurchaseFlow } from './TicketPurchase/TicketPurchaseFlow'

// Extended Event type with purchase flow properties
interface ExtendedEvent extends Event {
  eventContract?: string
  ticketPrice?: string | number
}

interface EventDetailProps {
  event: ExtendedEvent
  onBack: () => void
}

export function EventDetail({ event, onBack }: EventDetailProps) {
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)

  // Handle join event button click - opens purchase flow or shows error
  const handleJoinEvent = () => {
    if (event.status === 'sold-out') return
    setShowPurchaseFlow(true)
  }

  // Handle purchase flow close
  const handleClosePurchaseFlow = () => {
    setShowPurchaseFlow(false)
  }
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available Now'
      case 'sold-out': return 'Sold Out'
      case 'upcoming': return 'Coming Soon'
      default: return 'Unknown'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 w-full flex flex-col justify-center min-h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
        >
          <img src="/mizuIcons/mizu-attention.svg" alt="Back" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Back to Events</span>
        </button>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className={`w-2 h-2 rounded-full ${event.status === 'available' ? 'bg-green-500 animate-pulse' : event.status === 'sold-out' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">{getStatusText(event.status)}</span>
        </div>
      </div>

      {/* Main Event Card - Side by Side Layout */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Event Image */}
          <div className="lg:w-1/2">
            <div className="relative h-fit">
              <img 
                src={event.eventImage}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/mizuPass.svg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={event.mizuIcon} 
                    alt={event.category} 
                    className="w-10 h-10 animate-bounce" 
                  />
                  <div>
                    <h1 className="text-xl font-bold text-white">{event.title}</h1>
                    <span className="text-sm font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Event Details */}
          <div className="lg:w-1/2 p-6">
            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {event.price}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">4.8 rating</span>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium text-gray-900">{event.participants}/{event.maxParticipants} joined</p>
                </div>
              </div>
            </div>

            {/* Participation Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Event Capacity</span>
                <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                  {Math.round((event.participants / event.maxParticipants) * 100)}% full
                </span>
              </div>
              <div className="bg-gray-300 rounded-full h-2">
                <div 
                  className="rounded-full h-2 transition-all duration-300"
                  style={{ 
                    width: `${(event.participants / event.maxParticipants) * 100}%`,
                    backgroundColor: 'var(--primary)'
                  }}
                ></div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <button
            onClick={handleJoinEvent}
            disabled={event.status === 'sold-out' || hasPurchased}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg transition-all duration-200 ${
              hasPurchased
                ? 'bg-green-600 text-white cursor-default'
                : event.status === 'sold-out'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'text-white hover:scale-105 shadow-lg'
            }`}
            style={{
              backgroundColor: hasPurchased ? '#16a34a' : event.status === 'sold-out' ? undefined : 'var(--primary)'
            }}
          >
            {hasPurchased ? (
              <>
                <img src="/mizuIcons/mizu-success.svg" alt="Purchased" className="w-5 h-5" />
                <div className="flex flex-col items-center">
                  <span>🎫 Ticket Purchased!</span>
                  <span className="text-sm font-normal">Welcome to {event.title}! 🎉</span>
                </div>
              </>
            ) : event.status === 'sold-out' ? (
              <>
                <img src="/mizuIcons/mizu-sad.svg" alt="Sold Out" className="w-5 h-5" />
                Sold Out
              </>
            ) : (
              <>
                <img src="/mizuIcons/mizu-love.svg" alt="Join" className="w-5 h-5" />
                {event.status === 'upcoming' ? 'Get Notified' : '🎫 Join Event'}
              </>
            )}
          </button>


        </div>

      {/* Success Message */}
      {hasPurchased && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-12 h-12" />
            <div>
              <p className="text-green-700">
                🎫 Your ticket has been purchased successfully! This transaction was completed with privacy protection using stealth addresses.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-100 rounded-xl">
            <p className="text-sm text-green-800">
              <strong>Next Steps:</strong> Your ticket is stored securely in your browser. Keep your wallet connected and check back closer to the event date for access instructions.
            </p>
          </div>
        </div>
      )}

      {/* Ticket Purchase Flow Modal */}
      {event.eventContract && (
        <TicketPurchaseFlow
          eventAddress={event.eventContract}
          eventName={event.title}
          ticketPrice={event.ticketPrice?.toString() || '0'}
          eventDate={event.date}
          gasAmount="0.001" // Default gas amount for ticket purchase
          isOpen={showPurchaseFlow}
          onClose={handleClosePurchaseFlow}
        />
      )}
    </div>
  )
}