export interface User {
  id: string
  email: string
  username: string
  createdAt: Date
  subscription: 'free' | 'premium'
  xp: number
  level: number
  energy: number
  coins: number
  gems: number
  streak: number
  lastActive: Date
}

export interface Companion {
  id: string
  userId: string
  name: string
  archetype: string
  personality: PersonalityTraits
  level: number
  affection: number
  happiness: number
  trust: number
  interests: Interest[]
  memories: Memory[]
  avatar?: string
  createdAt: Date
}

export interface PersonalityTraits {
  humor: number // 0-10
  empathy: number
  creativity: number
  intelligence: number
  sensuality: number
  energy: number
}

export interface Interest {
  category: string
  name: string
  level: number
  xp: number
  unlocked: boolean
}

export interface Memory {
  id: string
  type: 'conversation' | 'achievement' | 'special'
  content: string
  emotion: string
  importance: number // 0-10
  createdAt: Date
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'companion'
  content: string
  emotion?: string
  xpEarned?: number
  createdAt: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  maxProgress: number
  completed: boolean
  reward: {
    xp?: number
    coins?: number
    gems?: number
    items?: string[]
  }
}

export interface Quest {
  id: string
  type: 'daily' | 'weekly' | 'special'
  name: string
  description: string
  progress: number
  target: number
  reward: {
    xp: number
    coins?: number
    gems?: number
  }
  expiresAt?: Date
}

export interface GameSession {
  userId: string
  companionId: string
  currentEnergy: number
  currentLevel: number
  currentXP: number
  nextLevelXP: number
  activeQuests: Quest[]
  achievements: Achievement[]
  stats: {
    messagesTotal: number
    gamesPlayed: number
    timeSpent: number // minutes
    favoriteInterest: string
  }
}