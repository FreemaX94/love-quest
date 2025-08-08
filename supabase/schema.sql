-- Love Quest Database Schema
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. PROFILES TABLE (Extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. QUESTIONNAIRE RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  question_id TEXT NOT NULL,
  category TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own responses" 
ON public.questionnaire_responses 
FOR ALL 
USING (auth.uid() = user_id);

-- 3. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
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
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own matches" 
ON public.matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update own matches" 
ON public.matches FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image', 'video')),
  media_url TEXT,
  day_sent INTEGER NOT NULL CHECK (day_sent >= 1 AND day_sent <= 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view match messages" 
ON public.messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their matches" 
ON public.messages FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = messages.match_id 
    AND matches.status = 'active'
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- 5. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
  activity_type TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(match_id, day)
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Users can manage match activities" 
ON public.activities FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = activities.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- 6. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  data JSONB,
  UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Users can view own achievements" 
ON public.achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
ON public.achievements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 7. MATCH FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.match_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  decision TEXT CHECK (decision IN ('meet', 'continue', 'friends')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(match_id, user_id)
);

-- Enable RLS
ALTER TABLE public.match_feedback ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Users can manage own feedback" 
ON public.match_feedback FOR ALL 
USING (auth.uid() = user_id);

-- 8. WAITLIST TABLE (pour la landing page)
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  converted_to_user BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Policy (tout le monde peut s'inscrire)
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist FOR INSERT 
WITH CHECK (true);

-- 8. Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 10. Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_week ON public.matches(week_number);
CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_user ON public.questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_match ON public.activities(match_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);

-- 12. Create storage bucket for avatars
-- Note: This needs to be done via Supabase dashboard or API
-- Go to Storage > New Bucket > Name: "avatars" > Public: true

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Love Quest database schema created successfully!';
END $$;