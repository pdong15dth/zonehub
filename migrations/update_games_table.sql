-- Cập nhật cấu trúc bảng games để hỗ trợ lưu trữ yêu cầu hệ thống chi tiết theo nền tảng

-- Kiểm tra xem cột system_requirements đã tồn tại chưa
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'system_requirements'
    ) THEN
        -- Thêm cột system_requirements nếu chưa tồn tại
        ALTER TABLE games
        ADD COLUMN system_requirements JSONB;
        
        RAISE NOTICE 'Đã thêm cột system_requirements kiểu JSONB';
    ELSE
        -- Nếu cột đã tồn tại nhưng không phải kiểu JSONB
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'games' AND column_name = 'system_requirements' AND data_type = 'jsonb'
        ) THEN
            -- Chuyển đổi cột sang kiểu JSONB
            ALTER TABLE games
            ALTER COLUMN system_requirements TYPE JSONB USING 
                CASE 
                    WHEN system_requirements IS NULL THEN NULL::jsonb
                    WHEN system_requirements = '' THEN '{}'::jsonb
                    ELSE 
                        jsonb_build_object('additional', system_requirements)
                END;
                
            RAISE NOTICE 'Đã chuyển đổi cột system_requirements sang kiểu JSONB';
        END IF;
    END IF;
END
$$;

-- Thêm các cột metadata khác nếu chưa có
DO $$
BEGIN
    -- Kiểm tra và thêm cột official_website
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'official_website'
    ) THEN
        ALTER TABLE games
        ADD COLUMN official_website TEXT;
        
        RAISE NOTICE 'Đã thêm cột official_website';
    END IF;
    
    -- Kiểm tra và thêm cột trailer_url
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'trailer_url'
    ) THEN
        ALTER TABLE games
        ADD COLUMN trailer_url TEXT;
        
        RAISE NOTICE 'Đã thêm cột trailer_url';
    END IF;
    
    -- Kiểm tra và thêm cột platform (mảng các nền tảng)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'platform'
    ) THEN
        ALTER TABLE games
        ADD COLUMN platform TEXT[];
        
        RAISE NOTICE 'Đã thêm cột platform';
    END IF;
    
    -- Kiểm tra và thêm cột genre (mảng các thể loại)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'genre'
    ) THEN
        ALTER TABLE games
        ADD COLUMN genre TEXT[];
        
        RAISE NOTICE 'Đã thêm cột genre';
    END IF;
    
    -- Kiểm tra và thêm cột rating (đánh giá)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'rating'
    ) THEN
        ALTER TABLE games
        ADD COLUMN rating NUMERIC(3,1) DEFAULT 0;
        
        RAISE NOTICE 'Đã thêm cột rating';
    END IF;
    
    -- Kiểm tra và thêm cột downloads (lượt tải)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'downloads'
    ) THEN
        ALTER TABLE games
        ADD COLUMN downloads INTEGER DEFAULT 0;
        
        RAISE NOTICE 'Đã thêm cột downloads';
    END IF;
    
    -- Kiểm tra và thêm cột featured (nổi bật)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'featured'
    ) THEN
        ALTER TABLE games
        ADD COLUMN featured BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'Đã thêm cột featured';
    END IF;
    
    -- Kiểm tra và thêm cột status (trạng thái)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'status'
    ) THEN
        ALTER TABLE games
        ADD COLUMN status TEXT DEFAULT 'draft';
        
        RAISE NOTICE 'Đã thêm cột status';
    END IF;
    
    -- Kiểm tra và thêm cột developer (nhà phát triển)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'developer'
    ) THEN
        ALTER TABLE games
        ADD COLUMN developer TEXT;
        
        RAISE NOTICE 'Đã thêm cột developer';
    END IF;
    
    -- Kiểm tra và thêm cột publisher (nhà phát hành)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'publisher'
    ) THEN
        ALTER TABLE games
        ADD COLUMN publisher TEXT;
        
        RAISE NOTICE 'Đã thêm cột publisher';
    END IF;
    
    -- Kiểm tra và thêm cột release_date (ngày phát hành)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' AND column_name = 'release_date'
    ) THEN
        ALTER TABLE games
        ADD COLUMN release_date TEXT;
        
        RAISE NOTICE 'Đã thêm cột release_date';
    END IF;
END
$$;

-- Thêm comment cho cột system_requirements để mô tả định dạng JSON
COMMENT ON COLUMN games.system_requirements IS 'JSON chứa yêu cầu hệ thống chi tiết có cấu trúc theo nền tảng: 
{
  "windows": {
    "min": {
      "os": "Windows 10 64-bit",
      "processor": "Intel Core i5-8600K",
      "memory": "8 GB RAM",
      "graphics": "NVIDIA GeForce GTX 1060",
      "storage": "50 GB",
      "directx": "Version 12",
      "network": "Broadband Internet connection",
      "custom": {
        "Sound Card": "DirectX compatible",
        "Additional Notes": "SSD recommended"
      }
    },
    "rec": {
      "os": "Windows 11 64-bit",
      "processor": "Intel Core i7-10700K",
      "memory": "16 GB RAM",
      "graphics": "NVIDIA GeForce RTX 3060",
      "storage": "50 GB SSD",
      "directx": "Version 12",
      "network": "Broadband Internet connection",
      "custom": {
        "Sound Card": "DirectX compatible",
        "Additional Notes": "SSD required"
      }
    }
  },
  "mac": {
    "min": {
      "os": "macOS 12.0 or later",
      "processor": "Apple M1 Chip",
      "memory": "8 GB RAM",
      "storage": "50 GB"
    },
    "rec": {
      "os": "macOS 12.0 or later",
      "processor": "Apple M2 Pro Chip",
      "memory": "16 GB RAM",
      "storage": "50 GB SSD"
    }
  },
  "android": {
    "min": {
      "os": "Android 8.0 or higher",
      "processor": "Snapdragon 730",
      "memory": "4 GB RAM",
      "storage": "6 GB",
      "screen": "HD (720p)"
    },
    "rec": {
      "os": "Android 10.0 or higher",
      "processor": "Snapdragon 865",
      "memory": "8 GB RAM",
      "storage": "8 GB",
      "screen": "Full HD (1080p)"
    }
  },
  "ios": {
    "min": {
      "os": "iOS 14.0 or later",
      "processor": "A12 Bionic",
      "memory": "3 GB RAM",
      "storage": "4 GB",
      "device": "iPhone X or later"
    },
    "rec": {
      "os": "iOS 15.0 or later",
      "processor": "A15 Bionic",
      "memory": "6 GB RAM",
      "storage": "6 GB",
      "device": "iPhone 13 or later"
    }
  },
  "additional": "Yêu cầu bổ sung khác và thông tin chung"
}'; 