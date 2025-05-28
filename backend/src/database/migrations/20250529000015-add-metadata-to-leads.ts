import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Add metadata column to Leads table
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" 
      ADD COLUMN IF NOT EXISTS "metadata" JSONB DEFAULT '{}'::jsonb;

      COMMENT ON COLUMN "Leads"."metadata" IS 'Additional metadata for the lead stored as JSON';
    `);

    // Add GIN index for better JSON querying performance
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "leads_metadata_idx" ON "Leads" USING GIN ("metadata");
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    // Remove the index first
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "leads_metadata_idx";
    `);

    // Then remove the column
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" 
      DROP COLUMN IF EXISTS "metadata";
    `);
  }
};
