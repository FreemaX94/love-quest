export const APP_CONFIG = {
  name: 'Love Quest',
  tagline: 'Your AI Companion That Levels Up With You',
  description: 'Experience the future of AI companionship with gamified relationships, RPG progression, and emotional intelligence.',
  url: 'https://lovequest.vercel.app',
  pricing: {
    free: {
      messages: 50,
      features: ['Basic chat', '1 mini-game/day', 'Level up to 10']
    },
    premium: {
      price: 29, // Early bird price
      currency: '€',
      messages: 'unlimited',
      features: ['Unlimited chat', 'All mini-games', 'Voice messages', 'Level 100+', 'Custom avatar']
    }
  }
}

export const GAME_CONFIG = {
  xp: {
    message: 10,
    miniGame: 50,
    daily: 100,
    achievement: 200
  },
  levels: {
    max: 100,
    xpRequired: (level: number) => Math.floor(100 * Math.pow(1.5, level - 1))
  },
  energy: {
    max: 100,
    regenRate: 1, // per minute
    messagesCost: 1,
    gameCost: 10
  }
}

export const COMPANION_ARCHETYPES = [
  { id: 'adventurous', name: 'Adventurous', traits: ['curious', 'brave', 'spontaneous'] },
  { id: 'intellectual', name: 'Intellectual', traits: ['smart', 'analytical', 'thoughtful'] },
  { id: 'caring', name: 'Caring', traits: ['empathetic', 'supportive', 'warm'] },
  { id: 'playful', name: 'Playful', traits: ['funny', 'energetic', 'creative'] },
  { id: 'mysterious', name: 'Mysterious', traits: ['enigmatic', 'deep', 'intriguing'] },
  { id: 'romantic', name: 'Romantic', traits: ['passionate', 'affectionate', 'devoted'] },
  { id: 'confident', name: 'Confident', traits: ['bold', 'assertive', 'inspiring'] },
  { id: 'gentle', name: 'Gentle', traits: ['calm', 'patient', 'understanding'] }
]