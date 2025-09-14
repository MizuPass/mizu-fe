import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { EventList } from '../../../components/EventList'
import type { Event } from '../../../constants/mockEvents'

function AppEventsIndexPage() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  
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

  const handleEventClick = (event: Event) => {
    console.log('Navigating to event:', event.id)
    navigate({ to: '/app/events/$eventId', params: { eventId: event.id.toString() } })
  }

  const handleBackToOnboarding = () => {
    navigate({ to: '/app' })
  }

  return (
    <EventList onEventClick={handleEventClick} onBackToOnboarding={handleBackToOnboarding} />
  )
}

export const Route = createFileRoute('/app/events/')({
  component: AppEventsIndexPage,
})