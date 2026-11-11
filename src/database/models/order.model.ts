import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum OrderStatus {
  cooking = 'cooking',
  cancelled = 'cancelled',
  delivering = 'delivering',
  ready_to_pickup = 'ready_to_pickup',
  done = 'done',
}

export enum OrderType {
  delivery = 'delivery',
  pickup = 'pickup',
}

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
    type: DataType.DECIMAL,
    allowNull: false,
  })
  public quantity: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  public price: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  public status: OrderStatus;

  @Column({
    type: DataType.ENUM(...Object.values(OrderType)),
    allowNull: false,
  })
  public type: OrderType;
}
