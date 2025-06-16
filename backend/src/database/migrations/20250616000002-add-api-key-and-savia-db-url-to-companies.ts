import { DataTypes } from "sequelize";

export default {
  up: async queryInterface => {
    await queryInterface.addColumn("Companies", "apiKey", {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("Companies", "saviaDbUrl", {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn("Companies", "apiKey");
    await queryInterface.removeColumn("Companies", "saviaDbUrl");
  }
};
