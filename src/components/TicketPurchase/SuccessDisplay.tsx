import React, { useState } from 'react';
import { TicketDisplay } from './TicketDisplay';

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
  const [showTicket, setShowTicket] = useState(false);

  // Format ticket price from raw format (1e4) to display format
  const formatTicketPrice = (rawPrice: string): string => {
    const priceNumber = Number(rawPrice) / 1e4; // Convert from 1e4 format
    const platformFee = 1; // 1 JPYM platform fee
    const totalPaid = priceNumber + platformFee;
    return totalPaid.toFixed(2);
  };
  return (
    <div className="text-center space-y-6">
      {/* Cute Success Header */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <img src="/mizuIcons/mizu-success.svg" alt="Success" className="w-20 h-20 mx-auto animate-bounce" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/mizuIcons/mizu-love.svg" alt="Success" className="w-8 h-8 animate-pulse" />
          <h2 className="text-2xl font-bold text-green-600">
            Ticket Purchased!
          </h2>
          <img src="/mizuIcons/mizu-love.svg" alt="Love" className="w-8 h-8 animate-bounce" />
        </div>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-4 h-4" />
          Your privacy-protected ticket is ready!
        </p>
      </div>

      {/* Event Celebration Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/mizuIcons/mizu-love.svg" alt="Event" className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg text-gray-800">{eventName}</h3>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-green-200">
            <img src="/mizuIcons/mizu-success.svg" alt="Confirmed" className="w-4 h-4" />
            <span className="text-xs font-medium text-green-800">Confirmed Purchase ✨</span>
          </div>
        </div>
      </div>

      {/* Cute Purchase Details Card */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/mizuIcons/mizu-tired.svg" alt="Receipt" className="w-6 h-6" />
          <h3 className="font-bold text-gray-800">Purchase Receipt</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <img src="/mizuIcons/mizu-www.svg" alt="Event" className="w-4 h-4" />
              <span className="text-gray-600">Event:</span>
            </div>
            <span className="font-semibold text-gray-800">{eventName}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-2">
              <img src="/mizuIcons/mizu-success.svg" alt="Amount" className="w-4 h-4" />
              <span className="text-gray-600">Amount Paid:</span>
            </div>
            <span className="font-semibold text-green-600">{formatTicketPrice(ticketPrice)} JPYM</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2">
              <img src="/mizuIcons/mizu-attention.svg" alt="Date" className="w-4 h-4" />
              <span className="text-gray-600">Purchase Date:</span>
            </div>
            <span className="font-semibold text-blue-600">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Privacy Achievement Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/mizuIcons/mizu-success.svg" alt="Shield" className="w-6 h-6 animate-bounce" />
            <h3 className="font-bold text-purple-800">Privacy Ninja Achievement!</h3>
          </div>
          <p className="text-sm text-purple-700 leading-relaxed">
            Your ticket was purchased using a <strong>stealth address</strong> for maximum privacy. 
            Nobody can link this purchase to your main wallet! ✨
          </p>
        </div>
      </div>

      {/* Cute Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => setShowTicket(true)}
          className="w-full px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: 'var(--body1)' }}
        >
          <div className="flex items-center justify-center gap-2">
            <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-5 h-5" />
            <span>View My Ticket</span>
            <img src="/mizuIcons/mizu-success.svg" alt="QR" className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => {
            // Navigate to My Tickets page
            window.location.href = '/app/dashboard';
          }}
          className="w-full py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border-2 border-gray-200"
        >
          <div className="flex items-center justify-center gap-2">
            <img src="/mizuIcons/mizu-tired.svg" alt="Dashboard" className="w-5 h-5" />
            <span>Go to Dashboard</span>
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
};