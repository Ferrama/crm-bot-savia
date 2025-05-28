import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import Lead from "./Lead";
import User from "./User";

@Table({
  tableName: "LeadAssignmentHistory",
  timestamps: true,
  updatedAt: false
})
class LeadAssignmentHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Lead)
  @Column
  leadId: number;

  @BelongsTo(() => Lead)
  lead: Lead;

  @ForeignKey(() => User)
  @Column
  previousAssignedToId: number;

  @BelongsTo(() => User, "previousAssignedToId")
  previousAssignedTo: User;

  @ForeignKey(() => User)
  @Column
  newAssignedToId: number;

  @BelongsTo(() => User, "newAssignedToId")
  newAssignedTo: User;

  @ForeignKey(() => User)
  @Column
  assignedById: number;

  @BelongsTo(() => User, "assignedById")
  assignedBy: User;

  @Column(DataType.TEXT)
  reason: string;

  @CreatedAt
  createdAt: Date;
}

export default LeadAssignmentHistory;
