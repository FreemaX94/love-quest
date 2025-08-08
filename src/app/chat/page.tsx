'use client'

import { useState, useRef, useEffect } from 'react'
import { sendMessageToGroq, getCompanionSystemPrompt, GROQ_MODELS } from '@/lib/groq'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [companionName] = useState('Luna')
  const [userLevel, setUserLevel] = useState(1)
  const [userXP, setUserXP] = useState(0)
  const [language] = useState<'fr' | 'en'>('fr')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // XP nécessaire pour chaque niveau
  const getXPRequired = (level: number) => Math.floor(100 * Math.pow(1.2, level - 1))

  // Scroll vers le bas automatiquement
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Message de bienvenue au chargement
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: language === 'fr' 
        ? `Salut ! Je suis ${companionName} 💜 Je suis tellement heureuse de te rencontrer ! Comment te sens-tu aujourd'hui ?`
        : `Hi! I'm ${companionName} 💜 I'm so happy to meet you! How are you feeling today?`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [companionName, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Préparer les messages pour l'API
      const apiMessages = [
        { role: 'system' as const, content: getCompanionSystemPrompt(companionName, language) },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: input }
      ]

      // Appeler Groq API
      const response = await sendMessageToGroq(apiMessages, GROQ_MODELS.LLAMA_8B)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Ajouter de l'XP
      const xpGained = 10 + Math.floor(Math.random() * 10)
      setUserXP(prev => {
        const newXP = prev + xpGained
        const requiredXP = getXPRequired(userLevel)
        
        // Level up!
        if (newXP >= requiredXP) {
          setUserLevel(level => level + 1)
          return newXP - requiredXP
        }
        return newXP
      })

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'fr'
          ? '😔 Désolée, j\'ai eu un problème de connexion. Peux-tu réessayer ?'
          : '😔 Sorry, I had a connection issue. Can you try again?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const xpProgress = (userXP / getXPRequired(userLevel)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex flex-col">
      {/* Header avec stats */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-white hover:text-white/80 transition">
                ← Retour
              </a>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full"></div>
                <div>
                  <h1 className="text-white font-bold">{companionName}</h1>
                  <p className="text-white/60 text-sm">En ligne</p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-white/60 text-xs">Niveau</p>
                <p className="text-white font-bold text-lg">{userLevel}</p>
              </div>
              <div className="w-32">
                <p className="text-white/60 text-xs mb-1">XP: {userXP}/{getXPRequired(userLevel)}</p>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 container mx-auto px-4 py-4 overflow-hidden flex flex-col max-w-4xl">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
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

        {/* Zone de saisie */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'fr' ? "Écris ton message..." : "Type your message..."}
              className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
            >
              {language === 'fr' ? 'Envoyer' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}