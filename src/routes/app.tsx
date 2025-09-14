import { createFileRoute, Outlet } from '@tanstack/react-router'

// This is now a layout route that renders child routes
function AppLayoutPage() {
  return <Outlet />
}

export const Route = createFileRoute('/app')({
  component: AppLayoutPage,
})