import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount, useSimulateContract } from 'wagmi'
import { MIZU_EVENT_REGISTRY_ADDRESS, MIZU_EVENT_REGISTRY_ABI, JPYM_TOKEN_ADDRESS, ERC20_ABI } from '../config/contracts'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { maxUint256 } from 'viem'

// Constants
export const UNLIMITED_ALLOWANCE = maxUint256 // Maximum possible uint256 value for unlimited spending

// Create Event Parameters interface
export interface CreateEventParams {
  ipfsHash: string          // Event metadata IPFS hash
  ticketIpfsHash: string    // Ticket metadata IPFS hash
  ticketPrice: bigint       // Price per ticket in wei
  maxTickets: bigint        // Maximum number of tickets
  eventDate: bigint         // Event date as unix timestamp
  eventName: string         // Event name for NFT collection
  eventSymbol: string       // Event symbol for NFT collection
}

export const useEventRegistry = () => {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState<'approval' | 'creation' | 'idle'>('idle')
  const [simulationParams, setSimulationParams] = useState<CreateEventParams | null>(null)

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  })

  // Get EVENT_CREATION_FEE_JPYM from contract
  const { data: creationFee } = useReadContract({
    address: MIZU_EVENT_REGISTRY_ADDRESS,
    abi: MIZU_EVENT_REGISTRY_ABI,
    functionName: 'EVENT_CREATION_FEE_JPYM',
  })

  // Check current JPYM allowance for Event Registry
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: JPYM_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, MIZU_EVENT_REGISTRY_ADDRESS] : undefined,
    query: {
      enabled: !!address
    }
  })


  // Simulate JPYM approval with unlimited allowance
  const { data: approvalSimulation, error: approvalSimulationError, isLoading: isSimulatingApproval } = useSimulateContract({
    address: JPYM_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [MIZU_EVENT_REGISTRY_ADDRESS, UNLIMITED_ALLOWANCE],
    query: {
      enabled: !!address && currentStep === 'approval'
    }
  })

  // Simulate createEvent
  const { data: createEventSimulation, error: createEventSimulationError, isLoading: isSimulatingCreate } = useSimulateContract({
    address: MIZU_EVENT_REGISTRY_ADDRESS,
    abi: MIZU_EVENT_REGISTRY_ABI,
    functionName: 'createEvent',
    args: simulationParams ? [
      simulationParams.ipfsHash,
      simulationParams.ticketIpfsHash,
      simulationParams.ticketPrice,
      simulationParams.maxTickets,
      simulationParams.eventDate,
      simulationParams.eventName,
      simulationParams.eventSymbol
    ] : undefined,
    query: {
      enabled: !!simulationParams && !!address && !!creationFee && !!currentAllowance && currentStep === 'creation',
      retry: 3,
      retryDelay: 1000
    }
  })


  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      if (currentStep === 'approval') {
        // Unlimited approval confirmed, refetch allowance
        refetchAllowance()
        setCurrentStep('idle')
        console.log('🎉 JPYM unlimited approval confirmed! No more approvals needed for future transactions.')
      } else if (currentStep === 'creation') {
        // Event creation confirmed
        queryClient.invalidateQueries({
          queryKey: ['eventRegistry'],
        })
        queryClient.invalidateQueries({
          queryKey: ['organizerEvents'],
        })
        queryClient.invalidateQueries({
          queryKey: ['allEvents'],
        })
        setCurrentStep('idle')
        console.log('Event creation confirmed! Refetching event data...')
      }
    }
  }, [isConfirmed, currentStep, queryClient, refetchAllowance])

  // Approve JPYM tokens for Event Registry with unlimited allowance
  const approveJPYM = async () => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('Starting JPYM unlimited approval...', UNLIMITED_ALLOWANCE.toString())
      setCurrentStep('approval')

      // Wait for simulation to run
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200))
        
        if (approvalSimulationError) {
          console.error('Approval simulation failed:', approvalSimulationError)
          throw new Error(`Simulation failed: ${approvalSimulationError.message}`)
        }

        if (approvalSimulation) {
          console.log('✅ Unlimited approval simulation successful, executing approval...')
          console.log('This will allow unlimited JPYM spending, no more approvals needed!')
          return writeContract(approvalSimulation.request)
        }
        
        attempts++
      }

      throw new Error('Approval simulation timed out')
    } catch (error) {
      console.error('Error approving JPYM:', error)
      setCurrentStep('idle')
      throw error
    }
  }

  // Create Event function (after approval)
  const createEventOnContract = async (params: CreateEventParams) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log('Starting event creation with params:', params)
      console.log('Contract address:', MIZU_EVENT_REGISTRY_ADDRESS)
      console.log('User address:', address)
      console.log('Creation fee loaded:', !!creationFee, creationFee?.toString())
      console.log('Current allowance:', currentAllowance?.toString())
      
      setCurrentStep('creation')
      setSimulationParams(params)

      // Wait for simulation to run with better debugging
      let attempts = 0
      const maxAttempts = 15 // Increased attempts
      
      while (attempts < maxAttempts) {
        console.log(`Simulation attempt ${attempts + 1}/${maxAttempts}`)
        console.log('Simulation loading:', isSimulatingCreate)
        console.log('Simulation error:', createEventSimulationError?.message)
        console.log('Simulation data available:', !!createEventSimulation)
        
        await new Promise(resolve => setTimeout(resolve, 300)) // Slightly longer wait
        
        if (createEventSimulationError) {
          console.error('Event creation simulation failed:', createEventSimulationError)
          throw new Error(`Simulation failed: ${createEventSimulationError.message}`)
        }

        if (createEventSimulation) {
          console.log('Simulation successful! Request:', createEventSimulation.request)
          return writeContract(createEventSimulation.request)
        }
        
        attempts++
      }

      console.error('Simulation timed out after', maxAttempts, 'attempts')
      console.log('Final state - loading:', isSimulatingCreate, 'error:', createEventSimulationError, 'data:', !!createEventSimulation)
      
      // Fallback: try direct contract call without simulation for debugging
      console.log('Attempting direct contract call without simulation...')
      try {
        return writeContract({
          address: MIZU_EVENT_REGISTRY_ADDRESS,
          abi: MIZU_EVENT_REGISTRY_ABI,
          functionName: 'createEvent',
          args: [
            params.ipfsHash,
            params.ticketIpfsHash,
            params.ticketPrice,
            params.maxTickets,
            params.eventDate,
            params.eventName,
            params.eventSymbol
          ]
        })
      } catch (directCallError) {
        console.error('Direct contract call also failed:', directCallError)
        throw new Error(`Event creation failed - simulation timed out and direct call failed: ${directCallError instanceof Error ? directCallError.message : 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      setCurrentStep('idle')
      setSimulationParams(null)
      throw error
    }
  }

  // Combined create event flow (check approval, approve if needed, then create)
  const createEvent = async (params: CreateEventParams) => {
    if (!creationFee || !address) {
      throw new Error('Creation fee not loaded or wallet not connected')
    }

    // Check if we have enough allowance for this specific transaction
    const needsApproval = !currentAllowance || currentAllowance < creationFee

    if (needsApproval) {
      console.log('JPYM approval needed.')
      console.log('Current allowance:', currentAllowance?.toString() || '0')
      console.log('Required for this transaction:', creationFee.toString())
      console.log('Will approve unlimited amount to avoid future approvals')
      throw new Error('APPROVAL_NEEDED') // Special error to trigger approval flow
    }

    console.log('✅ Sufficient JPYM allowance available:', currentAllowance.toString())
    console.log('Required for this transaction:', creationFee.toString())
    
    // We have sufficient approval, create the event
    return createEventOnContract(params)
  }

  return {
    // Functions
    createEvent,
    approveJPYM,
    approveMJPY: approveJPYM, // Legacy alias
    
    // Contract data
    creationFee,
    currentAllowance,
    needsApproval: creationFee && currentAllowance ? currentAllowance < creationFee : !!creationFee, // Only need approval if we have creation fee loaded but insufficient allowance
    
    // Transaction states
    isTransactionPending: isPending,
    isTransactionConfirming: isConfirming,
    isTransactionConfirmed: isConfirmed,
    transactionHash: hash,
    currentStep,
    
    // Errors
    transactionError: error,
    confirmationError: confirmError,
    
    // Loading states
    isCreatingEvent: isPending || isConfirming,
    isApprovingMJPY: currentStep === 'approval' && (isPending || isConfirming),
    
    // Simulation states
    isSimulatingApproval,
    isSimulatingCreate,
    approvalSimulationError,
    createEventSimulationError,
  }
}