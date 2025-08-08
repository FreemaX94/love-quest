'use client'

import { useState, useEffect } from 'react'

interface Statement {
  text: string
  isLie: boolean
}

export default function TruthOrDarePage() {
  const [round, setRound] = useState(1)
  const [score, setScore] = useState({ you: 0, partner: 0 })
  const [currentTurn, setCurrentTurn] = useState<'you' | 'partner'>('partner')
  const [gamePhase, setGamePhase] = useState<'viewing' | 'guessing' | 'reveal'>('viewing')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  
  // Exemples de déclarations du partenaire
  const [partnerStatements] = useState<Statement[]>([
    { text: "J'ai voyagé dans 12 pays différents", isLie: false },
    { text: "Je sais jouer de 3 instruments de musique", isLie: true },
    { text: "J'ai déjà sauté en parachute", isLie: false }
  ])

  const [myStatements, setMyStatements] = useState<Statement[]>([
    { text: '', isLie: false },
    { text: '', isLie: false },
    { text: '', isLie: true }
  ])

  const [timeLeft, setTimeLeft] = useState(30)

  // Timer pour la phase de réflexion
  useEffect(() => {
    if (gamePhase === 'guessing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gamePhase === 'guessing') {
      handleGuess(Math.floor(Math.random() * 3)) // Choix aléatoire si temps écoulé
    }
  }, [timeLeft, gamePhase])

  const handleGuess = (index: number) => {
    if (gamePhase !== 'guessing') return
    
    setSelectedAnswer(index)
    const correct = partnerStatements.findIndex(s => s.isLie)
    setCorrectAnswer(correct)
    
    if (index === correct) {
      setScore(prev => ({ ...prev, you: prev.you + 1 }))
      setXpEarned(prev => prev + 25)
    }
    
    setGamePhase('reveal')
  }

  const nextRound = () => {
    if (round < 5) {
      setRound(round + 1)
      setCurrentTurn(currentTurn === 'you' ? 'partner' : 'you')
      setGamePhase('viewing')
      setSelectedAnswer(null)
      setCorrectAnswer(null)
      setTimeLeft(30)
    } else {
      // Fin du jeu
      window.location.href = '/game-room?gameComplete=true'
    }
  }

  const startGuessing = () => {
    setGamePhase('guessing')
    setTimeLeft(30)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-white font-bold text-xl">2 Vérités, 1 Mensonge</h1>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                Round {round}/5
              </span>
            </div>
            
            {/* Score */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-white/60 text-xs">Vous</p>
                <p className="text-white font-bold text-2xl">{score.you}</p>
              </div>
              <div className="text-white text-xl">VS</div>
              <div className="text-center">
                <p className="text-white/60 text-xs">Alex</p>
                <p className="text-white font-bold text-2xl">{score.partner}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold ml-4">
                +{xpEarned} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentTurn === 'partner' ? (
          /* Tour du partenaire */
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                  🎮
                </div>
                <p className="text-white font-semibold">Tour d'Alex</p>
              </div>
              
              {gamePhase === 'viewing' && (
                <p className="text-white/80">
                  Lisez attentivement les 3 déclarations...
                </p>
              )}
              
              {gamePhase === 'guessing' && (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-white/80">Trouvez le mensonge !</p>
                  <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-bold">
                    {timeLeft}s
                  </span>
                </div>
              )}
              
              {gamePhase === 'reveal' && (
                <p className="text-white/80">
                  {selectedAnswer === correctAnswer ? '✅ Bien joué !' : '❌ Raté !'}
                </p>
              )}
            </div>

            {/* Déclarations */}
            <div className="space-y-4">
              {partnerStatements.map((statement, index) => (
                <button
                  key={index}
                  onClick={() => gamePhase === 'guessing' && handleGuess(index)}
                  disabled={gamePhase !== 'guessing'}
                  className={`w-full p-4 rounded-xl transition-all text-left ${
                    gamePhase === 'reveal' && statement.isLie
                      ? 'bg-red-500/30 border-2 border-red-500'
                      : gamePhase === 'reveal' && !statement.isLie
                      ? 'bg-green-500/30 border-2 border-green-500'
                      : selectedAnswer === index
                      ? 'bg-purple-500/30 border-2 border-purple-500'
                      : gamePhase === 'guessing'
                      ? 'bg-white/10 hover:bg-white/20 cursor-pointer border-2 border-white/20'
                      : 'bg-white/10 border-2 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0 ? '1️⃣' : index === 1 ? '2️⃣' : '3️⃣'}
                      </span>
                      <p className="text-white text-lg">{statement.text}</p>
                    </div>
                    {gamePhase === 'reveal' && (
                      <span className="text-2xl">
                        {statement.isLie ? '🤥' : '✅'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 text-center">
              {gamePhase === 'viewing' && (
                <button
                  onClick={startGuessing}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
                >
                  Je suis prêt(e) à deviner !
                </button>
              )}
              
              {gamePhase === 'reveal' && (
                <button
                  onClick={nextRound}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
                >
                  {round < 5 ? 'Tour suivant' : 'Voir les résultats'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Votre tour */
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl">
                  👤
                </div>
                <p className="text-white font-semibold">Votre tour</p>
              </div>
              <p className="text-white/80">
                Écrivez 2 vérités et 1 mensonge sur vous
              </p>
            </div>

            {/* Input pour vos déclarations */}
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">1️⃣</span>
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-semibold">
                    Vérité
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: J'ai vécu 2 ans au Japon..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
                  value={myStatements[0].text}
                  onChange={(e) => {
                    const newStatements = [...myStatements]
                    newStatements[0].text = e.target.value
                    setMyStatements(newStatements)
                  }}
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">2️⃣</span>
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-semibold">
                    Vérité
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Je parle 4 langues..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
                  value={myStatements[1].text}
                  onChange={(e) => {
                    const newStatements = [...myStatements]
                    newStatements[1].text = e.target.value
                    setMyStatements(newStatements)
                  }}
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">3️⃣</span>
                  <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-semibold">
                    Mensonge
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: J'ai gagné un marathon... (faux!)"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
                  value={myStatements[2].text}
                  onChange={(e) => {
                    const newStatements = [...myStatements]
                    newStatements[2].text = e.target.value
                    setMyStatements(newStatements)
                  }}
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={nextRound}
                disabled={!myStatements.every(s => s.text.length > 0)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer mes déclarations
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-white/5 rounded-xl p-4">
              <p className="text-white/60 text-sm">
                💡 <strong>Astuce:</strong> Rendez votre mensonge crédible ! Plus c'est difficile à deviner, plus vous gagnez de points.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}