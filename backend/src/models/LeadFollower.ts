import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Lead from "./Lead";
import User from "./User";

@Table({
  tableName: "LeadFollowers",
  modelName: "LeadFollower",
  indexes: [
    {
      unique: true,
      fields: ["leadId", "userId"]
    }
  ]
})
class LeadFollower extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Lead)
  @Column
  leadId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default(true)
  @Column
  notificationsEnabled: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Lead)
  lead: Lead;

  @BelongsTo(() => User)
  user: User;
}

export default LeadFollower;
