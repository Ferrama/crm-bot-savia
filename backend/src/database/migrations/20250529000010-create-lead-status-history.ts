import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Drop the table if it exists to ensure a clean state
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "LeadStatusHistory";
    `);

    // Create the enum type safely using a DO block
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        -- Create the enum type if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_LeadStatusHistory_status'
        ) THEN
          CREATE TYPE "enum_LeadStatusHistory_status" AS ENUM (
            'new',
            'contacted',
            'follow_up',
            'proposal',
            'negotiation',
            'qualified',
            'unqualified',
            'converted',
            'lost'
          );
        END IF;
      END $$;
    `);

    // Create the LeadStatusHistory table using raw SQL
    await queryInterface.sequelize.query(`
      CREATE TABLE "LeadStatusHistory" (
        "id" SERIAL PRIMARY KEY,
        "leadId" INTEGER NOT NULL REFERENCES "Leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "status" "enum_LeadStatusHistory_status" NOT NULL,
        "previousStatus" "enum_LeadStatusHistory_status",
        "notes" TEXT,
        "interactionId" INTEGER REFERENCES "Interactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "userId" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    // Add indexes using raw SQL
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "lead_status_history_lead_id_idx" ON "LeadStatusHistory" ("leadId");
      CREATE INDEX IF NOT EXISTS "lead_status_history_status_idx" ON "LeadStatusHistory" ("status");
      CREATE INDEX IF NOT EXISTS "lead_status_history_user_id_idx" ON "LeadStatusHistory" ("userId");
      CREATE INDEX IF NOT EXISTS "lead_status_history_created_at_idx" ON "LeadStatusHistory" ("createdAt");
    `);

    // Add status field to Leads table if it doesn't exist
    const tableInfo = await queryInterface.describeTable("Leads");
    if (!tableInfo.status) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "Leads" 
        ADD COLUMN IF NOT EXISTS "status" "enum_LeadStatusHistory_status" NOT NULL DEFAULT 'new';
      `);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    // Drop the LeadStatusHistory table
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "LeadStatusHistory";
    `);

    // Remove status field from Leads table
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" DROP COLUMN IF EXISTS "status";
    `);

    // Note: We can't remove enum values in PostgreSQL
    // The enum type will remain in the database
  }
};
