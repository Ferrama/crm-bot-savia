import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Create LeadColumns table
    await queryInterface.createTable("LeadColumns", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
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

    // Add columnId to Leads table
    await queryInterface.addColumn("Leads", "columnId", {
      type: DataTypes.INTEGER,
      references: { model: "LeadColumns", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true
    });

    // Create default columns for each company
    const companies = (await queryInterface.sequelize.query(
      'SELECT id FROM "Companies"',
      { type: (queryInterface.sequelize as any).QueryTypes.SELECT }
    )) as any[];

    const defaultColumns = [
      { name: "Novo", color: "#7C8A9E", order: 1 },
      { name: "Contactado", color: "#4A90E2", order: 2 },
      { name: "Qualificado", color: "#50E3C2", order: 3 },
      { name: "Proposta", color: "#F5A623", order: 4 },
      { name: "Negociação", color: "#BD10E0", order: 5 },
      { name: "Fechado Ganho", color: "#7ED321", order: 6 },
      { name: "Fechado Perdido", color: "#D0021B", order: 7 }
    ];

    await Promise.all(
      companies.map(async company => {
        await Promise.all(
          defaultColumns.map(async column => {
            await queryInterface.bulkInsert("LeadColumns", [
              {
                ...column,
                companyId: (company as any).id,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]);
          })
        );
      })
    );

    // Migrate existing leads to use the new column system
    const columns = (await queryInterface.sequelize.query(
      'SELECT id, name, "companyId" FROM "LeadColumns"',
      { type: (queryInterface.sequelize as any).QueryTypes.SELECT }
    )) as any[];

    const stageToColumnMap = {
      new: "Novo",
      contacted: "Contactado",
      qualified: "Qualificado",
      proposal: "Proposta",
      negotiation: "Negociação",
      closed_won: "Fechado Ganho",
      closed_lost: "Fechado Perdido"
    };

    const leads = (await queryInterface.sequelize.query(
      'SELECT id, stage, "companyId" FROM "Leads"',
      { type: (queryInterface.sequelize as any).QueryTypes.SELECT }
    )) as any[];
    await Promise.all(
      leads.map(async lead => {
        const columnName = stageToColumnMap[lead.stage];
        const column = columns.find(
          c =>
            (c as any).name === columnName &&
            (c as any).companyId === (lead as any).companyId
        );
        if (column) {
          await queryInterface.sequelize.query(
            'UPDATE "Leads" SET "columnId" = ? WHERE id = ?',
            {
              replacements: [(column as any).id, (lead as any).id],
              type: (queryInterface.sequelize as any).QueryTypes.UPDATE
            }
          );
        }
      })
    );

    // Remove the stage column
    await queryInterface.removeColumn("Leads", "stage");
  },

  down: async (queryInterface: QueryInterface) => {
    // Add back the stage column
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
      defaultValue: "new"
    });

    // Migrate data back
    const columns = (await queryInterface.sequelize.query(
      'SELECT id, name, "companyId" FROM "LeadColumns"',
      { type: (queryInterface.sequelize as any).QueryTypes.SELECT }
    )) as any[];

    const columnToStageMap = {
      Novo: "new",
      Contactado: "contacted",
      Qualificado: "qualified",
      Proposta: "proposal",
      Negociação: "negotiation",
      "Fechado Ganho": "closed_won",
      "Fechado Perdido": "closed_lost"
    };

    const leads = (await queryInterface.sequelize.query(
      'SELECT id, "columnId" FROM "Leads"',
      { type: (queryInterface.sequelize as any).QueryTypes.SELECT }
    )) as any[];
    await Promise.all(
      leads.map(async lead => {
        const column = columns.find(
          c => (c as any).id === (lead as any).columnId
        );
        if (column) {
          const stage = columnToStageMap[(column as any).name];
          if (stage) {
            await queryInterface.sequelize.query(
              'UPDATE "Leads" SET stage = ? WHERE id = ?',
              {
                replacements: [stage, (lead as any).id],
                type: (queryInterface.sequelize as any).QueryTypes.UPDATE
              }
            );
          }
        }
      })
    );

    // Remove columnId
    await queryInterface.removeColumn("Leads", "columnId");

    // Drop LeadColumns table
    await queryInterface.dropTable("LeadColumns");
  }
};
 