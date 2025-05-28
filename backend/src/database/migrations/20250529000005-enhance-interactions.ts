import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // Create the outcome enum type safely
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_outcome'
        ) THEN
          CREATE TYPE "enum_Interactions_outcome" AS ENUM (
            'positive',
            'neutral',
            'negative'
          );
        END IF;
      END $$;
    `);

    // Add new columns using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE "Interactions" 
      ADD COLUMN IF NOT EXISTS "duration" INTEGER,
      ADD COLUMN IF NOT EXISTS "outcome" "enum_Interactions_outcome",
      ADD COLUMN IF NOT EXISTS "followUpDate" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "followUpNotes" TEXT;

      COMMENT ON COLUMN "Interactions"."duration" IS 'Duration in seconds';
    `);

    // Add index for followUpDate
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "interactions_follow_up_date_idx" ON "Interactions" ("followUpDate");
    `);
  },

  async down(queryInterface: QueryInterface) {
    // Remove columns using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE "Interactions" 
      DROP COLUMN IF EXISTS "duration",
      DROP COLUMN IF EXISTS "outcome",
      DROP COLUMN IF EXISTS "followUpDate",
      DROP COLUMN IF EXISTS "followUpNotes";
    `);

    // Note: We can't remove enum types in PostgreSQL
    // The enum type will remain in the database
  }
};
