import { useEffect, useRef, useState } from 'react'
import { ZKPassport, type ProofResult } from '@zkpassport/sdk'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MIZUPASS_IDENTITY_ADDRESS, MIZUPASS_IDENTITY_ABI } from '../config/contracts'

export const useZKPassportVerification = () => {
  const [message, setMessage] = useState('')
  const [firstName, setFirstName] = useState<string | undefined>(undefined)
  const [uniqueIdentifier, setUniqueIdentifier] = useState('')
  const [verified, setVerified] = useState<boolean | undefined>(undefined)
  const [queryUrl, setQueryUrl] = useState('')
  const [requestInProgress, setRequestInProgress] = useState(false)
  const [backendVerifying, setBackendVerifying] = useState(false)
  const [backendResponse, setBackendResponse] = useState<any>(null)
  const zkPassportRef = useRef<ZKPassport | null>(null)

  // Wagmi hooks for smart contract interaction
  const { writeContract, data: hash, error: contractError, isPending: isContractPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && !zkPassportRef.current) {
      zkPassportRef.current = new ZKPassport(window.location.hostname)
    }
  }, [])

  // Helper function to register user on smart contract
  const registerUserOnContract = async (uniqueIdentifierBytes32: string) => {
    try {
      console.log('Registering user on smart contract with uniqueIdentifier:', uniqueIdentifierBytes32)
      setMessage('📝 Registering on blockchain...')

      await writeContract({
        address: MIZUPASS_IDENTITY_ADDRESS,
        abi: MIZUPASS_IDENTITY_ABI,
        functionName: 'registerZKPassportUser',
        args: [uniqueIdentifierBytes32],
      })
    } catch (error) {
      console.error('Smart contract registration failed:', error)
      setMessage('❌ Blockchain registration failed')
    }
  }

  // Track transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      console.log('Smart contract registration confirmed!')
      setMessage('🎉 Successfully registered on blockchain!')
    } else if (contractError) {
      console.error('Smart contract error:', contractError)
      setMessage('❌ Blockchain registration failed')
    } else if (isConfirming) {
      setMessage('⏳ Confirming blockchain transaction...')
    } else if (isContractPending) {
      setMessage('📝 Waiting for wallet confirmation...')
    }
  }, [isConfirmed, contractError, isConfirming, isContractPending])

  const createVerificationRequest = async () => {
    if (!zkPassportRef.current) {
      return
    }

    // Reset state
    setFirstName(undefined)
    setMessage('')
    setQueryUrl('')
    setUniqueIdentifier('')
    setVerified(undefined)

    try {
      const queryBuilder = await zkPassportRef.current.request({
        name: 'MizuPass Verification',
        logo: 'https://www.mizupass.com/favicon.ico',
        purpose: 'Verify identity for MizuPass ticketing platform',
        scope: 'identity',
        mode: 'fast',
        devMode: true,
      })

      const {
        url,
        onRequestReceived,
        onGeneratingProof,
        onProofGenerated,
        onResult,
        onReject,
        onError,
      } = queryBuilder
        .disclose('document_type')
        .done()

      setQueryUrl(url)
      setRequestInProgress(true)

      const proofs: ProofResult[] = []

      onRequestReceived(() => {
        console.log('QR code scanned')
        setMessage('Request received')
      })

      onGeneratingProof(() => {
        console.log('Generating proof')
        setMessage('Generating proof...')
      })

      let backendCalled = false

      onProofGenerated((result: ProofResult) => {
        console.log('Proof result', result)
        proofs.push(result)
        setMessage(`Proof ${proofs.length} received`)
        console.log(`Total proofs collected: ${proofs.length}`)

        // After collecting all expected proofs, wait 3 seconds for onResult
        if (proofs.length >= 3) { // Adjust based on actual expected count
          console.log('All proofs received, waiting 3 seconds for onResult...')
          setTimeout(async () => {
            if (!backendCalled) {
              backendCalled = true
              console.log('onResult timeout - calling backend directly')

              // Construct the queryResult based on what we requested
              const queryResult = {
                document_type: {
                  disclose: {
                    result: "passport"
                  }
                }
              }

              const domain = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'localhost'
                : 'mizupass.com'

              const payload = {
                queryResult,
                proofs,
                domain
              }

              console.log('Fallback backend payload:', payload)

              try {
                const response = await fetch('https://services.mizupass.com/api/zkpassport/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })

                console.log('Fallback response status:', response.status)
                const data = await response.json()
                console.log('Fallback response from server:', data)

                // Update state based on response
                setRequestInProgress(false)
                setVerified(data.verified || false)
                setUniqueIdentifier(data.uniqueIdentifier || '')

                // If verification successful and we have uniqueIdentifierBytes32, register on contract
                if (data.verified && data.uniqueIdentifierBytes32) {
                  console.log('Backend verification successful, calling smart contract...')
                  await registerUserOnContract(data.uniqueIdentifierBytes32)
                } else {
                  setMessage('✅ Verification completed via fallback!')
                }
              } catch (error) {
                console.error('Fallback backend call failed:', error)
                setMessage('❌ Fallback verification failed')
                setRequestInProgress(false)
              }
            } else {
              console.log('Backend already called, skipping fallback')
            }
          }, 3000) // 3 second timeout
        }
      })

      onResult(async ({ result, uniqueIdentifier, verified, queryResultErrors }) => {
        console.log('🎉🎉🎉 onResult callback FINALLY triggered! 🎉🎉🎉')

        if (backendCalled) {
          console.log('Backend already called via fallback, skipping onResult backend call')
          return
        }

        backendCalled = true
        console.log('Result of the query', result)
        console.log('Query result errors', queryResultErrors)
        setFirstName(result?.firstname?.disclose?.result)
        setMessage('Result received')
        setUniqueIdentifier(uniqueIdentifier || '')
        setVerified(verified)
        setRequestInProgress(false)

        const res = await fetch('https://services.mizupass.com/api/zkpassport/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            queryResult: result,
            proofs,
            domain: window.location.hostname,
          }),
        })

        const data = await res.json()
        console.log('Response from the server', data)

        // If verification successful and we have uniqueIdentifierBytes32, register on contract
        if (data.verified && data.uniqueIdentifierBytes32) {
          console.log('Natural onResult verification successful, calling smart contract...')
          await registerUserOnContract(data.uniqueIdentifierBytes32)
        }
      })

      onReject(() => {
        console.log('User rejected')
        setMessage('User rejected the request')
        setRequestInProgress(false)
      })

      onError((error: unknown) => {
        console.error('Error', error)
        setMessage('An error occurred')
        setRequestInProgress(false)
      })

    } catch (error) {
      console.error('ZK Passport: Failed to create verification request', error)
      setMessage('Failed to create verification request.')
      setRequestInProgress(false)
    }
  }

  const resetVerification = () => {
    setFirstName(undefined)
    setMessage('')
    setQueryUrl('')
    setUniqueIdentifier('')
    setVerified(undefined)
    setRequestInProgress(false)
    setBackendVerifying(false)
    setBackendResponse(null)
  }

  return {
    // State
    message,
    firstName,
    uniqueIdentifier,
    verified,
    queryUrl,
    requestInProgress,
    backendVerifying,
    backendResponse,

    // Contract state
    isContractPending,
    isConfirming,
    isConfirmed,
    contractError,
    hash,

    // Actions
    createVerificationRequest,
    resetVerification,
  }
}