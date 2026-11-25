import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum FoodCategory {
  main = 'main',
  pizza = 'pizza',
  burgers = 'burgers',
  drinks = 'drinks',
}

@Table({ tableName: 'foods' })
export class FoodModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @Column({
    type: DataType.ENUM('main', 'pizza', 'burgers', 'drinks'),
    allowNull: false,
  })
  public category!: FoodCategory;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public price!: number;
}
