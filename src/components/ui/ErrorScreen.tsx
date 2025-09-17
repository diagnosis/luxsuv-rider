interface ErrorScreenProps {
  title?: string
  message: string
  onRetry?: () => void
  onBack?: () => void
  showHomeButton?: boolean
}

export function ErrorScreen({ 
  title = "Something went wrong",
  message,
  onRetry,
  onBack,
  showHomeButton = true
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-600 text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="space-y-3">
          {onRetry && (
            <button 
              onClick={onRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
          
          {onBack && (
            <button 
              onClick={onBack}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go Back
            </button>
          )}
          
          {showHomeButton && (
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full text-blue-600 hover:text-blue-800 underline"
            >
              Back to Homepage
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface SuccessScreenProps {
  title: string
  message: string
  onContinue?: () => void
  continueText?: string
  showHomeButton?: boolean
}

export function SuccessScreen({
  title,
  message,
  onContinue,
  continueText = "Continue",
  showHomeButton = true
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-600 text-6xl mb-6">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="space-y-3">
          {onContinue && (
            <button 
              onClick={onContinue}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {continueText}
            </button>
          )}
          
          {showHomeButton && (
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full text-blue-600 hover:text-blue-800 underline"
            >
              Back to Homepage
            </button>
          )}
        </div>
      </div>
    </div>
  )
}