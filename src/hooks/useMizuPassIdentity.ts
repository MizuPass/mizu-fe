import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { MIZUPASS_IDENTITY_ADDRESS, MIZUPASS_IDENTITY_ABI, UserRole, type UserRoleType } from '../config/contracts'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

// API Base URL
const API_BASE_URL = 'https://services.mizupass.com/api/identity'

export const useMizuPassIdentity = () => {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()

  // Mixed blockchain and API call functions
  // Blockchain: Registration, roles, user status
  // API: Verification status (ZK Passport, Mizuhiki SBT)
  const useIsUserRegistered = (userAddress?: Address) => {
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'isUserRegistered',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })
  }

  const useGetUserRole = (userAddress?: Address) => {
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'getUserRole',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })
  }

  const useIsVerifiedUser = (userAddress?: Address) => {
    return useQuery({
      queryKey: ['isVerified', userAddress],
      queryFn: async () => {
        if (!userAddress) return false
        const response = await fetch(`${API_BASE_URL}/isVerified/${userAddress}`)
        if (!response.ok) throw new Error('Failed to check verification status')
        const data = await response.json()
        // Response format: { "userAddress": "0x...", "isVerified": false }
        return data.isVerified
      },
      enabled: !!userAddress,
      staleTime: 30000,
    })
  }

  const useIsEventCreator = (userAddress?: Address) => {
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'isEventCreator',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })
  }

  const useIsRegularUser = (userAddress?: Address) => {
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'isRegularUser',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })
  }

  const useIsZKPassportVerified = (userAddress?: Address) => {
    return useQuery({
      queryKey: ['isZKPassportVerified', userAddress],
      queryFn: async () => {
        if (!userAddress) return false
        const response = await fetch(`${API_BASE_URL}/isZKPassportVerified/${userAddress}`)
        if (!response.ok) throw new Error('Failed to check ZK passport verification')
        const data = await response.json()
        // Response format: { "userAddress": "0x...", "isZKPassportVerified": false }
        return data.isZKPassportVerified
      },
      enabled: !!userAddress,
      staleTime: 30000,
    })
  }

  const useVerifyMizuhikiSBT = (userAddress?: Address) => {
    return useQuery({
      queryKey: ['verifyMizuhikiSBT', userAddress],
      queryFn: async () => {
        if (!userAddress) return false
        const response = await fetch(`${API_BASE_URL}/verifyMizuhikiSBT/${userAddress}`)
        if (!response.ok) throw new Error('Failed to verify Mizuhiki SBT')
        const data = await response.json()
        // Response format: { "userAddress": "0x...", "mizuhikiSBTVerified": true }
        return data.mizuhikiSBTVerified
      },
      enabled: !!userAddress,
      staleTime: 30000,
    })
  }

  const useGetUniqueIdentifier = (userAddress?: Address) => {
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'getUniqueIdentifier',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })
  }

  // Write contract functions
  const registerUserRole = async (role: UserRoleType) => {
    return writeContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'registerUserRole',
      args: [role]
    })
  }

  const registerZKPassportUser = async (uniqueIdentifier: `0x${string}`) => {
    return writeContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'registerZKPassportUser',
      args: [uniqueIdentifier]
    })
  }

  // Current user data (using connected wallet address)
  const currentUserRegistered = useIsUserRegistered(address)
  const currentUserRole = useGetUserRole(address)
  const currentUserVerified = useIsVerifiedUser(address)
  const currentUserIsEventCreator = useIsEventCreator(address)
  const currentUserIsRegular = useIsRegularUser(address)
  const currentUserZKVerified = useIsZKPassportVerified(address)
  const currentUserSBTVerified = useVerifyMizuhikiSBT(address)
  const currentUserUniqueId = useGetUniqueIdentifier(address)

  // Debug logging for API calls
  console.log('MizuPass Identity API Debug:', {
    address,
    isRegistered: currentUserRegistered.data,
    isVerified: currentUserVerified.data,
    isZKVerified: currentUserZKVerified.data,
    isSBTVerified: currentUserSBTVerified.data,
    loading: {
      registered: currentUserRegistered.isLoading,
      verified: currentUserVerified.isLoading,
      zkVerified: currentUserZKVerified.isLoading,
      sbtVerified: currentUserSBTVerified.isLoading,
    },
    errors: {
      registered: currentUserRegistered.error,
      verified: currentUserVerified.error,
      zkVerified: currentUserZKVerified.error,
      sbtVerified: currentUserSBTVerified.error,
    }
  })

  return {
    // Contract interaction functions
    registerUserRole,
    registerZKPassportUser,
    
    // Read functions for any user
    useIsUserRegistered,
    useGetUserRole,
    useIsVerifiedUser,
    useIsEventCreator,
    useIsRegularUser,
    useIsZKPassportVerified,
    useVerifyMizuhikiSBT,
    useGetUniqueIdentifier,
    
    // Current user data
    currentUser: {
      address,
      isRegistered: currentUserRegistered.data ?? false,
      role: currentUserRole.data,
      // A user is verified if they have EITHER ZK passport OR Mizuhiki SBT verification
      isVerified: (currentUserZKVerified.data || currentUserSBTVerified.data) ?? false,
      isEventCreator: currentUserIsEventCreator.data ?? false,
      isRegular: currentUserIsRegular.data ?? false,
      isZKVerified: currentUserZKVerified.data ?? false,
      isSBTVerified: currentUserSBTVerified.data ?? false,
      uniqueIdentifier: currentUserUniqueId.data,
      loading: currentUserRegistered.isLoading ||
               currentUserRole.isLoading ||
               currentUserZKVerified.isLoading ||
               currentUserSBTVerified.isLoading,
      // API call errors for debugging
      errors: {
        registered: currentUserRegistered.error?.message,
        verified: currentUserVerified.error?.message,
        zkVerified: currentUserZKVerified.error?.message,
        sbtVerified: currentUserSBTVerified.error?.message,
      }
    },
    
    // Contract constants
    contractAddress: MIZUPASS_IDENTITY_ADDRESS,
    UserRole
  }
}

export default useMizuPassIdentity