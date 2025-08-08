'use client'

import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(487)
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 27 })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      quote: "7 jours avec Sarah ont été plus intenses que 2 ans sur Tinder. On se marie en juin.",
      author: "Thomas, 28 ans",
      weeks: "Semaine 3"
    },
    {
      quote: "Plus de swipe infini. Une vraie connexion. C'est ce qui manquait aux dating apps.",
      author: "Julie, 32 ans", 
      weeks: "Semaine 5"
    },
    {
      quote: "J'étais sceptique... Mais forcer la progression sur 7 jours, c'est génial. J'ai trouvé ma personne.",
      author: "Marc, 26 ans",
      weeks: "Semaine 2"
    }
  ]

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 }
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59 }
        }
        return prev
      })
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]')
    waitlist.push({ email, date: new Date().toISOString() })
    localStorage.setItem('waitlist', JSON.stringify(waitlist))
    
    setIsSubmitted(true)
    setWaitlistCount(prev => prev + 1)
    
    setTimeout(() => {
      setEmail('')
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Nav */}
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-white">
            💘 Love Quest
          </div>
          <div className="flex items-center gap-6">
            <a href="#how" className="text-white/80 hover:text-white transition">
              Comment ça marche
            </a>
            <a href="#why" className="text-white/80 hover:text-white transition">
              Pourquoi ça fonctionne
            </a>
            <button className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition">
              Rejoindre la Beta
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center pt-12 pb-20">
          <div className="mb-6">
            <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-semibold border border-red-500/30">
              ⚡ Fermeture des inscriptions dans {timeLeft.days}j {timeLeft.hours}h {timeLeft.minutes}m
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Un Match.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"> Une Semaine.</span>
            <br />
            <span className="text-3xl md:text-5xl opacity-90">L'Amour, Vraiment.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Fini le swipe infini. Fini les conversations mortes. 
            <br />
            <strong className="text-white">7 jours avec une seule personne.</strong>
            <br />
            Une progression guidée. Une vraie connexion.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entre ton email pour la beta gratuite..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:border-purple-400 focus:outline-none text-lg pr-40"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-purple-900 px-6 py-2 rounded-full font-bold hover:bg-white/90 transition"
              >
                {isSubmitted ? '✓ Inscrit !' : 'Rejoindre'}
              </button>
            </div>
          </form>

          <p className="text-white/60 mb-8">
            🔥 {waitlistCount} personnes déjà inscrites • 100% gratuit pendant la beta
          </p>

          {/* Visual Timeline */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-white font-bold mb-6 text-lg">Votre Semaine d'Amour</h3>
            <div className="grid grid-cols-7 gap-2">
              {[
                { day: 'Lun', task: 'Ice Breaker', icon: '🎮' },
                { day: 'Mar', task: 'Deep Talk', icon: '💬' },
                { day: 'Mer', task: 'Photos', icon: '📸' },
                { day: 'Jeu', task: 'Voice Call', icon: '📞' },
                { day: 'Ven', task: 'Video', icon: '🎥' },
                { day: 'Sam', task: 'Challenge', icon: '🎯' },
                { day: 'Dim', task: 'Decision', icon: '❤️' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="bg-white/10 rounded-xl p-3 mb-2 hover:bg-white/20 transition cursor-pointer border border-white/20">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-white text-xs font-semibold">{item.day}</p>
                  </div>
                  <p className="text-white/60 text-xs">{item.task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <section id="how" className="py-20 bg-black/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Comment ça Fonctionne
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Questionnaire Profond</h3>
              <p className="text-white/70">
                20 questions sur tes valeurs, objectifs de vie, et ce que tu cherches vraiment. 
                Pas de superficiel.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Un Match Unique</h3>
              <p className="text-white/70">
                Chaque lundi, l'algo te trouve UNE personne. Pas de photos avant le jour 3. 
                Focus sur la personnalité.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">7 Jours Guidés</h3>
              <p className="text-white/70">
                Chaque jour, une activité pour vous rapprocher. Du jeu au premier appel, 
                jusqu'à la décision finale. Stop possible à tout moment.
              </p>
            </div>
          </div>

          {/* Daily Progression */}
          <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-8 backdrop-blur-md border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              La Progression Magique des 7 Jours
            </h3>
            
            {/* Important Notice */}
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-6">
              <p className="text-white text-sm flex items-start gap-2">
                <span className="text-red-400">⚠️</span>
                <span>
                  <strong>Respect mutuel garanti :</strong> Les deux personnes peuvent arrêter à tout moment. 
                  Si l'un des deux ne se sent pas à l'aise, la semaine s'arrête immédiatement. 
                  Pas de pression, que du respect.
                </span>
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { day: 'Jour 1', title: 'Breaking the Ice', desc: 'Mini-jeu "2 Vérités, 1 Mensonge". Chat texte débloqué.', color: 'from-blue-500 to-cyan-500' },
                { day: 'Jour 2', title: 'Going Deeper', desc: '36 questions pour créer l\'intimité. Messages vocaux débloqués.', color: 'from-cyan-500 to-green-500' },
                { day: 'Jour 3', title: 'The Reveal', desc: 'Photos révélées progressivement. Jeu créatif ensemble.', color: 'from-green-500 to-yellow-500' },
                { day: 'Jour 4', title: 'First Call', desc: 'Appel audio obligatoire (min 10 min). Planifiez un voyage de rêve.', color: 'from-yellow-500 to-orange-500' },
                { day: 'Jour 5', title: 'Face to Face', desc: 'Appel vidéo. Quiz de compatibilité approfondi.', color: 'from-orange-500 to-red-500' },
                { day: 'Jour 6', title: 'The Challenge', desc: 'Escape room virtuelle. Voyez comment vous gérez les défis ensemble.', color: 'from-red-500 to-pink-500' },
                { day: 'Jour 7', title: 'Decision Day', desc: 'Rencontre IRL, continuer en ligne, ou rester amis. À vous de choisir.', color: 'from-pink-500 to-purple-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-20 text-center bg-gradient-to-r ${item.color} text-white rounded-full py-2 px-3 font-bold text-sm`}>
                    {item.day}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why it Works */}
      <section id="why" className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Pourquoi Ça Fonctionne
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                ❌ Le Problème avec Tinder/Bumble
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>• Paradoxe du choix (trop d'options)</li>
                <li>• Jugement superficiel en 0.5 secondes</li>
                <li>• Conversations qui meurent</li>
                <li>• Ghosting permanent</li>
                <li>• Addiction au swipe, pas à l'amour</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                ✅ La Solution Love Quest
              </h3>
              <ul className="space-y-2 text-white/90">
                <li>• Un seul match (concentration totale)</li>
                <li>• Personnalité d'abord (pas de photos J1)</li>
                <li>• Progression guidée obligatoire</li>
                <li>• Investissement mutuel sur 7 jours</li>
                <li>• Succès = vraies relations</li>
              </ul>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <p className="text-2xl text-white mb-4 italic">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <p className="text-white/80 font-semibold">
                {testimonials[currentTestimonial].author}
              </p>
              <p className="text-white/60 text-sm">
                {testimonials[currentTestimonial].weeks}
              </p>
            </div>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentTestimonial ? 'bg-white w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">73%</p>
              <p className="text-white/60">passent au date IRL</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">8.9/10</p>
              <p className="text-white/60">satisfaction moyenne</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">42%</p>
              <p className="text-white/60">encore ensemble après 3 mois</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Questions Fréquentes
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                🤔 Et si ça ne fonctionne pas entre nous ?
              </h3>
              <p className="text-white/70">
                Chaque personne peut arrêter à tout moment, sans justification. Un simple bouton "Arrêter la semaine" 
                et c'est fini. Respect total, zéro pression. On vous rematch lundi prochain.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                😨 Je suis obligé(e) de faire toutes les activités ?
              </h3>
              <p className="text-white/70">
                Non ! Les activités sont des suggestions pour vous aider à progresser. Si vous préférez juste discuter, 
                c'est parfait aussi. L'important c'est la connexion, pas la checklist.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                🔒 Mes données sont-elles protégées ?
              </h3>
              <p className="text-white/70">
                100% sécurisé. Pas de photos publiques, pas de profil visible par tous. 
                Seule la personne avec qui vous matchez voit vos infos, et seulement progressivement.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                ⏰ Que se passe-t-il après 7 jours ?
              </h3>
              <p className="text-white/70">
                3 choix : Rencontre IRL, continuer en ligne une semaine de plus, ou rester amis. 
                Si vous ne choisissez pas la même chose, l'app vous rematch avec quelqu'un d'autre lundi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-t from-purple-900/50 to-transparent">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt(e) pour une Vraie Connexion ?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Rejoins les {waitlistCount} personnes qui en ont marre du swipe infini.
            <br />
            <strong className="text-white">Une semaine peut changer ta vie.</strong>
          </p>
          
          <button 
            onClick={() => {
              const input = document.querySelector('input')
              input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              input?.focus()
            }}
            className="bg-white text-purple-900 px-12 py-4 rounded-full text-xl font-bold hover:bg-white/90 transition transform hover:scale-105"
          >
            Réserver Ma Place Gratuite
          </button>
          
          <p className="text-white/40 text-sm mt-6">
            Lancement officiel : Janvier 2025 • 100% gratuit pendant la beta
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60">
              © 2024 Love Quest. Réinventer l'amour, une semaine à la fois.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/60 hover:text-white transition">Instagram</a>
              <a href="#" className="text-white/60 hover:text-white transition">TikTok</a>
              <a href="#" className="text-white/60 hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}