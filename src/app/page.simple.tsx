'use client'

import { useState } from 'react'

export default function SimpleLandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitted(true)
    setTimeout(() => {
      setEmail('')
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          💘 Love Quest
        </h1>
        <p className="text-2xl text-white/80 mb-8">
          Your AI Companion That Levels Up With You
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            className="w-full px-6 py-3 rounded-full bg-white/20 text-white placeholder-white/50 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold"
          >
            {isSubmitted ? '✓ Added to Waitlist!' : 'Join Waitlist'}
          </button>
        </form>
        
        <p className="text-white/60 mt-4">
          🎁 First 500 users get 50% off forever
        </p>
      </div>
    </div>
  )
}