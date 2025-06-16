import { DataTypes } from "sequelize";

export default {
  up: async queryInterface => {
    await queryInterface.addColumn("Users", "enabled", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn("Users", "enabled");
  }
};
