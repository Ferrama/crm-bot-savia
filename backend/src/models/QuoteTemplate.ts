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
import User from "./User";

@Table({
  tableName: "QuoteTemplates"
})
class QuoteTemplate extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @Column
  description: string;

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
  defaultTerms: string;

  @Column({
    type: DataType.JSON
  })
  defaultTravelDetails: {
    origin?: string;
    destination?: string;
    dates?: string;
    duration?: string;
  };

  @Default(false)
  @Column
  isPublic: boolean;

  @ForeignKey(() => User)
  @Column
  createdById: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User)
  createdBy: User;
}

export default QuoteTemplate;
