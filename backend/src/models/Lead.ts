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

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @Column({
    type: DataType.ENUM(
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "closed_won",
      "closed_lost"
    ),
    defaultValue: "new"
  })
  stage: string;

  @Column({
    type: DataType.ENUM("hot", "warm", "cold"),
    defaultValue: "cold"
  })
  temperature: string;

  @Column
  source: string;

  @Column
  expectedValue: number;

  @Column
  probability: number;

  @Column
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

  @Column(DataType.JSONB)
  customFields: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Lead;
