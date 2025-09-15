import React, { useEffect, useState } from 'react';
import { useTicketPurchase } from '../../hooks/useTicketPurchase';
import { useTicketPurchaseStore } from '../../stores/ticketPurchaseStore';
import type { PurchaseParams } from '../../types/ticket';
import { PurchaseForm } from './PurchaseForm';
import { PurchaseStatus } from './PurchaseStatus';
import { EmergencyRecovery } from './EmergencyRecovery';
import { SuccessDisplay } from './SuccessDisplay';
import { TicketDisplay } from './TicketDisplay';

interface TicketPurchaseFlowProps {
  eventAddress: string;
  eventName: string;
  ticketPrice: string;
  eventDate: string;
  gasAmount?: string; // ETH amount for gas (default: "0.001")
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback when purchase is successful
}

export const TicketPurchaseFlow: React.FC<TicketPurchaseFlowProps> = ({
  eventAddress,
  eventName,
  ticketPrice,
  eventDate,
  gasAmount = "0.001", // Default gas amount
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  
  const {
    currentStep,
    progress,
    error,
    isLoading,
    stealthAddress,
    startPurchase,
    resetPurchaseState,
    emergencyRecovery,
  } = useTicketPurchase();

  const { getTicketByEventAddress } = useTicketPurchaseStore();

  // Check for existing ticket when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingTicket = getTicketByEventAddress(eventAddress);
      setAlreadyPurchased(!!existingTicket);
      setShowTicket(false); // Reset ticket display when modal opens
    }
  }, [isOpen, eventAddress, getTicketByEventAddress]);

  const handlePurchase = async () => {
    const params: PurchaseParams = {
      eventAddress,
      gasAmount: gasAmount,
      ticketPrice,
      userAddress: '', // Will be filled by the hook from wallet
    };

    await startPurchase(params);
  };

  const handleRetry = () => {
    resetPurchaseState();
  };

  const handleClose = () => {
    resetPurchaseState();
    setShowTicket(false);
    onClose();
  };

  const handleSuccessClose = () => {
    resetPurchaseState();
    setShowTicket(false);
    onSuccess?.(); // Call onSuccess callback if provided
    onClose();
  };

  const handleEmergencyRecovery = () => {
    emergencyRecovery(eventAddress, stealthAddress || '');
  };

  const renderContent = () => {
    // Show immediate error if user already has a ticket
    if (alreadyPurchased) {
      return (
        <div className="text-center space-y-6">
          {/* Cute Error Header */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <img src="/mizuIcons/mizu-attention.svg" alt="Already Purchased" className="w-20 h-20 mx-auto animate-bounce" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/mizuIcons/mizu-tired.svg" alt="Error" className="w-8 h-8 animate-pulse" />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--body3)' }}>
                Already Purchased!
              </h2>
              <img src="/mizuIcons/mizu-tired.svg" alt="Error" className="w-8 h-8 animate-bounce" />
            </div>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-4 h-4" />
              You already have a ticket for this event
            </p>
          </div>

          {/* Event Information Card */}
          <div className="rounded-2xl p-6 border-2" style={{ 
            background: 'var(--body2)', 
            borderColor: 'var(--primary)'
          }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <img src="/mizuIcons/mizu-success.svg" alt="Event" className="w-6 h-6 animate-pulse" />
                <h3 className="font-bold text-lg text-gray-800">{eventName}</h3>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border-2" style={{ borderColor: 'var(--primary)' }}>
                <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-4 h-4" />
                <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Ticket Already Owned ✨</span>
              </div>
            </div>
          </div>

          {/* Privacy Achievement Card */}
          <div className="rounded-2xl p-6 border-2" style={{ 
            backgroundColor: 'var(--body4)', 
            borderColor: 'var(--body3)'
          }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <img src="/mizuIcons/mizu-success.svg" alt="Shield" className="w-6 h-6 animate-bounce" />
                <h3 className="font-bold" style={{ color: 'var(--body3)' }}>Privacy Protected Purchase</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your ticket was purchased using a <strong>stealth address</strong> for maximum privacy. 
                You're all set for the event! 🎉
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setShowTicket(true)}
              className="w-full px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: 'var(--body1)' }}
            >
              <div className="flex items-center justify-center gap-2">
                <img src="/mizuIcons/mizu-www.svg" alt="View Ticket" className="w-5 h-5" />
                <span>View My Ticket</span>
                <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Ticket Display Modal */}
          {showTicket && (
            <TicketDisplay
              eventName={eventName}
              ticketPrice={ticketPrice}
              onClose={() => setShowTicket(false)}
            />
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 'idle':
        return (
          <PurchaseForm
            eventName={eventName}
            ticketPrice={ticketPrice}
            eventDate={eventDate}
            gasAmount={gasAmount}
            onGasAmountChange={() => {}} // Gas amount is now a prop, not editable
            onPurchase={handlePurchase}
            isLoading={isLoading}
          />
        );

      case 'success':
        return (
          <SuccessDisplay
            eventName={eventName}
            ticketPrice={ticketPrice}
            onClose={handleSuccessClose}
          />
        );

      case 'emergency_recovery':
        return (
          <EmergencyRecovery
            eventAddress={eventAddress}
            onRetry={handleRetry}
            onEmergencyRecovery={handleEmergencyRecovery}
            onClose={handleSuccessClose}
          />
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg font-semibold">
              Purchase Failed
            </div>
            <div className="text-gray-600">{error}</div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return (
          <PurchaseStatus
            currentStep={currentStep}
            progress={progress}
            eventName={eventName}
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Background Frame */}
      <div 
        className="hidden lg:flex lg:fixed lg:inset-0 lg:w-screen lg:h-screen lg:z-0"
        style={{
          backgroundImage: 'url("/frame-background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border-2 border-gray-100 relative z-10">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center justify-center z-10"
        >
          <img src="/mizuIcons/mizu-tired.svg" alt="Close" className="w-4 h-4" />
        </button>

        {/* Card-style Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Ticket</h2>
          <p className="text-sm text-gray-600">Complete your privacy-protected purchase</p>
        </div>

        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};