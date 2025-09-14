import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { StickyHeader } from '../components/StickyHeader'
import { useWalletRedirect } from '../hooks/useWalletRedirect'

const RootLayout = () => {
  useWalletRedirect()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      {isLandingPage && <StickyHeader />}

      <main className="relative">
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })