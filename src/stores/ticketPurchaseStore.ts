import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TicketPurchaseState, PurchaseStep, TicketData } from '../types/ticket';

interface TicketPurchaseStore extends TicketPurchaseState {
  // Actions
  setCurrentStep: (step: PurchaseStep) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setStealthData: (address: string, privateKey: string) => void;
  setPurchaseTxHash: (hash: string) => void;
  setCompleteTxHash: (hash: string) => void;
  setTokenId: (tokenId: string) => void;
  setEmergencyRecovery: (available: boolean) => void;
  resetPurchaseState: () => void;
  
  // Ticket storage
  tickets: TicketData[];
  addTicket: (ticket: TicketData) => void;
  getTickets: () => TicketData[];
  getTicketByEventAddress: (eventAddress: string) => TicketData | undefined;
  removeTicket: (eventAddress: string) => void;
  updateTicket: (eventAddress: string, updates: Partial<TicketData>) => void;
}

const initialState: TicketPurchaseState = {
  currentStep: 'idle',
  progress: 0,
  error: null,
  isLoading: false,
  emergencyRecoveryAvailable: false,
};

// Helper function to safely access localStorage
const getStoredTickets = (): TicketData[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('mizu-tickets');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tickets from localStorage:', error);
    return [];
  }
};

const storeTickets = (tickets: TicketData[]): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mizu-tickets', JSON.stringify(tickets));
    }
  } catch (error) {
    console.error('Error storing tickets to localStorage:', error);
  }
};

export const useTicketPurchaseStore = create<TicketPurchaseStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      tickets: getStoredTickets(),

      setCurrentStep: (step) => set({ currentStep: step }),
      setProgress: (progress) => set({ progress }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      setStealthData: (address, privateKey) => 
        set({ stealthAddress: address, stealthPrivateKey: privateKey }),
      
      setPurchaseTxHash: (hash) => set({ purchaseTxHash: hash }),
      setCompleteTxHash: (hash) => set({ completeTxHash: hash }),
      setTokenId: (tokenId) => set({ tokenId }),
      setEmergencyRecovery: (available) => set({ emergencyRecoveryAvailable: available }),
      
      resetPurchaseState: () => set({
        ...initialState,
        tickets: get().tickets, // Keep tickets
      }),

      addTicket: (ticket) => {
        const tickets = [...get().tickets, ticket];
        set({ tickets });
        storeTickets(tickets);
      },

      getTickets: () => get().tickets,
      
      getTicketByEventAddress: (eventAddress) => 
        get().tickets.find(ticket => 
          ticket.eventAddress.toLowerCase() === eventAddress.toLowerCase()
        ),

      removeTicket: (eventAddress) => {
        const tickets = get().tickets.filter(ticket => 
          ticket.eventAddress.toLowerCase() !== eventAddress.toLowerCase()
        );
        set({ tickets });
        storeTickets(tickets);
      },

      updateTicket: (eventAddress, updates) => {
        const tickets = get().tickets.map(ticket =>
          ticket.eventAddress.toLowerCase() === eventAddress.toLowerCase()
            ? { ...ticket, ...updates }
            : ticket
        );
        set({ tickets });
        storeTickets(tickets);
      },
    }),
    { name: 'ticket-purchase-store' }
  )
);