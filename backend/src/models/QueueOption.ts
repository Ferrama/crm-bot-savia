import {
  AllowNull,
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
import Queue from "./Queue";

type QueueOptionModel = Model<QueueOption>;

@Table
class QueueOption extends Model<QueueOption> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @AllowNull
  @Column
  message: string;

  @AllowNull
  @Column
  option: string;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @ForeignKey(() => QueueOption)
  @Column
  parentId: number;

  @ForeignKey(() => Queue)
  @AllowNull
  @Column
  forwardQueueId: number;

  @Column
  exitChatbot: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Queue)
  queue: Queue;

  @BelongsTo(() => QueueOption, { foreignKey: "parentId" })
  parent: QueueOption;

  @BelongsTo(() => Queue, { foreignKey: "forwardQueueId" })
  forwardQueue: Queue;

  @HasMany(() => QueueOption, {
    onDelete: "DELETE",
    onUpdate: "DELETE",
    hooks: true
  })
  options: QueueOption[];

  @Column
  mediaPath: string;

  @Column
  mediaName: string;
}

export default QueueOption;
