import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Create the enum type safely using a DO block
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        -- Create the enum type if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_LeadPipeline'
        ) THEN
          CREATE TYPE "enum_LeadPipeline" AS ENUM (
            'default',
            'sales',
            'support',
            'onboarding'
          );
        END IF;
      END $$;
    `);

    // Add pipeline field to Leads table
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" 
      ADD COLUMN IF NOT EXISTS "pipeline" "enum_LeadPipeline" NOT NULL DEFAULT 'default';
    `);

    // Add pipeline fields to LeadStatusHistory table
    await queryInterface.sequelize.query(`
      ALTER TABLE "LeadStatusHistory" 
      ADD COLUMN IF NOT EXISTS "pipeline" "enum_LeadPipeline",
      ADD COLUMN IF NOT EXISTS "previousPipeline" "enum_LeadPipeline";
    `);

    // Create enum for activity type
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_LeadStatusHistory_activityType'
        ) THEN
          CREATE TYPE "enum_LeadStatusHistory_activityType" AS ENUM (
            'status_change',
            'pipeline_change',
            'email',
            'note',
            'file',
            'message'
          );
        END IF;
      END $$;
    `);

    // Add activity type and metadata fields
    await queryInterface.sequelize.query(`
      ALTER TABLE "LeadStatusHistory" 
      ADD COLUMN IF NOT EXISTS "activityType" "enum_LeadStatusHistory_activityType" NOT NULL DEFAULT 'status_change',
      ADD COLUMN IF NOT EXISTS "metadata" JSONB;
    `);

    // Add indexes using raw SQL
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "leads_pipeline_idx" ON "Leads" ("pipeline");
      CREATE INDEX IF NOT EXISTS "lead_status_history_pipeline_idx" ON "LeadStatusHistory" ("pipeline");
      CREATE INDEX IF NOT EXISTS "lead_status_history_activity_type_idx" ON "LeadStatusHistory" ("activityType");
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    // Remove columns using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" DROP COLUMN IF EXISTS "pipeline";
      ALTER TABLE "LeadStatusHistory" 
        DROP COLUMN IF EXISTS "pipeline",
        DROP COLUMN IF EXISTS "previousPipeline",
        DROP COLUMN IF EXISTS "activityType",
        DROP COLUMN IF EXISTS "metadata";
    `);

    // Note: We can't remove enum types in PostgreSQL
    // The enum types will remain in the database
  }
};
