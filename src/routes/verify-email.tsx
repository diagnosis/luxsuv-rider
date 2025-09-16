import * as React from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { verifyEmail } from '../api/auth'

export const Route = createFileRoute('/verify-email')({
    component: VerifyEmailPage,
})

function VerifyEmailPage() {
    // read ?token=... from the URL
    const search = useSearch({ from: '/verify-email' }) as { token?: string }
    const tokenFromUrl = search?.token ?? ''
    const [token, setToken] = React.useState(tokenFromUrl)
    const navigate = useNavigate()

    const { mutate, isPending, isSuccess, isError, error, data } = useMutation({
        mutationFn: verifyEmail,
        onSuccess: () => {
            // optional: redirect to login after a short delay
            setTimeout(() => navigate({ to: '/login' }), 1200)
        },
    })

    React.useEffect(() => {
        if (tokenFromUrl) {
            mutate(tokenFromUrl)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenFromUrl])

    return (
        <div className="max-w-md mx-auto py-16 px-4">
            <h1 className="text-2xl font-semibold mb-4">Verify your email</h1>

            {!tokenFromUrl && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (token.trim()) mutate(token.trim())
                    }}
                    className="space-y-3"
                >
                    <label className="block text-sm">Paste your verification token</label>
                    <input
                        className="w-full border rounded px-3 py-2"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="uuid-token-here"
                        required
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                        disabled={isPending}
                    >
                        {isPending ? 'Verifying…' : 'Verify'}
                    </button>
                </form>
            )}

            {isPending && tokenFromUrl && <p>Verifying…</p>}
            {isSuccess && (
                <div className="mt-4 rounded bg-green-50 border border-green-200 p-3">
                    <p className="font-medium">Success!</p>
                    <p>{data?.message || 'Email verified.'}</p>
                    <button
                        className="mt-3 underline"
                        onClick={() => navigate({ to: '/login' })}
                    >
                        Continue to login
                    </button>
                </div>
            )}
            {isError && (
                <div className="mt-4 rounded bg-red-50 border border-red-200 p-3">
                    <p className="font-medium">Verification failed</p>
                    <p className="text-sm">{(error as Error).message}</p>
                </div>
            )}
        </div>
    )
}