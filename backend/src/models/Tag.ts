import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Company from "./Company";
import Lead from "./Lead";
import LeadTag from "./LeadTag";
import Ticket from "./Ticket";
import TicketTag from "./TicketTag";

@Table
class Tag extends Model<Tag> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  color: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0
  })
  kanban: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsToMany(() => Lead, () => LeadTag)
  leads: Lead[];

  @BelongsToMany(() => Ticket, () => TicketTag)
  tickets: Ticket[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Tag;
