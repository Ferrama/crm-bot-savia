import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Leads", "stage", {
      type: DataTypes.ENUM(
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost"
      ),
      defaultValue: "new",
      allowNull: false
    });
    await queryInterface.addColumn("Leads", "temperature", {
      type: DataTypes.ENUM("hot", "warm", "cold"),
      defaultValue: "cold",
      allowNull: false
    });
    await queryInterface.addColumn("Leads", "source", {
      type: DataTypes.STRING
    });
    await queryInterface.addColumn("Leads", "expectedValue", {
      type: DataTypes.FLOAT
    });
    await queryInterface.addColumn("Leads", "probability", {
      type: DataTypes.FLOAT
    });
    await queryInterface.addColumn("Leads", "expectedClosingDate", {
      type: DataTypes.DATE
    });
    await queryInterface.addColumn("Leads", "customFields", {
      type: DataTypes.JSONB
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Leads", "stage");
    await queryInterface.removeColumn("Leads", "temperature");
    await queryInterface.removeColumn("Leads", "source");
    await queryInterface.removeColumn("Leads", "expectedValue");
    await queryInterface.removeColumn("Leads", "probability");
    await queryInterface.removeColumn("Leads", "expectedClosingDate");
    await queryInterface.removeColumn("Leads", "customFields");
  }
};
