export interface Event {
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
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Shibuya Esports Cup",
    category: "Gaming",
    price: "¥2,800 JPYM",
    location: "Virtual Arena",
    date: "March 28, 2025",
    description: "Ultimate gaming tournament with prize pools and exclusive NFT rewards. Anonymous entry guaranteed.",
    participants: 124,
    maxParticipants: 200,
    status: 'available',
    mizuIcon: '/mizuIcons/mizu-success.svg',
    bgColor: 'white',
    eventImage: '/events/jicaf.avif'
  },
  {
    id: 2,
    title: "Tokyo Premium Pass",
    category: "Loyalty",
    price: "¥15,000 JPYM",
    location: "Tokyo Network",
    date: "365 Days Access",
    description: "Annual membership with exclusive access to premium venues, events, and rewards across Tokyo.",
    participants: 89,
    maxParticipants: 500,
    status: 'available',
    mizuIcon: '/mizuIcons/mizu-love.svg',
    bgColor: 'white',
    eventImage: '/events/jicaf.avif'
  },
  {
    id: 3,
    title: "Midnight Jazz Lounge",
    category: "Exclusive",
    price: "¥12,000 JPYM",
    location: "Roppongi, Tokyo",
    date: "Every Saturday",
    description: "Intimate jazz experience in Tokyo's most exclusive venue. Limited seating, maximum privacy.",
    participants: 50,
    maxParticipants: 50,
    status: 'sold-out',
    mizuIcon: '/mizuIcons/mizu-tired.svg',
    bgColor: 'white',
    eventImage: '/events/jicaf.avif'
  }
]