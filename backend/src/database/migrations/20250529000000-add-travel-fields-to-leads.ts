import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Leads", "travelPreferences", {
      type: DataTypes.JSON,
      allowNull: true
    });

    await queryInterface.addColumn("Leads", "leadType", {
      type: DataTypes.ENUM("individual", "group", "corporate"),
      allowNull: true
    });

    await queryInterface.addColumn("Leads", "groupSize", {
      type: DataTypes.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn("Leads", "budgetPerPerson", {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    });

    await queryInterface.addColumn("Leads", "interactionHistory", {
      type: DataTypes.JSON,
      allowNull: true
    });

    await queryInterface.addColumn("Leads", "lastContactedAt", {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Leads", "travelPreferences");
    await queryInterface.removeColumn("Leads", "leadType");
    await queryInterface.removeColumn("Leads", "groupSize");
    await queryInterface.removeColumn("Leads", "budgetPerPerson");
    await queryInterface.removeColumn("Leads", "interactionHistory");
    await queryInterface.removeColumn("Leads", "lastContactedAt");
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_Leads_leadType;"
    );
  }
};
