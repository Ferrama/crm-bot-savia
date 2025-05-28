import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("LeadAssignments", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Leads", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      assignedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      assignedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      unassignedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      unassignedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("LeadAssignments");
  }
};
