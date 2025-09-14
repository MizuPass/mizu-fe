import { useZKPassportVerification } from '../../hooks/useZKPassportVerification'
import { ZKPassportStatus, ZKPassportSpinner } from '../ZKPassportStatus'
import { LoadingState, Spinner } from '../ui/Spinner'

export const ZKPassportUsageExample = () => {
  const zkPassport = useZKPassportVerification()

  return (
    <div className="space-y-4">
      {/* Option 1: Full status component with detailed states */}
      <ZKPassportStatus zkPassport={zkPassport} />

      {/* Option 2: Simple spinner for inline use */}
      <ZKPassportSpinner zkPassport={zkPassport} />

      {/* Option 3: Custom loading states */}
      {zkPassport.loadingStates.generatingProofs && (
        <LoadingState message="Generating zero-knowledge proofs..." spinnerSize="lg" />
      )}

      {zkPassport.loadingStates.backendVerifying && (
        <LoadingState message="Verifying with backend..." spinnerSize="md" />
      )}

      {zkPassport.loadingStates.contractPending && (
        <LoadingState message="Please confirm in wallet..." spinnerSize="md" />
      )}

      {zkPassport.loadingStates.contractConfirming && (
        <LoadingState message="Transaction confirming..." spinnerSize="md" />
      )}

      {/* Option 4: Just a spinner */}
      {zkPassport.isLoading && <Spinner size="lg" className="text-blue-500" />}

      {/* Your verification button */}
      <button
        onClick={zkPassport.createVerificationRequest}
        disabled={zkPassport.isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {zkPassport.isLoading ? 'Verifying...' : 'Start Verification'}
      </button>

      {/* Show results */}
      {zkPassport.firstName && (
        <div>Welcome, {zkPassport.firstName}!</div>
      )}

      {zkPassport.uniqueIdentifier && (
        <div>Unique ID: {zkPassport.uniqueIdentifier}</div>
      )}
    </div>
  )
}