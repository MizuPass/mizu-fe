import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { StickyHeader } from '../components/StickyHeader'

const RootLayout = () => (
  <div className="min-h-screen overflow-x-hidden">
    <StickyHeader />

    <main className="relative">
      <Outlet />
    </main>

    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })