-- Microclimate Hub Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE report_severity AS ENUM ('low', 'medium', 'high', 'extreme');
CREATE TYPE report_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE badge_category AS ENUM ('reports', 'impact', 'community', 'achievement', 'special');
CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE notification_type AS ENUM ('report_verified', 'badge_unlocked', 'impact_milestone', 'community_update', 'system_alert');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'user',
    image_url TEXT,
    bio TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'dark',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    report_alerts BOOLEAN DEFAULT true,
    community_updates BOOLEAN DEFAULT true,
    impact_updates BOOLEAN DEFAULT true,
    profile_visibility TEXT DEFAULT 'public',
    location_sharing BOOLEAN DEFAULT true,
    data_sharing BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats table
CREATE TABLE public.user_stats (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_reports INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    trees_planted INTEGER DEFAULT 0,
    co2_saved DECIMAL(10,2) DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category badge_category NOT NULL,
    rarity badge_rarity NOT NULL,
    required_points INTEGER DEFAULT 0,
    required_reports INTEGER DEFAULT 0,
    required_trees INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges junction table
CREATE TABLE public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 1,
    UNIQUE(user_id, badge_id)
);

-- Reports table
CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    temperature DECIMAL(4,1) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT,
    description TEXT NOT NULL,
    severity report_severity NOT NULL,
    status report_status DEFAULT 'pending',
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    voice_note_url TEXT,
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report images table
CREATE TABLE public.report_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report tags table
CREATE TABLE public.report_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(report_id, tag)
);

-- Weather data table
CREATE TABLE public.weather_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE UNIQUE,
    temperature DECIMAL(4,1) NOT NULL,
    humidity INTEGER NOT NULL,
    wind_speed DECIMAL(4,1) NOT NULL,
    pressure INTEGER NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heat zones table (for analytics)
CREATE TABLE public.heat_zones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    intensity DECIMAL(3,2) NOT NULL,
    report_count INTEGER DEFAULT 0,
    average_temperature DECIMAL(4,1) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact tracking table
CREATE TABLE public.impact_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    action_value DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community events table
CREATE TABLE public.community_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT NOT NULL,
    location TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    organizer_id UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants table
CREATE TABLE public.event_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.community_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_location ON public.reports USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_severity ON public.reports(severity);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_report_images_report_id ON public.report_images(report_id);
CREATE INDEX idx_report_tags_report_id ON public.report_tags(report_id);
CREATE INDEX idx_heat_zones_location ON public.heat_zones USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- Create RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view their own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Anyone can view verified reports" ON public.reports
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reports" ON public.reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Report images policies
CREATE POLICY "Anyone can view images for verified reports" ON public.report_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE id = report_id AND status = 'verified'
        )
    );

CREATE POLICY "Users can view images for their own reports" ON public.report_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE id = report_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add images to their own reports" ON public.report_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE id = report_id AND user_id = auth.uid()
        )
    );

-- Report tags policies
CREATE POLICY "Anyone can view tags for verified reports" ON public.report_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE id = report_id AND status = 'verified'
        )
    );

CREATE POLICY "Users can view tags for their own reports" ON public.report_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE id = report_id AND user_id = auth.uid()
        )
    );

-- Weather data policies
CREATE POLICY "Anyone can view weather data for verified reports" ON public.weather_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE id = report_id AND status = 'verified'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Impact tracking policies
CREATE POLICY "Users can view their own impact" ON public.impact_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own impact" ON public.impact_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community events policies
CREATE POLICY "Anyone can view public events" ON public.community_events
    FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON public.community_events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events" ON public.community_events
    FOR UPDATE USING (auth.uid() = organizer_id);

-- Event participants policies
CREATE POLICY "Anyone can view event participants" ON public.event_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join events" ON public.event_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events" ON public.event_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_events_updated_at BEFORE UPDATE ON public.community_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'user'
    );
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user stats when report is created
CREATE OR REPLACE FUNCTION public.update_user_stats_on_report()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_stats
    SET 
        total_reports = total_reports + 1,
        total_points = total_points + CASE 
            WHEN NEW.severity = 'low' THEN 10
            WHEN NEW.severity = 'medium' THEN 25
            WHEN NEW.severity = 'high' THEN 50
            WHEN NEW.severity = 'extreme' THEN 100
        END,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user stats on report creation
CREATE TRIGGER on_report_created
    AFTER INSERT ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_on_report();

-- Insert default badges
INSERT INTO public.badges (name, description, icon, category, rarity, required_points, required_reports, required_trees) VALUES
('First Report', 'Submit your first heat report', '🌡️', 'reports', 'common', 0, 1, 0),
('Heat Detective', 'Submit 25 reports', '🔍', 'reports', 'rare', 0, 25, 0),
('Climate Warrior', 'Submit 100 reports', '⚔️', 'reports', 'epic', 0, 100, 0),
('Tree Planter', 'Plant 10 trees', '🌳', 'impact', 'common', 0, 0, 10),
('Forest Guardian', 'Plant 50 trees', '🌲', 'impact', 'rare', 0, 0, 50),
('Eco Champion', 'Plant 100 trees', '🌿', 'impact', 'epic', 0, 0, 100),
('Community Leader', 'Reach top 10 leaderboard', '👑', 'community', 'legendary', 1000, 0, 0),
('Data Scientist', 'Submit reports with AI analysis', '🧠', 'achievement', 'rare', 0, 10, 0),
('Early Adopter', 'Join during beta phase', '🚀', 'special', 'epic', 0, 0, 0),
('Perfect Score', 'Submit 10 reports with 100% accuracy', '🎯', 'achievement', 'legendary', 0, 10, 0);

-- Create a view for leaderboard
CREATE VIEW public.leaderboard AS
SELECT 
    u.id,
    u.name,
    u.image_url,
    us.total_points,
    us.total_reports,
    us.trees_planted,
    us.co2_saved,
    us.impact_score,
    ROW_NUMBER() OVER (ORDER BY us.total_points DESC) as rank
FROM public.users u
JOIN public.user_stats us ON u.id = us.user_id
ORDER BY us.total_points DESC;

-- Create a view for heat map data
CREATE VIEW public.heat_map_data AS
SELECT 
    latitude,
    longitude,
    AVG(temperature) as avg_temperature,
    COUNT(*) as report_count,
    MAX(created_at) as last_report,
    CASE 
        WHEN AVG(temperature) >= 40 THEN 'extreme'
        WHEN AVG(temperature) >= 35 THEN 'high'
        WHEN AVG(temperature) >= 30 THEN 'medium'
        ELSE 'low'
    END as heat_level
FROM public.reports
WHERE status = 'verified'
GROUP BY latitude, longitude;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant access to views
GRANT SELECT ON public.leaderboard TO anon, authenticated;
GRANT SELECT ON public.heat_map_data TO anon, authenticated; 