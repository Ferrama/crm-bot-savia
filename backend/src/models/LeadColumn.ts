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
