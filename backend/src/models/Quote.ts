import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { QuoteStatus } from "../types/quote";
import Contact from "./Contact";
import Currency from "./Currency";
import Lead from "./Lead";
import User from "./User";

@Table({
  tableName: "Quotes"
})
class Quote extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Lead)
  @Column
  leadId: number;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @Default([])
  @Column({
    type: DataType.JSON
  })
  services: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;

  @Column({
    type: DataType.TEXT
  })
  terms: string;

  @Column({
    type: DataType.TEXT
  })
  notes: string;

  @Column({
    type: DataType.JSON
  })
  travelDetails: {
    origin?: string;
    destination?: string;
    dates?: string;
    duration?: string;
  };

  @Column
  validUntil: Date;

  @Default(QuoteStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(QuoteStatus))
  })
  status: QuoteStatus;

  @Default(0)
  @Column
  totalAmount: number;

  @ForeignKey(() => Currency)
  @Column
  currencyId: number;

  @ForeignKey(() => User)
  @Column
  createdById: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Lead)
  lead: Lead;

  @BelongsTo(() => Contact)
  contact: Contact;

  @BelongsTo(() => Currency)
  currency: Currency;

  @BelongsTo(() => User)
  createdBy: User;
}

export default Quote;
export { QuoteStatus };
