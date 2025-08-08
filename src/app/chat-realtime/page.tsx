'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'audio' | 'image' | 'video'
  media_url?: string
  day_sent: number
  created_at: string
  read_at?: string
  sender?: {
    username?: string
    full_name?: string
  }
}

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

export default function ChatRealtimePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat
  useEffect(() => {
    initializeChat()
    
    return () => {
      // Cleanup subscriptions
      supabase.channel('messages').unsubscribe()
      supabase.channel('typing').unsubscribe()
    }
  }, [])

  const initializeChat = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push('/auth/login')
        return
      }
      setCurrentUser(user)

      // Get current active match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(id, username, full_name),
          user2:profiles!matches_user2_id_fkey(id, username, full_name)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active')
        .single()

      if (matchError || !matchData) {
        console.log('No active match found')
        setIsLoading(false)
        return
      }

      // Determine partner info
      const partner = matchData.user1_id === user.id ? matchData.user2 : matchData.user1
      setCurrentMatch({
        ...matchData,
        partner
      })

      // Load existing messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(username, full_name)
        `)
        .eq('match_id', matchData.id)
        .order('created_at', { ascending: true })

      if (!messagesError && messagesData) {
        setMessages(messagesData)
      }

      // Subscribe to new messages
      const messageChannel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `match_id=eq.${matchData.id}`
          },
          async (payload) => {
            // Fetch sender info for new message
            const { data: senderData } = await supabase
              .from('profiles')
              .select('username, full_name')
              .eq('id', payload.new.sender_id)
              .single()

            const newMessage = {
              ...payload.new,
              sender: senderData
            } as Message

            setMessages(prev => [...prev, newMessage])
            
            // Mark as read if it's from partner
            if (payload.new.sender_id !== user.id) {
              markMessageAsRead(payload.new.id)
            }
          }
        )
        .subscribe()

      // Subscribe to typing indicators
      const typingChannel = supabase
        .channel('typing')
        .on('presence', { event: 'sync' }, () => {
          const state = typingChannel.presenceState()
          const typingUsers = Object.values(state).flat()
          const otherUserTyping = typingUsers.find((u: any) => u.user_id !== user.id)
          setTypingUser(otherUserTyping ? otherUserTyping.username : null)
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (newPresences[0]?.user_id !== user.id) {
            setTypingUser(newPresences[0]?.username)
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (leftPresences[0]?.user_id !== user.id) {
            setTypingUser(null)
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await typingChannel.track({
              user_id: user.id,
              username: user.email?.split('@')[0] || 'User',
              typing: false
            })
          }
        })

      setIsLoading(false)
    } catch (error) {
      console.error('Error initializing chat:', error)
      setIsLoading(false)
    }
  }

  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
  }

  const handleTyping = async (typing: boolean) => {
    if (!currentUser) return
    
    const channel = supabase.channel('typing')
    await channel.track({
      user_id: currentUser.id,
      username: currentUser.email?.split('@')[0] || 'User',
      typing
    })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentMatch || !currentUser) return

    const messageContent = input.trim()
    setInput('')
    handleTyping(false)

    // Check if the feature is unlocked for current day
    const canSendText = currentMatch.current_day >= 1

    if (!canSendText) {
      alert('Les messages texte ne sont pas encore débloqués !')
      return
    }

    // Insert message to database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: currentMatch.id,
        sender_id: currentUser.id,
        content: messageContent,
        message_type: 'text',
        day_sent: currentMatch.current_day
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      setInput(messageContent) // Restore input on error
    }
  }

  const sendAudioMessage = async () => {
    if (!currentMatch) return
    
    if (currentMatch.current_day < 2) {
      alert('Les messages vocaux se débloquent au jour 2 !')
      return
    }
    
    // TODO: Implement audio recording and upload
    alert('Fonctionnalité audio à venir !')
  }

  const sendPhoto = async () => {
    if (!currentMatch) return
    
    if (currentMatch.current_day < 3) {
      alert('Les photos se débloquent au jour 3 !')
      return
    }
    
    // TODO: Implement photo upload
    alert('Fonctionnalité photo à venir !')
  }

  const startAudioCall = () => {
    if (!currentMatch) return
    
    if (currentMatch.current_day < 4) {
      alert('Les appels audio se débloquent au jour 4 !')
      return
    }
    
    alert('Fonctionnalité appel audio à venir !')
  }

  const startVideoCall = () => {
    if (!currentMatch) return
    
    if (currentMatch.current_day < 5) {
      alert('Les appels vidéo se débloquent au jour 5 !')
      return
    }
    
    alert('Fonctionnalité appel vidéo à venir !')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-white">Chargement du chat...</p>
        </div>
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-3xl font-bold text-white mb-4">Pas de match actif</h1>
          <p className="text-white/60 mb-6">
            Attendez lundi prochain pour recevoir votre match de la semaine !
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

  const getDayFeatures = (day: number) => {
    const features = []
    if (day >= 1) features.push('💬 Chat texte')
    if (day >= 2) features.push('🎤 Messages vocaux')
    if (day >= 3) features.push('📸 Photos')
    if (day >= 4) features.push('📞 Appel audio')
    if (day >= 5) features.push('🎥 Appel vidéo')
    return features
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-white/60 hover:text-white"
              >
                ←
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h1 className="text-white font-bold">
                    {currentMatch.partner?.full_name || currentMatch.partner?.username || 'Votre Match'}
                  </h1>
                  <p className="text-white/60 text-xs">
                    Jour {currentMatch.current_day} - {typingUser ? 'En train d\'écrire...' : 'En ligne'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Day indicator */}
            <div className="text-white/60 text-sm">
              Jour {currentMatch.current_day}/7
            </div>
          </div>
        </div>
      </div>

      {/* Features unlocked */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-white/60 text-sm">Débloqué:</span>
            {getDayFeatures(currentMatch.current_day).map((feature, i) => (
              <span 
                key={i}
                className="bg-white/10 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-4 overflow-hidden flex flex-col max-w-4xl">
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/60">Commencez la conversation ! 💬</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender_id === currentUser?.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                }`}
              >
                {message.message_type === 'text' && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.message_type === 'audio' && (
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      ▶️
                    </button>
                    <span className="text-sm">Message vocal</span>
                  </div>
                )}
                {message.message_type === 'image' && (
                  <div className="mb-2">
                    <img 
                      src={message.media_url || '#'} 
                      alt="Photo" 
                      className={`rounded-lg ${currentMatch.current_day < 6 ? 'filter blur-xl' : ''}`}
                    />
                  </div>
                )}
                <p className="text-xs opacity-60 mt-1">
                  {new Date(message.created_at).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {message.read_at && message.sender_id === currentUser?.id && ' ✓✓'}
                </p>
              </div>
            </div>
          ))}
          
          {typingUser && (
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
          <form onSubmit={sendMessage} className="flex gap-2">
            {/* Action Buttons */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={sendAudioMessage}
                className={`p-3 rounded-full transition ${
                  currentMatch.current_day >= 2 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentMatch.current_day < 2}
                title={currentMatch.current_day < 2 ? 'Débloqué au jour 2' : 'Message vocal'}
              >
                🎤
              </button>
              
              <button
                type="button"
                onClick={sendPhoto}
                className={`p-3 rounded-full transition ${
                  currentMatch.current_day >= 3 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentMatch.current_day < 3}
                title={currentMatch.current_day < 3 ? 'Débloqué au jour 3' : 'Envoyer une photo'}
              >
                📸
              </button>
              
              <button
                type="button"
                onClick={startAudioCall}
                className={`p-3 rounded-full transition ${
                  currentMatch.current_day >= 4 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentMatch.current_day < 4}
                title={currentMatch.current_day < 4 ? 'Débloqué au jour 4' : 'Appel audio'}
              >
                📞
              </button>
              
              <button
                type="button"
                onClick={startVideoCall}
                className={`p-3 rounded-full transition ${
                  currentMatch.current_day >= 5 
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                disabled={currentMatch.current_day < 5}
                title={currentMatch.current_day < 5 ? 'Débloqué au jour 5' : 'Appel vidéo'}
              >
                🎥
              </button>
            </div>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                handleTyping(e.target.value.length > 0)
              }}
              onBlur={() => handleTyping(false)}
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
        </div>
      </div>
    </div>
  )
}