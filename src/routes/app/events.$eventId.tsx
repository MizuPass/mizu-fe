import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { EventDetail } from '../../components/EventDetail'
import { mockEvents } from '../../constants/mockEvents'

function AppEventDetailPage() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const { eventId } = Route.useParams()
  
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

  // Find the event by ID
  const event = mockEvents.find(e => e.id.toString() === eventId)
  
  // Redirect to events list if event not found (with useEffect to avoid immediate navigation)
  useEffect(() => {
    if (!event && eventId) {
      console.log('Event not found for ID:', eventId)
      navigate({ to: '/app/events' })
    }
  }, [event, eventId, navigate])
  
  if (!event) {
    return <div>Loading...</div>
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