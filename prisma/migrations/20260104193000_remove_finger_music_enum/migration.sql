-- Migration: remove FINGER_MUSIC from ActivityType enum
-- This migration creates a new enum type without the FINGER_MUSIC value,
-- converts the existing Activity.type column to the new type, drops the
-- old enum, and renames the new enum to the original name.

BEGIN;

-- 1) create the new enum type without FINGER_MUSIC
CREATE TYPE "ActivityType_new" AS ENUM ('NOTE_MATCH', 'CAKE_CANDLES', 'CALMING_FLOW', 'ENERGY_BOOST', 'GAME', 'EXPRESSIVE_PLAY');

-- 2) alter the column to use the new enum (cast via text)
ALTER TABLE "Activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING "type"::text::"ActivityType_new";

-- 3) drop the old enum type
DROP TYPE "ActivityType";

-- 4) rename the new enum to the original name
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";

COMMIT;
