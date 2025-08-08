'use client'

import { useState, useEffect } from 'react'

// Les 36 questions qui font tomber amoureux (version française adaptée)
const questions = [
  // Set I - Connexion légère
  "Si tu pouvais inviter n'importe qui au monde à dîner, qui choisirais-tu ?",
  "Aimerais-tu être célèbre ? Dans quel domaine ?",
  "Avant de passer un appel téléphonique, répètes-tu ce que tu vas dire ? Pourquoi ?",
  "À quoi ressemble une journée parfaite pour toi ?",
  "Quand as-tu chanté pour toi-même pour la dernière fois ? Et pour quelqu'un d'autre ?",
  "Si tu pouvais vivre jusqu'à 90 ans en gardant soit l'esprit soit le corps d'un trentenaire pour les 60 dernières années, que choisirais-tu ?",
  "As-tu une intuition secrète sur la façon dont tu vas mourir ?",
  "Cite trois choses que nous semblons avoir en commun.",
  "Pour quoi dans ta vie es-tu le plus reconnaissant(e) ?",
  "Si tu pouvais changer quelque chose dans la façon dont tu as été élevé(e), qu'est-ce que ce serait ?",
  "Raconte l'histoire de ta vie en 4 minutes avec autant de détails que possible.",
  "Si tu pouvais te réveiller demain avec une nouvelle qualité ou capacité, laquelle serait-ce ?",
  
  // Set II - Connexion moyenne
  "Si une boule de cristal pouvait te dire la vérité sur toi, ta vie, le futur ou autre chose, que voudrais-tu savoir ?",
  "Y a-t-il quelque chose que tu rêves de faire depuis longtemps ? Pourquoi ne l'as-tu pas encore fait ?",
  "Quelle est ta plus grande réussite dans la vie ?",
  "Qu'est-ce que tu valorises le plus dans une amitié ?",
  "Quel est ton souvenir le plus précieux ?",
  "Quel est ton souvenir le plus terrible ?",
  "Si tu savais que dans un an tu mourrais soudainement, changerais-tu quelque chose à ta façon de vivre ? Pourquoi ?",
  "Que signifie l'amitié pour toi ?",
  "Quels rôles l'amour et l'affection jouent-ils dans ta vie ?",
  "Partagez à tour de rôle quelque chose que vous considérez comme une caractéristique positive de votre partenaire. Faites-le 5 fois.",
  "Ta famille est-elle proche et chaleureuse ? Penses-tu que ton enfance était plus heureuse que celle de la plupart des gens ?",
  "Comment te sens-tu par rapport à ta relation avec ta mère ?",
  
  // Set III - Connexion profonde
  "Fais trois déclarations vraies en utilisant 'nous'. Par exemple, 'Nous sommes tous les deux dans cette pièce en train de...'",
  "Complète cette phrase : 'J'aimerais avoir quelqu'un avec qui partager...'",
  "Si tu devais devenir un(e) ami(e) proche de ton/ta partenaire, qu'est-ce qu'il/elle devrait absolument savoir sur toi ?",
  "Dis à ton/ta partenaire ce que tu aimes déjà chez lui/elle. Sois très honnête, dis des choses que tu ne dirais pas à quelqu'un que tu viens de rencontrer.",
  "Partage un moment embarrassant de ta vie.",
  "Quand as-tu pleuré devant quelqu'un pour la dernière fois ? Et seul(e) ?",
  "Dis à ton/ta partenaire quelque chose que tu aimes déjà chez lui/elle.",
  "Y a-t-il quelque chose qui te semble trop sérieux pour en plaisanter ?",
  "Si tu devais mourir ce soir sans pouvoir communiquer avec personne, qu'est-ce que tu regretterais le plus de ne pas avoir dit ? Pourquoi ne l'as-tu pas encore dit ?",
  "Ta maison prend feu. Après avoir sauvé tes proches et animaux, tu as le temps de sauver un dernier objet. Lequel ? Pourquoi ?",
  "De tous les membres de ta famille, la mort de qui te perturberait le plus ? Pourquoi ?",
  "Partage un problème personnel et demande conseil à ton/ta partenaire sur la façon dont il/elle le gérerait. Demande aussi comment il/elle pense que tu ressens ce problème."
]

export default function ThirtySixQuestionsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')
  const [partnerAnswer, setPartnerAnswer] = useState('')
  const [showPartnerAnswer, setShowPartnerAnswer] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [intimacyLevel, setIntimacyLevel] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Déterminer le set actuel
  useEffect(() => {
    if (currentQuestion < 12) setCurrentSet(1)
    else if (currentQuestion < 24) setCurrentSet(2)
    else setCurrentSet(3)
  }, [currentQuestion])

  const handleSubmit = () => {
    if (!userAnswer.trim()) return

    // Simuler la réponse du partenaire
    setShowPartnerAnswer(true)
    setPartnerAnswer(getSimulatedAnswer())
    
    // Augmenter le niveau d'intimité
    setIntimacyLevel(prev => Math.min(prev + 3, 100))
    
    // Marquer la question comme répondue
    setAnsweredQuestions(prev => [...prev, currentQuestion])
  }

  const getSimulatedAnswer = () => {
    const answers = [
      "C'est une excellente question ! Pour moi, je dirais que...",
      "J'y ai beaucoup réfléchi récemment. Je pense que...",
      "C'est drôle que tu demandes ça, parce que justement...",
      "Wow, ça me touche. Honnêtement...",
      "Je n'ai jamais vraiment pensé à ça avant, mais..."
    ]
    return answers[Math.floor(Math.random() * answers.length)] + " [Réponse simulée du partenaire]"
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer('')
      setPartnerAnswer('')
      setShowPartnerAnswer(false)
    } else {
      setIsComplete(true)
    }
  }

  const skipQuestion = () => {
    nextQuestion()
  }

  const getSetInfo = () => {
    switch(currentSet) {
      case 1: return { name: 'Connexion Légère', color: 'from-blue-500 to-cyan-500', emoji: '😊' }
      case 2: return { name: 'Connexion Moyenne', color: 'from-purple-500 to-pink-500', emoji: '💕' }
      case 3: return { name: 'Connexion Profonde', color: 'from-red-500 to-pink-500', emoji: '❤️' }
      default: return { name: '', color: '', emoji: '' }
    }
  }

  const setInfo = getSetInfo()

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="text-6xl mb-6">💕</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            36 Questions Complétées !
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-6">
            <div className="mb-6">
              <p className="text-white/60 mb-2">Niveau d'Intimité Atteint</p>
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-full transition-all duration-1000"
                  style={{ width: `${intimacyLevel}%` }}
                />
              </div>
              <p className="text-white font-bold text-2xl mt-2">{intimacyLevel}%</p>
            </div>
            <p className="text-white/80 mb-6">
              Vous avez créé une connexion profonde en partageant vos pensées et sentiments les plus intimes.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/week-chat'}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                Retour au Chat
              </button>
              <button
                onClick={() => window.location.href = '/game-room'}
                className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition"
              >
                Autre Jeu
              </button>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            💡 Ces questions sont basées sur l'étude d'Arthur Aron sur la création d'intimité
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-white font-bold text-xl">36 Questions pour Tomber Amoureux</h1>
              <span className={`bg-gradient-to-r ${setInfo.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {setInfo.emoji} {setInfo.name}
              </span>
            </div>
            <div className="text-white/60 text-sm">
              Question {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${setInfo.color} h-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          {/* Question Number */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold text-2xl mb-2">
              {currentQuestion + 1}
            </div>
            <p className="text-white/60 text-sm">Set {currentSet} - Question {(currentQuestion % 12) + 1}/12</p>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            {question}
          </h2>

          {/* Your Answer */}
          <div className="space-y-6">
            <div>
              <label className="text-white font-semibold mb-2 block">Ta Réponse</label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Partage ta réponse honnêtement..."
                className="w-full p-4 bg-white/10 rounded-xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 min-h-[120px]"
                disabled={showPartnerAnswer}
              />
            </div>

            {/* Submit Button */}
            {!showPartnerAnswer && (
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Partager Ma Réponse
              </button>
            )}

            {/* Partner's Answer */}
            {showPartnerAnswer && (
              <div className="animate-fadeIn">
                <label className="text-white font-semibold mb-2 block">Réponse d'Alex</label>
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <p className="text-white">{partnerAnswer}</p>
                </div>

                {/* Reaction Buttons */}
                <div className="flex gap-2 mt-4 justify-center">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition">
                    ❤️ J'adore
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition">
                    😊 Intéressant
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition">
                    🤔 Surprenant
                  </button>
                </div>

                {/* Next Button */}
                <button
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition mt-4"
                >
                  {currentQuestion < questions.length - 1 ? 'Question Suivante' : 'Terminer'}
                </button>
              </div>
            )}
          </div>

          {/* Skip Option */}
          {!showPartnerAnswer && (
            <button
              onClick={skipQuestion}
              className="w-full text-white/60 hover:text-white transition mt-4 text-sm"
            >
              Passer cette question →
            </button>
          )}
        </div>

        {/* Intimacy Meter */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Niveau d'Intimité</span>
            <span className="text-white font-semibold">{intimacyLevel}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-red-500 h-full transition-all duration-500"
              style={{ width: `${intimacyLevel}%` }}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center text-white/60 text-sm">
          💡 Soyez authentiques et vulnérables. C'est comme ça que les vraies connexions se créent.
        </div>
      </div>
    </div>
  )
}