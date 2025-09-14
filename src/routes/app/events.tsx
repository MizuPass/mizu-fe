import { createFileRoute, Outlet } from '@tanstack/react-router'

// This is now a layout route that renders child routes
function AppEventsLayoutPage() {
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

      {/* Content container that renders child routes */}
      <div className="relative z-10 min-h-screen overflow-auto lg:h-screen lg:overflow-hidden py-8 lg:flex lg:items-center lg:justify-center lg:py-16">
        <div className="w-full h-full lg:max-w-6xl lg:mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/app/events')({
  component: AppEventsLayoutPage,
})