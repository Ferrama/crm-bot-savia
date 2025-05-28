import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Quotes", {
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
      status: {
        type: DataTypes.ENUM(
          "draft",
          "sent",
          "accepted",
          "rejected",
          "expired"
        ),
        allowNull: false,
        defaultValue: "draft"
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      currencyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Currencies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
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

    // Creamos el tipo ENUM para el status
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_Quotes_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Quotes");
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_Quotes_status;
    `);
  }
};
