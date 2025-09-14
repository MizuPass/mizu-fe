import { useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi, type EventData } from '../services/eventsApi'

// Query keys
export const EVENTS_QUERY_KEYS = {
  all: ['events'] as const,
  active: ['events', 'active'] as const,
  organizer: (address: string) => ['events', 'organizer', address] as const,
  detail: (id: number) => ['events', 'detail', id] as const,
}

/**
 * Hook to fetch all active events
 */
export const useActiveEvents = () => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.active,
    queryFn: () => eventsApi.getActiveEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  })
}

/**
 * Hook to fetch active events for a specific organizer
 */
export const useOrganizerActiveEvents = (organizerAddress: string | undefined) => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.organizer(organizerAddress || ''),
    queryFn: () => eventsApi.getOrganizerActiveEvents(organizerAddress!),
    enabled: !!organizerAddress && organizerAddress.length === 42, // Valid Ethereum address length
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  })
}

/**
 * Hook to fetch event details by ID
 */
export const useEventDetails = (eventId: number | undefined) => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.detail(eventId || 0),
    queryFn: () => eventsApi.getEventDetails(eventId!),
    enabled: !!eventId && eventId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  })
}

/**
 * Utility hook to invalidate events queries
 */
export const useInvalidateEvents = () => {
  const queryClient = useQueryClient()
  
  return {
    invalidateAllEvents: () => {
      queryClient?.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all })
    },
    invalidateActiveEvents: () => {
      queryClient?.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.active })
    },
    invalidateOrganizerEvents: (address: string) => {
      queryClient?.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.organizer(address) })
    },
    invalidateEventDetails: (id: number) => {
      queryClient?.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.detail(id) })
    }
  }
}

/**
 * Transform API event data to match existing component expectations
 */
export const transformEventForComponent = (event: EventData) => {
  return {
    id: event.eventId,
    title: event.eventMetadata.name,
    category: 'Event', // API doesn't provide category, using default
    description: event.eventMetadata.description,
    price: Number(event.ticketPrice) / 1e4, // Convert from JPYM smallest unit to JPYM
    location: 'TBD', // API doesn't provide location in the current format
    date: new Date(Number(event.eventDate) * 1000),
    maxParticipants: Number(event.maxTickets),
    ticketsSold: Number(event.ticketsSold),
    imageUrl: event.eventImageUrl,
    isActive: event.isActive,
    organizer: event.organizer,
    eventContract: event.eventContract,
    ipfsHash: event.ipfsHash,
    ticketIpfsHash: event.ticketIpfsHash
  }
}