import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Lead from "./Lead";
import Tag from "./Tag";

@Table({
  tableName: "LeadTags"
})
class LeadTag extends Model<LeadTag> {
  @ForeignKey(() => Lead)
  @Column
  leadId: number;

  @ForeignKey(() => Tag)
  @Column
  tagId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Lead)
  lead: Lead;

  @BelongsTo(() => Tag)
  tag: Tag;
}

export default LeadTag;
