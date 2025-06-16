// No necesitamos importar los enums ya que usamos strings directamente
module.exports = {
  up: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      // Obtener todas las compañías
      const companies = await queryInterface.sequelize.query(
        'SELECT id FROM "Companies"',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: t }
      );

      // Definir las columnas por defecto con sus códigos
      const DEFAULT_LEAD_COLUMNS = [
        {
          code: "new",
          name: "New",
          color: "#7C8A96",
          order: 1,
          isSystem: true
        },
        {
          code: "contacted",
          name: "Contacted",
          color: "#00A8FF",
          order: 2,
          isSystem: true
        },
        {
          code: "follow_up",
          name: "Follow Up",
          color: "#9C27B0",
          order: 3,
          isSystem: true
        },
        {
          code: "proposal",
          name: "Proposal",
          color: "#FFB300",
          order: 4,
          isSystem: true
        },
        {
          code: "negotiation",
          name: "Negotiation",
          color: "#FF6B6B",
          order: 5,
          isSystem: true
        },
        {
          code: "qualified",
          name: "Qualified",
          color: "#4CAF50",
          order: 6,
          isSystem: true
        },
        {
          code: "not_qualified",
          name: "Not Qualified",
          color: "#FF9800",
          order: 7,
          isSystem: true
        },
        {
          code: "converted",
          name: "Converted",
          color: "#00C853",
          order: 8,
          isSystem: true
        },
        {
          code: "lost",
          name: "Lost",
          color: "#FF5252",
          order: 9,
          isSystem: true
        },
        {
          code: "closed_won",
          name: "Closed Won",
          color: "#00C853",
          order: 10,
          isSystem: true
        },
        {
          code: "closed_lost",
          name: "Closed Lost",
          color: "#FF5252",
          order: 11,
          isSystem: true
        }
      ];

      // Para cada compañía, verificar si ya tiene columnas y crear las que falten
      const companyIds = companies.map((c: any) => c.id);

      // Primero, eliminar todas las columnas existentes para asegurar un estado limpio
      await queryInterface.sequelize.query('DELETE FROM "LeadColumns"', {
        transaction: t
      });

      // Crear columnas para todas las compañías usando la configuración por defecto
      const columnsToInsert = companyIds.flatMap((companyId: number) =>
        DEFAULT_LEAD_COLUMNS.map(column => ({
          name: column.name,
          color: column.color,
          order: column.order,
          code: column.code,
          isSystem: column.isSystem,
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
        "SELECT id FROM \"LeadColumns\" WHERE code = 'new'",
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
