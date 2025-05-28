import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("LeadAssignmentHistory", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      leadId: {
        type: DataTypes.INTEGER,
        references: { model: "Leads", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      previousAssignedToId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true
      },
      newAssignedToId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true
      },
      assignedById: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: false
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex("LeadAssignmentHistory", ["leadId"]);
    await queryInterface.addIndex("LeadAssignmentHistory", ["newAssignedToId"]);
    await queryInterface.addIndex("LeadAssignmentHistory", ["assignedById"]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex("LeadAssignmentHistory", ["leadId"]);
    await queryInterface.removeIndex("LeadAssignmentHistory", [
      "newAssignedToId"
    ]);
    await queryInterface.removeIndex("LeadAssignmentHistory", ["assignedById"]);
    await queryInterface.dropTable("LeadAssignmentHistory");
  }
};
