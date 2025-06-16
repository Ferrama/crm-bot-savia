import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Create or update enum types for category and priority that the model expects
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        -- Create category enum if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_category'
        ) THEN
          CREATE TYPE "enum_Interactions_category" AS ENUM (
            'internal_note',
            'client_communication',
            'follow_up',
            'meeting_notes',
            'call_log',
            'email_log',
            'task',
            'reminder',
            'whatsapp',
            'instagram',
            'facebook',
            'telegram',
            'other'
          );
        ELSE
          -- Add missing values to existing enum if they don't exist
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'internal_note'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'internal_note';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'client_communication'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'client_communication';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'follow_up'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'follow_up';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'meeting_notes'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'meeting_notes';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'call_log'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'call_log';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'email_log'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'email_log';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'task'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'task';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'reminder'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'reminder';
          END IF;
        END IF;

        -- Create priority enum if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_priority'
        ) THEN
          CREATE TYPE "enum_Interactions_priority" AS ENUM (
            'low',
            'medium',
            'high',
            'urgent'
          );
        END IF;
      END $$;
    `);

    // Add missing columns to align with the model
    await queryInterface.sequelize.query(`
      -- Add category column (required by model)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "category" "enum_Interactions_category" NOT NULL DEFAULT 'internal_note';

      -- Add priority column (model expects this)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "priority" "enum_Interactions_priority" NOT NULL DEFAULT 'medium';

      -- Add notes column (model expects this instead of content)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "notes" TEXT;

      -- Add tags column (model expects this)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "tags" JSONB DEFAULT '[]'::jsonb;

      -- Add attachments column (model expects this)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "attachments" JSONB DEFAULT '[]'::jsonb;

      -- Add userId column (model expects this instead of createdById)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "userId" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

      -- Add nextFollowUp column (model expects this)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "nextFollowUp" TIMESTAMP WITH TIME ZONE;

      -- Add isPrivate column (model expects this)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "isPrivate" BOOLEAN NOT NULL DEFAULT false;

      -- Add messageData column (model expects this)
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "messageData" JSONB;

      -- Update metadata column to align with model expectations
      ALTER TABLE "Interactions" 
      ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

      -- Handle the direction column - make it nullable since it's now in messageData
      ALTER TABLE "Interactions" 
      ALTER COLUMN "direction" DROP NOT NULL;

      -- Handle the status column - make it nullable since it's now in messageData
      ALTER TABLE "Interactions" 
      ALTER COLUMN "status" DROP NOT NULL;

      -- Comments for documentation
      COMMENT ON COLUMN "Interactions"."category" IS 'Category of the interaction';
      COMMENT ON COLUMN "Interactions"."priority" IS 'Priority level of the interaction';
      COMMENT ON COLUMN "Interactions"."notes" IS 'Notes or content of the interaction';
      COMMENT ON COLUMN "Interactions"."tags" IS 'Array of tags associated with the interaction';
      COMMENT ON COLUMN "Interactions"."attachments" IS 'Array of file attachments';
      COMMENT ON COLUMN "Interactions"."userId" IS 'User who created the interaction';
      COMMENT ON COLUMN "Interactions"."nextFollowUp" IS 'Next follow-up date for this interaction';
      COMMENT ON COLUMN "Interactions"."isPrivate" IS 'Whether the interaction is private';
      COMMENT ON COLUMN "Interactions"."messageData" IS 'Additional message data for communication interactions';
    `);

    // Add indexes for performance
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "interactions_category_idx" ON "Interactions" ("category");
      CREATE INDEX IF NOT EXISTS "interactions_priority_idx" ON "Interactions" ("priority");
      CREATE INDEX IF NOT EXISTS "interactions_user_id_idx" ON "Interactions" ("userId");
      CREATE INDEX IF NOT EXISTS "interactions_next_follow_up_idx" ON "Interactions" ("nextFollowUp");
      CREATE INDEX IF NOT EXISTS "interactions_is_private_idx" ON "Interactions" ("isPrivate");
    `);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Remove the added columns
    await queryInterface.sequelize.query(`
      ALTER TABLE "Interactions" 
      DROP COLUMN IF EXISTS "category",
      DROP COLUMN IF EXISTS "priority",
      DROP COLUMN IF EXISTS "notes",
      DROP COLUMN IF EXISTS "tags",
      DROP COLUMN IF EXISTS "attachments",
      DROP COLUMN IF EXISTS "userId",
      DROP COLUMN IF EXISTS "nextFollowUp",
      DROP COLUMN IF EXISTS "isPrivate",
      DROP COLUMN IF EXISTS "messageData";
    `);

    // Restore NOT NULL constraints for direction and status
    await queryInterface.sequelize.query(`
      ALTER TABLE "Interactions" 
      ALTER COLUMN "direction" SET NOT NULL,
      ALTER COLUMN "status" SET NOT NULL;
    `);

    // Remove indexes
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "interactions_category_idx";
      DROP INDEX IF EXISTS "interactions_priority_idx";
      DROP INDEX IF EXISTS "interactions_user_id_idx";
      DROP INDEX IF EXISTS "interactions_next_follow_up_idx";
      DROP INDEX IF EXISTS "interactions_is_private_idx";
    `);
  }
};
