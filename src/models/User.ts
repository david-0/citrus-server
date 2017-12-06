import {IAddress, ICustomerOrder, IUser} from "citrus-common";
import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {Address} from "./Address";
import {CustomerOrder} from "./CustomerOrder";
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
  public phone: string;

  @Column
  public mobile: string;

  @HasMany(() => CustomerOrder)
  public customerOrders: ICustomerOrder[];

  @HasMany(() => Address)
  public addresses: IAddress[];
}
