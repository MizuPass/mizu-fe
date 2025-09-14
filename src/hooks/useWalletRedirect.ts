import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate, useLocation } from '@tanstack/react-router'

export const useWalletRedirect = () => {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const currentPath = location.pathname
    
    // If user connects wallet and is on landing page, redirect to /app
    if (isConnected && currentPath === '/') {
      navigate({ to: '/app' })
    }
    
    // If user disconnects wallet and is on /app, redirect back to landing page
    if (!isConnected && currentPath === '/app') {
      navigate({ to: '/' })
    }
  }, [isConnected, location.pathname, navigate])
  
  return { isConnected }
}