import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { kaigan } from './chains';

export const config = getDefaultConfig({
  appName: 'MizuPass',
  projectId: 'mizu-pass-project-id', // Replace with your WalletConnect project ID
  chains: [kaigan],
  ssr: false, // If your dApp uses server side rendering (SSR)
});