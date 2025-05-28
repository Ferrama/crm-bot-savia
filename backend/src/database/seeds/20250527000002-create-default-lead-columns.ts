// No necesitamos importar los enums ya que usamos strings directamente
module.exports = {
  up: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      // Obtener todas las compañías
      const companies = await queryInterface.sequelize.query(
        'SELECT id FROM "Companies"',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: t }
      );

      // Definir las columnas por defecto con sus estados y pipelines correspondientes
      const defaultColumns = [
        {
          name: "New",
          color: "#7C8A96",
          order: 1,
          status: "new",
          pipeline: "default"
        },
        {
          name: "Qualified",
          color: "#00A8FF",
          order: 2,
          status: "qualified",
          pipeline: "default"
        },
        {
          name: "Proposal",
          color: "#FFB300",
          order: 3,
          status: "proposal",
          pipeline: "default"
        },
        {
          name: "Negotiation",
          color: "#FF6B6B",
          order: 4,
          status: "negotiation",
          pipeline: "default"
        },
        {
          name: "Closed Won",
          color: "#00C853",
          order: 5,
          status: "closed_won",
          pipeline: "default"
        },
        {
          name: "Closed Lost",
          color: "#FF5252",
          order: 6,
          status: "closed_lost",
          pipeline: "default"
        }
      ];

      // Para cada compañía, verificar si ya tiene columnas y crear las que falten
      const companyIds = companies.map((c: any) => c.id);

      // Primero, eliminar todas las columnas existentes para asegurar un estado limpio
      await queryInterface.sequelize.query('DELETE FROM "LeadColumns"', {
        transaction: t
      });

      // Crear columnas para todas las compañías
      const columnsToInsert = companyIds.flatMap((companyId: number) =>
        defaultColumns.map(column => ({
          ...column,
          companyId,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );

      await queryInterface.bulkInsert("LeadColumns", columnsToInsert, {
        transaction: t
      });

      // Actualizar los leads existentes para asignarlos a la columna "New" si no tienen columna
      const newColumns = await queryInterface.sequelize.query(
        "SELECT id FROM \"LeadColumns\" WHERE name = 'New'",
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: t }
      );

      if (newColumns.length > 0) {
        const newColumnIds = newColumns.map((c: any) => c.id);
        await queryInterface.sequelize.query(
          'UPDATE "Leads" SET "columnId" = :columnId WHERE "columnId" IS NULL',
          {
            replacements: { columnId: newColumnIds[0] },
            transaction: t
          }
        );
      }
    });
  },

  down: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      // Eliminar todas las columnas al hacer rollback
      await queryInterface.sequelize.query('DELETE FROM "LeadColumns"', {
        transaction: t
      });
    });
  }
};
