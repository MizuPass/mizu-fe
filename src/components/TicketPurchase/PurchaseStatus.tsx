import React from 'react';
import type { PurchaseStep } from '../../types/ticket';
import { PURCHASE_STEP_MESSAGES } from '../../types/ticket';

interface PurchaseStatusProps {
  currentStep: PurchaseStep;
  progress: number;
  eventName: string;
}

export const PurchaseStatus: React.FC<PurchaseStatusProps> = ({
  currentStep,
  progress,
  eventName,
}) => {
  const getStepIcon = (step: PurchaseStep) => {
    switch (step) {
      case 'validating':
        return '🔍';
      case 'generating_stealth':
        return '🔐';
      case 'approving_mjpy':
        return '💰';
      case 'purchasing':
        return '🎫';
      case 'waiting_for_funds':
        return '⏳';
      case 'setting_up_stealth':
        return '🛠️';
      case 'completing_payment':
        return '✅';
      default:
        return '🔄';
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Event Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800">{eventName}</h3>
        <p className="text-sm text-gray-600">Processing your ticket purchase...</p>
      </div>

      {/* Current Step Icon and Message */}
      <div className="space-y-4">
        <div className="text-6xl">
          {getStepIcon(currentStep)}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {PURCHASE_STEP_MESSAGES[currentStep]}
          </h3>
          
          {currentStep === 'waiting_for_funds' && (
            <p className="text-sm text-gray-600">
              Please wait while funds are transferred to the stealth address. 
              This usually takes a few seconds.
            </p>
          )}
          
          {currentStep === 'purchasing' && (
            <p className="text-sm text-gray-600">
              Please confirm the transaction in your wallet.
            </p>
          )}
          
          {currentStep === 'completing_payment' && (
            <p className="text-sm text-gray-600">
              Finalizing your ticket purchase. Almost done!
            </p>
          )}
        </div>
      </div>

      {/* Loading Animation */}
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      {/* Progress Text */}
      <div className="text-sm text-gray-500">
        Please don't close this window during the purchase process.
      </div>
    </div>
  );
};