import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Currencies", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Insertar monedas por defecto
    await queryInterface.bulkInsert("Currencies", [
      {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "BRL",
        symbol: "R$",
        name: "Brazilian Real",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "ARS",
        symbol: "$",
        name: "Argentine Peso",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "CLP",
        symbol: "$",
        name: "Chilean Peso",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "COP",
        symbol: "$",
        name: "Colombian Peso",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "MXN",
        symbol: "$",
        name: "Mexican Peso",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "PEN",
        symbol: "S/",
        name: "Peruvian Sol",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: "UYU",
        symbol: "$U",
        name: "Uruguayan Peso",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Currencies");
  }
};
