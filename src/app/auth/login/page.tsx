'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        setMessage('Vérifiez votre email pour confirmer votre inscription !')
        setEmail('')
        setPassword('')
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Redirect to onboarding or dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single()

        if (profile?.onboarding_complete) {
          window.location.href = '/dashboard'
        } else {
          window.location.href = '/onboarding'
        }
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion avec Google')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💘 Love Quest</h1>
          <p className="text-white/60">Un Match. Une Semaine. L'Amour, Vraiment.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {isSignUp ? 'Créer un compte' : 'Se connecter'}
          </h2>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 mb-4">
              <p className="text-green-200 text-sm">{message}</p>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-white/80 text-sm mb-1 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="text-white/50 text-xs mt-1">Minimum 6 caractères</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Chargement...
                </span>
              ) : (
                isSignUp ? 'Créer mon compte' : 'Se connecter'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {/* Add more social providers as needed */}
          </div>

          {/* Switch Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                  setMessage(null)
                }}
                className="text-white hover:text-white/80 font-semibold ml-1 transition"
              >
                {isSignUp ? 'Se connecter' : 'S\'inscrire'}
              </button>
            </p>
          </div>

          {/* Terms */}
          {isSignUp && (
            <p className="text-white/40 text-xs text-center mt-4">
              En créant un compte, tu acceptes nos{' '}
              <a href="#" className="text-white/60 hover:text-white/80">
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-white/60 hover:text-white/80">
                Politique de confidentialité
              </a>
            </p>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/60 hover:text-white transition text-sm">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}