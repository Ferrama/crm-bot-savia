import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("LeadTags", {
      leadId: {
        type: DataTypes.INTEGER,
        references: { model: "Leads", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true
      },
      tagId: {
        type: DataTypes.INTEGER,
        references: { model: "Tags", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true
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

    // Agregar índice compuesto para evitar duplicados
    await queryInterface.addIndex("LeadTags", ["leadId", "tagId"], {
      unique: true,
      name: "lead_tag_unique"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("LeadTags");
  }
};
