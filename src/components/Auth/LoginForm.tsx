'use client'
import { createClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginForm() {
    const supabase = createClient()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
        email,
        password
        })

        if (error) {
        setError(error.message)
        setLoading(false)
        return
        }

        router.push("/dashboard")
    }
    return (
        <div className="flex justify-center items-center min-h-screen">
        <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 w-80"
        >
            <h1 className="text-2xl font-bold">Login</h1>

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
            />

            {error && (
            <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-2 rounded"
            >
            {loading ? "Signing in..." : "Login"}
            </button>
        </form>
        </div>
    )
}
