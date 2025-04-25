-- Schema definition for ZoneHub database

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "anon.quota" TO '0';
ALTER DATABASE postgres SET "pgsodium.getkey_cost" TO '2';

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'editor'))
);

-- Create zones table if not exists
CREATE TABLE IF NOT EXISTS public.zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Set Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" 
    ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.users FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON public.users FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Zones policies
CREATE POLICY "Users can view all zones"
    ON public.zones FOR SELECT USING (true);

CREATE POLICY "Users can insert their own zones"
    ON public.zones FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own zones"
    ON public.zones FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own zones"
    ON public.zones FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all zones"
    ON public.zones USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
        )
    ); 