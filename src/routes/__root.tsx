import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { MizuConnectButton } from '../components/ConnectButton'
const RootLayout = () => (
  <div 
    className="min-h-screen overflow-x-hidden"
  >
    <header className="relative z-50 flex justify-between w-full items-center py-4 max-w-6xl mx-auto px-6 ">

      <Link to="/" className="flex items-center ">
        <img 
          src="/logoMizu.png" 
          alt="MizuPass Logo" 
          className="w-15 h-15 sm:w-20 sm:h-20 object-contain"
        />
        <img 
          src="/logoText.png" 
          alt="MizuPass" 
          className="h-6 sm:h-8 object-contain"
        />
      </Link>

      <div className="flex items-center gap-12">
        <a href="#features" className="text-gray-600 hover:text-gray-900 font-bold transition-colors duration-200">
          Features
        </a>
        <a href="#privacy" className="text-gray-600 hover:text-gray-900 font-bold transition-colors duration-200">
          Privacy
        </a>
        <a href="#docs" className="text-gray-600 hover:text-gray-900 font-bold transition-colors duration-200">
          Docs
        </a>
      </div>

      <MizuConnectButton />
    </header>

    <main className="relative">
      <Outlet />
    </main>
    
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })