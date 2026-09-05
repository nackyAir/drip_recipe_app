-- Add origin / variety to existing recipes tables
ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "origin" text NOT NULL DEFAULT '';
ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "variety" text NOT NULL DEFAULT '';
