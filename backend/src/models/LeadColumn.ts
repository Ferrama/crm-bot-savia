import {
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import Company from "./Company";
import Lead from "./Lead";

@Table({
  tableName: "LeadColumns",
  modelName: "LeadColumn"
})
class LeadColumn extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  color: string;

  @Column
  order: number;

  @Column({
    allowNull: true,
    comment: 'Code for generic columns (e.g., "new", "contacted", "proposal"). Null for custom columns.'
  })
  code: string;

  @Column({
    defaultValue: false,
    comment: 'Whether this is a system column that cannot be deleted'
  })
  isSystem: boolean;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Lead, {
    foreignKey: "columnId"
  })
  leads: Lead[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default LeadColumn;
