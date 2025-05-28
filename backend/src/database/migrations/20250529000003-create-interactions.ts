import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // Create enum types safely using DO blocks
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        -- Create type enum if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_type'
        ) THEN
          CREATE TYPE "enum_Interactions_type" AS ENUM (
            'email',
            'call',
            'meeting',
            'note',
            'message',
            'file'
          );
        END IF;

        -- Create direction enum if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_direction'
        ) THEN
          CREATE TYPE "enum_Interactions_direction" AS ENUM (
            'inbound',
            'outbound'
          );
        END IF;

        -- Create status enum if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_status'
        ) THEN
          CREATE TYPE "enum_Interactions_status" AS ENUM (
            'pending',
            'completed',
            'failed',
            'cancelled'
          );
        END IF;
      END $$;
    `);

    // Create the Interactions table using raw SQL
    await queryInterface.sequelize.query(`
      CREATE TABLE "Interactions" (
        "id" SERIAL PRIMARY KEY,
        "leadId" INTEGER NOT NULL REFERENCES "Leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "type" "enum_Interactions_type" NOT NULL,
        "direction" "enum_Interactions_direction" NOT NULL,
        "status" "enum_Interactions_status" NOT NULL DEFAULT 'pending',
        "subject" VARCHAR(255),
        "content" TEXT,
        "metadata" JSONB,
        "scheduledFor" TIMESTAMP WITH TIME ZONE,
        "completedAt" TIMESTAMP WITH TIME ZONE,
        "createdById" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    // Add indexes using raw SQL
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "interactions_lead_id_idx" ON "Interactions" ("leadId");
      CREATE INDEX IF NOT EXISTS "interactions_type_idx" ON "Interactions" ("type");
      CREATE INDEX IF NOT EXISTS "interactions_status_idx" ON "Interactions" ("status");
      CREATE INDEX IF NOT EXISTS "interactions_created_by_id_idx" ON "Interactions" ("createdById");
      CREATE INDEX IF NOT EXISTS "interactions_scheduled_for_idx" ON "Interactions" ("scheduledFor");
    `);
  },

  async down(queryInterface: QueryInterface) {
    // Drop the table first
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "Interactions";
    `);

    // Note: We can't remove enum types in PostgreSQL
    // The enum types will remain in the database
  }
};
