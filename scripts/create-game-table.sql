-- Create Game table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  developer TEXT NOT NULL,
  publisher TEXT NOT NULL,
  release_date TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  system_requirements TEXT,
  trailer_url TEXT,
  official_website TEXT,
  platform TEXT[] NOT NULL,
  genre TEXT[] NOT NULL,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  image TEXT NOT NULL DEFAULT '/placeholder.svg',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Admin can do everything
CREATE POLICY "Admins can do everything" 
ON games
FOR ALL 
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Authenticated users can read published games
CREATE POLICY "Authenticated users can read published games" 
ON games
FOR SELECT 
TO authenticated
USING (status = 'published');

-- Public users can read published games
CREATE POLICY "Public users can read published games" 
ON games
FOR SELECT 
TO anon
USING (status = 'published');

-- Create indexes for better query performance
CREATE INDEX games_title_idx ON games(title);
CREATE INDEX games_featured_idx ON games(featured);
CREATE INDEX games_created_at_idx ON games(created_at);
CREATE INDEX games_status_idx ON games(status);
CREATE INDEX games_created_by_idx ON games(created_by);
CREATE INDEX games_author_id_idx ON games(author_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON games
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 