import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "directories",
  timestamps: false,
})
class Directory extends Model<Directory> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;
}

export default Directory;
