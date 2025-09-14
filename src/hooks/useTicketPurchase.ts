import { useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { useTicketPurchaseStore } from '../stores/ticketPurchaseStore';
import type { PurchaseParams, StealthAddress, TicketData } from '../types/ticket';
import { StealthAddressService } from '../utils/stealthAddress';
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
    stealthPrivateKey,
    emergencyRecoveryAvailable,
    setCurrentStep,
    setProgress,
    setError,
    setLoading,
    setStealthData,
    setPurchaseTxHash,
    setCompleteTxHash,
    setTokenId,
    setEmergencyRecovery,
    resetPurchaseState,
    addTicket,
    getTicketByEventAddress,
  } = useTicketPurchaseStore();

  const { writeContract, data: writeData, isPending: isWritePending, error: contractError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Track transaction hash when it becomes available
  useEffect(() => {
    if (writeData && currentStep === 'purchasing') {
      setPurchaseTxHash(writeData);
      console.log('✅ Transaction hash received:', writeData);
    }
  }, [writeData, currentStep, setPurchaseTxHash]);

  // Track contract errors
  useEffect(() => {
    if (contractError) {
      console.error('❌ Contract error:', contractError);
      let message = 'Transaction failed';
      if (contractError.message.includes('User rejected') || contractError.message.includes('user rejected')) {
        message = 'Transaction was rejected by user';
      } else if (contractError.message.includes('insufficient funds')) {
        message = 'Insufficient funds for transaction';
      } else if (contractError.message.includes('gas')) {
        message = 'Gas estimation failed';
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

  // Validation step
  const validatePurchase = useCallback(async (params: PurchaseParams): Promise<boolean> => {
    try {
      setCurrentStep('validating');
      setError(null);
      setProgress(5);
      
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet');
      }

      // Check if user role is registered (should be 1 or 2, not 0)
      if (!userRole || userRole === 0) {
        throw new Error('Please register your user role first in your profile');
      }

      // Check if user already has a ticket for this event
      const existingTicket = getTicketByEventAddress(params.eventAddress);
      if (existingTicket) {
        throw new Error('You already have a ticket for this event');
      }

      // Check JPYM balance
      if (jpymBalance && params.ticketPrice) {
        // JPYM uses 4 decimals, so jpymBalance is in 1e4 format from contract
        // params.ticketPrice is also in 1e4 format from API
        const ticketPriceJPYM = Number(params.ticketPrice) / 1e4; // Convert API format to JPYM
        const platformFeeJPYM = 1; // 1 JPYM platform fee
        const totalCostJPYM = ticketPriceJPYM + platformFeeJPYM;
        const totalCostRaw = BigInt(Math.floor(totalCostJPYM * 1e4)); // Convert back to 1e4 format for comparison
        const userBalanceRaw = BigInt(jpymBalance.toString()); // Already in 1e4 format from contract
        
        console.log('💰 JPYM Balance Check:', {
          rawTicketPrice: params.ticketPrice,
          ticketPriceJPYM: ticketPriceJPYM,
          userBalanceJPYM: (Number(jpymBalance.toString()) / 1e4).toFixed(2), // Convert to display format
          totalCostJPYM: totalCostJPYM.toFixed(2),
          userBalanceRaw: userBalanceRaw.toString(),
          totalCostRaw: totalCostRaw.toString(),
          hasSufficientBalance: userBalanceRaw >= totalCostRaw
        });
        
        if (userBalanceRaw < totalCostRaw) {
          throw new Error(`Insufficient JPYM balance. Required: ${totalCostJPYM.toFixed(2)} JPYM`);
        }

        console.log('✅ JPYM balance is sufficient!');
      }

      console.log('✅ Purchase validation passed');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Validation failed:', message);
      return false;
    }
  }, [isConnected, address, userRole, getTicketByEventAddress, jpymBalance, setCurrentStep, setError, setProgress]);

  // Generate stealth address
  const generateStealth = useCallback(async (): Promise<StealthAddress | null> => {
    try {
      setCurrentStep('generating_stealth');
      setProgress(10);
      
      const stealthData = StealthAddressService.generateStealthAddress();
      setStealthData(stealthData.address, stealthData.privateKey);
      
      console.log('✅ Stealth address generated:', stealthData.address);
      return stealthData;
    } catch (error) {
      const message = 'Failed to generate stealth address';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Stealth generation failed:', error);
      return null;
    }
  }, [setCurrentStep, setProgress, setStealthData, setError]);

  // Approve JPYM tokens
  const approveJPYM = useCallback(async (eventAddress: string, amount: string): Promise<boolean> => {
    try {
      setCurrentStep('approving_mjpy');
      setProgress(30);

      // JPYM uses 4 decimals, so convert amount to 1e4 format
      const amountJPYM = parseFloat(amount);
      const amountRaw = BigInt(Math.floor(amountJPYM * 1e4)); // Convert to 1e4 format
      
      console.log('🔄 Approving JPYM tokens...', { 
        eventAddress, 
        amountJPYM: amountJPYM + ' JPYM',
        amountRaw: amountRaw.toString() + ' (raw 1e4 format)'
      });
      
      await writeContract({
        address: JPYM_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [eventAddress as `0x${string}`, amountRaw],
      });

      console.log('✅ JPYM approval transaction submitted');
      return true;
    } catch (error) {
      console.error('❌ JPYM approval failed:', error);
      
      let message = 'Failed to approve JPYM';
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
          message = 'JPYM approval was rejected by user';
        } else if (error.message.includes('insufficient funds')) {
          message = 'Insufficient funds for approval transaction';
        } else {
          message = 'JPYM approval failed: ' + error.message;
        }
      }
      
      setError(message);
      setCurrentStep('error');
      return false;
    }
  }, [writeContract, setCurrentStep, setProgress, setError]);

  // Main purchase transaction (Phase 1)
  const purchaseTicket = useCallback(async (params: PurchaseParams, stealthAddr: string): Promise<string | null> => {
    try {
      setCurrentStep('purchasing');
      setProgress(60);

      const gasAmountWei = parseUnits(params.gasAmount, 18);

      console.log('🔄 Initiating ticket purchase...', { 
        eventAddress: params.eventAddress, 
        stealthAddress: stealthAddr,
        gasAmount: params.gasAmount + ' ETH',
        gasAmountWei: gasAmountWei.toString()
      });
      
      await writeContract({
        address: params.eventAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'purchaseTicket',
        args: [stealthAddr as `0x${string}`, gasAmountWei],
        value: gasAmountWei, // Send ETH for gas
      });

      // The transaction hash will be available in writeData after the call
      console.log('✅ Purchase transaction submitted successfully');
      return 'pending'; // Return a placeholder - the actual hash will be in writeData
    } catch (error) {
      console.error('❌ Purchase transaction failed:', error);
      
      // Provide more detailed error information
      let message = 'Failed to purchase ticket';
      if (error instanceof Error) {
        message = error.message;
        // Check for common Web3 errors
        if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
          message = 'Transaction was rejected by user';
        } else if (error.message.includes('insufficient funds')) {
          message = 'Insufficient funds for transaction';
        } else if (error.message.includes('gas')) {
          message = 'Gas estimation failed - check gas amount';
        } else if (error.message.includes('revert')) {
          message = 'Transaction reverted - ' + error.message;
        } else if (error.message.includes('network')) {
          message = 'Network error - please try again';
        }
      }
      
      setError(message);
      setCurrentStep('error');
      return null;
    }
  }, [writeContract, setCurrentStep, setProgress, setError]);

  // Wait for funds at stealth address
  const waitForStealthFunds = useCallback(async (stealthAddr: string, expectedAmount: bigint): Promise<boolean> => {
    try {
      setCurrentStep('waiting_for_funds');
      setProgress(75);

      console.log('⏳ Waiting for JPYM funds at stealth address...', { 
        stealthAddr, 
        expectedAmount: formatUnits(expectedAmount, 18) + ' JPYM' 
      });

      // Use the service to wait for JPYM balance
      const received = await StealthAddressService.waitForMJPYBalance(
        stealthAddr,
        expectedAmount,
        JPYM_TOKEN_ADDRESS,
        undefined as any, // TODO: Get provider from wagmi config
        60000 // 60 second timeout
      );

      if (!received) {
        throw new Error('Timeout waiting for funds at stealth address');
      }

      console.log('✅ JPYM funds received at stealth address');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed waiting for stealth funds';
      setError(message);
      setCurrentStep('error');
      console.error('❌ Waiting for stealth funds failed:', error);
      return false;
    }
  }, [setCurrentStep, setProgress, setError]);

  // Complete payment (Phase 2)
  const completePayment = useCallback(async (params: PurchaseParams): Promise<boolean> => {
    try {
      setCurrentStep('setting_up_stealth');
      setProgress(85);

      if (!stealthPrivateKey) {
        throw new Error('No stealth private key available');
      }

      setCurrentStep('completing_payment');
      setProgress(95);

      console.log('🔄 Completing payment from stealth address...');

      // Note: In a real implementation, you'd need to create a new signer with the stealth private key
      // and call completePayment with that signer. For now, we'll simulate this.
      
      // TODO: Implement stealth wallet signer
      // const stealthWallet = new ethers.Wallet(stealthPrivateKey, provider);
      // await stealthWallet.sendTransaction({
      //   to: params.eventAddress,
      //   data: eventContract.interface.encodeFunctionData('completePayment', [])
      // });

      // Simulate completion for now
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
      setCompleteTxHash(mockTxHash);

      // Mock token ID
      const tokenId = Math.floor(Math.random() * 1000).toString();
      setTokenId(tokenId);

      console.log('✅ Payment completed successfully!', { tokenId });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete payment';
      setError(message);
      setEmergencyRecovery(true);
      setCurrentStep('emergency_recovery');
      console.error('❌ Payment completion failed:', error);
      console.log('🆘 Emergency recovery is now available');
      return false;
    }
  }, [stealthPrivateKey, setCurrentStep, setProgress, setCompleteTxHash, setTokenId, setError, setEmergencyRecovery]);

  // Main purchase flow orchestrator
  const startPurchase = useCallback(async (params: PurchaseParams) => {
    try {
      setLoading(true);
      resetPurchaseState();

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

      // Phase 5: Wait for funds at stealth address
      const totalCostWei = parseUnits(totalCostJPYM.toString(), 18);
      const fundsReceived = await waitForStealthFunds(stealthData.address, totalCostWei);
      if (!fundsReceived) return;

      // Phase 6: Complete payment (Phase 2 of contract)
      const completed = await completePayment(params);
      if (!completed) return;

      // Phase 7: Save ticket data
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

      await writeContract({
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