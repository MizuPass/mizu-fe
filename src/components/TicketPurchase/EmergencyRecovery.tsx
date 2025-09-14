import React, { useState } from 'react';

interface EmergencyRecoveryProps {
  eventAddress: string;
  onRetry: () => void;
  onEmergencyRecovery: () => void;
  onClose: () => void;
}

export const EmergencyRecovery: React.FC<EmergencyRecoveryProps> = ({
  eventAddress,
  onRetry,
  onEmergencyRecovery,
  onClose,
}) => {
  const [isRecovering, setIsRecovering] = useState(false);

  const handleEmergencyRecovery = async () => {
    setIsRecovering(true);
    try {
      await onEmergencyRecovery();
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Warning Icon */}
      <div className="text-6xl">🚨</div>

      {/* Error Message */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-red-600">
          Payment Completion Failed
        </h3>
        <p className="text-gray-600">
          The second transaction failed, but your funds are safe in the stealth address.
        </p>
      </div>

      {/* Options */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Recovery Options:</h4>
        <div className="text-sm text-yellow-700 space-y-2">
          <p>1. <strong>Retry Now:</strong> Try the payment completion again</p>
          <p>2. <strong>Emergency Recovery:</strong> Wait 24 hours, then use emergency function</p>
          <p>3. <strong>Manual Recovery:</strong> Contact support for assistance</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Retry Payment
        </button>

        <button
          onClick={handleEmergencyRecovery}
          disabled={isRecovering}
          className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
        >
          {isRecovering ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Initiating Recovery...
            </div>
          ) : (
            'Emergency Recovery (24h)'
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Close & Contact Support
        </button>
      </div>

      {/* Support Info */}
      <div className="text-sm text-gray-500">
        <p>Need help? Contact support with event address:</p>
        <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
          {eventAddress}
        </code>
      </div>
    </div>
  );
};