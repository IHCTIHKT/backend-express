import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'orders' })
export class OrderModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public product: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public quantity: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  public price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public status: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  public createdAt: Date;
}