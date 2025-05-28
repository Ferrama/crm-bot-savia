import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Quotes", "contactId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Contacts", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });

    // Agregar índice para mejorar el rendimiento de las búsquedas
    await queryInterface.addIndex("Quotes", ["contactId"]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex("Quotes", ["contactId"]);
    await queryInterface.removeColumn("Quotes", "contactId");
  }
};
