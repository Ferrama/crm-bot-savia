import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Leads", "currency", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "USD"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Leads", "currency");
  }
};
