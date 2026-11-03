import { Column, DataType, Model, Table } from 'sequelize-typescript';

enum UserRole {
  user = 'user',
  admin = 'admin',
}


@Table({ tableName: 'users' })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({ type: DataType.ENUM, values: Object.values(UserRole), allowNull: false, defaultValue: UserRole.user })
  public role: UserRole;

  @Column({ type: DataType.STRING, allowNull: true })
  public address: string | null;
}
