import { Outlet } from '@tanstack/react-router'
// import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}