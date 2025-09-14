// Ticket Purchase Flow Types

export type PurchaseStep = 
  | 'idle'
  | 'validating'
  | 'generating_stealth'
  | 'approving_mjpy'
  | 'purchasing'
  | 'waiting_for_funds'
  | 'setting_up_stealth'
  | 'completing_payment'
  | 'success'
  | 'error'
  | 'emergency_recovery';

export interface KeyPair {
  privateKey: string;
  publicKey: string;
  prefix: number;
}

export interface StealthAddress {
  address: string;
  privateKey: string;
  // Enhanced stealth address metadata
  ephemeralPublicKey?: string;
  ephemeralPrefix?: number;
  metaAddress?: string;
}

export interface StealthMetaAddress {
  spendingKey: KeyPair;
  viewingKey: KeyPair;
  metaAddress: string;
}

export interface PurchaseParams {
  eventAddress: string;
  gasAmount: string;
  ticketPrice: string;
  userAddress: string;
  quantity?: number; // Number of tickets to purchase (default 1)
}

export interface PurchaseProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  message: string;
}

export interface PurchaseError {
  type: 'validation' | 'transaction1' | 'transaction2' | 'network' | 'cryptographic';
  message: string;
  canRetry: boolean;
  needsEmergencyRecovery: boolean;
}

export interface TicketPurchaseState {
  currentStep: PurchaseStep;
  progress: number;
  error: string | null;
  isLoading: boolean;
  stealthAddress?: string;
  stealthPrivateKey?: string;
  purchaseTxHash?: string;
  completeTxHash?: string;
  tokenId?: string;
  emergencyRecoveryAvailable?: boolean;
}

export interface TicketData {
  eventAddress: string;
  stealthAddress: string;
  stealthPrivateKey: string;
  tokenId: string;
  ticketPrice: string;
  purchaseDate: string;
  mainWallet: string;
  purchaseTxHash: string;
  completeTxHash: string;
  eventName: string;
  eventDate: string;
  // Enhanced stealth metadata
  ephemeralPublicKey?: string;
  metaAddress?: string;
}

export const PURCHASE_STEP_MESSAGES: Record<PurchaseStep, string> = {
  idle: "Ready to purchase",
  validating: "Validating user and event...",
  generating_stealth: "🔐 Generating stealth address...",
  approving_mjpy: "💰 Approving MJPY spending...",
  purchasing: "🎫 Purchasing ticket...",
  waiting_for_funds: "⏳ Waiting for funds to arrive...",
  setting_up_stealth: "🛠️ Setting up stealth wallet...",
  completing_payment: "✅ Completing payment...",
  success: "🎉 Ticket purchased successfully!",
  error: "❌ Purchase failed",
  emergency_recovery: "🚨 Emergency recovery available"
};

export const PROGRESS_STEPS = [
  { id: 1, name: "Generate stealth address", weight: 10 },
  { id: 2, name: "Approve MJPY", weight: 20 },
  { id: 3, name: "Purchase ticket", weight: 30 },
  { id: 4, name: "Setup stealth wallet", weight: 15 },
  { id: 5, name: "Complete payment", weight: 20 },
  { id: 6, name: "Receive ticket", weight: 5 }
];