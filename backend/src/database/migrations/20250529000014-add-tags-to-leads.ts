import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Add tags column to Leads table as JSONB for better performance
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" 
      ADD COLUMN IF NOT EXISTS "tags" JSONB DEFAULT '[]'::jsonb;

      COMMENT ON COLUMN "Leads"."tags" IS 'Array of tag IDs associated with this lead';
    `);

    // Add GIN index for better performance when querying JSONB
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "leads_tags_idx" ON "Leads" USING GIN ("tags");
    `);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Remove index first
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "leads_tags_idx";
    `);

    // Remove column
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" DROP COLUMN IF EXISTS "tags";
    `);
  }
};
