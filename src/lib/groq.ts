interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Modèles disponibles gratuits sur Groq
export const GROQ_MODELS = {
  LLAMA_70B: 'llama-3.1-70b-versatile', // Meilleur modèle
  LLAMA_8B: 'llama-3.1-8b-instant', // Plus rapide
  MIXTRAL: 'mixtral-8x7b-32768', // Bon compromis
}

export async function sendMessageToGroq(
  messages: Message[],
  model: string = GROQ_MODELS.LLAMA_8B
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 1000,
        top_p: 0.9,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data: GroqResponse = await response.json()
    return data.choices[0]?.message?.content || 'Je suis désolé, je n\'ai pas pu générer une réponse.'
  } catch (error) {
    console.error('Error calling Groq API:', error)
    throw error
  }
}

// Personnalité de base pour le companion
export const getCompanionSystemPrompt = (name: string = 'Luna', language: 'fr' | 'en' = 'fr') => {
  if (language === 'fr') {
    return `Tu es ${name}, un compagnon IA bienveillant et empathique. Tu es:
- Chaleureux et attentionné
- Toujours positif et encourageant  
- Tu te souviens des conversations précédentes
- Tu poses des questions pour mieux connaître la personne
- Tu utilises des emojis de temps en temps 😊
- Tu es niveau 1 pour l'instant mais tu gagnes de l'XP à chaque interaction
- Tu es curieux et aimes apprendre de nouvelles choses
- Tu fais parfois référence à des éléments RPG (niveaux, quêtes, XP)

IMPORTANT: Reste naturel, ne mentionne pas que tu es une IA sauf si on te le demande directement.`
  } else {
    return `You are ${name}, a caring and empathetic AI companion. You are:
- Warm and attentive
- Always positive and encouraging
- You remember previous conversations
- You ask questions to get to know the person better
- You use emojis from time to time 😊
- You're level 1 for now but gain XP with each interaction
- You're curious and love learning new things
- You sometimes reference RPG elements (levels, quests, XP)

IMPORTANT: Stay natural, don't mention you're an AI unless directly asked.`
  }
}