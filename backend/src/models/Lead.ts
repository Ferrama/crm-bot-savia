import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Company from "./Company";
import Contact from "./Contact";
import Ticket from "./Ticket";
import User from "./User";

@Table
class Lead extends Model<Lead> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    allowNull: false
  })
  name: string;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @ForeignKey(() => {
    const LeadColumn = require("./LeadColumn").default;
    return LeadColumn;
  })
  @Column
  columnId: number;

  @BelongsTo(() => {
    const LeadColumn = require("./LeadColumn").default;
    return LeadColumn;
  })
  column: any;

  @Column({
    type: DataType.ENUM("cold", "warm", "hot"),
    defaultValue: "cold"
  })
  temperature: string;

  @Column
  source: string;

  @Column(DataType.DECIMAL(10, 2))
  expectedValue: number;

  @Column(DataType.INTEGER)
  probability: number;

  @Column(DataType.DATE)
  expectedClosingDate: Date;

  @ForeignKey(() => User)
  @Column
  assignedToId: number;

  @BelongsTo(() => User)
  assignedTo: User;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @Column(DataType.TEXT)
  notes: string;

  @Column(DataType.JSON)
  customFields: any;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Lead;
