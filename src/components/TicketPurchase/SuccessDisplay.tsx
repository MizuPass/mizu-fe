import React from 'react';

interface SuccessDisplayProps {
  eventName: string;
  ticketPrice: string;
  onClose: () => void;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  eventName,
  ticketPrice,
  onClose,
}) => {
  return (
    <div className="text-center space-y-6">
      {/* Success Animation */}
      <div className="relative">
        <div className="text-6xl animate-bounce">🎉</div>
        <div className="absolute inset-0 animate-ping">
          <div className="w-16 h-16 bg-green-400 rounded-full opacity-25 mx-auto"></div>
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-green-600">
          Ticket Purchased Successfully!
        </h3>
        <p className="text-gray-600">
          Your ticket for <strong>{eventName}</strong> has been purchased.
        </p>
      </div>

      {/* Purchase Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Event:</span>
          <span className="font-semibold">{eventName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Paid:</span>
          <span className="font-semibold">{ticketPrice} MJPY</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Purchase Date:</span>
          <span className="font-semibold">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-2">
          <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-blue-800">Privacy Protected</span>
        </div>
        <p className="text-sm text-blue-700 text-center">
          Your ticket was purchased using a stealth address for maximum privacy.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => {
            // Navigate to My Tickets page
            window.location.href = '/app/dashboard';
          }}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View My Tickets
        </button>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};