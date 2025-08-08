'use client'

import { useState, useEffect } from 'react'

interface Question {
  id: string
  category: 'values' | 'lifestyle' | 'personality' | 'relationships' | 'fun'
  question: string
  type: 'single' | 'multiple' | 'scale' | 'text'
  options?: string[]
  emoji?: string
}

const questions: Question[] = [
  // VALEURS PROFONDES (5 questions)
  {
    id: 'values_1',
    category: 'values',
    question: "Qu'est-ce qui est le plus important pour toi dans la vie ?",
    type: 'single',
    emoji: '💫',
    options: [
      'La famille et les relations proches',
      'La carrière et la réussite professionnelle',
      'L\'aventure et les nouvelles expériences',
      'La stabilité et la sécurité',
      'La créativité et l\'expression personnelle',
      'L\'impact social et aider les autres'
    ]
  },
  {
    id: 'values_2',
    category: 'values',
    question: "Comment vois-tu ton futur dans 5 ans ?",
    type: 'multiple',
    emoji: '🔮',
    options: [
      'Marié(e) avec des enfants',
      'Voyageant autour du monde',
      'Dirigeant ma propre entreprise',
      'Dans une relation stable sans enfants',
      'Focalisé(e) sur ma carrière',
      'Vivant une vie simple et paisible'
    ]
  },
  {
    id: 'values_3',
    category: 'values',
    question: "Qu'est-ce qui te fait sentir le plus accompli(e) ?",
    type: 'single',
    emoji: '🏆',
    options: [
      'Aider quelqu\'un dans le besoin',
      'Atteindre un objectif difficile',
      'Créer quelque chose de nouveau',
      'Être reconnu(e) pour mon travail',
      'Passer du temps de qualité avec mes proches',
      'Apprendre quelque chose de nouveau'
    ]
  },
  {
    id: 'values_4',
    category: 'values',
    question: "Ta relation avec l'argent ?",
    type: 'single',
    emoji: '💰',
    options: [
      'C\'est un outil pour vivre confortablement',
      'Important mais pas ma priorité',
      'J\'aime économiser pour le futur',
      'Je préfère dépenser pour des expériences',
      'Le minimum vital me suffit',
      'C\'est très important pour moi'
    ]
  },
  {
    id: 'values_5',
    category: 'values',
    question: "Ta philosophie de vie en une phrase ?",
    type: 'single',
    emoji: '🌟',
    options: [
      'Vivre chaque jour comme si c\'était le dernier',
      'Travailler dur, jouer dur',
      'La famille avant tout',
      'Suivre ses passions',
      'L\'équilibre en toute chose',
      'Faire une différence dans le monde'
    ]
  },

  // LIFESTYLE (5 questions)
  {
    id: 'lifestyle_1',
    category: 'lifestyle',
    question: "Ton weekend idéal ?",
    type: 'single',
    emoji: '🎉',
    options: [
      'Soirée entre amis et sorties',
      'Netflix, canapé et tranquillité',
      'Randonnée ou activités en plein air',
      'Brunch et shopping',
      'Projets créatifs ou hobbies',
      'Voyage spontané'
    ]
  },
  {
    id: 'lifestyle_2',
    category: 'lifestyle',
    question: "Tu es plutôt du matin ou du soir ?",
    type: 'scale',
    emoji: '🌅',
    options: ['Lève-tôt (5h-7h)', 'Matin (7h-9h)', 'Normal (9h-11h)', 'Tard (11h+)', 'Couche-tard (2h+)']
  },
  {
    id: 'lifestyle_3',
    category: 'lifestyle',
    question: "Ton rapport au sport ?",
    type: 'single',
    emoji: '💪',
    options: [
      'Je m\'entraîne presque tous les jours',
      '2-3 fois par semaine',
      'Quand j\'ai la motivation',
      'Je déteste le sport',
      'Je préfère les activités douces (yoga, marche)',
      'Sports d\'équipe uniquement'
    ]
  },
  {
    id: 'lifestyle_4',
    category: 'lifestyle',
    question: "Animaux de compagnie ?",
    type: 'single',
    emoji: '🐾',
    options: [
      'J\'ai déjà un/des animaux',
      'J\'en veux absolument',
      'Pourquoi pas',
      'Seulement des chats',
      'Seulement des chiens',
      'Pas du tout'
    ]
  },
  {
    id: 'lifestyle_5',
    category: 'lifestyle',
    question: "Ton environnement de vie idéal ?",
    type: 'single',
    emoji: '🏡',
    options: [
      'Centre-ville animé',
      'Banlieue tranquille',
      'Campagne paisible',
      'Près de la mer',
      'Montagne',
      'Je change souvent'
    ]
  },

  // PERSONNALITÉ (5 questions)
  {
    id: 'personality_1',
    category: 'personality',
    question: "Dans un groupe, tu es plutôt ?",
    type: 'single',
    emoji: '👥',
    options: [
      'Le/la leader qui prend les décisions',
      'Le/la médiateur qui apaise les tensions',
      'L\'organisateur qui planifie tout',
      'Le/la créatif avec les idées folles',
      'L\'observateur silencieux',
      'Le/la boute-en-train qui anime'
    ]
  },
  {
    id: 'personality_2',
    category: 'personality',
    question: "Comment gères-tu les conflits ?",
    type: 'single',
    emoji: '🤝',
    options: [
      'Discussion calme et rationnelle',
      'J\'évite les conflits au maximum',
      'J\'exprime mes émotions directement',
      'Je prends du recul avant de réagir',
      'Je cherche un compromis',
      'Je peux être têtu(e) sur mes positions'
    ]
  },
  {
    id: 'personality_3',
    category: 'personality',
    question: "Ton plus grand défaut selon tes amis ?",
    type: 'single',
    emoji: '😅',
    options: [
      'Trop perfectionniste',
      'Toujours en retard',
      'Trop direct(e)/franc(he)',
      'Indécis(e)',
      'Trop sensible',
      'Workaholic'
    ]
  },
  {
    id: 'personality_4',
    category: 'personality',
    question: "Tu prends des décisions plutôt avec ?",
    type: 'scale',
    emoji: '🧠',
    options: ['100% Logique', '75% Logique', '50/50', '75% Émotions', '100% Émotions']
  },
  {
    id: 'personality_5',
    category: 'personality',
    question: "Ton niveau d'organisation ?",
    type: 'scale',
    emoji: '📅',
    options: ['Chaos total', 'Désorganisé', 'Normal', 'Bien organisé', 'Monica de Friends']
  },

  // RELATIONS (5 questions)
  {
    id: 'relationships_1',
    category: 'relationships',
    question: "Dans une relation, tu as besoin de ?",
    type: 'multiple',
    emoji: '❤️',
    options: [
      'Beaucoup d\'indépendance',
      'Communication constante',
      'Affection physique',
      'Stabilité émotionnelle',
      'Aventure et spontanéité',
      'Rires et légèreté'
    ]
  },
  {
    id: 'relationships_2',
    category: 'relationships',
    question: "Tes love languages préférés ?",
    type: 'multiple',
    emoji: '💕',
    options: [
      'Mots d\'affirmation',
      'Temps de qualité',
      'Cadeaux',
      'Actes de service',
      'Contact physique'
    ]
  },
  {
    id: 'relationships_3',
    category: 'relationships',
    question: "Deal-breaker absolu ?",
    type: 'single',
    emoji: '🚫',
    options: [
      'Manque d\'ambition',
      'Infidélité',
      'Manque d\'humour',
      'Valeurs différentes',
      'Mauvaise communication',
      'Manque d\'indépendance'
    ]
  },
  {
    id: 'relationships_4',
    category: 'relationships',
    question: "Ta jalousie sur une échelle ?",
    type: 'scale',
    emoji: '😤',
    options: ['Zéro jalousie', 'Peu jaloux', 'Normal', 'Assez jaloux', 'Très jaloux']
  },
  {
    id: 'relationships_5',
    category: 'relationships',
    question: "Enfants ?",
    type: 'single',
    emoji: '👶',
    options: [
      'J\'en ai déjà',
      'J\'en veux absolument',
      'J\'en veux plus tard',
      'Peut-être un jour',
      'Je n\'en veux pas',
      'Indécis(e)'
    ]
  },

  // FUN & QUIRKY (5 questions)
  {
    id: 'fun_1',
    category: 'fun',
    question: "Pineapple sur la pizza ?",
    type: 'single',
    emoji: '🍕',
    options: [
      'Crime contre l\'humanité',
      'Team ananas forever',
      'Je m\'en fiche'
    ]
  },
  {
    id: 'fun_2',
    category: 'fun',
    question: "Superpouvoir de rêve ?",
    type: 'single',
    emoji: '🦸',
    options: [
      'Téléportation',
      'Lire dans les pensées',
      'Voler',
      'Invisibilité',
      'Voyager dans le temps',
      'Parler aux animaux'
    ]
  },
  {
    id: 'fun_3',
    category: 'fun',
    question: "Ton guilty pleasure ?",
    type: 'single',
    emoji: '🙈',
    options: [
      'Télé-réalité',
      'ASMR',
      'TikTok jusqu\'à 3h du mat',
      'Chansons Disney',
      'Rom-coms clichés',
      'Jeux mobiles addictifs'
    ]
  },
  {
    id: 'fun_4',
    category: 'fun',
    question: "Si ta vie était une série ?",
    type: 'single',
    emoji: '📺',
    options: [
      'Friends - Comédie entre potes',
      'Game of Thrones - Drame épique',
      'The Office - Comédie absurde',
      'Stranger Things - Mystérieux',
      'Emily in Paris - Glamour',
      'Breaking Bad - Intense'
    ]
  },
  {
    id: 'fun_5',
    category: 'fun',
    question: "Ton emoji préféré ?",
    type: 'single',
    emoji: '😊',
    options: ['😂', '❤️', '🔥', '✨', '🤔', '😭']
  }
]

export default function OnboardingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [textAnswer, setTextAnswer] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleSingleAnswer = (option: string) => {
    setAnswers({ ...answers, [question.id]: option })
    setTimeout(() => nextQuestion(), 300)
  }

  const handleMultipleAnswer = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const handleScaleAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value })
    setTimeout(() => nextQuestion(), 300)
  }

  const nextQuestion = () => {
    if (question.type === 'multiple') {
      setAnswers({ ...answers, [question.id]: selectedOptions })
      setSelectedOptions([])
    } else if (question.type === 'text') {
      setAnswers({ ...answers, [question.id]: textAnswer })
      setTextAnswer('')
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeOnboarding()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const completeOnboarding = () => {
    // Sauvegarder les réponses
    localStorage.setItem('onboarding_answers', JSON.stringify(answers))
    localStorage.setItem('onboarding_complete', 'true')
    setIsComplete(true)
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'values': return 'from-purple-500 to-pink-500'
      case 'lifestyle': return 'from-blue-500 to-cyan-500'
      case 'personality': return 'from-green-500 to-emerald-500'
      case 'relationships': return 'from-red-500 to-pink-500'
      case 'fun': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'values': return 'Valeurs'
      case 'lifestyle': return 'Lifestyle'
      case 'personality': return 'Personnalité'
      case 'relationships': return 'Relations'
      case 'fun': return 'Fun'
      default: return ''
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Profil Complété !
          </h1>
          <p className="text-white/80 text-xl mb-8">
            On analyse tes réponses pour te trouver le match parfait...
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-white mb-4">
              Tu recevras une notification lundi prochain avec ton match de la semaine !
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
            >
              Voir mon Dashboard
            </button>
          </div>
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
            <div className="text-white font-bold text-xl">
              💘 Love Quest
            </div>
            <div className="text-white/60 text-sm">
              Question {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          {/* Category Badge */}
          <div className="mb-6 text-center">
            <span className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(question.category)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
              {question.emoji} {getCategoryName(question.category)}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.type === 'single' && question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSingleAnswer(option)}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-left transition-all hover:scale-[1.02] border border-white/20"
              >
                {option}
              </button>
            ))}

            {question.type === 'multiple' && (
              <>
                <div className="space-y-3 mb-6">
                  {question.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleMultipleAnswer(option)}
                      className={`w-full p-4 rounded-xl text-white text-left transition-all border ${
                        selectedOptions.includes(option) 
                          ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-500' 
                          : 'bg-white/10 hover:bg-white/20 border-white/20'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {option}
                        {selectedOptions.includes(option) && <span>✓</span>}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextQuestion}
                  disabled={selectedOptions.length === 0}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer ({selectedOptions.length} sélectionné{selectedOptions.length > 1 ? 's' : ''})
                </button>
              </>
            )}

            {question.type === 'scale' && (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleScaleAnswer(option)}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-[1.02] border border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i <= index ? 'bg-white' : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <>
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Ta réponse..."
                  className="w-full p-4 bg-white/10 rounded-xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 min-h-[120px]"
                />
                <button
                  onClick={nextQuestion}
                  disabled={textAnswer.trim().length === 0}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="text-white/60 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setCurrentQuestion(questions.length - 1)}
              className="text-white/60 hover:text-white transition text-sm"
            >
              Passer →
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center text-white/60 text-sm">
          💡 Sois honnête, il n'y a pas de mauvaise réponse. L'authenticité crée les meilleures connexions.
        </div>
      </div>
    </div>
  )
}