import React from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { JPYM_TOKEN_ADDRESS, ERC20_ABI } from '../config/contracts'
import { useQueryClient } from '@tanstack/react-query'

export const useJPYMAirdrop = () => {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const queryClient = useQueryClient()
  
  const [localClaimedStatus, setLocalClaimedStatus] = React.useState<boolean | null>(null)
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: hasClaimedAirdrop, isLoading: isLoadingClaimStatus, error: claimStatusError } = useReadContract({
    address: JPYM_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'hasClaimedAirdrop',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  })

  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: JPYM_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  })

  React.useEffect(() => {
    if (isConfirmed && address) {
      // Immediately set local state to show claimed status
      setLocalClaimedStatus(true)
      
      // Also invalidate queries to refetch from blockchain
      queryClient.invalidateQueries({
        queryKey: ['readContract', JPYM_TOKEN_ADDRESS, 'hasClaimedAirdrop', address],
      })
      queryClient.invalidateQueries({
        queryKey: ['readContract', JPYM_TOKEN_ADDRESS, 'balanceOf', address],
      })
      console.log('JPYM airdrop transaction confirmed! Refetching data...')
    }
  }, [isConfirmed, address, queryClient])

  const claimAirdrop = async () => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    // Use final claimed status for the check
    const currentClaimedStatus = localClaimedStatus !== null ? localClaimedStatus : (hasClaimedAirdrop || false)
    if (currentClaimedStatus) {
      throw new Error('You have already claimed the airdrop')
    }

    try {
      console.log('Claiming JPYM airdrop for address:', address)
      
      return writeContract({
        address: JPYM_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'airdrop',
        args: []
      })
    } catch (error) {
      console.error('JPYM airdrop claim failed:', error)
      throw error
    }
  }

  const claimCustomAirdrop = async (amount: bigint) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    const currentClaimedStatus = localClaimedStatus !== null ? localClaimedStatus : (hasClaimedAirdrop || false)
    if (currentClaimedStatus) {
      throw new Error('You have already claimed the airdrop')
    }

    try {
      console.log('Claiming custom JPYM airdrop for address:', address, 'amount:', amount.toString())
      
      return writeContract({
        address: JPYM_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'airdropCustom',
        args: [amount]
      })
    } catch (error) {
      console.error('Custom JPYM airdrop claim failed:', error)
      throw error
    }
  }

  const finalClaimedStatus = localClaimedStatus !== null ? localClaimedStatus : (hasClaimedAirdrop || false)

  return {
    hasClaimedAirdrop: finalClaimedStatus,
    balance: balance || 0n,
    isLoadingClaimStatus,
    isLoadingBalance,
    claimStatusError,
    
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    
    // Functions
    claimAirdrop,
    claimCustomAirdrop,
    
    // Computed states
    isLoading: isLoadingClaimStatus || isLoadingBalance,
    canClaim: !finalClaimedStatus && !isPending && !isConfirming,
  }
}
