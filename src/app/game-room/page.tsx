'use client'

import { useState, useEffect } from 'react'

type GameType = 'truth-or-dare' | 'sync-test' | 'draw-together' | 'quiz' | null

interface GameOption {
  id: GameType
  name: string
  icon: string
  description: string
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  duration: string
  xpReward: number
}

const games: GameOption[] = [
  {
    id: 'truth-or-dare',
    name: '2 Vérités 1 Mensonge',
    icon: '🎭',
    description: 'Découvrez-vous en jouant. Devinez le mensonge de l\'autre !',
    difficulty: 'Facile',
    duration: '5-10 min',
    xpReward: 50
  },
  {
    id: 'sync-test',
    name: 'Test de Synchronisation',
    icon: '💞',
    description: 'Répondez la même chose en même temps. Êtes-vous sur la même longueur d\'onde ?',
    difficulty: 'Moyen',
    duration: '10 min',
    xpReward: 75
  },
  {
    id: 'draw-together',
    name: 'Dessinez Ensemble',
    icon: '🎨',
    description: 'Un dessine, l\'autre devine. Fou rires garantis !',
    difficulty: 'Facile',
    duration: '15 min',
    xpReward: 60
  },
  {
    id: 'quiz',
    name: 'Quiz de Compatibilité',
    icon: '💘',
    description: 'Découvrez votre score de compatibilité à travers 20 questions.',
    difficulty: 'Moyen',
    duration: '10 min',
    xpReward: 100
  }
]

export default function GameRoomPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null)
  const [isGameStarting, setIsGameStarting] = useState(false)
  const [partnerReady, setPartnerReady] = useState(false)
  const [myReady, setMyReady] = useState(false)
  const [coupleLevel] = useState(1)
  const [coupleXP] = useState(150)
  const [matchName] = useState('Alex')

  // Simuler que le partenaire devient ready
  useEffect(() => {
    if (selectedGame && myReady && !partnerReady) {
      const timer = setTimeout(() => {
        setPartnerReady(true)
      }, Math.random() * 3000 + 1000)
      return () => clearTimeout(timer)
    }
  }, [selectedGame, myReady, partnerReady])

  // Lancer le jeu quand les deux sont ready
  useEffect(() => {
    if (myReady && partnerReady && !isGameStarting) {
      setIsGameStarting(true)
      setTimeout(() => {
        // Rediriger vers le jeu spécifique
        window.location.href = `/games/${selectedGame}`
      }, 2000)
    }
  }, [myReady, partnerReady, selectedGame, isGameStarting])

  const selectGame = (gameId: GameType) => {
    setSelectedGame(gameId)
    setMyReady(false)
    setPartnerReady(false)
    setIsGameStarting(false)
  }

  const toggleReady = () => {
    setMyReady(!myReady)
  }

  const xpToNextLevel = 500
  const xpProgress = (coupleXP / xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Players */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl mb-1">
                  👤
                </div>
                <p className="text-white text-sm font-semibold">Vous</p>
                {myReady && <p className="text-green-400 text-xs">✓ Prêt</p>}
              </div>
              
              <div className="text-white text-2xl">VS</div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-2xl mb-1">
                  🎮
                </div>
                <p className="text-white text-sm font-semibold">{matchName}</p>
                {partnerReady && <p className="text-green-400 text-xs">✓ Prêt</p>}
              </div>
            </div>

            {/* Couple Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-white/60 text-xs">Niveau Duo</p>
                <p className="text-white font-bold text-lg">{coupleLevel}</p>
              </div>
              <div className="w-32">
                <p className="text-white/60 text-xs mb-1">XP: {coupleXP}/{xpToNextLevel}</p>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              <a 
                href="/match" 
                className="text-white/60 hover:text-white transition text-sm"
              >
                Quitter ←
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {!selectedGame ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Choisissez Votre Jeu ! 🎮
              </h1>
              <p className="text-white/80 text-lg">
                Jouez ensemble pour apprendre à vous connaître
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => selectGame(game.id)}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all border border-white/20 hover:border-white/30 transform hover:-translate-y-1 hover:shadow-xl text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {game.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        {game.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                          {game.difficulty}
                        </span>
                        <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                          ⏱️ {game.duration}
                        </span>
                        <span className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-semibold">
                          +{game.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                💡 Conseils pour une bonne partie
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-white/70 text-sm">
                <div>• Soyez vous-même, c'est le but !</div>
                <div>• Pas de pression, amusez-vous</div>
                <div>• Plus vous jouez, plus vous gagnez d'XP</div>
              </div>
            </div>
          </>
        ) : (
          /* Game Selected - Waiting Room */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
              {isGameStarting ? (
                <>
                  <div className="text-6xl mb-4 animate-bounce">🚀</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Lancement du jeu...
                  </h2>
                  <p className="text-white/60">
                    Préparez-vous !
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">
                    {games.find(g => g.id === selectedGame)?.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {games.find(g => g.id === selectedGame)?.name}
                  </h2>
                  <p className="text-white/60 mb-6">
                    {games.find(g => g.id === selectedGame)?.description}
                  </p>

                  {/* Ready Status */}
                  <div className="bg-white/5 rounded-2xl p-4 mb-6">
                    <div className="flex justify-around items-center">
                      <div className={`text-center ${myReady ? 'opacity-100' : 'opacity-50'}`}>
                        <p className="text-white font-semibold mb-1">Vous</p>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                          myReady ? 'bg-green-500/20 border-2 border-green-500' : 'bg-white/10 border-2 border-white/20'
                        }`}>
                          {myReady ? '✓' : '?'}
                        </div>
                      </div>

                      <div className="text-white text-2xl">🤝</div>

                      <div className={`text-center ${partnerReady ? 'opacity-100' : 'opacity-50'}`}>
                        <p className="text-white font-semibold mb-1">{matchName}</p>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                          partnerReady ? 'bg-green-500/20 border-2 border-green-500' : 'bg-white/10 border-2 border-white/20'
                        }`}>
                          {partnerReady ? '✓' : '?'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="flex-1 bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full hover:bg-white/30 transition font-semibold"
                    >
                      Changer de jeu
                    </button>
                    <button
                      onClick={toggleReady}
                      className={`flex-1 px-6 py-3 rounded-full font-semibold transition ${
                        myReady 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                      }`}
                    >
                      {myReady ? 'Pas prêt' : 'Je suis prêt !'}
                    </button>
                  </div>

                  {myReady && !partnerReady && (
                    <p className="text-white/60 text-sm mt-4 animate-pulse">
                      En attente de {matchName}...
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Chat Box */}
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/60 text-sm mb-2">💬 Chat rapide</p>
              <div className="space-y-2">
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-xl px-3 py-2">
                    <p className="text-white text-sm">{matchName}: Salut ! Prêt(e) à jouer ? 😊</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl px-3 py-2">
                    <p className="text-white text-sm">Oui, ça va être fun ! 🎮</p>
                  </div>
                </div>
              </div>
              <input 
                type="text"
                placeholder="Tapez un message..."
                className="w-full mt-3 px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}