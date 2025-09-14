import { useState } from 'react'

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

export const useENSSubdomain = () => {
  const [isClaimingENS, setIsClaimingENS] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState<ClaimENSResponse | null>(null)

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

      const response = await fetch('https://services.mizupass.com/api/ens/createSubEns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      const data: ClaimENSResponse = await response.json()
      console.log('ENS API response data:', data)

      console.log('ENS subdomain claim successful:', data)
      setClaimSuccess(data)
      return data
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

  const resetClaim = () => {
    setClaimError(null)
    setClaimSuccess(null)
    setIsClaimingENS(false)
  }

  return {
    // State
    isClaimingENS,
    claimError,
    claimSuccess,

    // Actions
    claimSubdomain,
    resetClaim,
  }
}