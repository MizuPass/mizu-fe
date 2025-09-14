import React from 'react';
import { useTicketPurchase } from '../../hooks/useTicketPurchase';
import type { PurchaseParams } from '../../types/ticket';
import { PurchaseProgress } from './PurchaseProgress';
import { PurchaseForm } from './PurchaseForm';
import { PurchaseStatus } from './PurchaseStatus';
import { EmergencyRecovery } from './EmergencyRecovery';
import { SuccessDisplay } from './SuccessDisplay';

interface TicketPurchaseFlowProps {
  eventAddress: string;
  eventName: string;
  ticketPrice: string;
  eventDate: string;
  gasAmount?: string; // ETH amount for gas (default: "0.001")
  isOpen: boolean;
  onClose: () => void;
}

export const TicketPurchaseFlow: React.FC<TicketPurchaseFlowProps> = ({
  eventAddress,
  eventName,
  ticketPrice,
  eventDate,
  gasAmount = "0.001", // Default gas amount
  isOpen,
  onClose,
}) => {
  const {
    currentStep,
    progress,
    error,
    isLoading,
    emergencyRecoveryAvailable,
    startPurchase,
    resetPurchaseState,
    emergencyRecovery,
  } = useTicketPurchase();

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
    onClose();
  };

  const handleEmergencyRecovery = () => {
    emergencyRecovery(eventAddress);
  };

  const renderContent = () => {
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
            onClose={handleClose}
          />
        );

      case 'emergency_recovery':
        return (
          <EmergencyRecovery
            eventAddress={eventAddress}
            onRetry={handleRetry}
            onEmergencyRecovery={handleEmergencyRecovery}
            onClose={handleClose}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Ticket</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar - Show for all steps except IDLE, SUCCESS, ERROR */}
        {!['idle', 'success', 'error', 'emergency_recovery'].includes(currentStep) && (
          <PurchaseProgress progress={progress} currentStep={currentStep} />
        )}

        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};