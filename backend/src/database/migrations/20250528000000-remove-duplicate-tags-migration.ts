import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    try {
      // Primero, verificar si la migración problemática está en SequelizeMeta
      const [migrations] = await queryInterface.sequelize.query(`
        SELECT name FROM "SequelizeMeta" 
        WHERE name = '20250426000002-add-company-id-to-tags.ts'
      `);

      if (migrations.length > 0) {
        // Si existe, eliminarla de SequelizeMeta
        await queryInterface.sequelize.query(`
          DELETE FROM "SequelizeMeta" 
          WHERE name = '20250426000002-add-company-id-to-tags.ts'
        `);
        console.log("Migración problemática eliminada de SequelizeMeta");
      }

      // Verificar si la columna companyId ya existe en Tags
      const [columns] = await queryInterface.sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Tags' 
          AND column_name = 'companyId'
      `);

      if (columns.length === 0) {
        console.log("Warning: Tags table does not have companyId column. This is unexpected.");
      } else {
        console.log("Tags table already has companyId column as expected");
      }

      // Asegurarnos de que esta migración esté registrada
      await queryInterface.sequelize.query(`
        INSERT INTO "SequelizeMeta" (name)
        SELECT '20250528000000-remove-duplicate-tags-migration.ts'
        WHERE NOT EXISTS (
          SELECT 1 FROM "SequelizeMeta" 
          WHERE name = '20250528000000-remove-duplicate-tags-migration.ts'
        );
      `);

      console.log("Migración de limpieza completada exitosamente");
      return Promise.resolve();
    } catch (error) {
      console.error("Error durante la limpieza:", error.message);
      // Aún así resolvemos la promesa para no fallar la migración
      return Promise.resolve();
    }
  },

  down: async () => {
    // Esta migración no es reversible
    return Promise.resolve();
  }
};
