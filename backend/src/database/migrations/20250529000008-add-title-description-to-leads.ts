import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Leads", "title", {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn("Leads", "description", {
      type: DataTypes.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Leads", "title");
    await queryInterface.removeColumn("Leads", "description");
  }
};
