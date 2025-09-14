import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { MIZUPASS_IDENTITY_ADDRESS, MIZUPASS_IDENTITY_ABI, UserRole, type UserRoleType } from '../config/contracts'
import type { Address } from 'viem'

export const useMizuPassIdentity = () => {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()

  // Read contract functions
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
    const result = useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'isVerifiedUser',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })

    console.log('useIsVerifiedUser detailed debug:', {
      userAddress,
      contractAddress: MIZUPASS_IDENTITY_ADDRESS,
      args: userAddress ? [userAddress] : undefined,
      enabled: !!userAddress,
      result: result.data,
      error: result.error,
      isLoading: result.isLoading,
      status: result.status,
      fetchStatus: result.fetchStatus
    })

    return result
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
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'isZKPassportVerified',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
    })
  }

  const useVerifyMizuhikiSBT = (userAddress?: Address) => {
    return useReadContract({
      address: MIZUPASS_IDENTITY_ADDRESS,
      abi: MIZUPASS_IDENTITY_ABI,
      functionName: 'verifyMizuhikiSBT',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress
      }
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

  // Debug logging
  console.log('Hook Debug - isVerifiedUser:', {
    address,
    data: currentUserVerified.data,
    isLoading: currentUserVerified.isLoading,
    error: currentUserVerified.error,
    status: currentUserVerified.status
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
      isVerified: currentUserVerified.data ?? false,
      isEventCreator: currentUserIsEventCreator.data ?? false,
      isRegular: currentUserIsRegular.data ?? false,
      isZKVerified: currentUserZKVerified.data ?? false,
      isSBTVerified: currentUserSBTVerified.data ?? false,
      uniqueIdentifier: currentUserUniqueId.data,
      loading: currentUserRegistered.isLoading || currentUserRole.isLoading || currentUserVerified.isLoading
    },
    
    // Contract constants
    contractAddress: MIZUPASS_IDENTITY_ADDRESS,
    UserRole
  }
}

export default useMizuPassIdentity