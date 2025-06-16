import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn("LeadColumns", "code", {
      type: DataTypes.STRING,
      allowNull: true,
      comment:
        'Code for generic columns (e.g., "new", "contacted", "proposal"). Null for custom columns.'
    });

    await queryInterface.addColumn("LeadColumns", "isSystem", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether this is a system column that cannot be deleted"
    });

    // Agregar índice para mejorar el rendimiento de búsquedas por código
    await queryInterface.addIndex("LeadColumns", ["code", "companyId"], {
      name: "lead_columns_code_company_idx"
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeIndex(
      "LeadColumns",
      "lead_columns_code_company_idx"
    );
    await queryInterface.removeColumn("LeadColumns", "isSystem");
    await queryInterface.removeColumn("LeadColumns", "code");
  }
};
