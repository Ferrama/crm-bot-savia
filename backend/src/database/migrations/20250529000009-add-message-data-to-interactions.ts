import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Check if messageData column already exists
    const tableInfo = await queryInterface.describeTable("Interactions");
    if (!tableInfo.messageData) {
      // Only add the column if it doesn't exist
      await queryInterface.addColumn("Interactions", "messageData", {
        type: DataTypes.JSON,
        allowNull: true
      });
    }

    // Update enums safely using DO blocks
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        -- Add MESSAGE to InteractionType if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type t 
          JOIN pg_enum e ON t.oid = e.enumtypid  
          WHERE t.typname = 'enum_Interactions_type' 
          AND e.enumlabel = 'message'
        ) THEN
          ALTER TYPE "enum_Interactions_type" ADD VALUE 'message';
        END IF;

        -- Create the category enum type if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_Interactions_category'
        ) THEN
          CREATE TYPE "enum_Interactions_category" AS ENUM (
            'whatsapp',
            'instagram',
            'facebook',
            'telegram',
            'other'
          );
        ELSE
          -- Add new categories to InteractionCategory if they don't exist
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'whatsapp'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'whatsapp';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'instagram'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'instagram';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'facebook'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'facebook';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'telegram'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'telegram';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'enum_Interactions_category' 
            AND e.enumlabel = 'other'
          ) THEN
            ALTER TYPE "enum_Interactions_category" ADD VALUE 'other';
          END IF;
        END IF;
      END $$;
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    // Check if messageData column exists before trying to remove it
    const tableInfo = await queryInterface.describeTable("Interactions");
    if (tableInfo.messageData) {
      await queryInterface.removeColumn("Interactions", "messageData");
    }

    // Note: We can't remove enum values in PostgreSQL
    // The values 'message' and the new categories will remain in the enums
  }
};
