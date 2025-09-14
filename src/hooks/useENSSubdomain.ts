import { useState } from 'react'
import { API_CONFIG, buildApiUrl, API_PATHS } from '../config/api'

export interface ClaimENSRequest {
  subdomain: string
  givenSubdomainAddress: string
}

export interface ClaimENSResponse {
  success: boolean
  message?: string
  domain?: string
  transactionHash?: string
}

export interface CheckENSResponse {
  success: boolean
  subdomain: string
  exists: boolean
  resolvedAddress?: string
  isVerified: boolean
}

export const useENSSubdomain = () => {
  const [isClaimingENS, setIsClaimingENS] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState<ClaimENSResponse | null>(null)
  const [isCheckingENS, setIsCheckingENS] = useState(false)
  const [ensStatus, setEnsStatus] = useState<CheckENSResponse | null>(null)

  // Initialize from localStorage
  const [claimedDomain, setClaimedDomain] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mizupass_ens_domain')
    }
    return null
  })

  const [hasClaimedENS, setHasClaimedENS] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mizupass_ens_claimed') === 'true'
    }
    return false
  })


  const claimSubdomain = async (subdomain: string, address: string): Promise<ClaimENSResponse | null> => {
    setIsClaimingENS(true)
    setClaimError(null)
    setClaimSuccess(null)

    try {
      const payload: ClaimENSRequest = {
        subdomain: subdomain.toLowerCase().trim(),
        givenSubdomainAddress: address
      }

      console.log('Claiming ENS subdomain with payload:', payload)

      const response = await fetch(buildApiUrl(API_PATHS.ENS_CREATE_SUBDOMAIN), {
        method: 'POST',
        headers: {
          ...API_CONFIG.headers,
          'X-API-Key': 'pqwjyftfxavlqiixowhbaasinmppfnfl'
        },
        body: JSON.stringify(payload),
      })

      console.log('ENS API response status:', response.status, response.statusText)

      // Check if response is ok first
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      // Check if response has content and is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response received:', text)
        throw new Error('Server returned invalid response format')
      }

      const data: any = await response.json()

      // The API returns {success: true, ens: {ens: "domain.mizupass.eth", ...}} format
      const domain = data.ens?.ens || data.domain

      // Store ENS name in localStorage and update state
      if (data.success && domain) {
        localStorage.setItem('mizupass_ens_domain', domain)
        localStorage.setItem('mizupass_ens_claimed', 'true')
        setClaimedDomain(domain)
        setHasClaimedENS(true)

        // Update the claimSuccess to match our expected format
        const formattedResponse = {
          success: data.success,
          domain: domain,
          message: data.message,
          transactionHash: data.ens?.transactions?.setSubnodeRecord?.hash || data.transactionHash
        }
        setClaimSuccess(formattedResponse)
        return formattedResponse
      } else {
        setClaimSuccess(data)
        return data
      }
    } catch (error) {
      let errorMessage = 'Failed to claim ENS subdomain'

      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('Failed to execute \'json\'')) {
          errorMessage = 'Server returned invalid response. The ENS service may be temporarily unavailable.'
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('status: 404')) {
          errorMessage = 'ENS service not found. Please try again later.'
        } else if (error.message.includes('status: 500')) {
          errorMessage = 'Server error. The ENS service is temporarily unavailable.'
        } else {
          errorMessage = error.message
        }
      }

      console.error('ENS subdomain claim failed:', error)
      setClaimError(errorMessage)
      return null
    } finally {
      setIsClaimingENS(false)
    }
  }

  const checkENSSubdomain = async (subdomainName: string): Promise<CheckENSResponse | null> => {
    setIsCheckingENS(true)

    try {
      const response = await fetch(`https://services.mizupass.com/api/ens/checkSubdomain/${subdomainName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'pqwjyftfxavlqiixowhbaasinmppfnfl'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CheckENSResponse = await response.json()
      setEnsStatus(data)
      return data
    } catch (error) {
      console.error('ENS check failed:', error)
      return null
    } finally {
      setIsCheckingENS(false)
    }
  }

  const resetClaim = () => {
    setClaimError(null)
    setClaimSuccess(null)
    setIsClaimingENS(false)
  }

  const resetENSStatus = () => {
    setEnsStatus(null)
  }

  const clearENSClaim = () => {
    localStorage.removeItem('mizupass_ens_domain')
    localStorage.removeItem('mizupass_ens_claimed')
    setClaimedDomain(null)
    setHasClaimedENS(false)
    setClaimSuccess(null)
    setClaimError(null)
  }

  return {
    // Claiming State
    isClaimingENS,
    claimError,
    claimSuccess,

    // Checking State
    isCheckingENS,
    ensStatus,

    // localStorage State
    hasClaimedENS,
    claimedDomain,

    // Actions
    claimSubdomain,
    checkENSSubdomain,
    resetClaim,
    resetENSStatus,
    clearENSClaim,
  }
}