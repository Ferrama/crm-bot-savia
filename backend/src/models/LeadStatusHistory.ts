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
  Table
} from "sequelize-typescript";
import {
  ActivityType,
  LeadMetadata,
  LeadPipeline,
  LeadStatus
} from "../types/lead";
import Interaction from "./Interaction";
import Lead from "./Lead";
import User from "./User";

@Table({
  tableName: "LeadStatusHistory",
  modelName: "LeadStatusHistory"
})
class LeadStatusHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Lead)
  @Column
  leadId: number;

  @Column({
    type: DataType.ENUM(...Object.values(LeadStatus))
  })
  status: LeadStatus;

  @Column({
    type: DataType.ENUM(...Object.values(LeadStatus))
  })
  previousStatus: LeadStatus;

  @Column({
    type: DataType.ENUM(...Object.values(LeadPipeline))
  })
  pipeline: LeadPipeline;

  @Column({
    type: DataType.ENUM(...Object.values(LeadPipeline))
  })
  previousPipeline: LeadPipeline;

  @Default(ActivityType.STATUS_CHANGE)
  @Column({
    type: DataType.ENUM(...Object.values(ActivityType))
  })
  activityType: ActivityType;

  @Column
  notes: string;

  @ForeignKey(() => Interaction)
  @Column
  interactionId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({
    type: DataType.JSON
  })
  metadata: LeadMetadata;

  @CreatedAt
  createdAt: Date;

  @BelongsTo(() => Lead)
  lead: Lead;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Interaction)
  interaction: Interaction;
}

export default LeadStatusHistory;
