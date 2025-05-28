import { DataTypes, QueryInterface } from "sequelize";

export interface Migration {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes
  ) => Promise<void>;
  down: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes
  ) => Promise<void>;
}
