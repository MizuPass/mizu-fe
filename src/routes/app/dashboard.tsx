import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { Dashboard } from '../../components/Dashboard'
import { useMizuPassIdentity } from '../../hooks/useMizuPassIdentity'
import { DebugBalance } from '../../components/DebugBalance'

function AppDashboardPage() {
  const { isConnected } = useAccount()
  const { currentUser, UserRole } = useMizuPassIdentity()
  const navigate = useNavigate()

  // Redirect to landing page if user is not connected
  useEffect(() => {
    if (!isConnected) {
      navigate({ to: '/' })
    }
  }, [isConnected, navigate])

  // Redirect to onboarding if user is not registered or not an event creator
  useEffect(() => {
    if (isConnected && !currentUser.loading) {
      if (!currentUser.isRegistered) {
        navigate({ to: '/app' })
      } else if (currentUser.role !== UserRole.EVENT_CREATOR) {
        navigate({ to: '/app' })
      }
    }
  }, [isConnected, currentUser.loading, currentUser.isRegistered, currentUser.role, navigate, UserRole.EVENT_CREATOR])

  // Don't render content if user is not connected, not registered, or not an event creator
  if (!isConnected || (!currentUser.loading && (!currentUser.isRegistered || currentUser.role !== UserRole.EVENT_CREATOR))) {
    return null
  }

  // Show loading state while checking access
  if (currentUser.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-16 h-16 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  const handleBackToOnboarding = () => {
    navigate({ to: '/app' })
  }

  return (
    <>
      <DebugBalance />
      <Dashboard onBackToOnboarding={handleBackToOnboarding} />
    </>
  )
}

export const Route = createFileRoute('/app/dashboard')({
  component: AppDashboardPage,
})