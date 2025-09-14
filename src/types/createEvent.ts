// JSON object structure for creating events - Backend API contract
export interface CreateEventRequest {
  // Basic Event Information
  title: string                    // e.g., "Shibuya Esports Cup"
  category: string                 // e.g., "Gaming", "Loyalty", "Exclusive", "Concert", "Conference"
  description: string              // Detailed event description
  
  // Pricing and Capacity
  price: string                    // e.g., "¥2,800 MJPY" (frontend display format)
  priceAmountMJPY: number         // e.g., 2800 (numeric value for calculations)
  maxParticipants: number         // Maximum number of participants
  
  // Location and Timing
  location: string                 // e.g., "Virtual Arena", "Tokyo Network", "Roppongi, Tokyo"
  date: string                     // e.g., "March 28, 2025", "365 Days Access", "Every Saturday"
  startDateTime?: string           // ISO 8601 format: "2025-03-28T19:00:00Z"
  endDateTime?: string             // ISO 8601 format: "2025-03-28T23:00:00Z"
  timezone?: string                // e.g., "Asia/Tokyo"
  
  // Visual Elements
  mizuIcon: string                 // Path to mizu icon: "/mizuIcons/mizu-success.svg"
  bgColor?: string                 // Background color for event card (default: "white")
  eventImage?: string              // Path to event image: "/events/jicaf.avif"
  
  // Event Status and Settings
  status: 'available' | 'upcoming' | 'draft'  // Initial status (sold-out is calculated)
  isPrivate?: boolean              // Whether event requires invitation
  requiresKYC?: boolean            // Whether event requires KYC verification
  
  // Organizer Information (auto-filled from authenticated user)
  organizerAddress?: string        // Wallet address of event creator
  organizerId?: number             // Internal organizer ID
  
  // Additional Metadata
  tags?: string[]                  // e.g., ["gaming", "tournament", "nft", "anonymous"]
  socialLinks?: {
    website?: string
    twitter?: string
    discord?: string
  }
  
  // Revenue and Analytics Settings
  enableAnalytics?: boolean        // Whether to track detailed analytics
  refundPolicy?: 'full' | 'partial' | 'none'
  
  // Smart Contract Settings
  enableResale?: boolean           // Allow ticket resale
  maxResalePrice?: number          // Maximum resale price multiplier
  royaltyPercentage?: number       // Percentage for creator on resales
}

// Example JSON object for backend
export const createEventExample: CreateEventRequest = {
  // Basic Information
  title: "Shibuya Esports Cup",
  category: "Gaming",
  description: "Ultimate gaming tournament with prize pools and exclusive NFT rewards. Anonymous entry guaranteed.",
  
  // Pricing
  price: "¥2,800 MJPY",
  priceAmountMJPY: 2800,
  maxParticipants: 200,
  
  // Location and Time
  location: "Virtual Arena",
  date: "March 28, 2025",
  startDateTime: "2025-03-28T19:00:00Z",
  endDateTime: "2025-03-28T23:00:00Z",
  timezone: "Asia/Tokyo",
  
  // Visual
  mizuIcon: "/mizuIcons/mizu-success.svg",
  bgColor: "white",
  eventImage: "/events/jicaf.avif",
  
  // Status
  status: "available",
  isPrivate: false,
  requiresKYC: false,
  
  // Metadata
  tags: ["gaming", "tournament", "nft", "anonymous"],
  socialLinks: {
    website: "https://shibuya-esports.com",
    twitter: "@shibuya_esports",
    discord: "discord.gg/shibuya"
  },
  
  // Settings
  enableAnalytics: true,
  refundPolicy: "partial",
  enableResale: true,
  maxResalePrice: 1.5,
  royaltyPercentage: 5
}

// Response from backend after event creation
export interface CreateEventResponse {
  success: boolean
  eventId: number
  message: string
  event?: {
    id: number
    title: string
    category: string
    price: string
    location: string
    date: string
    description: string
    participants: number
    maxParticipants: number
    status: 'available' | 'sold-out' | 'upcoming'
    mizuIcon: string
    bgColor: string
    eventImage: string
    organizerAddress: string
    createdAt: string
    updatedAt: string
  }
  errors?: string[]
}