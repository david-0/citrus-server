import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {IOrder} from "../entities/IOrder";
import {IUser} from "../entities/IUser";
import {Order} from "./Order";
import {Role} from "./Role";
import {UserRole} from "./UserRole";

@Table
export class User extends Model<User> implements IUser {
  @Column
  public email: string;

  @Column
  public password: string;

  @BelongsToMany(() => Role, () => UserRole)
  public roles: Role[];

  @Column
  public name: string;

  @Column
  public prename: string;

  @Column
  public telNumber: string;

  @Column
  public mobileNumber: string;

  @HasMany(() => Order)
  public orders: IOrder[];
}
