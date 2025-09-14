import React from 'react';
import type { PurchaseStep } from '../../types/ticket';
import { PURCHASE_STEP_MESSAGES, PROGRESS_STEPS } from '../../types/ticket';

interface PurchaseProgressProps {
  progress: number;
  currentStep: PurchaseStep;
}

export const PurchaseProgress: React.FC<PurchaseProgressProps> = ({
  progress,
  currentStep,
}) => {
  const getCurrentStepIndex = () => {
    const stepOrder: PurchaseStep[] = [
      'generating_stealth',
      'approving_mjpy',
      'purchasing',
      'setting_up_stealth',
      'completing_payment',
    ];
    return stepOrder.indexOf(currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="text-center text-sm text-gray-600">
        {progress}% Complete
      </div>

      {/* Current Step Message */}
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-800 mb-2">
          {PURCHASE_STEP_MESSAGES[currentStep]}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="space-y-2">
        {PROGRESS_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : isCurrent
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3">
                <div
                  className={`text-sm font-medium ${
                    isCompleted
                      ? 'text-green-800'
                      : isCurrent
                      ? 'text-blue-800'
                      : 'text-gray-600'
                  }`}
                >
                  {step.name}
                </div>
              </div>
              {isCurrent && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};