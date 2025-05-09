# Migration Guide for Adding Better Game Images Support

This guide will help you run the necessary database migrations to support multiple images per game with extended metadata.

## Background

We're adding a new `gameImages` column to the `games` table as a JSONB array. This allows us to store rich metadata for each image (captions, ordering, primary status) directly in the games table.

## Running the Migration

### Option 1: Run via Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to the SQL Editor
4. Create a new query
5. Paste the following SQL code:

```sql
-- Add gameImages JSONB column to games table
ALTER TABLE games 
ADD COLUMN "gameImages" JSONB DEFAULT '[]'::JSONB;

-- Convert existing images array to JSONB array of objects in gameImages column
UPDATE games
SET "gameImages" = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', 'img_' || idx::text,
      'url', url,
      'caption', NULL,
      'is_primary', CASE WHEN url = image THEN true ELSE false END,
      'display_order', idx
    )
  )
  FROM (
    SELECT url, ROW_NUMBER() OVER () - 1 as idx
    FROM unnest(images) as url
  ) t
)
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- For games without images array but with a single image, create one entry
UPDATE games
SET "gameImages" = jsonb_build_array(
  jsonb_build_object(
    'id', 'img_0',
    'url', image,
    'caption', NULL,
    'is_primary', true,
    'display_order', 0
  )
)
WHERE image IS NOT NULL 
  AND (images IS NULL OR array_length(images, 1) = 0)
  AND (jsonb_array_length("gameImages") = 0);

-- Add comment explaining the migration
COMMENT ON COLUMN games."gameImages" IS 'Stores detailed information about game images as JSONB array';
```

6. Click "Run" or "Execute"

### Option 2: Use Supabase CLI

If you have Supabase CLI set up:

1. Make sure your changes to `supabase/migrations/20240826000000_add_game_images_json.sql` are saved
2. Run:
```bash
npx supabase db push
```

## Verifying the Migration

After running the migration, you can verify it worked by:

1. Going to the Supabase Dashboard > Database > Tables
2. Select the `games` table
3. Confirm the `gameImages` JSONB column exists
4. Go to Supabase Dashboard > Database > SQL Editor and run:

```sql
-- Check that gameImages column exists and contains data
SELECT id, title, image, "gameImages"
FROM games
LIMIT 20;
```

## Troubleshooting

If you encounter issues:

1. Check that the `games` table exists and has an `image` column
2. If you get errors about column already existing, you can safely ignore them
3. For other errors, please paste the full error message in the issue

## Data Structure

After migration:

- `games.image`: Single primary image URL (backward compatibility)
- `games.gameImages`: JSONB array with rich image information:
  - `id`: String identifier for each image
  - `url`: The image URL
  - `caption`: Optional caption text
  - `is_primary`: Boolean flag for the primary image
  - `display_order`: Integer for ordering images

The front-end components are updated to use this more structured image data format. 