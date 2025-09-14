import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { EventList } from '../../../components/EventList'
import type { Event } from '../../../constants/mockEvents'
import { useMizuPassIdentity } from '../../../hooks/useMizuPassIdentity'

function AppEventsIndexPage() {
  const { isConnected } = useAccount()
  const { currentUser } = useMizuPassIdentity()
  const navigate = useNavigate()
  
  // Redirect to landing page if user is not connected
  useEffect(() => {
    if (!isConnected) {
      navigate({ to: '/' })
    }
  }, [isConnected, navigate])

  // Redirect to onboarding if user is not registered
  useEffect(() => {
    if (isConnected && !currentUser.loading && !currentUser.isRegistered) {
      navigate({ to: '/app' })
    }
  }, [isConnected, currentUser.loading, currentUser.isRegistered, navigate])
  
  // Don't render content if user is not connected or not registered
  if (!isConnected || (!currentUser.loading && !currentUser.isRegistered)) {
    return null
  }

  // Show loading state while checking registration
  if (currentUser.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-16 h-16 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    )
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