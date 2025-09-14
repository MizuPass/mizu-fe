import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount, useSimulateContract } from 'wagmi'
import { MIZU_EVENT_REGISTRY_ADDRESS, MIZU_EVENT_REGISTRY_ABI, MJPY_TOKEN_ADDRESS, ERC20_ABI } from '../config/contracts'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

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

  // Get EVENT_CREATION_FEE_MJPY from contract
  const { data: creationFee } = useReadContract({
    address: MIZU_EVENT_REGISTRY_ADDRESS,
    abi: MIZU_EVENT_REGISTRY_ABI,
    functionName: 'EVENT_CREATION_FEE_MJPY',
  })

  // Check current MJPY allowance for Event Registry
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: MJPY_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, MIZU_EVENT_REGISTRY_ADDRESS] : undefined,
    query: {
      enabled: !!address
    }
  })


  // Simulate MJPY approval
  const { data: approvalSimulation, error: approvalSimulationError, isLoading: isSimulatingApproval } = useSimulateContract({
    address: MJPY_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: creationFee ? [MIZU_EVENT_REGISTRY_ADDRESS, creationFee] : undefined,
    query: {
      enabled: !!creationFee && currentStep === 'approval'
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
      enabled: !!simulationParams && currentStep === 'creation'
    }
  })


  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      if (currentStep === 'approval') {
        // Approval confirmed, refetch allowance
        refetchAllowance()
        setCurrentStep('idle')
        console.log('MJPY approval confirmed! Ready to create event.')
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

  // Approve MJPY tokens for Event Registry
  const approveMJPY = async () => {
    if (!creationFee) {
      throw new Error('Creation fee not loaded')
    }

    try {
      console.log('Simulating MJPY approval...', creationFee.toString())
      setCurrentStep('approval')

      // Wait a bit for simulation to run
      await new Promise(resolve => setTimeout(resolve, 500))

      if (approvalSimulationError) {
        console.error('Approval simulation failed:', approvalSimulationError)
        throw new Error(`Simulation failed: ${approvalSimulationError.message}`)
      }

      if (!approvalSimulation) {
        throw new Error('Simulation not ready')
      }

      console.log('Simulation successful, executing approval...')
      
      return writeContract(approvalSimulation.request)
    } catch (error) {
      console.error('Error approving MJPY:', error)
      setCurrentStep('idle')
      throw error
    }
  }

  // Create Event function (after approval)
  const createEventOnContract = async (params: CreateEventParams) => {
    try {
      console.log('Simulating event creation...', params)
      setCurrentStep('creation')
      setSimulationParams(params)

      // Wait a bit for simulation to run
      await new Promise(resolve => setTimeout(resolve, 500))

      if (createEventSimulationError) {
        console.error('Event creation simulation failed:', createEventSimulationError)
        throw new Error(`Simulation failed: ${createEventSimulationError.message}`)
      }

      if (!createEventSimulation) {
        throw new Error('Simulation not ready')
      }

      console.log('Simulation successful, executing event creation...')
      
      return writeContract(createEventSimulation.request)
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

    // Check if we have enough allowance
    const needsApproval = !currentAllowance || currentAllowance < creationFee

    if (needsApproval) {
      console.log('MJPY approval needed. Current allowance:', currentAllowance?.toString(), 'Required:', creationFee.toString())
      throw new Error('APPROVAL_NEEDED') // Special error to trigger approval flow
    }

    // We have sufficient approval, create the event
    return createEventOnContract(params)
  }

  return {
    // Functions
    createEvent,
    approveMJPY,
    
    // Contract data
    creationFee,
    currentAllowance,
    needsApproval: creationFee && currentAllowance ? currentAllowance < creationFee : true,
    
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