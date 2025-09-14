import { LoadingState, Spinner } from './ui/Spinner'
import { useZKPassportVerification } from '../hooks/useZKPassportVerification'

interface ZKPassportStatusProps {
  zkPassport: ReturnType<typeof useZKPassportVerification>
}

export const ZKPassportStatus = ({ zkPassport }: ZKPassportStatusProps) => {
  // Show loading state with appropriate spinner
  if (zkPassport.isLoading) {
    if (zkPassport.loadingStates.generatingProofs) {
      return <LoadingState message="Generating zero-knowledge proofs..." spinnerSize="md" />
    }

    if (zkPassport.loadingStates.backendVerifying) {
      return <LoadingState message="Verifying with MizuPass backend..." spinnerSize="md" />
    }

    if (zkPassport.loadingStates.contractPending) {
      return <LoadingState message="Waiting for wallet confirmation..." spinnerSize="md" />
    }

    if (zkPassport.loadingStates.contractConfirming) {
      return <LoadingState message="Confirming blockchain transaction..." spinnerSize="md" />
    }

    if (zkPassport.requestInProgress) {
      return <LoadingState message={zkPassport.message || "Processing..."} spinnerSize="md" />
    }
  }

  // Show success/error states
  if (zkPassport.verified === true) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
          ✓
        </div>
        <span>Verification successful!</span>
      </div>
    )
  }

  if (zkPassport.verified === false) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
          ✗
        </div>
        <span>Verification failed</span>
      </div>
    )
  }

  // Show current message if no specific state
  if (zkPassport.message) {
    return (
      <div className="text-gray-600">
        {zkPassport.message}
      </div>
    )
  }

  return null
}

// Alternative compact version for inline use
export const ZKPassportSpinner = ({ zkPassport }: ZKPassportStatusProps) => {
  if (!zkPassport.isLoading) return null

  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span className="text-sm text-gray-600">{zkPassport.message || "Loading..."}</span>
    </div>
  )
}