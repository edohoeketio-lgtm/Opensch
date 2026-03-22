-- Backfill null avatars
UPDATE "Profile" SET "avatarUrl" = 'https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent' WHERE "avatarUrl" IS NULL;

-- Alter column
ALTER TABLE "Profile" ALTER COLUMN "avatarUrl" SET NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN "avatarUrl" SET DEFAULT 'https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent';
