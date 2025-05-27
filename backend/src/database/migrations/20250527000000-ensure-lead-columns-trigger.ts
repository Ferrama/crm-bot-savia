import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Drop existing trigger and function if they exist
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS create_lead_columns_trigger ON "Companies";
      DROP FUNCTION IF EXISTS create_default_lead_columns();
    `);

    // Create the trigger function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION create_default_lead_columns()
      RETURNS TRIGGER AS $$
      DECLARE
        column_record RECORD;
      BEGIN
        FOR column_record IN (
          SELECT * FROM (VALUES
            ('New', '#7C8A9E', 1),
            ('Follow Up', '#4A90E2', 2),
            ('Prospect', '#50E3C2', 3),
            ('Proposal', '#F5A623', 4),
            ('Negotiation', '#BD10E0', 5),
            ('Won', '#7ED321', 6),
            ('Lost', '#D0021B', 7)
          ) AS default_columns(name, color, order_num)
        ) LOOP
          INSERT INTO "LeadColumns" (name, color, "order", "companyId", "createdAt", "updatedAt")
          VALUES (
            column_record.name,
            column_record.color,
            column_record.order_num,
            NEW.id,
            NOW(),
            NOW()
          );
        END LOOP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create the trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER create_lead_columns_trigger
      AFTER INSERT ON "Companies"
      FOR EACH ROW
      EXECUTE FUNCTION create_default_lead_columns();
    `);

    // Create columns for any existing companies that don't have them
    const companies = (await queryInterface.sequelize.query(
      'SELECT c.id FROM "Companies" c LEFT JOIN "LeadColumns" lc ON c.id = lc."companyId" WHERE lc.id IS NULL',
      { type: (queryInterface.sequelize as any).QueryTypes.SELECT }
    )) as any[];

    await Promise.all(
      companies.map(company =>
        queryInterface.sequelize.query(`
          INSERT INTO "LeadColumns" (name, color, "order", "companyId", "createdAt", "updatedAt")
          VALUES
            ('New', '#7C8A9E', 1, ${company.id}, NOW(), NOW()),
            ('Follow Up', '#4A90E2', 2, ${company.id}, NOW(), NOW()),
            ('Prospect', '#50E3C2', 3, ${company.id}, NOW(), NOW()),
            ('Proposal', '#F5A623', 4, ${company.id}, NOW(), NOW()),
            ('Negotiation', '#BD10E0', 5, ${company.id}, NOW(), NOW()),
            ('Won', '#7ED321', 6, ${company.id}, NOW(), NOW()),
            ('Lost', '#D0021B', 7, ${company.id}, NOW(), NOW());
        `)
      )
    );
  },

  down: async (queryInterface: QueryInterface) => {
    // Drop the trigger and function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS create_lead_columns_trigger ON "Companies";
      DROP FUNCTION IF EXISTS create_default_lead_columns();
    `);
  }
};
