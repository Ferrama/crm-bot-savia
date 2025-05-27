import { QueryInterface } from "sequelize";
module.exports = {
  up: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      // Obtener todas las compañías
      const companies = await queryInterface.sequelize.query(
        'SELECT id FROM "Companies"',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: t }
      );

      // Definir las columnas por defecto
      const defaultColumns = [
        {
          name: "New",
          color: "#7C8A96",
          order: 1
        },
        {
          name: "Qualified",
          color: "#00A8FF",
          order: 2
        },
        {
          name: "Proposal",
          color: "#FFB300",
          order: 3
        },
        {
          name: "Negotiation",
          color: "#FF6B6B",
          order: 4
        },
        {
          name: "Closed Won",
          color: "#00C853",
          order: 5
        },
        {
          name: "Closed Lost",
          color: "#FF5252",
          order: 6
        }
      ];

      // Para cada compañía, verificar si ya tiene columnas y crear las que falten
      const companyIds = companies.map((c: any) => c.id);
      const existingColumns = await queryInterface.sequelize.query(
        'SELECT "companyId" FROM "LeadColumns" GROUP BY "companyId"',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: t }
      );
      const companiesWithColumns = existingColumns.map((c: any) => c.companyId);

      // Filtrar las compañías que no tienen columnas
      const companiesWithoutColumns = companyIds.filter(
        (id: number) => !companiesWithColumns.includes(id)
      );

      if (companiesWithoutColumns.length > 0) {
        // Crear columnas para las compañías que no las tienen
        const columnsToInsert = companiesWithoutColumns.flatMap(
          (companyId: number) =>
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
      }
    });
  },

  down: async () => {
    // No hacemos nada en el down ya que queremos mantener las columnas
    return Promise.resolve();
  }
};
