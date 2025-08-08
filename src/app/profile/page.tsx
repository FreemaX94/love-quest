'use client'

import { useState, useEffect } from 'react'

interface ProfileSection {
  id: string
  title: string
  icon: string
  locked: boolean
  unlocksOnDay: number
  content: any
}

export default function ProfilePage() {
  const [currentDay, setCurrentDay] = useState(3) // Simuler jour 3
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Zenaki',
    age: 28,
    location: 'Paris, France',
    bio: "Passionné par les nouvelles expériences et les connexions authentiques",
    interests: ['Voyages', 'Gaming', 'Cuisine', 'Musique', 'Sports'],
    values: ['Honnêteté', 'Humour', 'Ambition', 'Empathie'],
    lookingFor: 'Une connexion vraie et profonde',
    photos: [
      { url: '/photo1.jpg', blurred: true, unlocksDay: 3 },
      { url: '/photo2.jpg', blurred: true, unlocksDay: 6 },
      { url: '/photo3.jpg', blurred: true, unlocksDay: 6 }
    ]
  })

  const profileSections: ProfileSection[] = [
    {
      id: 'basics',
      title: 'Informations de Base',
      icon: '👤',
      locked: false,
      unlocksOnDay: 1,
      content: {
        name: profile.name,
        age: profile.age,
        location: profile.location
      }
    },
    {
      id: 'personality',
      title: 'Personnalité',
      icon: '✨',
      locked: false,
      unlocksOnDay: 1,
      content: {
        bio: profile.bio,
        values: profile.values
      }
    },
    {
      id: 'interests',
      title: 'Centres d\'Intérêt',
      icon: '🎯',
      locked: currentDay < 2,
      unlocksOnDay: 2,
      content: {
        interests: profile.interests
      }
    },
    {
      id: 'photos',
      title: 'Photos',
      icon: '📸',
      locked: currentDay < 3,
      unlocksOnDay: 3,
      content: {
        photos: profile.photos
      }
    },
    {
      id: 'deeper',
      title: 'Plus Profond',
      icon: '💭',
      locked: currentDay < 4,
      unlocksOnDay: 4,
      content: {
        dreams: 'Créer quelque chose qui change le monde',
        fears: 'Ne pas vivre pleinement',
        familyRelation: 'Très proche de ma famille'
      }
    },
    {
      id: 'lifestyle',
      title: 'Style de Vie',
      icon: '🏡',
      locked: currentDay < 5,
      unlocksOnDay: 5,
      content: {
        morningPerson: true,
        pets: 'J\'adore les chiens',
        workLifeBalance: 'Équilibre important',
        travel: '3-4 fois par an'
      }
    },
    {
      id: 'future',
      title: 'Vision du Futur',
      icon: '🔮',
      locked: currentDay < 6,
      unlocksOnDay: 6,
      content: {
        relationshipGoals: 'Construire quelque chose de durable',
        familyPlans: 'Ouvert aux enfants',
        lifeGoals: 'Voyager le monde, créer une entreprise'
      }
    },
    {
      id: 'complete',
      title: 'Profil Complet',
      icon: '💝',
      locked: currentDay < 7,
      unlocksOnDay: 7,
      content: {
        dealBreakers: ['Malhonnêteté', 'Manque d\'ambition'],
        loveLanguages: ['Temps de qualité', 'Contact physique'],
        perfectDate: 'Pique-nique au coucher du soleil'
      }
    }
  ]

  const getPhotoState = (photo: any) => {
    if (currentDay >= photo.unlocksDay) return 'clear'
    if (currentDay >= 3) return 'blurred'
    return 'locked'
  }

  const completionPercentage = Math.round((currentDay / 7) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-white/60 hover:text-white transition">
                ← Retour
              </a>
              <h1 className="text-white font-bold text-xl">Mon Profil</h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
            >
              {isEditing ? '✓ Sauvegarder' : '✏️ Modifier'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-5xl">
                {currentDay >= 3 ? '📸' : '👤'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-3 py-1 text-xs font-semibold">
                Jour {currentDay}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name}, {profile.age}</h2>
              <p className="text-white/60 mb-4">📍 {profile.location}</p>
              
              {/* Completion Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm">Profil révélé</span>
                  <span className="text-white font-semibold">{completionPercentage}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              <p className="text-white/60 text-sm">
                🔓 Nouveau contenu débloqué chaque jour
              </p>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        {currentDay >= 3 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              📸 Photos
              {currentDay < 6 && <span className="text-sm text-white/60">(Nettes au jour 6)</span>}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {profile.photos.map((photo, index) => {
                const state = getPhotoState(photo)
                return (
                  <div 
                    key={index}
                    className="aspect-square bg-white/10 rounded-xl overflow-hidden relative"
                  >
                    {state === 'locked' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl mb-2">🔒</p>
                          <p className="text-white/60 text-xs">Jour {photo.unlocksDay}</p>
                        </div>
                      </div>
                    )}
                    {state === 'blurred' && (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-xl flex items-center justify-center">
                        <p className="text-white/60">Photo floutée</p>
                      </div>
                    )}
                    {state === 'clear' && (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                        <p className="text-white">Photo {index + 1}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Profile Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {profileSections.map((section) => (
            <div 
              key={section.id}
              className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 transition-all ${
                section.locked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  {section.title}
                </h3>
                {section.locked && (
                  <span className="bg-white/20 text-white/60 px-2 py-1 rounded-full text-xs">
                    🔒 Jour {section.unlocksOnDay}
                  </span>
                )}
              </div>

              {!section.locked ? (
                <div className="space-y-3">
                  {section.id === 'basics' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/60">Nom</span>
                        <span className="text-white">{section.content.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Âge</span>
                        <span className="text-white">{section.content.age} ans</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Ville</span>
                        <span className="text-white">{section.content.location}</span>
                      </div>
                    </>
                  )}

                  {section.id === 'personality' && (
                    <>
                      <p className="text-white italic">"{section.content.bio}"</p>
                      <div>
                        <p className="text-white/60 text-sm mb-2">Valeurs importantes</p>
                        <div className="flex flex-wrap gap-2">
                          {section.content.values.map((value: string, i: number) => (
                            <span key={i} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 'interests' && (
                    <div className="flex flex-wrap gap-2">
                      {section.content.interests.map((interest: string, i: number) => (
                        <span key={i} className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white px-3 py-1 rounded-full text-sm border border-pink-500/30">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {section.id === 'deeper' && (
                    <>
                      <div>
                        <p className="text-white/60 text-sm">Rêves</p>
                        <p className="text-white">{section.content.dreams}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Peurs</p>
                        <p className="text-white">{section.content.fears}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Famille</p>
                        <p className="text-white">{section.content.familyRelation}</p>
                      </div>
                    </>
                  )}

                  {section.id === 'lifestyle' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/60">Lève-tôt ?</span>
                        <span className="text-white">{section.content.morningPerson ? 'Oui ☀️' : 'Non 🌙'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Animaux</span>
                        <span className="text-white">{section.content.pets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Work-Life</span>
                        <span className="text-white">{section.content.workLifeBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Voyages</span>
                        <span className="text-white">{section.content.travel}</span>
                      </div>
                    </>
                  )}

                  {section.id === 'future' && (
                    <>
                      <div>
                        <p className="text-white/60 text-sm">Objectifs relationnels</p>
                        <p className="text-white">{section.content.relationshipGoals}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Enfants</p>
                        <p className="text-white">{section.content.familyPlans}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Objectifs de vie</p>
                        <p className="text-white">{section.content.lifeGoals}</p>
                      </div>
                    </>
                  )}

                  {section.id === 'complete' && (
                    <>
                      <div>
                        <p className="text-white/60 text-sm mb-2">Deal Breakers</p>
                        <div className="flex flex-wrap gap-2">
                          {section.content.dealBreakers.map((item: string, i: number) => (
                            <span key={i} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-2">Love Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {section.content.loveLanguages.map((item: string, i: number) => (
                            <span key={i} className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Date parfait</p>
                        <p className="text-white">{section.content.perfectDate}</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2">🔒</p>
                  <p className="text-white/60">
                    Débloqué au jour {section.unlocksOnDay}
                  </p>
                  <p className="text-white/40 text-sm mt-1">
                    Plus que {section.unlocksOnDay - currentDay} jour{section.unlocksOnDay - currentDay > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Simulation Controls */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">Mode simulation (pour tester)</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition"
              >
                ← Jour précédent
              </button>
              <span className="text-white font-semibold px-3">Jour {currentDay}</span>
              <button
                onClick={() => setCurrentDay(Math.min(7, currentDay + 1))}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition"
              >
                Jour suivant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}