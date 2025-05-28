import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Add createdById column to Leads table
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" 
      ADD COLUMN IF NOT EXISTS "createdById" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

      COMMENT ON COLUMN "Leads"."createdById" IS 'The user who created this lead';
    `);

    // Add index for better performance
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "leads_created_by_id_idx" ON "Leads" ("createdById");
    `);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Remove index first
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "leads_created_by_id_idx";
    `);

    // Remove column
    await queryInterface.sequelize.query(`
      ALTER TABLE "Leads" DROP COLUMN IF EXISTS "createdById";
    `);
  }
};
