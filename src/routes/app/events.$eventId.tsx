import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { EventDetail } from '../../components/EventDetail'
import { useEventDetails, transformEventForComponent } from '../../hooks/useEventsApi'
import { formatEventPrice, formatEventDateTime } from '../../services/eventsApi'

function AppEventDetailPage() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const { eventId } = Route.useParams()
  
  // Fetch event details from API
  const { data: apiEventData, isLoading, isError, error } = useEventDetails(
    eventId !== undefined ? parseInt(eventId) : undefined
  )
  
  // Redirect to landing page if user is not connected
  useEffect(() => {
    if (!isConnected) {
      navigate({ to: '/' })
    }
  }, [isConnected, navigate])
  
  // Don't render content if user is not connected
  if (!isConnected) {
    return null
  }

  // Redirect to events list if event not found or API error
  useEffect(() => {
    if (isError && eventId) {
      console.log('Event not found for ID:', eventId, error?.message)
      navigate({ to: '/app/events' })
    }
  }, [isError, error, eventId, navigate])
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col justify-center min-h-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !apiEventData) {
    return (
      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col justify-center min-h-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <img src="/mizuIcons/mizu-attention.svg" alt="Error" className="w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-600">Event not found</p>
          <button
            onClick={() => navigate({ to: '/app/events' })}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  // Transform API data to component format
  const transformedEvent = transformEventForComponent(apiEventData)
  
  // Calculate status based on API data
  const soldOut = Number(apiEventData.ticketsSold) >= Number(apiEventData.maxTickets)
  const eventDate = new Date(Number(apiEventData.eventDate) * 1000)
  const isUpcoming = eventDate > new Date()
  
  const status = soldOut ? 'sold-out' : (isUpcoming ? 'available' : 'upcoming') as 'sold-out' | 'available' | 'upcoming'
  
  const event = {
    ...transformedEvent,
    status,
    participants: Number(apiEventData.ticketsSold),
    eventImage: apiEventData.eventImageUrl || '/mizuPass.svg',
    mizuIcon: '/mizuIcons/mizu-www.svg',
    price: formatEventPrice(apiEventData.ticketPrice),
    date: formatEventDateTime(apiEventData.eventDate),
    bgColor: 'white',
    // Add purchase flow data
    eventContract: apiEventData.eventContract,
    ticketPrice: apiEventData.ticketPrice,
  }

  const handleBack = () => {
    navigate({ to: '/app/events' })
  }

  return (
    <EventDetail event={event} onBack={handleBack} />
  )
}

export const Route = createFileRoute('/app/events/$eventId')({
  component: AppEventDetailPage,
})