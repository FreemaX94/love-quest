import { createClient } from '@/lib/supabase/server'

interface UserProfile {
  id: string
  age: number
  location: string
  values: string[]
  interests: string[]
  questionnaire_responses: QuestionnaireResponse[]
}

interface QuestionnaireResponse {
  question_id: string
  category: string
  answer: any
}

interface MatchScore {
  user1_id: string
  user2_id: string
  total_score: number
  breakdown: {
    values_score: number
    interests_score: number
    personality_score: number
    lifestyle_score: number
    location_score: number
  }
}

/**
 * Algorithme de matching principal
 * Calcule la compatibilité entre deux utilisateurs basée sur :
 * - Valeurs communes (40%)
 * - Centres d'intérêt (20%)
 * - Personnalité complémentaire (20%)
 * - Style de vie (10%)
 * - Proximité géographique (10%)
 */
export async function calculateCompatibility(
  user1: UserProfile,
  user2: UserProfile
): Promise<MatchScore> {
  
  const breakdown = {
    values_score: calculateValuesScore(user1, user2),
    interests_score: calculateInterestsScore(user1, user2),
    personality_score: calculatePersonalityScore(user1, user2),
    lifestyle_score: calculateLifestyleScore(user1, user2),
    location_score: calculateLocationScore(user1, user2)
  }

  // Pondération des scores
  const total_score = 
    breakdown.values_score * 0.4 +
    breakdown.interests_score * 0.2 +
    breakdown.personality_score * 0.2 +
    breakdown.lifestyle_score * 0.1 +
    breakdown.location_score * 0.1

  return {
    user1_id: user1.id,
    user2_id: user2.id,
    total_score: Math.round(total_score),
    breakdown
  }
}

/**
 * Calcule le score basé sur les valeurs communes
 * Plus les valeurs sont similaires, plus le score est élevé
 */
function calculateValuesScore(user1: UserProfile, user2: UserProfile): number {
  if (!user1.values || !user2.values) return 50

  const commonValues = user1.values.filter(v => user2.values.includes(v))
  const totalUniqueValues = new Set([...user1.values, ...user2.values]).size
  
  if (totalUniqueValues === 0) return 50
  
  // Jaccard similarity coefficient
  const similarity = commonValues.length / totalUniqueValues
  return Math.round(similarity * 100)
}

/**
 * Calcule le score basé sur les centres d'intérêt communs
 */
function calculateInterestsScore(user1: UserProfile, user2: UserProfile): number {
  if (!user1.interests || !user2.interests) return 50

  const commonInterests = user1.interests.filter(i => user2.interests.includes(i))
  const totalUniqueInterests = new Set([...user1.interests, ...user2.interests]).size
  
  if (totalUniqueInterests === 0) return 50
  
  const similarity = commonInterests.length / totalUniqueInterests
  return Math.round(similarity * 100)
}

/**
 * Calcule le score de personnalité basé sur la complémentarité
 * Certains traits opposés peuvent être complémentaires
 */
function calculatePersonalityScore(user1: UserProfile, user2: UserProfile): number {
  const responses1 = user1.questionnaire_responses.filter(r => r.category === 'personality')
  const responses2 = user2.questionnaire_responses.filter(r => r.category === 'personality')
  
  if (!responses1.length || !responses2.length) return 50
  
  let score = 50
  
  // Extravert/Introverti - légère préférence pour la complémentarité
  const extrovert1 = getPersonalityTrait(responses1, 'personality_1', 'extrovert')
  const extrovert2 = getPersonalityTrait(responses2, 'personality_1', 'extrovert')
  if (extrovert1 !== null && extrovert2 !== null) {
    // Si opposés, bonus de complémentarité
    if (extrovert1 !== extrovert2) {
      score += 10
    } else {
      score += 5 // Similaire est OK aussi
    }
  }
  
  // Gestion des conflits - préférence pour la similarité
  const conflict1 = getPersonalityTrait(responses1, 'personality_2', 'conflict')
  const conflict2 = getPersonalityTrait(responses2, 'personality_2', 'conflict')
  if (conflict1 === conflict2) {
    score += 15
  }
  
  // Organisation - préférence pour la similarité
  const organized1 = getPersonalityTrait(responses1, 'personality_5', 'organization')
  const organized2 = getPersonalityTrait(responses2, 'personality_5', 'organization')
  if (Math.abs(organized1 - organized2) <= 1) {
    score += 20 // Niveau d'organisation similaire
  }
  
  return Math.min(100, score)
}

/**
 * Calcule le score basé sur le style de vie
 */
function calculateLifestyleScore(user1: UserProfile, user2: UserProfile): number {
  const responses1 = user1.questionnaire_responses.filter(r => r.category === 'lifestyle')
  const responses2 = user2.questionnaire_responses.filter(r => r.category === 'lifestyle')
  
  if (!responses1.length || !responses2.length) return 50
  
  let matchCount = 0
  let totalComparisons = 0
  
  // Comparer les réponses lifestyle
  responses1.forEach(r1 => {
    const r2 = responses2.find(r => r.question_id === r1.question_id)
    if (r2) {
      totalComparisons++
      if (JSON.stringify(r1.answer) === JSON.stringify(r2.answer)) {
        matchCount++
      }
    }
  })
  
  if (totalComparisons === 0) return 50
  
  return Math.round((matchCount / totalComparisons) * 100)
}

/**
 * Calcule le score basé sur la proximité géographique
 */
function calculateLocationScore(user1: UserProfile, user2: UserProfile): number {
  if (!user1.location || !user2.location) return 50
  
  // Simplification : même ville = 100, sinon décroissance
  const city1 = user1.location.toLowerCase().split(',')[0].trim()
  const city2 = user2.location.toLowerCase().split(',')[0].trim()
  
  if (city1 === city2) return 100
  
  // Pour une v2, on pourrait calculer la distance réelle
  // Pour l'instant, on donne un score moyen si villes différentes
  return 30
}

/**
 * Helper pour extraire un trait de personnalité
 */
function getPersonalityTrait(
  responses: QuestionnaireResponse[],
  questionId: string,
  trait: string
): any {
  const response = responses.find(r => r.question_id === questionId)
  if (!response) return null
  
  // Adapter selon la structure réelle des réponses
  return response.answer
}

/**
 * Fonction principale de matching hebdomadaire
 * Trouve le meilleur match pour chaque utilisateur sans match actif
 */
export async function performWeeklyMatching() {
  const supabase = await createClient()
  
  // 1. Récupérer tous les utilisateurs sans match actif
  const { data: availableUsers, error: usersError } = await supabase
    .from('profiles')
    .select(`
      id,
      age,
      location,
      values,
      interests,
      questionnaire_responses (
        question_id,
        category,
        answer
      )
    `)
    .eq('onboarding_complete', true)
    .is('current_match_id', null)
  
  if (usersError || !availableUsers) {
    console.error('Error fetching available users:', usersError)
    return
  }
  
  // 2. Calculer les scores de compatibilité pour toutes les paires possibles
  const compatibilityScores: MatchScore[] = []
  
  for (let i = 0; i < availableUsers.length; i++) {
    for (let j = i + 1; j < availableUsers.length; j++) {
      const score = await calculateCompatibility(
        availableUsers[i] as UserProfile,
        availableUsers[j] as UserProfile
      )
      compatibilityScores.push(score)
    }
  }
  
  // 3. Trier par score décroissant
  compatibilityScores.sort((a, b) => b.total_score - a.total_score)
  
  // 4. Créer les matchs en évitant les doublons
  const matchedUsers = new Set<string>()
  const newMatches = []
  
  for (const score of compatibilityScores) {
    if (!matchedUsers.has(score.user1_id) && !matchedUsers.has(score.user2_id)) {
      // Seuil minimum de compatibilité (60%)
      if (score.total_score >= 60) {
        newMatches.push({
          user1_id: score.user1_id,
          user2_id: score.user2_id,
          week_number: getCurrentWeekNumber(),
          compatibility_score: score.total_score,
          status: 'active',
          current_day: 1
        })
        
        matchedUsers.add(score.user1_id)
        matchedUsers.add(score.user2_id)
      }
    }
  }
  
  // 5. Insérer les nouveaux matchs dans la base de données
  if (newMatches.length > 0) {
    const { error: matchError } = await supabase
      .from('matches')
      .insert(newMatches)
    
    if (matchError) {
      console.error('Error creating matches:', matchError)
    } else {
      console.log(`Created ${newMatches.length} new matches for week ${getCurrentWeekNumber()}`)
    }
  }
  
  return newMatches
}

/**
 * Calcule le numéro de semaine actuel
 */
function getCurrentWeekNumber(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.floor(diff / oneWeek) + 1
}

/**
 * Trouve le meilleur match pour un utilisateur spécifique
 */
export async function findBestMatchForUser(userId: string): Promise<string | null> {
  const supabase = await createClient()
  
  // Récupérer le profil de l'utilisateur
  const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select(`
      id,
      age,
      location,
      values,
      interests,
      questionnaire_responses (
        question_id,
        category,
        answer
      )
    `)
    .eq('id', userId)
    .single()
  
  if (userError || !userProfile) {
    console.error('Error fetching user profile:', userError)
    return null
  }
  
  // Récupérer les autres utilisateurs disponibles
  const { data: potentialMatches, error: matchesError } = await supabase
    .from('profiles')
    .select(`
      id,
      age,
      location,
      values,
      interests,
      questionnaire_responses (
        question_id,
        category,
        answer
      )
    `)
    .eq('onboarding_complete', true)
    .is('current_match_id', null)
    .neq('id', userId)
  
  if (matchesError || !potentialMatches || potentialMatches.length === 0) {
    return null
  }
  
  // Calculer les scores de compatibilité
  let bestMatch = null
  let bestScore = 0
  
  for (const potential of potentialMatches) {
    const score = await calculateCompatibility(
      userProfile as UserProfile,
      potential as UserProfile
    )
    
    if (score.total_score > bestScore && score.total_score >= 60) {
      bestScore = score.total_score
      bestMatch = potential.id
    }
  }
  
  return bestMatch
}