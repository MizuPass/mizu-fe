import React from 'react';

interface PurchaseFormProps {
  eventName: string;
  ticketPrice: string;
  eventDate: string;
  gasAmount: string;
  onGasAmountChange: (amount: string) => void;
  onPurchase: () => void;
  isLoading: boolean;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  eventName,
  ticketPrice,
  eventDate,
  gasAmount,
  onGasAmountChange,
  onPurchase,
  isLoading,
}) => {
  // Convert ticketPrice from API format (1e4) to display format
  const ticketPriceJPYM = (parseFloat(ticketPrice) / 1e4).toFixed(0);
  const platformFee = '1';
  const totalCost = (parseFloat(ticketPriceJPYM) + parseFloat(platformFee)).toString();

  return (
    <div className="space-y-6">
      {/* Event Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{eventName}</h3>
        <p className="text-gray-600 text-sm">Date: {eventDate}</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Privacy Protected
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Ticket Price:</span>
          <span className="font-semibold">{ticketPriceJPYM} MJPY</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Platform Fee:</span>
          <span className="font-semibold">{platformFee} MJPY</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">Total Cost:</span>
          <span className="font-semibold text-blue-600">{totalCost} MJPY</span>
        </div>
      </div>

      {/* Gas Amount Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gas Amount (ETH)
        </label>
        <input
          type="number"
          step="0.001"
          value={gasAmount}
          onChange={(e) => onGasAmountChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.001"
        />
        <p className="text-xs text-gray-500 mt-1">
          ETH amount sent to stealth address for gas fees
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Privacy-First Purchase</h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>Your ticket will be purchased using a stealth address to protect your privacy. The transaction cannot be linked to your main wallet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={onPurchase}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Purchase Ticket for ${totalCost} MJPY`
        )}
      </button>
    </div>
  );
};