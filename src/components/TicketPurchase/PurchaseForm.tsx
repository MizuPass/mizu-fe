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
      {/* Cute Header */}
      <div className="text-center mb-6">
        <div className="mb-3">
          <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-16 h-16 mx-auto animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
          <img src="/mizuIcons/mizu-love.svg" alt="Purchase" className="w-8 h-8 animate-pulse" />
          Join Event
        </h2>
        <p className="text-sm text-gray-600">Get your privacy-protected ticket!</p>
      </div>

      {/* Event Information Card */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/mizuIcons/mizu-love.svg" alt="Event" className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg text-gray-800">{eventName}</h3>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
            <img src="/mizuIcons/mizu-success.svg" alt="Date" className="w-4 h-4" />
            <p className="text-sm">{eventDate}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-pink-200">
            <img src="/mizuIcons/mizu-attention.svg" alt="Shield" className="w-4 h-4" />
            <span className="text-xs font-medium text-pink-800">Privacy Protected</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Card */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/mizuIcons/mizu-tired.svg" alt="Money" className="w-6 h-6" />
          <h3 className="font-bold text-gray-800">Cost Breakdown</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-4 h-4" />
              <span className="text-gray-600">Ticket Price:</span>
            </div>
            <span className="font-semibold text-gray-800">{ticketPriceJPYM} JPYM</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2">
              <img src="/mizuIcons/mizu-success.svg" alt="Platform" className="w-4 h-4" />
              <span className="text-gray-600">Platform Fee:</span>
            </div>
            <span className="font-semibold text-blue-600">{platformFee} JPYM</span>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex justify-between items-center text-xl">
              <div className="flex items-center gap-2">
                <img src="/mizuIcons/mizu-love.svg" alt="Total" className="w-6 h-6 animate-pulse" />
                <span className="font-bold text-gray-800">Total Cost:</span>
              </div>
              <span className="font-bold text-green-600">{totalCost} JPYM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gas Configuration Card */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/mizuIcons/mizu-attention.svg" alt="Gas" className="w-6 h-6" />
          <h3 className="font-bold text-gray-800">Gas Configuration</h3>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 text-center">
            ETH Gas Amount
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              value={gasAmount}
              onChange={(e) => onGasAmountChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-semibold"
              placeholder="0.001"
            />
            <div className="absolute right-3 top-3 text-gray-500 font-medium">ETH</div>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <img src="/mizuIcons/mizu-tired.svg" alt="Info" className="w-4 h-4" />
            <p className="text-xs text-yellow-700 text-center">
              ETH sent to stealth address for transaction fees
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/mizuIcons/mizu-success.svg" alt="Shield" className="w-6 h-6 animate-bounce" />
            <h3 className="font-bold text-blue-800">Privacy-First Purchase</h3>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            Your ticket will be purchased using a <strong>stealth address</strong> to protect your privacy. 
            The transaction cannot be linked to your main wallet!
          </p>
        </div>
      </div>

      {/* Cute Purchase Button */}
      <button
        onClick={onPurchase}
        disabled={isLoading}
        className={`w-full px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'hover:scale-105'
        }`}
        style={{ 
          backgroundColor: isLoading ? undefined : 'var(--body1)'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <img src="/mizuIcons/mizu-tired.svg" alt="Loading" className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <img src="/mizuIcons/mizu-www.svg" alt="Purchase" className="w-5 h-5" />
            <span>Purchase Ticket for {totalCost} JPYM</span>
            <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-5 h-5" />
          </div>
        )}
      </button>
    </div>
  );
};