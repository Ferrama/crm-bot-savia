import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { LeadMetadata, LeadPipeline, LeadStatus } from "../types/lead";
import Company from "./Company";
import Contact from "./Contact";
import Currency from "./Currency";
import Interaction from "./Interaction";
import LeadColumn from "./LeadColumn";
import LeadTag from "./LeadTag";
import Tag from "./Tag";
import User from "./User";

@Table({
  tableName: "Leads",
  modelName: "Lead"
})
class Lead extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  description: string;

  @ForeignKey(() => Company)
  @Column({
    allowNull: true
  })
  companyId: number;

  @ForeignKey(() => Contact)
  @Column({
    allowNull: true
  })
  contactId: number;

  @ForeignKey(() => LeadColumn)
  @Column({
    allowNull: true
  })
  columnId: number;

  @Default("cold")
  @Column({
    type: DataType.ENUM("cold", "warm", "hot")
  })
  temperature: string;

  @Default(LeadStatus.NEW)
  @Column({
    type: DataType.ENUM(...Object.values(LeadStatus))
  })
  status: LeadStatus;

  @Default(LeadPipeline.DEFAULT)
  @Column({
    type: DataType.ENUM(...Object.values(LeadPipeline))
  })
  pipeline: LeadPipeline;

  @ForeignKey(() => User)
  @Column({
    allowNull: true
  })
  assignedToId: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: true
  })
  createdById: number;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  lastContactedAt: Date;

  @Column({
    allowNull: true
  })
  source: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true
  })
  expectedValue: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  probability: number;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  expectedClosingDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes: string;

  @ForeignKey(() => Currency)
  @Column({
    allowNull: true
  })
  currencyId: number;

  @Default([])
  @Column({
    type: DataType.JSON
  })
  tags: string[];

  @Default({})
  @Column({
    type: DataType.JSON
  })
  customFields: Record<string, any>;

  @Column({
    type: DataType.JSON
  })
  metadata: LeadMetadata;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => User, { foreignKey: "assignedToId" })
  assignedTo: User;

  @BelongsTo(() => User, { foreignKey: "createdById" })
  createdBy: User;

  @BelongsTo(() => Contact)
  contact: Contact;

  @HasMany(() => Interaction)
  interactions: Interaction[];

  @BelongsTo(() => Currency)
  currency: Currency;

  @BelongsTo(() => LeadColumn, {
    foreignKey: "columnId"
  })
  column: LeadColumn;

  @BelongsToMany(() => Tag, () => LeadTag)
  tagRelations: Tag[];
}

export default Lead;
