import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Dashboard } from '../../components/Dashboard'

function AppDashboardPage() {
  const navigate = useNavigate()

  const handleBackToOnboarding = () => {
    navigate({ to: '/app' })
  }

  return <Dashboard onBackToOnboarding={handleBackToOnboarding} />
}

export const Route = createFileRoute('/app/dashboard')({
  component: AppDashboardPage,
})