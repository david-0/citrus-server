import {BelongsToMany, Column, HasMany, Model, Table, Unique} from "sequelize-typescript";
import {Address} from "./Address";
import {ArticleCheckIn} from "./ArticleCheckIn";
import {ArticleCheckOut} from "./ArticleCheckOut";
import {CustomerOrder} from "./CustomerOrder";
import {Role} from "./Role";
import {UserRole} from "./UserRole";

@Table
export class User extends Model<User> {
  @Unique
  @Column
  public number: number;

  @Unique
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
  public customerOrders: CustomerOrder[];

  @HasMany(() => ArticleCheckIn)
  public articleCheckIns: ArticleCheckIn[];

  @HasMany(() => ArticleCheckOut)
  public articleCheckOuts: ArticleCheckOut[];

  @HasMany(() => Address)
  public addresses: Address[];
}
