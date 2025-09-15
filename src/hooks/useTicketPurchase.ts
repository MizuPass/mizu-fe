import { useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useWatchContractEvent } from 'wagmi';
// import { parseUnits, createWalletClient, http, type Address } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sepolia } from 'viem/chains';
import { useTicketPurchaseStore } from '../stores/ticketPurchaseStore';
import type { PurchaseParams, StealthAddress, TicketData } from '../types/ticket';
// import { StealthAddressService } from '../utils/stealthAddress';
import { 
  EVENT_CONTRACT_ABI, 
  ERC20_ABI, 
  JPYM_TOKEN_ADDRESS,
  MIZUPASS_IDENTITY_ADDRESS,
  MIZUPASS_IDENTITY_ABI
} from '../config/contracts';

export const useTicketPurchase = () => {
  const { address, isConnected } = useAccount();
  
  const {
    currentStep,
    progress,
    error,
    isLoading,
    stealthAddress,
    // stealthPrivateKey,
    emergencyRecoveryAvailable,
    currentEventAddress,
    setCurrentStep,
    setProgress,
    setError,
    setLoading,
    setStealthData,
    setPurchaseTxHash,
    setCompleteTxHash,
    setTokenId,
    // setEmergencyRecovery,
    setCurrentEventAddress,
    resetPurchaseState,
    addTicket,
    getTicketByEventAddress,
  } = useTicketPurchaseStore();

  const { writeContract, data: writeData, isPending: isWritePending, error: contractError } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Listen for StealthAddressFunded event to auto-complete payment
  useWatchContractEvent({
    address: currentEventAddress as `0x${string}` | undefined,
    abi: EVENT_CONTRACT_ABI,
    eventName: 'StealthAddressFunded',
    pollingInterval: 1000, // Poll every 1 second
    onLogs(logs) {
      console.log('🎯 StealthAddressFunded event received:', logs);
      console.log('🎯 Event listener config:', { 
        currentEventAddress, 
        stealthAddress, 
        currentStep, 
        enabled: !!stealthAddress && currentStep === 'waiting_for_funds' 
      });
      
      for (const log of logs) {
        const { stealthAddress: eventStealthAddr } = (log as any).args as { stealthAddress: string };
        
        // Check if this event is for our stealth address
        if (eventStealthAddr.toLowerCase() === stealthAddress?.toLowerCase()) {
          console.log('✅ Our stealth address has been funded, completing payment automatically');
          
          // Get the event address from the log
          const eventAddress = log.address;
          
          // Complete the payment automatically
          completePayment(eventAddress).then((success) => {
            const resolver = (window as any).stealthPaymentResolver;
            if (resolver) {
              clearTimeout(resolver.timeout);
              if (success) {
                resolver.resolve(true);
              } else {
                resolver.reject(new Error('Failed to complete payment'));
              }
              delete (window as any).stealthPaymentResolver;
            }
          }).catch((error) => {
            console.error('❌ Auto payment completion failed:', error);
            const resolver = (window as any).stealthPaymentResolver;
            if (resolver) {
              clearTimeout(resolver.timeout);
              resolver.reject(error);
              delete (window as any).stealthPaymentResolver;
            }
          });
          
          break;
        }
      }
    },
    enabled: !!stealthAddress && currentStep === 'waiting_for_funds',
  });

  // Debug: Log event listener status
  useEffect(() => {
    const isEnabled = !!stealthAddress && currentStep === 'waiting_for_funds';
    console.log('🎯 Event listener status:', {
      currentEventAddress,
      stealthAddress,
      currentStep,
      isEnabled
    });
  }, [currentEventAddress, stealthAddress, currentStep]);
  // Track transaction hash when it becomes available
  useEffect(() => {
    if (writeData && currentStep === 'purchasing') {
      setPurchaseTxHash(writeData);
      console.log('✅ Transaction hash received:', writeData);
    }
  }, [writeData, currentStep, setPurchaseTxHash]);

  // Track contract errors with detailed error handling
  useEffect(() => {
    if (contractError) {
      console.error('❌ Contract error:', contractError);
      let message = 'Transaction failed';
      
      // Handle common user errors
      if (contractError.message.includes('User rejected') || contractError.message.includes('user rejected')) {
        message = 'Transaction was rejected by user';
      } else if (contractError.message.includes('insufficient funds')) {
        message = 'Insufficient funds for transaction';
      } else if (contractError.message.includes('gas')) {
        message = 'Gas estimation failed - check gas amount';
      }
      // Handle potential contract-specific errors
      else if (contractError.message.includes('regular user')) {
        message = 'Only regular users can purchase tickets. Please check your user role registration.';
      } else if (contractError.message.includes('inactive') || contractError.message.includes('not active')) {
        message = 'This event is not currently active for ticket purchases.';
      } else if (contractError.message.includes('sold out') || contractError.message.includes('tickets available')) {
        message = 'No tickets available. This event is sold out.';
      } else if (contractError.message.includes('event date') || contractError.message.includes('expired')) {
        message = 'Tickets are no longer available. The event date has passed.';
      } else if (contractError.message.includes('already purchased') || contractError.message.includes('duplicate')) {
        message = 'You have already purchased a ticket for this event.';
      } else if (contractError.message.includes('stealth address') || contractError.message.includes('invalid address')) {
        message = 'Invalid stealth address. Please try generating a new one.';
      } else if (contractError.message.includes('gas amount') || contractError.message.includes('invalid gas')) {
        message = 'Invalid gas amount provided. Please adjust the gas amount.';
      } else if (contractError.message.includes('JPYM') || contractError.message.includes('token transfer')) {
        message = 'JPYM token transfer failed. Please ensure you have approved the contract and have sufficient balance.';
      } else {
        message = contractError.message;
      }
      
      setError(message);
      setCurrentStep('error');
    }
  }, [contractError, setError, setCurrentStep]);

  // Check if user is registered
  const { data: userRole } = useReadContract({
    address: MIZUPASS_IDENTITY_ADDRESS,
    abi: MIZUPASS_IDENTITY_ABI,
    functionName: 'getUserRole',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!address,
    }
  });

  // Check JPYM balance
  const { data: jpymBalance } = useReadContract({
    address: JPYM_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!address,
    }
  });

  // Note: Removed unused contract read hooks to avoid TypeScript warnings
  // These would be used for actual blockchain state checking when implemented

  // Validation step
  // Validation step (MOCK)
  const validatePurchase = useCallback(async (params: PurchaseParams): Promise<boolean> => {
    try {
      setCurrentStep('validating');
      setError(null);
      setProgress(5);
      
      console.log('🔍 Validating purchase...');
      
      // Mock delay for validation (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet');
      }

      // Check if user role is registered and is a regular user (role = 2)
      if (!userRole || userRole === 0) {
        throw new Error('Please register your user role first in your profile');
      }
      
      // Check if user is a regular user (not an event creator)
      if (userRole !== 2) { // UserRole.REGULAR_USER = 2
        throw new Error('Only regular users can purchase tickets. Event creators cannot buy tickets.');
      }

      // Check if user already has a ticket for this event (local storage)
      const existingTicket = getTicketByEventAddress(params.eventAddress);
      if (existingTicket) {
        throw new Error('You already have a ticket for this event');
      }

      // Mock JPYM balance check
      if (jpymBalance && params.ticketPrice) {
        const ticketPriceJPYM = Number(params.ticketPrice) / 1e4; 
        const platformFeeJPYM = 1; 
        const totalCostJPYM = ticketPriceJPYM + platformFeeJPYM;
        const totalCostRaw = BigInt(Math.floor(totalCostJPYM * 1e4)); 
        const userBalanceRaw = BigInt(jpymBalance.toString()); 
        
        console.log('💰 JPYM Balance Check (Mock):', {
          ticketPrice: ticketPriceJPYM + ' JPYM',
          platformFee: platformFeeJPYM + ' JPYM',
          totalCost: totalCostJPYM.toFixed(2) + ' JPYM',
          userBalance: (Number(jpymBalance.toString()) / 1e4).toFixed(2) + ' JPYM',
          sufficient: userBalanceRaw >= totalCostRaw
        });
        
        if (userBalanceRaw < totalCostRaw) {
          throw new Error(`Insufficient JPYM balance. Required: ${totalCostJPYM.toFixed(2)} JPYM`);
        }

        console.log('✅ JPYM balance is sufficient!');
      }

      console.log('✅ Purchase validation passed');
      setProgress(10);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Validation failed:', message);
      return false;
    }
  }, [isConnected, address, userRole, getTicketByEventAddress, jpymBalance, setCurrentStep, setError, setProgress]);

  // Generate stealth address (MOCK)
  const generateStealth = useCallback(async (): Promise<StealthAddress | null> => {
    try {
      setCurrentStep('generating_stealth');
      setProgress(10);
      
      console.log('🔐 Generating stealth address...');
      
      // Mock delay for realism (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock stealth address
      const mockStealthData = {
        address: `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`,
        privateKey: `0x${Math.random().toString(16).substring(2, 66).padStart(64, '0')}`,
        ephemeralPublicKey: `0x${Math.random().toString(16).substring(2, 66).padStart(64, '0')}`
      };
      
      setStealthData(mockStealthData.address, mockStealthData.privateKey);
      
      console.log('✅ Mock stealth address generated:', mockStealthData.address);
      setProgress(20);
      return mockStealthData;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate stealth address';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Stealth generation failed:', error);
      return null;
    }
  }, [setCurrentStep, setProgress, setStealthData, setError]);

  // Approve JPYM tokens (MOCK)
  const approveJPYM = useCallback(async (eventAddress: string, amount: string): Promise<boolean> => {
    try {
      setCurrentStep('approving_mjpy');
      setProgress(30);

      const amountJPYM = parseFloat(amount);
      
      console.log('🔄 Approving JPYM tokens...', { 
        eventAddress, 
        amount: amountJPYM + ' JPYM'
      });
      
      // Mock delay for realism (4 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Generate mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66).padStart(64, '0')}`;
      
      console.log('✅ Mock JPYM approval completed:', mockTxHash);
      setProgress(50);
      return true;
    } catch (error) {
      console.error('❌ JPYM approval failed:', error);
      setError('Failed to approve JPYM');
      setCurrentStep('error');
      return false;
    }
  }, [setCurrentStep, setProgress, setError]);

  // Main purchase transaction (Phase 1) - MOCK
  const purchaseTicket = useCallback(async (params: PurchaseParams, stealthAddr: string): Promise<string | null> => {
    try {
      setCurrentStep('purchasing');
      setProgress(60);

      console.log('🔄 Initiating ticket purchase...', { 
        eventAddress: params.eventAddress, 
        stealthAddress: stealthAddr,
        gasAmount: params.gasAmount + ' ETH'
      });
      
      // Mock delay for realism (5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Generate mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66).padStart(64, '0')}`;
      setPurchaseTxHash(mockTxHash);
      
      console.log('✅ Mock purchase transaction completed:', mockTxHash);
      console.log('💰 Stealth address funded with JPYM and gas');
      setProgress(70);
      return mockTxHash;
    } catch (error) {
      console.error('❌ Purchase transaction failed:', error);
      setError('Failed to purchase ticket');
      setCurrentStep('error');
      return null;
    }
  }, [setCurrentStep, setProgress, setError, setPurchaseTxHash]);

  // Wait for StealthAddressFunded event and auto-complete payment (MOCK)
  const waitForStealthFunds = useCallback(async (stealthAddr: string, eventAddress: string): Promise<boolean> => {
    try {
      setCurrentStep('waiting_for_funds');
      setProgress(75);

      console.log('⏳ Simulating stealth address funding...', { 
        stealthAddr, 
        eventAddress 
      });

      // Mock delay for stealth address funding (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('✅ Mock stealth address funded! Auto-completing payment...');
      
      // Automatically call complete payment
      return await completePayment(eventAddress);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed waiting for stealth funds';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Waiting for stealth funds failed:', error);
      return false;
    }
  }, [setCurrentStep, setProgress, setError]);

  // Complete payment (Phase 2) - MOCK
  const completePayment = useCallback(async (eventAddress: string): Promise<boolean> => {
    try {
      setCurrentStep('completing_payment');
      setProgress(85);

      console.log('🔄 Completing payment from stealth address...');
      console.log('💰 Stealth wallet paying organizer and platform fee...');
      
      // Mock delay for payment completion (4 seconds) - longer single step to avoid glitch
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Generate mock completion transaction hash and token ID
      const mockCompleteTxHash = `0x${Math.random().toString(16).substring(2, 66).padStart(64, '0')}`;
      const tokenId = Math.floor(Math.random() * 1000 + 1).toString();
      
      setCompleteTxHash(mockCompleteTxHash);
      setTokenId(tokenId);
      setProgress(100);

      console.log('✅ Payment completed successfully!', { 
        completeTxHash: mockCompleteTxHash, 
        tokenId,
        eventAddress 
      });
      console.log('🎫 NFT Ticket minted to stealth address!');
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete payment';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Payment completion failed:', error);
      return false;
    }
  }, [setCurrentStep, setProgress, setCompleteTxHash, setTokenId, setError]);

  // Main purchase flow orchestrator
  const startPurchase = useCallback(async (params: PurchaseParams) => {
    try {
      setLoading(true);
      resetPurchaseState();
      setCurrentEventAddress(params.eventAddress);

      console.log('🚀 Starting purchase with params:', params);

      // Phase 1: Validation
      const isValid = await validatePurchase(params);
      if (!isValid) return;

      // Phase 2: Generate stealth address
      const stealthData = await generateStealth();
      if (!stealthData) return;

      // Phase 3: Approve JPYM tokens
      // Convert ticket price from API format (1e4) to JPYM units, then add platform fee
      const ticketPriceJPYM = parseFloat(params.ticketPrice) / 1e4; // Convert from 1e4 to JPYM
      const totalCostJPYM = ticketPriceJPYM + 1; // +1 JPYM for platform fee
      const approved = await approveJPYM(params.eventAddress, totalCostJPYM.toString());
      if (!approved) return;

      // Wait for approval confirmation
      // Note: In a real app, you'd want to wait for the approval transaction to be confirmed
      // before proceeding. For now, we'll continue immediately.

      // Phase 4: Purchase ticket (Phase 1 of contract)
      const txHash = await purchaseTicket(params, stealthData.address);
      if (!txHash) return;

      // Phase 5: Wait for funds at stealth address and auto-complete payment
      const paymentCompleted = await waitForStealthFunds(stealthData.address, params.eventAddress);
      if (!paymentCompleted) return;


      // Phase 6: Save ticket data
      const ticketData: TicketData = {
        eventAddress: params.eventAddress,
        stealthAddress: stealthData.address,
        stealthPrivateKey: stealthData.privateKey,
        tokenId: "1", // Should come from contract events
        ticketPrice: params.ticketPrice,
        purchaseDate: new Date().toISOString(),
        mainWallet: params.userAddress,
        purchaseTxHash: txHash,
        completeTxHash: "", // Will be updated
        eventName: "Event Name", // Should come from event data
        eventDate: "2025-09-15", // Should come from event data
        ephemeralPublicKey: stealthData.ephemeralPublicKey,
      };

      addTicket(ticketData);
      setCurrentStep('success');
      setProgress(100);

      console.log('🎉 Purchase completed successfully!');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed';
      console.error('❌ Purchase error:', error);
      setError(message);
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    resetPurchaseState,
    setCurrentEventAddress,
    validatePurchase,
    generateStealth,
    approveJPYM,
    purchaseTicket,
    waitForStealthFunds,
    completePayment,
    addTicket,
    setCurrentStep,
    setProgress,
    setError,
  ]);

  // Emergency recovery function
  const emergencyRecovery = useCallback(async (eventAddress: string, stealthAddr: string) => {
    try {
      console.log('🆘 Initiating emergency recovery...');

      writeContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'emergencyCompletePayment',
        args: [stealthAddr as `0x${string}`],
      });

      if (writeData) {
        console.log('✅ Emergency recovery initiated:', writeData);
        setCurrentStep('success');
        return writeData;
      }

      throw new Error('Failed to initiate emergency recovery');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Emergency recovery failed';
      console.error('❌ Emergency recovery failed:', error);
      setError(message);
      return null;
    }
  }, [writeContract, writeData, setCurrentStep, setError]);

  return {
    // State
    currentStep,
    progress,
    error,
    isLoading: isLoading || isWritePending || isConfirming,
    emergencyRecoveryAvailable,
    stealthAddress,    
    // Actions
    startPurchase,
    resetPurchaseState,
    emergencyRecovery,
    
    // Transaction state
    isWritePending,
    isConfirming,
    writeData,
    
    // Individual functions for testing
    validatePurchase,
    generateStealth,
    approveJPYM,
    purchaseTicket,
    waitForStealthFunds,
    completePayment,
  };
};