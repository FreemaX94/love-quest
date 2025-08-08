# 🚀 Configuration Supabase pour Love Quest

## 1. Créer un compte Supabase (Gratuit)

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub (plus simple)
4. Créez un nouveau projet :
   - **Name**: `love-quest`
   - **Database Password**: Notez-le bien !
   - **Region**: Europe (Frankfurt) pour la France
   - **Plan**: Free (gratuit)

## 2. Récupérer les clés API

Une fois le projet créé (2-3 minutes) :

1. Allez dans **Settings** → **API**
2. Copiez :
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (gardez secret !)

## 3. Configuration dans le projet

Créez un fichier `.env.local` à la racine de `love-quest/` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Structure de la Base de Données

Dans Supabase, allez dans **SQL Editor** et exécutez ces requêtes :

### Table Users (Profils étendus)
```sql
-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  location TEXT,
  bio TEXT,
  looking_for TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  photos JSONB DEFAULT '[]'::jsonb,
  interests TEXT[] DEFAULT '{}',
  values TEXT[] DEFAULT '{}'
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir tous les profils
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Politique : Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

### Table Questionnaire Responses
```sql
-- Réponses au questionnaire
CREATE TABLE questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  question_id TEXT NOT NULL,
  category TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir et modifier leurs propres réponses
CREATE POLICY "Users can manage own responses" 
ON questionnaire_responses 
FOR ALL 
USING (auth.uid() = user_id);
```

### Table Matches
```sql
-- Matches hebdomadaires
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) NOT NULL,
  user2_id UUID REFERENCES auth.users(id) NOT NULL,
  week_number INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 7),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'completed')),
  user1_decision TEXT CHECK (user1_decision IN ('meet', 'continue', 'friends', NULL)),
  user2_decision TEXT CHECK (user2_decision IN ('meet', 'continue', 'friends', NULL)),
  compatibility_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  ended_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user1_id, week_number),
  UNIQUE(user2_id, week_number)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres matchs
CREATE POLICY "Users can view own matches" 
ON matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres matchs
CREATE POLICY "Users can update own matches" 
ON matches FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
```

### Table Messages
```sql
-- Messages de chat
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image', 'video')),
  media_url TEXT,
  day_sent INTEGER NOT NULL CHECK (day_sent >= 1 AND day_sent <= 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir les messages de leurs matchs
CREATE POLICY "Users can view match messages" 
ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Politique : Les utilisateurs peuvent envoyer des messages dans leurs matchs
CREATE POLICY "Users can send messages in their matches" 
ON messages FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = messages.match_id 
    AND matches.status = 'active'
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);
```

### Table Activities (Mini-jeux)
```sql
-- Activités et mini-jeux complétés
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
  activity_type TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(match_id, day)
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Politique
CREATE POLICY "Users can manage match activities" 
ON activities FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = activities.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);
```

### Table Achievements
```sql
-- Achievements et badges
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  data JSONB,
  UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Politique
CREATE POLICY "Users can view own achievements" 
ON achievements FOR SELECT 
USING (auth.uid() = user_id);
```

## 5. Configuration de l'Authentification

Dans Supabase Dashboard :

1. **Authentication** → **Providers**
2. Activez **Email** (déjà activé par défaut)
3. Optionnel : Activez **Google**, **Facebook**, etc.

Pour Google OAuth :
1. Créez un projet sur [console.cloud.google.com](https://console.cloud.google.com)
2. Activez Google+ API
3. Créez des identifiants OAuth 2.0
4. Ajoutez les clés dans Supabase

## 6. Storage pour les Photos

Dans Supabase Dashboard :

1. **Storage** → **Create a new bucket**
2. Nom : `avatars`
3. Public : ✅ (pour accès direct aux images)

```sql
-- Politique pour upload d'avatars
INSERT INTO storage.policies (bucket_id, name, definition, mode)
VALUES (
  'avatars',
  'Users can upload own avatar',
  'auth.uid()::text = (storage.foldername(name))[1]',
  'INSERT'
);

-- Politique pour update d'avatars
INSERT INTO storage.policies (bucket_id, name, definition, mode)
VALUES (
  'avatars',
  'Users can update own avatar',
  'auth.uid()::text = (storage.foldername(name))[1]',
  'UPDATE'
);
```

## 7. Fonctions Edge (Optionnel)

Pour l'algorithme de matching (à exécuter chaque dimanche soir) :

```sql
CREATE OR REPLACE FUNCTION match_users_weekly()
RETURNS void AS $$
BEGIN
  -- Logique de matching basée sur les réponses au questionnaire
  -- Compatibilité = similarité des valeurs + complémentarité des personnalités
  -- À implémenter selon votre algorithme
END;
$$ LANGUAGE plpgsql;
```

## 8. Realtime (Notifications)

Activez Realtime pour les messages :

```sql
-- Activer realtime sur la table messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

## 🎯 Checklist de Configuration

- [ ] Compte Supabase créé
- [ ] Clés API récupérées
- [ ] `.env.local` configuré
- [ ] Tables créées dans la base de données
- [ ] RLS (Row Level Security) activé
- [ ] Storage bucket créé pour les photos
- [ ] Authentication configurée
- [ ] Realtime activé pour les messages

## 🚨 Sécurité

**IMPORTANT** : 
- Ne commitez JAMAIS le fichier `.env.local`
- Ajoutez `.env.local` dans `.gitignore`
- Utilisez `NEXT_PUBLIC_` uniquement pour les clés publiques
- Gardez `SUPABASE_SERVICE_ROLE_KEY` secret !

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/with-nextjs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

---

Une fois configuré, votre app aura :
- ✅ Authentification complète
- ✅ Base de données temps réel
- ✅ Storage pour photos
- ✅ Sécurité RLS
- ✅ Prêt pour la production