import React, { useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { JPYM_TOKEN_ADDRESS } from '../config/contracts';

export const DebugBalance: React.FC = () => {
  const { address } = useAccount();
  
  const { data: jpymBalance } = useBalance({
    address,
    token: JPYM_TOKEN_ADDRESS,
  });

  useEffect(() => {
    if (jpymBalance) {
      // Example ticket price from events (assuming 20000000 from API)
      const exampleTicketPrice = "20000000"; // This is what comes from API
      
      // JPYM uses 4 decimals, so both jpymBalance and ticketPrice are in 1e4 format
      const ticketPriceJPYM = Number(exampleTicketPrice) / 1e4; // Convert from API format to JPYM
      const platformFeeJPYM = 1; // 1 JPYM platform fee
      const totalCostJPYM = ticketPriceJPYM + platformFeeJPYM;
      const totalCostRaw = BigInt(Math.floor(totalCostJPYM * 1e4)); // Convert back to 1e4 format
      const userBalanceRaw = jpymBalance.value; // Already in 1e4 format from contract
      
      console.log('🔍 Debug Balance Information:', {
        // Raw values
        jpymBalanceRaw: jpymBalance.value.toString(),
        exampleTicketPriceFromAPI: exampleTicketPrice,
        
        // Converted values
        jpymBalanceJPYM: (Number(jpymBalance.value.toString()) / 1e4).toFixed(2),
        ticketPriceJPYM: ticketPriceJPYM,
        platformFeeJPYM: "1.0",
        totalCostJPYM: totalCostJPYM.toFixed(2),
        
        // Raw comparisons (both in 1e4 format)
        userBalanceRaw: userBalanceRaw.toString(),
        totalCostRaw: totalCostRaw.toString(),
        
        // Balance check
        hasSufficientBalance: userBalanceRaw >= totalCostRaw,
        shortfall: userBalanceRaw < totalCostRaw ? ((Number(totalCostRaw.toString()) - Number(userBalanceRaw.toString())) / 1e4).toFixed(2) + " JPYM" : "0"
      });
    }
  }, [jpymBalance]);

  if (!address) {
    return <div>Please connect wallet to debug balance</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Debug Balance Information</h3>
      {jpymBalance ? (
        <div>
          <p><strong>JPYM Balance:</strong> {(Number(jpymBalance.value.toString()) / 1e4).toFixed(2)} JPYM</p>
          <p><strong>Raw Wei Value:</strong> {jpymBalance.value.toString()}</p>
          <p><strong>Decimals:</strong> {jpymBalance.decimals}</p>
          <p>Check console for detailed balance calculations</p>
        </div>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
};