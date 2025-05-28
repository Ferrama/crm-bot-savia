import {
  AllowNull,
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
import {
  InteractionCategory,
  InteractionPriority,
  InteractionType
} from "../types/interaction";
import { LeadMetadata } from "../types/lead";
import Lead from "./Lead";
import User from "./User";

@Table({
  tableName: "Interactions",
  timestamps: true
})
class Interaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Lead)
  @Column
  leadId: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(InteractionType))
  })
  type: InteractionType;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(InteractionCategory))
  })
  category: InteractionCategory;

  @Default(InteractionPriority.MEDIUM)
  @Column({
    type: DataType.ENUM(...Object.values(InteractionPriority))
  })
  priority: InteractionPriority;

  @Column
  notes: string;

  @Column({
    type: DataType.JSON
  })
  metadata: LeadMetadata;

  @Default([])
  @Column({
    type: DataType.JSON
  })
  tags: string[];

  @Default([])
  @Column({
    type: DataType.JSON
  })
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  nextFollowUp: Date;

  @Default(false)
  @Column
  isPrivate: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    type: DataType.JSON
  })
  messageData: {
    messageId?: string;
    platform?: string;
    direction?: "in" | "out";
    status?: string;
    mediaUrl?: string;
    mediaType?: string;
  };

  @BelongsTo(() => Lead)
  lead: Lead;

  @BelongsTo(() => User)
  user: User;
}

export default Interaction;
export { InteractionCategory, InteractionPriority, InteractionType };
