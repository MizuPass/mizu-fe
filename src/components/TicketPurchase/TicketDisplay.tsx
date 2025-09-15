import React from 'react';
import QRCode from 'react-qr-code';

interface TicketDisplayProps {
  eventName: string;
  ticketPrice: string;
  onClose: () => void;
}

export const TicketDisplay: React.FC<TicketDisplayProps> = ({
  eventName,
  ticketPrice,
  onClose,
}) => {
  // Format ticket price from raw format (1e4) to display format
  const formatTicketPrice = (rawPrice: string): string => {
    const priceNumber = Number(rawPrice) / 1e4; // Convert from 1e4 format
    const platformFee = 1; // 1 JPYM platform fee
    const totalPaid = priceNumber + platformFee;
    return totalPaid.toFixed(2);
  };

  // Generate mock ticket data
  const ticketData = {
    ticketId: `TKT-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
    eventDate: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    purchaseDate: new Date().toLocaleDateString(),
    stealthAddress: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
  };

  // Mock QR code data (in real implementation, this would be actual ticket data)
  const mockQRData = `MIZU-TICKET:${ticketData.ticketId}:${eventName}:${ticketData.stealthAddress}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/mizuIcons/mizu-www.svg" alt="Ticket" className="w-6 h-6 animate-bounce" />
            <h2 className="text-xl font-bold text-gray-800">Your Ticket</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Ticket Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Event Header */}
            <div className="text-center mb-4">
              <div className="mb-2">
                <img src="/mizuIcons/mizu-success.svg" alt="Verified" className="w-10 h-10 mx-auto animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{eventName}</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200">
                <img src="/mizuIcons/mizu-love.svg" alt="Valid" className="w-4 h-4" />
                <span className="text-xs font-medium text-green-800">Valid Ticket</span>
              </div>
            </div>

            {/* QR Code Section - Same style as ZK Passport */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <img src="/mizuIcons/mizu-tired.svg" alt="QR" className="w-6 h-6" />
                  Scan at Venue
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Present this QR code at the event entrance
                </p>
                
                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-xl shadow-lg inline-block">
                  <div className="w-32 h-32 mx-auto">
                    <QRCode
                      value={mockQRData}
                      size={256}
                      style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details Card */}
            <div className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <img src="/mizuIcons/mizu-attention.svg" alt="Details" className="w-5 h-5" />
                <h4 className="font-bold text-gray-800">Ticket Details</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Ticket ID:</span>
                  <span className="text-sm font-mono font-semibold text-gray-800">{ticketData.ticketId}</span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Amount Paid:</span>
                  <span className="text-sm font-semibold text-green-600">{formatTicketPrice(ticketPrice)} JPYM</span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Purchase Date:</span>
                  <span className="text-sm font-semibold text-gray-800">{ticketData.purchaseDate}</span>
                </div>
              </div>
            </div>

            {/* Privacy Badge */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <img src="/mizuIcons/mizu-success.svg" alt="Shield" className="w-5 h-5 animate-bounce" />
                  <h4 className="font-bold text-purple-800">Privacy Protected</h4>
                </div>
                <p className="text-xs text-purple-700 leading-relaxed mb-2">
                  Purchased with stealth address for maximum privacy
                </p>
                <div className="text-xs font-mono text-purple-600 bg-white/50 rounded px-2 py-1">
                  {ticketData.stealthAddress}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'var(--body1)' }}
          >
            <div className="flex items-center justify-center gap-2">
              <img src="/mizuIcons/mizu-success.svg" alt="Done" className="w-5 h-5" />
              <span>Got it!</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};