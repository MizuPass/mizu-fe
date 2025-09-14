// API service for events endpoints
export interface EventMetadata {
  name: string
  description: string
  image: string
  external_url?: string
}

export interface TicketMetadata {
  name: string
  description: string
  image: string
}

export interface EventData {
  eventId: number
  eventContract: string
  organizer: string
  ipfsHash: string
  ticketIpfsHash: string
  ticketPrice: string
  maxTickets: string
  ticketsSold: string
  isActive: boolean
  eventDate: string
  eventMetadata: EventMetadata
  ticketMetadata: TicketMetadata
  eventImageUrl: string
  ticketImageUrl: string
}

export interface EventsResponse {
  success: boolean
  data: EventData[]
  count: number
  organizer?: string
}

export interface EventDetailsResponse {
  success: boolean
  data: EventData
}

export interface ApiErrorResponse {
  success: false
  error: string
}

import { API_CONFIG, buildEventsUrl } from '../config/api'

class EventsApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const url = buildEventsUrl(endpoint)
    
    try {
      console.log(`Fetching: ${url}`)
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      return data as T
    } catch (error) {
      console.error(`API Error for ${url}:`, error)
      throw error
    }
  }

  /**
   * Get all active events
   */
  async getActiveEvents(): Promise<EventData[]> {
    const response = await this.fetchApi<EventsResponse>('/active')
    return response.data
  }

  /**
   * Get all active events for a specific organizer
   */
  async getOrganizerActiveEvents(organizerAddress: string): Promise<EventData[]> {
    if (!organizerAddress) {
      throw new Error('Organizer address is required')
    }

    // Validate Ethereum address format (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(organizerAddress)) {
      throw new Error('Invalid Ethereum address format')
    }

    const response = await this.fetchApi<EventsResponse>(`/organizer/${organizerAddress}/active`)
    return response.data
  }

  /**
   * Get detailed information about a specific event
   */
  async getEventDetails(eventId: number): Promise<EventData> {
    if (!eventId || eventId <= 0) {
      throw new Error('Valid event ID is required')
    }

    const response = await this.fetchApi<EventDetailsResponse>(`/details/${eventId}`)
    return response.data
  }
}

// Export singleton instance
export const eventsApi = new EventsApiService()

// Export utility functions
export const formatEventPrice = (priceWei: string): string => {
  try {
    const priceJPYM = Number(priceWei) / 1e4
    return `¥${priceJPYM.toLocaleString()}`
  } catch {
    return '¥0'
  }
}

export const formatEventDate = (timestamp: string): string => {
  try {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

export const formatEventDateTime = (timestamp: string): string => {
  try {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}