import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useEffect, useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEventRegistry, type CreateEventParams } from '../hooks/useEventRegistry'
import { useOrganizerActiveEvents, transformEventForComponent, EVENTS_QUERY_KEYS } from '../hooks/useEventsApi'
import { formatEventPrice, formatEventDateTime } from '../services/eventsApi'

// Dashboard stats will be calculated from real organizer events data

// This will be replaced with API data in the component

interface DashboardProps {
  onBackToOnboarding?: () => void
}

export function Dashboard({ onBackToOnboarding }: DashboardProps = {}) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const queryClient = useQueryClient()
  
  // Fetch organizer events from API
  const { data: apiOrganizerEvents, isLoading: eventsLoading, isError: eventsError } = useOrganizerActiveEvents(address)
  
  // Transform API data to component format with status calculation
  const organizerEvents = apiOrganizerEvents ? apiOrganizerEvents.map(event => {
    const transformedEvent = transformEventForComponent(event)
    // Calculate status based on API data
    const soldOut = Number(event.ticketsSold) >= Number(event.maxTickets)
    const eventDate = new Date(Number(event.eventDate) * 1000)
    const isUpcoming = eventDate > new Date()
    
    const status = soldOut ? 'sold-out' : (isUpcoming ? 'available' : 'upcoming') as 'sold-out' | 'available' | 'upcoming'
    
    return {
      ...transformedEvent,
      status,
      participants: Number(event.ticketsSold),
      eventImage: event.eventImageUrl || '/mizuPass.svg',
      mizuIcon: '/mizuIcons/mizu-www.svg',
      price: formatEventPrice(event.ticketPrice),
      date: formatEventDateTime(event.eventDate),
      bgColor: 'white',
    }
  }) : []

  // Calculate dashboard stats from real data
  const totalRevenueNum = organizerEvents.reduce((total, event) => {
    const priceNum = Number(event.price.replace(/[^0-9.-]+/g, ''))
    return total + (priceNum * event.participants)
  }, 0)
  
  const dashboardStats = {
    totalEvents: organizerEvents.length,
    activeEvents: organizerEvents.filter(event => event.status === 'available').length,
    totalRevenue: `¥${totalRevenueNum.toLocaleString()}`,
    totalTicketsSold: organizerEvents.reduce((total, event) => total + event.participants, 0),
    monthlyRevenue: `¥${Math.round(totalRevenueNum * 0.6).toLocaleString()}`, // Estimate 60% is this month
    avgRating: 4.8 // This would come from API in a real implementation
  }
  const { data: balance, isError, isLoading } = useBalance({
    address,
    query: {
      enabled: !!address
    }
  })
  const [showBalance, setShowBalance] = useState(false)
  
  // Event Registry Hook
  const {
    createEvent,
    approveMJPY: approveJPYM,
    isTransactionPending,
    isTransactionConfirming,
    isTransactionConfirmed,
    transactionHash,
    transactionError,
    confirmationError,
    isCreatingEvent,
    isApprovingMJPY,
    isSimulatingApproval,
    isSimulatingCreate,
    approvalSimulationError,
    createEventSimulationError,
    currentStep,
    createdEventContract
  } = useEventRegistry()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  // Form state - Updated to match NFT metadata structure
  const [formData, setFormData] = useState({
    name: '', // Changed from title to name for NFT metadata
    category: 'Gaming', // Keep for UI/backend, not in NFT metadata
    description: '',
    external_url: '', // New field for NFT metadata
    price: '', // Will be converted to number
    location: '',
    date: null as number | null,
    maxParticipants: '',
    eventImage: null as File | null
  })

  // Loading states for upload process
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading-image' | 'uploading-metadata' | 'creating-event'>('idle')
  const [uploadProgress, setUploadProgress] = useState({
    step: 1,
    total: 3,
    message: ''
  })

  // Error state for simulation errors
  const [simulationError, setSimulationError] = useState<string | null>(null)

  // State to track pending event creation (after approval)
  const [pendingEventCreation, setPendingEventCreation] = useState<CreateEventParams | null>(null)
  
  // Success banner state
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [createdEventData, setCreatedEventData] = useState<{
    eventName: string
    transactionHash: string
    nftContractAddress?: string
  } | null>(null)
  const [processedTransactionHash, setProcessedTransactionHash] = useState<string | null>(null)
  
  // Combined loading state
  const isProcessing = isUploading || isCreatingEvent || isApprovingMJPY || isSimulatingApproval || isSimulatingCreate

  // Debug balance data
  useEffect(() => {
    if (showBalance) {
      console.log('Dashboard Balance Debug:', {
        address,
        balance,
        isLoading,
        isError,
        balanceValue: balance?.value?.toString(),
        balanceSymbol: balance?.symbol
      })
    }
  }, [showBalance, balance, isLoading, isError, address])

  // Scroll functions for events slider
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Scroll by approximately one card width
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Scroll by approximately one card width
        behavior: 'smooth'
      })
    }
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Check scroll buttons on component mount and scroll
  const handleScroll = () => {
    checkScrollButtons()
  }

  useEffect(() => {
    // Initialize scroll button states
    checkScrollButtons()
  }, [])

  // Check scroll buttons when switching between create form and dashboard
  useEffect(() => {
    if (!showCreateForm) {
      // When switching back to dashboard, recheck scroll buttons
      setTimeout(() => checkScrollButtons(), 100)
    }
  }, [showCreateForm])

  // Handle transaction confirmation
  useEffect(() => {
    console.log('🔍 Transaction confirmation effect triggered:', {
      isTransactionConfirmed,
      currentStep,
      transactionHash,
      createdEventContract,
      pendingEventCreation: !!pendingEventCreation,
      formDataName: formData.name,
      showSuccessBanner,
      createdEventData: !!createdEventData,
      processedTransactionHash
    })
    
    if (isTransactionConfirmed) {
      console.log('✅ Transaction confirmed! Current step:', currentStep)
      
      // Check if this is an event creation (has NFT contract address) and we haven't processed this transaction yet
      if (createdEventContract && transactionHash && processedTransactionHash !== transactionHash) {
        console.log('🎉 Event creation confirmed - showing success banner (NFT contract exists)')
        console.log('Processing transaction hash:', transactionHash)
        
        // Mark this transaction as processed to prevent infinite loops
        setProcessedTransactionHash(transactionHash)
        
        // Success! Show success banner with event details
        const eventName = pendingEventCreation?.eventName || formData.name || 'Unnamed Event'
        
        const eventData = {
          eventName,
          transactionHash: transactionHash || '',
          nftContractAddress: createdEventContract || undefined
        }
        
        console.log('📊 Setting success banner data:', eventData)
        setCreatedEventData(eventData)
        setShowSuccessBanner(true)
        console.log('🎯 Success banner should now be visible!')
        
        // Immediately refetch event data to show the new event in dashboard and event lists
        console.log('🔄 Refreshing event data to show new event...')
        queryClient.invalidateQueries({
          queryKey: EVENTS_QUERY_KEYS.all
        })
        if (address) {
          queryClient.invalidateQueries({
            queryKey: EVENTS_QUERY_KEYS.organizer(address)
          })
        }
        queryClient.invalidateQueries({
          queryKey: EVENTS_QUERY_KEYS.active
        })
        
        setIsUploading(false)
        setUploadStep('idle')
        setPendingEventCreation(null) // Clear pending creation
        
        // DON'T reset form data - keep user on the form with success banner
        // DON'T clear image preview - keep the form as is
        // DON'T go back to dashboard - stay on create form
        
        console.log('🎉 Event created successfully! Staying on create form with success banner.')
      } else if (currentStep === 'idle' && pendingEventCreation) {
        // Approval completed (currentStep is now 'idle'), continue with event creation
        console.log('✅ JPYM approval completed! Continuing with event creation...')
        
        // Add a small delay to ensure allowance is fully updated
        const continueSilently = async () => {
          try {
            // Wait a moment for allowance to be fully refreshed
            await new Promise(resolve => setTimeout(resolve, 1500))
            await createEvent(pendingEventCreation)
          } catch (error) {
            console.error('Error continuing event creation after approval:', error)
            setSimulationError(`Failed to create event after approval: ${error instanceof Error ? error.message : 'Unknown error'}`)
            setIsUploading(false)
            setUploadStep('idle')
            setPendingEventCreation(null)
          }
        }
        
        continueSilently()
      }
    }
  }, [isTransactionConfirmed, currentStep, pendingEventCreation, imagePreviewUrl, createEvent, transactionHash, createdEventContract, formData.name, processedTransactionHash])

  // Debug success banner state changes
  useEffect(() => {
    console.log('🎯 Success banner state changed:', { 
      showSuccessBanner, 
      createdEventData: !!createdEventData,
      shouldRender: showSuccessBanner && !!createdEventData,
      processedTransactionHash
    })
    
    if (!showSuccessBanner) {
      console.log('🔔 Banner should be hidden now')
    } else if (showSuccessBanner && createdEventData) {
      console.log('🔔 Banner should be visible now')
    }
  }, [showSuccessBanner, createdEventData, processedTransactionHash])

  // Handle transaction errors
  useEffect(() => {
    if (transactionError) {
      setIsUploading(false)
      setUploadStep('idle')
      console.error('Transaction failed:', transactionError.message)
    }
  }, [transactionError])

  useEffect(() => {
    if (confirmationError) {
      setIsUploading(false) 
      setUploadStep('idle')
      console.error('Transaction confirmation failed:', confirmationError.message)
    }
  }, [confirmationError])

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  // Monitor simulation errors
  useEffect(() => {
    if (approvalSimulationError) {
      setSimulationError(`JPYM approval simulation failed: ${approvalSimulationError.message}`)
    }
  }, [approvalSimulationError])

  useEffect(() => {
    if (createEventSimulationError) {
      setSimulationError(`Event creation simulation failed: ${createEventSimulationError.message}`)
    }
  }, [createEventSimulationError])

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    if (dateValue) {
      // Convert to unix timestamp (integer)
      const timestamp = Math.floor(new Date(dateValue).getTime() / 1000)
      setFormData(prev => ({ ...prev, date: timestamp }))
    } else {
      setFormData(prev => ({ ...prev, date: null }))
    }
  }

  // Convert unix timestamp back to date input format (YYYY-MM-DD)
  const getDateInputValue = () => {
    if (!formData.date) return ''
    const date = new Date(formData.date * 1000)
    return date.toISOString().split('T')[0]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    console.log('File selected:', file) // Debug log
    console.log('File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })
    
    // Clean up previous preview URL
    if (imagePreviewUrl) {
      console.log('Cleaning up previous URL:', imagePreviewUrl)
      URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
    }
    
    // Create new preview URL if file exists
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File size must be less than 5MB')
        return
      }
      
      try {
        const url = URL.createObjectURL(file)
        console.log('Preview URL created:', url) // Debug log
        
        // Use setTimeout to ensure state update happens after cleanup
        setTimeout(() => {
          setImagePreviewUrl(url)
          console.log('Preview URL state updated:', url)
        }, 100)
        
        setFormData(prev => ({ ...prev, eventImage: file }))
      } catch (error) {
        console.error('Error creating object URL:', error)
        console.error('Failed to preview image')
      }
    } else {
      setFormData(prev => ({ ...prev, eventImage: null }))
    }
  }

  const handleCreateEvent = () => {
    setShowCreateForm(true)
  }

  const handleBackToList = () => {
    setShowCreateForm(false)
    setShowSuccessBanner(false)
    setProcessedTransactionHash(null) // Reset for next transaction
    
    // Clean up preview URL
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
    }
    
    setFormData({
      name: '',
      category: 'Gaming',
      description: '',
      external_url: '',
      price: '', // Keep as string for form input
      location: '',
      date: null,
      maxParticipants: '',
      eventImage: null
    })
    
    // Update scroll button states when returning to dashboard
    setTimeout(() => checkScrollButtons(), 0)
  }

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.eventImage) {
      console.error('Please upload an event image')
      return
    }

    try {
      // Clear previous transaction tracking for new event creation
      setProcessedTransactionHash(null)
      setShowSuccessBanner(false)
      setCreatedEventData(null)
      
      setIsUploading(true)
      
      // Step 1: Upload image
      setUploadStep('uploading-image')
      setUploadProgress({
        step: 1,
        total: 3,
        message: 'Uploading event image to IPFS...'
      })

      const { uploadEventNFTMetadata } = await import('../services/uploadService')
      
      // Prepare event data for upload
      const eventUploadData = {
        name: formData.name,
        description: formData.description,
        external_url: '', // Will be filled with metadata IPFS URL
        price: parseFloat(formData.price) || 0, // Convert string to number
        location: formData.location,
        maxParticipants: parseInt(formData.maxParticipants),
        date: formData.date!, // We know it's not null due to form validation
        eventImage: formData.eventImage
      }

      // Step 2: Upload metadata
      setUploadStep('uploading-metadata')
      setUploadProgress({
        step: 2,
        total: 3,
        message: 'Creating NFT metadata...'
      })

      const { imageCID, eventMetadataCID, ticketMetadataCID, metadataURL } = await uploadEventNFTMetadata(eventUploadData)

      // Step 3: Create event on blockchain
      setUploadStep('creating-event')
      setUploadProgress({
        step: 3,
        total: 3,
        message: 'Creating event on blockchain...'
      })

      // Prepare smart contract parameters with validation
      const createEventParams: CreateEventParams = {
        ipfsHash: eventMetadataCID,
        ticketIpfsHash: ticketMetadataCID,
        ticketPrice: BigInt(Math.floor(parseFloat(formData.price) * 1e4)), // Convert to JPYM smallest unit (4 decimals)
        maxTickets: BigInt(parseInt(formData.maxParticipants)),
        eventDate: BigInt(formData.date!), // We know it's not null due to form validation
        eventName: formData.name,
        eventSymbol: formData.name.substring(0, 6).toUpperCase().replace(/\s/g, '') // Generate symbol from name
      }

      console.log('Creating event with validated params:', {
        ...createEventParams,
        ticketPrice: createEventParams.ticketPrice.toString(),
        maxTickets: createEventParams.maxTickets.toString(),
        eventDate: createEventParams.eventDate.toString(),
        eventDateReadable: new Date(Number(createEventParams.eventDate) * 1000).toISOString()
      })

      // Validate parameters
      if (!eventMetadataCID || !ticketMetadataCID) {
        throw new Error('IPFS hashes are missing')
      }
      if (createEventParams.ticketPrice <= 0n) {
        throw new Error('Ticket price must be greater than 0')
      }
      if (createEventParams.maxTickets <= 0n) {
        throw new Error('Max tickets must be greater than 0')
      }
      if (!createEventParams.eventName.trim()) {
        throw new Error('Event name is required')
      }
      
      // Call smart contract
      try {
        // Clear any previous simulation errors
        setSimulationError(null)
        
        await createEvent(createEventParams)
        
        console.log('Event creation transaction submitted!', {
          ...formData,
          imageCID,
          eventMetadataCID,
          ticketMetadataCID,
          metadataURL,
          transactionHash,
          dateTimestamp: formData.date,
          dateReadable: formData.date ? new Date(formData.date * 1000).toLocaleDateString() : ''
        })
      } catch (contractError: any) {
        if (contractError.message === 'APPROVAL_NEEDED') {
          // Need to approve JPYM first
          console.log('JPYM approval required before creating event')
          console.log('Starting JPYM approval process...')
          
          // Store event parameters for continuation after approval
          setPendingEventCreation(createEventParams)
          
          try {
            // Clear any previous simulation errors
            setSimulationError(null)
            await approveJPYM()
            // Don't reset upload states - let the transaction confirmation handler continue the flow
          } catch (approvalError: any) {
            console.error('Approval failed:', approvalError)
            setSimulationError(`Approval simulation failed: ${approvalError.message}`)
            
            // Reset upload states and clear pending creation since approval failed
            setIsUploading(false)
            setUploadStep('idle')
            setPendingEventCreation(null)
            return // Don't proceed, show error banner
          }
        } else if (contractError.message.includes('Simulation failed')) {
          // Simulation error - show error banner without resetting form
          setSimulationError(contractError.message)
          setIsUploading(false)
          setUploadStep('idle')
          return // Don't proceed, show error banner
        } else {
          throw contractError // Re-throw other errors
        }
      }

      // Don't redirect, just show success and wait for confirmation
      
    } catch (error) {
      console.error('Error creating event:', error)
      console.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      // Check if it's a simulation error
      if (error instanceof Error && error.message.includes('Simulation failed')) {
        setSimulationError(error.message)
      } else {
        setSimulationError(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      
      setIsUploading(false)
      setUploadStep('idle')
    }
  }

  // Show Create Event Form if showCreateForm is true
  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            <img src="/mizuIcons/mizu-attention.svg" alt="Back" className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Back to Dashboard</span>
          </button>
        </div>

        {/* Create Event Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6 max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
              <img src="/mizuIcons/mizu-www.svg" alt="Create" className="w-8 h-8" />
              Create New Event
            </h2>
            <p className="text-sm text-gray-600">Fill in the details below</p>
          </div>

          {/* Loading Banner */}
          {isProcessing && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-6 h-6 animate-spin" />
                  Creating Your Event
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isApprovingMJPY && isTransactionPending ? 'Approve JPYM tokens in wallet...' :
                   isApprovingMJPY && isTransactionConfirming ? 'Confirming JPYM approval...' :
                   isTransactionPending ? 'Waiting for wallet confirmation...' :
                   isTransactionConfirming ? 'Confirming transaction on blockchain...' :
                   uploadProgress.message}
                </p>
                
                {/* Progress Steps */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    uploadProgress.step >= 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className="text-xs font-medium">1</span>
                    <span className="text-xs">Upload Image</span>
                    {uploadStep === 'uploading-image' && (
                      <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-4 h-4 animate-spin" />
                    )}
                    {uploadProgress.step > 1 && (
                      <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="w-8 h-px bg-gray-300"></div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    uploadProgress.step >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className="text-xs font-medium">2</span>
                    <span className="text-xs">Create Metadata</span>
                    {uploadStep === 'uploading-metadata' && (
                      <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-4 h-4 animate-spin" />
                    )}
                    {uploadProgress.step > 2 && (
                      <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="w-8 h-px bg-gray-300"></div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    uploadProgress.step >= 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className="text-xs font-medium">3</span>
                    <span className="text-xs">Create Event</span>
                    {uploadStep === 'creating-event' && (
                      <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-4 h-4 animate-spin" />
                    )}
                    {uploadProgress.step > 3 && (
                      <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(uploadProgress.step / uploadProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {(() => {
            const shouldShow = showSuccessBanner && createdEventData
            console.log('🎨 Banner render check:', { showSuccessBanner, hasCreatedEventData: !!createdEventData, shouldShow })
            return shouldShow
          })() && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-3">
              <div className="flex items-center gap-3">
                {/* Left: Icon and Title */}
                <div className="flex items-center gap-2">
                  <img src="/mizuIcons/mizu-love.svg" alt="Success" className="w-5 h-5 animate-bounce flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-green-800">🎉 Event Created!</h3>
                    <p className="text-xs text-green-700">{createdEventData?.eventName}</p>
                  </div>
                </div>

                {/* Center: Links */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <a
                    href={`https://explorer.kaigan.jsc.dev/tx/${createdEventData?.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-medium transition-colors flex-shrink-0"
                    title="View Transaction"
                  >
                    <img src="/mizuIcons/mizu-www.svg" alt="TX" className="w-3 h-3" />
                    TX
                  </a>
                  
                  {createdEventData?.nftContractAddress && (
                    <a
                      href={`https://explorer.kaigan.jsc.dev/address/${createdEventData?.nftContractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded text-xs font-medium transition-colors flex-shrink-0"
                      title="View NFT Contract"
                    >
                      <img src="/mizuIcons/mizu-success.svg" alt="NFT" className="w-3 h-3" />
                      NFT
                    </a>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      console.log('🆕 "New Event" button clicked - resetting banner and form')
                      setShowSuccessBanner(false)
                      setProcessedTransactionHash(null) // Reset for next transaction
                      setCreatedEventData(null) // Clear event data
                      console.log('🆕 Banner state set to false, processedTransactionHash reset')
                      // Reset form for new event
                      setFormData({
                        name: '',
                        category: 'Gaming',
                        description: '',
                        external_url: '',
                        price: '',
                        location: '',
                        date: null,
                        maxParticipants: '',
                        eventImage: null
                      })
                      if (imagePreviewUrl) {
                        URL.revokeObjectURL(imagePreviewUrl)
                        setImagePreviewUrl(null)
                      }
                    }}
                    className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 text-xs font-medium rounded transition-colors duration-200"
                    title="Create Another Event"
                  >
                    New Event
                  </button>
                  <button
                    onClick={() => {
                      console.log('❌ Dismiss button clicked - hiding banner')
                      setShowSuccessBanner(false)
                      setCreatedEventData(null) // Clear event data
                      console.log('❌ Banner state set to false, data cleared')
                      // Keep processedTransactionHash to prevent re-triggering this transaction
                    }}
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    title="Dismiss"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Error Banner */}
          {simulationError && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <img src="/mizuIcons/mizu-attention.svg" alt="Error" className="w-6 h-6 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">Transaction Simulation Failed</h3>
                  <p className="text-sm text-red-700 mb-3">
                    {simulationError}
                  </p>
                  <p className="text-xs text-red-600">
                    The transaction was simulated and would fail. Please check your wallet balance, token approvals, or contract permissions before trying again.
                  </p>
                  <button
                    onClick={() => setSimulationError(null)}
                    className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <fieldset disabled={isProcessing} className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="Shibuya Esports Cup"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Loyalty">Loyalty</option>
                  <option value="Exclusive">Exclusive</option>
                  <option value="Concert">Concert</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (JPYM)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="2800"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="200"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm"
                  placeholder="Virtual Arena"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={getDateInputValue()}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 text-sm resize-none"
                placeholder="Describe your event..."
                required
              />
            </div>


            {/* Event Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="eventImage"
                />
                {imagePreviewUrl ? (
                  <div className="flex items-center justify-center gap-2 p-4">
                    <div className="flex-1 flex justify-center">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Event preview" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        onLoad={() => console.log('Image loaded successfully:', imagePreviewUrl)}
                        onError={(e) => {
                          console.error('Image failed to load:', e, 'URL:', imagePreviewUrl)
                          setImagePreviewUrl(null)
                        }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-sm font-medium text-gray-700 mb-2">{formData.eventImage?.name}</span>
                      <span className="text-xs text-gray-500 mb-3">
                        {formData.eventImage ? `${(formData.eventImage.size / 1024 / 1024).toFixed(2)} MB` : ''}
                      </span>
                      <label htmlFor="eventImage" className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all border border-blue-200 text-center inline-block w-fit">
                        <span className="text-sm font-medium text-blue-700">Change</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="eventImage" className="cursor-pointer block p-6 text-center">
                    <div className="flex flex-col items-center">
                      <img src="/mizuIcons/mizu-cute.svg" alt="Upload" className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-sm text-gray-600">Upload image</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            </fieldset>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleBackToList}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: 'var(--primary)' }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <img src="/mizuIcons/mizu-tired.svg" alt="Creating" className="w-4 h-4 inline mr-2 animate-spin" />
                    {isApprovingMJPY && isTransactionPending ? 'Approve JPYM...' :
                     isApprovingMJPY && isTransactionConfirming ? 'Approving...' :
                     isTransactionPending ? 'Confirm in Wallet...' : 
                     isTransactionConfirming ? 'Confirming...' : 
                     'Creating...'}
                  </>
                ) : (
                  'Create Event 🎉'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 w-full">
      {/* Header with Back Button */}
      {onBackToOnboarding && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBackToOnboarding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            <img src="/mizuIcons/mizu-attention.svg" alt="Back" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Back to Onboarding</span>
          </button>
        </div>
      )}


      {/* Main Content Cards */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        
        {/* Welcome & Wallet Card - Left Side */}
        <div className="flex-1 rounded-2xl p-4 shadow-lg border-2 border-pink-200 hover:shadow-xl transition-shadow text-center"
             style={{ backgroundColor: 'var(--body3)' }}>
          <div className="mb-3">
            <img 
              src="/mizuIcons/mizu-www.svg" 
              alt="Dashboard" 
              className="w-16 h-16 mx-auto animate-bounce mb-2"
            />
            <h1 className="text-2xl font-bold mb-2 text-white">
              Welcome to Dashboard! 🎪
            </h1>
            <p className="text-sm text-pink-100 mb-3">
              Manage your events and track your success!
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-key.svg" alt="Wallet" className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium text-white">Connected Wallet</span>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-xs px-2 py-1 bg-red-400/60 hover:bg-red-400/80 text-white rounded-lg transition-colors duration-200"
                title="Disconnect Wallet"
              >
                Logout
              </button>
            </div>
            <p className="font-mono text-xs break-all text-pink-100 mb-2">
              {address}
            </p>

            {/* Balance Section */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
              >
                {showBalance ? 'Hide Balance' : 'Show Balance'}
              </button>
              {showBalance && (
                <div className="text-xs text-pink-100">
                  {isLoading ? (
                    <span className="opacity-75">Loading...</span>
                  ) : isError ? (
                    <span className="text-pink-200 opacity-75">Error fetching balance</span>
                  ) : balance && balance.value > 0n ? (
                    <span className="font-semibold">
                      {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                    </span>
                  ) : balance && balance.value === 0n ? (
                    <span className="opacity-75">0.0000 {balance.symbol}</span>
                  ) : (
                    <span className="opacity-75">No balance data</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Status Card - Right Side */}
        <div className="flex-1 rounded-2xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow" 
             style={{ background: 'var(--secondary)' }}>
          <div className="flex items-center justify-center mb-3">
            <img src="/mizuIcons/mizu-success.svg" alt="Stats" className="w-10 h-10 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Event Statistics</h3>
          </div>
          
          <div className="space-y-2">
            {/* Total Events */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Total Events</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-www.svg" alt="Events" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm" style={{ color: 'var(--primary)' }}>
                  {dashboardStats.totalEvents}
                </span>
              </div>
            </div>

            {/* Active Events */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Active Events</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-success.svg" alt="Active" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm text-green-600">
                  {dashboardStats.activeEvents}
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Total Revenue</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-love.svg" alt="Revenue" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm" style={{ color: 'var(--primary)' }}>
                  {dashboardStats.totalRevenue}
                </span>
              </div>
            </div>

            {/* Tickets Sold */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Tickets Sold</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-okey.svg" alt="Tickets" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm text-blue-600">
                  {dashboardStats.totalTicketsSold}
                </span>
              </div>
            </div>

            {/* Average Rating */}
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-900 font-medium text-sm">Avg Rating</span>
              <div className="flex items-center">
                <img src="/mizuIcons/mizu-cute.svg" alt="Rating" className="w-5 h-5 mr-1" />
                <span className="ml-1 font-bold text-sm text-yellow-600">
                  {dashboardStats.avgRating} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Events List Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Active Events 🎯</h2>
            <p className="text-gray-700 text-sm">
              Manage and monitor your live events
            </p>
          </div>
          <button 
            onClick={handleCreateEvent}
            className="px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'var(--body1)' }}
          >
            Create New Event! ✨
          </button>
        </div>
        
        <div className="flex h-fit overflow-hidden mt-6">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 h-fit scrollbar-hide"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {eventsLoading ? (
              // Loading state for events
              <div className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-4 text-center">
                <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p className="text-xs text-gray-600">Loading events...</p>
              </div>
            ) : eventsError ? (
              // Error state for events
              <div className="flex-shrink-0 w-72 bg-red-50 rounded-xl p-4 text-center">
                <img src="/mizuIcons/mizu-attention.svg" alt="Error" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Failed to load events</p>
              </div>
            ) : organizerEvents.length === 0 ? (
              // Empty state
              <div className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-4 text-center">
                <img src="/mizuIcons/mizu-love.svg" alt="No Events" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-gray-600">No events created yet</p>
                <p className="text-xs text-gray-500 mt-1">Create your first event to get started!</p>
              </div>
            ) : (
              organizerEvents.map((event, index) => (
              <div key={`${event.id}-${index}`} className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-4 text-left hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <img src={event.mizuIcon} alt={event.category} className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
                    <span className="text-xs text-gray-600">{event.category}</span>
                  </div>
                </div>
                
                <div className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  {event.price}
                </div>
                
                <div className="text-xs text-gray-600 mb-3">
                  {event.participants}/{event.maxParticipants} participants
                </div>
                
                <div className="bg-gray-200 rounded-full h-1.5 mb-3">
                  <div 
                    className="rounded-full h-1.5 transition-all duration-300"
                    style={{ 
                      width: `${(event.participants / event.maxParticipants) * 100}%`,
                      backgroundColor: 'var(--primary)'
                    }}
                  ></div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg text-white transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Edit Event
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200">
                    View Stats
                  </button>
                </div>
              </div>
            )))}

            {/* Add More Events Placeholder */}
            <div className="flex-shrink-0 w-72 bg-gray-100/80 backdrop-blur-sm rounded-xl p-4 h-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
              <img src="/mizuIcons/mizu-love.svg" alt="More Events" className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-bold text-gray-700 mb-1">Create More Events!</h3>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Build your event portfolio and grow your audience.
              </p>
              <button 
                onClick={handleCreateEvent}
                className="px-3 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 text-xs"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Arrow Navigation - Bottom Right */}
        <div className="flex justify-end mt-4">
          <div className="flex gap-2">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cute Footer - Only on Mobile/iPad */}
      <div className="lg:hidden mt-12 mb-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <img src="/mizuIcons/mizu-www.svg" alt="Manage" className="w-8 h-8" />
            <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-10 h-10" />
            <img src="/mizuIcons/mizu-speakloud.svg" alt="Events" className="w-8 h-8" />
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-100 mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Event Management Hub! 🎪
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Your centralized dashboard for managing all your events!
            </p>
            
            <div className="flex justify-center space-x-6 mb-4">
              <div className="text-center">
                <img src="/mizuIcons/mizu-success.svg" alt="Manage" className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Manage</span>
              </div>
              <div className="text-center">
                <img src="/mizuIcons/mizu-love.svg" alt="Revenue" className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="text-center">
                <img src="/mizuIcons/mizu-www.svg" alt="Create" className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Create</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-medium text-white" 
                   style={{ backgroundColor: 'var(--primary)' }}>
                <img src="/mizuIcons/mizu-www.svg" alt="Mizu" className="w-4 h-4 mr-2" />
                Made with 💖 by MizuPass Team
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <img src="/mizuIcons/mizu-tired.svg" alt="Rest" className="w-12 h-12 opacity-50" />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Scroll up to continue managing! ↑
          </p>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}