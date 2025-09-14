// Global API configuration for MizuPass services

/**
 * Base URL for all MizuPass API services
 * Can be overridden via environment variable for development
 */
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://services.mizupass.com'

/**
 * API endpoint paths
 */
export const API_PATHS = {
  // Events API
  EVENTS: '/api/events',
  EVENTS_ACTIVE: '/api/events/active',
  EVENTS_ORGANIZER: '/api/events/organizer',
  EVENTS_DETAILS: '/api/events/details',
  
  // Upload/IPFS API
  UPLOAD: '/api/upload',
  UPLOAD_IMAGE: '/api/upload/image',
  UPLOAD_METADATA: '/api/upload/metadata',
  
  // Identity API
  IDENTITY: '/api/identity',
  IDENTITY_IS_VERIFIED: '/api/identity/isVerified',
  IDENTITY_ZK_VERIFIED: '/api/identity/isZKPassportVerified',
  IDENTITY_MIZUHIKI_SBT: '/api/identity/verifyMizuhikiSBT',
  
  // ZK Passport API
  ZK_PASSPORT: '/api/zkpassport',
  ZK_PASSPORT_VERIFY: '/api/zkpassport/verify',
  
  // ENS API
  ENS: '/api/ens',
  ENS_CREATE_SUBDOMAIN: '/api/ens/createSubEns',
} as const

/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const

/**
 * Request timeout configuration (in milliseconds)
 */
export const REQUEST_TIMEOUT = 30000 // 30 seconds

/**
 * Retry configuration for failed requests
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second base delay
  retryMultiplier: 2, // Exponential backoff
} as const

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${cleanPath}`
}

/**
 * Helper function to build events API URLs
 */
export const buildEventsUrl = (endpoint: string): string => {
  return buildApiUrl(`${API_PATHS.EVENTS}${endpoint}`)
}

/**
 * Helper function to build upload API URLs  
 */
export const buildUploadUrl = (endpoint: string): string => {
  return buildApiUrl(`${API_PATHS.UPLOAD}${endpoint}`)
}

/**
 * Environment-specific configuration
 */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * API configuration object for easy access
 */
export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  paths: API_PATHS,
  headers: DEFAULT_HEADERS,
  timeout: REQUEST_TIMEOUT,
  retry: RETRY_CONFIG,
  isDevelopment: IS_DEVELOPMENT,
  isProduction: IS_PRODUCTION,
} as const

// Log configuration in development
if (IS_DEVELOPMENT) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_BASE_URL,
    environment: process.env.NODE_ENV,
    paths: Object.keys(API_PATHS),
  })
}