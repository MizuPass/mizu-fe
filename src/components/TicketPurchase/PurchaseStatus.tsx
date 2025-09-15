import React from 'react';
import type { PurchaseStep } from '../../types/ticket';

interface PurchaseStatusProps {
  currentStep: PurchaseStep;
  progress: number;
  eventName: string;
}

export const PurchaseStatus: React.FC<PurchaseStatusProps> = ({
  currentStep,
  eventName,
}) => {
  // Map purchase steps to numbered progress
  const getStepNumber = (step: PurchaseStep): number => {
    switch (step) {
      case 'validating': return 1;
      case 'generating_stealth': return 2; 
      case 'approving_mjpy': return 3;
      case 'purchasing': return 4;
      case 'waiting_for_funds': return 4; // Same as purchasing 
      case 'completing_payment': return 5;
      default: return 1;
    }
  };

  const getCurrentStepMessage = (): string => {
    switch (currentStep) {
      case 'validating': return 'Validating eligibility and balance...';
      case 'generating_stealth': return 'Generating stealth address for privacy...';
      case 'approving_mjpy': return 'Approving JPYM tokens...';
      case 'purchasing': return 'Waiting for wallet confirmation...';
      case 'waiting_for_funds': return 'Waiting for funds to arrive...';
      case 'completing_payment': return 'Finalizing your ticket purchase...';
      default: return 'Processing your purchase...';
    }
  };

  const currentStepNum = getStepNumber(currentStep);
  const totalSteps = 5;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-6 h-6 animate-spin" />
          Purchasing Your Ticket
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {getCurrentStepMessage()}
        </p>
        
        {/* Progress Steps - Vertical Layout */}
        <div className="space-y-2 mb-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentStepNum >= 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="text-xs font-medium">1</span>
            <span className="text-xs">Validate Eligibility</span>
            {currentStep === 'validating' && (
              <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-3 h-3 animate-spin ml-auto" />
            )}
            {currentStepNum > 1 && (
              <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-3 h-3 ml-auto" />
            )}
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentStepNum >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="text-xs font-medium">2</span>
            <span className="text-xs">Generate Stealth Address</span>
            {currentStep === 'generating_stealth' && (
              <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-3 h-3 animate-spin ml-auto" />
            )}
            {currentStepNum > 2 && (
              <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-3 h-3 ml-auto" />
            )}
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentStepNum >= 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="text-xs font-medium">3</span>
            <span className="text-xs">Approve JPYM Tokens</span>
            {currentStep === 'approving_mjpy' && (
              <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-3 h-3 animate-spin ml-auto" />
            )}
            {currentStepNum > 3 && (
              <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-3 h-3 ml-auto" />
            )}
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentStepNum >= 4 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="text-xs font-medium">4</span>
            <span className="text-xs">Purchase Ticket</span>
            {(currentStep === 'purchasing' || currentStep === 'waiting_for_funds') && (
              <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-3 h-3 animate-spin ml-auto" />
            )}
            {currentStepNum > 4 && (
              <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-3 h-3 ml-auto" />
            )}
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentStepNum >= 5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="text-xs font-medium">5</span>
            <span className="text-xs">Complete Purchase</span>
            {currentStep === 'completing_payment' && (
              <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-3 h-3 animate-spin ml-auto" />
            )}
            {currentStepNum > 5 && (
              <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-3 h-3 ml-auto" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(currentStepNum / totalSteps) * 100}%`,
              backgroundColor: 'var(--primary)'
            }}
          ></div>
        </div>
        
        {/* Event info */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <img src="/mizuIcons/mizu-love.svg" alt="Event" className="w-4 h-4" />
          <p className="text-xs text-gray-600">
            Purchasing ticket for <strong>{eventName}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};