import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';
import { config } from '../config/wagmi';

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: '#0E76FD',
              accentColorForeground: 'white',
              borderRadius: 'small',
              fontStack: 'system',
            }),
            darkMode: darkTheme({
              accentColor: '#0E76FD',
              accentColorForeground: 'white',
              borderRadius: 'small',
              fontStack: 'system',
            }),
          }}
          showRecentTransactions={true}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};