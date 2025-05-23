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