'use client'

import { useState, useEffect } from 'react'

interface Player {
  id: string
  name: string
  avatar: string
  level: number
  interests: string[]
  chemistryScore?: number
}

export default function MatchPage() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [matchFound, setMatchFound] = useState(false)
  const [timeSearching, setTimeSearching] = useState(0)

  // Simuler la recherche de match
  useEffect(() => {
    if (isSearching) {
      const timer = setInterval(() => {
        setTimeSearching(prev => prev + 1)
      }, 1000)

      // Trouver un match après 3-8 secondes (simulation)
      const matchTimeout = setTimeout(() => {
        const fakeMatch: Player = {
          id: '2',
          name: 'Alex',
          avatar: '🎮',
          level: 5,
          interests: ['Gaming', 'Anime', 'Music'],
          chemistryScore: 85
        }
        setCurrentPlayer(fakeMatch)
        setMatchFound(true)
        setIsSearching(false)
      }, Math.random() * 5000 + 3000)

      return () => {
        clearInterval(timer)
        clearTimeout(matchTimeout)
      }
    }
  }, [isSearching])

  const startSearching = () => {
    setIsSearching(true)
    setMatchFound(false)
    setTimeSearching(0)
    setCurrentPlayer(null)
  }

  const acceptMatch = () => {
    window.location.href = '/game-room'
  }

  const skipMatch = () => {
    setMatchFound(false)
    setCurrentPlayer(null)
    startSearching()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* En recherche */}
        {isSearching && (
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl animate-pulse mb-4">🎮</div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Recherche d'un partenaire de jeu...
              </h1>
              <p className="text-white/60 text-lg">
                {timeSearching}s écoulées
              </p>
            </div>
            
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <button
              onClick={() => setIsSearching(false)}
              className="text-white/60 hover:text-white transition"
            >
              Annuler
            </button>
          </div>
        )}

        {/* Match trouvé */}
        {matchFound && currentPlayer && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-6">
              Match Trouvé ! 🎉
            </h1>

            <div className="mb-6">
              <div className="text-8xl mb-4">{currentPlayer.avatar}</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentPlayer.name}
              </h2>
              <p className="text-white/60 mb-4">
                Niveau {currentPlayer.level}
              </p>

              {/* Intérêts */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {currentPlayer.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* Score de compatibilité */}
              <div className="mb-6">
                <p className="text-white/60 text-sm mb-2">Compatibilité Gaming</p>
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-1000"
                    style={{ width: `${currentPlayer.chemistryScore}%` }}
                  />
                </div>
                <p className="text-white font-bold text-lg mt-2">
                  {currentPlayer.chemistryScore}%
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={skipMatch}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full hover:bg-white/30 transition font-semibold"
              >
                Passer ❌
              </button>
              <button
                onClick={acceptMatch}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition font-semibold shadow-lg hover:shadow-xl"
              >
                Jouer ! 🎮
              </button>
            </div>
          </div>
        )}

        {/* État initial */}
        {!isSearching && !matchFound && (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Prêt à Jouer ? 🎮
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Trouve quelqu'un avec qui jouer et peut-être plus...
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
              <h2 className="text-white font-bold mb-4">Comment ça marche ?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="text-white font-semibold">On te trouve un match</p>
                    <p className="text-white/60 text-sm">Basé sur tes goûts gaming</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="text-white font-semibold">Vous jouez ensemble</p>
                    <p className="text-white/60 text-sm">Mini-jeux fun pour briser la glace</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="text-white font-semibold">Gagnez des XP en duo</p>
                    <p className="text-white/60 text-sm">Plus vous jouez, plus vous débloquez</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startSearching}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Trouver un Match 💘
            </button>

            <p className="text-white/40 text-sm mt-4">
              127 joueurs en ligne maintenant
            </p>
          </div>
        )}
      </div>
    </div>
  )
}