'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Match {
  id: string
  user1_id: string
  user2_id: string
  current_day: number
  status: string
  partner?: {
    id: string
    username?: string
    full_name?: string
  }
}

export default function WeekFeedbackPage() {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [decision, setDecision] = useState<'meet' | 'continue' | 'friends' | null>(null)
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [partnerDecision, setPartnerDecision] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadMatchData()
  }, [])

  const loadMatchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get current match that needs feedback (day 7)
      const { data: matchData, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(id, username, full_name),
          user2:profiles!matches_user2_id_fkey(id, username, full_name)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active')
        .eq('current_day', 7)
        .single()

      if (error || !matchData) {
        console.log('No match ready for feedback')
        return
      }

      const partner = matchData.user1_id === user.id ? matchData.user2 : matchData.user1
      const userDecisionField = matchData.user1_id === user.id ? 'user1_decision' : 'user2_decision'
      const partnerDecisionField = matchData.user1_id === user.id ? 'user2_decision' : 'user1_decision'

      setCurrentMatch({
        ...matchData,
        partner
      })

      // Check if already submitted
      if (matchData[userDecisionField]) {
        setDecision(matchData[userDecisionField])
        setIsComplete(true)
        setPartnerDecision(matchData[partnerDecisionField])
      }
    } catch (error) {
      console.error('Error loading match:', error)
    }
  }

  const submitFeedback = async () => {
    if (!decision || !currentMatch) return

    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const decisionField = currentMatch.user1_id === user.id ? 'user1_decision' : 'user2_decision'

      // Update match with decision
      const { error: matchError } = await supabase
        .from('matches')
        .update({
          [decisionField]: decision,
          status: decision === 'meet' || decision === 'continue' ? 'completed' : 'stopped'
        })
        .eq('id', currentMatch.id)

      if (matchError) throw matchError

      // Save detailed feedback
      const { error: feedbackError } = await supabase
        .from('match_feedback')
        .insert({
          match_id: currentMatch.id,
          user_id: user.id,
          decision,
          rating,
          feedback,
          created_at: new Date().toISOString()
        })

      // Update achievements if it's their first completed week
      if (decision !== 'friends') {
        await supabase
          .from('achievements')
          .insert({
            user_id: user.id,
            achievement_type: 'first_week_completed',
            data: { match_id: currentMatch.id }
          })
          .select()
          .single()
      }

      setIsComplete(true)
      
      // Check partner's decision
      const { data: updatedMatch } = await supabase
        .from('matches')
        .select('*')
        .eq('id', currentMatch.id)
        .single()

      if (updatedMatch) {
        const partnerField = currentMatch.user1_id === user.id ? 'user2_decision' : 'user1_decision'
        setPartnerDecision(updatedMatch[partnerField])
      }

    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-white mb-4">Pas encore le moment</h1>
          <p className="text-white/60 mb-6">
            Le feedback se fait au jour 7 de votre semaine
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (isComplete) {
    const bothDecided = decision && partnerDecision
    const mutualMatch = decision === partnerDecision && (decision === 'meet' || decision === 'continue')

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
            <div className="text-6xl mb-6">
              {mutualMatch ? '💕' : bothDecided ? '✅' : '⏳'}
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              {mutualMatch ? 'C\'est un Match !' : 'Décision Enregistrée'}
            </h1>

            {mutualMatch && (
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 mb-6 border border-pink-500/30">
                <p className="text-white text-lg mb-4">
                  🎉 Vous avez tous les deux choisi de {decision === 'meet' ? 'vous rencontrer' : 'continuer'} !
                </p>
                {decision === 'meet' && (
                  <p className="text-white/80">
                    Vous recevrez bientôt un email avec les coordonnées pour organiser votre rencontre.
                  </p>
                )}
                {decision === 'continue' && (
                  <p className="text-white/80">
                    Une nouvelle semaine commence ! Continuez à approfondir votre connexion.
                  </p>
                )}
              </div>
            )}

            {!bothDecided && (
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <p className="text-white/80 mb-2">Votre choix : <strong>{getDecisionText(decision)}</strong></p>
                <p className="text-white/60 text-sm">
                  En attente de la décision de {currentMatch.partner?.full_name || 'votre match'}...
                </p>
              </div>
            )}

            {bothDecided && !mutualMatch && (
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <p className="text-white/80 mb-4">
                  Vos chemins se séparent ici, mais ce n'était que le début !
                </p>
                <p className="text-white/60 text-sm">
                  Un nouveau match vous attend lundi prochain 🌟
                </p>
              </div>
            )}

            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
            >
              Retour au Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getDecisionText = (dec: string | null) => {
    switch(dec) {
      case 'meet': return '❤️ Se rencontrer IRL'
      case 'continue': return '💕 Continuer en ligne'
      case 'friends': return '🤝 Rester amis'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎊</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Votre Semaine avec {currentMatch.partner?.full_name || 'votre match'}
            </h1>
            <p className="text-white/60">
              7 jours ensemble, qu'avez-vous décidé ?
            </p>
          </div>

          {/* Decision Options */}
          <div className="space-y-4 mb-8">
            <h2 className="text-white font-semibold mb-3">Votre décision :</h2>
            
            <button
              onClick={() => setDecision('meet')}
              className={`w-full p-4 rounded-xl transition-all text-left ${
                decision === 'meet' 
                  ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-2 border-pink-500' 
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">❤️</span>
                <div>
                  <p className="text-white font-semibold">Se rencontrer IRL</p>
                  <p className="text-white/60 text-sm">Je veux te voir en vrai !</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDecision('continue')}
              className={`w-full p-4 rounded-xl transition-all text-left ${
                decision === 'continue' 
                  ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-2 border-pink-500' 
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">💕</span>
                <div>
                  <p className="text-white font-semibold">Continuer en ligne</p>
                  <p className="text-white/60 text-sm">Une semaine de plus pour mieux se connaître</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDecision('friends')}
              className={`w-full p-4 rounded-xl transition-all text-left ${
                decision === 'friends' 
                  ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-2 border-blue-500' 
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🤝</span>
                <div>
                  <p className="text-white font-semibold">Rester amis</p>
                  <p className="text-white/60 text-sm">Pas de romance mais une belle rencontre</p>
                </div>
              </div>
            </button>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Note cette expérience :</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-all hover:scale-110"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-8">
            <label className="text-white font-semibold mb-2 block">
              Un mot pour {currentMatch.partner?.full_name} ? (optionnel)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ce que j'ai aimé, ce qui pourrait être amélioré..."
              className="w-full p-4 bg-white/10 rounded-xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <button
            onClick={submitFeedback}
            disabled={!decision || isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi...' : 'Confirmer ma décision'}
          </button>

          {/* Info */}
          <p className="text-white/40 text-center text-sm mt-4">
            Les deux décisions sont révélées uniquement si vous choisissez la même chose
          </p>
        </div>
      </div>
    </div>
  )
}