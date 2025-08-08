'use client'

import { useState, useEffect } from 'react'

interface UserStats {
  weekNumber: number
  totalMatches: number
  successfulDates: number
  currentStreak: number
  nextMatchIn: { days: number; hours: number; minutes: number }
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  total?: number
}

export default function DashboardPage() {
  const [userName] = useState('Zenaki')
  const [userStats, setUserStats] = useState<UserStats>({
    weekNumber: 1,
    totalMatches: 0,
    successfulDates: 0,
    currentStreak: 0,
    nextMatchIn: { days: 2, hours: 14, minutes: 27 }
  })
  
  const [currentMatch, setCurrentMatch] = useState<any>(null)
  const [achievements] = useState<Achievement[]>([
    {
      id: 'first_week',
      name: 'Première Semaine',
      description: 'Complète ta première semaine',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      total: 7
    },
    {
      id: 'ice_breaker',
      name: 'Brise-glace',
      description: 'Joue à ton premier mini-jeu',
      icon: '🎮',
      unlocked: false
    },
    {
      id: 'deep_talker',
      name: 'Conversations Profondes',
      description: 'Échange 100 messages',
      icon: '💬',
      unlocked: false,
      progress: 0,
      total: 100
    },
    {
      id: 'first_call',
      name: 'Premier Appel',
      description: 'Passe ton premier appel audio',
      icon: '📞',
      unlocked: false
    },
    {
      id: 'video_star',
      name: 'Face à Face',
      description: 'Fais ton premier appel vidéo',
      icon: '🎥',
      unlocked: false
    },
    {
      id: 'perfect_week',
      name: 'Semaine Parfaite',
      description: 'Complète tous les défis d\'une semaine',
      icon: '🏆',
      unlocked: false
    }
  ])

  const [weeklyProgress] = useState([
    { day: 'Lun', completed: false, current: true, activity: 'Ice Breaker' },
    { day: 'Mar', completed: false, current: false, activity: 'Deep Talk' },
    { day: 'Mer', completed: false, current: false, activity: 'Photos' },
    { day: 'Jeu', completed: false, current: false, activity: 'Voice Call' },
    { day: 'Ven', completed: false, current: false, activity: 'Video' },
    { day: 'Sam', completed: false, current: false, activity: 'Challenge' },
    { day: 'Dim', completed: false, current: false, activity: 'Decision' }
  ])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setUserStats(prev => {
        const { days, hours, minutes } = prev.nextMatchIn
        if (minutes > 0) {
          return { ...prev, nextMatchIn: { days, hours, minutes: minutes - 1 } }
        } else if (hours > 0) {
          return { ...prev, nextMatchIn: { days, hours: hours - 1, minutes: 59 } }
        } else if (days > 0) {
          return { ...prev, nextMatchIn: { days: days - 1, hours: 23, minutes: 59 } }
        }
        return prev
      })
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const hasActiveMatch = currentMatch !== null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-white font-bold text-xl">💘 Love Quest</h1>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                Semaine {userStats.weekNumber}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white/60 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="text-white/60 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl">
                👤
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bonjour {userName} ! 👋
          </h2>
          <p className="text-white/60">
            {hasActiveMatch 
              ? "Votre semaine d'amour continue..." 
              : "Préparez-vous pour votre prochain match !"}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Match or Next Match Card */}
            {hasActiveMatch ? (
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="text-white font-bold text-xl mb-4">Match Actuel</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-3xl">
                    🎮
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">Alex</h4>
                    <p className="text-white/60">Jour 1 - Ice Breaker</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">En ligne</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition">
                    Continuer la conversation
                  </button>
                  <button className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition">
                    Jouer ensemble
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-white font-bold text-2xl mb-2">Prochain Match Dans</h3>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{userStats.nextMatchIn.days}</div>
                    <div className="text-white/60 text-sm">Jours</div>
                  </div>
                  <div className="text-white text-3xl">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{userStats.nextMatchIn.hours}</div>
                    <div className="text-white/60 text-sm">Heures</div>
                  </div>
                  <div className="text-white text-3xl">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{userStats.nextMatchIn.minutes}</div>
                    <div className="text-white/60 text-sm">Minutes</div>
                  </div>
                </div>
                <p className="text-white/60 mb-6">
                  L'algorithme analyse les profils pour trouver votre match parfait
                </p>
                <button className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition">
                  Améliorer mon profil
                </button>
              </div>
            )}

            {/* Weekly Progress */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Progression de la Semaine</h3>
              <div className="grid grid-cols-7 gap-2">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className={`
                      p-3 rounded-xl mb-2 transition-all cursor-pointer
                      ${day.completed ? 'bg-green-500/30 border-2 border-green-500' : 
                        day.current ? 'bg-purple-500/30 border-2 border-purple-500 animate-pulse' : 
                        'bg-white/10 border-2 border-white/10'}
                    `}>
                      <p className="text-white font-semibold text-sm">{day.day}</p>
                      <p className="text-2xl mt-1">
                        {day.completed ? '✅' : day.current ? '👉' : '🔒'}
                      </p>
                    </div>
                    <p className="text-white/60 text-xs">{day.activity}</p>
                  </div>
                ))}
              </div>
              {hasActiveMatch && (
                <div className="mt-4 bg-purple-500/20 rounded-xl p-3">
                  <p className="text-white text-sm">
                    💡 <strong>Défi du jour:</strong> Jouez à "2 Vérités, 1 Mensonge" pour briser la glace !
                  </p>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`
                      p-4 rounded-xl text-center transition-all
                      ${achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-yellow-500/50' 
                        : 'bg-white/5 border border-white/10 opacity-60'}
                    `}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <p className="text-white font-semibold text-sm mb-1">{achievement.name}</p>
                    {achievement.progress !== undefined && (
                      <div className="bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full"
                          style={{ width: `${(achievement.progress / (achievement.total || 1)) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Mes Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Total Matchs</span>
                  <span className="text-white font-bold text-xl">{userStats.totalMatches}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Dates Réussis</span>
                  <span className="text-white font-bold text-xl">{userStats.successfulDates}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Streak Actuel</span>
                  <span className="text-white font-bold text-xl">{userStats.currentStreak} 🔥</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Taux de Succès</span>
                  <span className="text-white font-bold text-xl">
                    {userStats.totalMatches > 0 
                      ? Math.round((userStats.successfulDates / userStats.totalMatches) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <span>👤</span> Mon Profil
                </button>
                <button 
                  onClick={() => window.location.href = '/onboarding'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <span>📝</span> Refaire le Quiz
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                  <span>💬</span> Support
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                  <span>🎁</span> Inviter des Amis
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
              <h3 className="text-white font-bold text-lg mb-3">💡 Conseil du Jour</h3>
              <p className="text-white/80 text-sm">
                Les profils avec des réponses complètes au questionnaire ont 3x plus de chances d'avoir des matchs réussis !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}