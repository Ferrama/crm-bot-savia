import { QueryInterface } from "sequelize";

module.exports = {
  up: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      // Verificar si ya existen monedas
      const currencies = await queryInterface.sequelize.query(
        'SELECT * FROM "Currencies"',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: t }
      );

      if (currencies.length === 0) {
        // Insertar monedas por defecto
        await queryInterface.bulkInsert(
          "Currencies",
          [
            {
              name: "USD",
              symbol: "$",
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "EUR",
              symbol: "€",
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "BRL",
              symbol: "R$",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          { transaction: t }
        );
      }
    });
  },

  down: async () => {
    // No hacemos nada en el down ya que queremos mantener las monedas
    return Promise.resolve();
  }
};
