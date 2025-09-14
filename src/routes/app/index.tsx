import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { Onboarding } from '../../components/Onboarding'

function AppIndexPage() {
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

  const handleStartExploring = () => {
    navigate({ to: '/app/events' })
  }

  const handleGoToDashboard = () => {
    navigate({ to: '/app/dashboard' })
  }

  return (
    <Onboarding onStartExploring={handleStartExploring} onGoToDashboard={handleGoToDashboard} />
  )
}

export const Route = createFileRoute('/app/')({
  component: AppIndexPage,
})