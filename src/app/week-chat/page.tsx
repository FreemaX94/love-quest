'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  sender: 'user' | 'match'
  content: string
  timestamp: Date
  type: 'text' | 'audio' | 'image' | 'video'
  audioUrl?: string
  imageUrl?: string
}

interface DayProgress {
  day: number
  name: string
  unlocked: boolean
  features: string[]
  activity: string
  completed: boolean
}

export default function WeekChatPage() {
  const [currentDay, setCurrentDay] = useState(1)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [matchName] = useState('Alex')
  const [isRecording, setIsRecording] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)
  const [isVideoCalling, setIsVideoCalling] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const weekProgress: DayProgress[] = [
    {
      day: 1,
      name: 'Lundi',
      unlocked: true,
      features: ['Chat texte', 'Emojis'],
      activity: '2 Vérités, 1 Mensonge',
      completed: false
    },
    {
      day: 2,
      name: 'Mardi',
      unlocked: currentDay >= 2,
      features: ['Messages vocaux'],
      activity: '36 Questions',
      completed: false
    },
    {
      day: 3,
      name: 'Mercredi',
      unlocked: currentDay >= 3,
      features: ['Photos floutées'],
      activity: 'Dessinez ensemble',
      completed: false
    },
    {
      day: 4,
      name: 'Jeudi',
      unlocked: currentDay >= 4,
      features: ['Appel audio'],
      activity: 'Planifiez un voyage',
      completed: false
    },
    {
      day: 5,
      name: 'Vendredi',
      unlocked: currentDay >= 5,
      features: ['Appel vidéo'],
      activity: 'Quiz compatibilité',
      completed: false
    },
    {
      day: 6,
      name: 'Samedi',
      unlocked: currentDay >= 6,
      features: ['Photos nettes'],
      activity: 'Escape room',
      completed: false
    },
    {
      day: 7,
      name: 'Dimanche',
      unlocked: currentDay >= 7,
      features: ['Tout débloqué'],
      activity: 'Décision finale',
      completed: false
    }
  ]

  const currentDayInfo = weekProgress[currentDay - 1]

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Message initial
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      sender: 'match',
      content: `Salut ! C'est notre jour ${currentDay} ensemble 💕 Aujourd'hui on peut ${currentDayInfo.features.join(', ')} !`,
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([initialMessage])
  }, [currentDay])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    // Simuler la réponse
    setIsTyping(true)
    setTimeout(() => {
      const matchMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'match',
        content: getRandomResponse(),
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, matchMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getRandomResponse = () => {
    const responses = [
      "C'est super intéressant ! Raconte-moi plus 😊",
      "J'adore ta façon de penser !",
      "Haha, tu me fais trop rire 😂",
      "On est vraiment sur la même longueur d'onde",
      "J'ai hâte qu'on puisse se parler de vive voix !",
      "Tu as l'air d'être quelqu'un de vraiment spécial ✨"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendAudioMessage = () => {
    if (currentDay < 2) {
      alert("Les messages vocaux se débloquent au jour 2 !")
      return
    }
    
    setIsRecording(!isRecording)
    if (isRecording) {
      // Simuler l'envoi d'un message audio
      const audioMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: '🎤 Message vocal (0:12)',
        timestamp: new Date(),
        type: 'audio',
        audioUrl: '#'
      }
      setMessages(prev => [...prev, audioMessage])
    }
  }

  const sendPhoto = () => {
    if (currentDay < 3) {
      alert("Les photos se débloquent au jour 3 !")
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const photoMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: currentDay < 6 ? '📸 Photo (floutée)' : '📸 Photo',
        timestamp: new Date(),
        type: 'image',
        imageUrl: URL.createObjectURL(file)
      }
      setMessages(prev => [...prev, photoMessage])
    }
  }

  const startAudioCall = () => {
    if (currentDay < 4) {
      alert("Les appels audio se débloquent au jour 4 !")
      return
    }
    alert("Appel audio en cours... 📞")
  }

  const startVideoCall = () => {
    if (currentDay < 5) {
      alert("Les appels vidéo se débloquent au jour 5 !")
      return
    }
    setIsVideoCalling(true)
  }

  const playActivity = () => {
    window.location.href = `/games/truth-or-dare`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-white/60 hover:text-white">←</a>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                    {currentDay >= 3 && !showPhotos ? '👤' : '🎮'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h1 className="text-white font-bold">{matchName}</h1>
                  <p className="text-white/60 text-xs">Jour {currentDay} - {currentDayInfo.name}</p>
                </div>
              </div>
            </div>
            
            {/* Day Progress */}
            <div className="flex items-center gap-2">
              {weekProgress.map((day) => (
                <div
                  key={day.day}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    day.day === currentDay 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110' 
                      : day.unlocked 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-white/40'
                  }`}
                  title={`${day.name} - ${day.activity}`}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Banner */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <p className="text-white text-sm">
                <strong>Activité du jour:</strong> {currentDayInfo.activity}
              </p>
            </div>
            <button
              onClick={playActivity}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-semibold transition"
            >
              Jouer →
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-4 overflow-hidden flex flex-col max-w-4xl">
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                }`}
              >
                {message.type === 'audio' && (
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      ▶️
                    </button>
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div className="bg-white h-full w-1/3 rounded-full"></div>
                    </div>
                    <span className="text-xs">0:12</span>
                  </div>
                )}
                {message.type === 'image' && (
                  <div className="mb-2">
                    <div className={`w-full h-32 bg-white/10 rounded-lg flex items-center justify-center ${
                      currentDay < 6 ? 'backdrop-blur-xl' : ''
                    }`}>
                      {currentDay < 6 ? '🔒 Photo floutée' : '📸'}
                    </div>
                  </div>
                )}
                {message.type === 'text' && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-white/20">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 pt-4">
          {/* Features Unlocked */}
          <div className="flex gap-2 mb-3">
            {currentDayInfo.features.map((feature, i) => (
              <span 
                key={i}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white px-3 py-1 rounded-full text-xs font-semibold border border-pink-500/30"
              >
                ✨ {feature}
              </span>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            {/* Action Buttons */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={sendAudioMessage}
                className={`p-3 rounded-full transition ${
                  currentDay >= 2 
                    ? isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentDay < 2}
                title={currentDay < 2 ? 'Débloqué au jour 2' : 'Message vocal'}
              >
                🎤
              </button>
              
              <button
                type="button"
                onClick={sendPhoto}
                className={`p-3 rounded-full transition ${
                  currentDay >= 3 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentDay < 3}
                title={currentDay < 3 ? 'Débloqué au jour 3' : 'Envoyer une photo'}
              >
                📸
              </button>
              
              <button
                type="button"
                onClick={startAudioCall}
                className={`p-3 rounded-full transition ${
                  currentDay >= 4 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentDay < 4}
                title={currentDay < 4 ? 'Débloqué au jour 4' : 'Appel audio'}
              >
                📞
              </button>
              
              <button
                type="button"
                onClick={startVideoCall}
                className={`p-3 rounded-full transition ${
                  currentDay >= 5 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentDay < 5}
                title={currentDay < 5 ? 'Débloqué au jour 5' : 'Appel vidéo'}
              >
                🎥
              </button>
            </div>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ton message..."
              className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none"
            />
            
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition font-semibold"
            >
              Envoyer
            </button>
          </form>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Video Call Modal */}
      {isVideoCalling && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <h2 className="text-white text-2xl font-bold mb-2">Appel vidéo avec {matchName}</h2>
              <p className="text-white/60 mb-6">La vidéo démarre...</p>
              <div className="bg-black rounded-2xl h-64 mb-6 flex items-center justify-center">
                <p className="text-white/40">Caméra en cours de chargement...</p>
              </div>
              <button
                onClick={() => setIsVideoCalling(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                Terminer l'appel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Progress Info */}
      <div className="bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">
              💡 Demain: {weekProgress[Math.min(currentDay, 6)].features.join(', ')}
            </p>
            <button 
              onClick={() => setCurrentDay(Math.min(currentDay + 1, 7))}
              className="text-white/60 hover:text-white text-sm transition"
            >
              Simuler jour suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}