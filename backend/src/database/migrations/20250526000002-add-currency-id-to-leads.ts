import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Primero agregamos la columna permitiendo valores nulos
    await queryInterface.addColumn("Leads", "currencyId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Currencies",
        key: "id"
      }
    });

    // Actualizamos los registros existentes para usar USD (id: 1) por defecto
    await queryInterface.sequelize.query(
      'UPDATE "Leads" SET "currencyId" = 1 WHERE "currencyId" IS NULL'
    );

    // Finalmente hacemos la columna no nula
    await queryInterface.changeColumn("Leads", "currencyId", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Currencies",
        key: "id"
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Leads", "currencyId");
  }
};
