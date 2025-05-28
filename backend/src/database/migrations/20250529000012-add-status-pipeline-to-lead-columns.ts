import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Create the enum type for status safely
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_LeadColumns_status'
        ) THEN
          CREATE TYPE "enum_LeadColumns_status" AS ENUM (
            'new',
            'qualified',
            'proposal',
            'negotiation',
            'closed_won',
            'closed_lost'
          );
        END IF;
      END $$;
    `);

    // Add status and pipeline fields to LeadColumns table
    await queryInterface.sequelize.query(`
      ALTER TABLE "LeadColumns" 
      ADD COLUMN IF NOT EXISTS "status" "enum_LeadColumns_status" NOT NULL DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS "pipeline" "enum_LeadPipeline" NOT NULL DEFAULT 'default';

      COMMENT ON COLUMN "LeadColumns"."status" IS 'The status associated with this column';
      COMMENT ON COLUMN "LeadColumns"."pipeline" IS 'The pipeline this column belongs to';
    `);

    // Add indexes for better performance
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "lead_columns_status_idx" ON "LeadColumns" ("status");
      CREATE INDEX IF NOT EXISTS "lead_columns_pipeline_idx" ON "LeadColumns" ("pipeline");
    `);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Remove columns using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE "LeadColumns" 
      DROP COLUMN IF EXISTS "status",
      DROP COLUMN IF EXISTS "pipeline";
    `);

    // Note: We can't remove enum types in PostgreSQL
    // The enum type will remain in the database
  }
};
