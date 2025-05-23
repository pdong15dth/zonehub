-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  developer TEXT NOT NULL,
  publisher TEXT NOT NULL,
  release_date TEXT NOT NULL,
  description TEXT,
  content TEXT,
  system_requirements TEXT,
  trailer_url TEXT,
  official_website TEXT,
  platform TEXT[] NOT NULL,
  genre TEXT[] NOT NULL,
  rating DOUBLE PRECISION NOT NULL,
  downloads INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT false,
  image TEXT,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add sample data
INSERT INTO games (
  title, 
  developer, 
  publisher, 
  release_date, 
  description, 
  platform, 
  genre, 
  rating, 
  downloads, 
  status, 
  featured, 
  image
)
VALUES
  (
    'God of War Ragnarök', 
    'Santa Monica Studio', 
    'Sony Interactive Entertainment', 
    '09/11/2022', 
    'Embark on an epic journey with Kratos and Atreus as they face the impending Ragnarök, meeting Norse gods and exploring the nine realms while deepening their complex father-son relationship.',
    ARRAY['ps5', 'ps4'], 
    ARRAY['action', 'adventure'], 
    4.9, 
    12500000, 
    'published', 
    true, 
    '/placeholder.svg'
  ),
  (
    'Elden Ring', 
    'FromSoftware', 
    'Bandai Namco Entertainment', 
    '25/02/2022', 
    'An open-world action RPG created by FromSoftware and George R.R. Martin, set in the Lands Between after the shattering of the Elden Ring, where players must restore the ancient artifact and become the Elden Lord.',
    ARRAY['ps5', 'ps4', 'xboxsx', 'xboxone', 'pc'], 
    ARRAY['rpg', 'action'], 
    4.8, 
    16500000, 
    'published', 
    true, 
    '/placeholder.svg'
  ),
  (
    'Starfield', 
    'Bethesda Game Studios', 
    'Bethesda Softworks', 
    '06/09/2023', 
    'Bethesda's first new universe in 25 years, a space RPG set in the year 2330 where players join Constellation, the last group of space explorers, to journey through the Settled Systems.',
    ARRAY['xboxsx', 'pc'], 
    ARRAY['rpg', 'adventure'], 
    4.2, 
    9800000, 
    'published', 
    false, 
    '/placeholder.svg'
  ),
  (
    'Hogwarts Legacy', 
    'Avalanche Software', 
    'Warner Bros. Interactive Entertainment', 
    '10/02/2023', 
    'An open-world action RPG set in the 1800s wizarding world, allowing players to create their own character, attend Hogwarts, learn spells, brew potions, and explore familiar and new locations.',
    ARRAY['ps5', 'ps4', 'xboxsx', 'xboxone', 'pc', 'switch'], 
    ARRAY['rpg', 'adventure'], 
    4.5, 
    15000000, 
    'published', 
    false, 
    '/placeholder.svg'
  ),
  (
    'Final Fantasy VII Rebirth', 
    'Square Enix', 
    'Square Enix', 
    '29/02/2024', 
    'The second part of the Final Fantasy VII remake project, continuing Cloud and his allies' journey as they pursue Sephiroth across the planet while uncovering deeper conspiracies and confronting their own pasts.',
    ARRAY['ps5'], 
    ARRAY['rpg', 'action'], 
    4.7, 
    8500000, 
    'published', 
    true, 
    '/placeholder.svg'
  );

-- Create RLS policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON games FOR SELECT 
USING (status = 'published');

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access" 
ON games FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated'); 