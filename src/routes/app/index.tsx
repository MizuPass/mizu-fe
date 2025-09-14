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

  return (
    <div className="min-h-screen w-full">
      {/* Desktop: Full background */}
      <div 
        className="hidden lg:flex lg:fixed lg:inset-0 lg:w-screen lg:h-screen lg:z-0"
        style={{
          backgroundImage: 'url("/frame-background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Mobile Frame */}
      <div 
        className="flex sm:hidden w-full h-[200px]"
        style={{
          backgroundImage: 'url("/frame-mobile-fix.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Tablet Frame */}
      <div 
        className="hidden sm:flex md:hidden w-full h-[200px]"
        style={{
          backgroundImage: 'url("/frame-ipad.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* iPad Frame */}
      <div 
        className="hidden md:flex lg:flex xl:hidden w-full h-[200px] md:h-[200px]"
        style={{
          backgroundImage: 'url("/frame-ipad.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content container with onboarding */}
      <div className="relative z-10 min-h-screen overflow-auto lg:h-screen lg:overflow-hidden py-8 lg:flex lg:items-center lg:justify-center lg:py-16">
        <Onboarding onStartExploring={handleStartExploring} />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/app/')({
  component: AppIndexPage,
})